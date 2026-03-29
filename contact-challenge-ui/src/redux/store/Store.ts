import {
  AnyAction,
  Store,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";

import {
  ActivitiesReducer,
  IActivitiesState,
} from "../activities/ActivitiesReducer";
import {
  ActivtiesTableReducer,
  IActivitiesTableState,
} from "../activities/ActivtiesTableReducer";
import {
  ISelectedActivitiesState,
  SelectActivtiesReducer,
} from "../activities/SelectActivtiesReducer";
import { ContactsReducer, IContactsState } from "../contacts/ContactsReducer";
import {
  ContactsTableReducer,
  IContactsTableState,
} from "../contacts/ContactsTableReducer";
import {
  ISelectedContactsState,
  SelectContactsReducer,
} from "../contacts/SelectContactsReducer";

export interface IApplicationState {
  ActivitiesState: IActivitiesState;
  ActivitiesTableState: IActivitiesTableState;
  SelectedActivitiesState: ISelectedActivitiesState;
  ContactsState: IContactsState;
  ContactsTableState: IContactsTableState;
  SelectedContactsState: ISelectedContactsState;
}

export type AppDispatch = ThunkDispatch<IApplicationState, unknown, AnyAction>;

const rootReducer = combineReducers<IApplicationState>({
  ActivitiesState: ActivitiesReducer,
  ActivitiesTableState: ActivtiesTableReducer,
  SelectedActivitiesState: SelectActivtiesReducer,
  ContactsState: ContactsReducer,
  ContactsTableState: ContactsTableReducer,
  SelectedContactsState: SelectContactsReducer,
});

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(): Store<IApplicationState> {
  return createStore(
    rootReducer,
    undefined,
    composeEnhancers(applyMiddleware(thunk)),
  );
}
