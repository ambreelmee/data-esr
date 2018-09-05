import React, { Component } from 'react';
import { Badge, Card, CardBody } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';


class SearchResultCard extends Component {
  renderTags() {
    return this.props.tags.map(tag => (
      <Badge key={`${this.props.name.initials}-tag-${tag.id}`} pill className="mx-1 p-2 violet">
        {tag.short_label}
      </Badge>));
  }

  render() {
    return (
      <Card className={`mb-2 rounded my-shadow w-100 h-100 card-accent-${!this.props.date_end ? 'primary' : 'danger'}`}>
        <NavLink className="nav-link text-muted" to={`${this.props.type}/${this.props.id}`}>
          <CardBody className="px-3 py-1 d-flex flex-column justify-content-center">
            <div>
              <h4 className="mb-0 text-primary">
                <strong>{this.props.name}
                </strong>
              </h4>
            </div><br />
            {this.props.mainCode ?
              <div>
                <i className="fa fa-th text-secondary mr-1" />
                <strong>{this.props.mainCode}</strong><br />
              </div> : <div />}
            {this.props.address.length > 1 ?
              <div>
                <i className="fa fa-map-marker fa-lg mr-1" />
                {this.props.address.toProperCase()}<br />
              </div> : <div />}
            {this.props.tags.length > 0 ? <div> {this.renderTags()} <br /></div> : <div />}
            {this.props.date_end ?
              <span className="text-danger">
                fermé depuis le {moment(this.props.date_end).format('LL')}
              </span> : <div />}
          </CardBody>
        </NavLink>
      </Card>
    );
  }
}

SearchResultCard.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  mainCode: PropTypes.string.isRequired,
  date_end: PropTypes.string,
  id: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

SearchResultCard.defaultProps = {
  date_end: null,
};

export default SearchResultCard;
