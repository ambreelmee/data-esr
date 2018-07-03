export function institutionsHasErrored(state = false, action) {
    switch (action.type) {
        case 'INSTITUTIONS_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}
export function institutionsIsLoading(state = false, action) {
    switch (action.type) {
        case 'INSTITUTIONS_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}
export function institutions(state = [], action) {
    switch (action.type) {
        case 'INSTITUTIONS_FETCH_DATA_SUCCESS':
            return action.institutions;
        default:
            return state;
    }
}
