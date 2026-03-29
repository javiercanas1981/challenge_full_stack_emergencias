import { fireEvent, render, screen } from "@testing-library/react";
import { ActivityType, ContactWithActivities } from "../../../types/types";
import { ActivitiesList } from "./ActivitiesList";

const mockContacts: ContactWithActivities[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    dateOfBirth: "1990-01-01",
    phones: [],
    addresses: [],
    activities: [
      {
        id: 101,
        activityType: ActivityType.CALL,
        description: "Call with client",
        activityDate: "2026-03-25T10:00:00Z",
        personId: 1,
      },
      {
        id: 102,
        activityType: ActivityType.MEETING,
        description: "Project meeting",
        activityDate: "2026-03-24T12:00:00Z",
        personId: 1,
      },
    ],
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    dateOfBirth: "1985-05-10",
    phones: [],
    addresses: [],
    activities: [
      {
        id: 201,
        activityType: ActivityType.EMAIL,
        description: "Send report",
        activityDate: "2026-03-23T09:30:00Z",
        personId: 2,
      },
    ],
  },
];

describe("ActivitiesList", () => {
  test("renders activities correctly", () => {
    render(<ActivitiesList contacts={mockContacts} />);
    expect(screen.getByText("Call with client")).toBeInTheDocument();
    expect(screen.getByText("Project meeting")).toBeInTheDocument();
    expect(screen.getByText("Send report")).toBeInTheDocument();
  });

  test("shows no activities message when filter excludes all", async () => {
    render(<ActivitiesList contacts={mockContacts} />);

    fireEvent.mouseDown(
      screen.getByRole("combobox", { name: /all contacts/i }),
    );
    fireEvent.click(await screen.findByRole("option", { name: "Jane Smith" }));

    fireEvent.mouseDown(screen.getByRole("combobox", { name: /all types/i }));
    fireEvent.click(await screen.findByRole("option", { name: /call/i }));

    expect(screen.getByText(/no activities found/i)).toBeInTheDocument();
  });

  test("filters activities by contact", async () => {
    render(<ActivitiesList contacts={mockContacts} />);
    const contactSelect = screen.getByRole("combobox", {
      name: /all contacts/i,
    });
    fireEvent.mouseDown(contactSelect);

    const option = await screen.findByRole("option", { name: "John Doe" });
    fireEvent.click(option);

    expect(screen.getByText("Call with client")).toBeInTheDocument();
    expect(screen.getByText("Project meeting")).toBeInTheDocument();
    expect(screen.queryByText("Send report")).not.toBeInTheDocument();
  });

  test("filters activities by type", async () => {
    render(<ActivitiesList contacts={mockContacts} />);

    const typeSelect = screen.getByRole("combobox", { name: /all types/i });
    fireEvent.mouseDown(typeSelect);

    const option = await screen.findByRole("option", { name: /call/i });
    fireEvent.click(option);

    expect(screen.getByText("Call with client")).toBeInTheDocument();
    expect(screen.queryByText("Project meeting")).not.toBeInTheDocument();
  });
});
