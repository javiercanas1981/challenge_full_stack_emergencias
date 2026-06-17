import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllContacts } from "../../../redux/contacts/ContactsLoadAction";
import { searchContacts as searchContactsAction } from "../../../redux/contacts/ContactsTableActions";
import { AppDispatch, IApplicationState } from "../../../redux/store/Store";
import { PersonSearchCriteria } from "../../../types/types";
import { ContactFilters } from "../components/ContactFilters";
import { ContactList } from "../components/ContactList";

const useAppDispatch = () => useDispatch<AppDispatch>();

export const ContactPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    contacts,
    loading: allContactsLoading,
    error: allContactsError,
  } = useSelector((state: IApplicationState) => state.ContactsState);
  const {
    searchResults,
    loading: searchResultsLoading,
    error: searchResultsError,
  } = useSelector((state: IApplicationState) => state.ContactsTableState);
  const [searchQuery, setSearchQuery] = useState("");
  const [phoneTypeFilter, setPhoneTypeFilter] = useState("all");

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!searchQuery && phoneTypeFilter === "all") {
        dispatch(fetchAllContacts());
        return;
      }

      const criteria: PersonSearchCriteria = {};

      if (phoneTypeFilter !== "all") {
        criteria.phoneType = phoneTypeFilter;
      }

      if (searchQuery) {
        if (searchQuery.includes("@")) {
          criteria.email = searchQuery;
        } else if (/^\d+$/.test(searchQuery)) {
          criteria.phoneNumber = searchQuery;
        } else {
          criteria.firstName = searchQuery;
        }
      }

      dispatch(searchContactsAction(criteria));
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, phoneTypeFilter, dispatch]);

  const displayContacts =
    searchQuery || phoneTypeFilter !== "all" ? searchResults : contacts;
  const loading = allContactsLoading || searchResultsLoading;
  // Cast a any para permitir el acceso a propiedades de objeto en caso de que el error no sea solo un string
  const error = (allContactsError || searchResultsError) as any;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 m-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="font-bold">
          {typeof error === "string" ? error : error.message || "Error"}
        </p>
        {error.errors && Array.isArray(error.errors) && (
          <ul className="mt-2 list-disc list-inside text-sm">
            {error.errors.map((err: any, idx: number) => (
              <li key={idx}>
                <span className="font-semibold">{err.path}:</span> {err.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <>
      <ContactFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        phoneTypeFilter={phoneTypeFilter}
        setPhoneTypeFilter={setPhoneTypeFilter}
        onCreateContact={() => navigate("/contacts/new")}
      />
      {loading ? (
        <div className="py-10 text-center">
          <p className="text-gray-500 animate-pulse">Loading contacts...</p>
        </div>
      ) : (
        <ContactList contacts={displayContacts} />
      )}
    </>
  );
};
