interface ContactFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  phoneTypeFilter: string;
  setPhoneTypeFilter: (value: string) => void;
  onCreateContact: () => void;
}

export function ContactFilters({
  searchQuery,
  setSearchQuery,
  phoneTypeFilter,
  setPhoneTypeFilter,
  onCreateContact,
}: ContactFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4 items-stretch md:items-center">
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-md pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
            ✖
          </button>
        )}
      </div>

      <select
        value={phoneTypeFilter}
        onChange={(e) => setPhoneTypeFilter(e.target.value)}
        className="border rounded-md px-3 py-2 text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Phone Types</option>
        <option value="mobile">Mobile</option>
        <option value="work">Work</option>
        <option value="home">Home</option>
      </select>

      <button
        onClick={onCreateContact}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm whitespace-nowrap hover:opacity-90"
      >
        + Create Contact
      </button>
    </div>
  );
}
