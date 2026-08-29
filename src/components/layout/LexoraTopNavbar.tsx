import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import LexoraBrand from "../navigation/LexoraBrand";
import NavbarActions from "../navigation/NavbarActions";
import NavbarSearch from "../navigation/NavbarSearch";

interface LexoraTopNavbarProps {
  title: string;
  onMenuClick?: () => void;
  homePath?: string;
  profilePath?: string;
  profileInitial?: string;
}

const LexoraTopNavbar: React.FC<LexoraTopNavbarProps> = ({
  title,
  onMenuClick,
  homePath = "/dashboard",
  profilePath = "/profile",
  profileInitial,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <header className="print:hidden sticky top-0 z-30 bg-[#fef7f7]">
      <div
        data-testid="dashboard-topbar"
        className="mx-auto flex h-[46px] w-[calc(100%-24px)] items-center rounded-b-[20px] bg-gradient-to-r from-[#f8e3e3] via-[#f5cece] to-[#f3bebe] px-4 shadow-[0_4px_7px_rgba(0,0,0,0.16)] md:w-[90%] md:pl-5 md:pr-7"
      >
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#5a3d42] transition-colors hover:bg-white/60 lg:hidden"
          >
            <FiMenu aria-hidden="true" className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate(homePath)}
          aria-label="Lexora Academy dashboard"
          className="flex w-[112px] shrink-0 items-center gap-1.5 text-[#d40f16] sm:w-[145px] min-[880px]:w-[196px]"
        >
          <LexoraBrand />
        </button>

        <h1 className="hidden w-[105px] shrink-0 text-[14px] font-bold tracking-[-0.02em] text-[#171117] sm:block min-[880px]:w-[139px]">
          {title}
        </h1>

        <NavbarSearch value={search} onChange={setSearch} />
        <NavbarActions
          profileInitial={profileInitial}
          onProfileClick={() => navigate(profilePath)}
        />
      </div>
    </header>
  );
};

export default LexoraTopNavbar;
