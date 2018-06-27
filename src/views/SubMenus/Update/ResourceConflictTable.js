import React, { Component } from 'react';
import { Button, ButtonDropdown, ButtonGroup, CardBody, DropdownItem, DropdownMenu, DropdownToggle, Input, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import map from 'lodash/map';

const ResourceTranslation = {
  addresses: 'adresses',
  codes: 'identifiants',
  date_end: 'date de fin',
  date_start: 'date de début',
  daughters: 'rattachements filles',
  followers: 'successeurs',
  id: 'id',
  links: 'liens',
  mothers: 'rattachements mères',
  names: 'noms',
  predecessors: 'prédecesseur',
  synonym: "nom d'usage",
  tags: 'caractérisations',
};

class ResourceConflictTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      displayDropdown: false,
      renderFullTable: false,
    };
    this.displayDropdown = this.displayDropdown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleFullTable = this.toggleFullTable.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  toggleFullTable() {
    this.setState({ renderFullTable: !this.state.renderFullTable });
  }

  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }

  renderRows() {
    if (typeof this.props.current === 'string') {
      const fieldName = this.props.conflict[0].field_name;
      return (
        <tr key={fieldName}>
          <td style={{ width: '18%', verticalAlign: 'middle' }}>{fieldName}</td>
          <td style={{ width: '33%', verticalAlign: 'middle' }} className="text-danger">
            {this.props.current ? this.props.current : <em>non renseigné</em>}
          </td>
          <td style={{ width: '33%', verticalAlign: 'middle' }}>
            <Input
              id={fieldName}
              type="text"
              className="text-success"
              value={this.state[fieldName] ? this.state[fieldName] : this.props.conflict[0].new_value}
              onChange={this.onChange}
            />
          </td>
          <td style={{ width: '16%', verticalAlign: 'middle' }} className="text-right">
            {this.props.conflict[0].source}
          </td>
        </tr>);
    }
    return map(this.props.current, (currentValue, fieldName) => {
      const conflictValue = this.props.conflict.find(item => item.field_name === fieldName);
      if (conflictValue) {
        return (
          <tr key={fieldName}>
            <td style={{ width: '18%', verticalAlign: 'middle' }}>{fieldName}</td>
            <td style={{ width: '33%', verticalAlign: 'middle' }} className="text-danger">{currentValue}</td>
            <td style={{ width: '33%', verticalAlign: 'middle' }}>
              <Input
                id={fieldName}
                type="text"
                className="text-success"
                value={this.state[fieldName] ? this.state[fieldName] : conflictValue.new_value}
                onChange={this.onChange}
              />
            </td>
            <td style={{ width: '16%', verticalAlign: 'middle' }} className="text-right">
              {conflictValue.source}
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
          <td style={{ width: '18%', verticalAlign: 'middle' }}>{fieldName}</td>
          <td style={{ width: '33%', verticalAlign: 'middle' }} className="text-danger">{currentValue}</td>
          <td style={{ width: '33%', verticalAlign: 'middle' }}>
            <Input
              id={fieldName}
              type="text"
              className="text-success"
              value={this.state[fieldName] ? this.state[fieldName] : conflictValue ? conflictValue.new_value : ''}
              onChange={this.onChange}
            />
          </td>
          <td style={{ width: '16%', verticalAlign: 'middle' }} className="text-right">
            {conflictValue ? this.props.conflict[0].source : ''}
          </td>
        </tr>);
    });
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    const resourceName = ResourceTranslation[this.props.resource];
    return (
      <CardBody className="animated fadeIn">
        <h5 className="text-primary">
          {resourceName}{this.props.category ? ` ${this.props.category}` : ''}
        </h5>
        <div className="d-flex align-items-end">
          {typeof this.props.current === 'string' ? <div /> :
            <Button className="rounded m-2" size="sm" outline color="secondary" onClick={this.toggleFullTable}>
              <i className={`fa fa-chevron-${this.state.renderFullTable ? 'up' : 'down'}`} />
            </Button>}
          <Table hover responsive size="sm" className="mb-0">
            <tbody>
              {this.state.renderFullTable ? this.renderFullTable() : this.renderRows()}
            </tbody>
          </Table>
        </div>
        <div className="d-flex flex-row-reverse">
          {typeof this.props.current === 'string' ?
            <Button color="success" size="sm" className="rounded m-1">Valider</Button> :
            <ButtonGroup>
              <ButtonDropdown
                id={`${this.props.id_etablissement}-${this.props.resource}`}
                isOpen={this.state.displayDropdown}
                toggle={this.displayDropdown}
              >
                <DropdownToggle
                  caret
                  size="sm"
                  className="rounded m-1"
                  color="success"
                  >
                  Valider
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem className="btn-sm p-1">
                      Modifier l&#39;entrée actuelle
                  </DropdownItem>
                  <DropdownItem className="btn-sm p-1">
                      Ajouter une nouvelle entrée
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </ButtonGroup>}
          <Button color="danger" size="sm" className="rounded m-1">Rejeter</Button>
        </div>
      </CardBody>);
  }
}

ResourceConflictTable.propTypes = {
  category: PropTypes.string,
  conflict: PropTypes.array.isRequired,
  current:PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired,
  id: PropTypes.number,
  id_etablissement: PropTypes.number.isRequired,
  resource: PropTypes.string.isRequired,
};

ResourceConflictTable.defaultProps = {
  category : '',
  id: 0,
}


export default ResourceConflictTable;
