import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import AdminHeader from "./AdminHeader";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/employees";

const initialFormData = {
  employeeId: "",
  name: "",
  email: "",
  phone: "",
  dob: "",
  designation: "",
  city: "",
  address: "",
  joiningDate: "",
  status: "active",
};

const AddEmployee = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);

  // Profile image states
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================
  // PROFILE IMAGE CHANGE
  // =========================
  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    // Allowed file types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");

      e.target.value = "";
      return;
    }

    // Revoke previous preview URL
    if (profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
    }

    setProfileImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);
  };

  // =========================
  // REMOVE PROFILE IMAGE
  // =========================
  const handleRemoveProfileImage = () => {
    if (profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
    }

    setProfileImageFile(null);
    setProfileImagePreview("");

    const input = document.getElementById("profileImage");
    if (input) {
      input.value = "";
    }

    setError("");
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.employeeId.trim()) {
      setError("Employee ID is required.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Employee name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!formData.dob) {
      setError("Date of birth is required.");
      return;
    }

    if (!formData.designation) {
      setError("Please select a designation.");
      return;
    }

    // Profile image required
    if (!profileImageFile) {
      setError("Please select a profile photo.");
      return;
    }

    try {
      setLoading(true);

      // =====================================
      // IMPORTANT:
      // Use FormData because we are uploading file
      // =====================================
      const data = new FormData();

      data.append(
        "employeeId",
        formData.employeeId.trim()
      );

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "email",
        formData.email.trim()
      );

      data.append(
        "phone",
        formData.phone.trim()
      );

      data.append("dob", formData.dob);

      data.append(
        "designation",
        formData.designation
      );

      data.append(
        "city",
        formData.city.trim()
      );

      data.append(
        "address",
        formData.address.trim()
      );

      if (formData.joiningDate) {
        data.append(
          "joiningDate",
          formData.joiningDate
        );
      }

      data.append("status", formData.status);

      // =====================================
      // IMAGE
      // Field name MUST match backend:
      // upload.single("profileImage")
      // =====================================
      data.append(
        "profileImage",
        profileImageFile
      );

      await axios.post(API_URL, data);

      setSuccess("Employee added successfully.");

      // Reset form
      setFormData(initialFormData);

      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }

      setProfileImageFile(null);
      setProfileImagePreview("");

      setTimeout(() => {
        navigate("/admin/employees");
      }, 1000);
    } catch (err) {
      console.error("Create employee error:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to add employee. Please try again.";

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESET
  // =========================
  const handleReset = () => {
    setFormData(initialFormData);

    if (profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
    }

    setProfileImageFile(null);
    setProfileImagePreview("");

    const input = document.getElementById("profileImage");

    if (input) {
      input.value = "";
    }

    setError("");
    setSuccess("");
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">

      {/* ================= ADMIN HEADER ================= */}
      <AdminHeader />

      {/* ================= MAIN ================= */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">

          {/* ================= PAGE HEADER ================= */}
          <div className="mb-7">

            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-sm">
              <Link
                to="/admin"
                className="font-medium text-gray-500 transition hover:text-[#b91c1c]"
              >
                Dashboard
              </Link>

              <span className="text-gray-300">/</span>

              <Link
                to="/admin/employees"
                className="font-medium text-gray-500 transition hover:text-[#b91c1c]"
              >
                Employees
              </Link>

              <span className="text-gray-300">/</span>

              <span className="font-semibold text-gray-800">
                Add Employee
              </span>
            </div>

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#b91c1c] text-white shadow-lg shadow-red-900/20">
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
                      d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8-3v6m3-3h-6"
                    />
                  </svg>
                </div>

                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                    Add New Employee
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Create and manage your news organization employee profile.
                  </p>
                </div>
              </div>

              <Link
                to="/admin/employees"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>

                Back to Employees
              </Link>
            </div>
          </div>

          {/* ================= ALERTS ================= */}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-[#b91c1c]">
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
                    d="M12 8v4m0 4h.01M10.29 3.86l-7.82 13.5A2 2 0 004.2 20h15.6a2 2 0 001.73-2.64l-7.82-13.5a2 2 0 00-3.46 0z"
                  />
                </svg>
              </div>

              <div>
                <p className="font-bold text-red-800">
                  Unable to save employee
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div>
                <p className="font-bold text-emerald-800">
                  {success}
                </p>

                <p className="mt-1 text-sm text-emerald-600">
                  Redirecting to employee list...
                </p>
              </div>
            </div>
          )}

          {/* ================= FORM ================= */}

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

              {/* ================= LEFT ================= */}

              <div className="space-y-6">

                {/* ================= BASIC INFORMATION ================= */}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                  <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">

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

                      <div>
                        <h2 className="font-bold text-gray-900">
                          Basic Information
                        </h2>

                        <p className="mt-0.5 text-sm text-gray-500">
                          Personal and professional details
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

                    {/* Employee ID */}
                    <div>
                      <label className={labelClass}>
                        Employee ID
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        placeholder="EMP001"
                        required
                        className={`${inputClass} font-semibold uppercase`}
                      />

                      <p className="mt-1.5 text-xs text-gray-400">
                        Unique employee identification number.
                      </p>
                    </div>

                    {/* Name */}
                    <div>
                      <label className={labelClass}>
                        Full Name
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Rahul Sharma"
                        required
                        className={inputClass}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={labelClass}>
                        Email Address
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <svg
                          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="rahul@example.com"
                          required
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={labelClass}>
                        Phone Number
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <svg
                          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h2l2 5-2 2a16 16 0 007 7l2-2 5 2v2a2 2 0 01-2 2C10.82 21 3 13.18 3 5z"
                          />
                        </svg>

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          required
                          maxLength="15"
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                    </div>

                    {/* DOB */}
                    <div>
                      <label className={labelClass}>
                        Date of Birth
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>

                    {/* Designation */}
                    <div>
                      <label className={labelClass}>
                        Designation
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
                        <option value="">
                          Select designation
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
                  </div>
                </section>

                {/* ================= LOCATION ================= */}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                  <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">

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
                        <h2 className="font-bold text-gray-900">
                          Location Details
                        </h2>

                        <p className="mt-0.5 text-sm text-gray-500">
                          Employee's current location and address
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="space-y-5 p-5 sm:p-6">

                    <div>
                      <label className={labelClass}>
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Kanpur"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Complete Address
                      </label>

                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter complete residential address..."
                        rows="4"
                        className={`${inputClass} resize-none`}
                      />

                      <p className="mt-1.5 text-xs text-gray-400">
                        Include area, street and other relevant details.
                      </p>
                    </div>

                  </div>
                </section>

                {/* ================= EMPLOYMENT ================= */}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                  <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">

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
                            d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM8 7h8"
                          />
                        </svg>
                      </div>

                      <div>
                        <h2 className="font-bold text-gray-900">
                          Employment Details
                        </h2>

                        <p className="mt-0.5 text-sm text-gray-500">
                          Joining date and employment status
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

                    <div>
                      <label className={labelClass}>
                        Joining Date
                      </label>

                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        className={inputClass}
                      />

                      <p className="mt-1.5 text-xs text-gray-400">
                        Leave empty to use today's date.
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Employment Status
                      </label>

                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="active">
                          Active
                        </option>

                        <option value="inactive">
                          Inactive
                        </option>
                      </select>
                    </div>

                  </div>
                </section>
              </div>

              {/* ================= RIGHT SIDEBAR ================= */}

              <aside className="space-y-6">

                {/* ================= PROFILE PHOTO ================= */}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                  <div className="border-b border-gray-100 px-5 py-5">
                    <h2 className="font-bold text-gray-900">
                      Profile Photo
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Upload employee profile image
                    </p>
                  </div>

                  <div className="p-5">

                    {/* IMAGE PREVIEW */}
                    <div className="mb-5 flex justify-center">

                      <div className="relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

                        {profileImagePreview ? (
                          <>
                            <img
                              src={profileImagePreview}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />

                            {/* REMOVE BUTTON */}
                            <button
                              type="button"
                              onClick={handleRemoveProfileImage}
                              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600"
                              title="Remove image"
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <div className="text-center">

                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#b91c1c]">
                              <svg
                                className="h-7 w-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7"
                                />
                              </svg>
                            </div>

                            <p className="text-xs font-medium text-gray-400">
                              No image
                            </p>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* HIDDEN FILE INPUT */}
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />

                    {/* UPLOAD BUTTON */}
                    <label
                      htmlFor="profileImage"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-[#b91c1c] transition hover:border-red-300 hover:bg-red-100"
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>

                      {profileImageFile
                        ? "Change Photo"
                        : "Choose Photo"}
                    </label>

                    {/* SELECTED FILE INFO */}
                    {profileImageFile && (
                      <div className="mt-3 rounded-xl bg-gray-50 p-3">

                        <p className="truncate text-xs font-semibold text-gray-700">
                          {profileImageFile.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {(profileImageFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                      </div>
                    )}

                    <p className="mt-3 text-xs leading-5 text-gray-400">
                      JPG, JPEG, PNG or WEBP. Maximum file size 10 MB.
                    </p>

                  </div>
                </section>

                {/* ================= SUMMARY ================= */}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                  <div className="border-b border-gray-100 px-5 py-5">
                    <h2 className="font-bold text-gray-900">
                      Employee Summary
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Live preview
                    </p>
                  </div>

                  <div className="p-5">

                    <div className="space-y-4">

                      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                        <span className="text-sm text-gray-500">
                          Employee ID
                        </span>

                        <span className="max-w-[170px] truncate text-right text-sm font-bold text-gray-800">
                          {formData.employeeId || "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                        <span className="text-sm text-gray-500">
                          Name
                        </span>

                        <span className="max-w-[170px] truncate text-right text-sm font-bold text-gray-800">
                          {formData.name || "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                        <span className="text-sm text-gray-500">
                          Designation
                        </span>

                        <span className="max-w-[170px] truncate text-right text-sm font-bold text-gray-800">
                          {formData.designation || "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                        <span className="text-sm text-gray-500">
                          City
                        </span>

                        <span className="max-w-[170px] truncate text-right text-sm font-bold text-gray-800">
                          {formData.city || "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Status
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            formData.status === "active"
                              ? "bg-red-50 text-[#b91c1c]"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {formData.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                    </div>
                  </div>
                </section>

                {/* ================= ADMIN INFO ================= */}

                <section className="rounded-2xl border border-red-100 bg-red-50 p-5">

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#b91c1c] shadow-sm">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          strokeWidth="2"
                        />

                        <path
                          strokeLinecap="round"
                          strokeWidth="2"
                          d="M12 11v5m0-8h.01"
                        />
                      </svg>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-red-900">
                        Before you save
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-red-700">
                        Make sure Employee ID and email address are
                        unique and match your database validation rules.
                      </p>
                    </div>

                  </div>
                </section>

              </aside>
            </div>

            {/* ================= ACTION BAR ================= */}

            <div className="sticky bottom-0 z-20 mt-6 border-t border-gray-200 bg-white/95 py-4 backdrop-blur">

              <div className="mx-auto flex max-w-[1600px] flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="text-xs text-gray-400">
                  <span className="text-red-500">*</span>{" "}
                  Required fields
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b91c1c] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition hover:bg-[#991b1b] focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
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

                        Uploading & Saving...
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </button>

                </div>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default AddEmployee;

