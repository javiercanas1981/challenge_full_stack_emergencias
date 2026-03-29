import { Person } from "../../types/types";
import { SelectContactsActionTypes } from "./SelectContactsReducerTypes";

export interface ISelectedContactsState {
  selectedContact: Person | null;
  loading: boolean;
  error: string | null;
}

const initialState: ISelectedContactsState = {
  selectedContact: null,
  loading: false,
  error: null,
};

export const SelectContactsReducer = (
  state = initialState,
  action: any,
): ISelectedContactsState => {
  switch (action.type) {
    case SelectContactsActionTypes.SELECT:
      return {
        ...state,
        selectedContact: action.payload,
        loading: false,
        error: null,
      };
    case SelectContactsActionTypes.CLEAR_SELECTION:
      return { ...state, selectedContact: null, loading: false, error: null };
    case SelectContactsActionTypes.FETCH_LOADING:
      return { ...state, loading: true, error: null };
    case SelectContactsActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedContact: action.payload,
        error: null,
      };
    case SelectContactsActionTypes.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        selectedContact: null,
      };
    default:
      return state;
  }
};
