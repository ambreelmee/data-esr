import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import { updateSynonymList, addContent, toggleDeleteModal, toggleAddNameModal, setDisplayedName } from '../../actions/institution';
import { getActiveEntity } from '../../views/Institutions/methods';
import StatusModal from '../../views/Institutions/Name/StatusModal';
import SynonymsModal from '../../views/Institutions/Name/SynonymsModal';
import NameCard from '../../views/Institutions/Name/NameCard';


class NameMainContainer extends Component {
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
      '' : ` - ${displayedName.text.toProperCase()}`}`)
    return (
      <Row>
        <NameCard
          dateEnd={this.props.dateEnd}
          dateStart={this.props.dateStart}
          dropdown={this.state.dropdown}
          displayDropdown={this.displayDropdown}
          initials={displayedName.initials}
          institutionId={this.props.institutionId}
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
      </Row>
    );
  }
}
const mapStateToProps = state => ({
  addModal: state.activeInstitution.addNameModal,
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  institutionId: state.activeInstitution.institution.id,
  dateEnd: state.activeInstitution.institution.date_end,
  dateStart: state.activeInstitution.institution.date_start,
  deleteModal: state.activeInstitution.deleteModal,
  names: state.activeInstitution.institution.names,
  synonym: state.activeInstitution.institution.synonym,
  synonymHasErrored: state.activeInstitution.synonymHasErrored,
  synonymIsLoading: state.activeInstitution.synonymIsLoading,
  uai: state.activeInstitution.institution.codes.find(code => code.category === 'uai'),
});

const mapDispatchToProps = dispatch => ({
  updateSynonymList: (url, synonym) => dispatch(updateSynonymList(url, synonym)),
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  setDisplayedName: name => dispatch(setDisplayedName(name)),
  toggleDeleteModal: () => dispatch(toggleDeleteModal()),
});

NameMainContainer.propTypes = {
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  getActiveInstitution: PropTypes.func.isRequired,
  institutionId: PropTypes.number.isRequired,
  dateEnd: PropTypes.string,
  dateStart: PropTypes.string,
  deleteModal: PropTypes.bool,
  names: PropTypes.array.isRequired,
  setDisplayedName: PropTypes.func.isRequired,
  synonym: PropTypes.string,
  synonymHasErrored: PropTypes.bool,
  synonymIsLoading: PropTypes.bool,
  toggleDeleteModal: PropTypes.func.isRequired,
  uai: PropTypes.object,
  updateSynonymList: PropTypes.func.isRequired,
};

NameMainContainer.defaultProps = {
  addContentHasErrored: false,
  addContentIsLoading: false,
  addModal: false,
  dateEnd: '',
  dateStart: '',
  deleteModal: false,
  synonym: '',
  synonymHasErrored: false,
  synonymIsLoading: false,
  uai: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(NameMainContainer);
