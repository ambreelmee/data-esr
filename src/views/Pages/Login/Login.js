import React, { Component } from 'react';
import {
  Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup,
  InputGroupAddon, InputGroupText,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import fakeAuth from '../../../authentication';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      redirectToHome: false,
      redirectToRegister: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.redirectToRegister = this.redirectToRegister.bind(this);
  }

  login() {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToHome: true });
    });
  }

  redirectToRegister() {
    this.setState({ redirectToRegister: true });
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  render() {
    if (this.state.redirectToHome === true) {
      return (
        <Redirect to="/" />
      );
    }
    if (this.state.redirectToRegister === true) {
      return (
        <Redirect to="/register" />
      );
    }
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Connexion</h1>
                    <p className="text-muted">Connectez-vous à votre espace personnel</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        id="username"
                        type="text"
                        value={this.state.username}
                        onChange={this.handleChange}
                        placeholder="Identifiant"
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        id="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        placeholder="Mot de passe"
                      />
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button
                          color="primary"
                          className="px-2"
                          onClick={this.login}
                        >
                          Se connecter
                        </Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button color="link" className="px-0">Mot de passe oublié ?</Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: `${44}%` }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Inscription</h2>
                      <p>Si vous n&#39;avez pas encore de compte, inscrivez-vous en cliquant sur le bouton ci-dessous
                      </p>
                      <Button
                        color="primary"
                        className="mt-3"
                        active
                        onClick={this.redirectToRegister}
                      >
                      S&#39;inscrire !
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
