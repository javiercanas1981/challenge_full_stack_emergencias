import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  addContact,
  updateContact,
} from "../../../redux/contacts/ContactsLoadAction";
import { fetchContactById } from "../../../redux/contacts/SelectContactsActions";

import { AppDispatch, IApplicationState } from "../../../redux/store/Store";

import {
  Address,
  CreatePersonDTO,
  Phone,
  UpdatePersonDTO,
} from "../../../types/types";

import { ContactDetailForm } from "../components/ContactDetailForm";

const useAppDispatch = () => useDispatch<AppDispatch>();

interface ContactDetailProps {
  isEditing?: boolean;
  isNew?: boolean;
}

export function ContactDetailPage({ isEditing, isNew }: ContactDetailProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState<Phone[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const {
    selectedContact,
    loading: contactLoading,
    error: contactError,
  } = useSelector((state: IApplicationState) => state.SelectedContactsState);

  useEffect(() => {
    if (isNew) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setDateOfBirth("");
      setPhoneNumbers([
        { id: Date.now(), number: "", personId: 0, phoneType: "mobile" },
      ]);
      setAddresses([
        { id: Date.now(), personId: 0, street: "", locality: "", notes: "" },
      ]);
      setInitialized(true);
      return;
    }

    if (isEditing && id && !initialized) {
      setPageLoading(true);
      dispatch(fetchContactById(Number(id)));
    }
  }, [id, isEditing, isNew, initialized, dispatch]);

  useEffect(() => {
    if (isEditing && selectedContact && !contactLoading && !initialized) {
      setFirstName(selectedContact.firstName ?? "");
      setLastName(selectedContact.lastName ?? "");
      setEmail(selectedContact.email ?? "");
      setDateOfBirth(selectedContact.dateOfBirth?.split("T")[0] ?? "");

      setPhoneNumbers(
        selectedContact.phones?.map((phone) => ({
          id: phone.id,
          number: phone.number,
          personId: phone.personId,
          phoneType:
            typeof phone.phoneType === "object"
              ? phone.phoneType.typeName
              : (phone.phoneType ?? "mobile"),
        })) ?? [],
      );

      setAddresses(
        selectedContact.addresses?.map((addr) => ({
          id: addr.id,
          personId: addr.personId,
          street: addr.street ?? "",
          locality: addr.locality ?? "",
          number: addr.number,
          notes: addr.notes ?? "",
        })) ?? [],
      );

      setInitialized(true);
      setPageLoading(false);
    }

    if (contactLoading) setPageLoading(true);
    else setPageLoading(false);

    if (contactError) {
      setErrorMessage(contactError);
      setSnackbarOpen(true);
    } else if (!isNew && !selectedContact && initialized && !contactLoading) {
      navigate("/");
    }
  }, [
    selectedContact,
    contactLoading,
    contactError,
    isEditing,
    isNew,
    initialized,
    navigate,
  ]);

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "dateOfBirth":
        setDateOfBirth(value);
        break;
    }
  };

  const phoneTypeMap: Record<string, { id: number; typeName: string }> = {
    mobile: { id: 1, typeName: "mobile" },
    home: { id: 2, typeName: "home" },
    work: { id: 3, typeName: "work" },
  };

  const handleSave = async () => {
    const errors: Record<string, string> = {};

    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!dateOfBirth.trim()) errors.dateOfBirth = "Date of birth is required";

    if (Object.keys(errors).length > 0) {
      setErrorMessage(
        `Validation Errors: ${Object.values(errors).join(" | ")}`,
      );
      setSnackbarOpen(true);
      return;
    }

    const basePayload = {
      firstName,
      lastName,
      email,
      dateOfBirth,
      phones: phoneNumbers
        .filter((p) => p.number.trim() !== "")
        .map((p) => ({
          number: p.number,
          phoneType: phoneTypeMap[p.phoneType as string] || phoneTypeMap.mobile,
        })),
      addresses: addresses
        .filter((a) => a.street.trim() && a.locality.trim())
        .map((a) => ({
          ...(isEditing && a.id ? { id: a.id } : {}),
          street: a.street.trim(),
          locality: a.locality.trim(),
          number: a.number ?? 0,
          notes: a.notes ?? "",
        })),
    };

    try {
      if (isEditing && id) {
        const payload: UpdatePersonDTO = {
          id: Number(id),
          ...basePayload,
        };

        await dispatch(updateContact(Number(id), payload));
      } else {
        const payload: CreatePersonDTO = basePayload;

        await dispatch(addContact(payload));
      }

      navigate("/");
    } catch (error: unknown) {
      const err = error as { message?: string };
      setErrorMessage(err.message || "Error saving contact");
      setSnackbarOpen(true);
    }
  };

  return (
    <ContactDetailForm
      firstName={firstName}
      lastName={lastName}
      email={email}
      dateOfBirth={dateOfBirth}
      phoneNumbers={phoneNumbers}
      addresses={addresses}
      onFieldChange={handleFieldChange}
      onPhoneChange={(id, field, value: string) => {
        setPhoneNumbers((prev) =>
          prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
        );
      }}
      onAddPhone={() =>
        setPhoneNumbers((prev) => [
          ...prev,
          { id: Date.now(), number: "", personId: 0, phoneType: "mobile" },
        ])
      }
      onRemovePhone={(id) =>
        setPhoneNumbers((prev) => prev.filter((p) => p.id !== id))
      }
      onAddressChange={(id, field, value: string | number) =>
        setAddresses((prev) =>
          prev.map((a) =>
            a.id === id
              ? { ...a, [field]: field === "number" ? Number(value) : value }
              : a,
          ),
        )
      }
      onAddAddress={() =>
        setAddresses((prev) => [
          ...prev,
          { id: Date.now(), personId: 0, street: "", locality: "", notes: "" },
        ])
      }
      onRemoveAddress={(id) =>
        setAddresses((prev) => prev.filter((a) => a.id !== id))
      }
      onCancel={() => navigate("/")}
      onSave={handleSave}
      isEditing={!!isEditing}
      pageLoading={pageLoading}
      errorMessage={errorMessage}
      snackbarOpen={snackbarOpen}
      onCloseSnackbar={() => setSnackbarOpen(false)}
    />
  );
}
