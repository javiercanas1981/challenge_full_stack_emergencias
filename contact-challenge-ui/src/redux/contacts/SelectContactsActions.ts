import { Dispatch } from "redux";
import { contactService } from "../../featues/contacts/services/ContactService";
import { Person } from "../../types/types";
import { SelectContactsActionTypes } from "./SelectContactsReducerTypes";

export const selectContact = (person: Person) => ({
  type: SelectContactsActionTypes.SELECT,
  payload: person,
});

export const clearSelectedContact = () => ({
  type: SelectContactsActionTypes.CLEAR_SELECTION,
});

export const fetchContactById = (id: number) => async (dispatch: Dispatch) => {
  dispatch({ type: SelectContactsActionTypes.FETCH_LOADING });
  try {
    const data = await contactService.getById(id);
    dispatch({ type: SelectContactsActionTypes.FETCH_SUCCESS, payload: data });
  } catch (err: any) {
    dispatch({
      type: SelectContactsActionTypes.FETCH_ERROR,
      payload: err?.message || "Error fetching contact",
    });
  }
};
