import React, { Component } from 'react';
import { Button, Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import Synonym from './Synonym';


class SynonymsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addTooltip: false,
      content: '',
    };
    this.addSynonym = this.addSynonym.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleAddTooltip = this.toggleAddTooltip.bind(this);
  }

  onChange(event) {
    this.setState({
      content: event.target.value,
    });
  }

  toggleAddTooltip() {
    this.setState({
      addTooltip: !this.state.addTooltip,
    });
  }

  addSynonym() {
    const synonym = this.props.synonyms ? `${this.props.synonyms}, ${this.state.content}` : this.state.content;
    this.props.updateSynonymList(this.props.url, synonym);
    this.setState({ content: '' });
  }

  renderSynonyms() {
    const synonymsList = this.props.synonyms.split(', ');
    return synonymsList.map((synonym, index) => (
      <Synonym
        key={synonym}
        content={synonym}
        id={this.props.institutionId}
        index={index}
        synonymsList={synonymsList}
        updateSynonymList={this.props.updateSynonymList}
        url={this.props.url}
      />
    ));
  }

  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggleModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          Noms d&#39;usage
        </ModalHeader>
        <ModalBody>
          {this.props.synonyms ? this.renderSynonyms() : ''}
          <InputGroup className="mb-3">
            <Input
              id="content"
              type="text"
              value={this.state.content}
              onChange={this.onChange}
              placeholder="Ajouter un nom d'usage"
            />
            <Button
              id={`add-button-${this.props.institutionId}`}
              color="success"
              outline
              size="sm"
              onClick={this.addSynonym}
              disabled={this.state.content === ''}
            >
              {this.props.isLoading ?
                <i className="fa fa fa-spinner text-success fa-spin" /> :
                <i className="fa fa-check" />}
            </Button>
            <Tooltip
              isOpen={this.state.addTooltip}
              target={`add-button-${this.props.institutionId}`}
              toggle={this.toggleAddTooltip}
            >
              Ajouter un nouveau nom d&#39;usage
            </Tooltip>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          {this.props.hasErrored ?
            <p className="text-danger">Une erreur est survenue</p> : <div />}
          <Button color="secondary" onClick={this.props.toggleModal}>Fermer</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

SynonymsModal.propTypes = {
  updateSynonymList: PropTypes.func.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  institutionId: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  modal: PropTypes.bool,
  synonyms: PropTypes.string,
  toggleModal: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

SynonymsModal.defaultProps = {
  synonyms: '',
  modal: true,
};

export default SynonymsModal;
