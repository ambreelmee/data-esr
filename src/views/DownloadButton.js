import React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { downloadData } from '../actions/institutions';

const DownloadButton = props => (
  <div className="d-flex flex-row-reverse mt-2">
    <div>
      {props.file ?
        <a href={props.file} download={`${props.name}.csv`}>
          {props.name}.csv
        </a> :
        <Button color="primary" outline className="rounded ml-1" onClick={() => props.downloadData(props.url)}>
          {!props.isLoading ?
            <div><i className="fa fa-download" /> Télécharger les {props.name}</div> :
            <div><i className="fa fa-spinner fa-spin" /> Chargement</div>}
        </Button>}
    </div>
    <p className="text-danger mb-0">{props.hasErrored ? 'impossible de télécharger les données' : ''}</p>
  </div>
);


const mapStateToProps = state => ({
  file: state.search.downloadFile,
  hasErrored: state.search.downloadHasErrored,
  isLoading: state.search.downloadIsLoading,
});

const mapDispatchToProps = dispatch => ({
  downloadData: url => dispatch(downloadData(url)),
});

DownloadButton.propTypes = {
  downloadData: PropTypes.func.isRequired,
  file: PropTypes.string,
  hasErrored: PropTypes.bool,
  isLoading: PropTypes.bool,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

DownloadButton.defaultProps = {
  file: null,
  hasErrored: false,
  isLoading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);
