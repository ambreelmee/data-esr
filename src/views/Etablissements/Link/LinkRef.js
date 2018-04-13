import React, { Component } from 'react';
import {
  InputGroup, InputGroupAddon, Input, InputGroupText, Button, Tooltip, Modal,
  ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';


class LinkRef extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cancelTooltip: false,
      categoryTooltip: false,
      content: this.props.content,
      deleteTooltip: false,
      displayEditButton: false,
      editTooltip: false,
      isDeleting: false,
      isEditing: false,
      modal: false,
    };
    this.cancelEdition = this.cancelEdition.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
    this.onChange = this.onChange.bind(this);
    this.modifyCurrentLink = this.modifyCurrentLink.bind(this);
    this.toggleCategoryToolTip = this.toggleCategoryToolTip.bind(this);
    this.toggleCancelToolTip = this.toggleCancelToolTip.bind(this);
    this.toggleDeleteToolTip = this.toggleDeleteToolTip.bind(this);
    this.toggleEditToolTip = this.toggleEditToolTip.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  onChange(event) {
    this.setState({
      displayEditButton: true,
      [event.target.id]: event.target.value,
    });
  }


  deleteLink() {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}/links/${this.props.id}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ link: { id: this.props.id } }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isDeleting: false,
        });
        this.props.getLinks();
      });
  }

  modifyCurrentLink() {
    this.setState({ isEditing: true });
    const modifiedLink = {
      category_link_id: this.props.categoryId,
      content: this.state.content,
    };
    fetch(
      `${process.env.API_URL_STAGING}/links/${this.props.id}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify({ link: modifiedLink }),
      },
    )
      .then(res => res.json())
      .then((data) => {
        this.setState({
          isEditing: false,
          content: data.content,
          displayEditButton: false,
          editTooltip: false,
        });
      });
  }

  cancelEdition() {
    this.setState({
      displayEditButton: false,
      content: this.props.content,
    });
  }

  toggleDeleteToolTip() {
    this.setState({
      deleteTooltip: !this.state.deleteTooltip,
    });
  }

  toggleEditToolTip() {
    this.setState({
      editTooltip: !this.state.editTooltip,
    });
  }

  toggleCancelToolTip() {
    this.setState({
      cancelTooltip: !this.state.cancelTooltip,
    });
  }

  toggleCategoryToolTip() {
    this.setState({
      categoryTooltip: !this.state.categoryTooltip,
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText id={`category-${this.props.categoryId}-${this.props.id}`}>
            <a
              href={this.props.content.substring(0, 4) === 'http' ? this.props.content : `//${this.props.content}`}
              target="blank"
            >
              <i className={this.props.className || 'fa fa-at'} />
            </a>
          </InputGroupText>
          <Tooltip
            isOpen={this.state.categoryTooltip}
            target={`category-${this.props.categoryId}-${this.props.id}`}
            toggle={this.toggleCategoryToolTip}
          >
            {this.props.category}
          </Tooltip>
        </InputGroupAddon>
        <Input
          id="content"
          type="text"
          value={this.state.content}
          onChange={this.onChange}
          placeholder={this.state.content}
        />
        {this.state.displayEditButton ?
          <InputGroupAddon addonType="append">
            <Button
              id={`edit-button-${this.props.id}`}
              color="transparent"
              size="sm"
              disabled={this.state.isEditing}
              onClick={this.modifyCurrentLink}
            >
              {this.state.isEditing ?
                <i className="fa fa-spinner text-success fa-spin " /> :
                <i className="fa fa-check text-success" />}
            </Button>
            <Tooltip
              isOpen={this.state.editTooltip}
              target={`edit-button-${this.props.id}`}
              toggle={this.toggleEditToolTip}
            >
              Sauvegarder les changements
            </Tooltip>
            <Button
              id={`cancel-button-${this.props.id}`}
              color="transparent"
              size="sm"
              onClick={this.cancelEdition}
            >
              <i className="fa fa-close text-dark" />
            </Button>
            <Tooltip
              isOpen={this.state.cancelTooltip}
              target={`cancel-button-${this.props.id}`}
              toggle={this.toggleCancelToolTip}
            >
              Annuler les changements
            </Tooltip>
          </InputGroupAddon> : <div />}
        <Button
          id={`delete-button-${this.props.id}`}
          color="danger"
          outline
          size="sm"
          onClick={this.toggleModal}
        >
          <i className="fa fa-close" />
        </Button>
        <Tooltip
          isOpen={this.state.deleteTooltip}
          target={`delete-button-${this.props.id}`}
          toggle={this.toggleDeleteToolTip}
        >
          Supprimer le lien
        </Tooltip>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} color="danger">
          <ModalHeader toggle={this.toggleModal}>
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
              onClick={!this.state.isDeleting ? this.deleteLink : null}
            >
              {this.state.isDeleting ?
                <div>
                  <i className="fa fa-spinner fa-spin " />
                  <span className="mx-1"> Suppression </span>
                </div> : <div />}
              Supprimer
            </Button>
            <Button color="secondary" onClick={this.toggleModal}>Annuler</Button>
          </ModalFooter>
        </Modal>
      </InputGroup>
    );
  }
}

LinkRef.propTypes = {
  content: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  className: PropTypes.string,
  id: PropTypes.number.isRequired,
  getLinks: PropTypes.func,
};

LinkRef.defaultProps = {
  className: null,
  getLinks: null,
};

export default LinkRef;
