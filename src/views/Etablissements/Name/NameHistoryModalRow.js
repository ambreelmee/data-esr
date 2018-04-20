import React, { Component } from 'react';
import { Badge, Button, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

import NameModal from './NameModal';

class NameHistoryModalRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteTooltip: false,
      editTooltip: false,
      editModal: false,
    };
    this.toggleDeleteToolTip = this.toggleDeleteToolTip.bind(this);
    this.toggleEditToolTip = this.toggleEditToolTip.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
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

  toggleEditModal() {
    this.setState({
      editModal: !this.state.editModal,
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
                getNames={this.props.getNames}
                toggleModal={this.toggleEditModal}
                text={this.props.text}
              /> : <div />
            }
            <Button
              color="danger"
              id={`historymodal-delete-button-${this.props.id}`}
              onClick={() => this.props.deleteName(this.props.id, this.props.etablissement_id)}
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
          </div>
        </td>
      </tr>);
  }
}

NameHistoryModalRow.propTypes = {
  deleteName: PropTypes.func.isRequired,
  date_end: PropTypes.string,
  date_start: PropTypes.string,
  etablissement_id: PropTypes.number.isRequired,
  getNames: PropTypes.func.isRequired,
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
