import React, { Component } from 'react';
import {
  Container, Row, Col, Card, CardBody, Button, Input, InputGroup,
  InputGroupAddon, InputGroupText,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import validator from 'validator';
import fakeAuth from '../../../authentication';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: { value: '', isValid: true, message: '' },
      email: { value: '', isValid: true, message: '' },
      password: { value: '', isValid: true, message: '' },
      repeatPassword: { value: '', isValid: true, message: '' },
      redirectToHome: false,
    };
    this.onChange = this.onChange.bind(this);
    this.emailIsValid = this.emailIsValid.bind(this);
    this.passwordIsValid = this.passwordIsValid.bind(this);
    this.register = this.register.bind(this);
  }


  onChange(event) {
    let state = this.state;
    state[event.target.id].value = event.target.value;
    this.setState(state);
  }

  register(event) {
    event.preventDefault();
    this.resetValidationStates();
    if (this.formIsValid()) {
      fakeAuth.authenticate(() => {
        this.setState({ redirectToHome: true });
      });
    }
  }

  emailIsValid() {
    let state = this.state;
    if (!validator.isEmail(state.email.value)) {
      state.email.isValid = false;
      state.email.message = 'Not a valid email address';
      this.setState(state);

      return false;
    }
    state.email.isValid = true;
    state.email.message = '';
    this.setState(state);
    return true;
  }

  passwordIsValid() {
    let state = this.state;
    if (state.password.value !== state.repeatPassword.value) {
      state.repeatPassword.isValid = false;
      state.repeatPassword.message = 'Not the same password';
      this.setState(state);

      return false;
    }
    state.repeatPassword.isValid = true;
    state.repeatPassword.message = '';
    this.setState(state);
    return true;
  }

  resetValidationStates() {
    let state = this.state;
    Object.keys(state).map((key) => {
      if (state[key].hasOwnProperty('isValid')) {
        state[key].isValid = true;
        state[key].message = '';
      }
    });
    this.setState(state);
  }

  render() {
    if (this.state.redirectToHome === true) {
      return (
        <Redirect to="/" />
      );
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-user" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id="username"
                      type="text"
                      value={this.state.username.value}
                      onChange={this.onChange}
                      placeholder="Username"
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>@</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id="email"
                      type="email"
                      value={this.state.email.value}
                      onChange={this.onChange}
                      onBlur={this.emailIsValid}
                      placeholder="Email"
                      className={this.state.email.isValid ? '' : 'is-invalid'}
                    />
                  </InputGroup>
                  <p>{this.state.email.message}</p>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id="password"
                      type="password"
                      value={this.state.password.value}
                      onChange={this.onChange}
                      placeholder="Password"
                    />
                  </InputGroup>
                  <div>{this.state.repeatPassword.message}</div>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id="repeatPassword"
                      type="password"
                      value={this.state.repeatPassword.value}
                      onChange={this.onChange}
                      onBlur={this.passwordIsValid}
                      placeholder="Repeat password"
                      className={this.state.repeatPassword.isValid ? '' : 'is-invalid'}
                    />
                  </InputGroup>
                  <Button
                    color="success"
                    onClick={this.register}
                  >
                    Create Account
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
