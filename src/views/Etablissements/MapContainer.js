import React, { Component } from 'react';
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
      selectedPlace: {},
      showNewMarker: false,
      newMarkerPosition: {},
      newFormattedAddress: '',
    };

    this.onNewMarkerClick = this.onNewMarkerClick.bind(this);
    this.getFormattedAdress = this.getFormattedAdress.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
  }

  onMarkerClick(props, marker) {
    this.setState({
      selectedPlace: props,
      savedMarker: marker,
      showingInfoWindow: !this.state.showingInfoWindow,
    });
  }

  onNewMarkerClick(props, marker) {
    this.setState({
      selectedPlace: props,
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
      });
    }
  }

  getFormattedAdress() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ latLng: this.state.newMarkerPosition }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        console.log(results[0].formatted_address)
        this.setState({
          newFormattedAddress: results[0].formatted_address,
        });
      }
    });
  }

  render() {
    const style = {
      width: '100vw',
      height: '100vh',
    };
    if (this.state.showNewMarker) {
      this.getFormattedAdress();
    }

    return (
      <div style={style}>
        <Map
          google={this.props.google}
          initialCenter={{
           lat: 48.849607,
           lng: 2.343567,
         }}
          zoom={15}
          onClick={this.onMapClicked}
        >
          <Marker
            onClick={this.onMarkerClick}
            title="Cliquer pour afficher l'adresse"
            name="Université de la Sorbonne"
            adresse="La Sorbonne, 1 Rue Victor Cousin, 75005 Paris, France"
            position={{ lat: 48.849607, lng: 2.343567 }}
          />
          {this.state.showNewMarker ?
            <Marker
              onClick={this.onNewMarkerClick}
              title="Cliquer pour afficher l'adresse"
              adresse={this.state.newFormattedAddress}
              name="Université de la Sorbonne"
              position={this.state.newMarkerPosition}
            />
            : <div />
          }
          <InfoWindow
            marker={this.state.savedMarker}
            visible={this.state.showingInfoWindow}
          >
            <div>
              <h4>{this.state.selectedPlace.name}</h4>
              <p>{this.state.selectedPlace.adresse}</p>
            </div>
          </InfoWindow>
          <InfoWindow
            marker={this.state.newMarker}
            visible={this.state.showingInfoWindowNewMarker}
          >
            <div>
              <h4>{this.state.selectedPlace.name}</h4>
              <p>{this.state.selectedPlace.adresse}</p>
            </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

MapContainer.propTypes = {
  savedAddress: PropTypes.shape({
    business_name: PropTypes.string.isRequired,
    adresse1: PropTypes.string.isRequired,
    adresse2: PropTypes.string.isRequired,
    zip_code: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }).isRequired
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCRd8fJL6snO_9P95BopUrQBxF8kyZeIJI',
})(MapContainer);
