import React, { Component } from 'react';
import {
  Button, ButtonDropdown, ButtonGroup, Col, DropdownItem, DropdownMenu, DropdownToggle,
  FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Redirect from 'react-router-dom';

class TagAddModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date_start: null,
      date_end: null,
      displayDropdown: false,
      errorMessage: '',
      isLoading: false,
      modal: true,
      categoryId: null,
      tagCategories: [],
      tagId : null,
      tags: [],
      status: 'active',
    };
    this.addTagging = this.addTagging.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
    this.onSelectorChange = this.onSelectorChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    this.getCategoryTags();
    this.getTags()
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  onRadioChange(event) {
    this.setState({ status: event.target.id });
  }

  onSelectorChange(event) {
    this.setState({
      [event.target.id]: document.getElementById(`${event.target.id}`).value,
    });
  }

  getCategoryTags() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institution_tag_categories`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          tagCategories: data,
          isLoading: false,
        });
      });
  }

  getTags() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institution_tags`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          tags: data,
          isLoading: false,
        });
      });
  }


  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
      errorMessage: '',
    });
  }

  addTagging() {
    this.setState({ isLoading: true });
    const institution_tagging = {
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      status: this.state.status,
    };
    fetch(`${process.env.API_URL_STAGING}institutions/${this.props.etablissementId}/tags/${this.state.tagId}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: JSON.stringify(institution_tagging),
    })
      .then((res) => {
        if (res.ok) {
          res.json()
            .then((data) => {
              if (data === 'Record not found') {
                this.setState({
                  errorMessage: "Erreur lors de l'envoi du formulaire",
                  isLoading: false,
                });
              } else {
                this.toggle();
                this.setState({ isLoading: false });
                this.props.getInstitutionTags(this.props.etablissementId);
              }
            });
        } else {
          this.setState({
            errorMessage: "Erreur lors de l'envoi du formulaire",
            isLoading: false,
          });
        }
      });
  }


  renderCategories() {
    return this.state.tagCategories.map(category => (
      <option key={category.id} value={category.id}>{category.title}</option>
    ));
  }

  renderTags() {
    const categoryTitle = this.state.tagCategories.find(category => category.id.toString() === this.state.categoryId);
    let tags = [];
    if (categoryTitle) {
      tags = this.state.tags.filter(tag => tag.category === categoryTitle.title);
    } else {
      tags = this.state.tags;
    }
    return tags.map(tag => (
      <option key={tag.id} value={tag.id}>{tag.long_label}</option>
    ));
  }

  render() {
    if (this.state.categoryId === 'redirect') {
      return <Redirect to="/categories" />;
    }
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Ajouter une nouvelle caractérisation
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs="6">
              <select
                id="categoryId"
                className="form-control"
                onChange={this.onSelectorChange}
              >
                <option value="0">Catégorie</option>
                {this.renderCategories()}
                <option value="redirect">Gérer les catégories...</option>
              </select>
            </Col>
            <Col xs="6">
              <select
                id="tagId"
                className="form-control"
                onChange={this.onSelectorChange}
              >
                <option value="0">Caractérisation</option>
                {this.renderTags()}
                <option value="redirect">Gérer les catégories...</option>
              </select>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <FormGroup>
                <Label>Date de début</Label>
                <Input
                  type="date"
                  id="date_start"
                  value={this.state.date_start || ''}
                  placeholder=""
                  onChange={this.onChange}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  id="date_end"
                  value={this.state.date_end ? this.state.date_end : ''}
                  placeholder=""
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label>Statut</Label>
                </Col>
                <Col md="9">
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="active"
                      name="status"
                      value="active"
                      defaultChecked
                      onChange={this.onRadioChange}
                    />
                    <Label className="form-check-label" check htmlFor="active">Actif</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="archived"
                      name="status"
                      value="archived"
                      onChange={this.onRadioChange}
                    />
                    <Label className="form-check-label" check htmlFor="archived">Archivé</Label>
                  </FormGroup>
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <p className="mt-2 text-danger">{this.state.errorMessage}</p>
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.state.isLoading}
            onClick={!this.state.isLoading ? this.addTagging : null}
          >
            {this.state.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Ajout </span>
              </div> : <div>Ajouter</div>}
          </Button>
          <Button color="secondary" onClick={this.toggle}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

TagAddModal.propTypes = {
  etablissementId: PropTypes.number.isRequired,
  getInstitutionTags: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default TagAddModal;
