import React, { Component } from 'react';
import { DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';


import CodeAddModal from './CodeAddModal';


class CodeDropdown extends Component {
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
          <CodeAddModal
            category={this.props.category}
            categoryId={this.props.categoryId}
            etablissement_id={this.props.etablissement_id}
            getCodes={this.props.getCodes}
            toggleModal={this.toggleModal}
          /> : <div />}
      </DropdownItem>
    );
  }
}

CodeDropdown.propTypes = {
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  etablissement_id: PropTypes.number.isRequired,
  getCodes: PropTypes.func.isRequired,
};

export default CodeDropdown;
