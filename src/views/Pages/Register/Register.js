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
      formValidationMessage: ''
    };
    this.onChange = this.onChange.bind(this);
    this.usernameIsValid = this.usernameIsValid.bind(this);
    this.emailIsValid = this.emailIsValid.bind(this);
    this.passwordIsValid = this.passwordIsValid.bind(this);
    this.repeatPasswordIsValid = this.repeatPasswordIsValid.bind(this);
    this.register = this.register.bind(this);
  }


  onChange(event) {
    let state = this.state;
    state[event.target.id].value = event.target.value;
    this.setState(state);
  }

  register(event) {
    event.preventDefault();
    // this.resetValidationStates();
    if (this.formIsValid()) {
      fakeAuth.authenticate(() => {
        this.setState({ redirectToHome: true });
      });
    }
  }

  formIsValid() {
    for (var field in this.state) {
      if (field.hasOwnProperty('isValid') && !field.isValid || !field.value) {
        this.setState({ formValidationMessage: 'formulaire incorrect' });
        return false;
      }
    }
    this.setState({ formValidationMessage: '' });
    return true;
  }

  usernameIsValid() {
    let state = this.state;
    if (state.username.value === 'Ambre') {
      state.username.isValid = false;
      state.username.message = "Ce nom d'utilisateur est déjà pris";
      this.setState(state);

      return false;
    }
    state.username.isValid = true;
    state.username.message = '';
    this.setState(state);
    return true;
  }

  emailIsValid() {
    let state = this.state;
    if (!validator.isEmail(state.email.value)) {
      state.email.isValid = false;
      state.email.message = 'Veuillez entrer une adresse email valide';
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
    if (state.password.value.length < 6) {
      state.password.isValid = false;
      state.password.message = 'Le mot de passe doit comporter au moins 6 caractères';
      this.setState(state);

      return false;
    }
    state.password.isValid = true;
    state.password.message = '';
    this.setState(state);
    return true;
  }

  repeatPasswordIsValid() {
    let state = this.state;
    if (state.password.value !== state.repeatPassword.value) {
      state.repeatPassword.isValid = false;
      state.repeatPassword.message = 'Veuillez entrer le même mot de passe';
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
                  <h1>Inscription</h1>
                  <p className="text-muted">Créez votre compte personnel</p>
                  <InputGroup className="mt-3">
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
                      onBlur={this.usernameIsValid}
                      placeholder="Nom d'utilisateur"
                      className={this.state.username.isValid ? '' : 'is-invalid'}
                    />
                  </InputGroup>
                  <p className="text-danger">{this.state.username.message}</p>
                  <InputGroup className="mt-3">
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
                  <p className="text-danger">{this.state.email.message}</p>
                  <InputGroup className="mt-3">
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
                      onBlur={this.passwordIsValid}
                      placeholder="Mot de passe"
                      className={this.state.password.isValid ? '' : 'is-invalid'}
                    />
                  </InputGroup>
                  <p className="text-danger">{this.state.password.message}</p>
                  <InputGroup className="mt-3">
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
                      onBlur={this.repeatPasswordIsValid}
                      placeholder="Confirmer mot de passe"
                      className={this.state.repeatPassword.isValid ? '' : 'is-invalid'}
                    />
                  </InputGroup>
                  <p className="text-danger">{this.state.repeatPassword.message}</p>
                  <div className="mt-3 d-flex justify-content-end">
                  <div className="p-2 text-danger">{this.state.formValidationMessage}</div>
                    <Button
                      color="success"
                      onClick={this.register}
                    >
                      S&#39;inscrire
                    </Button>
                  </div>
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
