import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Alert, ButtonGroup, ButtonDropdown, Card, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import PropTypes from 'prop-types';
import { updateSynonymList, addContent, toggleAddModal, toggleEditModal } from '../../actions/institution';
import { getActiveEntity } from '../../views/Institutions/methods';
import StatusModal from '../../views/Institutions/Name/StatusModal';
import TableModal from '../../views/Institutions/TableModal';
import SynonymsModal from '../../views/Institutions/Name/SynonymsModal';
import NameModal from '../../views/Institutions/Name/NameModal';
import SynonymBox from '../../views/Institutions/Name/SynonymBox';


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
    if (nextProps.institutionId !== this.props.institutionId) {
      this.props.getActiveInstitution(nextProps.institutionId);
    }
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
                <TableModal
                  addModal={this.props.addModal}
                  component={
                    <NameModal
                      addContent={this.props.addContent}
                      hasErrored={this.props.addContentHasErrored}
                      institutionId={this.props.institutionId}
                      isLoading={this.props.addContentIsLoading}
                      toggleModal={this.props.toggleAddModal}
                    />}
                  deleteUrl={`${process.env.API_URL_STAGING}institution_names/`}
                  content={this.props.names}
                  editModal={this.props.editModal}
                  institutionId={this.props.institutionId}
                  modal={this.state.historyModal}
                  tableHeader={['Sigle', 'Nom complet', 'Début', 'Fin', 'Statut', 'Action']}
                  toggleAddModal={this.props.toggleAddModal}
                  toggleEditModal={this.props.toggleEditModal}
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
                  <StatusModal
                    addContent={this.props.addContent}
                    hasErrored={this.props.addContentHasErrored}
                    institutionId={this.props.institutionId}
                    isLoading={this.props.addContentIsLoading}
                    date_end={this.props.dateEnd}
                    date_start={this.props.dateStart}
                    getData={this.props.getActiveInstitution}
                    modal={this.state.statusModal}
                    toggleModal={this.toggleStatusModal}
                    uai={this.props.uai ? this.props.uai.content : 'X'}
                  /> : <div />}
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </ButtonGroup>
        {width > 767 ?
          <SynonymBox
            initials={displayedName.initials}
            text={displayedName.text}
            synonym={this.props.synonym}
          /> :
          <div>
            <h3>{displayedName.initials}</h3>
            <h4>{displayedName.text}</h4>
          </div>}
      </Card>
    );
  }
}
const mapStateToProps = state => ({
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  addModal: state.activeInstitution.addModal,
  institutionId: state.activeInstitution.institution.id,
  dateEnd: state.activeInstitution.institution.date_end,
  dateStart: state.activeInstitution.institution.date_start,
  editModal: state.activeInstitution.editModal,
  names: state.activeInstitution.institution.names,
  synonym: state.activeInstitution.institution.synonym,
  synonymHasErrored: state.activeInstitution.synonymHasErrored,
  synonymIsLoading: state.activeInstitution.synonymIsLoading,
  uai: state.activeInstitution.institution.codes.find(code => code.category === 'uai'),
});

const mapDispatchToProps = dispatch => ({
  updateSynonymList: (url, synonym) => dispatch(updateSynonymList(url, synonym)),
  addContent: (url, jsonBody, method) => dispatch(addContent(url, jsonBody, method)),
  toggleAddModal: () => dispatch(toggleAddModal()),
  toggleEditModal: () => dispatch(toggleEditModal()),
});

NameContainer.propTypes = {
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  addModal: PropTypes.bool,
  getActiveInstitution: PropTypes.func.isRequired,
  institutionId: PropTypes.number.isRequired,
  dateEnd: PropTypes.string,
  dateStart: PropTypes.string,
  editModal: PropTypes.bool,
  names: PropTypes.array.isRequired,
  synonym: PropTypes.string,
  synonymHasErrored: PropTypes.bool,
  synonymIsLoading: PropTypes.bool,
  toggleAddModal: PropTypes.func.isRequired,
  toggleEditModal: PropTypes.func.isRequired,
  uai: PropTypes.string,
  updateSynonymList: PropTypes.func.isRequired,
};

NameContainer.defaultProps = {
  addContentHasErrored: false,
  addContentIsLoading: false,
  addModal: false,
  dateEnd: '',
  dateStart: '',
  editModal: false,
  synonym: '',
  synonymHasErrored: false,
  synonymIsLoading: false,
  uai: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(NameContainer);
