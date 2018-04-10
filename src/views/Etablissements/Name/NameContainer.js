import React, { Component } from 'react';
import {
  Button, ButtonGroup, ButtonDropdown, Collapse, DropdownToggle, DropdownMenu,
  DropdownItem, Card, CardHeader, CardBody, Tooltip,
} from 'reactstrap';
import PropTypes from 'prop-types';

import { getActiveEntity, getArchivedEntities } from './../methods';
import Name from './Name';
import NameModal from './NameModal';


class NameContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      names: {},
      collapse: false,
      displayDropdown: false,
      editModal: false,
      addModal: false,
      tooltip: false,
      isLoading: false,
    };
    this.displayArchivedEntities = this.displayArchivedEntities.bind(this);
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getNames = this.getNames.bind(this);
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

  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }

  displayArchivedEntities() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  renderArchivedNames() {
    return getArchivedEntities(this.state.names).map(name =>
      (
        <tr key={name.id}>
          <td key={name.id}>
            <Name
              date_start={name.date_start}
              date_end={name.date_end}
              id={name.id}
              initials={name.initials}
              etablissement_id={this.props.etablissement_id}
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
    const currentName = getActiveEntity(this.state.names);
    return (
      <div>
        <Card className="mb-0">
          <CardHeader>
            Nom de l&#39;établissement
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
                  {currentName ?
                    <DropdownItem onClick={this.toggleEditModal}>
                      <i className="icon-pencil" />
                      Modifier le nom actuel
                      {this.state.editModal ?
                        (<NameModal
                          date_start={currentName.date_start}
                          date_end={currentName.date_end}
                          id={currentName.id}
                          initials={currentName.initials}
                          etablissement_id={this.props.etablissement_id}
                          getNames={this.getNames}
                          toggleModal={this.toggleEditModal}
                          text={currentName.text}
                        />) : <div /> }
                    </DropdownItem> : <div />}
                  <DropdownItem onClick={this.toggleAddModal}>
                    <i className="icon-plus" />
                    Ajouter un nouveau nom
                    {this.state.addModal ?
                      (<NameModal
                        etablissement_id={this.props.etablissement_id}
                        getNames={this.getNames}
                        toggleModal={this.toggleAddModal}
                      />) : <div /> }
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </ButtonGroup>
          </CardHeader>
          {currentName ?
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
              {getArchivedEntities(this.state.names).length > 0 ?
                <span>
                  <Button
                    outline
                    id="voir-plus"
                    className="float-right"
                    color="secondary"
                    size="sm"
                    onClick={this.displayArchivedEntities}
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
            </CardBody> : <CardBody>Aucun nom enregistrée actuellement...</CardBody>}
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
      </div>
    );
  }
}

NameContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default NameContainer;
