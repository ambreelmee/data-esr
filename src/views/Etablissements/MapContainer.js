import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types';


export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      showingInfoWindowNewMarker: false,
      savedMarker: {},
      newMarker: {},
      showNewMarker: false,
      newMarkerPosition: {},
      selectedAddress: '',
      selectedLat: '',
      selectedLng: '',
      errorMessage: '',
    };

    this.getNewAddress = this.getNewAddress.bind(this);
    this.onNewMarkerClick = this.onNewMarkerClick.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
    this.UpdatePosition = this.UpdatePosition.bind(this);
  }

  onMarkerClick(props, marker) {
    this.setState({
      savedMarker: marker,
      showingInfoWindow: !this.state.showingInfoWindow,
    });
  }

  onNewMarkerClick(props, marker) {
    this.setState({
      newMarker: marker,
      showingInfoWindowNewMarker: !this.state.showingInfoWindowNewMarker,
    });
  }

  onMapClicked(props, marker, e) {
    if (this.state.showingInfoWindow || this.state.showingInfoWindowNewMarker) {
      this.setState({
        showingInfoWindow: false,
        showingInfoWindowNewMarker: false,
        newMarker: null,
      });
    } else {
      this.setState({
        newMarker: marker,
        showNewMarker: true,
        newMarkerPosition: e.latLng,
        selectedLat: e.latLng.lat(),
        selectedLng: e.latLng.lng(),
      });
    }
  }

  getNewAddress() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ latLng: this.state.newMarkerPosition }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        this.setState({
          selectedAddress: results[0].formatted_address,
        });
      }
    });
  }

  UpdatePosition() {
    const position = {
      latitude: this.state.selectedLat,
      longitude: this.state.selectedLng,
    };
    fetch(
      `${process.env.PROXY_URL + process.env.API_URL_STAGING}institutions/1/addresses/${this.props.currentAddress.id}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ address: position }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.props.getAddress();
        this.setState({
          showNewMarker: false,
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: error,
        });
      });
  }

  render() {
    if (this.state.showNewMarker) {
      this.getNewAddress();
    }
    const initialPosition = {
      lat: this.props.currentAddress.latitude,
      lng: this.props.currentAddress.longitude,
    };
    const zipAndCity = `${this.props.currentAddress.zip_code} ,${this.props.currentAddress.city}`;

    return (
      <div>
        <Map
          google={this.props.google}
          initialCenter={initialPosition}
          zoom={17}
          onClick={this.onMapClicked}
          containerStyle={{ width: '100%', height: '400px', position: 'relative' }}
        >
          <Marker
            onClick={this.onMarkerClick}
            title="Cliquer pour afficher l'adresse"
            position={initialPosition}
          />
          <InfoWindow
            marker={this.state.savedMarker}
            visible={this.state.showingInfoWindow}
          >
            <div>
              <p>{this.props.currentAddress.address_1}
                {this.props.currentAddress.address_2 ? <br /> : <span />}
                {this.props.currentAddress.address_2}<br />
                {zipAndCity}<br />
                {this.props.currentAddress.country}
              </p>
            </div>
          </InfoWindow>
          {this.state.showNewMarker ?
            <Marker
              onClick={this.onNewMarkerClick}
              title="Cliquer pour afficher l'adresse"
              position={this.state.newMarkerPosition}
              icon={{
              url: 'http://com.cartodb.users-assets.production.s3.amazonaws.com/simpleicon/map43.svg',
              anchor: new google.maps.Point(16,32),
              scaledSize: new google.maps.Size(32,32)
              }}
            />
            : <div />
          }
          <InfoWindow
            marker={this.state.newMarker}
            visible={this.state.showingInfoWindowNewMarker}
          >
            <div>
              {this.state.selectedAddress.split(',')[0]} <br />
              {this.state.selectedAddress.split(',')[1]} <br />
              {this.state.selectedAddress.split(',')[2]} <br />
            </div>
          </InfoWindow>
        </Map>
        <div>{this.state.errorMessage}</div >
        {this.state.showNewMarker ?
          <Button
            className="m-1 float-right"
            color="secondary"
            onClick={this.UpdatePosition}
          >
            Corriger les coordonnées gps
          </Button> :
          <div />}
      </div>
    );
  }
}

MapContainer.propTypes = {
  currentAddress: PropTypes.shape({
    address_1: PropTypes.string.isRequired,
    address_2: PropTypes.string,
    business_name: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    date_end: PropTypes.string,
    date_start: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    phone: PropTypes.string,
    status: PropTypes.string.isRequired,
    zip_code: PropTypes.string.isRequired,
  }).isRequired,
  getAddress: PropTypes.func.isRequired,
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCRd8fJL6snO_9P95BopUrQBxF8kyZeIJI',
})(MapContainer);
