import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import UpdateFormButton from './UpdateFormButton';

class TagForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date_start: this.props.date_start,
      date_end: this.props.date_end,
      categoryId: null,
      id: this.props.id,
      status: this.props.status,
    };
    this.onChange = this.onChange.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
    this.onSelectorChange = this.onSelectorChange.bind(this);
    this.triggerAction = this.triggerAction.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const nextCategory = nextProps.tagCategories.find(category => category.title === nextProps.category);
    this.setState({
      categoryId: nextCategory ? nextCategory.id.toString() : 0,
      ...nextProps,
      id: nextProps.id ? nextProps.id : 0,
    });
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

  triggerAction() {
    const institution_tagging = {
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      status: this.state.status,
    };
    const jsonBody = JSON.stringify(institution_tagging);
    if (this.props.id) {
      const url = `${process.env.API_URL_STAGING}institutions/${this.props.institutionId}/tags/${this.state.id}`;
      this.props.addContent(url, jsonBody, 'PUT', this.props.institutionId);
    } else {
      const url = `${process.env.API_URL_STAGING}institutions/${this.props.institutionId}/tags/${this.state.id}`;
      this.props.addContent(url, jsonBody, 'POST', this.props.institutionId);
    }
  }

  renderCategories() {
    return this.props.tagCategories.map(category => (
      <option key={category.id} value={category.id}>{category.title}</option>
    ));
  }

  renderTags() {
    const categoryTitle = this.props.tagCategories.find(category => category.id.toString() === this.state.categoryId);
    let tags = [];
    if (categoryTitle) {
      tags = this.props.tags.filter(tag => tag.category === categoryTitle.title);
    } else {
      tags = this.props.tags;
    }
    return tags.map(tag => (
      <option key={tag.id} value={tag.id}>{tag.long_label}</option>
    ));
  }

  render() {
    return (
      <Col md="8 p-0">
        <Card>
          <CardBody>
            <Row>
              <Col xs="6">
                <select
                  id="categoryId"
                  className="form-control"
                  onChange={this.onSelectorChange}
                  value={this.state.categoryId}
                >
                  <option value="0">Catégorie</option>
                  {this.renderCategories()}
                </select>
              </Col>
              <Col xs="6">
                <select
                  id="id"
                  className="form-control"
                  onChange={this.onSelectorChange}
                  value={this.state.id}
                >
                  <option value="0">Caractérisation</option>
                  {this.renderTags()}
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
          </CardBody>
          <CardFooter>
            {this.props.id ?
              <Button
                className="float-left rounded mt-1"
                color="danger"
                onClick={
                  () => this.props.toggleDeleteModal(`${process.env.API_URL_STAGING}institution_tags/${this.props.id}`)}
              >
                Supprimer
              </Button> : <div />}
            <UpdateFormButton
              hasErrored={this.props.hasErrored}
              isLoading={this.props.isLoading}
              color={this.props.id ? 'secondary' : 'primary'}
              message={this.props.id ? 'Modifier le tag' : 'Ajouter un tag'}
              triggerAction={this.triggerAction}
            />
          </CardFooter>
        </Card>
      </Col>

    );
  }
}

TagForm.propTypes = {
  addContent: PropTypes.func.isRequired,
  id: PropTypes.number,
  category: PropTypes.string,
  date_start: PropTypes.string,
  date_end: PropTypes.string,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  status: PropTypes.string,
  toggleDeleteModal: PropTypes.func.isRequired,
  institutionId: PropTypes.number.isRequired,
  tagCategories: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
};

TagForm.defaultProps = {
  category: '',
  date_start: null,
  date_end: null,
  id: null,
  status: 'active',
};

export default TagForm;
