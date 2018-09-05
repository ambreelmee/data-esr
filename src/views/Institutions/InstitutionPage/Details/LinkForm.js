import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import UpdateFormButton from './UpdateFormButton';

const icons = [
  { category: 'youtube' , prefix: 'https://www.youtube.com/user/' },
  { category: 'facebook', prefix: 'https://www.facebook.com/' },
  { category: 'wikipedia', prefix: 'https://fr.wikipedia.org/wiki/' },
  { category: 'twitter', prefix: 'https://twitter.com/' },
  { category: 'tumblr' },
  { category: 'linkedin', prefix: 'https://www.linkedin.com/school/' },
  { category: 'instagram', prefix: 'https://www.instagram.com/' },
];

class LinkForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryId: null,
      content: this.props.content,
    };
    this.onChange = this.onChange.bind(this);
    this.onSelectorChange = this.onSelectorChange.bind(this);
    this.triggerAction = this.triggerAction.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const nextCategory = nextProps.linkCategories.find(category => category.title === nextProps.category);
    this.setState({
      categoryId: nextCategory ? nextCategory.id.toString() : 0,
      ...nextProps,
      id: nextProps.id ? nextProps.id : 0,
    });
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  onSelectorChange(event) {
    const categoryId = document.getElementById(`${event.target.id}`).value
    const categoryName = this.props.linkCategories.find(category => category.id.toString() === categoryId)
    const categoryPrefix = icons.find(icon => icon.category === categoryName.title)
    const prefix = categoryPrefix && categoryPrefix.prefix ? categoryPrefix.prefix : 'http://'
    this.setState({
      [event.target.id]: document.getElementById(`${event.target.id}`).value,
      content: prefix,
    });
  }

  triggerAction() {
    const link = {
      content: this.state.content,
      link_category_id: this.state.categoryId,
    };
    const jsonBody = JSON.stringify({ link });
    if (this.props.id) {
      const url = `${process.env.API_URL_STAGING}links/${this.props.id}`;
      this.props.addContent(url, jsonBody, 'PUT', this.props.institutionId);
    } else {
      const url = `${process.env.API_URL_STAGING}institutions/${this.props.institutionId}/links`;
      this.props.addContent(url, jsonBody, 'POST', this.props.institutionId);
    }
  }

  renderCategories() {
    return this.props.linkCategories.map(category => (
      <option key={category.id} value={category.id}>{category.title}</option>
    ));
  }

  render() {
    return (
      <Col md="8 p-0">
        <Card>
          <CardBody>
            <Row>
              <Col xs="4">
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
              <Col>
                <Input
                  id="content"
                  value={this.state.content}
                  placeholder="lien"
                  onChange={this.onChange}
                />
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            {this.props.id ?
              <Button
                className="float-left rounded mt-1"
                color="danger"
                onClick={
                  () => this.props.toggleDeleteModal(`${process.env.API_URL_STAGING}links/${this.props.id}`)}
              >
                Supprimer
              </Button> : <div />}
            <UpdateFormButton
              hasErrored={this.props.hasErrored}
              isLoading={this.props.isLoading}
              color={this.props.id ? 'secondary' : 'primary'}
              message={this.props.id ? 'Modifier le lien' : 'Ajouter un lien'}
              triggerAction={this.triggerAction}
            />
          </CardFooter>
        </Card>
      </Col>

    );
  }
}

LinkForm.propTypes = {
  addContent: PropTypes.func.isRequired,
  category: PropTypes.string,
  content: PropTypes.string,
  hasErrored: PropTypes.bool.isRequired,
  id: PropTypes.number,
  institutionId: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  prefix: PropTypes.string.isRequired,
  linkCategories: PropTypes.array.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
};

LinkForm.defaultProps = {
  category: '',
  content: '',
  id: null,
};

export default LinkForm;
