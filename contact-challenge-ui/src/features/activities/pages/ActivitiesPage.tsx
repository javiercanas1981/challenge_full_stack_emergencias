import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import { fetchAllActivities } from "../../../redux/activities/ActivitiesLoadAction";
import { fetchAllContacts } from "../../../redux/contacts/ContactsLoadAction";
import { AppDispatch, IApplicationState } from "../../../redux/store/Store";

import { ContactActivity, ContactWithActivities } from "../../../types/types";

import { ActivitiesList } from "../components/ActivitiesList";

import { useDispatch } from "react-redux";
const useAppDispatch = () => useDispatch<AppDispatch>();

export default function ActivitiesPage(): React.ReactElement {
  const dispatch = useAppDispatch();

  const { contacts, loading: contactsLoading } = useSelector(
    (state: IApplicationState) => state.ContactsState,
  );

  const { activities, loading: activitiesLoading } = useSelector(
    (state: IApplicationState) => state.ActivitiesState,
  );

  useEffect(() => {
    dispatch(fetchAllContacts());
    dispatch(fetchAllActivities());
  }, [dispatch]);

  const contactsWithActivities: ContactWithActivities[] = useMemo(() => {
    if (!contacts || !activities) return [];

    return contacts.map((contact) => ({
      ...contact,
      activities: activities.filter((act: ContactActivity) => {
        const activityContactId = act.personId || (act as any).contactId;
        return String(activityContactId) === String(contact.id);
      }),
    }));
  }, [contacts, activities]);

  if (contactsLoading || activitiesLoading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Cargando actividades...
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-4">All Activities</h1>
      <ActivitiesList contacts={contactsWithActivities} />
    </div>
  );
}
