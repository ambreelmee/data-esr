import React, { Component } from 'react';
import { Button, Col, Card, CardHeader, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import AddressesColumnsDescription from './AddressesColumnsDescription';
import ColumnsDescription from './ColumnsDescription';
import DownloadButton from '../DownloadButton';
import RelationsColumnsDescription from './RelationsColumnsDescription';
import UploadModal from '../UploadModal';

const getSingular = name => name.substring(0, name.length - 1);

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

  renderDescriptions() {
    if (this.props.name === 'adresses') {
      return (<AddressesColumnsDescription />);
    } if (this.props.name === 'evolutions' || this.props.name === 'rattachements') {
      return (
        <RelationsColumnsDescription
          relationDown={this.props.name === 'evolutions' ? 'successeur' : 'fille'}
          relationUp={this.props.name === 'evolutions' ? 'predecceur' : 'mère'}
          routePath={getSingular(this.props.routePath)}
          singularName={getSingular(this.props.name)}
        />);
    }
    return (
      <ColumnsDescription
        routePath={getSingular(this.props.routePath)}
        singularName={getSingular(this.props.name)}
      />
    );
  }

  render() {
    return (
      <Col>
        <Card className="mt-4 d-inline-block">
          <CardHeader>
            <h5>Import et export de données csv</h5>
          </CardHeader>
          <CardBody>
            <div className="mb-1">
              Pour télécharger l&#39;ensemble des {this.props.name} affectées aux établissements,
              cliquer sur le bouton ci-dessous :
            </div>
            <DownloadButton
              name={this.props.name}
              url={`${process.env.API_URL_STAGING}${this.props.routePath}/export`}
            />
            <div className="m-2">Colonnes disponibles :</div>
            {this.renderDescriptions()}
            <div className="text-muted">
              <em>
              Les valeurs des colonnes grisées sont optionnelles lors de l&#39;import
              de données mais les en-têtes doivent être présentes
              </em>
            </div>
            <Button type="button" color="primary" className="my-3 rounded float-right" onClick={this.toggle}>
              <i className="fa fa-upload" /> Importer des {this.props.name}
            </Button>
            {this.state.modal ?
              <UploadModal
                toggleModal={this.toggle}
                name={this.props.name}
                url={`${process.env.API_URL_STAGING}${this.props.routePath}/import`}
              /> : <div />}
          </CardBody>
        </Card>
      </Col>);
  }
}


ImportExport.propTypes = {
  name: PropTypes.string.isRequired,
  routePath: PropTypes.string.isRequired,
};


export default ImportExport;
