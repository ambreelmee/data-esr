import React, { Component } from 'react';
import { Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

import NameModal from './NameModal';

class NameHistoryModalRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteModal: false,
      deleteTooltip: false,
      editModal: false,
      editTooltip: false,
      errorMessage: '',
    };
    this.deleteName = this.deleteName.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleDeleteToolTip = this.toggleDeleteToolTip.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleEditToolTip = this.toggleEditToolTip.bind(this);
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


  deleteName() {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}institution_names/${this.props.id}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ name: { id: this.props.id } }),
      },
    )
      .then((res) => {
        if (res.ok) {
          res.json().then(() => {
            this.setState({
              isDeleting: false,
              deleteModal: false,
            });
            this.props.getData(this.props.etablissement_id);
          });
        } else {
          this.setState({
            errorMessage: 'impossible de supprimer le nom',
          });
        }
      });
  }


  render() {
    return (
      <tr key={this.props.id}>
        <td>{this.props.initials}</td>
        <td>{this.props.text}</td>
        <td>{this.props.date_start ? moment(this.props.date_start).format('LL') : ''}</td>
        <td>{this.props.date_end ? moment(this.props.date_end).format('LL') : ''}</td>
        <td>
          {this.props.status === 'active' ?
            <Badge color="success"> Actif </Badge> :
            <Badge color="danger"> Archivé </Badge>}
        </td>
        <td>
          <div className="d-flex flex-row">
            <Button
              color="info"
              id={`historymodal-edit-button-${this.props.id}`}
              onClick={this.toggleEditModal}
              size="sm"
            >
              <i className="fa fa-pencil" />
            </Button>
            {this.state.editModal ?
              <NameModal
                date_start={this.props.date_start}
                date_end={this.props.date_end}
                id={this.props.id}
                initials={this.props.initials}
                etablissement_id={this.props.etablissement_id}
                getData={this.props.getData}
                toggleModal={this.toggleEditModal}
                text={this.props.text}
                status={this.props.status}
              /> : <div />
            }
            <Button
              color="danger"
              id={`historymodal-delete-button-${this.props.id}`}
              onClick={this.toggleDeleteModal}
              size="sm"
            >
              <i className="fa fa-close" />
            </Button>
            <Tooltip
              placement="bottom"
              isOpen={this.state.editTooltip}
              target={`historymodal-edit-button-${this.props.id}`}
              toggle={this.toggleEditToolTip}
            >
            Modifier
            </Tooltip>
            <Tooltip
              placement="bottom"
              isOpen={this.state.deleteTooltip}
              target={`historymodal-delete-button-${this.props.id}`}
              toggle={this.toggleDeleteToolTip}
            >
            Supprimer la référence
            </Tooltip>
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
                  onClick={!this.state.isDeleting ? this.deleteName : null}
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
          </div>
        </td>
      </tr>);
  }
}

NameHistoryModalRow.propTypes = {
  date_end: PropTypes.string,
  date_start: PropTypes.string,
  etablissement_id: PropTypes.number.isRequired,
  getData: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  initials: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

NameHistoryModalRow.defaultProps = {
  date_end: '',
  date_start: '',
};

export default NameHistoryModalRow;
