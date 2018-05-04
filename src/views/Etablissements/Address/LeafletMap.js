import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import PropTypes from 'prop-types';

class LeafletMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 17,
    };
  }

  render() {
    const zipAndCity = `${this.props.currentAddress.zip_code} ,${this.props.currentAddress.city}`;
    const position = [this.props.currentAddress.latitude, this.props.currentAddress.longitude];
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div>
              <p>{this.props.currentAddress.address_1}
                {this.props.currentAddress.address_2 ? <br /> : <span />}
                {this.props.currentAddress.address_2}<br />
                {zipAndCity}<br />
                {this.props.currentAddress.country}
              </p>
            </div>
          </Popup>
        </Marker>
      </Map>
    );
  }
}

LeafletMap.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
  currentAddress: PropTypes.shape({
    address_1: PropTypes.string.isRequired,
    address_2: PropTypes.string,
    business_name: PropTypes.string,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    date_end: PropTypes.string,
    date_start: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    phone: PropTypes.string,
    status: PropTypes.string.isRequired,
    zip_code: PropTypes.string.isRequired,
  }).isRequired,
  getAddresses: PropTypes.func.isRequired,
}

export default LeafletMap;
