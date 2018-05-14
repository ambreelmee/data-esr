import React, { Component } from 'react';
import {
  Button, ButtonGroup, ButtonDropdown, Card, CardBody, CardHeader, Col, DropdownItem,
  DropdownMenu, DropdownToggle, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import AddModal from './../AddModal';
import ConnectionCategoryContainer from './ConnectionCategoryContainer';
import ConnectionsModal from './ConnectionsModal';

class ConnectionContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      connectionCategories: [],
      connectionsModal: false,
      daughters: [],
      displayDropdown: false,
      isLoading: false,
      mothers: [],
    };
    this.addConnection = this.addConnection.bind(this);
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getConnections = this.getConnections.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleConnectionsModal = this.toggleConnectionsModal.bind(this);
  }

  componentWillMount() {
    this.getConnectionCategories();
    this.getConnections(this.props.etablissement_id, 'mothers');
    this.getConnections(this.props.etablissement_id, 'daughters');
  }

  componentWillReceiveProps(nextProps) {
    this.getConnections(nextProps.etablissement_id, 'mothers');
    this.getConnections(nextProps.etablissement_id, 'daughters');
  }


  getConnectionCategories() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institution_connection_categories`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          connectionCategories: data,
          isLoading: false,
        });
      });
  }

  getConnections(etablissementId, connectionType) {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${etablissementId}/${connectionType}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          [connectionType]: data.connections,
          isLoading: false,
        });
      });
  }

  getConnectionsByCategory() {
    const connectionsByCategory = {};
    this.state.mothers.map((mother) => {
      if (!connectionsByCategory[mother.connection.category]) {
        connectionsByCategory[mother.connection.category] = { mothers: [], daughters: [] };
      }
      connectionsByCategory[mother.connection.category].mothers.push(mother.mother);
    });
    this.state.daughters.map((daughter) => {
      if (!connectionsByCategory[daughter.connection.category]) {
        connectionsByCategory[daughter.connection.category] = { mothers: [], daughters: [] };
      }
      connectionsByCategory[daughter.connection.category].daughters.push(daughter.daughter);
    });
    return connectionsByCategory;
  }

  addConnection(etablissementId, evolutionCategoryId, date, evolutionType) {
    this.setState({ isLoading: true });
    const newConnection = {};
    newConnection[`${evolutionType.slice(0, -1)}`] = {
      [`${evolutionType.slice(0, -1)}_id`]: etablissementId,
      institution_connection_category_id: evolutionCategoryId,
      date,
    };
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/${evolutionType}`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify(newConnection),
      },
    )
      .then((res) => {
        if (res.ok) {
          res.json().then(() => {
            this.setState({
              errorMessage: '',
              isLoading: false,
            });
            this.toggleAddModal();
            this.getConnections(this.props.etablissement_id, evolutionType);
          });
        } else {
          this.setState({
            errorMessage: 'Erreur, merci de vérifier le formulaire',
            isLoading: false,
          });
        }
      });
  }

  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    });
  }

  toggleConnectionsModal() {
    this.setState({
      connectionsModal: !this.state.connectionsModal,
    });
  }

  renderCategories() {
    const connectionsByCategory = this.getConnectionsByCategory();
    return map(connectionsByCategory, (connection, category) => (
      <ConnectionCategoryContainer
        key={category}
        category={category}
        daughters={connection.daughters}
        mothers={connection.mothers}
      />
    ));
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    return (
      <Card className="mb-0 mt-2">
        <CardHeader>
          Rattachements
          <ButtonGroup className="float-right">
            <ButtonDropdown
              id="nameDropdown"
              isOpen={this.state.displayDropdown}
              toggle={this.displayDropdown}
            >
              <DropdownToggle caret className="p-0" color="light">
                <i className="icon-settings" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.toggleAddModal}>
                  <i className="fa fa-plus text-success" />
                    Ajouter un nouveau rattachement
                </DropdownItem>
                {this.state.addModal ?
                  <AddModal
                    etablissement_id={this.props.etablissement_id}
                    categories={this.state.connectionCategories}
                    addMethod={this.addConnection}
                    toggleModal={this.toggleAddModal}
                    type="rattachement"
                  /> : <div />}
                <DropdownItem onClick={this.toggleConnectionsModal}>
                  <i className="fa fa-eye text-info" />
                    Voir le détail des rattachements
                </DropdownItem>
                {this.state.connectionsModal ?
                  <ConnectionsModal
                    daughters={this.state.daughters}
                    id={this.props.etablissement_id}
                    getConnections={this.getConnections}
                    mothers={this.state.mothers}
                    toggleModal={this.toggleConnectionsModal}
                  /> : <div />}
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
        </CardHeader>
        {this.state.mothers.length > 0 || this.state.daughters.length > 0 ?
          <CardBody className="py-0">
            <Row>
              <Col xs="3" className="mx-auto" />
              <Col xs="4" className="mx-auto">
                <strong>Mère</strong>
              </Col>
              <Col xs="4" className="mx-auto">
                <strong>Fille</strong>
              </Col>
            </Row>
            {this.renderCategories()}
          </CardBody> :
          <CardBody>
            <em>Aucun rattachement enregistré actuellement...</em>
            <Button color="primary" className="float-right" onClick={this.toggleAddModal}>
              <i className="fa fa-plus mr-1" />
              Ajouter un rattachement
            </Button>
          </CardBody>}
      </Card>
    );
  }
}

ConnectionContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default ConnectionContainer;
