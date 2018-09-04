import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { addContent, setActiveItem, removeActiveItem, toggleDeleteModal } from '../../actions/institution';
import CustomSideBar from '../../views/Institutions/InstitutionPage/Details/CustomSideBar';
import CodeForm from '../../views/Institutions/InstitutionPage/Details//CodeForm';
import DeleteModalContainer from './DeleteModalContainer';
import NavBreadcrumb from '../../views/Institutions/InstitutionPage/Details/NavBreadcrumb';

const Code = props => (
  <div className="text-muted">
    <h5>{props.category}</h5>
    <h3>{props.content}</h3>
  </div>
);

Code.propTypes = {
  category: PropTypes.string,
  content: PropTypes.string,
};

Code.defaultProps = {
  category: '',
  content: '',
};

class CodeContainer extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: 'mothers',
    };
  }

  componentWillMount() {
    const { category } = this.props.match.params;
    if (category !== '0') {
      const activeItem = this.props.codes
        .filter(code => code.status === 'active')
        .find(code => code.category === category);
      this.props.setActiveItem(activeItem);
      this.setState({
        activeTab: activeItem.category,
      });
    } else {
      this.setState({
        activeTab: 'uai',
      });
    }
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
      const selectedCodes = this.props.codes.filter(code => code.category === tab);
      if (selectedCodes.length > 0) {
        this.props.setActiveItem(selectedCodes.filter(code => code.status === 'active')[0]);
      } else {
        this.props.removeActiveItem();
      }
    }
  }

  renderNavItem() {
    return this.props.codeCategories.sort((a, b) => a.position >= b.position)
      .map(category => (
        <NavItem key={category.id}>
          <NavLink
            className={`${classnames({ active: this.state.activeTab === category.title })} rounded text-muted`}
            onClick={() => { this.toggle(category.title); }}
          >
            {category.title.replace('_', ' ').toProperCase()}
          </NavLink>
        </NavItem>
      ));
  }

  renderTabPane() {
    const selectedCategory = this.props.codeCategories.find(category => category.title === this.state.activeTab);
    return (
      <TabPane key={selectedCategory.id} tabId={selectedCategory.title}>
        <Row>
          <CustomSideBar
            activeId={this.props.activeItem ? this.props.activeItem.id : null}
            component={<Code />}
            content={this.props.codes.filter(code => code.category === selectedCategory.title)}
            removeActiveItem={this.props.removeActiveItem}
            setActiveItem={this.props.setActiveItem}
            buttonText={`Ajouter un code ${selectedCategory.title}`}
          />
          <CodeForm
            addContent={this.props.addContent}
            hasErrored={this.props.addContentHasErrored}
            isLoading={this.props.addContentIsLoading}
            category={selectedCategory.title}
            categoryId={selectedCategory.id}
            deleteModal={this.props.deleteModal}
            institutionId={this.props.institutionId}
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
    );
  }

  render() {
    return (
      <div>
        <Row className="bg-light mt-3">
          <NavBreadcrumb
            displayedName={this.props.displayedName}
            institutionId={this.props.institutionId}
            type="Identifiants"
          />
        </Row>
        <Nav tabs>
          {this.renderNavItem()}
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {this.renderTabPane()}
        </TabContent>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeItem: state.activeInstitution.activeItem,
  addContentHasErrored: state.activeInstitution.addContentHasErrored,
  addContentIsLoading: state.activeInstitution.addContentIsLoading,
  codeCategories: state.activeInstitution.codeCategories,
  codes: state.activeInstitution.institution.codes,
  deleteModal: state.activeInstitution.deleteModal,
  displayedName: state.activeInstitution.displayedName,
  institutionId: state.activeInstitution.institution.id,
});

const mapDispatchToProps = dispatch => ({
  addContent: (url, jsonBody, method, institutionId) => dispatch(addContent(url, jsonBody, method, institutionId)),
  setActiveItem: item => dispatch(setActiveItem(item)),
  removeActiveItem: () => dispatch(removeActiveItem()),
  toggleDeleteModal: url => dispatch(toggleDeleteModal(url)),
});

CodeContainer.propTypes = {
  activeItem: PropTypes.shape({
    category: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date_end: PropTypes.string,
    date_start: PropTypes.string,
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }),
  addContent: PropTypes.func.isRequired,
  addContentHasErrored: PropTypes.bool,
  addContentIsLoading: PropTypes.bool,
  deleteModal: PropTypes.bool,
  displayedName: PropTypes.string.isRequired,
  codeCategories: PropTypes.array.isRequired,
  codes: PropTypes.array.isRequired,
  institutionId: PropTypes.number.isRequired,
  removeActiveItem: PropTypes.func.isRequired,
  setActiveItem: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
};

CodeContainer.defaultProps = {
  activeItem: null,
  addContentHasErrored: false,
  addContentIsLoading: false,
  deleteModal: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeContainer);
