import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getActiveEntity } from '../../views/Institutions/methods';
import { addContent, toggleAddAddressModal, toggleEditModal } from '../../actions/institution';
import AddressCard from '../../views/Institutions/Address/AddressCard';
import TableModalContainer from './TableModalContainer';
import AddressModal from '../../views/Institutions/Address/AddressModal';
import ConnectionContainer from '../../views/Institutions/Relation/ConnectionContainer';
import CodeContainer from '../../views/Institutions/Code/CodeContainer';
import LeafletMap from '../../views/Institutions/Address/LeafletMap';


class AddressContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
      tableModal: false,
    };
    this.displayDropdown = this.displayDropdown.bind(this);
    this.toggleTableModal = this.toggleTableModal.bind(this);
  }

  toggleTableModal() {
    this.setState({
      tableModal: !this.state.tableModal,
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
              addContent={this.props.addContent}
              formattedAddress={
                <p>
                  {displayedAddress.address_1}
                  {displayedAddress.address_2 ? <br /> : <span />}
                  {displayedAddress.address_2}<br />
                  {`${displayedAddress.zip_code} ,${displayedAddress.city}`}<br />
                  {displayedAddress.country}
                </p>}
              id={displayedAddress.id}
              institutionId={this.props.institutionId}
              isLoading={this.props.addContentIsLoading}
              latitude={displayedAddress.latitude}
              longitude={displayedAddress.longitude}
            /> : <div />}
          <ConnectionContainer etablissement_id={this.props.institutionId} />
        </Col>
        <Col md="4">
          <Row>
            <AddressCard
              addModal={this.props.addModal}
              displayedAddress={displayedAddress}
              dropdown={this.state.dropdown}
              displayDropdown={this.displayDropdown}
              id={displayedAddress.id}
              toggleAddModal={this.props.toggleAddModal}
              toggleTableModal={this.toggleTableModal}
            />
            {this.state.tableModal ?
              <TableModalContainer
                addModal={this.props.addModal}
                component={<AddressModal />}
                deleteUrl={`${process.env.API_URL_STAGING}addresses`}
                content={this.props.addresses}
                tableHeader={
                  ['Raison sociale', 'Champ adresse 1', 'Champ adresse 2', 'Code postale',
                  'Ville', 'Code commune', 'Pays', 'Téléphone', 'Début', 'Fin', 'Statut', 'Action ']
                }
                tableModal={this.state.tableModal}
                toggleAddModal={this.props.toggleAddModal}
                toggleTableModal={this.toggleTableModal}
              /> : <div />}
            <CodeContainer etablissement_id={this.props.institutionId} />
            <AddressModal
              addContent={this.props.addContent}
              hasErrored={this.props.addContentHasErrored}
              institutionId={this.props.institutionId}
              isLoading={this.props.addContentIsLoading}
              modal={this.props.addModal}
              toggleModal={this.props.toggleAddModal}
            />
          </Row>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  addModal: state.activeInstitution.addAddressModal,
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  addresses: state.activeInstitution.institution.addresses,
  institutionId: state.activeInstitution.institution.id,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  toggleAddModal: () => dispatch(toggleAddAddressModal()),
  toggleEditModal: id => dispatch(toggleEditModal(id)),
});

AddressContainer.propTypes = {
  addContent: PropTypes.func.isRequired,
  addModal: PropTypes.bool,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  addresses: PropTypes.array.isRequired,
  institutionId: PropTypes.number.isRequired,
  toggleAddModal: PropTypes.func.isRequired,
  toggleEditModal: PropTypes.func.isRequired,
};

AddressContainer.defaultProps = {
  addModal: false,
  addContentHasErrored: false,
  addContentIsLoading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressContainer);
