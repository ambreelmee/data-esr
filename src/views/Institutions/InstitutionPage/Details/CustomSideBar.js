import React from 'react';
import { Badge, Col, Button } from 'reactstrap';
import PropTypes from 'prop-types';

const CustomSideBar = props => (
  <Col className="md-3 p-0">
    {props.content.length > 0 ? props.content.map(item => (
      <Button
        key={item.id}
        color="light"
        className={`w-100 btn-m-0 py-3 px-2 border ${props.activeId === item.id ? 'active' : ''}`}
        style={{ whiteSpace: 'normal' }}
        onClick={() => props.setActiveItem(item)}
      >
        {item.status === 'active' ?
          <Badge color="success" className="float-right ml-1">Active</Badge> :
          <Badge color="danger" className="float-right ml-1">Archivé</Badge>}
        {React.cloneElement(
          props.component,
          { ...item },
        )}
      </Button>
    )) : ''}
    <Button color="primary" size="lg" className="m-3 rounded" onClick={props.removeActiveItem}>
      <i className="fa fa-plus mr-1" />
      {props.buttonText}
    </Button>
  </Col>
);


CustomSideBar.propTypes = {
  activeId: PropTypes.number,
  buttonText: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired,
  component: PropTypes.object.isRequired,
  removeActiveItem: PropTypes.func.isRequired,
  setActiveItem: PropTypes.func.isRequired,
};

CustomSideBar.defaultProps = {
  activeId: null,
}


export default CustomSideBar;
