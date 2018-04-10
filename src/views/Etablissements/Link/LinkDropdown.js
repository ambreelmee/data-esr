import React, { Component } from 'react';
import { DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';


import LinkModal from './LinkModal';


class LinkDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <DropdownItem onClick={this.toggleModal}>
        {this.props.category}
        {this.state.modal ?
          <LinkModal
            categoryId={this.props.categoryId}
            category={this.props.category}
            etablissement_id={this.props.etablissement_id}
            getLinks={this.props.getLinks}
            toggleModal={this.toggleModal}
          /> : <div /> }
      </DropdownItem>
    );
  }
}

LinkDropdown.propTypes = {
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  etablissement_id: PropTypes.number.isRequired,
  getLinks: PropTypes.func.isRequired,
};

export default LinkDropdown;
