import React, { Component } from 'react';
import { Alert, Button, Tooltip } from 'reactstrap';
import moment from 'moment';
import PropTypes from 'prop-types';

import EtablissementStatusModal from './EtablissementStatusModal';

class EtablissementStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      tooltip: false,
    };
    this.toggleToolTip = this.toggleToolTip.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleToolTip() {
    this.setState({
      tooltip: !this.state.tooltip,
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <Alert color={this.props.date_end ? 'danger' : 'success'}>
        {this.props.date_end ?
          `Cet établissement est fermé depuis le ${moment(this.props.date_end).format('LL')}` :
          `Cet établissement est ouvert depuis le ${moment(this.props.date_start).format('LL')}`}
        <Button color="transparent" id="main-edit-button" onClick={this.toggleModal}>
          <i className="fa fa-pencil text-dark ml-2" />
        </Button>
        <Tooltip
          isOpen={this.state.tooltip}
          placement="top"
          target="main-edit-button"
          toggle={this.toggleToolTip}
        >
          Modifier
        </Tooltip>
        {this.state.modal ?
          <EtablissementStatusModal
            id={this.props.id}
            date_end={this.props.date_end}
            date_start={this.props.date_start}
            getData={this.props.getData}
            toggleModal={this.toggleModal}
          /> : <div />}
      </Alert>
    );
  }
}

export default EtablissementStatus;

EtablissementStatus.propTypes = {
  id: PropTypes.number.isRequired,
  date_end: PropTypes.string,
  date_start: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
};

EtablissementStatus.defaultProps = {
  date_end: '',
};
