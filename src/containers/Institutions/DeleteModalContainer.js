import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleDeleteModal, deleteContent } from '../../actions/institution';
import DeleteModal from '../../views/Institutions/DeleteModal';

const DeleteModalContainer = props => (
  <DeleteModal
    deleteMethod={() => props.deleteContent(props.deleteUrl, props.institutionId)}
    hasErrored={props.deleteContentHasErrored}
    isLoading={props.deleteContentIsLoading}
    modal={props.modal}
    toggleModal={props.toggleModal}
  />
);

const mapStateToProps = state => ({
  deleteContentHasErrored: state.activeInstitution.deleteContentHasErrored,
  deleteContentIsLoading: state.activeInstitution.deleteContentIsLoading,
});

const mapDispatchToProps = dispatch => ({
  toggleDeleteModal: () => dispatch(toggleDeleteModal()),
  deleteContent: (url, id) => dispatch(deleteContent(url, id)),
});

DeleteModalContainer.propTypes = {
  deleteContent: PropTypes.func.isRequired,
  deleteContentHasErrored: PropTypes.bool,
  deleteContentIsLoading: PropTypes.bool,
  modal: PropTypes.bool.isRequired,
  institutionId: PropTypes.number.isRequired,
  toggleModal: PropTypes.func.isRequired,
  deleteUrl: PropTypes.string.isRequired,
};

DeleteModalContainer.defaultProps = {
  deleteContentHasErrored: false,
  deleteContentIsLoading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModalContainer);
