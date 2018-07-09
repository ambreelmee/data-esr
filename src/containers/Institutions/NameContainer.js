import React, { Component } from 'react';
import TagCloud from 'react-tag-cloud';
import randomColor from 'randomcolor';
import moment from 'moment';
import { connect } from 'react-redux';
import { Alert, ButtonGroup, ButtonDropdown, Card, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import PropTypes from 'prop-types';
import { updateSynonymList } from '../../actions/institution';
import { getActiveEntity } from '../../views/Institutions/methods';
import EtablissementStatusModal from '../../views/Institutions/Name/EtablissementStatusModal';
import NameHistoryModal from '../../views/Institutions/Name/NameHistoryModal';
import SynonymsModal from '../../views/Institutions/Name/SynonymsModal';

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
    };

    this.displayDropdown = this.displayDropdown.bind(this);
    this.toggleStatusModal = this.toggleStatusModal.bind(this);
    this.toggleSynonymModal = this.toggleSynonymModal.bind(this);
    this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.props.getActiveInstitution(nextProps.institutionId);
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
    const replacementName = this.props.names ? this.props.names[0] : null;
    const displayedName = getActiveEntity(this.props.names) ? getActiveEntity(this.props.names) : replacementName;
    return (
      <Card className="mb-0 mt-2 w-100 text-center" style={{ height: '175px' }}>
        <Alert color={this.props.dateEnd ? 'danger' : 'success'}>
          {this.props.dateEnd ?
            `Cet établissement est fermé depuis le ${moment(this.props.dateEnd).format('LL')}` :
            `Cet établissement est ouvert depuis le ${moment(this.props.dateStart).format('LL')}`}
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
                  etablissement_id={this.props.institutionId}
                  getData={this.props.getActiveInstitution}
                  history={this.props.names}
                  toggleModal={this.toggleHistoryModal}
                /> : <div />}
              <DropdownItem onClick={this.toggleSynonymModal}>
                <i className="fa fa-edit text-warning" />
                  Modifier la liste des noms d&#39;usage
              </DropdownItem>
              {this.state.synonymModal ?
                <SynonymsModal
                  institutionId={this.props.institutionId}
                  isLoading={this.props.synonymIsLoading}
                  hasErrored={this.props.synonymHasErrored}
                  modal={this.state.synonymModal}
                  synonyms={this.props.synonym}
                  toggleModal={this.toggleSynonymModal}
                  updateSynonymList={this.props.updateSynonymList}
                  url={`${process.env.API_URL_STAGING}institutions/${this.props.institutionId}`}
                /> : <div />}
              <DropdownItem onClick={this.toggleStatusModal}>
                <i className="fa fa-pencil text-danger" />
                  Modifier le statut de l&#39;établissement
                {this.state.statusModal ?
                  <EtablissementStatusModal
                    id={this.props.institutionId}
                    date_end={this.props.dateEnd}
                    date_start={this.props.dateStart}
                    getData={this.props.getActiveInstitution}
                    toggleModal={this.toggleStatusModal}
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
              <div style={displayedName.text.length > 25 ? styles.small : ''}>{displayedName.text}</div>}
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
const mapStateToProps = state => ({
  institutionId: state.activeInstitution.institution.id,
  dateEnd: state.activeInstitution.institution.date_end,
  dateStart: state.activeInstitution.institution.date_start,
  names: state.activeInstitution.institution.names,
  synonym: state.activeInstitution.institution.synonym,
  synonymHasErrored: state.activeInstitution.synonymHasErrored,
  synonymIsLoading: state.activeInstitution.synonymIsLoading,
});

const mapDispatchToProps = dispatch => ({
  updateSynonymList: (url, synonym) => dispatch(updateSynonymList(url, synonym)),
});

NameContainer.propTypes = {
  updateSynonymList: PropTypes.func.isRequired,
  getActiveInstitution: PropTypes.func.isRequired,
  institutionId: PropTypes.number.isRequired,
  dateEnd: PropTypes.string,
  dateStart: PropTypes.string,
  names: PropTypes.array.isRequired,
  synonym: PropTypes.string,
  synonymHasErrored: PropTypes.bool,
  synonymIsLoading: PropTypes.bool,
};

NameContainer.defaultProps = {
  dateEnd: '',
  dateStart: '',
  synonym: '',
  synonymHasErrored: false,
  synonymIsLoading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(NameContainer);
