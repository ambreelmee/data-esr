import React, { Component } from 'react';
import { Badge, Button, Input, InputGroupAddon, Modal, ModalBody, ModalFooter, ModalHeader, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';


class TagModalRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cancelTooltip: false,
      date_end: this.props.date_end,
      date_start: this.props.date_start,
      deleteTooltip: false,
      deleteModal: false,
      displayEditButton: false,
      editTooltip: false,
      isDeleting: false,
    };
    this.cancelEdition = this.cancelEdition.bind(this);
    this.deleteTagging = this.deleteTagging.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateTagging = this.updateTagging.bind(this);
    this.toggleCancelTooltip = this.toggleCancelTooltip.bind(this);
    this.toggleEditTooltip = this.toggleEditTooltip.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleDeleteTooltip = this.toggleDeleteTooltip.bind(this);
  }

  onChange(event) {
    this.setState({
      displayEditButton: true,
      [event.target.id]: event.target.value,
    });
  }

  deleteTagging() {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.etablissementId}/tags/${this.props.tagId}`,
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
        this.props.getInstitutionTags(this.props.etablissementId);
      });
  }

  updateTagging() {
    this.setState({ isEditing: true });
    const institution_tagging = {
      date_end: this.state.date_end,
      date_start: this.state.date_start,
      status: this.state.date_end ? 'archived' : 'active',
    };
    fetch(
      `${process.env.API_URL_STAGING}/institution_taggings/${this.props.taggingId}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
        body: JSON.stringify(institution_tagging),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isEditing: false,
          displayEditButton: false,
          editTooltip: false,
        });
        this.props.getInstitutionTags(this.props.etablissementId)
      });
  }


  cancelEdition() {
    this.setState({
      displayEditButton: false,
      date_end: this.props.date_end,
      date_start: this.props.date_start,
    });
  }

  toggleEditTooltip() {
    this.setState({
      editTooltip: !this.state.editTooltip,
    });
  }

  toggleCancelTooltip() {
    this.setState({
      cancelTooltip: !this.state.cancelTooltip,
    });
  }


  toggleDeleteTooltip() {
    this.setState({
      deleteTooltip: !this.state.deleteTooltip,
    });
  }

  toggleDeleteModal() {
    this.setState({
      deleteModal: !this.state.deleteModal,
    });
  }


  render() {
    return (
      <tr key={this.props.taggingId}>
        <td>{this.props.category}</td>
        <td>{this.props.shortLabel}</td>
        <td>{this.props.longLabel}</td>
        <td>
          <Input
            type="date"
            id="date_start"
            value={this.state.date_start ? this.state.date_start : ''}
            placeholder={this.state.date_start ? this.state.date_start : ''}
            onChange={this.onChange}
          />
        </td>
        <td>
          <Input
            type="date"
            id="date_end"
            value={this.state.date_end ? this.state.date_end : ''}
            placeholder={this.state.date_end ? this.state.date_end : ''}
            onChange={this.onChange}
          />
        </td>
        <td>
          {this.props.status === 'active' ?
            <Badge color="success"> Actif </Badge> :
            <Badge color="danger"> Archivé </Badge>}
        </td>
        <td>
          {this.state.displayEditButton ?
            <InputGroupAddon addonType="append">
              <Button
                id={`edit-button-${this.props.taggingId}`}
                color="transparent"
                size="sm"
                disabled={this.state.isEditing}
                onClick={this.updateTagging}
              >
                {this.state.isEditing ?
                  <i className="fa fa-spinner text-success fa-spin " /> :
                  <i className="fa fa-check text-success" />}
              </Button>
              <Tooltip
                isOpen={this.state.editTooltip}
                target={`edit-button-${this.props.taggingId}`}
                toggle={this.toggleEditTooltip}
              >
                Sauvegarder les changements
              </Tooltip>
              <Button
                id={`cancel-button-${this.props.taggingId}`}
                color="transparent"
                size="sm"
                onClick={this.cancelEdition}
              >
                <i className="fa fa-close text-dark" />
              </Button>
              <Tooltip
                isOpen={this.state.cancelTooltip}
                target={`cancel-button-${this.props.taggingId}`}
                toggle={this.toggleCancelTooltip}
              >
                Annuler les changements
              </Tooltip>
            </InputGroupAddon> :
            <Button
              color="danger"
              id={`tagmodal-delete-button-${this.props.taggingId}`}
              onClick={this.toggleDeleteModal}
              size="sm"
            >
              <i className="fa fa-close" />
            </Button>}
          {this.state.deleteModal ?
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
                  onClick={!this.state.isDeleting ? () => this.deleteTagging() : null}
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
            </Modal> : <div />}
          <Tooltip
            placement="bottom"
            isOpen={this.state.deleteTooltip}
            target={`tagmodal-delete-button-${this.props.taggingId}`}
            toggle={this.toggleDeleteTooltip}
          >
          Retirer la caractérisation
          </Tooltip>
        </td>
      </tr>);
  }
}

TagModalRow.propTypes = {
  getInstitutionTags: PropTypes.func.isRequired,
  etablissementId: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  date_end: PropTypes.string,
  date_start: PropTypes.string,
  shortLabel: PropTypes.string,
  longLabel: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  tagId: PropTypes.number.isRequired,
  taggingId: PropTypes.number.isRequired,
};

TagModalRow.defaultProps = {
  date_end: '',
  date_start: '',
  shortLabel: '',
};

export default TagModalRow;
