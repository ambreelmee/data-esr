import React, { Component } from 'react';
import { Button, Input, InputGroup, InputGroupAddon, Tooltip } from 'reactstrap';

const triggerFileInputClick = () => {
  document.getElementById('import').click();
};

class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cancelTooltip: false,
      file: {},
      isEditing: false,
      name: '',
      validationTooltip: false,
    };

    this.cancelEdition = this.cancelEdition.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleValidationTooltip = this.toggleValidationTooltip.bind(this);
    this.toggleCancelToolTip = this.toggleCancelToolTip.bind(this);
  }

  // Now only one the latest input is saved
  // could be improved by creating a temp array and check wether the names of the coming files are already in state, of not add them
  handleChange(event) {
    this.setState({
      file: event.target.files,
      name: event.target.files[0].name,
    });
  }

  cancelEdition() {
    this.setState({
      file: {},
      name: '',
      cancelTooltip: false,
    });
  }

  toggleValidationTooltip() {
    this.setState({
      validationTooltip: !this.state.validationTooltip,
    });
  }

  toggleCancelToolTip() {
    this.setState({
      cancelTooltip: !this.state.cancelTooltip,
    });
  }


  render() {
    return (
      <div className="position-relative">
        <Input
          id="import"
          type="file"
          style={{
            position: 'relative',
            textAlign: 'right',
            MozOpacity: 0,
            opacity: 0,
            zIndex: 2,
          }}
          onChange={this.handleChange}
        />
        <Button
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
          color="success"
          className="m-1"
          onClick={triggerFileInputClick}
        >
          <i className="fa fa-plus text-white ml-1" /> Importer des données
        </Button>
        {this.state.name ?
          <InputGroup className="ml-1 mt-3" style={{ width: `${this.state.name.length + 9}ch` }}>
            <Input type="text" readOnly value={this.state.name} style={{ maxWidth: '250px' }} />
            <InputGroupAddon addonType="append">
              <Button
                id="save-upload-button"
                color="transparent"
                disabled={this.state.isEditing}
                size="sm"
              >
                {this.state.isEditing ?
                  <i className="fa fa-spinner text-success fa-spin " /> :
                  <i className="fa fa-check text-success" />}
              </Button>
              <Tooltip
                isOpen={this.state.validationTooltip}
                target="save-upload-button"
                toggle={this.toggleValidationTooltip}
                placement="bottom"
              >
                Sauvegarder les changements
              </Tooltip>
              <Button
                id="cancel-upload-button"
                color="transparent"
                size="sm"
                onClick={this.cancelEdition}
              >
                <i className="fa fa-close text-dark" />
              </Button>
              <Tooltip
                isOpen={this.state.cancelTooltip}
                target="cancel-upload-button"
                toggle={this.toggleCancelToolTip}
                placement="bottom"
              >
                Annuler les changements
              </Tooltip>
            </InputGroupAddon>
          </InputGroup> : <div />}
        <p className="mt-3 ml-1 text-danger"><em>Pas encore fonctionnel</em></p>
      </div>
    );
  }
}

export default Upload;
