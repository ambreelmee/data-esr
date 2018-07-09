import React, { Component } from 'react';
import { Button, Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import Synonym from './Synonym';


class SynonymsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      modal: true,
      isAdding: false,
    };
    this.addSynonym = this.addSynonym.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
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

  toggle() {
    this.props.toggleModal();
    this.setState({
      modal: !this.state.modal,
    });
  }

  addSynonym() {
    this.setState({ isAdding: true });
    const synonym = this.props.synonyms ? `${this.props.synonyms}, ${this.state.content}` : this.state.content;
    fetch(
      `${process.env.API_URL_STAGING}/institutions/${this.props.id}`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ institution: { synonym } }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isAdding: false,
        });
        this.props.getData(this.props.id);
      });
  }


  renderSynonyms() {
    const synonymsList = this.props.synonyms.split(', ');
    return synonymsList.map((synonym, index) => (
      <Synonym
        key={synonym}
        synonymsList={synonymsList}
        id={this.props.id}
        index={index}
        content={synonym}
        getData={this.props.getData}
      />
    ));
  }

  render() {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>
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
              id={`add-button-${this.props.id}`}
              color="success"
              outline
              size="sm"
              onClick={this.addSynonym}
              disabled={this.state.content === ''}
            >
              {this.state.isAdding ?
                <i className="fa fa fa-spinner text-success fa-spin" /> :
                <i className="fa fa-check" />}
            </Button>
            <Tooltip
              isOpen={this.state.addTooltip}
              target={`add-button-${this.props.id}`}
              toggle={this.toggleAddTooltip}
            >
              Ajouter un nouveau nom d&#39;usage
            </Tooltip>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggle}>Fermer</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

SynonymsModal.propTypes = {
  id: PropTypes.number.isRequired,
  getData: PropTypes.func.isRequired,
  synonyms: PropTypes.string,
  toggleModal: PropTypes.func.isRequired,
};

SynonymsModal.defaultProps = {
  synonyms: '',
};

export default SynonymsModal;
