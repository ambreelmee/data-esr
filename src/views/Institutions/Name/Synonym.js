import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, Input, Button, Tooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import DeleteModal from '../DeleteModal';

class Synonym extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cancelTooltip: false,
      content: this.props.content,
      deleteTooltip: false,
      displayEditButton: false,
      editTooltip: false,
      errorMessage: '',
      isEditing: false,
      modal: false,
    };
    this.cancelEdition = this.cancelEdition.bind(this);
    this.deleteSynonym = this.deleteSynonym.bind(this);
    this.onChange = this.onChange.bind(this);
    this.editSynonym = this.editSynonym.bind(this);
    this.toggleCancelToolTip = this.toggleCancelToolTip.bind(this);
    this.toggleDeleteToolTip = this.toggleDeleteToolTip.bind(this);
    this.toggleEditToolTip = this.toggleEditToolTip.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  onChange(event) {
    this.setState({
      displayEditButton: true,
      [event.target.id]: event.target.value,
    });
  }

  deleteSynonym() {
    const modifiedList = this.props.synonymsList;
    modifiedList.splice(this.props.index, 1);
    const synonym = modifiedList.join(', ');
    this.props.updateSynonymList(this.props.url, synonym);
  }

  editSynonym() {
    const modifiedList = this.props.synonymsList;
    modifiedList[this.props.index] = this.state.content;
    const synonym = modifiedList.join(', ');
    this.props.updateSynonymList(this.props.url, synonym);
  }

  cancelEdition() {
    this.setState({
      displayEditButton: false,
      cancelTooltip: false,
      content: this.props.content,
    });
  }

  toggleDeleteToolTip() {
    this.setState({
      deleteTooltip: !this.state.deleteTooltip,
    });
  }

  toggleEditToolTip() {
    this.setState({
      editTooltip: !this.state.editTooltip,
    });
  }

  toggleCancelToolTip() {
    this.setState({
      cancelTooltip: !this.state.cancelTooltip,
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <div>
        <p className="text-danger mb-0">{this.state.errorMessage}</p>
        <InputGroup className="mb-3">
          <Input
            id="content"
            type="text"
            value={this.state.content}
            onChange={this.onChange}
            placeholder={this.state.content}
          />
          {this.state.displayEditButton ?
            <InputGroupAddon addonType="append">
              <Button
                id={`synonym-edit-button-${this.props.index}`}
                color="transparent"
                size="sm"
                disabled={this.state.isEditing}
                onClick={this.editSynonym}
              >
                {this.state.isEditing ?
                  <i className="fa fa-spinner text-success fa-spin " /> :
                  <i className="fa fa-check text-success" />}
              </Button>
              <Tooltip
                isOpen={this.state.editTooltip}
                target={`synonym-edit-button-${this.props.index}`}
                toggle={this.toggleEditToolTip}
              >
                Sauvegarder les changements
              </Tooltip>
              <Button
                id={`cancel-button-${this.props.index}`}
                color="transparent"
                size="sm"
                onClick={this.cancelEdition}
              >
                <i className="fa fa-close text-dark" />
              </Button>
              <Tooltip
                isOpen={this.state.cancelTooltip}
                target={`cancel-button-${this.props.index}`}
                toggle={this.toggleCancelToolTip}
              >
                Annuler les changements
              </Tooltip>
            </InputGroupAddon> : <div />}
          <Button
            id={`delete-button-${this.props.id}`}
            color="danger"
            outline
            size="sm"
            onClick={this.toggleModal}
          >
            <i className="fa fa-close" />
          </Button>
          <Tooltip
            isOpen={this.state.deleteTooltip}
            target={`delete-button-${this.props.id}`}
            toggle={this.toggleDeleteToolTip}
          >
            Supprimer le nom d&#39;usage
          </Tooltip>
          <DeleteModal
            toggleModal={this.toggleModal}
            isLoading={this.props.isLoading}
            hasErrored={this.props.hasErrored}
            modal={this.state.modal}
            deleteMethod={this.deleteSynonym}
          />
        </InputGroup>
      </div>
    );
  }
}

Synonym.propTypes = {
  content: PropTypes.string.isRequired,
  hasErrored: PropTypes.bool,
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  synonymsList: PropTypes.array.isRequired,
  updateSynonymList: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

Synonym.defaultProps = {
  hasErrored: false,
  isLoading: false,
};


export default Synonym;
