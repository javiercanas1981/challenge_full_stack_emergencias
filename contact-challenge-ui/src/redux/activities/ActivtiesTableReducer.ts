import { ContactActivity } from "../../types/types";
import { ActivitiesTableActionTypes } from "./ActivtiesTableTypes";

export interface IActivitiesTableState {
  searchResults: ContactActivity[];
  loading: boolean;
  error: string | null;
}

const initialState: IActivitiesTableState = {
  searchResults: [],
  loading: false,
  error: null,
};

export const ActivtiesTableReducer = (
  state = initialState,
  action: any,
): IActivitiesTableState => {
  switch (action.type) {
    case ActivitiesTableActionTypes.SEARCH_LOADING:
      return { ...state, loading: true, error: null };
    case ActivitiesTableActionTypes.SEARCH_SUCCESS:
      return { ...state, loading: false, searchResults: action.payload };
    case ActivitiesTableActionTypes.SEARCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ActivitiesTableActionTypes.CLEAR_SEARCH:
      return { ...state, searchResults: [] };
    default:
      return state;
  }
};
