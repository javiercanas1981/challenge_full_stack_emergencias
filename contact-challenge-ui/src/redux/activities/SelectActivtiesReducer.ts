import { ContactActivity } from "../../types/types";
import { SelectActivitiesActionTypes } from "./SelectActivtiesReducerTypes";

export interface ISelectedActivitiesState {
  selectedActivity: ContactActivity | null;
}

const initialState: ISelectedActivitiesState = {
  selectedActivity: null,
};

export const SelectActivtiesReducer = (
  state = initialState,
  action: any,
): ISelectedActivitiesState => {
  switch (action.type) {
    case SelectActivitiesActionTypes.SELECT:
      return { ...state, selectedActivity: action.payload };
    case SelectActivitiesActionTypes.CLEAR_SELECTION:
      return { ...state, selectedActivity: null };
    default:
      return state;
  }
};
