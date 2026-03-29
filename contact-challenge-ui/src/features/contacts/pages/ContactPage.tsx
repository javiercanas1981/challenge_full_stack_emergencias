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
  const error = allContactsError || searchResultsError;

  if (error) return <div style={{ color: "red" }}>{error}</div>; // Combined error state

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
