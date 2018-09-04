import React, { Component } from 'react';
import { Button, Col, Card, CardHeader, CardFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import CategoryModal from './CategoryModal';
import CategoryBox from './CategoryBox';

class CategoryContainer extends Component {
  constructor(props) {
    super(props);

    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      modal: false,
    };
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <Col xs="12" md="6">
        <Card className="mt-4">
          <CardHeader>
            <h5>Catégories</h5>
          </CardHeader>
          {this.props.categoryType === 'institution_tag' ?
            <div>
              Les tags qui peuvent être associés à un établissement sont répartis en différent catégories.
              Cliquer sur le menu déroulant pour faire apparaître l&#39;ensemble des tags associés à une catégorie.
            </div> : ''}
          <CategoryBox
            categories={this.props.categories}
            categoryType={this.props.categoryType}
            addContent={this.props.addContent}
            hasErrored={this.props.hasErrored}
            isLoading={this.props.isLoading}
            tags={this.props.tags}
            toggleDeleteModal={this.props.toggleDeleteModal}
          />
          <CardFooter>
            <Button color="primary" className="float-right rounded" onClick={this.toggleModal}>
              <i className="fa fa-plus mr-1" /> Ajouter une catégorie
            </Button>
            {this.state.modal ?
              <CategoryModal
                categoryType={this.props.categoryType}
                toggleModal={this.toggleModal}
                addContent={this.props.addContent}
                hasErrored={this.props.hasErrored}
                isLoading={this.props.isLoading}
              /> : <div /> }
          </CardFooter>
        </Card>
      </Col>
    );
  }
}

CategoryContainer.propTypes = {
  addContent: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  categoryType: PropTypes.string.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  tags: PropTypes.array,
  toggleDeleteModal: PropTypes.func.isRequired,
};

CategoryContainer.defaultProps = {
  tags: [],
}

export default CategoryContainer;
