import React, { Component } from 'react';
import { Button, Col } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import btoa from 'btoa';
import PropTypes from 'prop-types';

class LoginLoadingButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errorMessage: '',
      redirectToHome: false,
    };
    this.login = this.login.bind(this);
  }

  login() {
    this.setState({ isLoading: true });
    fetch(`${process.env.PROXY_URL + process.env.API_URL}token`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Basic ${btoa(`${this.props.username}:${this.props.password}`)}`,
      }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.error) {
          this.setState({
            errorMessage: data.message,
            isLoading: false,
          });
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('setupTime', new Date().getTime());
          this.setState({
            redirectToHome: true,
            errorMessage: '',
            isLoading: false,
          });
        }
      });
  }

  render() {
    const { isLoading } = this.state;
    if (this.state.redirectToHome === true) {
      return (
        <Redirect to="/" />
      );
    }
    return (
      <Col xs="6">
        <Button
          color="primary"
          className="px-2"
          disabled={isLoading}
          onClick={!isLoading ? this.login : null}
        >
          {isLoading ?
            <div>
              <i className="fa fa-spinner fa-spin " />
              <span className="mx-1"> Connexion </span>
            </div> :
            'Se connecter'}
        </Button>
        <p className="text-danger mt-2 mb-0">{this.state.errorMessage}</p>
      </Col>
    );
  }
}

LoginLoadingButton.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginLoadingButton;
