import React, { Component } from 'react';
import { Button, Col, Card, CardHeader, CardFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import CategoryModal from './CategoryModal';
import CategoryCardBody from './CategoryCardBody';

class CategoryContainer extends Component {
  constructor(props) {
    super(props);

    this.toggleModal = this.toggleModal.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.state = {
      isLoading: false,
      categories: [],
      modal: false,
    };
  }

  componentWillMount() {
    this.getCategories(this.props.categoryType);
  }

  componentWillReceiveProps(nextProps) {
    this.getCategories(nextProps.categoryType);
  }

  getCategories(categoryType) {
    const categories = `${categoryType}_categories`;
    this.setState({
      isLoading: true,
      modal: false,
    });
    fetch(`${process.env.API_URL_STAGING}${categories}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          categories: data,
          isLoading: false,
        });
      });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    return (
      <Col xs="12" md="6">
        <Card className="mt-4">
          <CardHeader>
            <h5>Types de {this.props.name}</h5>
          </CardHeader>
          <CategoryCardBody
            categories={this.state.categories}
            categoryType={this.props.categoryType}
            getCategories={this.getCategories}
          />
          <CardFooter>
            <Button color="primary" className="float-right" onClick={this.toggleModal}>
              <i className="fa fa-plus mr-1" /> Ajouter une catégorie
            </Button>
            {this.state.modal ?
              <CategoryModal
                categoryType={this.props.categoryType}
                getCategories={this.getCategories}
                toggleModal={this.toggleModal}
              /> : <div /> }
          </CardFooter>
        </Card>
      </Col>
    );
  }
}

CategoryContainer.propTypes = {
  categoryType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default CategoryContainer;
