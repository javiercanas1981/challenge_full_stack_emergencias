import { Dispatch } from "redux";
import { activityService } from "../../featues/activities/services/ActivityService";
import { contactService } from "../../featues/contacts/services/ContactService";
import { CreateActivityDTO } from "../../types/types";
import { ActivitiesAction, ActivitiesActionTypes } from "./ActivitiesTypes";

const extractId = (val: any): number =>
  val && typeof val === "object" ? val.id : val;

export const fetchAllActivities =
  () => async (dispatch: Dispatch<ActivitiesAction>) => {
    dispatch({ type: ActivitiesActionTypes.LOADING });
    try {
      const data = await activityService.search({});
      const activities = data.map((item: any) => item.activity);
      dispatch({
        type: ActivitiesActionTypes.FETCH_SUCCESS,
        payload: activities,
      });
    } catch (err: any) {
      dispatch({
        type: ActivitiesActionTypes.FETCH_ERROR,
        payload: err?.message || "Error loading activities",
      });
    }
  };

export const fetchByPersonId =
  (personId: number) => async (dispatch: Dispatch<ActivitiesAction>) => {
    dispatch({ type: ActivitiesActionTypes.LOADING });
    try {
      const id = extractId(personId);

      if (!id || isNaN(Number(id))) throw new Error("Invalid Person ID");

      const data = await activityService.getByPersonId(id);
      dispatch({ type: ActivitiesActionTypes.FETCH_SUCCESS, payload: data });
    } catch (err: any) {
      dispatch({
        type: ActivitiesActionTypes.FETCH_ERROR,
        payload: err?.message || "Error loading activities",
      });
    }
  };

export const addActivity =
  (activity: CreateActivityDTO) =>
  async (dispatch: Dispatch<ActivitiesAction>) => {
    try {
      let payload = activity;
      if (activity.personId) {
        payload = {
          ...activity,
          personId: extractId(activity.personId),
        };
      }

      const newActivity = await activityService.create(payload);
      dispatch({
        type: ActivitiesActionTypes.ADD_SUCCESS,
        payload: newActivity,
      });
    } catch (err: any) {
      dispatch({
        type: ActivitiesActionTypes.FETCH_ERROR,
        payload: err?.message || "Error creating activity",
      });
    }
  };


export const deleteActivity =
  (id: number) => async (dispatch: Dispatch<ActivitiesAction>) => {
    try {
      const activityId = extractId(id);

      await activityService.delete(activityId);
      dispatch({
        type: ActivitiesActionTypes.DELETE_SUCCESS,
        payload: activityId,
      });
    } catch (err: any) {
      dispatch({
        type: ActivitiesActionTypes.FETCH_ERROR,
        payload: err?.message || "Error deleting activity",
      });
    }
  };
