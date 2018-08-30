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
      <Alert color="secondary" className="text-center w-100 rounded">
        <ButtonGroup className="float-right">
          <ButtonDropdown
            isOpen={this.state.displayDropdown}
            toggle={this.displayDropdown}
          >
            <DropdownToggle caret className="p-0 text-dark" color="transparent">
              <i className="icon-settings" />
            </DropdownToggle>
            <DropdownMenu>
              <NavLink to={`/etablissements/${this.props.institutionId}/identifiants`} className="dropdown-item" >
                <i className="fa fa-arrow-right text-info" />
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
