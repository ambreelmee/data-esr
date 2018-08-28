import React, { Component } from 'react';
import { Button, Card } from 'reactstrap';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import PropTypes from 'prop-types';

class LeafletMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 16,
      latlng: null,
    };
    this.handleClick = this.handleClick.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
  }

  handleClick(e) {
    this.setState({
      latlng: e.latlng,
    });
  }

  updatePosition() {
    const jsonBody = JSON.stringify({
      address: {
        latitude: this.state.latlng.lat || this.props.latitude,
        longitude: this.state.latlng.lng || this.props.longitude,
      },
    });
    const url = `${process.env.API_URL_STAGING}addresses/${this.props.id}`;
    this.props.addContent(url, jsonBody, 'PUT', this.props.institutionId);
    this.setState({ latlng: null });
  }


  render() {
    const marker = this.state.latlng ? (
      <Marker position={this.state.latlng}>
        <Popup>
          <span>Ajuster la géolocalisation ?</span>
        </Popup>
      </Marker>
    ) : null;
    const position = [this.props.latitude, this.props.longitude];
    return (
      <Card className="mt-2 mb-0 rounded">
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
                {this.props.formattedAddress}
              </div>
            </Popup>
          </Marker>
          {marker}
        </Map>
        {this.state.latlng ?
          <div>
            <Button
              className="m-1 float-right"
              color="secondary"
              disabled={this.props.isLoading}
              onClick={this.updatePosition}
            >
              {this.props.isLoading ?
                <div>
                  <i className="fa fa-spinner fa-spin " />
                  <span className="mx-1"> Modification </span>
                </div> :
                'Corriger les coordonnées gps'}
            </Button>
          </div> :
          <div />}
      </Card>
    );
  }
}

LeafletMap.propTypes = {
  addContent: PropTypes.func.isRequired,
  formattedAddress: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  institutionId: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,

}

export default LeafletMap;
