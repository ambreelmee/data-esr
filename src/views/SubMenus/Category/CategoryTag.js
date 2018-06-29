import React, { Component } from 'react';
import {
  Button, Col, Collapse, Input, InputGroup, InputGroupAddon, Modal, ModalBody,
  ModalHeader, ModalFooter, Tooltip,
} from 'reactstrap';
import PropTypes from 'prop-types';
import CategoryTagDragnDrop from './CategoryTagDragnDrop';
import TagModal from './TagModal';

class CategoryTag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addTag: false,
      cancelTooltip: false,
      collapse: false,
      deleteTooltip: false,
      displayEditButton: false,
      editTooltip: false,
      isDeleting: false,
      isEditing: false,
      title: this.props.title,
      modal: false,
      origin: this.props.origin,
      plusTooltip: false,
      showMoreTooltip: false,
    };
    this.cancelEdition = this.cancelEdition.bind(this);
    this.collapse = this.collapse.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.onChange = this.onChange.bind(this);
    this.modifyCurrentCategory = this.modifyCurrentCategory.bind(this);
    this.toggleAddTag = this.toggleAddTag.bind(this);
    this.toggleCancelToolTip = this.toggleCancelToolTip.bind(this);
    this.toggleDeleteToolTip = this.toggleDeleteToolTip.bind(this);
    this.toggleEditToolTip = this.toggleEditToolTip.bind(this);
    this.togglePlusTooltip = this.togglePlusTooltip.bind(this);
    this.toggleShowMoreToolTip = this.toggleShowMoreToolTip.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  onChange(event) {
    this.setState({
      displayEditButton: true,
      [event.target.id]: event.target.value,
    });
  }


  deleteCategory() {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}/institution_tag_categories/${this.props.id}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isDeleting: false,
        });
        this.props.getCategories('institution_tag_categories');
      });
  }

  modifyCurrentCategory() {
    this.setState({ isEditing: true });
    const institution_tag_category = {
      id: this.props.id,
      title: this.state.title,
      origin: this.state.origin,
    };
    fetch(
      `${process.env.API_URL_STAGING}/institution_tag_categories/${this.props.id}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify({ institution_tag_category }),
      },
    )
      .then(res => res.json())
      .then((data) => {
        this.setState({
          isEditing: false,
          displayEditButton: false,
          editTooltip: false,
          title: data.title,
          origin: data.origin,
        });
      });
  }

  cancelEdition() {
    this.setState({
      displayEditButton: false,
      title: this.props.title,
      origin: this.props.origin,
    });
  }

  toggleAddTag() {
    this.setState({
      addTag: !this.state.addTag,
    });
  }

  togglePlusTooltip() {
    this.setState({
      plusTooltip: !this.state.plusTooltip,
    });
  }

  toggleShowMoreToolTip() {
    this.setState({
      showMoreTooltip: !this.state.showMoreTooltip,
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

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  collapse() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  render() {
    return (
      <InputGroup className="mb-3">
        <Col xs="4" className="pr-0">
          <Input
            id="origin"
            type="text"
            value={this.state.origin}
            onChange={this.onChange}
            placeholder={this.state.origin}
          />
        </Col>
        <Col xs="8" className="pl-0">
          <InputGroup>
            <Input
              id="title"
              type="text"
              value={this.state.title}
              onChange={this.onChange}
              placeholder={this.state.title}
            />
            {this.state.displayEditButton ?
              <InputGroupAddon addonType="append">
                <Button
                  id={`labels-edit-button-${this.props.id}`}
                  color="transparent"
                  size="sm"
                  disabled={this.state.isEditing}
                  onClick={this.modifyCurrentCategory}
                >
                  {this.state.isEditing ?
                    <i className="fa fa-spinner text-success fa-spin " /> :
                    <i className="fa fa-check text-success" />}
                </Button>
                <Tooltip
                  isOpen={this.state.editTooltip}
                  target={`labels-edit-button-${this.props.id}`}
                  toggle={this.toggleEditToolTip}
                >
                  Modifier l&#39;intitulé de la catégorie
                </Tooltip>
                <Button
                  id={`labels-cancel-button-${this.props.id}`}
                  color="transparent"
                  size="sm"
                  onClick={this.cancelEdition}
                >
                  <i className="fa fa-close text-dark" />
                </Button>
                <Tooltip
                  isOpen={this.state.cancelTooltip}
                  target={`labels-cancel-button-${this.props.id}`}
                  toggle={this.toggleCancelToolTip}
                >
                  Annuler les changements
                </Tooltip>
              </InputGroupAddon> : <div />}
            <Button
              id={`labels-delete-button-${this.props.id}`}
              color="danger"
              outline
              size="sm"
              onClick={this.toggleModal}
            >
              <i className="fa fa-close" />
            </Button>
            <Tooltip
              isOpen={this.state.deleteTooltip}
              target={`labels-delete-button-${this.props.id}`}
              toggle={this.toggleDeleteToolTip}
            >
              Supprimer la catégorie
            </Tooltip>
            <Modal isOpen={this.state.modal} toggle={this.toggleModal} color="danger">
              <ModalHeader toggle={this.toggleModal}>
                Suppression du champ
              </ModalHeader>
              <ModalBody>
                <i className="fa fa-warning text-danger pr-1" />
                Attention! Toutes les données liées à la catégorie seront perdues.<br />
                Etes-vous sûr de vouloir supprimer ce champ ?
              </ModalBody>
              <ModalFooter>
                <p className="mt-2 text-danger">{this.state.errorMessage}</p>
                <Button
                  className="m-1 float-right"
                  color="danger"
                  disabled={this.state.isDeleting}
                  onClick={!this.state.isDeleting ? this.deleteCategory : null}
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
            <Button
              id={`labels-plus-button-${this.props.id}`}
              color="success"
              outline
              size="sm"
              onClick={this.toggleAddTag}
            >
              <i className="fa fa-plus" />
            </Button>
            <Tooltip
              isOpen={this.state.plusTooltip}
              target={`labels-plus-button-${this.props.id}`}
              toggle={this.togglePlusTooltip}
            >
              Ajouter un tag dans cette catégorie
            </Tooltip>
            {this.state.addTag ?
              <TagModal
                getCategories={this.props.getCategories}
                toggleModal={this.toggleAddTag}
                categoryId={this.props.id}
              /> : <div />
            }
            <Button
              id={`labels-more-button-${this.props.id}`}
              color="secondary"
              outline
              size="sm"
              onClick={this.collapse}
            >
              {this.state.collapse ?
                <i className="fa fa-chevron-up" /> :
                <i className="fa fa-chevron-down" />}
            </Button>
            <Tooltip
              isOpen={this.state.showMoreTooltip}
              target={`labels-more-button-${this.props.id}`}
              toggle={this.showMoreToolTip}
            >
              Voir plus
            </Tooltip>
          </InputGroup>
        </Col>
        {this.state.collapse ?
          <Collapse isOpen={this.state.collapse} className="ml-4">
            <CategoryTagDragnDrop
              tags={this.props.tags}
              getCategories={this.props.getCategories}
            />
          </Collapse> : <div />}
      </InputGroup>
    );
  }
}

CategoryTag.propTypes = {
  getCategories: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  origin: PropTypes.string,
  tags: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

CategoryTag.defaultProps = {
  origin: '',
}


export default CategoryTag;
