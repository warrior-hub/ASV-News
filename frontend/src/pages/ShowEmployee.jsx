import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/employees";

const ShowEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ============================================
  // FETCH EMPLOYEE
  // ============================================

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/${id}`
        );

        console.log(
          "Employee details:",
          response.data
        );

        const data = response.data;

        setEmployee(
          data.employee ||
            data.data ||
            data
        );
      } catch (err) {
        console.error(
          "Fetch employee error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load employee details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  // ============================================
  // DELETE EMPLOYEE
  // ============================================

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await axios.delete(
        `${API_URL}/${id}`
      );

      navigate("/employees");
    } catch (err) {
      console.error(
        "Delete employee error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to delete employee."
      );

      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ============================================
  // HELPERS
  // ============================================

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatShortDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getInitials = (name = "") => {
    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!words.length) return "EM";

    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          <div className="mb-6 h-5 w-52 animate-pulse rounded bg-slate-200" />

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="h-52 animate-pulse bg-slate-200" />

            <div className="p-6">
              <div className="h-7 w-56 animate-pulse rounded bg-slate-200" />

              <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-100" />

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-28 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">

          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
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
                  d="M12 9v4m0 4h.01M5.07 19h13.86a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16a2 2 0 001.73 3z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Employee Not Found
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error ||
                "The employee you're looking for does not exist or has been removed."}
            </p>

            <Link
              to="/employees"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>

              Back to Employees
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ========================================
            BREADCRUMB
        ======================================== */}

        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link
            to="/employees"
            className="transition hover:text-blue-600"
          >
            Employees
          </Link>

          <span>/</span>

          <span className="text-slate-700">
            Employee Details
          </span>
        </div>

        {/* ========================================
            ERROR ALERT
        ======================================== */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ========================================
            PROFILE HERO
        ======================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Cover */}

          <div className="relative h-40 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 sm:h-48">

            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[40px] border-white" />
              <div className="absolute -bottom-32 left-20 h-72 w-72 rounded-full border-[50px] border-white" />
            </div>

            <Link
              to="/employees"
              className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>

              Back
            </Link>
          </div>

          {/* Profile Content */}

          <div className="relative px-5 pb-6 sm:px-8">

            <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 md:flex-row md:items-end md:justify-between">

              {/* Left */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                {/* Profile image */}

                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-blue-50 shadow-lg">
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
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-blue-600">
                      {getInitials(
                        employee.name
                      )}
                    </div>
                  )}
                </div>

                {/* Name */}

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                      {employee.name}
                    </h1>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        employee.status ===
                        "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          employee.status ===
                          "active"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />

                      {employee.status ===
                      "active"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {employee.designation}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Employee ID:{" "}
                    <span className="font-semibold text-slate-600">
                      {employee.employeeId}
                    </span>
                  </p>
                </div>
              </div>

              {/* Actions */}

              <div className="flex gap-2 pb-1">

                <Link
                  to={`/employees/edit/${employee._id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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

                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteModal(true)
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
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

                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            QUICK CONTACT
        ======================================== */}

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Email */}

          <a
            href={`mailto:${employee.email}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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
                    d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-700 group-hover:text-blue-600">
                  {employee.email}
                </p>
              </div>
            </div>
          </a>

          {/* Phone */}

          <a
            href={`tel:${employee.phone}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
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
                    d="M3 5a2 2 0 012-2h3l2 5-2 1.5a16 16 0 006.5 6.5L16 14l5 2v3a2 2 0 01-2 2C10.27 21 3 13.73 3 5z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700 group-hover:text-emerald-600">
                  {employee.phone}
                </p>
              </div>
            </div>
          </a>

          {/* Location */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
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
                    d="M12 21s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z"
                  />

                  <circle
                    cx="12"
                    cy="10"
                    r="2.5"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {employee.city || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            DETAILS GRID
        ======================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* ======================================
              PERSONAL INFORMATION
          ====================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">

            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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

                <div>
                  <h2 className="font-bold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Employee personal details
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2">

              <InfoItem
                label="Full Name"
                value={employee.name}
              />

              <InfoItem
                label="Employee ID"
                value={employee.employeeId}
              />

              <InfoItem
                label="Email Address"
                value={employee.email}
              />

              <InfoItem
                label="Phone Number"
                value={employee.phone}
              />

              <InfoItem
                label="Date of Birth"
                value={formatDate(
                  employee.dob
                )}
              />

              <InfoItem
                label="City"
                value={
                  employee.city ||
                  "Not specified"
                }
              />
            </div>
          </div>

          {/* ======================================
              EMPLOYMENT SUMMARY
          ====================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
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
                      d="M20 7h-5V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM9 7h6"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Employment
                  </h2>

                  <p className="text-xs text-slate-500">
                    Current work information
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">

              <InfoItem
                label="Designation"
                value={employee.designation}
              />

              <InfoItem
                label="Joining Date"
                value={formatDate(
                  employee.joiningDate
                )}
              />

              <InfoItem
                label="Status"
                custom={
                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      employee.status ===
                      "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        employee.status ===
                        "active"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />

                    {employee.status ===
                    "active"
                      ? "Active"
                      : "Inactive"}
                  </span>
                }
              />

              <InfoItem
                label="Record Created"
                value={formatShortDate(
                  employee.createdAt
                )}
              />
            </div>
          </div>
        </div>

        {/* ========================================
            ADDRESS
        ======================================== */}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
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
                    d="M12 21s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z"
                  />

                  <circle
                    cx="12"
                    cy="10"
                    r="2.5"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Address
                </h2>

                <p className="text-xs text-slate-500">
                  Employee residential information
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">

            <InfoItem
              label="City"
              value={
                employee.city ||
                "Not specified"
              }
            />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Complete Address
              </p>

              <p className="text-sm leading-6 text-slate-700">
                {employee.address ||
                  "No address provided"}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================
            FOOTER ACTIONS
        ======================================== */}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <Link
            to="/employees"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>

            Back to Employee Directory
          </Link>

          <p className="text-xs text-slate-400">
            Last updated{" "}
            {formatShortDate(
              employee.updatedAt
            )}
          </p>
        </div>
      </div>

      {/* ==========================================
          DELETE MODAL
      ========================================== */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

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
                <h3 className="text-lg font-bold text-slate-900">
                  Delete Employee?
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  You are about to permanently delete{" "}
                  <span className="font-semibold text-slate-700">
                    {employee.name}
                  </span>
                  . This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                disabled={deleteLoading}
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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

// ============================================
// INFO ITEM COMPONENT
// ============================================

const InfoItem = ({
  label,
  value,
  custom,
}) => {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      {custom ? (
        custom
      ) : (
        <p className="break-words text-sm font-medium text-slate-700">
          {value || "—"}
        </p>
      )}
    </div>
  );
};

export default ShowEmployee;

