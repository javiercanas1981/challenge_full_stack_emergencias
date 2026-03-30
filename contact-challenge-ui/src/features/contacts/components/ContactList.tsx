import { Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { deleteContact as deleteContactAction } from "../../../redux/contacts/ContactsLoadAction";
import { AppDispatch } from "../../../redux/store/Store";

import { Contact } from "../../../types/types";

const useAppDispatch = () => useDispatch<AppDispatch>();

interface ContactListProps {
  contacts: Contact[];
}

export function ContactList({ contacts }: ContactListProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [localContacts, setLocalContacts] = useState<Contact[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  useEffect(() => {
    setLocalContacts(contacts);
  }, [contacts]);

  const handleEdit = (id: number) => {
    navigate(`/contacts/${id}/edit`);
  };

  const handleView = (id: number) => {
    navigate(`/activities/contact/${id}`);
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      await dispatch(deleteContactAction(contactToDelete.id));

      setLocalContacts((prev) =>
        prev.filter((c) => c.id !== contactToDelete.id),
      );
    } catch (error) {
      console.error("Error deleting contact", error);
    } finally {
      setShowDeleteDialog(false);
      setContactToDelete(null);
    }
  };

  return (
    <>
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">First Name</th>
                <th className="px-4 py-3 font-medium">Last Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Date of Birth</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {localContacts.length > 0 ? (
                localContacts.map((contact) => (
                  <tr key={contact.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{contact.firstName}</td>
                    <td className="px-4 py-3">{contact.lastName}</td>
                    <td className="px-4 py-3 text-gray-500">{contact.email}</td>
                    <td className="px-4 py-3">{contact.dateOfBirth}</td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        onClick={() => handleView(contact.id)}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                        onClick={() => handleEdit(contact.id)}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        onClick={() => handleDeleteClick(contact)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm">
            <div className="p-4 border-b font-medium">Delete Contact</div>

            <div className="p-4 text-sm text-gray-600">
              ¿Seguro que quieres eliminar{" "}
              <strong>
                {contactToDelete?.firstName} {contactToDelete?.lastName}
              </strong>
              ? Esta acción no se puede deshacer.
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="border px-4 py-2 rounded-md text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
