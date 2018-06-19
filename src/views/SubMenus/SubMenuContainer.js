import React from 'react';
import { Row } from 'reactstrap';
import PropTypes from 'prop-types';
import CategoryContainer from './Category/CategoryContainer';
import TagCategoryContainer from './Category/TagCategoryContainer';
import ImportExport from './ImportExport';


const SubMenuContainer = (props) => {
  const name = props.path.split('/')[1];
  return (
    <div className="animated fadeIn p-5">
      <h2 className="text-center">
        Gestion des <span className="text-primary"><strong>{name}</strong></span> associés aux établissements
      </h2>
      <Row>
        {props.categoryType ?
          <CategoryContainer categoryType={props.categoryType} name={name} /> :
          <TagCategoryContainer />}
        <ImportExport name={name} />
      </Row>
    </div>);
};

SubMenuContainer.propTypes = {
  categoryType: PropTypes.string,
};

SubMenuContainer.defaultProps = {
  categoryType: null,
};

export default SubMenuContainer;
