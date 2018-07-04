import React, { Component } from 'react';
import { Button, Row, Col, Tooltip } from 'reactstrap';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { connect } from 'react-redux';
import { institutionsFetchData, getInstitutionByPage, onSearchInputChange } from '../../actions/institutions';
import { getActiveEntity, getFormattedAddress } from '../../views/Etablissements/methods';
import SearchPageEtablissement from '../../views/Etablissements/SearchPageEtablissement';
import NameModal from '../../views/Etablissements/Name/NameModal';
import DownloadButton from '../../views/DownloadButton';
import UploadModal from '../../views/UploadModal';
import SearchBar from '../../views/Etablissements/Search/SearchBar';
import SearchPagination from '../../views/Etablissements/Search/SearchPagination';

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addModal: false,
      addTooltip: false,
      error: false,
      isSearching: false,
      searchEntry: '',
      uploadButton: false,
      uploadModal: false,
      uploadTooltip: false,
      results: null,
    };
    this.props.onChange = debounce(this.props.onChange, 1000);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleAddTooltip = this.toggleAddTooltip.bind(this);
    this.toggleUploadModal = this.toggleUploadModal.bind(this);
    this.toggleUploadTooltip = this.toggleUploadTooltip.bind(this);
  }

  componentWillMount() {
    this.props.fetchData(`${process.env.API_URL_STAGING}institutions?page_size=18`)
  }

  onClick(event) {
    event.persist();
    if (this.state[event.target.id]) {
      this.props.getInstitutionByPage(this.state[event.target.id]);
    } else {
      this.props.getInstitutionByPage();
    }
  }

  toggleAddModal() {
    this.setState({ addModal: !this.state.addModal });
  }

  toggleAddTooltip() {
    this.setState({ addTooltip: !this.state.addTooltip });
  }

  toggleUploadModal() {
    this.setState({ uploadModal: !this.state.uploadModal });
  }

  toggleUploadTooltip() {
    this.setState({ uploadTooltip: !this.state.uploadTooltip });
  }

  mouseEnter() {
    this.setState({ uploadButton: true });
  }

  mouseLeave() {
    this.setState({ uploadButton: false });
  }

  renderInstitutionsCards() {
    return this.state.institutions.map((institution) => {
      const codeUAI = institution.codes.find(code => code.category === 'uai');
      return (
        <Col xs="12" md="6" lg="4" className="my-1 px-1" key={`institution-${institution.id}`}>
          <SearchPageEtablissement
            address={getActiveEntity(institution.addresses) ?
              getFormattedAddress(getActiveEntity(institution.addresses)) : ' '}
            codeUAI={codeUAI ? codeUAI.content : ''}
            date_start={institution.date_start}
            date_end={institution.date_end}
            id={institution.id}
            name={getActiveEntity(institution.names) ? getActiveEntity(institution.names) : institution.names[0]}
            tags={institution.tags}
          />
        </Col>
      );
    });
  }

  render() {
    const params = encodeURI(this.props.searchEntry);
    moment.locale('fr');
    if (this.props.hasErrored) {
      return <p>Une erreur est survenue</p>;
    }
    return (
      <div className="p-5">
        <SearchBar
          onChange={this.props.onChange}
          isSearching={this.props.isSearching}
          searchEntry={this.props.searchEntry}
          resetSearch={this.props.resetSearch}
        />
        <div className="d-flex justify-content-between">
          {!this.props.isSearching && !this.props.isLoading ?
            <DownloadButton
              name="etablissements"
              url={`${process.env.API_URL_STAGING}institutions/search?q=${params}&download=true`}
            /> : <div />}
          <div className="text-primary mt-3">{this.state.results > 0 ? `${this.state.results} établissements` : ''}</div>
        </div>
        {this.props.institutions.length === 0 && !this.props.isLoading ?
          <p className="text-center"><em>aucun résultat</em></p> :
          <Row> {this.renderInstitutionsCards()} </Row>}
        <div className="mt-3 d-flex justify-content-center">
          {this.props.institutions.length > 17 ?
            <SearchPagination /> : <div />}
        </div>
        <div
          className="floating"
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
        >
          <Button
            className="float-add"
            color="primary"
            id="search-page-add-button"
            onClick={this.toggleAddModal}
            type="button"
          >
            <i id="icon-plus" className="fa fa-plus my-float" />
          </Button>
          <Tooltip
            isOpen={this.state.addTooltip}
            target="search-page-add-button"
            toggle={this.toggleAddTooltip}
            placement="left"
          >
          Ajouter un établissement
          </Tooltip>
          {this.state.addModal ?
            <NameModal toggleModal={this.toggleAddModal} /> : <div />}
          {this.state.uploadButton ?
            <div>
              <Button
                className="float-upload"
                color="success"
                id="search-page-upload-button"
                type="button"
                onClick={this.toggleUploadModal}
              >
                <i className="fa fa-upload" />
              </Button>
              <Tooltip
                isOpen={this.state.uploadTooltip}
                target="search-page-upload-button"
                toggle={this.toggleUploadTooltip}
                delay={{ show: 100, hide: 0 }}
                placement="left"
              >
              Importer des établissements
              </Tooltip>
            </div> : <div />}
          {this.state.uploadModal ?
            <UploadModal
              name="etablissements"
              toggleModal={this.toggleUploadModal}
              url={`${process.env.API_URL_STAGING}institutions/import`}
            /> : <div />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  institutions: state.institutions,
  institutionsHeaders: state.institutionsHeaders,
  hasErrored: state.institutionsHasErrored,
  isLoading: state.institutionsIsLoading,
});

const mapDispatchToProps = dispatch => ({
  fetchData: url => dispatch(institutionsFetchData(url)),
  getInstitutionByPage: page => dispatch(getInstitutionByPage(page)),
  onChange: event => dispatch(onSearchInputChange(event)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
