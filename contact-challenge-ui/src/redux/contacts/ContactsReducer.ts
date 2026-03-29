import { Person } from "../../types/types";
import { ContactsActionTypes } from "./ContactsTypes";

export interface IContactsState {
  contacts: Person[];
  loading: boolean;
  error: string | null;
}

const initialState: IContactsState = {
  contacts: [],
  loading: false,
  error: null,
};

export const ContactsReducer = (
  state = initialState,
  action: any,
): IContactsState => {
  switch (action.type) {
    case ContactsActionTypes.LOADING:
      return { ...state, loading: true, error: null };
    case ContactsActionTypes.FETCH_SUCCESS:
      return { ...state, loading: false, contacts: action.payload };
    case ContactsActionTypes.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ContactsActionTypes.ADD_SUCCESS:
      return { ...state, contacts: [...state.contacts, action.payload] };
    case ContactsActionTypes.UPDATE_SUCCESS:
      return {
        ...state,
        contacts: state.contacts.map((c) =>
          c.id === action.payload.id ? action.payload : c,
        ),
      };
    case ContactsActionTypes.DELETE_SUCCESS:
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== action.payload),
      };
    default:
      return state;
  }
};
