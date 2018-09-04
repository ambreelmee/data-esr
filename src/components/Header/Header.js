import React, { Component } from 'react';
import {
  NavbarToggler,
  NavbarBrand,
  Tooltip,
} from 'reactstrap';

class Header extends Component {
  constructor(props) {
    super(props);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.state = {
      tooltip: false,
      isOvered: false,
    };
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  toggleTooltip() {
    this.setState({
      tooltip: !this.state.tooltip,
    });
  }

  onMouseEnter() {
    this.setState({
      isOvered: true,
    });
  }

  onMouseLeave() {
    this.setState({
      isOvered: false,
    });
  }

  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        <NavbarBrand href="#" />
        <NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSesa0p2LTZ8amElLyJezwKII-eCVzJ4UGTtd9EwekvyHMzc5g/viewform?usp=sf_link"
          target="blank"
          id="user-comment"
          style={{ position: 'absolute', right: '30px' }}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {this.state.isOvered ?
            <i className="fa fa-life-ring fa-3x text-danger" /> :
            <i className="fa fa-life-ring fa-2x text-danger" />}
        </a>
        <Tooltip
          isOpen={this.state.tooltip}
          target="user-comment"
          toggle={this.toggleTooltip}
        >
          Nous contacter
        </Tooltip>
      </header>
    );
  }
}

export default Header;
