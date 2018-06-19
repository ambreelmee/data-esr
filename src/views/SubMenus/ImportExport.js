import React, { Component } from 'react';
import { Button, Col, Card, CardHeader, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import DownloadButton from '../DownloadButton';
import UploadModal from '../UploadModal';

class ImportExport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    const singularName = this.props.name.substring(0, this.props.name.length - 1);
    return (
      <Col xs="12" md="6">
        <Card className="mt-4">
          <CardHeader>
            <h5>Import et export de données csv</h5>
          </CardHeader>
          <CardBody>
            <div className="mb-1">
              Pour télécharger l&#39;ensemble des {this.props.name} affectés aux établissements, cliquer sur le bouton ci-dessous :
            </div>
            <DownloadButton
              name={this.props.name}
              url={`${process.env.API_URL_STAGING}${this.props.name}/export`}
            />
            <div className="m-2">Colonnes disponibles :</div>
            <ListGroup>
              <ListGroupItem className="d-flex align-items-center">
                <h6 className="text-primary m-0"><strong>ID</strong></h6>
                <div className="ml-2">
                  identifiant interne utilisé pour modifier ou supprimer le contenu du {singularName}
                </div>
              </ListGroupItem>
              <ListGroupItem className="d-flex align-items-center">
                <h6 className="text-primary m-0"><strong>InsitutionID</strong></h6>
                <div className="ml-2">
                  identifiant interne utilisé pour désigner l&#39;établissement
                </div>
              </ListGroupItem>
              <ListGroupItem className="d-flex align-items-center">
                <h6 className="text-primary m-0"><strong>{singularName}CategoryID</strong></h6>
                <div className="ml-2">
                  identifiant du type de {singularName}
                </div>
              </ListGroupItem>
              <ListGroupItem className="d-flex align-items-center">
                <h6 className="text-primary m-0"><strong>DateCreation</strong></h6>
                {this.props.name === 'liens' ?
                  <div className="ml-2">
                    non utilisé
                  </div> :
                  <div className="ml-2">
                    date de début de validité
                  </div>}
              </ListGroupItem>
              <ListGroupItem className="d-flex align-items-center">
                <h6 className="text-primary m-0"><strong>DateFermeture</strong></h6>
                {this.props.name === 'liens' ?
                  <div className="ml-2">
                    non utilisé
                  </div> :
                  <div className="ml-2">
                    date de fin de validité
                  </div>}
              </ListGroupItem>
              <ListGroupItem className="d-flex align-items-center">
                <h6 className="text-primary m-0"><strong>Status</strong></h6>
                {this.props.name === 'liens' ?
                  <div className="ml-2">
                    toujours active (actif)
                  </div> :
                  <div className="ml-2">
                    active (actif) ou archived (archivé)
                  </div>}
              </ListGroupItem>
            </ListGroup>
            <Button type="button" color="primary" className="mt-3 rounded float-right" onClick={this.toggle}>
              <i className="fa fa-upload" /> Importer des {this.props.name}
            </Button>
            {this.state.modal ?
              <UploadModal
                toggleModal={this.toggle}
                name={this.props.name}
                url={`${process.env.API_URL_STAGING}${this.props.name}/import`}
              /> : <div />}
          </CardBody>
        </Card>
      </Col>);
  }
}


ImportExport.propTypes = {
  name: PropTypes.string.isRequired,
};


export default ImportExport;
