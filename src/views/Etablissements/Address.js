import React, { Component } from 'react';
import { Badge, Button, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';


class Address extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltip: false,
    };
    this.toggleToolTip = this.toggleToolTip.bind(this);
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
        {`${this.props.zip_code}, ${this.props.city}`}<br />
        {this.props.country}
        {this.props.phone ? <span><br /><i className="icon-phone pr-1" /></span> : <span />}{this.props.phone}
        {this.props.date_start ?
          <span><br /><span className="mr-1">début d&#39;activité :</span></span> :
          <span />}{this.props.date_start}
        {this.props.date_end ?
          <span><br /><span className="mr-1">fin d&#39;activité :</span></span> :
          <span />}{this.props.date_end}
        {this.props.status === 'active' ? <span /> :
        <span>
          <Button
            id={`button-${this.props.id}`}
            outline
            className="float-right"
            color="danger"
            size="sm"
          >
            <i className="icon-close" />
          </Button>
          <Tooltip
            placement="bottom"
            isOpen={this.state.tooltip}
            target={`button-${this.props.id}`}
            toggle={this.toggleToolTip}
          >
            Supprimer
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
  id: PropTypes.number.isRequired,
  phone: PropTypes.string,
  status: PropTypes.string.isRequired,
  zip_code: PropTypes.string.isRequired,
};

Address.defaultProps = {
  address_2: null,
  business_name: null,
  date_start: null,
  date_end: null,
  phone: null,
};

export default Address;
