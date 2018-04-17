import React, { Component } from 'react';
import { Button, Col, Card, CardHeader, CardFooter, CardBody, Row } from 'reactstrap';

import Category from './Category';
import CategoryModal from './CategoryModal';

class CategoryContainer extends Component {
  constructor(props) {
    super(props);

    this.toggleCodeModal = this.toggleCodeModal.bind(this);
    this.toggleLinkModal = this.toggleLinkModal.bind(this);
    this.getLinkCategories = this.getLinkCategories.bind(this);
    this.getCodeCategories = this.getCodeCategories.bind(this);
    this.state = {
      codeModal: false,
      isLoading: false,
      codeCategories: [],
      linkCategories: [],
      linkModal: false,
    };
  }

  componentWillMount() {
    this.getLinkCategories();
    this.getCodeCategories();
  }

  getLinkCategories() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}link_categories`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          linkCategories: data,
          isLoading: false,
        });
      });
  }

  getCodeCategories() {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}code_categories`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          codeCategories: data,
          isLoading: false,
        });
      });
  }

  toggleCodeModal() {
    this.setState({
      codeModal: !this.state.codeModal,
    });
  }

  toggleLinkModal() {
    this.setState({
      linkModal: !this.state.linkModal,
    });
  }

  renderLinkCategories() {
    return this.state.linkCategories.map(category =>
      (<Category
        key={category.id}
        categoryType="link"
        getCategories={this.getLinkCategories}
        id={category.id}
        title={category.title}
      />));
  }

  renderCodeCategories() {
    return this.state.codeCategories.map(category =>
      (<Category
        key={category.id}
        categoryType="code"
        getCategories={this.getCodeCategories}
        id={category.id}
        title={category.title}
      />));
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="4">
            <Card className="mt-4">
              <CardHeader>
                <h5>
                  Gestion des <span className="text-primary"><strong>liens</strong></span> associés à un établissement
                </h5>
              </CardHeader>
              <CardBody>
                {this.renderLinkCategories()}
              </CardBody>
              <CardFooter>
                <Button color="primary" className="float-right" onClick={this.toggleLinkModal}>
                  <i className="fa fa-plus mr-1" /> Ajouter une catégorie
                </Button>
                {this.state.linkModal ?
                  <CategoryModal
                    categoryType="link"
                    getCategories={this.getLinkCategories}
                    toggleModal={this.toggleLinkModal}
                  /> : <div /> }
              </CardFooter>
            </Card>
          </Col>
          <Col xs="12" md="4">
            <Card className="mt-4">
              <CardHeader>
                <h5>
                  Gestion des <span className="text-primary"><strong>codes référentiel</strong></span> associés à un établissement
                </h5>
              </CardHeader>
              <CardBody>
                {this.renderCodeCategories()}
              </CardBody>
              <CardFooter>
                <Button color="primary" className="float-right" onClick={this.toggleCodeModal}>
                  <i className="fa fa-plus mr-1" /> Ajouter une catégorie
                </Button>
                {this.state.codeModal ?
                  <CategoryModal
                    categoryType="code"
                    getCategories={this.getCodeCategories}
                    toggleModal={this.toggleCodeModal}
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
