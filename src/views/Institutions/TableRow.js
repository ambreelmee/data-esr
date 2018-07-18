import React, { Component } from 'react';
import { Badge, Button, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteTooltip: false,
      editTooltip: false,
    };
    this.toggleDeleteToolTip = this.toggleDeleteToolTip.bind(this);
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


  render() {
    return (
      <tr key={this.props.id}>
        <td>{this.props.initials ? this.props.initials : this.props.business_name}</td>
        <td>{this.props.text ? this.props.text : this.props.address_1}</td>
        {this.props.address_1 ? <td>{this.props.address_2}</td> : ''}
        {this.props.address_1 ? <td>{this.props.zip_code}</td> : ''}
        {this.props.address_1 ? <td>{this.props.city}</td> : ''}
        {this.props.address_1 ? <td>{this.props.city_code}</td> : ''}
        {this.props.address_1 ? <td>{this.props.country}</td> : ''}
        {this.props.address_1 ? <td>{this.props.phone}</td> : ''}
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
              id={`tableModal-edit-button-${this.props.id}`}
              onClick={() => this.props.toggleEditModal(this.props.id)}
              size="sm"
            >
              <i className="fa fa-pencil" />
            </Button>
            {this.props.editModal && this.props.activeId === this.props.id ?
              React.cloneElement(
                this.props.component,
                { ...this.props, toggleModal: this.props.toggleEditModal, modal: this.props.editModal },
              ) : ''}
            <Button
              color="danger"
              id={`tableModal-delete-button-${this.props.id}`}
              onClick={() => this.props.toggleDeleteModal(this.props.deleteUrl)}
              size="sm"
            >
              <i className="fa fa-close" />
            </Button>
            <Tooltip
              placement="bottom"
              isOpen={this.state.editTooltip}
              target={`tableModal-edit-button-${this.props.id}`}
              toggle={this.toggleEditToolTip}
            >
            Modifier
            </Tooltip>
            <Tooltip
              placement="bottom"
              isOpen={this.state.deleteTooltip}
              target={`tableModal-delete-button-${this.props.id}`}
              toggle={this.toggleDeleteToolTip}
            >
            Supprimer la référence
            </Tooltip>
          </div>
        </td>
      </tr>);
  }
}

TableRow.propTypes = {
  activeId: PropTypes.number.isRequired,
  address_1: PropTypes.string,
  address_2: PropTypes.string,
  business_name: PropTypes.string,
  city: PropTypes.string,
  city_code: PropTypes.number,
  component: PropTypes.object.isRequired,
  country: PropTypes.string,
  date_end: PropTypes.string,
  date_start: PropTypes.string,
  deleteUrl: PropTypes.string.isRequired,
  deleteModal: PropTypes.bool.isRequired,
  editModal: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  initials: PropTypes.string,
  institutionId: PropTypes.number.isRequired,
  phone: PropTypes.string,
  status: PropTypes.string.isRequired,
  text: PropTypes.string,
  toggleDeleteModal: PropTypes.func.isRequired,
  toggleEditModal: PropTypes.func.isRequired,
  zip_code: PropTypes.string,
};

TableRow.defaultProps = {
  address_1: '',
  address_2: '',
  business_name: '',
  city: '',
  city_code: null,
  country: '',
  date_end: '',
  date_start: '',
  initials: '',
  phone: null,
  text: '',
  zip_code: null,
};

export default TableRow;
