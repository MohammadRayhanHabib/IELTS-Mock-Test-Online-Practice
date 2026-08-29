import React from "react";
import { FaBell, FaGear } from "react-icons/fa6";

interface NavbarActionsProps {
  profileInitial?: string;
  onProfileClick: () => void;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({
  profileInitial,
  onProfileClick,
}) => (
  <div className="ml-3 flex shrink-0 items-center gap-4 sm:ml-5 sm:gap-6 min-[880px]:ml-auto min-[880px]:gap-7">
    <button
      type="button"
      aria-label="Notifications"
      className="flex h-7 w-7 items-center justify-center text-[#ee0b46] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/80"
    >
      <FaBell aria-hidden="true" className="h-[18px] w-[18px]" />
    </button>
    <button
      type="button"
      aria-label="Profile settings"
      onClick={onProfileClick}
      className="hidden h-7 w-7 items-center justify-center text-[#ff7189] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/80 sm:flex"
    >
      <FaGear aria-hidden="true" className="h-[19px] w-[19px]" />
    </button>
    <button
      type="button"
      onClick={onProfileClick}
      aria-label="Open preview user profile"
      title="Preview profile"
      className="flex h-[30px] w-[30px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#f4a8b2] to-[#9d373f] text-[12px] font-bold text-white shadow-[0_2px_5px_rgba(56,21,24,0.25)] focus:outline-none focus:ring-2 focus:ring-white"
    >
      {profileInitial ?? "R"}
    </button>
  </div>
);

export default NavbarActions;
