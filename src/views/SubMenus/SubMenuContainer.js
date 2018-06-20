import React from 'react';
import { Row } from 'reactstrap';
import PropTypes from 'prop-types';
import CategoryContainer from './Category/CategoryContainer';
import TagCategoryContainer from './Category/TagCategoryContainer';
import ImportExport from './ImportExport';

const renderCategories = (categoryType, routePath, name) => {
  if (categoryType) {
    return (
      <CategoryContainer categoryType={categoryType} name={name} />
    );
  } if (routePath === 'taggings') {
    return (<TagCategoryContainer />);
  }
  return '';
};

const SubMenuContainer = (props) => {
  const name = props.path.split('/')[1];
  return (
    <div className="animated fadeIn p-5">
      <h2 className="text-center">
        Gestion des <span className="text-primary"><strong>{name}</strong></span>
        {name === 'adresses' ? ' associées' : ' associés'} aux établissements
      </h2>
      <Row>
        {renderCategories(props.categoryType, props.routePath, name)}
        <ImportExport name={name} routePath={props.routePath} />
      </Row>
    </div>);
};

SubMenuContainer.propTypes = {
  categoryType: PropTypes.string,
  routePath: PropTypes.string.isRequired,
};

SubMenuContainer.defaultProps = {
  categoryType: null,
};

export default SubMenuContainer;
