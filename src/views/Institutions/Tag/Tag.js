import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';


const Tag = props => (
  <Card className="card-accent-primary text-primary rounded">
    <CardBody className="p-0">
      {props.categoryTags.map(tag => (
        <h6 key={`tag-${tag.id}`} className="my-1 mx-2">
          {tag.tag.long_label}
        </h6>
      ))}
    </CardBody>
  </Card>
);


Tag.propTypes = {
  categoryTags: PropTypes.array.isRequired,
};

export default Tag;
