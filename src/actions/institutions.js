export function institutionsHasErrored(bool) {
    return {
        type: 'INSTITUTIONS_HAS_ERRORED',
        hasErrored: bool
    };
}
export function institutionsIsLoading(bool) {
    return {
        type: 'INSTITUTIONS_IS_LOADING',
        isLoading: bool
    };
}
export function institutionsFetchDataSuccess(institutions) {
    return {
        type: 'INSTITUTIONS_FETCH_DATA_SUCCESS',
        institutions
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
                dispatch(institutionsIsLoading(false));
                return response;
            })
            .then((response) => response.json())
            .then((institutions) => dispatch(institutionsFetchDataSuccess(institutions)))
            .catch(() => dispatch(institutionsHasErrored(true)));
    };
}
