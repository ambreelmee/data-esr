import React, { Component } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

class UpdatePositionButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.UpdatePosition = this.UpdatePosition.bind(this);
  }

  UpdatePosition() {
    this.setState({ isLoading: true });
    const position = {
      latitude: this.props.selectedLat,
      longitude: this.props.selectedLng,
    };
    fetch(
      `${process.env.API_URL_STAGING}institutions/1/addresses/${this.props.id}`,
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
        this.setState({
          isLoading: false,
        });
        this.props.getAddresses();
      });
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div>
        <Button
          className="m-1 float-right"
          color="secondary"
          disabled={isLoading}
          onClick={!isLoading ? this.UpdatePosition : null}
        >
          {isLoading ?
            <div>
              <i className="fa fa-spinner fa-spin " />
              <span className="mx-1"> Modification </span>
            </div> :
            'Corriger les coordonnées gps'}
        </Button>
      </div>
    );
  }
}

UpdatePositionButton.propTypes = {
  id: PropTypes.number.isRequired,
  getAddresses: PropTypes.func.isRequired,
  selectedLat: PropTypes.number.isRequired,
  selectedLng: PropTypes.number.isRequired,
};

export default UpdatePositionButton;
