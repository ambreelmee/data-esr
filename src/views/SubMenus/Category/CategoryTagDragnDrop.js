import React, { Component } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import reactDragula from 'react-dragula';
import isEqual from 'lodash/isEqual';
import Tag from './Tag';

class CategoryTagDragnDrop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderedCategories: this.props.tags,
      modifiedCategories: [],
      draggingElement: 'coucou',
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

  renderTags() {
    if (this.props.tags.length > 0) {
      return this.props.tags.map(tag => (
        <Tag
          key={tag.id}
          getTag={this.props.getCategories}
          id={tag.id}
          longLabel={tag.long_label}
          shortLabel={tag.short_label}
        />));
    }
    return <p>Aucun label dans cette catégorie</p>;
  }

  render() {
    return (
      <div>
        {this.renderTags()}
        {isEqual(this.state.orderedCategories, this.props.tags) ? <div /> :
        <Button color="secondary" className="mt-3 p-2 rounded">
          Modifier l&#39;ordre
        </Button>}
      </div>);
  }
}

CategoryTagDragnDrop.propTypes = {
  getCategories: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
};


export default CategoryTagDragnDrop;
