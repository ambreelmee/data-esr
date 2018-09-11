import React, { Component } from 'react';
import { Row } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addContent, setActiveItem, removeActiveItem, toggleDeleteModal } from '../../actions/institution';
import CustomSideBar from '../../views/Institutions/InstitutionPage/Details/CustomSideBar';
import TagForm from '../../views/Institutions/InstitutionPage/Details/TagForm';
import DeleteModalContainer from './DeleteModalContainer';
import NavBreadcrumb from '../../views/Institutions/InstitutionPage/Details/NavBreadcrumb';

const Tag = props => (
  <div className="text-muted">
    <h6>{props.category}</h6>
    <h4>{props.short_label}</h4>
    <h5>{props.long_label}</h5>
  </div>
);

Tag.propTypes = {
  category: PropTypes.string,
  long_label: PropTypes.string,
  short_label: PropTypes.string,
};

Tag.defaultProps = {
  category: '',
  long_label: '',
  short_label: '',
};

class TagContainer extends Component {
  componentDidMount() {
    const { category } = this.props.match.params;
    const activeItem = this.props.institutionTags.find(tag => tag.category === category);
    this.props.setActiveItem(activeItem);
  }

  render() {
    return (
      <div>
        <Row className="bg-light mt-3">
          <NavBreadcrumb
            displayedName={this.props.displayedName}
            institutionId={this.props.institutionId}
            type="Tag"
          />
        </Row>
        <Row>
          <CustomSideBar
            activeId={this.props.activeItem ? this.props.activeItem.id : null}
            component={<Tag />}
            content={this.props.institutionTags}
            removeActiveItem={this.props.removeActiveItem}
            setActiveItem={this.props.setActiveItem}
            buttonText="Ajouter un tag"
          />
          <TagForm
            addContent={this.props.addContent}
            hasErrored={this.props.addContentHasErrored}
            institutionId={this.props.institutionId}
            isLoading={this.props.addContentIsLoading}
            deleteModal={this.props.deleteModal}
            setActiveItem={this.props.setActiveItem}
            tags={this.props.tags}
            tagCategories={this.props.tagCategories}
            toggleDeleteModal={this.props.toggleDeleteModal}
            {...this.props.activeItem}
          />
          <DeleteModalContainer
            institutionId={this.props.institutionId}
            modal={this.props.deleteModal}
            toggleModal={this.props.toggleDeleteModal}
          />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeItem: state.activeInstitution.activeItem,
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  displayedName: state.activeInstitution.displayedName,
  deleteModal: state.activeInstitution.deleteModal,
  institutionId: state.activeInstitution.institution.id,
  institutionTags: state.activeInstitution.institution.tags,
  tagCategories: state.activeInstitution.tagCategories,
  tags: state.activeInstitution.tags,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  setActiveItem: item => dispatch(setActiveItem(item)),
  removeActiveItem: () => dispatch(removeActiveItem()),
  toggleDeleteModal: url => dispatch(toggleDeleteModal(url)),
});

TagContainer.propTypes = {
  activeItem: PropTypes.object,
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  deleteModal: PropTypes.bool,
  displayedName: PropTypes.string.isRequired,
  institutionId: PropTypes.number.isRequired,
  institutionTags: PropTypes.array.isRequired,
  removeActiveItem: PropTypes.func.isRequired,
  setActiveItem: PropTypes.func.isRequired,
  tagCategories: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
};

TagContainer.defaultProps = {
  activeItem: null,
  addContentHasErrored: false,
  addContentIsLoading: false,
  deleteModal: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(TagContainer);
