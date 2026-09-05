import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "./AdminHeader";

const API_URL = "https://asv-news.onrender.com/api/employees";

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

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);

  // Profile image states
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [existingProfileImage, setExistingProfileImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================
  // GET EMPLOYEE
  // ============================================

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${API_URL}/${id}`);

        console.log("Employee response:", response.data);

        const employee =
          response.data.employee || response.data.data;

        if (!employee) {
          throw new Error("Employee data not found");
        }

        setFormData({
          employeeId: employee.employeeId || "",
          name: employee.name || "",
          email: employee.email || "",
          phone: employee.phone || "",
          dob: employee.dob
            ? employee.dob.substring(0, 10)
            : "",
          designation: employee.designation || "",
          city: employee.city || "",
          address: employee.address || "",
          joiningDate: employee.joiningDate
            ? employee.joiningDate.substring(0, 10)
            : "",
          status: employee.status || "active",
        });

        // Existing Cloudinary image
        setExistingProfileImage(
          employee.profileImage || ""
        );

        setProfileImagePreview(
          employee.profileImage || ""
        );
      } catch (err) {
        console.error("Fetch employee error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load employee."
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
  // HANDLE NORMAL INPUT CHANGE
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ============================================
  // HANDLE PROFILE IMAGE
  // ============================================

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Profile image must be less than 10 MB."
      );

      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");

    setProfileImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);
  };

  // ============================================
  // REMOVE SELECTED NEW IMAGE
  // ============================================

  const handleRemoveProfileImage = () => {
    setProfileImageFile(null);

    const input =
      document.getElementById("profileImage");

    if (input) {
      input.value = "";
    }

    // Restore existing image
    setProfileImagePreview(existingProfileImage);

    setError("");
    setSuccess("");
  };

  // ============================================
  // UPDATE EMPLOYEE
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

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

    try {
      setSaving(true);

      const updateData = new FormData();

      updateData.append(
        "name",
        formData.name.trim()
      );

      updateData.append(
        "email",
        formData.email.trim()
      );

      updateData.append(
        "phone",
        formData.phone.trim()
      );

      updateData.append(
        "dob",
        formData.dob
      );

      updateData.append(
        "designation",
        formData.designation
      );

      updateData.append(
        "city",
        formData.city.trim()
      );

      updateData.append(
        "address",
        formData.address.trim()
      );

      if (formData.joiningDate) {
        updateData.append(
          "joiningDate",
          formData.joiningDate
        );
      }

      updateData.append(
        "status",
        formData.status
      );

      // Only send new image if selected
      if (profileImageFile) {
        updateData.append(
          "profileImage",
          profileImageFile
        );
      }

      // Debug
      for (const [key, value] of updateData.entries()) {
        console.log(
          key,
          value instanceof File
            ? value.name
            : value
        );
      }

      const response = await axios.put(
        `${API_URL}/${id}`,
        updateData
      );

      console.log(
        "Updated employee:",
        response.data
      );

      setSuccess(
        "Employee updated successfully."
      );

      setTimeout(() => {
        navigate("/admin/employees");
      }, 1200);
    } catch (err) {
      console.error(
        "Update employee error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to update employee. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f8]">
        <AdminHeader />

        <main className="flex min-h-[calc(100vh-70px)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <svg
                className="h-6 w-6 animate-spin text-red-700"
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
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Loading employee
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Please wait while we fetch employee details.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // MAIN UI
  // ============================================

  return (
    <div className="min-h-screen bg-[#f7f7f8]">

      {/* ======================================
          ADMIN HEADER
      ====================================== */}

      <AdminHeader />

      {/* ======================================
          PAGE CONTENT
      ====================================== */}

      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* ======================================
              PAGE HEADER
          ====================================== */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              {/* Breadcrumb */}
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <Link
                  to="/admin/employees"
                  className="transition hover:text-red-700"
                >
                  Employees
                </Link>

                <span>/</span>

                <span className="text-gray-700">
                  Edit Employee
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Edit Employee
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Update employee profile and employment information.
              </p>
            </div>

            {/* Back Button */}
            <Link
              to="/admin/employees"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
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

          {/* ======================================
              ALERTS
          ====================================== */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-red-700">
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
                  Unable to update employee
                </p>

                <p className="mt-0.5 text-sm">
                  {error}
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-green-700">
              <svg
                className="h-5 w-5 shrink-0"
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

              <div>
                <p className="font-semibold">
                  {success}
                </p>

                <p className="text-sm text-green-600">
                  Redirecting to employee list...
                </p>
              </div>
            </div>
          )}

          {/* ======================================
              FORM
          ====================================== */}

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

              {/* ==================================
                  LEFT CONTENT
              ================================== */}

              <div className="space-y-6 lg:col-span-2">

                {/* ==================================
                    BASIC INFORMATION
                ================================== */}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                  <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700">
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
                        <h2 className="font-semibold text-gray-900">
                          Basic Information
                        </h2>

                        <p className="text-sm text-gray-500">
                          Personal and professional details
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

                    {/* Employee ID */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Employee ID
                      </label>

                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-semibold uppercase text-gray-500 outline-none"
                      />

                      <p className="mt-1.5 text-xs text-gray-400">
                        Employee ID cannot be changed.
                      </p>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Full Name
                        <span className="ml-1 text-red-600">*</span>
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Rahul Sharma"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Email Address
                        <span className="ml-1 text-red-600">*</span>
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
                          required
                          placeholder="rahul@example.com"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Phone Number
                        <span className="ml-1 text-red-600">*</span>
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
                            d="M3 5a2 2 0 012-2h2l2 5-2 2a16 16 0 007 7l2-2 5 2v2a2 2 0 01-2-2C10.82 21 3 13.18 3 5z"
                          />
                        </svg>

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          maxLength="15"
                          placeholder="9876543210"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                        />
                      </div>
                    </div>

                    {/* DOB */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Date of Birth
                        <span className="ml-1 text-red-600">*</span>
                      </label>

                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                      />
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Designation
                        <span className="ml-1 text-red-600">*</span>
                      </label>

                      <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
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

                {/* ==================================
                    LOCATION
                ================================== */}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                  <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700">
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
                        <h2 className="font-semibold text-gray-900">
                          Location Details
                        </h2>

                        <p className="text-sm text-gray-500">
                          Employee location and address
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 p-5 sm:p-6">

                    {/* City */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Kanpur"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Complete Address
                      </label>

                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Enter complete address..."
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                      />
                    </div>

                  </div>
                </section>

                {/* ==================================
                    EMPLOYMENT
                ================================== */}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                  <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700">
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
                        <h2 className="font-semibold text-gray-900">
                          Employment Details
                        </h2>

                        <p className="text-sm text-gray-500">
                          Joining date and current status
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

                    {/* Joining Date */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Joining Date
                      </label>

                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Employment Status
                      </label>

                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
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

              {/* ==================================
                  RIGHT SIDEBAR
              ================================== */}

              <div className="space-y-6">

                {/* ==================================
                    PROFILE PHOTO
                ================================== */}

                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                  <div className="mb-5">
                    <h2 className="font-semibold text-gray-900">
                      Profile Photo
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Upload a new employee profile image
                    </p>
                  </div>

                  {/* IMAGE PREVIEW */}

                  <div className="mb-5 flex justify-center">
                    <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

                      {profileImagePreview ? (
                        <img
                          src={profileImagePreview}
                          alt={
                            formData.name ||
                            "Employee"
                          }
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center">

                          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-700">
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>

                          <span className="text-xs text-gray-400">
                            No image
                          </span>

                        </div>
                      )}

                    </div>
                  </div>

                  {/* FILE INPUT */}

                  <input
                    id="profileImage"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />

                  <label
                    htmlFor="profileImage"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-9-5h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>

                    {profileImageFile
                      ? "Change Photo"
                      : "Choose New Photo"}
                  </label>

                  {/* SELECTED FILE */}

                  {profileImageFile && (
                    <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3">

                      <p className="truncate text-xs font-medium text-gray-700">
                        {profileImageFile.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {(
                          profileImageFile.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </p>

                      <button
                        type="button"
                        onClick={
                          handleRemoveProfileImage
                        }
                        className="mt-2 text-xs font-semibold text-red-700 hover:text-red-800"
                      >
                        Remove selected photo
                      </button>

                    </div>
                  )}

                  <p className="mt-3 text-xs leading-5 text-gray-400">
                    JPG, JPEG, PNG or WEBP. Maximum file
                    size: 10 MB. Leave unchanged to keep
                    the existing photo.
                  </p>

                </section>

                {/* ==================================
                    EMPLOYEE SUMMARY
                ================================== */}

                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                  <h2 className="mb-4 font-semibold text-gray-900">
                    Employee Summary
                  </h2>

                  <div className="space-y-4">

                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <span className="text-sm text-gray-500">
                        Employee ID
                      </span>

                      <span className="text-sm font-bold text-gray-800">
                        {formData.employeeId || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <span className="text-sm text-gray-500">
                        Name
                      </span>

                      <span className="max-w-[150px] truncate text-right text-sm font-semibold text-gray-800">
                        {formData.name || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <span className="text-sm text-gray-500">
                        Designation
                      </span>

                      <span className="max-w-[150px] truncate text-right text-sm font-semibold text-gray-800">
                        {formData.designation || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <span className="text-sm text-gray-500">
                        City
                      </span>

                      <span className="text-sm font-semibold text-gray-800">
                        {formData.city || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Status
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          formData.status === "active"
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {formData.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                  </div>
                </section>

                {/* ==================================
                    INFORMATION
                ================================== */}

                <div className="rounded-2xl border border-red-100 bg-red-50 p-5">

                  <div className="flex gap-3">

                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-red-700"
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

                    <div>
                      <h3 className="text-sm font-semibold text-red-900">
                        Editing employee
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-red-700">
                        Employee ID is locked because it is
                        used as a unique identifier in the
                        database.
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* ======================================
                ACTION BAR
            ====================================== */}

            <div className="sticky bottom-0 z-10 mt-6 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:p-5">

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">

                <Link
                  to="/admin/employees"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b91c1c] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#991b1b] focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
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

                      Updating Employee...
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>

                      Save Changes
                    </>
                  )}
                </button>

              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default EditEmployee;
