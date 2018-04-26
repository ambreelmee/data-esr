import React, { Component } from 'react';
import {
  Button, Card, CardBody, Col, Form, FormGroup,
  Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';


class EtablissementStatusModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date_end: this.props.date_end,
      date_start: this.props.date_start,
      errorMessage: '',
      modal: true,
    };
    this.updateInstitution = this.updateInstitution.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
      errorMessage: '',
    });
  }

  updateInstitution() {
    const updatedInstitution = {
      date_start: this.state.date_start,
      date_end: this.state.date_end,
    };
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify({ institution: updatedInstitution }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data === 'Record not found') {
          this.setState({
            errorMessage: 'Formulaire est vide ou incomplet',
          });
        } else {
          this.toggle();
          this.props.getData();
        }
      });
  }

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Modifier le statut de l&#39;établissement
        </ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <Form className="form-horizontal">
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Date de début d&#39;activité</Label>
                      <Input
                        type="date"
                        id="date_start"
                        value={this.state.date_start ? this.state.date_start : ''}
                        placeholder={this.state.date_start ? this.state.date_start : ''}
                        onChange={this.onChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Date de fin d&#39;activité</Label>
                      <Input
                        type="date"
                        id="date_end"
                        value={this.state.date_end ? this.state.date_end : ''}
                        placeholder={this.state.date_end ? this.state.date_end : ''}
                        onChange={this.onChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
              <p>Vous pouvez ajouter un prédécesseur ou un succésseur à cet établissement via la carte évolution</p>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">{this.state.errorMessage}</p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.state.isLoading}
            onClick={!this.state.isLoading ? this.updateInstitution : null}
          >
            {this.state.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Modification </span>
              </div> :
              <div>
              Modifier
              </div>}
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

EtablissementStatusModal.propTypes = {
  id: PropTypes.number.isRequired,
  date_start: PropTypes.string.isRequired,
  date_end: PropTypes.string,
  getData: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

EtablissementStatusModal.defaultProps = {
  date_end: null,
};

export default EtablissementStatusModal;
