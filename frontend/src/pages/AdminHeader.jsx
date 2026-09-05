import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiHome,
  FiFileText,
  FiUsers,
  FiMail,
  FiLogOut,
  FiChevronDown,
  FiPlus,
  FiList,
  FiClock,
  FiCheckCircle,
  FiZap,
  FiStar,
  FiUserPlus,
} from "react-icons/fi";

const AdminHeader = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [employeesOpen, setEmployeesOpen] = useState(false);

  const navigate = useNavigate();

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");

    navigate("/admin/login");
  };

  // =========================
  // DESKTOP NAV CLASS
  // =========================
  const navClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-red-50 text-[#b91c1c]"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  // =========================
  // MOBILE NAV CLASS
  // =========================
  const mobileNavClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-red-50 text-[#b91c1c]"
        : "text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <>
      {/* =====================================================
          ADMIN HEADER
      ====================================================== */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* =================================================
                LOGO
            ================================================= */}
            <Link
              to="/admin"
              className="flex shrink-0 items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b91c1c] text-lg font-black text-white shadow-md shadow-red-900/20">
                A
              </div>

              <div className="hidden sm:block">
                <div className="text-lg font-black leading-none tracking-tight text-gray-900">
                  AVS NEWS
                  <span className="text-[#b91c1c]"> DIGITAL</span>
                </div>

                <div className="mt-1 text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Admin Panel
                </div>
              </div>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}
            <nav className="hidden items-center gap-1 lg:flex">

              {/* CONTACTS */}
              <NavLink
                to="/admin/contacts"
                end
                className={navClass}
              >
                <FiMail size={17} />
                Contacts
              </NavLink>

              {/* =================================================
                  NEWS DROPDOWN
              ================================================= */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNewsOpen(!newsOpen);
                    setEmployeesOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    newsOpen
                      ? "bg-red-50 text-[#b91c1c]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FiFileText size={17} />

                  News

                  <FiChevronDown
                    size={15}
                    className={`transition-transform ${
                      newsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {newsOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl">

                    {/* ALL NEWS */}
                    <NavLink
                      to="/admin/news"
                      end
                      className={navClass}
                      onClick={() => setNewsOpen(false)}
                    >
                      <FiList size={16} />
                      All News
                    </NavLink>

                    {/* CREATE NEWS */}
                    <NavLink
                      to="/admin/news/create"
                      className={navClass}
                      onClick={() => setNewsOpen(false)}
                    >
                      <FiPlus size={16} />
                      Create News
                    </NavLink>

                  </div>
                )}
              </div>

              {/* =================================================
                  EMPLOYEES DROPDOWN
              ================================================= */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setEmployeesOpen(!employeesOpen);
                    setNewsOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    employeesOpen
                      ? "bg-red-50 text-[#b91c1c]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FiUsers size={17} />

                  Employees

                  <FiChevronDown
                    size={15}
                    className={`transition-transform ${
                      employeesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {employeesOpen && (
                  <div className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl">

                    {/* ALL EMPLOYEES */}
                    <NavLink
                      to="/admin/employees"
                      end
                      className={navClass}
                      onClick={() => setEmployeesOpen(false)}
                    >
                      <FiUsers size={16} />
                      All Employees
                    </NavLink>

                    {/* ADD EMPLOYEE */}
                    <NavLink
                      to="/admin/employees/add"
                      className={navClass}
                      onClick={() => setEmployeesOpen(false)}
                    >
                      <FiUserPlus size={16} />
                      Add Employee
                    </NavLink>
                  </div>
                )}
              </div>
            </nav>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}
            <div className="flex items-center gap-2">

              {/* VIEW WEBSITE */}
              <Link
                to="/"
                target="_blank"
                className="hidden rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c] md:block"
              >
                वेबसाइट देखें
              </Link>

              {/* ADMIN PROFILE */}
              <div className="hidden items-center gap-3 border-l border-gray-200 pl-4 md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-sm font-black text-[#b91c1c]">
                  A
                </div>

                <div className="hidden xl:block">
                  <p className="text-xs font-black text-gray-900">
                    Administrator
                  </p>

                  <p className="text-[10px] text-gray-400">
                    Admin
                  </p>
                </div>
              </div>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="hidden h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-[#b91c1c] md:flex"
                title="Logout"
                aria-label="Logout"
              >
                <FiLogOut size={18} />
              </button>

              {/* MOBILE MENU BUTTON */}
              <button
                type="button"
                onClick={() => setMobileMenu(!mobileMenu)}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition hover:bg-gray-200 lg:hidden"
                aria-label="Admin Menu"
              >
                {mobileMenu ? (
                  <FiX size={21} />
                ) : (
                  <FiMenu size={21} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}
        {mobileMenu && (
          <div className="border-t border-gray-100 bg-white lg:hidden">
            <div className="mx-auto max-w-[1600px] space-y-2 px-4 py-4 sm:px-6">

              {/* CONTACTS */}
              <NavLink
                to="/admin/contacts"
                end
                className={mobileNavClass}
                onClick={() => setMobileMenu(false)}
              >
                <FiMail size={18} />
                Contacts
              </NavLink>

              {/* =================================================
                  NEWS MANAGEMENT
              ================================================= */}
              <div className="rounded-xl bg-gray-50 p-2">

                <div className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-gray-400">
                  <FiFileText size={16} />
                  News Management
                </div>

                {/* ALL NEWS */}
                <NavLink
                  to="/admin/news"
                  end
                  className={mobileNavClass}
                  onClick={() => setMobileMenu(false)}
                >
                  <FiList size={18} />
                  All News
                </NavLink>

                {/* CREATE NEWS */}
                <NavLink
                  to="/admin/news/create"
                  className={mobileNavClass}
                  onClick={() => setMobileMenu(false)}
                >
                  <FiPlus size={18} />
                  Create News
                </NavLink>

              </div>

              {/* =================================================
                  EMPLOYEE MANAGEMENT
              ================================================= */}
              <div className="rounded-xl bg-gray-50 p-2">

                <div className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wider text-gray-400">
                  <FiUsers size={16} />
                  Employee Management
                </div>

                {/* ALL EMPLOYEES */}
                <NavLink
                  to="/admin/employees"
                  end
                  className={mobileNavClass}
                  onClick={() => setMobileMenu(false)}
                >
                  <FiUsers size={18} />
                  All Employees
                </NavLink>

                {/* ADD EMPLOYEE */}
                <NavLink
                  to="/admin/employees/add"
                  className={mobileNavClass}
                  onClick={() => setMobileMenu(false)}
                >
                  <FiUserPlus size={18} />
                  Add Employee
                </NavLink>
              </div>

             

              {/* =================================================
                  WEBSITE
              ================================================= */}
              <Link
                to="/"
                target="_blank"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <FiHome size={18} />
                वेबसाइट देखें
              </Link>

              {/* =================================================
                  LOGOUT
              ================================================= */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenu(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-bold text-[#b91c1c] transition hover:bg-red-100"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default AdminHeader;

