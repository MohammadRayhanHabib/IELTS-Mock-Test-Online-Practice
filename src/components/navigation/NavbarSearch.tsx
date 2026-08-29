import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface NavbarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const NavbarSearch: React.FC<NavbarSearchProps> = ({ value, onChange }) => (
  <div
    data-testid="dashboard-search"
    className="relative min-w-0 flex-1 sm:max-w-[270px] min-[880px]:w-[270px] min-[880px]:flex-none"
  >
    <FiSearch
      aria-hidden="true"
      className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9a9295]"
    />
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search"
      aria-label="Search"
      className="h-[25px] w-full appearance-none rounded-full border-0 bg-white pl-8 pr-8 text-[12px] text-[#352e31] outline-none placeholder:text-[#9a9295] focus:ring-2 focus:ring-[#f47b97]/45 [&::-webkit-search-cancel-button]:hidden"
    />
    <button
      type="button"
      onClick={() => onChange("")}
      aria-label="Clear search"
      className="absolute right-1.5 top-1/2 flex h-[14px] w-[14px] -translate-y-1/2 items-center justify-center rounded-full bg-[#b8464b] text-white transition-colors hover:bg-[#9e353b] focus:outline-none focus:ring-2 focus:ring-white"
    >
      <FiX aria-hidden="true" className="h-2.5 w-2.5 stroke-[3]" />
    </button>
  </div>
);

export default NavbarSearch;
