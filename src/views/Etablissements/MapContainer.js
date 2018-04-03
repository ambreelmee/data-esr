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

    this.onNewMarkerClick = this.onNewMarkerClick.bind(this);
    this.getNewAddress = this.getNewAddress.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
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
      lat: this.state.selectedLat,
      lng: this.state.selectedLng,
    };
    fetch(`${process.env.PROXY_URL + process.env.API_URL}institutions`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${localStorage.getItem('token')}:`)}`,
      }),
      body: JSON.stringify(position),
    })
      .then(res => res.json())
      .then(() => {
        this.props.getAddress();
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
      lat: this.props.savedAddress.lat,
      lng: this.props.savedAddress.lng,
    };
    const zipAndCity = `${this.props.savedAddress.zip_code} ,${this.props.savedAddress.city}`;

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
              <p>{this.props.savedAddress.address1}
                {this.props.savedAddress.address2 ? <br /> : <span />}
                {this.props.savedAddress.address2}<br />
                {zipAndCity}<br />
                {this.props.savedAddress.country}
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
          <Button className="m-1 float-right" color="secondary"> Corriger les coordonnées gps </Button> :
          <div />}
      </div>
    );
  }
}

MapContainer.propTypes = {
  savedAddress: PropTypes.shape({
    business_name: PropTypes.string.isRequired,
    address1: PropTypes.string.isRequired,
    address2: PropTypes.string.isRequired,
    zip_code: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  getAddress: PropTypes.func.isRequired,
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCRd8fJL6snO_9P95BopUrQBxF8kyZeIJI',
})(MapContainer);
