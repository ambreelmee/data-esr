import React, { Component } from 'react';
import { Button, Row } from 'reactstrap';
import PropTypes from 'prop-types';


class DownloadButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      csvFile: null,
      errorMessage: '',
      isDownloading: false,
    };
    this.downloadSearchResults = this.downloadSearchResults.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({ csvFile: null });
  }

  downloadSearchResults() {
    this.setState({
      isDownloading: true,
      errorMessage: '',
    });
    fetch(this.props.url, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.blob().then((data) => {
            const csvFile = URL.createObjectURL(data);
            this.setState({
              csvFile,
              isDownloading: false,
            });
          });
        } else {
          this.setState({
            errorMessage: 'impossible de télécharger les données',
            isDownloading: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          errorMessage: 'impossible de télécharger les données',
          isDownloading: false,
        });
      });
  }

  render() {
    return (
      <div className="d-flex flex-row-reverse mt-2">
        <div>
          {this.state.csvFile ?
            <a href={this.state.csvFile} download={`${this.props.name}.csv`}>
              {this.props.name}.csv
            </a> :
            <Button color="primary" outline className="rounded ml-1" onClick={this.downloadSearchResults}>
              {!this.state.isDownloading ?
                <div><i className="fa fa-download" /> Télécharger les {this.props.name}</div> :
                <div><i className="fa fa-spinner fa-spin" /> Chargement</div>}
            </Button>}
        </div>
        <p className="text-danger mb-0">{this.state.errorMessage}</p>
      </div>
    );
  }
}

DownloadButton.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default DownloadButton;
