import { ContactActivity } from "../../types/types";

export enum ActivitiesActionTypes {
  LOADING = "ACTIVITIES/LOADING",
  FETCH_SUCCESS = "ACTIVITIES/FETCH_SUCCESS",
  FETCH_ERROR = "ACTIVITIES/FETCH_ERROR",
  ADD_SUCCESS = "ACTIVITIES/ADD_SUCCESS",
  DELETE_SUCCESS = "ACTIVITIES/DELETE_SUCCESS",
}

export type ActivitiesAction =
  | { type: ActivitiesActionTypes.LOADING }
  | { type: ActivitiesActionTypes.FETCH_SUCCESS; payload: ContactActivity[] }
  | { type: ActivitiesActionTypes.FETCH_ERROR; payload: string }
  | { type: ActivitiesActionTypes.ADD_SUCCESS; payload: ContactActivity }
  | { type: ActivitiesActionTypes.DELETE_SUCCESS; payload: number };
