import React, { Component } from 'react';
import { Alert, ButtonGroup, ButtonDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

class CodeCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayDropdown: false,
    };
    this.displayDropdown = this.displayDropdown.bind(this);
  }

  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }


  render() {
    return (
      <Alert className="text-center bg-primary w-100 rounded text-light">
        <ButtonGroup className="float-right">
          <ButtonDropdown
            isOpen={this.state.displayDropdown}
            toggle={this.displayDropdown}
          >
            <DropdownToggle className="p-0" color="transparent">
              <i className="fa fa-pencil" />
            </DropdownToggle>
            <DropdownMenu className="rounded">
              <NavLink
                to={`/etablissements/${this.props.institutionId}/identifiants/${this.props.category}`}
                className="dropdown-item rounded alert-secondary"
              >
                  Gérer les identifiants
              </NavLink>
            </DropdownMenu>
          </ButtonDropdown>
        </ButtonGroup>
        <h5>{this.props.category}</h5>
        <h3>{this.props.content}</h3>
      </Alert>
    );
  }
}

CodeCard.propTypes = {
  category: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  institutionId: PropTypes.number.isRequired,
};

export default CodeCard;
