
export function institutionsHasErrored(bool) {
  return {
    type: 'INSTITUTIONS_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function institutionsIsLoading(bool) {
  return {
    type: 'INSTITUTIONS_IS_LOADING',
    isLoading: bool,
  };
}
export function institutionsFetchHeaderSuccessFirstCall(headers) {
  return {
    type: 'INSTITUTIONS_FETCH_HEADER_SUCCESS_FIRST_CALL',
    headers,
  };
}
export function institutionsFetchHeaderSuccess(headers) {
  return {
    type: 'INSTITUTIONS_FETCH_HEADER_SUCCESS',
    headers,
  };
}
export function institutionsFetchDataSuccessFirstCall(institutions) {
  return {
    type: 'INSTITUTIONS_FETCH_DATA_SUCCESS_FIRST_CALL',
    institutions,
  };
}
export function institutionsFetchDataSuccess(institutions) {
  return {
    type: 'INSTITUTIONS_FETCH_DATA_SUCCESS',
    institutions,
  };
}
export function institutionsFetchData(url) {
  return (dispatch) => {
    dispatch(institutionsIsLoading(true));
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
        dispatch(institutionsFetchHeaderSuccessFirstCall(response.headers));
        dispatch(institutionsFetchHeaderSuccess(response.headers));
        return response;
      })
      .then(response => response.json())
      .then((institutions) => {
        dispatch(institutionsFetchDataSuccessFirstCall(institutions));
        dispatch(institutionsFetchDataSuccess(institutions));
        dispatch(institutionsIsLoading(false));
      })
      .catch(() => dispatch(institutionsHasErrored(true)));
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
      dispatch(institutionsIsLoading(true));
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
          dispatch(institutionsFetchHeaderSuccess(response.headers));
          return response;
        })
        .then(response => response.json())
        .then(institutions => dispatch(institutionsFetchDataSuccess(institutions)))
        .catch(() => dispatch(institutionsHasErrored(true)));
      dispatch(institutionsIsLoading(false));
    }
  };
}
export function searchValue(value) {
  return {
    type: 'SEARCH_VALUE',
    searchValue: value,
  };
}
export function onSearchInputChange(event) {
  const searchInput = encodeURI(event.target.value);
  return (dispatch) => {
    event.preventDefault();
    dispatch(searchValue(event.target.value));
    dispatch(institutionsIsLoading(true));
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
        dispatch(institutionsIsLoading(false));
        dispatch(institutionsFetchHeaderSuccess(response.headers));
        return response;
      })
      .then(response => response.json())
      .then(institutions => dispatch(institutionsFetchDataSuccess(institutions)))
      .catch(() => dispatch(institutionsHasErrored(true)));
  };
}
