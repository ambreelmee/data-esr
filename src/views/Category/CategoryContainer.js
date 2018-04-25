import React, { Component } from 'react';
import { Button, Col, Card, CardHeader, CardFooter, CardBody, Row } from 'reactstrap';

import Category from './Category';
import CategoryTag from './CategoryTag';
import CategoryTagModal from './CategoryTagModal';
import CategoryModal from './CategoryModal';

class CategoryContainer extends Component {
  constructor(props) {
    super(props);

    this.toggleModal = this.toggleModal.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.state = {
      codeModal: false,
      institution_connection_categories: [],
      institution_connectionModal: false,
      institution_evolution_categories: [],
      institution_evolutionModal: false,
      institution_tags: [],
      institution_tag_categories: [],
      institution_tagyModal: false,
      isLoading: false,
      code_categories: [],
      link_categories: [],
      linkModal: false,
    };
  }

  componentWillMount() {
    this.getCategories('link_categories');
    this.getCategories('code_categories');
    this.getCategories('institution_evolution_categories');
    this.getCategories('institution_connection_categories');
    this.getCategories('institution_tag_categories');
    this.getCategories('institution_tags');
  }


  getCategories(category) {
    const split = category.split('_');
    let modal = ''
    if (split.length === 3) {
      modal=`${split[0]}_${split[1]}Modal`;
    } else {
      modal = `${split[0]}Modal`;
    }
    this.setState({
      isLoading: true,
      [modal]: false,
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

  toggleModal(categoryModal) {
    this.setState({
      [categoryModal]: !this.state[categoryModal],
    });
  }

  renderCategories(categoryType) {
    const stateField = `${categoryType}_categories`
    return this.state[stateField].map(category =>
      (<Category
        key={category.id}
        categoryType={categoryType}
        getCategories={this.getCategories}
        id={category.id}
        title={category.title}
      />));
  }

  renderInstitutionCategoryTags() {
    return this.state.institution_tag_categories.map(category =>
      (<CategoryTag
        key={category.id}
        getCategories={this.getCategories}
        id={category.id}
        origin={category.origin ? category.origin : ''}
        title={category.title}
        tags={this.state.institution_tags.filter(tag => tag.institution_tag_category_id === category.id)}
      />));
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="8">
            <Card className="mt-4">
              <CardHeader>
                <h5>
                  Gestion des <span className="text-primary"><strong>types</strong></span> associés à un établissement
                </h5>
              </CardHeader>
              <CardBody>
                {this.renderInstitutionCategoryTags()}
              </CardBody>
              <CardFooter>
                <Button color="primary" className="float-right" onClick={() => this.toggleModal('institution_tagModal')}>
                  <i className="fa fa-plus mr-1" /> Ajouter une catégorie
                </Button>
                {this.state.institution_tagModal ?
                  <CategoryTagModal
                    getCategories={this.getCategories}
                    toggleModal={this.toggleModal}
                  /> : <div /> }
              </CardFooter>
            </Card>
          </Col>
          <Col xs="12" md="4">
            <Card className="mt-4">
              <CardHeader>
                <h5>
                  Gestion des <span className="text-primary"><strong>liens</strong></span> associés à un établissement
                </h5>
              </CardHeader>
              <CardBody>
                {this.renderCategories('link')}
              </CardBody>
              <CardFooter>
                <Button color="primary" className="float-right" onClick={() => this.toggleModal('linkModal')}>
                  <i className="fa fa-plus mr-1" /> Ajouter une catégorie
                </Button>
                {this.state.linkModal ?
                  <CategoryModal
                    categoryType="link"
                    getCategories={this.getCategories}
                    toggleModal={this.toggleModal}
                  /> : <div /> }
              </CardFooter>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <h5>
                  Gestion des <span className="text-primary"><strong>codes référentiel</strong></span> associés à un établissement
                </h5>
              </CardHeader>
              <CardBody>
                {this.renderCategories('code')}
              </CardBody>
              <CardFooter>
                <Button color="primary" className="float-right" onClick={() => this.toggleModal('codeModal')}>
                  <i className="fa fa-plus mr-1" /> Ajouter une catégorie
                </Button>
                {this.state.codeModal ?
                  <CategoryModal
                    categoryType="code"
                    getCategories={this.getCategories}
                    toggleModal={this.toggleModal}
                  /> : <div /> }
              </CardFooter>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <h5>
                  Gestion des <span className="text-primary"><strong>types d&#39;évolution</strong></span> associés à un établissement
                </h5>
              </CardHeader>
              <CardBody>
                {this.renderCategories('institution_evolution')}
              </CardBody>
              <CardFooter>
                <Button color="primary" className="float-right" onClick={() => this.toggleModal('institution_evolutionModal')}>
                  <i className="fa fa-plus mr-1" /> Ajouter une catégorie
                </Button>
                {this.state.institution_evolutionModal ?
                  <CategoryModal
                    categoryType="institution_evolution"
                    getCategories={this.getCategories}
                    toggleModal={this.toggleModal}
                  /> : <div /> }
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <h5>
                  Gestion des <span className="text-primary"><strong>types de rattachement</strong></span> associés à un établissement
                </h5>
              </CardHeader>
              <CardBody>
                {this.renderCategories('institution_connection')}
              </CardBody>
              <CardFooter>
                <Button color="primary" className="float-right" onClick={() => this.toggleModal('institution_connectionModal')}>
                  <i className="fa fa-plus mr-1" /> Ajouter une catégorie
                </Button>
                {this.state.institution_connectionModal ?
                  <CategoryModal
                    categoryType="institution_connection"
                    getCategories={this.getCategories}
                    toggleModal={this.toggleModal}
                  /> : <div /> }
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CategoryContainer;
