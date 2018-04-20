import React, { Component } from 'react';
import { Badge, Button, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

import AddressModal from './AddressModal';

class AddressHistoryModalRow extends Component {
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
        <td>{this.props.business_name}</td>
        <td>{this.props.address_1}</td>
        <td>{this.props.address_2}</td>
        <td>{this.props.zip_code}</td>
        <td>{this.props.city}</td>
        <td>{this.props.country}</td>
        <td>{this.props.phone}</td>
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
              <AddressModal
                getAddresses={this.props.getAddresses}
                toggleModal={this.toggleEditModal}
                address_1={this.props.address_1}
                address_2={this.props.address_2}
                business_name={this.props.business_name}
                city={this.props.city}
                country={this.props.country}
                date_start={this.props.date_start}
                date_end={this.props.date_end}
                etablissement_id={this.props.etablissement_id}
                id={this.props.id}
                phone={this.props.phone}
                zip_code={this.props.zip_code}
              /> : <div /> }
            <Button
              color="danger"
              id={`historymodal-delete-button-${this.props.id}`}
              onClick={() => this.props.deleteAddress(this.props.id, this.props.etablissement_id)}
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

AddressHistoryModalRow.propTypes = {
  address_1: PropTypes.string.isRequired,
  address_2: PropTypes.string,
  business_name: PropTypes.string,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  date_end: PropTypes.string,
  date_start: PropTypes.string,
  deleteAddress: PropTypes.func.isRequired,
  etablissement_id: PropTypes.number.isRequired,
  getAddresses: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  phone: PropTypes.string,
  status: PropTypes.string.isRequired,
  zip_code: PropTypes.string.isRequired,
};

AddressHistoryModalRow.defaultProps = {
  business_name: '',
  address_2: '',
  date_end: '',
  date_start: '',
  phone: '',
};

export default AddressHistoryModalRow;
