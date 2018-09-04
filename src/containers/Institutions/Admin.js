import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addContent, toggleDeleteModal } from '../../actions/institution';
import { removeDownloadFile } from '../../actions/search';
import CategoryContainer from '../../views/Institutions/Admin/Category/CategoryContainer';
import ImportExport from '../../views/Institutions/Admin/ImportExport';
import DeleteModalContainer from './DeleteModalContainer';

const mapping = [
  {
    name: 'identifiants', categoryType: 'code', routePath: 'codes', icon: 'th', list: 'codeCategories',
  }, {
    name: 'liens', categoryType: 'link', routePath: 'links', icon: 'at', list: 'linkCategories',
  }, {
    name: 'caractérisations',
    categoryType: 'institution_tag',
    routePath: 'taggings',
    icon: 'tag',
    list: 'tagCategories',
  }, {
    name: 'évolutions',
    categoryType: 'institution_evolution',
    routePath: 'evolutions',
    icon: 'history',
    list: 'evolutionCategories',
  }, {
    name: 'rattachements',
    categoryType: 'institution_connection',
    routePath: 'connections',
    icon: 'arrows-alt',
    list: 'connectionCategories',
  }, {
    name: 'adresses', categoryType: null, routePath: 'addresses', icon: 'map-marker',
  },
];

class Admin extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: 'identifiants',
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.props.removeDownloadFile()
      this.setState({
        activeTab: tab,
      });
    }
  }

  renderNavItems() {
    return mapping.map(tab => (
      <NavItem key={tab.name}>
        <NavLink
          className={`${classnames({ active: this.state.activeTab === tab.name })} rounded`}
          onClick={() => { this.toggle(tab.name); }}
        >
          <i className={`mr-2 text-primary fa fa-${tab.icon}`} />
          {tab.name.toProperCase()}
        </NavLink>
      </NavItem>
    ));
  }

  render() {
    const { activeTab } = this.state;
    const activeTabInfo = mapping.find(item => item.name === activeTab);
    return (
      <div>
        <Nav tabs>
          {this.renderNavItems()}
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={activeTab}>
            <Row>
              {activeTabInfo.categoryType ?
                <CategoryContainer
                  addContent={this.props.addContent}
                  hasErrored={this.props.addContentHasErrored}
                  isLoading={this.props.addContentIsLoading}
                  categories={this.props[activeTabInfo.list].sort((a, b) => a.position >= b.position)}
                  categoryType={activeTabInfo.categoryType}
                  tags={this.props.tags}
                  toggleDeleteModal={this.props.toggleDeleteModal}
                /> : ''}
              <ImportExport
                name={activeTab}
                routePath={activeTabInfo.routePath}
              />
            </Row>
          </TabPane>
        </TabContent>
        <DeleteModalContainer
          modal={this.props.deleteModal}
          message="Attention, toutes les données liées à cette catégorie seront perdues"
          toggleModal={this.props.toggleDeleteModal}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  codeCategories: state.activeInstitution.codeCategories,
  connectionCategories: state.activeInstitution.connectionCategories,
  deleteModal: state.activeInstitution.deleteModal,
  evolutionCategories: state.activeInstitution.evolutionCategories,
  linkCategories: state.activeInstitution.linkCategories,
  tagCategories: state.activeInstitution.tagCategories,
  tags: state.activeInstitution.tags,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  removeDownloadFile: () => dispatch(removeDownloadFile()),
  toggleDeleteModal: url => dispatch(toggleDeleteModal(url)),
});

Admin.propTypes = {
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  codeCategories: PropTypes.array,
  connectionCategories: PropTypes.array,
  deleteModal: PropTypes.bool,
  evolutionCategories: PropTypes.array,
  linkCategories: PropTypes.array,
  removeDownloadFile: PropTypes.func.isRequired,
  tagCategories: PropTypes.array,
  tags: PropTypes.array,
  toggleDeleteModal: PropTypes.func.isRequired,
};

Admin.defaultProps = {
  addContentHasErrored: false,
  addContentIsLoading: false,
  codeCategories: [],
  connectionCategories: [],
  deleteModal: false,
  evolutionCategories: [],
  linkCategories: [],
  tagCategories: [],
  tags: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
