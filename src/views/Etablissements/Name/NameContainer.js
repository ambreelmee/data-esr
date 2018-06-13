import React, { Component } from 'react';
import TagCloud from 'react-tag-cloud';
import randomColor from 'randomcolor';
import moment from 'moment';

import { Alert, ButtonGroup, ButtonDropdown, Card, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import PropTypes from 'prop-types';

import { getActiveEntity } from './../methods';
import NameModal from './NameModal';
import NameHistoryModal from './NameHistoryModal';
import EtablissementStatusModal from './EtablissementStatusModal';

const styles = {
  large: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  small: {
    opacity: 0.7,
    fontSize: 16,
  },
};

class NameContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      statusModal: false,
      displayDropdown: false,
      editModal: false,
      historyModal: false,
      isLoading: false,
      isDeleting: false,
      names: [],
    };
    this.deleteName = this.deleteName.bind(this);
    this.displayDropdown = this.displayDropdown.bind(this);
    this.getNames = this.getNames.bind(this);
    this.toggleStatusModal = this.toggleStatusModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
  }

  getNames(etablissementId) {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${etablissementId}/institution_names`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          names: data,
          isLoading: false,
        });
      });
  }

  deleteName(nameId, etablissementId) {
    this.setState({ isDeleting: true });
    fetch(
      `${process.env.API_URL_STAGING}institution_names/${nameId}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ name: { id: nameId } }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isDeleting: false,
          deleteModal: false,
        });
        this.getNames(etablissementId);
      });
  }

  toggleStatusModal() {
    this.setState({
      statusModal: !this.state.statusModal,
    });
  }

  toggleHistoryModal() {
    this.setState({
      historyModal: !this.state.historyModal,
    });
  }

  toggleEditModal() {
    this.setState({
      editModal: !this.state.editModal,
    });
  }

  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    const replacementName = this.props.names ? this.props.names[0] : null;
    const displayedName = getActiveEntity(this.props.names) ? getActiveEntity(this.props.names) : replacementName;
    return (
      <Card className="mb-0 mt-2 w-100 text-center" style={{ height: '175px' }}>
        <Alert color={this.props.date_end ? 'danger' : 'success'}>
          {this.props.date_end ?
            `Cet établissement est fermé depuis le ${moment(this.props.date_end).format('LL')}` :
            `Cet établissement est ouvert depuis le ${moment(this.props.date_start).format('LL')}`}
        </Alert>
        <ButtonGroup style={{ position: 'absolute', right: '10px', top: '5px' }}>
          <ButtonDropdown
            id="nameDropdown"
            isOpen={this.state.displayDropdown}
            toggle={this.displayDropdown}
          >
            <DropdownToggle caret className="p-0 text-dark" color="transparent">
              <i className="icon-settings" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.toggleHistoryModal}>
                <i className="fa fa-eye text-info" />
                  Voir le détail des noms officiels
              </DropdownItem>
              {this.state.historyModal ?
                <NameHistoryModal
                  deleteName={this.deleteName}
                  etablissement_id={this.props.etablissement_id}
                  getData={this.props.getData}
                  history={this.props.names}
                  toggleModal={this.toggleHistoryModal}
                /> : <div />}
              <DropdownItem>
                <i className="fa fa-edit text-warning" />
                  Modifier la liste des noms d&#39;usage
              </DropdownItem>
              <DropdownItem onClick={this.toggleStatusModal}>
                <i className="fa fa-pencil text-danger" />
                  Modifier le statut de l&#39;établissement
                {this.state.statusModal ?
                  <EtablissementStatusModal
                    id={this.props.etablissement_id}
                    date_end={this.props.date_end}
                    date_start={this.props.date_start}
                    getData={this.props.getData}
                    toggleModal={this.toggleStatusModal}
                    uai={this.props.uai}
                  /> : <div />}
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </ButtonGroup>
        <TagCloud
          style={{
            flex: '1',
            fontFamily: 'sans-serif',
            fontSize: 30,
            color: () => randomColor({
              hue: 'blue',
            }),
            padding: 5,
          }}
        >
          <div id="initials" style={styles.large}>{displayedName.initials}</div>
          <div id="full-text" >{displayedName.text}</div>
          <div style={styles.small}>Bravestar</div>
          <div style={styles.small}>Starcom</div>
          <div style={styles.small}>Cops</div>
          <div style={styles.small}>Alfred J. Kwak</div>
          <div style={styles.small}>Dr Snuggles</div>
        </TagCloud>
      </Card>
    );
  }
}

NameContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
  date_end: PropTypes.string,
  date_start: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
  names: PropTypes.array.isRequired,
  synonym: PropTypes.string,
  uai: PropTypes.string.isRequired
};

NameContainer.defaultProps = {
  date_end: '',
  synonym: null,
};

export default NameContainer;
