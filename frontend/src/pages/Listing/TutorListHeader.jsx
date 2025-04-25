import { SearchIcon, filterIcon } from "../../assets/icon";

export const TutorListHeader = ({
  searchTerm,
  handleSearchChange,
  showFilterDropdown,
  setShowFilterDropdown
}) => {
  return (
    <div className="flex items-center justify-between w-full relative">
      <h2 className="font-bold text-3xl text-gray-600 pl-4">Tutors</h2>
      <div className="flex flex-row justify-center items-center gap-5">
        <div className="relative">
          <div className="absolute -translate-y-1/2">
            {SearchIcon}
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="rounded-2xl h-10 w-72 bg-gray-100 pl-10 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Search"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="rounded-xl py-2 px-3 bg-gray-100 flex flex-row"
          >
            <div>{filterIcon}</div>
          </button>
        </div>
      </div>
    </div>
  );
};