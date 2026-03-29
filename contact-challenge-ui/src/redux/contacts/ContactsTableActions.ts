import { Dispatch } from "redux";
import { contactService } from "../../featues/contacts/services/ContactService";
import { PersonSearchParams } from "../../types/types";
import { ContactsTableActionTypes } from "./ContactsTableTypes";

export const searchContacts =
  (params: PersonSearchParams) => async (dispatch: Dispatch) => {
    dispatch({ type: ContactsTableActionTypes.SEARCH_LOADING });
    try {
      const data = await contactService.search(params);
      dispatch({
        type: ContactsTableActionTypes.SEARCH_SUCCESS,
        payload: data,
      });
    } catch (err: any) {
      dispatch({
        type: ContactsTableActionTypes.SEARCH_ERROR,
        payload: err?.message || "Error searching contacts",
      });
    }
  };

export const clearSearchResults = () => ({
  type: ContactsTableActionTypes.CLEAR_SEARCH,
});
