import React, { Component } from 'react';

// import NewEntity from './NewEntity.js'
import { Badge } from 'reactstrap';

class Item extends Component {

  render() {
    return (
      <tr>
        <td>this.props.id_esr</td>
        <td>this.props.date_start</td>
        <td>this.props.date_end</td>
        <td>
          <Badge color="success">this.props.status</Badge>
        </td>
      </tr>
    );
  }
}

Item.propTypes = {
  id_esr: PropTypes.integer.isRequired,
  name: PropTypes.string.isRequired,
  date_start: PropTypes.string.isRequired,
  date_end: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default Item;
