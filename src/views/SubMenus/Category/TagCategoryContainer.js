import React, { Component } from 'react';
import { Button, Col, Card, CardHeader, CardFooter, CardBody } from 'reactstrap';

import CategoryTag from './CategoryTag';
import CategoryTagModal from './CategoryTagModal';

class TagCategoryContainer extends Component {
  constructor(props) {
    super(props);

    this.toggleModal = this.toggleModal.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.state = {
      institution_tags: [],
      institution_tag_categories: [],
      modal: false,
      isLoading: false,
    };
  }

  componentWillMount() {
    this.getCategories('institution_tag_categories');
    this.getCategories('institution_tags');
  }


  getCategories(category) {
    this.setState({
      isLoading: true,
      modal: false,
    });
    fetch(`${process.env.API_URL_STAGING}${category}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          [category]: data,
          isLoading: false,
        });
      });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  renderInstitutionCategoryTags() {
    return this.state.institution_tag_categories.map(category =>
      (<CategoryTag
        key={`tag-${category.id}`}
        getCategories={this.getCategories}
        id={category.id}
        origin={category.origin ? category.origin : ''}
        title={category.title}
        tags={this.state.institution_tags.filter(tag => tag.category === category.title)}
      />));
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    return (
      <Col xs="12" md="7">
        <Card className="mt-4">
          <CardHeader>
            <h5>Nomenclatures</h5>
          </CardHeader>
          <CardBody>
            <div>
              Les tags qui peuvent être associés à un établissement sont répartis en différent catégories.
              Cliquer sur le menu déroulant pour faire apparaître l&#39;ensemble des tags associés à une catégorie.
            </div>
            {this.renderInstitutionCategoryTags()}
          </CardBody>
          <CardFooter>
            <Button color="primary" className="float-right" onClick={() => this.toggleModal('institution_tagModal')}>
              <i className="fa fa-plus mr-1" /> Ajouter une catégorie
            </Button>
            {this.state.modal ?
              <CategoryTagModal
                getCategories={this.getCategories}
                toggleModal={this.toggleModal}
              /> : <div /> }
          </CardFooter>
        </Card>
      </Col>
    );
  }
}

export default TagCategoryContainer;
