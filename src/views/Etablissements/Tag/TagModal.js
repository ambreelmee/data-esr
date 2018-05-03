import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';

import TagModalRow from './TagModalRow';


class TagModal extends Component {
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
    if (this.props.tags.length > 0) {
      return this.props.tags.map(tagging =>
        (
          <TagModalRow
            key={tagging.id}
            category={tagging.tag.category}
            date_end={tagging.date_end}
            date_start={tagging.date_start}
            getInstitutionTags={this.props.getInstitutionTags}
            etablissementId={tagging.institution_id}
            longLabel={tagging.tag.long_label}
            shortLabel={tagging.tag.short_label}
            status={tagging.status}
            taggingId={tagging.id}
            tagId={tagging.institution_tag_id}
          />));
    }
    return '';
  }

  render() {
    return (
      <Modal className="w-75 mw-100 px-5" isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
          Caractérisation de l&#39;établissement
        </ModalHeader>
        <ModalBody>
          {this.props.tags.length > 0 ?
            <Table hover bordered striped responsive size="sm">
              <thead>
                <tr>
                  <th>Catégorie du tag</th>
                  <th>Nom court</th>
                  <th>Nom long</th>
                  <th>Date de début</th>
                  <th>Date de fin</th>
                  <th>Statut</th>
                  <th>Action </th>
                </tr>
              </thead>
              <tbody>
                {this.renderTableRows()}
              </tbody>
            </Table> : <div />}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>Fermer</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

TagModal.propTypes = {
  etablissementId: PropTypes.number.isRequired,
  getInstitutionTags: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
};

export default TagModal;
