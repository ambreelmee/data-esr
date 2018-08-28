import React, { Component } from 'react';
import {
  ButtonGroup, ButtonDropdown, Card, CardBody,
  DropdownMenu, DropdownToggle,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

class ConnectionCard extends Component {
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
      <Card className="mb-0 mt-2 w-100 bg-muted rounded">
        <CardBody>
          <ButtonGroup className="float-right">
            <ButtonDropdown
              isOpen={this.state.displayDropdown}
              toggle={this.displayDropdown}
            >
              <DropdownToggle caret className="p-0" color="light">
                <i className="icon-settings" />
              </DropdownToggle>
              <DropdownMenu>
                <NavLink to={`/etablissements/${this.props.institutionId}/rattachements`} className="dropdown-item" >
                  <i className="fa fa-arrow-right text-info" />
                    Gérer les rattachements
                </NavLink>
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
          {this.props.mothers.length > 0 ?
            <div>
              <h4>{this.props.mothers.length === 1 ? <div><strong>1</strong> rattachement mère</div> :
              <div><strong>{this.props.mothers.length}</strong>rattachements mères</div>}
              </h4>
              {this.props.mothers.map(mother => (
                <NavLink key={mother.mother.id} to={`/etablissements/${mother.mother.id}`}>
                  {mother.mother.name} ({mother.connection.category})
                </NavLink>))}
            </div> : <div />}
          {this.props.daughters.length > 0 ?
            <div>
              <h4>{this.props.daughters.length === 1 ? <div><strong>1</strong> rattachement fille</div> :
              <div><strong>{this.props.daughters.length}</strong>rattachements filles</div>}
              </h4>
              {this.props.daughters.map(daughter => (
                <NavLink key={daughter.daughter.id} to={`/etablissements/${daughter.daughter.id}`}>
                  {daughter.daughter.name} ({daughter.connection.category})
                </NavLink>))}
            </div> : <div />}
          {this.props.mothers.length === 0 && this.props.daughters.length === 0 ?
            <h4>0 rattachement</h4>
             : <div />}
        </CardBody>
      </Card>
    );
  }
}

ConnectionCard.propTypes = {
  daughters: PropTypes.array.isRequired,
  institutionId: PropTypes.number.isRequired,
  mothers: PropTypes.array.isRequired,
};

export default ConnectionCard;
