import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FiBookOpen,
  FiCalendar,
  FiFileText,
  FiHome,
  FiShield,
  FiUser,
  FiVideo,
  FiX,
} from "react-icons/fi";
import LexoraTopNavbar from "./LexoraTopNavbar";

const IELTS_TYPES = [
  { label: "IELTS", sub: "Academic" },
  { label: "IELTS", sub: "General" },
  { label: "UKVI", sub: "Academic" },
  { label: "UKVI", sub: "General" },
];

const PREVIEW_HOME = "/client-preview/mock-tests";

const ClientPreviewMockLayout: React.FC = () => {
  const [ieltsType, setIeltsType] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = location.pathname.endsWith("/speaking/booking")
    ? "Speaking Booking"
    : location.pathname.includes("/subscription")
      ? "Subscription"
      : location.pathname.endsWith("/results")
        ? "Mock Test Result"
        : "Mock Tests";

  return (
    <div
      translate="no"
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      className="notranslate flex min-h-screen bg-[#fef2f2]"
    >
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 cursor-default bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        data-testid="client-preview-sidebar"
        className={`fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col bg-white shadow-sm transition-transform duration-300 lg:m-4 lg:h-[calc(100vh-32px)] lg:rounded-3xl ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 pb-5 pt-6">
          <Link
            to={PREVIEW_HOME}
            aria-label="Lexora Academy mock-test preview"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600">
              <span className="text-xs font-black text-white">LO</span>
            </div>
            <div className="leading-tight">
              <span className="block text-[11px] font-black uppercase tracking-widest text-primary-600">
                Lexora
              </span>
              <span className="block text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                Academy
              </span>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 pb-4">
          <p className="mb-2 px-1 text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
            Exam format
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {IELTS_TYPES.map((type, index) => (
              <button
                key={`${type.label}-${type.sub}`}
                type="button"
                onClick={() => setIeltsType(index)}
                className={`rounded-lg px-2 py-1.5 text-center transition-all ${
                  ieltsType === index
                    ? "bg-primary-50 ring-1 ring-primary-300"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`block text-[10px] font-bold ${
                    ieltsType === index ? "text-primary-600" : "text-gray-700"
                  }`}
                >
                  {type.label}
                </span>
                <span
                  className={`block text-[9px] ${
                    ieltsType === index ? "text-primary-400" : "text-gray-400"
                  }`}
                >
                  {type.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mx-5 mb-2 border-t border-gray-100" />

        <nav className="flex-1 space-y-1 px-3" aria-label="Client preview navigation">
          <PreviewNavItem icon={<FiHome />} label="Dashboard" />
          <Link
            to={PREVIEW_HOME}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-xl bg-primary-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm"
          >
            <FiFileText aria-hidden="true" className="shrink-0" />
            Mock Test
          </Link>
          <PreviewNavItem icon={<FiBookOpen />} label="Practice" />
          <PreviewNavItem icon={<FiVideo />} label="Courses" />
          <PreviewNavItem icon={<FiCalendar />} label="Schedule" />
          <PreviewNavItem icon={<FiUser />} label="Profile" />
          <PreviewNavItem icon={<FiShield />} label="Admin" />
        </nav>

        <Link
          to="/client-preview/subscription"
          onClick={() => setSidebarOpen(false)}
          aria-label="View Lexora subscription plans"
          className={`mx-4 mb-5 mt-3 block rounded-2xl p-4 text-center transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 ${
            location.pathname.includes("/subscription")
              ? "bg-[#8b2d2d] ring-2 ring-primary-300 ring-offset-2"
              : "bg-gradient-to-br from-[#c94444] to-[#8b2d2d]"
          }`}
        >
          <p className="mb-1 text-sm font-bold text-white">Upgrade your Plan</p>
          <p className="mb-3 text-[10px] leading-snug text-red-100">
            Explore our new features by subscribing our package
          </p>
          <span className="inline-block rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-[#9f3030]">
            Get Pro Now
          </span>
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:ml-[calc(240px+32px)]">
        <LexoraTopNavbar
          title={pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
          homePath={PREVIEW_HOME}
          profilePath={PREVIEW_HOME}
          profileInitial="R"
        />

        <main className="flex-1 bg-[#eef0f3] px-4 pb-8 pt-7 lg:px-7">
          <Outlet context={{ practiceExamVariant: IELTS_TYPES[ieltsType] }} />
        </main>
      </div>
    </div>
  );
};

const PreviewNavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
}> = ({ icon, label }) => (
  <button
    type="button"
    aria-disabled="true"
    className="flex w-full cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-500"
  >
    <span aria-hidden="true" className="shrink-0 text-gray-400">
      {icon}
    </span>
    {label}
  </button>
);

export default ClientPreviewMockLayout;
