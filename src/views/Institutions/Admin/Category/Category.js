import React, { Component } from 'react';
import { Button, Col, Collapse, Input, InputGroup, InputGroupAddon, Tooltip, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import Tag from './Tag';
import TagModal from './TagModal';

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addTag: false,
      cancelTooltip: false,
      collapse: false,
      deleteTooltip: false,
      displayEditButton: false,
      editTooltip: false,
      isEditing: false,
      title: this.props.title,
      origin: this.props.origin,
      addTagTooltip: false,
      collapseTooltip: false,
    };
    this.cancelEdition = this.cancelEdition.bind(this);
    this.collapse = this.collapse.bind(this);
    this.onChange = this.onChange.bind(this);
    this.modifyCurrentCategory = this.modifyCurrentCategory.bind(this);
    this.toggleAddTag = this.toggleAddTag.bind(this);
    this.toggleCancelToolTip = this.toggleCancelToolTip.bind(this);
    this.toggleDeleteTooltip = this.toggleDeleteTooltip.bind(this);
    this.toggleEditToolTip = this.toggleEditToolTip.bind(this);
    this.toggleAddTagTooltip = this.toggleAddTagTooltip.bind(this);
    this.toggleCollapseTooltip = this.toggleCollapseTooltip.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      displayEditButton: false,
      editTooltip: false,
      title: nextProps.title,
      origin: nextProps.origin,
    });
  }

  onChange(event) {
    this.setState({
      displayEditButton: true,
      [event.target.id]: event.target.value,
    });
  }

  modifyCurrentCategory() {
    const modifiedCategory = {};
    modifiedCategory[`${this.props.categoryType}_category`] = {
      id: this.props.id,
      title: this.state.title,
      origin: this.state.origin,
    };
    const url = `${process.env.API_URL_STAGING}/${this.props.categoryType}_categories/${this.props.id}`;
    this.props.addContent(url, JSON.stringify(modifiedCategory), 'PUT');
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

  toggleAddTagTooltip() {
    this.setState({
      addTagTooltip: !this.state.addTagTooltip,
    });
  }

  toggleCollapseTooltip() {
    this.setState({
      collapseTooltip: !this.state.collapseTooltip,
    });
  }

  toggleDeleteTooltip() {
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

  collapse() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  renderTags() {
    if (this.props.tags.length > 0) {
      return this.props.tags.map(tag => (
        <Tag
          key={tag.id}
          addContent={this.props.addContent}
          hasErrored={this.props.hasErrored}
          isLoading={this.props.isLoading}
          id={tag.id}
          longLabel={tag.long_label}
          shortLabel={tag.short_label}
          toggleDeleteModal={this.props.toggleDeleteModal}
        />));
    }
    return <p>Aucun label dans cette catégorie</p>;
  }

  render() {
    const deleteUrl = `${process.env.API_URL_STAGING}${this.props.categoryType}_categories/${this.props.id}`;
    return (
      <Row className="mb-3">
        <div className="btn btn-primary plus-drag px-2 rounded border-0">
          <i className="fa fa-arrows-v plus-drag" />
        </div>
        {this.props.categoryType === 'institution_tag' ?
          <Col xs="3" className="px-0">
            <Input
              id="origin"
              type="text"
              className="rounded"
              value={this.state.origin}
              onChange={this.onChange}
              placeholder={this.state.origin}
            />
          </Col> : ''}
        <Col className="px-0">
          <InputGroup>
            <Input
              id="title"
              type="text"
              className="rounded"
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
                  toggle={this.toggleCancelTooltip}
                >
                  Annuler les changements
                </Tooltip>
              </InputGroupAddon> : <div />}
            <Button
              id={`labels-delete-button-${this.props.id}`}
              color="secondary"
              className="rounded ml-1"
              size="sm"
              onClick={() => this.props.toggleDeleteModal(deleteUrl)}
            >
              <i className="fa fa-trash fa-lg" />
            </Button>
            <Tooltip
              isOpen={this.state.deleteTooltip}
              target={`labels-delete-button-${this.props.id}`}
              toggle={this.toggleDeleteTooltip}
            >
              Supprimer la catégorie
            </Tooltip>
            {this.props.categoryType === 'institution_tag' ?
              <div className="d-flex">
                <Button
                  id={`labels-plus-button-${this.props.id}`}
                  color="secondary"
                  className="rounded ml-1"
                  size="sm"
                  onClick={this.toggleAddTag}
                >
                  <i className="fa fa-plus" />
                </Button>
                <Tooltip
                  isOpen={this.state.addTagTooltip}
                  target={`labels-plus-button-${this.props.id}`}
                  toggle={this.toggleAddTagTooltip}
                >
                  Ajouter un tag dans cette catégorie
                </Tooltip>
                {this.state.addTag ?
                  <TagModal
                    addContent={this.props.addContent}
                    hasErrored={this.props.hasErrored}
                    isLoading={this.props.isLoading}
                    modal={this.state.addTag}
                    toggleModal={this.toggleAddTag}
                    categoryId={this.props.id}
                  /> : <div />
                }
                <Button
                  id={`labels-more-button-${this.props.id}`}
                  color="secondary"
                  className="rounded ml-1"
                  size="sm"
                  onClick={this.collapse}
                >
                  {this.state.collapse ?
                    <i className="fa fa-chevron-up" /> :
                    <i className="fa fa-chevron-down" />}
                </Button>
                <Tooltip
                  isOpen={this.state.collapseTooltip}
                  target={`labels-more-button-${this.props.id}`}
                  toggle={this.showMoreToolTip}
                >
                  Voir plus
                </Tooltip>
              </div> : ''}
          </InputGroup>
        </Col>
        {this.state.collapse ?
          <Collapse isOpen={this.state.collapse} className="ml-4">
            {this.renderTags()}
          </Collapse> : <div />}
      </Row>
    );
  }
}

Category.propTypes = {
  addContent: PropTypes.func.isRequired,
  categoryType: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  origin: PropTypes.string,
  tags: PropTypes.array.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

Category.defaultProps = {
  origin: '',
};


export default Category;
