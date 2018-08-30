import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import {
  updateSynonymList, addContent, toggleDeleteModal, setDisplayedName
  , getFollowers, getPredecessors,
} from '../../actions/institution';
import { getActiveEntity } from '../../views/Institutions/methods';
import StatusModal from '../../views/Institutions/InstitutionPage/Main/StatusModal';
import SynonymsModal from '../../views/Institutions/InstitutionPage/Main/Synonym/SynonymsModal';
import EvolutionCard from '../../views/Institutions/InstitutionPage/Main/EvolutionCard';


class EvolutionCardContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      statusModal: false,
      dropdown: false,
      synonymModal: false,
    };

    this.displayDropdown = this.displayDropdown.bind(this);
    this.toggleStatusModal = this.toggleStatusModal.bind(this);
    this.toggleSynonymModal = this.toggleSynonymModal.bind(this);
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

  toggleSynonymModal() {
    this.setState({
      synonymModal: !this.state.synonymModal,
    });
  }

  displayDropdown() {
    this.setState({
      dropdown: !this.state.dropdown,
    });
  }

  render() {
    const replacementName = this.props.names ? this.props.names[0] : null;
    const displayedName = getActiveEntity(this.props.names) ? getActiveEntity(this.props.names) : replacementName;
    this.props.setDisplayedName(`${displayedName.initials}${displayedName.initials === displayedName.text ?
      '' : ` - ${displayedName.text.toProperCase()}`}`);
    return (
      <div>
        <EvolutionCard
          dateEnd={this.props.dateEnd}
          dateStart={this.props.dateStart}
          dropdown={this.state.dropdown}
          displayDropdown={this.displayDropdown}
          followers={this.props.followers}
          initials={displayedName.initials}
          institutionId={this.props.institutionId}
          predecessors={this.props.predecessors}
          synonym={this.props.synonym}
          text={displayedName.text}
          toggleStatusModal={this.toggleStatusModal}
          toggleSynonymModal={this.toggleSynonymModal}
        />
        <SynonymsModal
          institutionId={this.props.institutionId}
          isLoading={this.props.synonymIsLoading}
          hasErrored={this.props.synonymHasErrored}
          modal={this.state.synonymModal}
          synonyms={this.props.synonym}
          toggleModal={this.toggleSynonymModal}
          updateSynonymList={this.props.updateSynonymList}
          url={`${process.env.API_URL_STAGING}institutions/${this.props.institutionId}`}
        />
        <StatusModal
          addContent={this.props.addContent}
          hasErrored={this.props.addContentHasErrored}
          institutionId={this.props.institutionId}
          isLoading={this.props.addContentIsLoading}
          date_end={this.props.dateEnd}
          date_start={this.props.dateStart}
          deleteModal={this.props.deleteModal}
          getData={this.props.getActiveInstitution}
          modal={this.state.statusModal}
          toggleDeleteModal={this.props.toggleDeleteModal}
          toggleModal={this.toggleStatusModal}
          uai={this.props.uai ? this.props.uai.content : 'X'}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  institutionId: state.activeInstitution.institution.id,
  dateEnd: state.activeInstitution.institution.date_end,
  dateStart: state.activeInstitution.institution.date_start,
  deleteModal: state.activeInstitution.deleteModal,
  followers: state.activeInstitution.followers,
  followersIsLoading: state.activeInstitution.followersIsLoading,
  names: state.activeInstitution.institution.names,
  predecessors: state.activeInstitution.predecessors,
  predecessorsIsLoading: state.activeInstitution.predecessorsIsLoading,
  synonym: state.activeInstitution.institution.synonym,
  synonymHasErrored: state.activeInstitution.synonymHasErrored,
  synonymIsLoading: state.activeInstitution.synonymIsLoading,
  uai: state.activeInstitution.institution.codes.find(code => code.category === 'uai'),
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  getFollowers: id => dispatch(getFollowers(id)),
  getPredecessors: id => dispatch(getPredecessors(id)),
  setDisplayedName: name => dispatch(setDisplayedName(name)),
  toggleDeleteModal: () => dispatch(toggleDeleteModal()),
  updateSynonymList: (url, synonym) => dispatch(updateSynonymList(url, synonym)),
});

EvolutionCardContainer.propTypes = {
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  getActiveInstitution: PropTypes.func.isRequired,
  institutionId: PropTypes.number.isRequired,
  dateEnd: PropTypes.string,
  dateStart: PropTypes.string,
  deleteModal: PropTypes.bool,
  followers: PropTypes.array,
  followersIsLoading: PropTypes.bool,
  getPredecessors: PropTypes.func.isRequired,
  predecessors: PropTypes.array,
  predecessorsIsLoading: PropTypes.bool,
  names: PropTypes.array.isRequired,
  setDisplayedName: PropTypes.func.isRequired,
  synonym: PropTypes.string,
  synonymHasErrored: PropTypes.bool,
  synonymIsLoading: PropTypes.bool,
  toggleDeleteModal: PropTypes.func.isRequired,
  uai: PropTypes.object,
  updateSynonymList: PropTypes.func.isRequired,
};

EvolutionCardContainer.defaultProps = {
  addContentHasErrored: false,
  addContentIsLoading: false,
  dateEnd: '',
  dateStart: '',
  deleteModal: false,
  followersIsLoading: false,
  predecessorsIsLoading: false,
  synonym: '',
  synonymHasErrored: false,
  synonymIsLoading: false,
  uai: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(EvolutionCardContainer);
