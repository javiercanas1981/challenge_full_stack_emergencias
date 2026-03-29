import React, { useMemo, useState } from "react";
import { ActivityType, ContactWithActivities } from "../../../types/types";

interface ActivitiesListProps {
  contacts: ContactWithActivities[];
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({ contacts }) => {
  const [contactFilter, setContactFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const allActivities = useMemo(() => {
    return contacts
      .flatMap((contact) =>
        (contact.activities || []).map((activity) => ({
          ...activity,
          contactId: contact.id,
          contactName: `${contact.firstName} ${contact.lastName}`,
          contactEmail: contact.email,
          contactDOB: contact.dateOfBirth,
        })),
      )
      .sort(
        (a, b) =>
          new Date(b.activityDate).getTime() -
          new Date(a.activityDate).getTime(),
      );
  }, [contacts]);

  const filteredActivities = useMemo(() => {
    return allActivities.filter(
      (activity) =>
        (contactFilter === "all" ||
          activity.contactId.toString() === contactFilter) &&
        (typeFilter === "all" || activity.activityType === typeFilter),
    );
  }, [allActivities, contactFilter, typeFilter]);

  const getChipColor = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CALL:
        return "bg-blue-100 text-blue-700";
      case ActivityType.MEETING:
        return "bg-green-100 text-green-700";
      case ActivityType.EMAIL:
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="mb-4 p-4 bg-gray-50 border rounded-lg flex flex-wrap gap-3 items-center">
        <span className="text-sm text-gray-500">Filters:</span>

        <select
          value={contactFilter}
          onChange={(e) => setContactFilter(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm min-w-[200px]"
        >
          <option value="all">All Contacts</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id.toString()}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm min-w-[150px]"
        >
          <option value="all">All Types</option>
          <option value={ActivityType.CALL}>Call</option>
          <option value={ActivityType.MEETING}>Meeting</option>
          <option value={ActivityType.EMAIL}>Email</option>
        </select>
      </div>

      <div className="border rounded-lg bg-white divide-y shadow-sm">
        {filteredActivities.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No activities found.
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={`${activity.contactId}-${activity.id}`} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getChipColor(
                    activity.activityType as ActivityType,
                  )}`}
                >
                  {activity.activityType}
                </span>

                <span className="text-xs text-gray-500">
                  {formatDate(activity.activityDate)}
                </span>
              </div>

              <p className="text-sm font-medium mb-2">{activity.description}</p>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>
                  Contact:{" "}
                  <strong className="text-gray-700">
                    {activity.contactName}
                  </strong>
                </span>
                <span>
                  Email:{" "}
                  <strong className="text-gray-700">
                    {activity.contactEmail}
                  </strong>
                </span>
                <span>
                  DOB:{" "}
                  <strong className="text-gray-700">
                    {activity.contactDOB}
                  </strong>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
