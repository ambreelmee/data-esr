import React, { Component } from 'react';
import { Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

import CodeHistoryModalRow from './CodeHistoryModalRow';


class CodeHistoryModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: true,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
    });
  }

  renderTableRows() {
    return this.props.history.map(code =>
      (
        <CodeHistoryModalRow
          key={code.id}
          category={this.props.category}
          categoryId={this.props.categoryId}
          content={code.content}
          date_start={code.date_start}
          date_end={code.date_end}
          deleteCode={this.props.deleteCode}
          getCodes={this.props.getCodes}
          id={code.id}
          status={code.status}
        />));
  }

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Historique des codes {this.props.category.toLowerCase()}
        </ModalHeader>
        <ModalBody>
          <Table hover bordered striped responsive size="sm">
            <thead>
              <tr>
                <th>Code</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Action </th>
              </tr>
            </thead>
            <tbody>
              {this.renderTableRows()}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>Fermer</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

CodeHistoryModal.propTypes = {
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  history: PropTypes.array.isRequired,
  deleteCode: PropTypes.func.isRequired,
  getCodes: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default CodeHistoryModal;
