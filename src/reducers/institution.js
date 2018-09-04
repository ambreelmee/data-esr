
export default function activeInstitution(state = [], action) {
  switch (action.type) {
    case 'CODE_CATEGORIES_SUCCESS':
      return { ...state, codeCategories: action.categories };
    case 'CONNECTION_CATEGORIES_SUCCESS':
      return { ...state, connectionCategories: action.categories };
    case 'EVOLUTION_CATEGORIES_SUCCESS':
      return { ...state, evolutionCategories: action.categories };
    case 'LINK_CATEGORIES_SUCCESS':
      return { ...state, linkCategories: action.categories };
    case 'TAG_CATEGORIES_SUCCESS':
      return { ...state, tagCategories: action.categories };
    case 'TAGS_SUCCESS':
      return { ...state, tags: action.categories };
    case 'MOTHERS_HAS_ERRORED':
      return { ...state, mothersHasErrored: action.hasErrored };
    case 'MOTHERS_IS_LOADING':
      return { ...state, mothersIsLoading: action.isLoading };
    case 'MOTHERS_FETCH_DATA_SUCCESS':
      return { ...state, mothers: action.mothers };
    case 'DAUGHTERS_HAS_ERRORED':
      return { ...state, daughtersHasErrored: action.hasErrored };
    case 'DAUGHTERS_IS_LOADING':
      return { ...state, daughtersIsLoading: action.isLoading };
    case 'DAUGHTERS_FETCH_DATA_SUCCESS':
      return { ...state, daughters: action.daughters };
    case 'PREDECESSORS_HAS_ERRORED':
      return { ...state, predecessorsHasErrored: action.hasErrored };
    case 'PREDECESSORS_IS_LOADING':
      return { ...state, predecessorsIsLoading: action.isLoading };
    case 'PREDECESSORS_FETCH_DATA_SUCCESS':
      return { ...state, predecessors: action.predecessors };
    case 'FOLLOWERS_HAS_ERRORED':
      return { ...state, followersHasErrored: action.hasErrored };
    case 'FOLLOWERS_IS_LOADING':
      return { ...state, followersIsLoading: action.isLoading };
    case 'FOLLOWERS_FETCH_DATA_SUCCESS':
      return { ...state, followers: action.followers };
    case 'INSTITUTION_HAS_ERRORED':
      return { ...state, hasErrored: action.hasErrored };
    case 'INSTITUTION_IS_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
        daughters: [],
        followers: [],
        mothers: [],
        predecessors: [],
      };
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
      return { ...state, deleteModal: false, activeItem: null };
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
        hasErrored: false,
      };
    case 'REMOVE_ACTIVE_ITEM':
      return {
        ...state,
        activeItem: null,
        hasErrored: false,
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
