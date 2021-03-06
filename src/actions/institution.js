
import { getActiveEntity } from '../views/Institutions/methods';

export function removeActiveInstitution() {
  return {
    type: 'REMOVE_ACTIVE_INSTITUTION',
  };
}
export function linkCategoriesSuccess(categories) {
  return {
    type: 'LINK_CATEGORIES_SUCCESS',
    categories,
  };
}
export function getLinkCategories() {
  const url = `${process.env.API_URL_STAGING}link_categories`;
  return (dispatch) => {
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((categories) => {
        dispatch(linkCategoriesSuccess(categories));
      });
  };
}
export function tagCategoriesSuccess(categories) {
  return {
    type: 'TAG_CATEGORIES_SUCCESS',
    categories,
  };
}
export function getTagCategories() {
  const url = `${process.env.API_URL_STAGING}institution_tag_categories`;
  return (dispatch) => {
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((categories) => {
        dispatch(tagCategoriesSuccess(categories));
      });
  };
}
export function tagsSuccess(categories) {
  return {
    type: 'TAGS_SUCCESS',
    categories,
  };
}
export function getTags() {
  const url = `${process.env.API_URL_STAGING}institution_tags`;
  return (dispatch) => {
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((tags) => {
        dispatch(tagsSuccess(tags));
      });
  };
}
export function evolutionCategoriesSuccess(categories) {
  return {
    type: 'EVOLUTION_CATEGORIES_SUCCESS',
    categories,
  };
}
export function getEvolutionCategories() {
  const url = `${process.env.API_URL_STAGING}institution_evolution_categories`;
  return (dispatch) => {
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((categories) => {
        dispatch(evolutionCategoriesSuccess(categories));
      });
  };
}
export function codeCategoriesSuccess(categories) {
  return {
    type: 'CODE_CATEGORIES_SUCCESS',
    categories,
  };
}
export function getCodeCategories() {
  const url = `${process.env.API_URL_STAGING}code_categories`;
  return (dispatch) => {
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((categories) => {
        dispatch(codeCategoriesSuccess(categories));
      });
  };
}

