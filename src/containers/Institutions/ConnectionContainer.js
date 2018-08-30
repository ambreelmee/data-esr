import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { addContent, setActiveItem, removeActiveItem, toggleDeleteModal } from '../../actions/institution';
import { institutionsSearch } from '../../actions/search';
import CustomSideBar from '../../views/Institutions/InstitutionPage/Details/CustomSideBar';
import RelationForm from '../../views/Institutions/InstitutionPage/Details//RelationForm';
import DeleteModalContainer from './DeleteModalContainer';
import NavBreadcrumb from '../../views/Institutions/InstitutionPage/Details/NavBreadcrumb';
import Relation from '../../views/Institutions/InstitutionPage/Details//Relation';

const Mother = props => (
  <Relation
    category={props.connection.category}
    date={props.connection.date}
    institutionEvolutionId={props.mother.id}
    institutionEvolutionName={props.mother.name}
  />
);
Mother.propTypes = {
  connection: PropTypes.object.isRequired,
  mother: PropTypes.object.isRequired,
};

const Daughter = props => (
  <Relation
    category={props.connection.category}
    date={props.connection.date}
    institutionEvolutionId={props.daughter.id}
    institutionEvolutionName={props.daughter.name}
  />
);
Daughter.propTypes = {
  connection: PropTypes.object.isRequired,
  daughter: PropTypes.object.isRequired,
};

