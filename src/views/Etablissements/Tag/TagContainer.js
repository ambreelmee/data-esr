import React, { Component } from 'react';
import {
  ButtonDropdown, ButtonGroup, Card, CardBody, CardHeader, DropdownItem,
  DropdownMenu, DropdownToggle,
} from 'reactstrap';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import Tag from './Tag';
import TagAddModal from './TagAddModal';
import TagModal from './TagModal';

class TagContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      tags: [],
      addModal: false,
      displayDropdown: false,
      historyModal: false,
    };
    this.displayDropdown = this.displayDropdown.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
    this.getInstitutionTags = this.getInstitutionTags.bind(this);
  }

  componentWillMount() {
    this.getInstitutionTags(this.props.etablissement_id);
  }


  componentWillReceiveProps(nextProps) {
    this.getInstitutionTags(nextProps.etablissement_id);
  }

  getInstitutionTags(etablissementId) {
    this.setState({ isLoading: true });
    fetch(`${process.env.API_URL_STAGING}institutions/${etablissementId}/tags`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then(response => response.json())
      .then((data) => {
        const tagsByCategory = {};
        data.map((tag) => {
          if (!tagsByCategory[tag.tag.category]) {
            tagsByCategory[tag.tag.category] = [];
          }
          tagsByCategory[tag.tag.category].push(tag);
          return tagsByCategory;
        });
        this.setState({
          tags: data,
          isLoading: false,
          tagsByCategory,
        });
      });
  }

  toggleHistoryModal() {
    this.setState({
      historyModal: !this.state.historyModal,
    });
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
    });
  }

  displayDropdown() {
    this.setState({
      displayDropdown: !this.state.displayDropdown,
    });
  }

  renderItems() {
    return map(this.state.tagsByCategory, tags => (
      <Tag
        key={tags[0].tag.category}
        categoryTags={tags}
      />
    ));
  }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <Card className="mt-2 w-100">
        <CardHeader>
          Caractérisations de l&#39;établissement
          <ButtonGroup className="float-right">
            <ButtonDropdown
              id="tagDropdown"
              isOpen={this.state.displayDropdown}
              toggle={this.displayDropdown}
            >
              <DropdownToggle caret className="p-0" color="light">
                <i className="icon-settings" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.toggleAddModal}>
                  <i className="fa fa-plus text-success" />
                    Ajouter une nouvelle caractérisation
                </DropdownItem>
                {this.state.addModal ?
                  <TagAddModal
                    etablissementId={this.props.etablissement_id}
                    getInstitutionTags={this.getInstitutionTags}
                    toggleModal={this.toggleAddModal}
                  /> : <div />}
                <DropdownItem onClick={this.toggleHistoryModal}>
                  <i className="fa fa-eye text-info" />
                    Voir plus d&#39;information
                </DropdownItem>
                {this.state.historyModal ?
                  <TagModal
                    etablissementId={this.props.etablissement_id}
                    getInstitutionTags={this.getInstitutionTags}
                    toggleModal={this.toggleHistoryModal}
                    tags={this.state.tags}
                  /> : <div />}
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
        </CardHeader>
        <CardBody>
          {this.renderItems()}
          {this.state.tags.length === 0 ? <em>Aucune caractérisation enregistrée actuellement...<br /></em> : <div />}
        </CardBody>
      </Card>
    );
  }
}

TagContainer.propTypes = {
  etablissement_id: PropTypes.number.isRequired,
};

export default TagContainer;
