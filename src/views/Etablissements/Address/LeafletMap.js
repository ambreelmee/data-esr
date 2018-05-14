import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import PropTypes from 'prop-types';

import UpdatePositionButton from './UpdatePositionButton';

class LeafletMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 16,
      latlng: null,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({
      latlng: e.latlng,
    });
  }


  render() {
    const marker = this.state.latlng ? (
      <Marker position={this.state.latlng}>
        <Popup>
          <span>Ajuster la géolocalisation ?</span>
        </Popup>
      </Marker>
    ) : null;
    const zipAndCity = `${this.props.currentAddress.zip_code} ,${this.props.currentAddress.city}`;
    const position = [this.props.currentAddress.latitude, this.props.currentAddress.longitude];
    return (
      <div>
        <Map
          center={position}
          zoom={this.state.zoom}
          onClick={this.handleClick}
        >
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
          {marker}
        </Map>
        {this.state.latlng ?
          <div>
            <UpdatePositionButton
              etablissement_id={this.props.etablissement_id}
              id={this.props.currentAddress.id}
              selectedLat={this.state.latlng.lat || this.props.currentAddress.latitude}
              selectedLng={this.state.latlng.lng || this.props.currentAddress.longitude}
              getAddresses={this.props.getAddresses}
            />
            <Badge color="warning" className="m-3">{this.state.positionMessage}</Badge>
          </div> :
          <div />}
      </div>
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
