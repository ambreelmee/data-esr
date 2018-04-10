import React, { Component } from 'react';
import { Button, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

import LinkModal from './LinkModal';

class LinkRef extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteTooltip: false,
      editTooltip: false,
      isLoading: false,
      modal: false,
    };
    this.toggleDeleteToolTip = this.toggleDeleteToolTip.bind(this);
    this.toggleEditToolTip = this.toggleEditToolTip.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  deleteLink() {
    this.setState({ isLoading: true });
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/links/${this.props.id}`,
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
          isLoading: false,
        });
        this.props.getLinks();
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

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <div
        className={`btn-${this.props.category.toLowerCase()} p-0 pl-4 btn-primary m-2`}
      >
        <a
          className="m-2 text-light"
          href={this.props.content}
          target="blank"
        >
          {this.props.category}
        </a>
        <Button
          id={`edit-button-${this.props.id}`}
          color="secondary"
          size="sm"
          onClick={this.toggleModal}
        >
          <i className="fa fa-pencil" />
        </Button>
        <Tooltip
          placement="bottom"
          isOpen={this.state.editTooltip}
          target={`edit-button-${this.props.id}`}
          toggle={this.toggleEditToolTip}
        >
          Modifier le lien
        </Tooltip>
        <Button
          id={`delete-button-${this.props.id}`}
          color="danger"
          size="sm"
          disabled={this.state.isLoading}
          onClick={this.deleteLink}
        >
          {this.state.isLoading ?
            <i className="fa fa-spinner fa-spin " /> :
            <i className="fa fa-close" />}
        </Button>
        <Tooltip
          placement="bottom"
          isOpen={this.state.deleteTooltip}
          target={`delete-button-${this.props.id}`}
          toggle={this.toggleDeleteToolTip}
        >
          {this.state.isLoading ? 'Suppression...' : 'Supprimer'}
        </Tooltip>
        {this.state.modal ?
          <LinkModal
            categoryId={this.props.categoryId}
            category={this.props.category}
            content={this.props.content}
            etablissement_id={this.props.etablissement_id}
            getLinks={this.props.getLinks}
            id={this.props.id}
            toggleModal={this.toggleModal}
          /> : <div /> }
      </div>
    );
  }
}

LinkRef.propTypes = {
  content: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  etablissement_id: PropTypes.number.isRequired,
  getLinks: PropTypes.func,
};

LinkRef.defaultProps = {
  getLinks: null,
};

export default LinkRef;
