import { Dispatch } from "redux";

import { contactService } from "../../features/contacts/services/ContactService";
import { CreatePersonDTO, UpdatePersonDTO } from "../../types/types";
import { ContactsActionTypes } from "./ContactsTypes";

export const fetchAllContacts = () => async (dispatch: Dispatch) => {
  dispatch({ type: ContactsActionTypes.LOADING });
  try {
    const data = await contactService.getAll();
    dispatch({ type: ContactsActionTypes.FETCH_SUCCESS, payload: data });
  } catch (err: any) {
    dispatch({
      type: ContactsActionTypes.FETCH_ERROR,
      payload: err?.message || "Error loading contacts",
    });
  }
};

export const addContact =
  (person: CreatePersonDTO) => async (dispatch: Dispatch) => {
    try {
      const newPerson = await contactService.create(person);
      dispatch({ type: ContactsActionTypes.ADD_SUCCESS, payload: newPerson });
    } catch (err: any) {
      const backendError = err?.response?.data || err;

      dispatch({
        type: ContactsActionTypes.FETCH_ERROR,
        payload: backendError,
      });

      throw backendError;
    }
  };

export const updateContact =
  (id: number, person: UpdatePersonDTO) => async (dispatch: Dispatch) => {
    try {
      const updatedPerson = await contactService.update(id, person);

      dispatch({
        type: ContactsActionTypes.UPDATE_SUCCESS,
        payload: updatedPerson,
      });

      return updatedPerson;
    } catch (err: any) {
      const backendError = err?.response?.data || err;

      dispatch({
        type: ContactsActionTypes.FETCH_ERROR,
        payload: backendError,
      });

      throw backendError;
    }
  };

export const deleteContact = (id: number) => async (dispatch: Dispatch) => {
  try {
    await contactService.delete(id);
    dispatch({ type: ContactsActionTypes.DELETE_SUCCESS, payload: id });
  } catch (err: any) {
    dispatch({
      type: ContactsActionTypes.FETCH_ERROR,
      payload: err?.message || "Error deleting contact",
    });
  }
};
