
export function searchHasErrored(bool) {
  return {
    type: 'SEARCH_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function searchIsLoading(bool) {
  return {
    type: 'SEARCH_IS_LOADING',
    isLoading: bool,
  };
}
export function searchFetchHeaderSuccessFirstCall(headers) {
  return {
    type: 'SEARCH_FETCH_HEADER_SUCCESS_FIRST_CALL',
    headers,
  };
}
export function searchFetchHeaderSuccess(headers) {
  return {
    type: 'SEARCH_FETCH_HEADER_SUCCESS',
    headers,
  };
}
export function searchFetchDataSuccessFirstCall(institutions) {
  return {
    type: 'SEARCH_FETCH_DATA_SUCCESS_FIRST_CALL',
    institutions,
  };
}
export function searchFetchDataSuccess(institutions) {
  return {
    type: 'SEARCH_FETCH_DATA_SUCCESS',
    institutions,
  };
}
export function searchFetchData(url) {
  return (dispatch) => {
    dispatch(searchIsLoading(true));
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
        dispatch(searchFetchHeaderSuccessFirstCall(response.headers));
        dispatch(searchFetchHeaderSuccess(response.headers));
        return response;
      })
      .then(response => response.json())
      .then((institutions) => {
        dispatch(searchFetchDataSuccessFirstCall(institutions));
        dispatch(searchFetchDataSuccess(institutions));
        dispatch(searchIsLoading(false));
      })
      .catch(() => dispatch(searchHasErrored(true)));
  };
}
export function resetSearchAndDisplayFirstPage() {
  return {
    type: 'RESET_SEARCH_AND_DISPLAY_FIRST_PAGE',
  };
}
export function onPageClick(url) {
  return (dispatch) => {
    if (url === 'first') {
      dispatch(resetSearchAndDisplayFirstPage());
    } else {
      dispatch(searchIsLoading(true));
      fetch(url, {
        method: url.includes('search') ? 'POST' : 'GET',
        headers: new Headers({
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          dispatch(searchFetchHeaderSuccess(response.headers));
          return response;
        })
        .then(response => response.json())
        .then(institutions => dispatch(searchFetchDataSuccess(institutions)))
        .catch(() => dispatch(searchHasErrored(true)));
      dispatch(searchIsLoading(false));
    }
  };
}
export function searchValue(value) {
  return {
    type: 'SEARCH_VALUE',
    searchValue: value,
  };
}
export function isSearching(bool) {
  return {
    type: 'SEARCH_IS_SEARCHING',
    isSearching: bool,
  };
}
export function institutionsSearch(value) {
  const searchInput = encodeURI(value);
  return (dispatch) => {
    dispatch(searchValue(value));
    dispatch(isSearching(true));
    fetch(`${process.env.API_URL_STAGING}institutions/search?q=${searchInput}&page_size=18`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        dispatch(isSearching(false));
        dispatch(searchFetchHeaderSuccess(response.headers));
        return response;
      })
      .then(response => response.json())
      .then(institutions => dispatch(searchFetchDataSuccess(institutions)))
      .catch(() => dispatch(searchHasErrored(true)));
  };
}

export function downloadHasErrored(bool) {
  return {
    type: 'DOWNLOAD_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function downloadIsLoading(bool) {
  return {
    type: 'DOWNLOAD_IS_LOADING',
    isLoading: bool,
  };
}
export function downloadSuccess(file) {
  return {
    type: 'DOWNLOAD_SUCCESS',
    file,
  };
}
export function downloadData(url) {
  return (dispatch) => {
    dispatch(downloadIsLoading(true));
    fetch(url, {
      method: 'POST',
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
      .then(response => response.blob())
      .then((file) => {
        dispatch(downloadSuccess(URL.createObjectURL(file)));
        dispatch(downloadIsLoading(false));
      })
      .catch(() => {
        dispatch(downloadHasErrored(true));
        dispatch(downloadIsLoading(false));
      });
  };
}
export function createInstitutionHasErrored(bool) {
  return {
    type: 'CREATE_INSTITUTION_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function createInstitutionIsLoading(bool) {
  return {
    type: 'CREATE_INSTITUTION_IS_LOADING',
    isLoading: bool,
  };
}
export function toggleAddModal() {
  return {
    type: 'TOGGLE_ADD_MODAL',
  };
}
export function createInstitution(jsonBody) {
  return (dispatch) => {
    dispatch(createInstitutionIsLoading(true));
    fetch(`${process.env.API_URL_STAGING}institutions/`, {
      method: 'POST',
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
        dispatch(createInstitutionIsLoading(false));
        dispatch(toggleAddModal());
      })
      .catch(() => {
        dispatch(createInstitutionHasErrored(true));
        dispatch(createInstitutionIsLoading(false));
      });
  };
}
