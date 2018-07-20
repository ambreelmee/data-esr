
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
export function institutionFetchDataSuccess(institution) {
  return {
    type: 'INSTITUTION_FETCH_DATA_SUCCESS',
    institution,
  };
}
export function getActiveInstitution(institutionId) {
  const url = `${process.env.API_URL_STAGING}institutions/${institutionId}`;
  return (dispatch) => {
    dispatch(institutionIsLoading(true));
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
        dispatch(institutionIsLoading(false));
      })
      .catch(() => {
        dispatch(institutionHasErrored(true));
        dispatch(institutionIsLoading(false));
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
export function institutionFetchSuccess(data) {
  return {
    type: 'INSTITUTION_FETCH_SUCCESS',
    data,
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
        } else {
          dispatch(institutionFetchSuccess(data))
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
export function removeActiveInstitution() {
  return {
    type: 'REMOVE_ACTIVE_INSTITUTION',
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
          dispatch(removeActiveInstitution())
        }
      })
      .catch(() => {
        dispatch(deleteContentHasErrored(true));
        dispatch(deleteContentIsLoading(false));
      })
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
        dispatch(getActiveInstitution(institutionId));
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
