import React, { Component } from 'react';
import { Button, CardBody } from 'reactstrap';
import ReactDOM from 'react-dom';
import reactDragula from 'react-dragula';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import Category from './Category';

class CategoryCardBody extends Component {
  constructor(props) {
    super(props);

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

  renderCategories() {
    return this.props.categories.map(category =>
      (<Category
        key={`${this.props.categoryType}-${category.id}`}
        categoryType={this.props.categoryType}
        getCategories={this.props.getCategories}
        id={category.id}
        title={category.title}
      />));
  }

  render() {
    return (
      <CardBody>
        {this.renderCategories()}
        {isEqual(this.state.orderedCategories, this.props.categories) ? <div /> :
        <Button color="secondary" className="pl-2 rounded">
          Modifier l&#39;ordre
        </Button>}
      </CardBody>
    );
  }
}

CategoryCardBody.propTypes = {
  categoryType: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  getCategories: PropTypes.func.isRequired,
};

export default CategoryCardBody;
