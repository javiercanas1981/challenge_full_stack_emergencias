import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { addActivity } from "../../../redux/activities/ActivitiesLoadAction";
import { searchActivities } from "../../../redux/activities/ActivtiesTableActions";
import { fetchContactById } from "../../../redux/contacts/SelectContactsActions";
import { AppDispatch, IApplicationState } from "../../../redux/store/Store";

import { ContactWithActivities, CreateActivityDTO } from "../../../types/types";

import { ActivityContactDetail } from "../components/ActivityContactDetail";

import { useDispatch } from "react-redux";
const useAppDispatch = () => useDispatch<AppDispatch>();

export default function ActivityContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedContact, loading: contactLoading } = useSelector(
    (state: IApplicationState) => state.SelectedContactsState,
  );

  const { searchResults: activities, loading: activitiesLoading } = useSelector(
    (state: IApplicationState) => state.ActivitiesTableState,
  );

  useEffect(() => {
    if (id) {
      const contactId = Number(id);
      dispatch(fetchContactById(contactId));
      dispatch(searchActivities({ personId: contactId }));
    }
  }, [id, dispatch]);

  const handleBack = () => navigate("/");

  const handleEdit = () => navigate(`/contacts/${id}/edit`);

  const handleAddActivity = async (activity: CreateActivityDTO) => {
    if (!id) return;

    try {
      const activityWithContact = {
        ...activity,
        personId: Number(id),
      };

      await dispatch(addActivity(activityWithContact));
      dispatch(searchActivities({ personId: Number(id) }));
    } catch (error) {
      console.error("Error adding activity", error);
    }
  };

  if (contactLoading || activitiesLoading || !selectedContact) {
    return (
      <div className="p-10 text-center">
        <p>Loading data...</p>
      </div>
    );
  }

  const contactWithActivities: ContactWithActivities = {
    ...selectedContact,
    activities: activities,
  };

  return (
    <ActivityContactDetail
      contact={contactWithActivities}
      onBack={handleBack}
      onEdit={handleEdit}
      onAddActivity={handleAddActivity}
    />
  );
}
