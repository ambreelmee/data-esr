import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addContent, toggleAddModal, toggleEditModal, toggleDeleteModal } from '../../actions/institution';
import TableModal from '../../views/Institutions/TableModal';

const TableModalContainer = (props) => {
  return (
    <TableModal
      activeId={props.activeId}
      addModal={props.addModal}
      component={React.cloneElement(
        props.component,
        {
          addContent: props.addContent,
          hasErrored: props.addContentHasErrored,
          institutionId: props.institutionId,
          isLoading: props.addContentIsLoading,
          modal: props.addModal,
          toggleModal: props.toggleAddModal,
        },
      )}
      content={props.content}
      deleteModal={props.deleteModal}
      deleteUrl={props.deleteUrl}
      editModal={props.editModal}
      institutionId={props.institutionId}
      modal={props.tableModal}
      tableHeader={props.tableHeader}
      toggleAddModal={props.toggleAddModal}
      toggleDeleteModal={props.toggleDeleteModal}
      toggleEditModal={props.toggleEditModal}
      toggleModal={props.toggleTableModal}
    />);
}

const mapStateToProps = state => ({
  activeId: state.activeInstitution.activeId,
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  institutionId: state.activeInstitution.institution.id,
  deleteModal: state.activeInstitution.deleteModal,
  editModal: state.activeInstitution.editModal,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  toggleDeleteModal: url => dispatch(toggleDeleteModal(url)),
  toggleEditModal: id => dispatch(toggleEditModal(id)),
});

TableModalContainer.propTypes = {
  activeId: PropTypes.number,
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  addModal: PropTypes.bool,
  component: PropTypes.object.isRequired,
  content: PropTypes.array.isRequired,
  deleteModal: PropTypes.bool,
  deleteUrl: PropTypes.string.isRequired,
  editModal: PropTypes.bool,
  institutionId: PropTypes.number.isRequired,
  tableHeader: PropTypes.array.isRequired,
  tableModal: PropTypes.bool.isRequired,
  toggleAddModal: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  toggleEditModal: PropTypes.func.isRequired,
  toggleTableModal: PropTypes.func.isRequired,
};

TableModalContainer.defaultProps = {
  activeId: 0,
  addContentHasErrored: false,
  addContentIsLoading: false,
  addModal: false,
  deleteModal: false,
  editModal: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableModalContainer);
