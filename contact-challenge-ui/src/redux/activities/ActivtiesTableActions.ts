import { Dispatch } from "redux";

import { activityService } from "../../featues/activities/services/ActivityService";
import { ActivitySearchCriteria, ContactActivity } from "../../types/types";
import { ActivitiesTableActionTypes } from "./ActivtiesTableTypes";

export const searchActivities =
  (criteria: ActivitySearchCriteria) => async (dispatch: Dispatch) => {
    dispatch({ type: ActivitiesTableActionTypes.SEARCH_LOADING });
    try {
      const personId =
        criteria.personId && typeof criteria.personId === "object"
          ? (criteria.personId as any).id
          : criteria.personId;

      const apiCriteria = {
        ...criteria,
        personId: personId,
        contactId: personId,
      };

      const data = (await activityService.search(apiCriteria)) as (
        | ContactActivity
        | { activity: ContactActivity }
      )[];

      dispatch({
        type: ActivitiesTableActionTypes.SEARCH_SUCCESS,
        payload: data
          .map((r) => ("activity" in r ? r.activity : r))
          .filter((a): a is ContactActivity => !!a),
      });
    } catch (err: any) {
      dispatch({
        type: ActivitiesTableActionTypes.SEARCH_ERROR,
        payload: err?.message || "Error searching activities",
      });
    }
  };

export const clearSearchResults = () => ({
  type: ActivitiesTableActionTypes.CLEAR_SEARCH,
});
