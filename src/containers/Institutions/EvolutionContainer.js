import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { addContent, setActiveItem, removeActiveItem, toggleDeleteModal } from '../../actions/institution';
import { institutionsSearch } from '../../actions/search';
import CustomSideBar from '../../views/Institutions/InstitutionPage/CustomSideBar';
import RelationForm from '../../views/Institutions/InstitutionPage/Relation/RelationForm';
import DeleteModalContainer from './DeleteModalContainer';
import NavBreadcrumb from '../../views/Institutions/InstitutionPage/NavBreadcrumb';
import Relation from '../../views/Institutions/InstitutionPage/Relation/Relation';

const Predecessor = props => (
  <Relation
    category={props.evolution.category}
    date={props.evolution.date}
    institutionEvolutionId={props.predecessor.id}
    institutionEvolutionName={props.predecessor.name}
  />
);
Predecessor.propTypes = {
  evolution: PropTypes.object.isRequired,
  predecessor: PropTypes.object.isRequired,
};

const Follower = props => (
  <Relation
    category={props.evolution.category}
    date={props.evolution.date}
    institutionEvolutionId={props.follower.id}
    institutionEvolutionName={props.follower.name}
  />
);
Follower.propTypes = {
  evolution: PropTypes.object.isRequired,
  follower: PropTypes.object.isRequired,
};

class EvolutionContainer extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: 'followers',
    };
  }

  componentWillMount() {
    let initialItem = this.props.followers.length > 0 ? this.props.followers[0] : null;
    if (this.props.predecessors.length > 0) {
      initialItem = this.props.predecessors[0];
      this.setState({ activeTab: 'predecessors' });
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
      this.props.evolutionCategories.find(category => category.title === this.props.activeItem.evolution.category) : null;
    return (
      <div>
        <Row className="bg-light mt-3">
          <NavBreadcrumb
            displayedName={this.props.displayedName}
            institutionId={this.props.institutionId}
            type="Evolutions"
          />
        </Row>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={`${classnames({ active: this.state.activeTab === 'predecessors' })} rounded`}
              onClick={() => { this.toggle('predecessors'); }}
            >
              Prédecesseurs
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`${classnames({ active: this.state.activeTab === 'followers' })} rounded`}
              onClick={() => { this.toggle('followers'); }}
            >
              Successeurs
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {this.state.activeTab === 'predecessors' ?
            <TabPane tabId="predecessors">
              <Row>
                <CustomSideBar
                  activeId={this.props.activeItem ? this.props.activeItem.id : ''}
                  component={<Predecessor />}
                  content={this.props.predecessors}
                  removeActiveItem={this.props.removeActiveItem}
                  setActiveItem={this.props.setActiveItem}
                  buttonText="Ajouter un prédecesseur"
                />
                <RelationForm
                  addContent={this.props.addContent}
                  addContentHasErrored={this.props.addContentHasErrored}
                  addContentIsLoading={this.props.addContentIsLoading}
                  categoryId={currentCategory ? currentCategory.id : ''}
                  categories={this.props.evolutionCategories}
                  date={this.props.activeItem ? this.props.activeItem.evolution.date : ''}
                  deleteModal={this.props.deleteModal}
                  id={this.props.activeItem ? this.props.activeItem.evolution.id : ''}
                  institutionId={this.props.institutionId}
                  institutions={this.props.institutions}
                  name={this.props.activeItem ? this.props.activeItem.predecessor.name : ''}
                  relationInstitutionId={this.props.activeItem ? this.props.activeItem.predecessor.id : ''}
                  relationType="predecessors"
                  search={this.props.search}
                  searchHasErrored={this.props.searchHasErrored}
                  searchIsLoading={this.props.searchIsLoading}
                  setActiveItem={this.props.setActiveItem}
                  toggleDeleteModal={this.props.toggleDeleteModal}
                  type="evolution"
                />
                <DeleteModalContainer
                  institutionId={this.props.institutionId}
                  modal={this.props.deleteModal}
                  toggleModal={this.props.toggleDeleteModal}
                />
              </Row>
            </TabPane> : <div />}
          {this.state.activeTab === 'followers' ?
            <TabPane tabId="followers">
              <Row>
                <CustomSideBar
                  activeId={this.props.activeItem ? this.props.activeItem.id : null}
                  component={<Follower />}
                  content={this.props.followers}
                  removeActiveItem={this.props.removeActiveItem}
                  setActiveItem={this.props.setActiveItem}
                  buttonText="Ajouter un successeur"
                />
                <RelationForm
                  addContent={this.props.addContent}
                  addContentHasErrored={this.props.addContentHasErrored}
                  addContentIsLoading={this.props.addContentIsLoading}
                  categoryId={currentCategory ? currentCategory.id : ''}
                  categories={this.props.evolutionCategories}
                  date={this.props.activeItem ? this.props.activeItem.evolution.date : ''}
                  deleteModal={this.props.deleteModal}
                  id={this.props.activeItem ? this.props.activeItem.evolution.id : ''}
                  institutionId={this.props.institutionId}
                  institutions={this.props.institutions}
                  name={this.props.activeItem ? this.props.activeItem.follower.name : ''}
                  relationInstitutionId={this.props.activeItem ? this.props.activeItem.follower.id : ''}
                  relationType="followers"
                  search={this.props.search}
                  searchHasErrored={this.props.searchHasErrored}
                  searchIsLoading={this.props.searchIsLoading}
                  setActiveItem={this.props.setActiveItem}
                  toggleDeleteModal={this.props.toggleDeleteModal}
                  type="evolution"
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
  evolutionCategories: state.activeInstitution.evolutionCategories,
  followers: state.activeInstitution.followers,
  institutions: state.search.institutionsResults,
  institutionId: state.activeInstitution.institution.id,
  predecessors: state.activeInstitution.predecessors,
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

EvolutionContainer.propTypes = {
  activeItem: PropTypes.object,
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  deleteModal: PropTypes.bool,
  displayedName: PropTypes.string.isRequired,
  evolutionCategories: PropTypes.array.isRequired,
  institutions: PropTypes.array,
  institutionId: PropTypes.number.isRequired,
  followers: PropTypes.array.isRequired,
  predecessors: PropTypes.array.isRequired,
  removeActiveItem: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  searchHasErrored: PropTypes.bool,
  searchIsLoading: PropTypes.bool,
  setActiveItem: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
};

EvolutionContainer.defaultProps = {
  activeItem: null,
  addContentHasErrored: false,
  addContentIsLoading: false,
  deleteModal: false,
  institutions: [],
  searchHasErrored: false,
  searchIsLoading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(EvolutionContainer);
