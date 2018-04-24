import React, { Component } from 'react';
import {
  Button, ButtonGroup, ButtonDropdown, Card, CardBody, CardHeader, Col, DropdownItem,
  DropdownMenu, DropdownToggle, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import AddressHistoryModal from './../Address/AddressHistoryModal';
import AddressModal from './../Address/AddressModal';

import ConnectionCategoryContainer from './ConnectionCategoryContainer';

class ConnectionContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      connectionsModal: false,
      daughters: [],
      displayDropdown: false,
      isLoading: false,
      mothers: [],
    };
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getConnections = this.getConnections.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleConnectionsModal = this.toggleConnectionsModal.bind(this);
  }

  componentWillMount() {
    this.getConnections(this.props.etablissement_id, 'mothers');
    this.getConnections(this.props.etablissement_id, 'daughters');
  }

  componentWillReceiveProps(nextProps) {
    this.getConnections(nextProps.etablissement_id, 'mothers');
    this.getConnections(nextProps.etablissement_id, 'daughters');
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
        category={category}
        daughters={connection.daughters}
        mothers={connection.mothers}
      />
    ));
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <Card>
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
                  (<AddressModal
                    etablissement_id={this.props.etablissement_id}
                    getConnections={this.getConnections}
                    toggleModal={this.toggleAddModal}
                  />) : <div /> }
                <DropdownItem onClick={this.toggleConnectionsModal}>
                  <i className="fa fa-eye text-info" />
                    Voir le détail des rattachements
                </DropdownItem>
                {this.state.connectionsModal ?
                  <AddressHistoryModal
                    deleteAddress={this.deleteAddress}
                    etablissement_id={this.props.etablissement_id}
                    getConnections={this.getConnections}
                    history={this.state.addresses}
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
