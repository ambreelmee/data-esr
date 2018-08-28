import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { addContent, setActiveItem, removeActiveItem, toggleDeleteModal } from '../../actions/institution';
import CustomSideBar from '../../views/Institutions/InstitutionPage/CustomSideBar';
import NameForm from '../../views/Institutions/InstitutionPage/Main/NameForm';
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
      activeTab: '1',
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
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
          <NavItem className="rounded">
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Prédecesseurs
            </NavLink>
          </NavItem>
          <NavItem className="rounded">
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Successeurs
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <CustomSideBar
                activeId={this.props.activeItem ? this.props.activeItem.id : null}
                component={<Predecessor />}
                content={this.props.predecessors}
                removeActiveItem={this.props.removeActiveItem}
                setActiveItem={this.props.setActiveItem}
                buttonText="Ajouter un prédecesseur"
              />
              <NameForm
                addContent={this.props.addContent}
                hasErrored={this.props.addContentHasErrored}
                institutionId={this.props.institutionId}
                isLoading={this.props.addContentIsLoading}
                deleteModal={this.props.deleteModal}
                setActiveItem={this.props.setActiveItem}
                toggleDeleteModal={this.props.toggleDeleteModal}
                {...this.props.activeItem}
              />
              <DeleteModalContainer
                institutionId={this.props.institutionId}
                modal={this.props.deleteModal}
                toggleModal={this.props.toggleDeleteModal}
              />
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <CustomSideBar
                activeId={this.props.activeItem ? this.props.activeItem.id : null}
                component={<Follower />}
                content={this.props.followers}
                removeActiveItem={this.props.removeActiveItem}
                setActiveItem={this.props.setActiveItem}
                buttonText="Ajouter un successeur"
              />
              <NameForm
                addContent={this.props.addContent}
                hasErrored={this.props.addContentHasErrored}
                institutionId={this.props.institutionId}
                isLoading={this.props.addContentIsLoading}
                deleteModal={this.props.deleteModal}
                setActiveItem={this.props.setActiveItem}
                toggleDeleteModal={this.props.toggleDeleteModal}
                {...this.props.activeItem}
              />
              <DeleteModalContainer
                institutionId={this.props.institutionId}
                modal={this.props.deleteModal}
                toggleModal={this.props.toggleDeleteModal}
              />
            </Row>
          </TabPane>
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
  followers: state.activeInstitution.followers,
  institutionId: state.activeInstitution.institution.id,
  predecessors: state.activeInstitution.predecessors,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  setActiveItem: item => dispatch(setActiveItem(item)),
  removeActiveItem: () => dispatch(removeActiveItem()),
  toggleDeleteModal: url => dispatch(toggleDeleteModal(url)),
});

EvolutionContainer.propTypes = {
  activeItem: PropTypes.object,
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  deleteModal: PropTypes.bool,
  displayedName: PropTypes.string.isRequired,
  institutionId: PropTypes.number.isRequired,
  followers: PropTypes.array.isRequired,
  predecessors: PropTypes.array.isRequired,
  removeActiveItem: PropTypes.func.isRequired,
  setActiveItem: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
};

EvolutionContainer.defaultProps = {
  activeItem: null,
  addContentHasErrored: false,
  addContentIsLoading: false,
  deleteModal: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(EvolutionContainer);
