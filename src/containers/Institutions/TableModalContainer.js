import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addContent, toggleAddModal, toggleEditModal, toggleDeleteModal } from '../../actions/institution';
import TableModal from '../../views/Institutions/TableModal';

class TableModalContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableModal: false,
    };
    this.toggleTableModal = this.toggleTableModal.bind(this);
  }

  toggleTableModal() {
    this.setState({
      tableModal: !this.state.tableModal,
    });
  }

  render() {
    return (
      <TableModal
        addModal={this.props.addModal}
        component={React.cloneElement(
          this.props.component,
          {
            addContent: this.props.addContent,
            hasErrored: this.props.addContentHasErrored,
            institutionId: this.props.institutionId,
            isLoading: this.props.addContentIsLoading,
            toggleModal: this.props.toggleAddModal,
            modal: this.props.addModal,
          },
        )}
        content={this.props.content}
        deleteModal={this.props.deleteModal}
        deleteUrl={this.props.deleteUrl}
        editModal={this.props.editModal}
        institutionId={this.props.institutionId}
        modal={this.props.tableModal}
        tableHeader={this.props.tableHeader}
        toggleAddModal={this.props.toggleAddModal}
        toggleDeleteModal={this.props.toggleDeleteModal}
        toggleEditModal={this.props.toggleEditModal}
        toggleModal={this.props.toggleTableModal}
      />);
  }
}

const mapStateToProps = state => ({
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  addModal: state.activeInstitution.addModal,
  institutionId: state.activeInstitution.institution.id,
  deleteModal: state.activeInstitution.deleteModal,
  editModal: state.activeInstitution.editModal,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method) => dispatch(addContent(url, jsonBody, method)),
  toggleAddModal: () => dispatch(toggleAddModal()),
  toggleDeleteModal: url => dispatch(toggleDeleteModal(url)),
  toggleEditModal: () => dispatch(toggleEditModal()),
});

TableModalContainer.propTypes = {
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
  addContentHasErrored: false,
  addContentIsLoading: false,
  addModal: false,
  deleteModal: false,
  editModal: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableModalContainer);
