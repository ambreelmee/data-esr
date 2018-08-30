import React, { Component } from 'react';
import { Row } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addContent, setActiveItem, removeActiveItem, toggleDeleteModal } from '../../actions/institution';
import { getActiveEntity } from '../../views/Institutions/methods';
import CustomSideBar from '../../views/Institutions/InstitutionPage/Details/CustomSideBar';
import AddressForm from '../../views/Institutions/InstitutionPage/Details/AddressForm';
import Address from '../../views/Institutions/InstitutionPage/Main/Address/Address';
import DeleteModalContainer from './DeleteModalContainer';
import NavBreadcrumb from '../../views/Institutions/InstitutionPage/Details/NavBreadcrumb';

class AddressContainer extends Component {
  componentWillMount() {
    this.props.setActiveItem(getActiveEntity(this.props.addresses));
  }

  render() {
    return (
      <div>
        <Row className="bg-light mt-3">
          <NavBreadcrumb
            displayedName={this.props.displayedName}
            institutionId={this.props.institutionId}
            type="Adresse"
          />
        </Row>
        <Row>
          <CustomSideBar
            activeId={this.props.activeItem ? this.props.activeItem.id : null}
            component={<Address />}
            content={this.props.addresses}
            removeActiveItem={this.props.removeActiveItem}
            setActiveItem={this.props.setActiveItem}
            buttonText="Ajouter une adresse"
          />
          <AddressForm
            addContent={this.props.addContent}
            hasErrored={this.props.addContentHasErrored}
            institutionId={this.props.institutionId}
            isLoading={this.props.addContentIsLoading}
            deleteModal={this.props.deleteModal}
            setActiveItem={this.props.setActiveItem}
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
  addresses: state.activeInstitution.institution.addresses,
  displayedName: state.activeInstitution.displayedName,
  deleteModal: state.activeInstitution.deleteModal,
  institutionId: state.activeInstitution.institution.id,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  setActiveItem: item => dispatch(setActiveItem(item)),
  removeActiveItem: () => dispatch(removeActiveItem()),
  toggleDeleteModal: url => dispatch(toggleDeleteModal(url)),
});

AddressContainer.propTypes = {
  activeItem: PropTypes.object,
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  addresses: PropTypes.array.isRequired,
  deleteModal: PropTypes.bool,
  displayedName: PropTypes.string.isRequired,
  institutionId: PropTypes.number.isRequired,
  removeActiveItem: PropTypes.func.isRequired,
  setActiveItem: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
};

AddressContainer.defaultProps = {
  activeItem: null,
  addContentHasErrored: false,
  addContentIsLoading: false,
  deleteModal: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressContainer);
