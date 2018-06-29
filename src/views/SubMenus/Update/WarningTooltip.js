import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';


class WarningTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayWarning: false,
    };
    this.displayWarning = this.displayWarning.bind(this);
  }


  displayWarning() {
    this.setState({
      displayWarning: !this.state.displayWarning,
    });
  }


  render() {
    return (
      <Tooltip
        boundary={this.props.boundary}
        isOpen={this.state.displayWarning}
        placement="bottom"
        target={this.props.target}
        toggle={this.displayWarning}
      >
      La valeur actuellement enregistrée a changé depuis la création du conflit. Celui-ci n&#39;est peut-être plus d&#39;actualité
      </Tooltip>);
  }
}

WarningTooltip.propTypes = {
  boundary: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
};

export default WarningTooltip;
