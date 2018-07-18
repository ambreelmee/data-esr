import React, { Component } from 'react';
import {
  Button, Card, CardBody, Col, Form, FormGroup,
  Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import DeleteModalContainer from '../../../containers/Institutions/DeleteModalContainer';

class StatusModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date_end: this.props.date_end,
      date_start: this.props.date_start,
    };
    this.updateInstitution = this.updateInstitution.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  updateInstitution() {
    const institution = {
      date_start: this.state.date_start,
      date_end: this.state.date_end,
    };
    const url = `${process.env.API_URL_STAGING}institutions/${this.props.institutionId}`;
    this.props.addContent(url, JSON.stringify({ institution }), 'PUT', this.props.institutionId);
  }

  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggleModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          Modifier le statut de l&#39;établissement
        </ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <Form className="form-horizontal">
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Date de début d&#39;activité</Label>
                      <Input
                        type="date"
                        id="date_start"
                        value={this.state.date_start ? this.state.date_start : ''}
                        placeholder={this.state.date_start ? this.state.date_start : ''}
                        onChange={this.onChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Date de fin d&#39;activité</Label>
                      <Input
                        type="date"
                        id="date_end"
                        value={this.state.date_end ? this.state.date_end : ''}
                        placeholder={this.state.date_end ? this.state.date_end : ''}
                        onChange={this.onChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
              <p>Vous pouvez ajouter un prédécesseur ou un succésseur à cet établissement via la carte évolution</p>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.props.toggleDeleteModal} >
            Supprimer défintivement
          </Button>
          <DeleteModalContainer
            deleteUrl={`${process.env.API_BCE_URL}institutions/${this.props.uai}`}
            modal={this.props.deleteModal}
            toggleModal={this.props.toggleDeleteModal}
            message={
              <div>
                <p className="text-danger">Etes-vous sûr de vouloir supprimer cet établissement ?</p><br />
                Toutes les données liées à cet établissement seront perdues et les mises à jour
                automatiques avec le référentiel de la BCE ne sera plus assurée.<br />
                Si vous souhaitez seulement déclarer l&#39;établissement comme <strong>fermé</strong>,
                 modifiez le bloc qui indique la date d&#39;ouverture à gauche du bouton supprimer
              </div>}
          />
          {this.props.hasErrored ?
            <p className="mt-2 text-danger">Erreur lors de l&#39;envoi du formulaire</p> :
            <p className="mt-2"> ou </p>}
          <Button
            className="m-1 float-right"
            color="primary"
            disabled={this.props.isLoading}
            onClick={!this.props.isLoading ? this.updateInstitution : null}
          >
            {this.props.isLoading ?
              <div>
                <i className="fa fa-spinner fa-spin " />
                <span className="mx-1"> Modification </span>
              </div> :
              <div>
              Modifier le statut
              </div>}
          </Button>
          <Button color="secondary" onClick={this.props.toggleModal}>Annuler</Button>
        </ModalFooter>
      </Modal>

    );
  }
}

StatusModal.propTypes = {
  addContent: PropTypes.func.isRequired,
  date_start: PropTypes.string.isRequired,
  date_end: PropTypes.string,
  deleteModal: PropTypes.bool.isRequired,
  hasErrored: PropTypes.bool.isRequired,
  institutionId: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  modal: PropTypes.bool.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  uai: PropTypes.string.isRequired,
};

StatusModal.defaultProps = {
  date_end: null,
};

export default StatusModal;
