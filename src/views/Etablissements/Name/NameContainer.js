import React, { Component } from 'react';
import TagCloud from 'react-tag-cloud';
import randomColor from 'randomcolor';
import moment from 'moment';

import { Alert, ButtonGroup, ButtonDropdown, Card, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import PropTypes from 'prop-types';

import { getActiveEntity } from './../methods';
import EtablissementStatusModal from './EtablissementStatusModal';
import NameHistoryModal from './NameHistoryModal';
import SynonymsModal from './SynonymsModal';

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
      synonymModal: false,
      historyModal: false,
      isLoading: false,
      isDeleting: false,
    };
    this.deleteName = this.deleteName.bind(this);
    this.displayDropdown = this.displayDropdown.bind(this);
    this.toggleStatusModal = this.toggleStatusModal.bind(this);
    this.toggleSynonymModal = this.toggleSynonymModal.bind(this);
    this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
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

  toggleSynonymModal() {
    this.setState({
      synonymModal: !this.state.synonymModal,
    });
  }

  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }

  renderSynonyms() {
    if (this.props.synonym) {
      return this.props.synonym.split(', ').map(synonym => (
        <div key={synonym} style={styles.small}>{synonym}</div>
      ));
    } return <div />;
  }

  render() {
    const e = document.documentElement;
    const g = document.getElementsByTagName('body')[0];
    const width = window.innerWidth || e.clientWidth || g.clientWidth;
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
              <DropdownItem onClick={this.toggleSynonymModal}>
                <i className="fa fa-edit text-warning" />
                  Modifier la liste des noms d&#39;usage
              </DropdownItem>
              {this.state.synonymModal ?
                <SynonymsModal
                  id={this.props.etablissement_id}
                  getData={this.props.getData}
                  synonyms={this.props.synonym}
                  toggleModal={this.toggleSynonymModal}
                /> : <div />}
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
        {width > 767 ?
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
            <div style={displayedName.initials.length > 10 ? '' : styles.large}>{displayedName.initials}</div>
            {displayedName.initials === displayedName.text ?
              <div /> :
              <div style={displayedName.text.length > 20 ? styles.small : ''}>{displayedName.text}</div>}
            {this.renderSynonyms()}
          </TagCloud> :
          <div>
            <h3>{displayedName.initials}</h3>
            <h4>{displayedName.text}</h4>
          </div>}
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
  uai: PropTypes.string.isRequired,
};

NameContainer.defaultProps = {
  date_end: '',
  synonym: null,
};

export default NameContainer;
