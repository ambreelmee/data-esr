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
      <Alert className="text-center text-light rounded ml-2 mb-1 p-1" style={{ backgroundColor: '#5C66FF' }}>
        {this.props.category ?
          <ButtonGroup className="float-right">
            <ButtonDropdown
              isOpen={this.state.displayDropdown}
              toggle={this.displayDropdown}
            >
              <DropdownToggle className="p-0 text-light" color="transparent">
                <i className="fa fa-pencil" />
              </DropdownToggle>
              <DropdownMenu className="rounded">
                <NavLink
                  to={`/etablissements/${this.props.institutionId}/tags/${this.props.category}`}
                  className="dropdown-item alert-secondary rounded"
                >
                    Gérer les tags
                </NavLink>
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup> :
          <div>
            <NavLink
              to={`/etablissements/${this.props.institutionId}/tags/0`}
              className="text-light"
              style={{ wordBreak: 'normal' }}
            >
              <i className="fa fa-plus fa-2x ml-1" />
            </NavLink>
            <h5>Ajouter un tag</h5>
          </div>}
        <h6 className="mb-0">{this.props.long_label}</h6>
      </Alert>
    );
  }
}

CodeCard.propTypes = {
  category: PropTypes.string,
  long_label: PropTypes.string,
  institutionId: PropTypes.number.isRequired,
};

CodeCard.defaultProps = {
  category: null,
  long_label: null,
};

export default CodeCard;