class ConnectionContainer extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: 'daughters',
    };
  }

  componentWillMount() {
    let initialItem = this.props.daughters.length > 0 ? this.props.daughters[0] : null;
    if (this.props.mothers.length > 0) {
      initialItem = this.props.mothers[0];
      this.setState({ activeTab: 'mothers' });
    }
    this.props.setActiveItem(initialItem);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
      if (this.props[tab].length > 0) {
        this.props.setActiveItem(this.props[tab][0]);
      } else {
        this.props.removeActiveItem();
      }
    }
  }

  render() {
    const currentCategory = this.props.activeItem ?
      this.props.connectionCategories.find(category => category.title === this.props.activeItem.connection.category) :
      null;
    return (
      <div>
        <Row className="bg-light mt-3">
          <NavBreadcrumb
            displayedName={this.props.displayedName}
            institutionId={this.props.institutionId}
            type="Rattachements"
          />
        </Row>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={`${classnames({ active: this.state.activeTab === 'mothers' })} rounded`}
              onClick={() => { this.toggle('mothers'); }}
            >
              Mères
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`${classnames({ active: this.state.activeTab === 'daughters' })} rounded`}
              onClick={() => { this.toggle('daughters'); }}
            >
              Filles
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {this.state.activeTab === 'mothers' ?
            <TabPane tabId="mothers">
              <Row>
                <CustomSideBar
                  activeId={this.props.activeItem ? this.props.activeItem.id : ''}
                  component={<Mother />}
                  content={this.props.mothers}
                  removeActiveItem={this.props.removeActiveItem}
                  setActiveItem={this.props.setActiveItem}
                  buttonText="Ajouter un rattachement mère"
                />
                <RelationForm
                  addContent={this.props.addContent}
                  addContentHasErrored={this.props.addContentHasErrored}
                  addContentIsLoading={this.props.addContentIsLoading}
                  categoryId={currentCategory ? currentCategory.id : ''}
                  categories={this.props.connectionCategories}
                  date={this.props.activeItem ? this.props.activeItem.connection.date : ''}
                  deleteModal={this.props.deleteModal}
                  id={this.props.activeItem ? this.props.activeItem.connection.id : ''}
                  institutionId={this.props.institutionId}
                  institutions={this.props.institutions}
                  name={this.props.activeItem ? this.props.activeItem.mother.name : ''}
                  relationInstitutionId={this.props.activeItem ? this.props.activeItem.mother.id : ''}
                  relationType="mothers"
                  search={this.props.search}
                  searchHasErrored={this.props.searchHasErrored}
                  searchIsLoading={this.props.searchIsLoading}
                  setActiveItem={this.props.setActiveItem}
                  toggleDeleteModal={this.props.toggleDeleteModal}
                  type="connection"
                />
                <DeleteModalContainer
                  institutionId={this.props.institutionId}
                  modal={this.props.deleteModal}
                  toggleModal={this.props.toggleDeleteModal}
                />
              </Row>
            </TabPane> : <div />}
          {this.state.activeTab === 'daughters' ?
            <TabPane tabId="daughters">
              <Row>
                <CustomSideBar
                  activeId={this.props.activeItem ? this.props.activeItem.id : null}
                  component={<Daughter />}
                  content={this.props.daughters}
                  removeActiveItem={this.props.removeActiveItem}
                  setActiveItem={this.props.setActiveItem}
                  buttonText="Ajouter un rattachement fille"
                />
                <RelationForm
                  addContent={this.props.addContent}
                  addContentHasErrored={this.props.addContentHasErrored}
                  addContentIsLoading={this.props.addContentIsLoading}
                  categoryId={currentCategory ? currentCategory.id : ''}
                  categories={this.props.connectionCategories}
                  date={this.props.activeItem ? this.props.activeItem.connection.date : ''}
                  deleteModal={this.props.deleteModal}
                  id={this.props.activeItem ? this.props.activeItem.connection.id : ''}
                  institutionId={this.props.institutionId}
                  institutions={this.props.institutions}
                  name={this.props.activeItem ? this.props.activeItem.daughter.name : ''}
                  relationInstitutionId={this.props.activeItem ? this.props.activeItem.daughter.id : ''}
                  relationType="daughters"
                  search={this.props.search}
                  searchHasErrored={this.props.searchHasErrored}
                  searchIsLoading={this.props.searchIsLoading}
                  setActiveItem={this.props.setActiveItem}
                  toggleDeleteModal={this.props.toggleDeleteModal}
                  type="connection"
                />
                <DeleteModalContainer
                  institutionId={this.props.institutionId}
                  modal={this.props.deleteModal}
                  toggleModal={this.props.toggleDeleteModal}
                />
              </Row>
            </TabPane> : <div />}
        </TabContent>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeItem: state.activeInstitution.activeItem,
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  deleteModal: state.activeInstitution.deleteModal,
  displayedName: state.activeInstitution.displayedName,
  connectionCategories: state.activeInstitution.connectionCategories,
  daughters: state.activeInstitution.daughters,
  institutions: state.search.institutionsResults,
  institutionId: state.activeInstitution.institution.id,
  mothers: state.activeInstitution.mothers,
  searchHasErrored: state.search.hasErrored,
  searchIsLoading: state.search.isLoading,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  setActiveItem: item => dispatch(setActiveItem(item)),
  removeActiveItem: () => dispatch(removeActiveItem()),
  toggleDeleteModal: url => dispatch(toggleDeleteModal(url)),
  search: searchValue => dispatch(institutionsSearch(searchValue)),
});

ConnectionContainer.propTypes = {
  activeItem: PropTypes.object,
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  deleteModal: PropTypes.bool,
  displayedName: PropTypes.string.isRequired,
  connectionCategories: PropTypes.array.isRequired,
  institutions: PropTypes.array,
  institutionId: PropTypes.number.isRequired,
  daughters: PropTypes.array.isRequired,
  mothers: PropTypes.array.isRequired,
  removeActiveItem: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  searchHasErrored: PropTypes.bool,
  searchIsLoading: PropTypes.bool,
  setActiveItem: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
};

ConnectionContainer.defaultProps = {
  activeItem: null,
  addContentHasErrored: false,
  addContentIsLoading: false,
  deleteModal: false,
  institutions: [],
  searchHasErrored: false,
  searchIsLoading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionContainer);
