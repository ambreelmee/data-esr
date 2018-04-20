import React, { Component } from 'react';
import { Badge, Button, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

import CodeEditModal from './CodeEditModal';

class CodeHistoryModalRow extends Component {
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
        <td>{this.props.content}</td>
        <td>{this.props.date_start ? moment(this.props.date_start).format('LL') : ''}</td>
        <td>{this.props.date_end ? moment(this.props.date_end).format('LL') : ''}</td>
        <td>
          {this.props.status === 1 ?
            <Badge color="success"> Actif </Badge> :
            <Badge color="danger"> Archivé </Badge>}
        </td>
        <td className="d-flex flex-row">
          <Button
            color="info"
            id={`historymodal-edit-button-${this.props.id}`}
            onClick={this.toggleEditModal}
            size="sm"
          >
            <i className="fa fa-pencil" />
          </Button>

          {this.state.editModal ?
            <CodeEditModal
              category={this.props.category}
              categoryId={this.props.categoryId}
              content={this.props.content}
              date_end={this.props.date_end}
              date_start={this.props.date_start}
              id={this.props.id}
              getCodes={this.props.getCodes}
              status={this.props.status}
              toggleModal={this.toggleEditModal}
            /> : <div />
          }
          <Button
            color="danger"
            id={`historymodal-delete-button-${this.props.id}`}
            onClick={this.props.deleteCode}
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
        </td>
      </tr>);
  }
}

CodeHistoryModalRow.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  date_end: PropTypes.string,
  date_start: PropTypes.string,
  deleteCode: PropTypes.func.isRequired,
  getCodes: PropTypes.func.isRequired,
  status: PropTypes.number.isRequired,
};

CodeHistoryModalRow.defaultProps = {
  date_end: '',
  date_start: '',
}

export default CodeHistoryModalRow;
