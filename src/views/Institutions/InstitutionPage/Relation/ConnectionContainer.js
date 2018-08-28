import React, { Component } from 'react';
import {
  Button, ButtonGroup, ButtonDropdown, Card, CardBody, CardHeader, Col, DropdownItem,
  DropdownMenu, DropdownToggle, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import RelationAddModal from './RelationAddModal';
import RelationCategoryContainer from './RelationCategoryContainer';
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
          connectionsModal: false,
          addModal: false,
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
      <RelationCategoryContainer
        key={category}
        category={category}
        relationDown={connection.daughters}
        relationUp={connection.mothers}
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
                  <RelationAddModal
                    institutionId={this.props.etablissement_id}
                    categories={this.state.connectionCategories}
                    getRelations={this.getConnections}
                    toggleModal={this.toggleAddModal}
                    type="connection"
                  /> : <div />}
                <DropdownItem onClick={this.toggleConnectionsModal}>
                  <i className="fa fa-eye text-info" />
                    Voir le détail des rattachements
                </DropdownItem>
                {this.state.connectionsModal ?
                  <ConnectionsModal
                    daughters={this.state.daughters}
                    id={this.props.etablissement_id}
                    getRelations={this.getConnections}
                    mothers={this.state.mothers}
                    toggleModal={this.toggleConnectionsModal}
                  /> : <div />}
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
        </CardHeader>
        {this.props.mothers.length > 0 || this.props.daughters.length > 0 ?
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
            <h4>0 rattachement...</em>
            <Button color="primary" size="sm" className="float-right rounded" onClick={this.toggleAddModal}>
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
  daughters: PropTypes.array.isRequired,
  mothers: PropTypes.array.isRequired,
};

export default ConnectionContainer;
