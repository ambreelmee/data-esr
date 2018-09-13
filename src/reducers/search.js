import parse from 'parse-link-header';


export default function search(state = [], action) {
  switch (action.type) {
    case 'SEARCH_HAS_ERRORED':
      return { ...state, hasErrored: action.hasErrored };
    case 'SEARCH_IS_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SEARCH_IS_SEARCHING':
      return {
        ...state,
        isSearching: action.isSearching,
        downloadFile: null,
      };
    case 'SEARCH_FETCH_DATA_SUCCESS_FIRST_CALL':
      return { ...state, institutions: action.institutions };
    case 'SEARCH_FETCH_DATA_SUCCESS':
      return { ...state, institutionsResults: action.institutions };
    case 'SEARCH_FETCH_HEADER_SUCCESS':
      return {
        ...state,
        linksResults: parse(action.headers.get('Link')),
        countResults: action.headers.get('Count'),
      };
    case 'SEARCH_FETCH_HEADER_SUCCESS_FIRST_CALL':
      return {
        ...state,
        links: parse(action.headers.get('Link')),
        count: action.headers.get('Count'),
      };
    case 'RESET_SEARCH_AND_DISPLAY_FIRST_PAGE':
      return {
        ...state,
        linksResults: state.links,
        countResults: state.count,
        institutionsResults: state.institutions,
        searchValue: '',
        downloadFile: null,
      };
    case 'SEARCH_VALUE':
      return { ...state, searchValue: action.searchValue };
    case 'REMOVE_DOWNLOAD_FILE':
      return { ...state, downloadFile: null };
    case 'DOWNLOAD_HAS_ERRORED':
      return { ...state, downloadHasErrored: action.hasErrored };
    case 'DOWNLOAD_IS_LOADING':
      return { ...state, downloadIsLoading: action.isLoading };
    case 'DOWNLOAD_SUCCESS':
      return { ...state, downloadFile: action.file };
    case 'CREATE_INSTITUTION_HAS_ERRORED':
      return { ...state, createInstitutionHasErrored: action.hasErrored };
    case 'CREATE_INSTITUTION_IS_LOADING':
      return { ...state, createInstitutionIsLoading: action.isLoading };
    case 'TOGGLE_ADD_MODAL':
      return {
        ...state,
        addModal: !state.addModal,
      };
    case 'TOGGLE_ADD_NAME_MODAL':
      return {
        ...state,
        addContentHasErrored: false,
        addContentIsLoading: false,
        addModal: !state.addModal,
      };
    case 'TOGGLE_EDIT_MODAL':
      return {
        ...state,
        addContentHasErrored: false,
        addContentIsLoading: false,
        editModal: !state.editModal,
      };
    default:
      return state;
  }
}
