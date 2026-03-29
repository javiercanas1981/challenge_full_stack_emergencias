import React, { useState } from "react";
import {
  ActivityType,
  ContactWithActivities,
  CreateActivityDTO,
} from "../../../types/types";

interface ActivityContactDetailProps {
  contact: ContactWithActivities;
  onBack: () => void;
  onEdit: () => void;
  onAddActivity: (activity: CreateActivityDTO) => void;
}

export const ActivityContactDetail: React.FC<ActivityContactDetailProps> = ({
  contact,
  onBack,
  onEdit,
  onAddActivity,
}) => {
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>(
    ActivityType.CALL,
  );
  const [activityDate, setActivityDate] = useState("");
  const [activityDescription, setActivityDescription] = useState("");

  const activityTypeOptions: ActivityType[] = [
    ActivityType.CALL,
    ActivityType.MEETING,
    ActivityType.EMAIL,
  ];

  const handleAddActivity = () => {
    onAddActivity({
      personId: contact.id,
      activityType,
      activityDate,
      description: activityDescription,
    });

    setIsAddActivityOpen(false);
    setActivityType(ActivityType.CALL);
    setActivityDate("");
    setActivityDescription("");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatActivityType = (type: ActivityType) =>
    type.charAt(0).toUpperCase() + type.slice(1);

  const getChipColor = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CALL:
        return "bg-purple-100 text-purple-700";
      case ActivityType.MEETING:
        return "bg-blue-100 text-blue-700";
      case ActivityType.EMAIL:
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-gray-600 hover:underline"
      >
        ← Back to Contacts
      </button>

      <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-semibold">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="text-sm text-gray-500">{contact.email}</p>
        </div>

        <button
          onClick={onEdit}
          className="border px-4 py-2 rounded-md text-sm hover:bg-gray-100"
        >
          Edit Contact
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="p-4 border-b font-medium">Personal Information</div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{contact.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{formatDate(contact.dateOfBirth)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm">
            <div className="p-4 border-b font-medium">Phone Numbers</div>
            <div className="p-4 space-y-3">
              {(contact.phones || []).map((phone) => (
                <div key={phone.id}>
                  <p className="text-sm text-gray-500 capitalize">
                    {typeof phone.phoneType === "object"
                      ? phone.phoneType.typeName
                      : phone.phoneType}
                  </p>
                  <p>📞 {phone.number}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm">
            <div className="p-4 border-b font-medium">Addresses</div>
            <div className="p-4 space-y-3">
              {(contact.addresses || []).map((addr, i) => (
                <div key={i} className="flex gap-2">
                  <span>📍</span>
                  <div>
                    <p>
                      {addr.street} {addr.number || ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      {addr.locality}
                      {addr.notes ? ` · ${addr.notes}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-medium">Activities</span>
              <button
                onClick={() => setIsAddActivityOpen(true)}
                className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:opacity-90"
              >
                + Add Activity
              </button>
            </div>

            <div className="p-4">
              {(contact.activities || []).length === 0 ? (
                <p className="text-center text-gray-500 py-6">
                  No activities yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {(contact.activities ?? []).map((act) => (
                    <div key={act.id} className="border rounded-lg p-3">
                      <div className="flex gap-2 mb-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getChipColor(
                            act.activityType,
                          )}`}
                        >
                          {formatActivityType(act.activityType)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(act.activityDate)}
                        </span>
                      </div>
                      <p className="text-sm">{act.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isAddActivityOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg">
            <div className="p-4 border-b font-medium">Add Activity</div>

            <div className="p-4 space-y-4">
              <select
                value={activityType}
                onChange={(e) =>
                  setActivityType(e.target.value as ActivityType)
                }
                className="w-full border rounded-md p-2"
              >
                {activityTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {formatActivityType(type)}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full border rounded-md p-2"
              />

              <textarea
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
                rows={4}
                className="w-full border rounded-md p-2"
                placeholder="Description"
              />
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setIsAddActivityOpen(false)}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleAddActivity}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
