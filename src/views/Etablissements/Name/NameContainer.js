import React, { Component } from 'react';
import {
  Button, ButtonGroup, ButtonDropdown, Collapse, DropdownToggle, DropdownMenu,
  DropdownItem, Row, Col, Card, CardHeader, CardBody, Tooltip,
} from 'reactstrap';
import PropTypes from 'prop-types';

import Name from './Name';
import NameModal from './NameModal';


class NameContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      names: {},
      collapse: false,
      displayNameDropdown: false,
      editModal: false,
      addModal: false,
      tooltip: false,
      isLoading: false,
    };
    this.displayArchivedNames = this.displayArchivedNames.bind(this);
    this.getNames = this.getNames.bind(this);
    this.displayNameDropdown = this.displayNameDropdown.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleToolTip = this.toggleToolTip.bind(this);
  }

  componentWillMount() {
    this.getNames();
  }


  getNames() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/institution_names`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          names: data,
          isLoading: false,
        });
      });
  }

  getCurrentName() {
    return this.state.names.filter(name => name.status === 'active');
  }

  getArchivedNames() {
    return this.state.names.filter(name => name.status === 'archived');
  }

  toggleEditModal() {
    this.setState({
      editModal: !this.state.editModal,
    });
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    });
  }

  toggleToolTip() {
    this.setState({
      tooltip: !this.state.tooltip,
    });
  }

  displayNameDropdown() {
    this.setState({
      displayNameDropdown: !this.state.displayNameDropdown,
    });
  }

  displayArchivedNames() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  renderArchivedNames() {
    return this.getArchivedNames().map(name =>
      (
        <tr>
          <td key={name.id}>
            <Name
              date_start={name.date_start}
              date_end={name.date_end}
              id={name.id}
              initials={name.initials}
              getNames={this.getNames}
              status={name.status}
              text={name.text}
            />
          </td>
        </tr>
      ));
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    const currentName = this.getCurrentName()[0];
    return (
      <Row>
        <Col md="12">
          <Card className="mb-0">
            <CardHeader>
              Nom de l&#39;établissement
              <ButtonGroup className="float-right">
                <ButtonDropdown
                  id="nameDropdown"
                  isOpen={this.state.displayNameDropdown}
                  toggle={this.displayNameDropdown}
                >
                  <DropdownToggle caret className="p-0" color="light">
                    <i className="icon-settings" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={this.toggleEditModal}>
                      <i className="icon-pencil" />
                      Modifier le nom actuel
                      {this.state.editModal ?
                        (<NameModal
                          date_start={currentName.date_start}
                          date_end={currentName.date_end}
                          id={currentName.id}
                          initials={currentName.initials}
                          getNames={this.getNames}
                          toggleModal={this.toggleEditModal}
                          text={currentName.text}
                        />) : <div /> }
                    </DropdownItem>
                    <DropdownItem onClick={this.toggleAddModal}>
                      <i className="icon-plus" />
                      Ajouter un nouveau nom
                      {this.state.addModal ?
                        (<NameModal
                          getNames={this.getNames}
                          toggleModal={this.toggleAddModal}
                        />) : <div /> }
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ButtonGroup>
            </CardHeader>
            <CardBody>
              <Name
                date_start={currentName.date_start}
                date_end={currentName.date_end}
                id={currentName.id}
                initials={currentName.initials}
                getNames={this.getNames}
                status={currentName.status}
                text={currentName.text}
              />
              {this.getArchivedNames().length > 0 ?
                <span>
                  <Button
                    outline
                    id="voir-plus"
                    className="float-right"
                    color="secondary"
                    size="sm"
                    onClick={this.displayArchivedNames}
                  >
                    <i className="icon-eye" />
                  </Button>
                  <Tooltip
                    placement="bottom"
                    isOpen={this.state.tooltip}
                    target="voir-plus"
                    toggle={this.toggleToolTip}
                  >
                    {this.state.collapse ? 'voir moins' : 'voir plus'}
                  </Tooltip>
                </span> : <span />}
            </CardBody>
          </Card>
          <Collapse
            isOpen={this.state.collapse}
          >
            <Card className="mb-0">
              <CardBody className="p-0">
                <table className="table">
                  <tbody>
                    {this.renderArchivedNames()}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Collapse>
        </Col>
      </Row>
    );
  }
}

NameContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default NameContainer;
