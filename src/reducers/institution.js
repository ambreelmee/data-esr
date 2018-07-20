
export default function activeInstitution(state = [], action) {
  switch (action.type) {
    case 'INSTITUTION_HAS_ERRORED':
      return { ...state, hasErrored: action.hasErrored };
    case 'INSTITUTION_IS_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'INSTITUTION_FETCH_DATA_SUCCESS':
      return {
        ...state,
        institution: action.institution.institution,
        addModal: false,
        editModal: false,
      };
    case 'SYNONYM_HAS_ERRORED':
      return { ...state, synonymHasErrored: action.hasErrored };
    case 'SYNONYM_IS_LOADING':
      return { ...state, synonymIsLoading: action.isLoading };
    case 'DELETE_CONTENT_HAS_ERRORED':
      return { ...state, deleteContentHasErrored: action.hasErrored };
    case 'DELETE_CONTENT_IS_LOADING':
      return { ...state, deleteContentIsLoading: action.isLoading };
    case 'DELETE_CONTENT_SUCCESS':
      return { ...state, deleteModal: false, activeItem: {} };
    case 'TOGGLE_DELETE_MODAL':
      return {
        ...state,
        deleteModal: !state.deleteModal,
        deleteContentHasErrored: false,
        deleteContentIsLoading: false,
        deleteUrl: action.url,
      };
    case 'ADD_CONTENT_HAS_ERRORED':
      return { ...state, addContentHasErrored: action.hasErrored };
    case 'ADD_CONTENT_IS_LOADING':
      return { ...state, addContentIsLoading: action.isLoading };
    case 'TOGGLE_EDIT_MODAL':
      return {
        ...state,
        activeId: action.id,
        addContentHasErrored: false,
        addContentIsLoading: false,
        editModal: !state.editModal,
      };
    case 'TOGGLE_ADD_NAME_MODAL':
      return {
        ...state,
        addContentHasErrored: false,
        addContentIsLoading: false,
        addNameModal: !state.addNameModal,
      };
    case 'REMOVE_ACTIVE_INSTITUTION':
      return {
        ...state,
        activeInstitution: {},
      };
    case 'SET_ACTIVE_ITEM':
      return {
        ...state,
        activeItem: action.item,
      };
    case 'REMOVE_ACTIVE_ITEM':
      return {
        ...state,
        activeItem: {},
      };
    case 'SET_DISPLAYED_NAME':
      return {
        ...state,
        displayedName: action.name,
      };
    default:
      return state;
  }
}