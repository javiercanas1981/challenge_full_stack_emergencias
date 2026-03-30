import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { searchActivities } from "../../../redux/activities/ActivtiesTableActions";
import { fetchAllContacts } from "../../../redux/contacts/ContactsLoadAction";
import { AppDispatch, IApplicationState } from "../../../redux/store/Store";

import { ContactWithActivities } from "../../../types/types";

import { ActivitiesList } from "../components/ActivitiesList";

import { useDispatch } from "react-redux";
const useAppDispatch = () => useDispatch<AppDispatch>();

export default function ActivitiesPage(): React.ReactElement {
  const dispatch = useAppDispatch();

  const { contacts, loading: contactsLoading } = useSelector(
    (state: IApplicationState) => state.ContactsState,
  );

  const { searchResults: activities, loading: activitiesLoading } = useSelector(
    (state: IApplicationState) => state.ActivitiesTableState,
  );

  useEffect(() => {
    dispatch(fetchAllContacts());
    dispatch(searchActivities({}));
  }, [dispatch]);

  const contactsWithActivities: ContactWithActivities[] = useMemo(() => {
    if (!contacts) return [];

    return contacts.map((contact) => ({
      ...contact,
      activities: Array.isArray(activities)
        ? activities.filter((act: any) => {
            if (!act) return false;
            const activityContactId = act.personId || act.contactId;
            return String(activityContactId) === String(contact.id);
          })
        : [],
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
