import { Person } from "../../types/types";
import { ContactsTableActionTypes } from "./ContactsTableTypes";

export interface IContactsTableState {
  searchResults: Person[];
  loading: boolean;
  error: string | null;
}

const initialState: IContactsTableState = {
  searchResults: [],
  loading: false,
  error: null,
};

export const ContactsTableReducer = (
  state = initialState,
  action: any,
): IContactsTableState => {
  switch (action.type) {
    case ContactsTableActionTypes.SEARCH_LOADING:
      return { ...state, loading: true, error: null };
    case ContactsTableActionTypes.SEARCH_SUCCESS:
      return { ...state, loading: false, searchResults: action.payload };
    case ContactsTableActionTypes.SEARCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ContactsTableActionTypes.CLEAR_SEARCH:
      return { ...state, searchResults: [] };
    default:
      return state;
  }
};
