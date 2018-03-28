import React, { Component } from 'react';
import {
  Button, Card, CardBody, CardHeader, Form, FormGroup,
  Input, Label, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import PropTypes from 'prop-types';


class InstitutionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date_start: '',
      date_end: '',
      modal: true,
      name: '',
      errorMessage: '',
    };
    this.triggerAction = this.triggerAction.bind(this);
    this.editInstitution = this.editInstitution.bind(this);
    this.postInstitution = this.postInstitution.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  triggerAction() {
    if (this.props.id) {
      this.editInstitution();
    } else {
      this.postInstitution();
    }
  }

  postInstitution() {
    const institution = {
      name: this.state.name,
      date_start: this.state.date_start ? this.state.date_start : null,
      date_end: this.state.date_end ? this.state.date_end : null,
    };
    fetch(`${process.env.PROXY_URL + process.env.API_URL}institutions`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${localStorage.getItem('token')}:`)}`,
      }),
      body: JSON.stringify(institution),
    })
      .then(res => res.json())
      .then(() => {
        this.setState({
          errorMessage: '',
          modal: !this.state.modal,
        });
        this.props.get_institution();
      })
      .catch(() => {
        this.setState({
          errorMessage: 'Formulaire incomplet',
        });
      });
  }

  editInstitution() {
    const institution = {
      name: this.state.name ? this.state.name : this.props.name,
      date_start: this.state.date_start ? this.state.date_start : this.props.date_start,
      date_end: this.state.date_end ? this.state.date_end : this.props.date_end,
    };
    fetch(`${process.env.PROXY_URL + process.env.API_URL}institutions/${this.props.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${localStorage.getItem('token')}:`)}`,
      }),
      body: JSON.stringify(institution),
    })
      .then(res => res.json())
      .then(() => {
        this.setState({
          modal: !this.state.modal,
        });
      })
      .catch(() => {
        this.setState({
          modal: !this.state.modal,
        });
        this.props.get_institution();
      });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>{this.props.id ? 'Modifier' : 'Créer'} un établissement</ModalHeader>
        <ModalBody>
          <Card>
            {this.props.id ?
              <CardHeader>
                <strong>{this.props.id_esr}</strong> {this.props.name}
              </CardHeader>
              : <div />}
            <CardBody>
              <Form>
                <FormGroup>
                  <Label>Nom de l&#39;établissement</Label>
                  <Input
                    id="name"
                    type="text"
                    value={this.state.name}
                    placeholder={this.props.name}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Date de début d&#39;activité</Label>
                  <Input type="date" id="date_start" value={this.state.date_start} onChange={this.onChange} />
                </FormGroup>
                <FormGroup>
                  <Label>Date de fin d&#39;activité</Label>
                  <Input type="date" id="date_end" value={this.state.date_end} onChange={this.onChange} />
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <p className="text-danger">{this.state.errorMessage}</p>
          <Button color="primary" onClick={this.triggerAction}>{this.props.id ? 'Modifier la fiche' : 'Créer un'} établissement</Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

InstitutionModal.propTypes = {
  id: PropTypes.number,
  id_esr: PropTypes.number,
  name: PropTypes.string,
  date_start: PropTypes.string,
  date_end: PropTypes.string,
  get_institution: PropTypes.func.isRequired,
};

InstitutionModal.defaultProps = {
  id: null,
  id_esr: null,
  name: '',
  date_start: '',
  date_end: '',
};

export default InstitutionModal;
