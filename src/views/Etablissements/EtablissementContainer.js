import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';

import AddressContainer from './Address/AddressContainer';
import LinkContainer from './Link/LinkContainer';
import NameContainer from './Name/NameContainer';

class EtablissementContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToSearchPage: false,
    };
    this.goToSearchPage = this.goToSearchPage.bind(this);
  }


  goToSearchPage() {
    this.setState({
      redirectToSearchPage: true,
    });
  }

  render() {
    if (this.state.redirectToSearchPage) {
      return <Redirect to="/etablissements" />;
    }
    return (
      <div className="animated fadeIn">
        <Button
          color="primary"
          className="m-3"
          size="lg"
          onClick={this.goToSearchPage}
        >
        Retour
        </Button>
        <NameContainer etablissement_id={parseInt(this.props.match.params.number, 10)} />
        <AddressContainer etablissement_id={parseInt(this.props.match.params.number, 10)} />
        <LinkContainer etablissement_id={parseInt(this.props.match.params.number, 10)} />
      </div>
    );
  }
}

export default EtablissementContainer;
