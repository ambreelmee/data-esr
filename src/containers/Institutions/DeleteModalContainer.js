import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteContent } from '../../actions/institution';
import DeleteModal from '../../views/Institutions/DeleteModal';

const DeleteModalContainer = props => (
  <DeleteModal
    deleteMethod={() => props.deleteContent(props.deleteUrl, props.institutionId)}
    hasErrored={props.hasErrored}
    isLoading={props.isLoading}
    modal={props.modal}
    toggleModal={props.toggleModal}
    message={props.message}
  />
);

const mapStateToProps = state => ({
  deleteUrl: state.activeInstitution.deleteUrl,
  hasErrored: state.activeInstitution.deleteContentHasErrored,
  isLoading: state.activeInstitution.deleteContentIsLoading,
});

const mapDispatchToProps = dispatch => ({
  deleteContent: (url, id) => dispatch(deleteContent(url, id)),
});

DeleteModalContainer.propTypes = {
  deleteContent: PropTypes.func.isRequired,
  deleteUrl: PropTypes.string.isRequired,
  hasErrored: PropTypes.bool,
  institutionId: PropTypes.number,
  isLoading: PropTypes.bool,
  modal: PropTypes.bool,
  message: PropTypes.string,
  toggleModal: PropTypes.func.isRequired,
};

DeleteModalContainer.defaultProps = {
  hasErrored: false,
  isLoading: false,
  institutionId: null,
  message: '',
  modal: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModalContainer);
