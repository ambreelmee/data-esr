import React, { Component } from 'react';
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

class InputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  render() {
    return (
      <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className="icon-user" />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          id="this.props.id"
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Username"
        />
      </InputGroup>
    );
  }
}

export default InputField;
