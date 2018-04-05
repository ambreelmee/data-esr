import React, { Component } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

class AddressModalButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }


  render() {
    const { isLoading } = this.state;
    return (
      <div>
        <Button
          className="m-1 float-right"
          color="primary"
          disabled={isLoading}
          onClick={!isLoading ? this.props.triggerAction : null}
        >
          {isLoading ?
            <div>
              <i className="fa fa-spinner fa-spin " />
              <span className="mx-1"> Modification </span>
            </div> : <div />}
          {this.props.id ? "Modifier l'" : 'Ajouter une '}adresse
        </Button>
      </div>
    );
  }
}

AddressModalButton.propTypes = {
  triggerAction: PropTypes.func.isRequired,
  id: PropTypes.number,
};

AddressModalButton.defaultProps = {
  id: null,
};

export default AddressModalButton;
