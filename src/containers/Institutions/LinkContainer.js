import React, { Component } from 'react';
import { Row } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addContent, setActiveItem, removeActiveItem, toggleDeleteModal } from '../../actions/institution';
import CustomSideBar from '../../views/Institutions/InstitutionPage/Details/CustomSideBar';
import LinkForm from '../../views/Institutions/InstitutionPage/Details/LinkForm';
import DeleteModalContainer from './DeleteModalContainer';
import NavBreadcrumb from '../../views/Institutions/InstitutionPage/Details/NavBreadcrumb';

const LinkComponent = props => (
  <h4>{props.category}</h4>);

class LinkContainer extends Component {
  componentWillMount() {
    const activeItem = this.props.links.find(link => link.category === 'website');
    this.props.setActiveItem(activeItem);
  }

  render() {
    return (
      <div>
        <Row className="bg-light mt-3">
          <NavBreadcrumb
            displayedName={this.props.displayedName}
            institutionId={this.props.institutionId}
            type="Lien"
          />
        </Row>
        <Row>
          <CustomSideBar
            activeId={this.props.activeItem ? this.props.activeItem.id : null}
            component={<LinkComponent />}
            content={this.props.links}
            removeActiveItem={this.props.removeActiveItem}
            setActiveItem={this.props.setActiveItem}
            buttonText="Ajouter un lien"
          />
          <LinkForm
            addContent={this.props.addContent}
            hasErrored={this.props.addContentHasErrored}
            institutionId={this.props.institutionId}
            isLoading={this.props.addContentIsLoading}
            deleteModal={this.props.deleteModal}
            setActiveItem={this.props.setActiveItem}
            linkCategories={this.props.linkCategories}
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
  linkCategories: state.activeInstitution.linkCategories,
  links: state.activeInstitution.institution.links,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  setActiveItem: item => dispatch(setActiveItem(item)),
  removeActiveItem: () => dispatch(removeActiveItem()),
  toggleDeleteModal: url => dispatch(toggleDeleteModal(url)),
});

LinkContainer.propTypes = {
  activeItem: PropTypes.object,
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  deleteModal: PropTypes.bool,
  displayedName: PropTypes.string.isRequired,
  institutionId: PropTypes.number.isRequired,
  removeActiveItem: PropTypes.func.isRequired,
  setActiveItem: PropTypes.func.isRequired,
  linkCategories: PropTypes.array.isRequired,
  links: PropTypes.array.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
};

LinkContainer.defaultProps = {
  activeItem: null,
  addContentHasErrored: false,
  addContentIsLoading: false,
  deleteModal: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(LinkContainer);
