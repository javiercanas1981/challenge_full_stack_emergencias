import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import ActivitiesPage from "../../features/activities/pages/ActivitiesPage";
import ActivityContactDetailPage from "../../features/contacts/pages/ActivityContactDetailPage";
import { ContactDetailPage } from "../../features/contacts/pages/ContactDetailPage";
import { ContactPage } from "../../features/contacts/pages/ContactPage";
import { LayoutPage } from "../../features/layout/pages/LayoutPage";
import { NotFound as NotFoundPage } from "../../features/layout/pages/NotFound";

type AppRouterProps = {
  setActiveNav: React.Dispatch<React.SetStateAction<string>>;
};

export default function AppRouter({ setActiveNav }: AppRouterProps) {
  return (
    <BrowserRouter>
      <RoutesWrapper setActiveNav={setActiveNav} />
    </BrowserRouter>
  );
}

function RoutesWrapper({ setActiveNav }: AppRouterProps) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/contacts")) {
      setActiveNav("contacts");
    } else if (location.pathname.startsWith("/activities")) {
      setActiveNav("activities");
    } else {
      setActiveNav("");
    }
  }, [location.pathname, setActiveNav]);

  return (
    <Routes>
      <Route element={<LayoutPage />}>
        <Route index element={<ContactPage />} />
        <Route path="contacts/new" element={<ContactDetailPage isNew />} />
        <Route path="contacts/:id" element={<ContactDetailPage />} />
        <Route
          path="activities/contact/:id"
          element={<ActivityContactDetailPage />}
        />
        <Route
          path="contacts/:id/edit"
          element={<ContactDetailPage isEditing />}
        />

        <Route path="activities" element={<ActivitiesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
