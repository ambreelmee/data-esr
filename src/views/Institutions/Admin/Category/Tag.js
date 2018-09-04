import React, { Component } from 'react';
import { Button, Col, Input, InputGroup, InputGroupAddon, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

class Tag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cancelTooltip: false,
      deleteTooltip: false,
      displayEditButton: false,
      editTooltip: false,
      longLabel: this.props.longLabel,
      shortLabel: this.props.shortLabel,
    };
    this.cancelEdition = this.cancelEdition.bind(this);
    this.onChange = this.onChange.bind(this);
    this.modifyCurrentCategory = this.modifyCurrentCategory.bind(this);
    this.toggleCancelToolTip = this.toggleCancelToolTip.bind(this);
    this.toggleDeleteToolTip = this.toggleDeleteToolTip.bind(this);
    this.toggleEditToolTip = this.toggleEditToolTip.bind(this);
  }

  onChange(event) {
    this.setState({
      displayEditButton: true,
      [event.target.id]: event.target.value,
    });
  }

  modifyCurrentCategory() {
    const institution_tag = {
      id: this.props.id,
      long_label: this.state.longLabel,
      short_label: this.state.shortLabel,
    };
    const url = `${process.env.API_URL_STAGING}institution_tags/${this.props.id}`;
    this.props.addContent(url, JSON.stringify({ institution_tag }), 'PUT');
  }

  cancelEdition() {
    this.setState({
      displayEditButton: false,
      longLabel: this.props.longLabel,
      shortLabel: this.props.shortLabel,
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

  render() {
    return (
      <InputGroup className="mt-3 justify-content-end">
        <Col xs="3" className="p-0">
          <Input
            id="shortLabel"
            type="text"
            className="rounded"
            value={this.state.shortLabel}
            onChange={this.onChange}
            placeholder={this.state.shortLabel}
          />
        </Col>
        <Col xs="9" className="pl-0">
          <InputGroup>
            <Input
              id="longLabel"
              type="text"
              className="rounded"
              value={this.state.longLabel}
              onChange={this.onChange}
              placeholder={this.state.longLabel}
            />
            {this.state.displayEditButton ?
              <InputGroupAddon addonType="append">
                <Button
                  id={`labels-edit-button-${this.props.id}`}
                  color="transparent"
                  size="sm"
                  disabled={this.props.isLoading}
                  onClick={this.modifyCurrentCategory}
                >
                  {this.props.isLoading ?
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
              color="secondary"
              className="border-0 rounded"
              size="sm"
              onClick={() => this.props.toggleDeleteModal(`${process.env.API_URL_STAGING}institution_tags/${this.props.id}`)}
            >
              <i className="fa fa-trash fa-lg" />
            </Button>
            <Tooltip
              isOpen={this.state.deleteTooltip}
              target={`labels-delete-button-${this.props.id}`}
              toggle={this.toggleDeleteToolTip}
            >
              Supprimer la catégorie
            </Tooltip>
          </InputGroup>
        </Col>
      </InputGroup>
    );
  }
}

Tag.propTypes = {
  addContent: PropTypes.func.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  longLabel: PropTypes.string.isRequired,
  shortLabel: PropTypes.string,
  toggleDeleteModal: PropTypes.func.isRequired,
};

Tag.defaultProps = {
  shortLabel: '',
}


export default Tag;
