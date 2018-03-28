import React, { Component } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import InstitutionModal from './ModalInstitution';


class Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDeleted: false,
      modal: false,
    };
    this.deleteInstitution = this.deleteInstitution.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  deleteInstitution() {
    fetch(`${process.env.PROXY_URL + process.env.API_URL}institutions/${this.props.id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${localStorage.getItem('token')}:`)}`,
      }),
    })
      .then(res => res.json())
      .then(() => {
        this.setState({
          isDeleted: true,
        });
      });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    if (this.state.isDeleted) {
      return '';
    }
    return (
      <tr>
        <td>{this.props.id_esr}</td>
        <td>{this.props.name}</td>
        <td>{this.props.date_start ? this.props.date_start.split(' ', 4).join(' ') : ''}</td>
        <td>{this.props.date_end ? this.props.date_end.split(' ', 4).join(' ') : ''}</td>
        <td>
          <Button color="danger" size="sm" onClick={this.deleteInstitution}>Supprimer</Button>
          <Button size="sm" onClick={this.toggleModal}>Editer</Button>
          {this.state.modal ?
            (<InstitutionModal
              id={this.props.id}
              id_esr={this.props.id_esr}
              name={this.props.name}
              date_start={this.props.date_start}
              date_end={this.props.date_end}
              get_institution={this.props.get_institution}
            />) : <div /> }
        </td>
      </tr>
    );
  }
}

Item.propTypes = {
  id: PropTypes.number.isRequired,
  id_esr: PropTypes.number,
  name: PropTypes.string.isRequired,
  date_start: PropTypes.string.isRequired,
  date_end: PropTypes.string,
  get_institution: PropTypes.func.isRequired,
};

Item.defaultProps = {
  id_esr: null,
  date_end: '',
};

export default Item;
