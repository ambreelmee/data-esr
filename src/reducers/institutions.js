import parse from 'parse-link-header';


export function search(state = [], action) {
  switch (action.type) {
    case 'INSTITUTIONS_HAS_ERRORED':
      return { ...state, hasErrored: action.hasErrored };
    case 'INSTITUTIONS_IS_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'INSTITUTIONS_FETCH_DATA_SUCCESS_FIRST_CALL':
      return { ...state, institutions: action.institutions };
    case 'INSTITUTIONS_FETCH_DATA_SUCCESS':
      return { ...state, institutionsResults: action.institutions };
    case 'INSTITUTIONS_FETCH_HEADER_SUCCESS':
      return {
        ...state,
        linksResults: parse(action.headers.get('Link')),
        countResults: action.headers.get('Count'),
      };
    case 'INSTITUTIONS_FETCH_HEADER_SUCCESS_FIRST_CALL':
      return {
        ...state,
        links: parse(action.headers.get('Link')),
        count: action.headers.get('Count'),
      };
    case 'RESET_SEARCH_AND_DISPLAY_FIRST_PAGE':
      return {
        ...state,
        linksResults: state.search.links,
        countResults: state.search.count,
        institutionsResults: state.search.institutions,
        searchValue: '',
      }
    case 'SEARCH_VALUE':
      return {...state, searchValue: action.searchValue };
    default:
      return state;
  }
}
