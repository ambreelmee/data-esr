import React, { Component } from 'react';
import { Button, CardBody, Input, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import map from 'lodash/map';

const ResourceTranslation = {
  addresses: 'adresse',
  codes: 'identifiant',
  date_end: 'date de fin',
  date_start: 'date de début',
  daughters: 'rattachement filles',
  followers: 'évolution successeurs',
  id: 'id',
  links: 'liens',
  mothers: 'rattachement mères',
  names: 'noms',
  predecessors: 'évolution prédecesseur',
  synonym: "nom d'usage",
  tags: 'caractérisations',
};

class ResourceConflictTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      renderFullTable: false,
    };
    this.onChange = this.onChange.bind(this);
    this.toggleFullTable = this.toggleFullTable.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  toggleFullTable() {
    this.setState({ renderFullTable: !this.state.renderFullTable });
  }

  renderRows() {
    return map(this.props.current, (currentValue, fieldName) => {
      const conflictValue = this.props.conflict.find(item => item.field_name === fieldName);
      if (conflictValue) {
        return (
          <tr key={fieldName}>
            <td style={{ width: '24%', verticalAlign: 'middle' }}>{fieldName}</td>
            <td style={{ width: '38%', verticalAlign: 'middle' }} className="text-danger">{currentValue}</td>
            <td style={{ width: '38%', verticalAlign: 'middle' }}>
              <Input
                id={fieldName}
                type="text"
                className="text-success"
                value={this.state[fieldName] ? this.state[fieldName] : conflictValue.new_value}
                onChange={this.onChange}
              />
            </td>
          </tr>);
      }
    });
  }

  renderFullTable() {
    return map(this.props.current, (currentValue, fieldName) => {
      const conflictValue = this.props.conflict.find(item => item.field_name === fieldName);
      return (
        <tr key={fieldName}>
          <td style={{ width: '24%', verticalAlign: 'middle' }}>{fieldName}</td>
          <td style={{ width: '38%', verticalAlign: 'middle' }} className="text-danger">{currentValue}</td>
          <td style={{ width: '38%', verticalAlign: 'middle' }}>
            <Input
              id={fieldName}
              type="text"
              className="text-success"
              value={this.state[fieldName] ? this.state[fieldName] : conflictValue ? conflictValue.new_value : ''}
              onChange={this.onChange}
            />
          </td>
        </tr>);
    });
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    return (
      <CardBody className="animated fadeIn">
        <h5 className="text-primary">
          {ResourceTranslation[this.props.resource]}{this.props.category ? ` ${this.props.category}` : ''}
        </h5>
        <div className="d-flex align-items-end">
          <Button className="rounded m-2" size="sm" outline color="secondary" onClick={this.toggleFullTable}>
            <i className={`fa fa-chevron-${this.state.renderFullTable ? 'up' : 'down'}`} />
          </Button>
          <Table hover rounded responsive size="sm" className="mb-0">
            <tbody>
              {this.state.renderFullTable ? this.renderFullTable() : this.renderRows()}
            </tbody>
          </Table>
        </div>
        <div className="d-flex flex-row-reverse">
          <Button color="success" size="sm" className="rounded m-1">Valider</Button>
          <Button color="danger" size="sm" className="rounded m-1">Rejeter</Button>
        </div>
      </CardBody>);
  }
}

ResourceConflictTable.propTypes = {
  category: PropTypes.string,
  conflict: PropTypes.array.isRequired,
  current: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  resource: PropTypes.string.isRequired,
};

ResourceConflictTable.defaultProps = {
  category : '',
}


export default ResourceConflictTable;
