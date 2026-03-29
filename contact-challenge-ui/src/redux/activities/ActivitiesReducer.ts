import { ContactActivity } from "../../types/types";
import { ActivitiesAction, ActivitiesActionTypes } from "./ActivitiesTypes";

export interface IActivitiesState {
  activities: ContactActivity[];
  loading: boolean;
  error: string | null;
}

const initialState: IActivitiesState = {
  activities: [],
  loading: false,
  error: null,
};

export const ActivitiesReducer = (
  state = initialState,
  action: ActivitiesAction,
): IActivitiesState => {
  switch (action.type) {
    case ActivitiesActionTypes.LOADING:
      return { ...state, loading: true, error: null };
    case ActivitiesActionTypes.FETCH_SUCCESS:
      return { ...state, loading: false, activities: action.payload };
    case ActivitiesActionTypes.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ActivitiesActionTypes.ADD_SUCCESS:
      return { ...state, activities: [...state.activities, action.payload] };
    case ActivitiesActionTypes.DELETE_SUCCESS:
      return {
        ...state,
        activities: state.activities.filter((a) => a.id !== action.payload),
      };
    default:
      return state;
  }
};
