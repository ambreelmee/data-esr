
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
      .catch(() => dispatch(institutionHasErrored(true)));
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
export function institutionFetchSuccess(institution) {
  return {
    type: 'INSTITUTION_FETCH_SUCCESS',
    institution,
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
      .then((institution) => {
        dispatch(institutionFetchSuccess(institution));
        dispatch(synonymIsLoading(false));
      })
      .catch(() => dispatch(synonymHasErrored(true)));
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
        dispatch(getActiveInstitution(institutionId));
      })
      .catch(() => dispatch(deleteContentHasErrored(true)));
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
export function addContent(url, jsonBody) {
  return (dispatch) => {
    dispatch(addContentIsLoading(true));
    fetch(url, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
      .then((institution) => {
        dispatch(addContentIsLoading(false));
        dispatch(institutionFetchSuccess(institution));
      })
      .catch(() => dispatch(addContentHasErrored(true)));
  };
}
