import React, { Component } from 'react';
import { Badge, Button, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';


class Name extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltip: false,
      isLoading: false,
    };
    this.toggleToolTip = this.toggleToolTip.bind(this);
    this.deleteName = this.deleteName.bind(this);
  }

  deleteName() {
    this.setState({ isLoading: true });
    fetch(
      `${process.env.API_URL_STAGING}institutions/${this.props.etablissement_id}/institution_names/${this.props.id}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ address: { id: this.props.id } }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isLoading: false,
        });
        this.props.getNames();
      });
  }

  toggleToolTip() {
    this.setState({
      tooltip: !this.state.tooltip,
    });
  }

  render() {
    return (
      <div>
        <Badge
          color={this.props.status === 'active' ? 'success' : 'danger'}
          className="float-right"
        >
          {this.props.status}
        </Badge>
        <h2 className="text-center">{`${this.props.initials} - ${this.props.text}`}</h2>
        {this.props.date_start ?
          <span className="mr-1">depuis:</span> :
          <span />}{this.props.date_start}
        {this.props.date_end ?
          <span><br /><span className="mr-1">jusqu&#39;au :</span></span> :
          <span />}{this.props.date_end}
        {this.props.status === 'active' ? <span /> :
        <span>
          <Button
            id={`button-${this.props.id}`}
            outline
            className="float-right"
            color="danger"
            size="sm"
            disabled={this.state.isLoading}
            onClick={this.deleteName}
          >
            {this.state.isLoading ?
              <i className="fa fa-spinner fa-spin " /> :
              <i className="icon-close" />}
          </Button>
          <Tooltip
            placement="bottom"
            isOpen={this.state.tooltip}
            target={`button-${this.props.id}`}
            toggle={this.toggleToolTip}
          >
            {this.state.isLoading ? 'Suppression...' : 'Supprimer'}
          </Tooltip>
        </span>}
      </div>
    );
  }
}

Name.propTypes = {
  initials: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date_start: PropTypes.string,
  date_end: PropTypes.string,
  id: PropTypes.number.isRequired,
  etablissement_id: PropTypes.number,
  getNames: PropTypes.func,
  status: PropTypes.string.isRequired,
};

Name.defaultProps = {
  date_start: null,
  date_end: null,
  etablissement_id: null,
  getNames: null,
};

export default Name;
