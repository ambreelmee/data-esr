import React, { Component } from 'react';
import {
  Card, CardBody, CardHeader, Button, Tooltip, Modal, DropdownToggle,
  ModalHeader, ModalBody, ModalFooter, ButtonGroup, ButtonDropdown,
  DropdownMenu, DropdownItem, Col,
} from 'reactstrap';
import PropTypes from 'prop-types';

import CodeAddModal from './CodeAddModal';
import CodeEditModal from './CodeEditModal';

class Code extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      deleteModal: false,
      displaySettingDropdown: false,
      editModal: false,
      isDeleting: false,
    };
    this.displaySettingDropdown = this.displaySettingDropdown.bind(this);
    this.deleteCode = this.deleteCode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
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
        <Card className={`text-white bg-${this.props.addons ? this.props.addons.color : 'primary'} text-center`}>
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
                        Voir l historique
                    </DropdownItem>
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
          <CardBody>
            <h4 className="mb-0">
              <a href={this.props.addons ? this.props.addons.link : '#'} className="text-light">
                {this.props.content}
              </a>
            </h4>
            {this.props.date_start ? <div>depuis le {this.props.date_start}<br /></div> : <div />}
            {this.props.date_end ? `jusqu'au ${this.props.date_end}` : ''}
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
  id: PropTypes.number.isRequired,
  getCodes: PropTypes.func,
};

Code.defaultProps = {
  addons: null,
  date_end: null,
  date_start: null,
  getCodes: null,
};

export default Code;
