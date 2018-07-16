import React, { Component } from 'react';
import { Badge, Button, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

import DeleteModalContainer from '../../containers/Institutions/DeleteModalContainer';

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteTooltip: false,
      deleteModal: false,
      editTooltip: false,
    };
    this.toggleDeleteToolTip = this.toggleDeleteToolTip.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleEditToolTip = this.toggleEditToolTip.bind(this);
  }

  toggleDeleteToolTip() {
    this.setState({
      deleteTooltip: !this.state.deleteTooltip,
    });
  }

  toggleDeleteModal() {
    this.setState({
      deleteModal: !this.state.deleteModal,
    });
  }

  toggleEditToolTip() {
    this.setState({
      editTooltip: !this.state.editTooltip,
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
              onClick={this.props.toggleModal}
              size="sm"
            >
              <i className="fa fa-pencil" />
            </Button>
            {this.props.modal ?
              React.cloneElement(
                this.props.component,
                { ...this.props, toggleModal: this.props.toggleModal, modal: this.props.modal }
              ) : ''}
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
            {this.state.deleteModal ?
              <DeleteModalContainer
                deleteUrl={this.props.deleteUrl}
                institutionId={this.props.institutionId}
                modal={this.state.deleteModal}
                toggleModal={this.toggleDeleteModal}
              /> : <div />}
          </div>
        </td>
      </tr>);
  }
}

TableRow.propTypes = {
  component: PropTypes.object.isRequired,
  date_end: PropTypes.string,
  date_start: PropTypes.string,
  deleteUrl: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  initials: PropTypes.string.isRequired,
  institutionId: PropTypes.number.isRequired,
  modal: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

TableRow.defaultProps = {
  date_end: '',
  date_start: '',
};

export default TableRow;
