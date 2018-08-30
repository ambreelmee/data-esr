import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import UpdateFormButton from './UpdateFormButton';


class NameForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initials: this.props.initials,
      text: this.props.text,
      date_start: this.props.date_start ? this.props.date_start : moment().format('YYYY-MM-DD'),
      date_end: this.props.date_end,
      status: this.props.status,
    };
    this.triggerAction = this.triggerAction.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  onRadioChange(event) {
    this.setState({ status: event.target.id });
  }

  triggerAction() {
    const institution_name = {
      initials: this.state.initials,
      text: this.state.text,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      status: this.state.status,
    };
    const jsonBody = JSON.stringify({ institution_name });
    if (this.props.id) {
      const url = `${process.env.API_URL_STAGING}institution_names/${this.props.id}`;
      this.props.addContent(url, jsonBody, 'PUT', this.props.institutionId);
    } else if (this.props.institutionId) {
      const url = `${process.env.API_URL_STAGING}institutions/${this.props.institutionId}/institution_names`;
      this.props.addContent(url, jsonBody, 'POST', this.props.institutionId);
    }
  }


  render() {
    return (
      <Col md="8 p-0">
        <Card>
          <CardBody>
            <Form className="form-horizontal">
              <FormGroup row className="was-validated">
                <Col md="6">
                  <Label>Sigle (min 2 caractères)</Label>
                </Col>
                <Col md="6">
                  <Input
                    id="initials"
                    className="form-control-warning"
                    required
                    type="text"
                    value={this.state.initials ? this.state.initials : ''}
                    placeholder={this.state.initials ? this.state.initials : "Sigle de l'établissement"}
                    onChange={this.onChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="was-validated">
                <Label>Nom de l&#39;établissement</Label>
                <Input
                  id="text"
                  type="text"
                  className="form-control-warning"
                  required
                  value={this.state.text ? this.state.text : ''}
                  placeholder={this.state.text ? this.state.text : "Nom complet de l'établissement"}
                  onChange={this.onChange}
                />
              </FormGroup>
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
              <FormGroup row>
                <Col md="3">
                  <Label>Statut</Label>
                </Col>
                <Col md="9">
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="active"
                      name="status"
                      value="active"
                      checked={this.state.status === 'active'}
                      onChange={this.onRadioChange}
                    />
                    <Label className="form-check-label" check htmlFor="active">Actif</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="radio"
                      id="archived"
                      name="status"
                      value="archived"
                      checked={this.state.status === 'archived'}
                      onChange={this.onRadioChange}
                    />
                    <Label className="form-check-label" check htmlFor="archived">Archivé</Label>
                  </FormGroup>
                </Col>
              </FormGroup>
            </Form>
            Les champs colorés sont obligatoires
          </CardBody>
          <CardFooter>
            {this.props.id ?
              <Button
                className="float-left rounded mt-1"
                color="danger"
                onClick={() => this.props.toggleDeleteModal(`${process.env.API_URL_STAGING}institution_names/${this.props.id}`)}
              >
                Supprimer
              </Button> : <div />}
            <UpdateFormButton
              hasErrored={this.props.hasErrored}
              isLoading={this.props.isLoading}
              color={this.props.id ? 'secondary' : 'primary'}
              message={this.props.id ? 'Modifier le nom' : 'Ajouter un nom'}
              triggerAction={this.triggerAction}
            />
          </CardFooter>
        </Card>
      </Col>
    );
  }
}

NameForm.propTypes = {
  addContent: PropTypes.func,
  hasErrored: PropTypes.bool.isRequired,
  id: PropTypes.number,
  initials: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  date_start: PropTypes.string,
  date_end: PropTypes.string,
  institutionId: PropTypes.number,
  setActiveItem: PropTypes.func.isRequired,
  status: PropTypes.string,
  text: PropTypes.string,
  toggleDeleteModal: PropTypes.string.isRequired,
};

NameForm.defaultProps = {
  addContent: null,
  id: null,
  initials: null,
  date_start: null,
  date_end: null,
  institutionId: null,
  status: 'active',
  text: null,
};

export default NameForm;
