import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getActiveEntity } from '../../views/Institutions/methods';
import { addContent, toggleAddModal, toggleEditModal, toggleDeleteModal } from '../../actions/institution';
import AddressCard from '../../views/Institutions/Address/AddressCard';
import TableModal from '../../views/Institutions/TableModal';
import AddressModal from '../../views/Institutions/Address/AddressModal';
import ConnectionContainer from '../../views/Institutions/Relation/ConnectionContainer';
import CodeContainer from '../../views/Institutions/Code/CodeContainer';
import LeafletMap from '../../views/Institutions/Address/LeafletMap';


class AddressContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      deleteModal: false,
      dropdown: false,
      editModal: false,
      tableModal: false,
      isLoading: false,
    };
    this.deleteAddress = this.deleteAddress.bind(this);
    this.displayDropdown = this.displayDropdown.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleTableModal = this.toggleTableModal.bind(this);
  }

  deleteAddress(adressId, etablissementId) {
    this.setState({ isLoading: true });
    fetch(
      `${process.env.API_URL_STAGING}addresses/${adressId}`,
      {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')})`,
        }),
        body: JSON.stringify({ address: { id: adressId } }),
      },
    )
      .then(res => res.json())
      .then(() => {
        this.setState({
          isLoading: false,
        });
        this.getAddresses(etablissementId);
      });
  }


  toggleTableModal() {
    this.setState({
      tableModal: !this.state.tableModal,
    });
  }

  toggleDeleteModal() {
    this.setState({
      deleteModal: !this.state.deleteModal,
    });
  }

  toggleEditModal() {
    this.setState({
      editModal: !this.state.editModal,
    });
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    });
  }

  displayDropdown() {
    this.setState({
      dropdown: !this.state.dropdown,
    });
  }

  render() {
    if (this.state.isLoading) {
      return <p />;
    }
    const replacementAddress = this.props.addresses ? this.props.addresses[0] : null;
    const displayedAddress = getActiveEntity(this.props.addresses) ?
      getActiveEntity(this.props.addresses) : replacementAddress;
    return (
      <Row>
        <Col md="8" className="pl-0">
          {displayedAddress && displayedAddress.latitude && displayedAddress.longitude ?
            <LeafletMap
              currentAddress={displayedAddress}
              etablissement_id={this.props.institutionId}
              getAddresses={this.getAddresses}
            /> : <div />}
          <ConnectionContainer etablissement_id={this.props.institutionId} />
        </Col>
        <Col md="4">
          <Row>
            <AddressCard
              displayedAddress={displayedAddress}
              dropdown={this.state.dropdown}
              displayDropdown={this.displayDropdown}
              toggleAddModal={this.props.toggleAddModal}
              toggleTableModal={this.toggleTableModal}
            />
            {this.state.editModal ?
              (<AddressModal
                getAddresses={this.getAddresses}
                toggleModal={this.toggleEditModal}
                address_1={displayedAddress.address_1}
                address_2={displayedAddress.address_2}
                business_name={displayedAddress.business_name}
                city={displayedAddress.city}
                city_code={displayedAddress.city_code}
                country={displayedAddress.country}
                date_start={displayedAddress.date_start}
                date_end={displayedAddress.date_end}
                etablissement_id={this.props.institutionId}
                id={displayedAddress.id}
                phone={displayedAddress.phone}
                status={displayedAddress.status}
                zip_code={displayedAddress.zip_code}
              />) : <div /> }
            {this.state.addModal ?
              (<AddressModal
                etablissement_id={this.props.institutionId}
                getAddresses={this.getAddresses}
                toggleModal={this.toggleAddModal}
              />) : <div /> }
            {this.state.tableModal ?
              <TableModal
                addModal={this.props.addModal}
                component={
                  <AddressModal
                    addContent={this.props.addContent}
                    hasErrored={this.props.addContentHasErrored}
                    institutionId={this.props.institutionId}
                    isLoading={this.props.addContentIsLoading}
                    toggleModal={this.props.toggleAddModal}
                  />}
                deleteModal={this.props.deleteModal}
                deleteUrl={`${process.env.API_URL_STAGING}addresses/`}
                content={this.props.addresses}
                editModal={this.props.editModal}
                institutionId={this.props.institutionId}
                modal={this.state.tableModal}
                tableHeader={
                  ['Raison sociale', 'Champ adresse 1', 'Champ adresse 2', 'Code postale',
                  'Ville', 'Code commune', 'Pays', 'Téléphone', 'Début', 'Fin', 'Statut', 'Action ']
                }
                toggleAddModal={this.props.toggleAddModal}
                toggleDeleteModal={this.props.toggleDeleteModal}
                toggleEditModal={this.props.toggleEditModal}
                toggleModal={this.toggleTableModal}
              /> : <div />}
            <CodeContainer etablissement_id={this.props.institutionId} />
          </Row>
        </Col>
      </Row>
    );
  }
}
const mapStateToProps = state => ({
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  addresses: state.activeInstitution.institution.addresses,
  addModal: state.activeInstitution.addModal,
  institutionId: state.activeInstitution.institution.id,
  deleteModal: state.activeInstitution.deleteModal,
  editModal: state.activeInstitution.editModal,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method) => dispatch(addContent(url, jsonBody, method)),
  toggleAddModal: () => dispatch(toggleAddModal()),
  toggleDeleteModal: () => dispatch(toggleDeleteModal()),
  toggleEditModal: () => dispatch(toggleEditModal()),
});

AddressContainer.propTypes = {
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  addresses: PropTypes.array.isRequired,
  addModal: PropTypes.bool,
  institutionId: PropTypes.number.isRequired,
  deleteModal: PropTypes.bool,
  editModal: PropTypes.bool,
  toggleAddModal: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  toggleEditModal: PropTypes.func.isRequired,
};

AddressContainer.defaultProps = {
  addContentHasErrored: false,
  addContentIsLoading: false,
  addModal: false,
  deleteModal: false,
  editModal: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressContainer);
