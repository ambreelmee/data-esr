import React, { Component } from 'react';
import btoa from 'btoa';

import { Button, Card, CardBody, CardFooter, CardHeader, Col, Row, Table } from 'reactstrap';
import Item from './Item';
import InstitutionModal from './ModalInstitution';

class InstitutionsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      institutions: [],
      isLoading: false,
      modal: false,
    };
    this.getInstitution = this.getInstitution.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    this.getInstitution();
  }

  getInstitution() {
    fetch(`${process.env.PROXY_URL + process.env.API_URL}institutions`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Basic ${btoa(`${localStorage.getItem('token')}:`)}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          institutions: data.institutions,
          isLoading: false,
        });
      });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    const { institutions, isLoading } = this.state;

    if (isLoading) {
      return <p />;
    }
    if (institutions.length === 0) {
      return <p>Aucune entrée en base </p>;
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" /> Etablissements existants
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>Id_esr</th>
                      <th>Nom</th>
                      <th>Date d&#39;ouverture</th>
                      <th>Date de fermeture</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{institutions.map(institution => (
                    <Item
                      key={`${institution.id}-${institution.name}`}
                      id={institution.id}
                      id_esr={institution.id_esr}
                      name={institution.name}
                      date_start={institution.date_start}
                      date_end={institution.date_end}
                      get_institution={this.getInstitution}
                    />))}
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter className="d-flex justify-content-end">
                <Button outline color="primary" onClick={this.toggleModal}>
                  Ajouter un nouvel établissement
                </Button>
                {this.state.modal ?
                  (<InstitutionModal
                    get_institution={this.getInstitution}
                  />) : <div /> }
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default InstitutionsContainer;
