import React, { Component } from 'react';
import {
  Container, Row, Col, Card, CardBody, Button, Input, InputGroup,
  InputGroupAddon, InputGroupText,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import fakeAuth from '../../../authentication';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
      redirectToHome: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.register = this.register.bind(this);
  }

  register() {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToHome: true });
    });
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
                      value={this.state.username}
                      onChange={this.handleChange}
                      placeholder="Username"
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>@</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id="email"
                      type="text"
                      value={this.state.email}
                      onChange={this.handleChange}
                      placeholder="Email"
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
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
                      placeholder="Password"
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id="repeatPassword"
                      type="password"
                      value={this.state.repeatPassword}
                      onChange={this.handleChange}
                      placeholder="Repeat password"
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
