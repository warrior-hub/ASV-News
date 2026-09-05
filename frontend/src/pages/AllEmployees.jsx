import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "./AdminHeader";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/employees";

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);

  // Search & filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [designation, setDesignation] = useState("");
  const [city, setCity] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);

  // States
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState("");

  // Delete modal
  const [deleteEmployee, setDeleteEmployee] = useState(null);

  // ============================================
  // FETCH EMPLOYEES
  // ============================================

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      if (designation) {
        params.designation = designation;
      }

      if (city.trim()) {
        params.city = city.trim();
      }

      const response = await axios.get(API_URL, {
        params,
      });

      console.log("Employees response:", response.data);

      const data = response.data;

      const employeeList =
        data.employees ||
        data.data ||
        [];

      setEmployees(employeeList);

      if (data.totalPages) {
        setTotalPages(data.totalPages);
      } else if (data.pagination?.totalPages) {
        setTotalPages(data.pagination.totalPages);
      } else {
        setTotalPages(1);
      }

      if (data.totalEmployees !== undefined) {
        setTotalEmployees(data.totalEmployees);
      } else if (data.pagination?.total !== undefined) {
        setTotalEmployees(data.pagination.total);
      } else if (data.total !== undefined) {
        setTotalEmployees(data.total);
      } else {
        setTotalEmployees(employeeList.length);
      }
    } catch (err) {
      console.error("Fetch employees error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to load employees."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, designation, city]);

  // ============================================
  // INITIAL / FILTER FETCH
  // ============================================

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ============================================
  // SEARCH
  // ============================================

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // ============================================
  // FILTER CHANGE
  // ============================================

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
    setPage(1);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setPage(1);
  };

  // ============================================
  // CLEAR FILTERS
  // ============================================

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setDesignation("");
    setCity("");
    setPage(1);
  };

  const hasFilters =
    search ||
    status ||
    designation ||
    city;

  // ============================================
  // DELETE EMPLOYEE
  // ============================================

  const confirmDelete = async () => {
    if (!deleteEmployee?._id) return;

    try {
      setDeleteLoading(deleteEmployee._id);

      await axios.delete(
        `${API_URL}/${deleteEmployee._id}`
      );

      setDeleteEmployee(null);

      if (
        employees.length === 1 &&
        page > 1
      ) {
        setPage((prev) => prev - 1);
      } else {
        fetchEmployees();
      }
    } catch (err) {
      console.error("Delete employee error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete employee."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // ============================================
  // PAGINATION
  // ============================================

  const goToPage = (newPage) => {
    if (
      newPage < 1 ||
      newPage > totalPages
    ) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================
  // DATE FORMAT
  // ============================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ============================================
  // AVATAR
  // ============================================

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading && employees.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <div className="h-8 w-52 animate-pulse rounded-lg bg-slate-200" />
              <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-11 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ========================================
          GLOBAL HEADER
      ======================================== */}

      <Header />

      {/* ========================================
          PAGE CONTENT
      ======================================== */}

      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* PAGE HEADER */}

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <Link
                  to="/admin"
                  className="transition hover:text-[#b91c1c]"
                >
                  Dashboard
                </Link>

                <span>/</span>

                <span className="text-slate-700">
                  Employees
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                All Employees
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your news organization's employees
                and team members.
              </p>
            </div>

            <Link
              to="/admin/employees/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b91c1c] px-5 py-3 text-sm font-bold text-white shadow-sm shadow-red-900/20 transition hover:bg-[#991b1b] focus:outline-none focus:ring-4 focus:ring-red-100"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>

              Add Employee
            </Link>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-red-700">
              <div className="flex gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M10.29 3.86l-7.82 13.5A2 2 0 004.2 20h15.6a2 2 0 001.73-2.64l-7.82-13.5a2 2 0 00-3.46 0z"
                  />
                </svg>

                <div>
                  <p className="font-semibold">
                    Something went wrong
                  </p>

                  <p className="mt-0.5 text-sm">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-lg text-red-400 hover:text-red-700"
                aria-label="Close error"
              >
                ×
              </button>
            </div>
          )}

          {/* STATS */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Employees
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {totalEmployees}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* SHOWING */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Showing
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {employees.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* ACTIVE */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Active
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {employees.filter(
                      (employee) =>
                        employee.status === "active"
                    ).length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>

            {/* INACTIVE */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Inactive
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {employees.filter(
                      (employee) =>
                        employee.status === "inactive"
                    ).length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <span className="h-3 w-3 rounded-full bg-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CARD */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* FILTER HEADER */}

            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="mb-4">
                <h2 className="font-bold text-slate-900">
                  Employee Directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Search and filter employees
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">

                {/* SEARCH */}

                <div className="relative lg:col-span-2">
                  <svg
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                    />
                  </svg>

                  <input
                    type="search"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by name, ID, email or city..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                </div>

                {/* STATUS */}

                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                {/* DESIGNATION */}

                <select
                  value={designation}
                  onChange={handleDesignationChange}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
                >
                  <option value="">
                    All Designations
                  </option>

                  <option value="Reporter">
                    Reporter
                  </option>

                  <option value="News Anchor">
                    News Anchor
                  </option>

                  <option value="Content Writer">
                    Content Writer
                  </option>

                  <option value="Video Editor">
                    Video Editor
                  </option>

                  <option value="Photographer">
                    Photographer
                  </option>
                </select>
              </div>

              {/* CITY FILTER */}

              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={city}
                  onChange={handleCityChange}
                  placeholder="Filter by city..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50 sm:max-w-xs"
                />

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 6l12 12M6 18L18 6"
                      />
                    </svg>

                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Employee
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Employee ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Designation
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <tr
                        key={employee._id}
                        className="group transition hover:bg-red-50/30"
                      >
                        {/* EMPLOYEE */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-red-50">
                              {employee.profileImage ? (
                                <img
                                  src={employee.profileImage}
                                  alt={employee.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#b91c1c]">
                                  {getInitials(
                                    employee.name
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-900">
                                {employee.name}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                Joined{" "}
                                {formatDate(
                                  employee.joiningDate
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* EMPLOYEE ID */}

                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold uppercase text-[#b91c1c]">
                            {employee.employeeId || "—"}
                          </span>
                        </td>

                        {/* CONTACT */}

                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-slate-700">
                              {employee.email || "—"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {employee.phone || "—"}
                            </p>
                          </div>
                        </td>

                        {/* DESIGNATION */}

                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-700">
                            {employee.designation || "—"}
                          </span>
                        </td>

                        {/* LOCATION */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="h-4 w-4 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 21s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z"
                              />

                              <circle
                                cx="12"
                                cy="10"
                                r="2.5"
                                strokeWidth="2"
                              />
                            </svg>

                            <span className="text-sm text-slate-600">
                              {employee.city || "—"}
                            </span>
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              employee.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                employee.status === "active"
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            />

                            {employee.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">

                            {/* EDIT */}

                            <Link
                              to={`/admin/employees/edit/${employee._id}`}
                              title="Edit employee"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                                />
                              </svg>
                            </Link>

                            {/* DELETE */}

                            <button
                              type="button"
                              title="Delete employee"
                              onClick={() =>
                                setDeleteEmployee(employee)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 7h12M10 11v6m4-6v6M9 7V4h6v3m-8 0l1 14h8l1-14"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-16 text-center"
                      >
                        <div className="mx-auto max-w-sm">

                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#b91c1c]">
                            <svg
                              className="h-8 w-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-10a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0"
                              />
                            </svg>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900">
                            No employees found
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {hasFilters
                              ? "Try changing your search or filters."
                              : "Start by adding your first employee."}
                          </p>

                          {hasFilters ? (
                            <button
                              type="button"
                              onClick={clearFilters}
                              className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
                            >
                              Clear Filters
                            </button>
                          ) : (
                            <Link
                              to="/admin/employees/add"
                              className="mt-5 inline-flex rounded-xl bg-[#b91c1c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#991b1b]"
                            >
                              Add Employee
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            {employees.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                <p className="text-sm text-slate-500">
                  Page{" "}
                  <span className="font-bold text-slate-700">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-700">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-1.5">

                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                      goToPage(page - 1)
                    }
                    className="flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {Array.from(
                    {
                      length: Math.min(
                        totalPages,
                        5
                      ),
                    },
                    (_, index) => {
                      let pageNumber;

                      if (totalPages <= 5) {
                        pageNumber = index + 1;
                      } else if (page <= 3) {
                        pageNumber = index + 1;
                      } else if (
                        page >= totalPages - 2
                      ) {
                        pageNumber =
                          totalPages - 4 + index;
                      } else {
                        pageNumber =
                          page - 2 + index;
                      }

                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() =>
                            goToPage(pageNumber)
                          }
                          className={`hidden h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition sm:flex ${
                            page === pageNumber
                              ? "bg-[#b91c1c] text-white shadow-sm"
                              : "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}

                  <button
                    type="button"
                    disabled={
                      page === totalPages
                    }
                    onClick={() =>
                      goToPage(page + 1)
                    }
                    className="flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* DELETE MODAL */}

      {deleteEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleteLoading) {
              setDeleteEmployee(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v4m0 4h.01M5.07 19h13.86a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16a2 2 0 001.73 3z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Delete Employee?
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-slate-700">
                    {deleteEmployee.name}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                disabled={deleteLoading}
                onClick={() =>
                  setDeleteEmployee(null)
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={confirmDelete}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b91c1c] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#991b1b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>

                    Deleting...
                  </>
                ) : (
                  "Delete Employee"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEmployees;
