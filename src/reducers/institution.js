
export default function activeInstitution(state = [], action) {
  switch (action.type) {
    case 'INSTITUTION_HAS_ERRORED':
      return { ...state, hasErrored: action.hasErrored };
    case 'INSTITUTION_IS_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'INSTITUTION_FETCH_DATA_SUCCESS':
      return { ...state, institution: action.institution.institution };
    case 'SYNONYM_HAS_ERRORED':
      return { ...state, synonymHasErrored: action.hasErrored };
    case 'SYNONYM_IS_LOADING':
      return { ...state, synonymIsLoading: action.isLoading };
    case 'INSTITUTION_FETCH_SUCCESS':
      return { ...state, institution: action.institution.institution };
    case 'DELETE_CONTENT_HAS_ERRORED':
      return { ...state, deleteContentHasErrored: action.hasErrored };
    case 'DELETE_CONTENT_IS_LOADING':
      return { ...state, deleteContentIsLoading: action.isLoading };
    case 'ADD_CONTENT_HAS_ERRORED':
      return { ...state, addContentHasErrored: action.hasErrored };
    case 'ADD_CONTENT_IS_LOADING':
      return { ...state, addContentIsLoading: action.isLoading };
    case 'TOGGLE_EDIT_MODAL':
      return {
        ...state,
        addContentHasErrored: false,
        addContentIsLoading: false,
        editModal: !state.editModal,
      };
    case 'TOGGLE_ADD_MODAL':
      return {
        ...state,
        addContentHasErrored: false,
        addContentIsLoading: false,
        addModal: !state.addModal,
      };
    default:
      return state;
  }
}
