import { ContactActivity } from "../../types/types";
import { SelectActivitiesActionTypes } from "./SelectActivtiesReducerTypes";

export const selectActivity = (activity: ContactActivity) => ({
  type: SelectActivitiesActionTypes.SELECT,
  payload: activity,
});

export const clearSelectedActivity = () => ({
  type: SelectActivitiesActionTypes.CLEAR_SELECTION,
});
