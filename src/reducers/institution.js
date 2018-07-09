
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
    case 'SYNONYM_SUCCESS':
      return { ...state, institution: { ...state.institution, synonym: action.synonym } };
    default:
      return state;
  }
}
