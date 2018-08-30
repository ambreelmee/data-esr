import React, { Component } from 'react';
import {
  Button, Card, CardBody, CardFooter, Col, Form, FormGroup,
  Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import UpdateFormButton from './UpdateFormButton';


class CodeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: this.props.content,
      date_start: this.props.date_start,
      date_end: this.props.date_end,
      status: this.props.status,
    };
    this.triggerAction = this.triggerAction.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRadioChange = this.onRadioChange.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  onRadioChange(event) {
    this.setState({ status: event.target.id });
  }

  triggerAction() {
    const code = {
      code_category_id: this.props.categoryId,
      content: this.state.content,
      date_start: this.state.date_start,
      date_end: this.state.date_end,
      status: this.state.status,
    };
    const jsonBody = JSON.stringify({ code });
    if (this.props.id) {
      const url = `${process.env.API_URL_STAGING}codes/${this.props.id}`;
      this.props.addContent(url, jsonBody, 'PUT', this.props.institutionId);
    } else {
      const url = `${process.env.API_URL_STAGING}institutions/${this.props.institutionId}/codes`;
      this.props.addContent(url, jsonBody, 'POST', this.props.institutionId);
    }
  }


  render() {
    return (
      <Col md="8 p-0">
        <Card>
          <CardBody>
            <Form className="form-horizontal">
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    {this.props.category.toUpperCase()}
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  id="content"
                  type="text"
                  value={this.state.content}
                  onChange={this.onChange}
                  placeholder={this.state.content}
                />
              </InputGroup>
              <Row>
                <Col>
                  <FormGroup>
                    <Label>Date de début</Label>
                    <Input
                      type="date"
                      id="date_start"
                      value={this.state.date_start || ''}
                      placeholder={this.state.date_start || ''}
                      onChange={this.onChange}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>Date de fin</Label>
                    <Input
                      type="date"
                      id="date_end"
                      value={this.state.date_end || ''}
                      placeholder={this.state.date_end || ''}
                      onChange={this.onChange}
                    />
                  </FormGroup>
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
                          defaultChecked={this.state.status === 'active'}
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
                          defaultChecked={this.state.status === 'archived'}
                          onChange={this.onRadioChange}
                        />
                        <Label className="form-check-label" check htmlFor="archived">Archivé</Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
            <p>Les champs colorés sont obligatoires</p>
          </CardBody>
          <CardFooter>
            {this.props.id ?
              <Button
                className="float-left rounded mt-1"
                color="danger"
                onClick={() => this.props.toggleDeleteModal(`${process.env.API_URL_STAGING}addresses/${this.props.id}`)}
              >
                Supprimer
              </Button> : <div />}
            <UpdateFormButton
              hasErrored={this.props.hasErrored}
              isLoading={this.props.isLoading}
              color={this.props.id ? 'secondary' : 'primary'}
              message={this.props.id ? "Modifier l'adresse" : 'Ajouter une adresse'}
              triggerAction={this.triggerAction}
            />
          </CardFooter>
        </Card>
      </Col>

    );
  }
}

CodeForm.propTypes = {
  addContent: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  categoryId: PropTypes.number.isRequired,
  content: PropTypes.string,
  date_end: PropTypes.string,
  date_start: PropTypes.string,
  hasErrored: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  institutionId: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
};

CodeForm.defaultProps = {
  content: '',
  date_end: '',
  date_start: '',
};

export default CodeForm;
