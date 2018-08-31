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
      <Alert color="warning" className="text-center rounded ml-2">
        <ButtonGroup className="float-right">
          <ButtonDropdown
            isOpen={this.state.displayDropdown}
            toggle={this.displayDropdown}
          >
            <DropdownToggle caret className="p-0 text-dark" color="transparent">
              <i className="icon-settings" />
            </DropdownToggle>
            <DropdownMenu className="rounded">
              <NavLink
                to={`/etablissements/${this.props.institutionId}/tags/${this.props.category}`}
                className="dropdown-item alert-secondary rounded"
              >
                <i className="fa fa-arrow-right text-info" />
                  Gérer les tags
              </NavLink>
            </DropdownMenu>
          </ButtonDropdown>
        </ButtonGroup>
        <h6>{this.props.category.replace('_', ' ')}</h6>
        <h5 className="mb-0">{this.props.long_label}</h5>
      </Alert>
    );
  }
}

CodeCard.propTypes = {
  category: PropTypes.string.isRequired,
  long_label: PropTypes.string.isRequired,
  institutionId: PropTypes.number.isRequired,
};

export default CodeCard;
