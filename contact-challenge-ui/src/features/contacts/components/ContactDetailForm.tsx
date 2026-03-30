import { Trash2 } from "lucide-react";
import { Address, Phone } from "../../../types/types";

export interface ContactDetailFormProps {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phoneNumbers: Phone[];
  addresses: Address[];
  onFieldChange: (field: string, value: any) => void;
  onPhoneChange: (id: number, field: keyof Phone, value: string) => void;
  onAddPhone: () => void;
  onRemovePhone: (id: number) => void;
  onAddressChange: (
    id: number,
    field: keyof Omit<Address, "id">,
    value: string,
  ) => void;
  onAddAddress: () => void;
  onRemoveAddress: (id: number) => void;
  onCancel: () => void;
  onSave: () => void;
  isEditing: boolean;
  pageLoading: boolean;
  fieldErrors: Record<string, string>;
  errorMessage?: string | null;
  snackbarOpen: boolean;
  onCloseSnackbar: () => void;
}

export function ContactDetailForm({
  firstName,
  lastName,
  email,
  dateOfBirth,
  phoneNumbers,
  addresses,
  onFieldChange,
  onPhoneChange,
  onAddPhone,
  onRemovePhone,
  onAddressChange,
  onAddAddress,
  onRemoveAddress,
  onCancel,
  onSave,
  isEditing,
  pageLoading,
  fieldErrors,
  errorMessage,
  snackbarOpen,
  onCloseSnackbar,
}: ContactDetailFormProps) {
  if (pageLoading) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <p>Loading contact...</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto py-10 px-4">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onCancel}
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back
          </button>

          <div>
            <h1 className="text-xl font-bold">
              {isEditing ? "Edit Contact" : "Create Contact"}
            </h1>
            <p className="text-sm text-gray-500">
              {isEditing
                ? "Edit the contact details below"
                : "Add a new contact"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="p-4 border-b font-medium">Basic Information</div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="First Name *"
                  value={firstName}
                  onChange={(e) => onFieldChange("firstName", e.target.value)}
                  className="border rounded-md p-2 w-full"
                />
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-xs">
                    {fieldErrors.firstName}
                  </p>
                )}

                <input
                  placeholder="Last Name *"
                  value={lastName}
                  onChange={(e) => onFieldChange("lastName", e.target.value)}
                  className="border rounded-md p-2 w-full"
                />
                {fieldErrors.lastName && (
                  <p className="text-red-500 text-xs">{fieldErrors.lastName}</p>
                )}
              </div>

              <input
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => onFieldChange("email", e.target.value)}
                className="border rounded-md p-2 w-full"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs">{fieldErrors.email}</p>
              )}

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => onFieldChange("dateOfBirth", e.target.value)}
                className="border rounded-md p-2 w-full"
              />
              {fieldErrors.dateOfBirth && (
                <p className="text-red-500 text-xs">
                  {fieldErrors.dateOfBirth}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-medium">Phone Numbers</span>
              <button
                onClick={onAddPhone}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add Phone
              </button>
            </div>

            <div className="p-4 space-y-4">
              {phoneNumbers.map((phone) => (
                <div
                  key={phone.id}
                  className="flex flex-col md:flex-row gap-3 md:items-end"
                >
                  <input
                    placeholder="Number"
                    value={phone.number}
                    onChange={(e) =>
                      onPhoneChange(phone.id, "number", e.target.value)
                    }
                    className="border rounded-md p-2 w-full"
                  />

                  <select
                    value={(phone.phoneType as string) || "mobile"}
                    onChange={(e) =>
                      onPhoneChange(phone.id, "phoneType", e.target.value)
                    }
                    className="border rounded-md p-2 min-w-[140px]"
                  >
                    <option value="mobile">Mobile</option>
                    <option value="work">Work</option>
                    <option value="home">Home</option>
                  </select>

                  <button
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                    onClick={() => onRemovePhone(phone.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-medium">Addresses</span>
              <button
                onClick={onAddAddress}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add Address
              </button>
            </div>

            <div className="p-4 space-y-6">
              {addresses.map((address, index) => (
                <div key={address.id}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">Address {index + 1}</p>

                    <button
                      className="text-red-600 text-sm hover:underline"
                      onClick={() => onRemoveAddress(address.id!)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      placeholder="Locality"
                      value={address.locality}
                      onChange={(e) =>
                        onAddressChange(address.id!, "locality", e.target.value)
                      }
                      className="border rounded-md p-2"
                    />

                    <input
                      placeholder="Street"
                      value={address.street}
                      onChange={(e) =>
                        onAddressChange(address.id!, "street", e.target.value)
                      }
                      className="border rounded-md p-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      placeholder="Number"
                      value={address.number ?? ""}
                      onChange={(e) =>
                        onAddressChange(address.id!, "number", e.target.value)
                      }
                      className="border rounded-md p-2"
                    />

                    <input
                      placeholder="Notes"
                      value={address.notes}
                      onChange={(e) =>
                        onAddressChange(address.id!, "notes", e.target.value)
                      }
                      className="border rounded-md p-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="border px-4 py-2 rounded-md text-sm"
            >
              Cancel
            </button>

            <button
              onClick={onSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
            >
              {isEditing ? "Save Changes" : "Create Contact"}
            </button>
          </div>
        </div>
      </div>

      {snackbarOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg">
          <div className="flex items-center gap-3">
            <span>{errorMessage}</span>
            <button onClick={onCloseSnackbar}>✖</button>
          </div>
        </div>
      )}
    </>
  );
}
