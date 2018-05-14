import React, { Component } from 'react';
import {
  Badge, Button, ButtonGroup, ButtonDropdown, Card, CardBody, CardHeader,
  DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';

import { getActiveEntity } from './../methods';
import NameModal from './NameModal';
import NameHistoryModal from './NameHistoryModal';


class NameContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      deleteModal: false,
      displayDropdown: false,
      editModal: false,
      historyModal: false,
      isLoading: false,
      isDeleting: false,
      names: [],
    };
    this.deleteName = this.deleteName.bind(this);
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getNames = this.getNames.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
  }

  componentWillMount() {
    this.getNames(this.props.etablissement_id);
  }

  componentWillReceiveProps(nextProps) {
    this.getNames(nextProps.etablissement_id);
  }


  getNames(etablissementId) {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${etablissementId}/institution_names`, {
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

  deleteName(nameId, etablissementId) {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}institution_names/${nameId}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ name: { id: nameId } }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isDeleting: false,
          deleteModal: false,
        });
        this.getNames(etablissementId);
      });
  }

  toggleDeleteModal() {
    this.setState({
      deleteModal: !this.state.deleteModal,
    });
  }

  toggleHistoryModal() {
    this.setState({
      historyModal: !this.state.historyModal,
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

  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    const replacementName = this.state.names ? this.state.names[0] : null;
    const displayedName = getActiveEntity(this.state.names) ? getActiveEntity(this.state.names) : replacementName;
    return (
      <Card className="mb-0 mt-2 w-100">
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
                <DropdownItem onClick={this.toggleEditModal}>
                  <i className="fa fa-pencil text-warning" />
                    Modifier le nom actuel
                </DropdownItem>
                {this.state.editModal ?
                  (<NameModal
                    date_start={displayedName.date_start}
                    date_end={displayedName.date_end}
                    id={displayedName.id}
                    initials={displayedName.initials}
                    etablissement_id={this.props.etablissement_id}
                    getNames={this.getNames}
                    toggleModal={this.toggleEditModal}
                    text={displayedName.text}
                    status={displayedName.status}
                  />) : <div /> }
                <DropdownItem onClick={this.toggleAddModal}>
                  <i className="fa fa-plus text-success" />
                    Ajouter un nouveau nom
                </DropdownItem>
                {this.state.addModal ?
                  (<NameModal
                    etablissement_id={this.props.etablissement_id}
                    getNames={this.getNames}
                    toggleModal={this.toggleAddModal}
                  />) : <div /> }
                <DropdownItem onClick={this.toggleHistoryModal}>
                  <i className="fa fa-eye text-info" />
                    Voir l&#39;historique
                </DropdownItem>
                {this.state.historyModal ?
                  <NameHistoryModal
                    deleteName={this.deleteName}
                    etablissement_id={this.props.etablissement_id}
                    getNames={this.getNames}
                    history={this.state.names}
                    toggleModal={this.toggleHistoryModal}
                  /> : <div />}
                <DropdownItem onClick={this.toggleDeleteModal}>
                  <i className="fa fa-close text-danger" />
                    Supprimer le nom actuel
                  <Modal isOpen={this.state.deleteModal} toggle={this.toggleDeleteModal} color="danger">
                    <ModalHeader toggle={this.toggleDeleteModal}>
                      Suppression du champ
                    </ModalHeader>
                    <ModalBody>
                      Etes-vous sûr de vouloir supprimer ce champ ?
                    </ModalBody>
                    <ModalFooter>
                      <p className="mt-2 text-danger">{this.state.errorMessage}</p>
                      <Button
                        className="m-1 float-right"
                        color="danger"
                        disabled={this.state.isDeleting}
                        onClick={!this.state.isDeleting ? () => this.deleteName(displayedName.id, this.props.etablissement_id) : null}
                      >
                        {this.state.isDeleting ?
                          <div>
                            <i className="fa fa-spinner fa-spin " />
                            <span className="mx-1"> Suppression </span>
                          </div> : <div />}
                        Supprimer
                      </Button>
                      <Button color="secondary" onClick={this.toggleDeleteModal}>Annuler</Button>
                    </ModalFooter>
                  </Modal>
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
        </CardHeader>
        {displayedName ?
          <CardBody>
            {displayedName.status === 'active' ?
              <Badge color="success" className="float-right"> Actif </Badge> :
              <Badge color="danger" className="float-right"> Archivé </Badge>}
            <h2 className="text-center">{`${displayedName.initials} - ${displayedName.text}`}</h2>
          </CardBody> :
          <CardBody>
            <em>Aucun nom enregistrée actuellement...<br /></em>
            <Button color="primary" className="float-right" onClick={this.toggleAddModal}>
              <i className="fa fa-plus mr-1" />
              Ajouter un nom
            </Button>
            {this.state.addModal ?
              (<NameModal
                etablissement_id={this.props.etablissement_id}
                getNames={this.getNames}
                toggleModal={this.toggleAddModal}
              />) : <div /> }
          </CardBody>}
      </Card>
    );
  }
}

NameContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default NameContainer;
