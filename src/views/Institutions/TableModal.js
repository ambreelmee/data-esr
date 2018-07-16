import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import PropTypes from 'prop-types';

import TableRow from './TableRow';


class TableModal extends Component {
  renderTableRows() {
    return this.props.content.map(contentItem =>
      (
        <TableRow
          {...contentItem}
          key={contentItem.id}
          component={this.props.component}
          deleteUrl={`${this.props.deleteUrl}/${contentItem.id}`}
          institutionId={this.props.institutionId}
          modal={this.props.editModal}
          toggleModal={this.props.toggleEditModal}
        />));
  }

  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggleModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          Informations détaillées
        </ModalHeader>
        <ModalBody>
          <Table hover bordered striped responsive size="sm">
            <thead>
              <tr>
                {this.props.tableHeader.map(header => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {this.renderTableRows()}
            </tbody>
          </Table>
          <Button color="primary" className="float-right" onClick={this.props.toggleAddModal}>
            <i className="fa fa-plus mr-1" />
            Ajouter un élément
          </Button>
          {this.props.addModal ? this.props.component : '' }
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.toggleModal}>Fermer</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

TableModal.propTypes = {
  addModal: PropTypes.bool.isRequired,
  component: PropTypes.object.isRequired,
  content: PropTypes.array.isRequired,
  deleteUrl: PropTypes.string.isRequired,
  editModal: PropTypes.bool.isRequired,
  institutionId: PropTypes.number.isRequired,
  modal: PropTypes.bool.isRequired,
  tableHeader: PropTypes.array.isRequired,
  toggleAddModal: PropTypes.func.isRequired,
  toggleEditModal: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default TableModal;
