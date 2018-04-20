import React, { Component } from 'react';
import {
  Badge, Button, ButtonDropdown, ButtonGroup, Card, CardBody, CardHeader, Col, DropdownToggle,
  DropdownItem, DropdownMenu, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

import CodeAddModal from './CodeAddModal';
import CodeEditModal from './CodeEditModal';
import CodeHistoryModal from './CodeHistoryModal';

class Code extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      deleteModal: false,
      displaySettingDropdown: false,
      editModal: false,
      historyModal: false,
      isDeleting: false,
    };
    this.displaySettingDropdown = this.displaySettingDropdown.bind(this);
    this.deleteCode = this.deleteCode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
  }

  onChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }


  deleteCode() {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}/codes/${this.props.id}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ code: { id: this.props.id } }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isDeleting: false,
        });
        this.props.getCodes();
      });
  }

  toggleHistoryModal() {
    this.setState({
      historyModal: !this.state.historyModal,
    });
  }

  toggleDeleteModal() {
    this.setState({
      deleteModal: !this.state.deleteModal,
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

  displaySettingDropdown() {
    this.setState({
      displaySettingDropdown: !this.state.displaySettingDropdown,
    });
  }


  render() {
    return (
      <Col md="6" xs="12">
        <Card className="text-white bg-info text-center">
          <CardHeader className="pb-0">
            <h5 className="mb-0">
              {this.props.category.toUpperCase()}
              <ButtonGroup className="float-right">
                <ButtonDropdown
                  id="codeDropdown"
                  isOpen={this.state.displaySettingDropdown}
                  toggle={this.displaySettingDropdown}
                >
                  <DropdownToggle caret className="p-0" color="transparent">
                    <i className="icon-settings" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={this.toggleEditModal}>
                      <i className="fa fa-pencil text-warning" />
                        Modifier le code {this.props.category.toLowerCase()} actuel
                    </DropdownItem>
                    {this.state.editModal ?
                      <CodeEditModal
                        category={this.props.category}
                        categoryId={this.props.categoryId}
                        content={this.props.content}
                        date_end={this.props.date_end}
                        date_start={this.props.date_start}
                        id={this.props.id}
                        getCodes={this.props.getCodes}
                        status={this.props.status}
                        toggleModal={this.toggleEditModal}
                      /> : <div />
                    }
                    <DropdownItem onClick={this.toggleAddModal}>
                      <i className="fa fa-plus text-success" />
                        Ajouter un nouveau code {this.props.category.toLowerCase()}
                    </DropdownItem>
                    {this.state.addModal ?
                      <CodeAddModal
                        category={this.props.category}
                        categoryId={this.props.categoryId}
                        etablissement_id={this.props.etablissement_id}
                        getCodes={this.props.getCodes}
                        toggleModal={this.toggleAddModal}
                      /> : <div />
                    }
                    <DropdownItem onClick={this.toggleHistoryModal}>
                      <i className="fa fa-eye text-info" />
                        Voir l&#39;historique
                    </DropdownItem>
                    {this.state.historyModal ?
                      <CodeHistoryModal
                        category={this.props.category}
                        categoryId={this.props.categoryId}
                        deleteCode={this.deleteCode}
                        getCodes={this.props.getCodes}
                        history={this.props.history}
                        toggleModal={this.toggleHistoryModal}
                      /> : <div />}
                    <DropdownItem onClick={this.toggleDeleteModal}>
                      <i className="fa fa-close text-danger" />
                        Supprimer le code {this.props.category.toLowerCase()}
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
                            onClick={!this.state.isDeleting ? this.deleteCode : null}
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
            </h5>
          </CardHeader>
          <CardBody className="pt-0 px-0">
            {this.props.status ?
              <Badge color="success" className="float-right mt-1 mr-1">Actif</Badge> :
              <Badge color="danger" className="float-right mt-1 mr-1">Archivé</Badge>}
            <h4 className="mb-0 mt-4 mx-2">
              {this.props.addons && this.props.addons.link ?
                <a href={`${this.props.addons.link}/${this.props.content}`} className="text-light" target="blank">
                  {this.props.content}
                </a> : <div>{this.props.content}</div>}
            </h4>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

Code.propTypes = {
  addons: PropTypes.object,
  content: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  date_end: PropTypes.string,
  date_start: PropTypes.string,
  etablissement_id: PropTypes.number.isRequired,
  getCodes: PropTypes.func,
  history: PropTypes.array,
  id: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
};

Code.defaultProps = {
  addons: null,
  date_end: null,
  date_start: null,
  getCodes: null,
  history: [],
};

export default Code;
