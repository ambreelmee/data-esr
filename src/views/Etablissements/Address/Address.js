import React, { Component } from 'react';
import { Badge, Button, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';


class Address extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltip: false,
      isLoading: false,
    };
    this.deleteAddress = this.deleteAddress.bind(this);
    this.toggleToolTip = this.toggleToolTip.bind(this);
  }

  deleteAddress() {
    this.setState({ isLoading: true });
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/addresses/${this.props.id}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ address: { id: this.props.id } }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isLoading: false,
        });
        this.props.getAddresses();
      });
  }

  toggleToolTip() {
    this.setState({
      tooltip: !this.state.tooltip,
    });
  }

  render() {
    return (
      <div>
        <Badge
          color={this.props.status === 'active' ? 'success' : 'danger'}
          className="float-right"
        >
          {this.props.status}
        </Badge>
        {this.props.business_name}{this.props.business_name ? <br /> : <span />}
        {this.props.address_1}
        {this.props.address_2 ? <br /> : <span />}{this.props.address_2}<br />
        {`${this.props.zip_code}, ${this.props.city} ${this.props.country}`}
        {this.props.phone ? <span><br /><i className="icon-phone pr-1" /></span> : <span />}{this.props.phone}
        {this.props.date_start ?
          <span><br /><span className="mr-1">depuis :</span></span> :
          <span />}{this.props.date_start}
        {this.props.date_end ?
          <span><br /><span className="mr-1">jusqu&#39;au :</span></span> :
          <span />}{this.props.date_end}
        {this.props.status === 'active' ? <span /> :
        <span>
          <Button
            id={`button-${this.props.id}`}
            outline
            className="float-right"
            color="danger"
            size="sm"
            disabled={this.state.isLoading}
            onClick={this.deleteAddress}
          >
            {this.state.isLoading ?
              <i className="fa fa-spinner fa-spin " /> :
              <i className="icon-close" />}
          </Button>
          <Tooltip
            placement="bottom"
            isOpen={this.state.tooltip}
            target={`button-${this.props.id}`}
            toggle={this.toggleToolTip}
          >
            {this.state.isLoading ? 'Suppression...' : 'Supprimer'}
          </Tooltip>
        </span>}
      </div>
    );
  }
}

Address.propTypes = {
  address_1: PropTypes.string.isRequired,
  address_2: PropTypes.string,
  business_name: PropTypes.string,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  date_start: PropTypes.string,
  date_end: PropTypes.string,
  getAddresses: PropTypes.func,
  id: PropTypes.number.isRequired,
  etablissement_id: PropTypes.number,
  phone: PropTypes.string,
  status: PropTypes.string.isRequired,
  zip_code: PropTypes.string.isRequired,
};

Address.defaultProps = {
  address_2: null,
  business_name: null,
  date_start: null,
  date_end: null,
  etablissement_id: null,
  getAddresses: null,
  phone: null,
};

export default Address;
