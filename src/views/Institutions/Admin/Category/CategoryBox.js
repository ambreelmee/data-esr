import React, { Component } from 'react';
import { Button, CardBody } from 'reactstrap';
import ReactDOM from 'react-dom';
import reactDragula from 'react-dragula';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Category from './Category';

class CategoryBox extends Component {
  constructor(props) {
    super(props);
    this.modifyOrder = this.modifyOrder.bind(this);
    this.state = {
      orderedCategories: this.props.categories,
      modifiedCategories: [],
      draggingElement: null,
    };
  }

  componentDidMount() {
    const myContainer = ReactDOM.findDOMNode(this);
    const drake = reactDragula([myContainer], {
      moves(el, container, handle) {
        return handle.classList.contains('plus-drag');
      },
    });
    drake.on('drag', (element) => {
      const CategoryList = Array.from(element.parentElement.childNodes);
      const position = CategoryList.indexOf(element);
      const modifiedCategories = this.state.orderedCategories.slice();
      this.setState({
        modifiedCategories,
        draggingElement: modifiedCategories.splice(position, 1),
      });
    });
    drake.on('drop', (element) => {
      const CategoryList = Array.from(element.parentElement.childNodes);
      const position = CategoryList.indexOf(element);
      const modifiedCategories = this.state.modifiedCategories.slice();
      modifiedCategories.splice(position, 0, this.state.draggingElement[0]);
      this.setState({
        orderedCategories: modifiedCategories,
        modifiedCategories: [],
        draggingElement: null,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      orderedCategories: nextProps.categories,
    });
  }

  modifyOrder() {
    this.state.orderedCategories.map((category, index) => {
      if (category.position !== index) {
        const url = `${process.env.API_URL_STAGING}/${this.props.categoryType}_categories/${category.id}`;
        const modifiedCategory = {};
        modifiedCategory[`${this.props.categoryType}_category`] = {
          id: category.id,
          title: category.title,
          position: index,
        };
        return this.props.addContent(url, JSON.stringify(modifiedCategory), 'PUT');
      }
      return '';
    });
  }

  renderCategories() {
    return this.props.categories.map(category =>
      (<Category
        key={`${this.props.categoryType}-${category.id}`}
        addContent={this.props.addContent}
        categoryType={this.props.categoryType}
        hasErrored={this.props.hasErrored}
        id={category.id}
        isLoading={this.props.isLoading}
        origin={category.origin}
        title={category.title}
        tags={this.props.tags.filter(tag => tag.category === category.title)}
        toggleDeleteModal={this.props.toggleDeleteModal}
      />));
  }

  render() {
    return (
      <CardBody>
        {this.renderCategories()}
        {isEqual(this.state.orderedCategories, this.props.categories) ? <div /> :
        <Button color="secondary" className="pl-2 rounded" onClick={this.modifyOrder}>
          {this.props.isLoading ?
            <i className="fa fa-spinner text-success fa-spin " /> : ''}
          Modifier l&#39;ordre
        </Button>}
      </CardBody>
    );
  }
}

CategoryBox.propTypes = {
  addContent: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  categoryType: PropTypes.string.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  tags: PropTypes.array,
  toggleDeleteModal: PropTypes.func.isRequired,
};

CategoryBox.defaultProps = {
  tags: [],
}

export default CategoryBox;