export function connectionCategoriesSuccess(categories) {
  return {
    type: 'CONNECTION_CATEGORIES_SUCCESS',
    categories,
  };
}
export function getConnectionCategories() {
  const url = `${process.env.API_URL_STAGING}institution_connection_categories`;
  return (dispatch) => {
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((categories) => {
        dispatch(connectionCategoriesSuccess(categories));
      });
  };
}
export function getAllCategories() {
  return (dispatch) => {
    dispatch(getCodeCategories());
    dispatch(getConnectionCategories());
    dispatch(getLinkCategories());
    dispatch(getEvolutionCategories());
    dispatch(getTagCategories());
    dispatch(getTags());
  };
}
export function getMothersFetchDataSuccess(mothers) {
  return {
    type: 'MOTHERS_FETCH_DATA_SUCCESS',
    mothers,
  };
}
export function getMothersHasErrored(bool) {
  return {
    type: 'MOTHERS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function getMothersIsLoading(bool) {
  return {
    type: 'MOTHERS_IS_LOADING',
    isLoading: bool,
  };
}
export function getMothers(institutionId) {
  const url = `${process.env.API_URL_STAGING}institutions/${institutionId}/mothers`;
  return (dispatch) => {
    dispatch(getMothersIsLoading(true));
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((mothers) => {
        dispatch(getMothersFetchDataSuccess(mothers.connections));
        dispatch(getMothersIsLoading(false));
      })
      .catch(() => {
        dispatch(getMothersHasErrored(true));
        dispatch(getMothersIsLoading(false));
      });
  };
}
export function getDaughtersFetchDataSuccess(daughters) {
  return {
    type: 'DAUGHTERS_FETCH_DATA_SUCCESS',
    daughters,
  };
}
export function getDaughtersHasErrored(bool) {
  return {
    type: 'DAUGHTERS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function getDaughtersIsLoading(bool) {
  return {
    type: 'DAUGHTERS_IS_LOADING',
    isLoading: bool,
  };
}
export function getDaughters(institutionId) {
  const url = `${process.env.API_URL_STAGING}institutions/${institutionId}/daughters`;
  return (dispatch) => {
    dispatch(getDaughtersIsLoading(true));
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((daughters) => {
        dispatch(getDaughtersFetchDataSuccess(daughters.connections));
        dispatch(getDaughtersIsLoading(false));
      })
      .catch(() => {
        dispatch(getDaughtersHasErrored(true));
        dispatch(getDaughtersIsLoading(false));
      });
  };
}
export function getPredecessorsFetchDataSuccess(predecessors) {
  return {
    type: 'PREDECESSORS_FETCH_DATA_SUCCESS',
    predecessors,
  };
}
export function getPredecessorsHasErrored(bool) {
  return {
    type: 'PREDECESSORS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function getPredecessorsIsLoading(bool) {
  return {
    type: 'PREDECESSORS_IS_LOADING',
    isLoading: bool,
  };
}
export function getPredecessors(institutionId) {
  const url = `${process.env.API_URL_STAGING}institutions/${institutionId}/predecessors`;
  return (dispatch) => {
    dispatch(getPredecessorsIsLoading(true));
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((predecessors) => {
        dispatch(getPredecessorsFetchDataSuccess(predecessors.evolutions));
        dispatch(getPredecessorsIsLoading(false));
      })
      .catch(() => {
        dispatch(getPredecessorsHasErrored(true));
        dispatch(getPredecessorsIsLoading(false));
      });
  };
}
export function getFollowersFetchDataSuccess(followers) {
  return {
    type: 'FOLLOWERS_FETCH_DATA_SUCCESS',
    followers,
  };
}
export function getFollowersHasErrored(bool) {
  return {
    type: 'FOLLOWERS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function getFollowersIsLoading(bool) {
  return {
    type: 'FOLLOWERS_IS_LOADING',
    isLoading: bool,
  };
}
export function getFollowers(institutionId) {
  const url = `${process.env.API_URL_STAGING}institutions/${institutionId}/followers`;
  return (dispatch) => {
    dispatch(getFollowersIsLoading(true));
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((followers) => {
        dispatch(getFollowersFetchDataSuccess(followers.evolutions));
        dispatch(getFollowersIsLoading(false));
      })
      .catch(() => {
        dispatch(getFollowersHasErrored(true));
        dispatch(getFollowersIsLoading(false));
      });
  };
}
export function institutionFetchDataSuccess(institution) {
  return {
    type: 'INSTITUTION_FETCH_DATA_SUCCESS',
    institution,
  };
}
export function institutionHasErrored(bool) {
  return {
    type: 'INSTITUTION_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function institutionIsLoading(bool) {
  return {
    type: 'INSTITUTION_IS_LOADING',
    isLoading: bool,
  };
}
export function getActiveInstitution(institutionId) {
  const url = `${process.env.API_URL_STAGING}institutions/${institutionId}`;
  return (dispatch) => {
    dispatch(institutionIsLoading(true));
    dispatch(removeActiveItem())
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((institution) => {
        dispatch(institutionFetchDataSuccess(institution));
        const replacementName = institution.institution.names ? institution.institution.names[0] : null;
        const displayedName = getActiveEntity(institution.institution.names) ?
          getActiveEntity(institution.institution.names) : replacementName;
        dispatch(setDisplayedName(`${displayedName.initials}${displayedName.initials === displayedName.text ?
          '' : ` - ${displayedName.text.toProperCase()}`}`))
        if (institution.institution.mothers.length > 0) {
          dispatch(getMothers(institutionId))
        }
        if (institution.institution.daughters.length > 0) {
          dispatch(getDaughters(institutionId))
        }
        if (institution.institution.predecessors.length > 0) {
          dispatch(getPredecessors(institutionId))
        }
        if (institution.institution.followers.length > 0) {
          dispatch(getFollowers(institutionId))
        }
      })
      .catch(() => {
        dispatch(institutionHasErrored(true));
      });
  };
}
export function synonymHasErrored(bool) {
  return {
    type: 'SYNONYM_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function synonymIsLoading(bool) {
  return {
    type: 'SYNONYM_IS_LOADING',
    isLoading: bool,
  };
}
export function updateSynonymList(url, synonym) {
  return (dispatch) => {
    dispatch(synonymIsLoading(true));
    fetch(url, {
      method: 'PUT',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ institution: { synonym } }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then((data) => {
        if (data.institution) {
          dispatch(institutionFetchDataSuccess(data));
        }
        dispatch(synonymIsLoading(false));
      })
      .catch(() => {
        dispatch(synonymHasErrored(true));
        dispatch(synonymIsLoading(false));
      });
  };
}
export function toggleDeleteModal(url) {
  return {
    type: 'TOGGLE_DELETE_MODAL',
    url,
  };
}
export function deleteContentIsLoading(bool) {
  return {
    type: 'DELETE_CONTENT_IS_LOADING',
    isLoading: bool,
  };
}
export function deleteContentHasErrored(bool) {
  return {
    type: 'DELETE_CONTENT_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function deleteContentSuccess() {
  return {
    type: 'DELETE_CONTENT_SUCCESS',
  };
}
export function deleteContent(url, institutionId) {
  return (dispatch) => {
    dispatch(deleteContentIsLoading(true));
    fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then(() => {
        dispatch(deleteContentIsLoading(false));
        dispatch(deleteContentSuccess());
        if (institutionId) {
          dispatch(getActiveInstitution(institutionId));
        } else {
          dispatch(removeActiveInstitution());
          dispatch(getAllCategories());
        }
      })
      .catch(() => {
        dispatch(deleteContentHasErrored(true));
        dispatch(deleteContentIsLoading(false));
      });
  };
}
export function addContentIsLoading(bool) {
  return {
    type: 'ADD_CONTENT_IS_LOADING',
    isLoading: bool,
  };
}
export function addContentHasErrored(bool) {
  return {
    type: 'ADD_CONTENT_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function toggleAddNameModal() {
  return {
    type: 'TOGGLE_ADD_NAME_MODAL',
  };
}
export function toggleEditModal(id) {
  return {
    type: 'TOGGLE_EDIT_MODAL',
    id,
  };
}
export function addContent(url, jsonBody, method, institutionId) {
  return (dispatch) => {
    dispatch(addContentIsLoading(true));
    fetch(url, {
      method,
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }),
      body: jsonBody,
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then(() => {
        dispatch(addContentIsLoading(false));
        dispatch(addContentHasErrored(false));
        if (institutionId) {
          dispatch(getActiveInstitution(institutionId));
        } else {
          dispatch(getAllCategories())
        }
      })
      .catch(() => {
        dispatch(addContentHasErrored(true));
        dispatch(addContentIsLoading(false));
      });
  };
}
export function setActiveItem(item) {
  return {
    type: 'SET_ACTIVE_ITEM',
    item,
  };
}
export function setDisplayedName(name) {
  return {
    type: 'SET_DISPLAYED_NAME',
    name,
  };
}
export function removeActiveItem() {
  return {
    type: 'REMOVE_ACTIVE_ITEM',
  };
}
