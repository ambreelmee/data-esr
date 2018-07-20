import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap';
import classnames from 'classnames';
import CategoryContainer from './Category/CategoryContainer';
import TagCategoryContainer from './Category/TagCategoryContainer';
import ImportExport from './ImportExport';

class Admin extends Component {

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
        <Nav tabs>
          <NavItem className="rounded">
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              <i className="fa fa-th mr-2 text-primary" />
              Identifiants
            </NavLink>
          </NavItem>
          <NavItem className="rounded">
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              <i className="fa fa-at mr-2 text-primary" />
              Liens
            </NavLink>
          </NavItem>
          <NavItem className="rounded">
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              <i className="fa fa-tag mr-2 text-primary" />
              Caractérisations
            </NavLink>
          </NavItem>
          <NavItem className="rounded">
            <NavLink
              className={classnames({ active: this.state.activeTab === '4' })}
              onClick={() => { this.toggle('4'); }}
            >
              <i className="fa fa-history mr-2 text-primary" />
              Evolutions
            </NavLink>
          </NavItem>
          <NavItem className="rounded">
            <NavLink
              className={classnames({ active: this.state.activeTab === '5' })}
              onClick={() => { this.toggle('5'); }}
            >
              <i className="fa fa-arrows-alt mr-2 text-primary" />
              Rattachement
            </NavLink>
          </NavItem>
          <NavItem className="rounded">
            <NavLink
              className={classnames({ active: this.state.activeTab === '6' })}
              onClick={() => { this.toggle('6'); }}
            >
              <i className="fa fa-map-marker mr-2 text-primary" />
              Adresses
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <CategoryContainer name="codes" categoryType="code" />
              <ImportExport name="codes" routePath="codes" />
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <CategoryContainer name="liens" categoryType="link" />
              <ImportExport name="liens" routePath="links" />
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <TagCategoryContainer />
              <ImportExport name="caractérisations" routePath="taggings" />
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <CategoryContainer name="évolutions" categoryType="institution_evolution" />
              <ImportExport name="evolutions" routePath="evolutions" />
            </Row>
          </TabPane>
          <TabPane tabId="5">
            <Row>
              <CategoryContainer name="rattachements" categoryType="institution_connection" />
              <ImportExport name="rattachements" routePath="connections" />
            </Row>
          </TabPane>
          <TabPane tabId="6">
            <Row>
              <ImportExport name="adresses" routePath="addresses" />
            </Row>
          </TabPane>
        </TabContent>
      </div>
    )
  }
}

export default Admin;
