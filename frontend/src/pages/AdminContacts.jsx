import { useEffect, useMemo, useState } from "react";
import AdminHeader from "./AdminHeader";

import {
  FiMail,
  FiPhone,
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiMessageSquare,
  FiCalendar,
  FiX,
  FiEye,
  FiInbox,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api/contact";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteContact, setDeleteContact] = useState(null);

  // ============================================
  // FETCH CONTACTS
  // ============================================

  const fetchContacts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setSuccess("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Contacts fetch failed"
        );
      }

      setContacts(
        Array.isArray(data.contacts)
          ? data.contacts
          : []
      );
    } catch (err) {
      console.error("Fetch Contacts Error:", err);

      setError(
        err.message ||
          "Contacts load करने में समस्या हुई।"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ============================================
  // INITIAL FETCH
  // ============================================

  useEffect(() => {
    fetchContacts();
  }, []);

  // ============================================
  // SEARCH
  // ============================================

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return contacts;
    }

    return contacts.filter((contact) => {
      return (
        contact.name
          ?.toLowerCase()
          .includes(query) ||
        contact.email
          ?.toLowerCase()
          .includes(query) ||
        contact.subject
          ?.toLowerCase()
          .includes(query) ||
        contact.message
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [contacts, search]);

  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("hi-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================
  // DELETE CONTACT
  // DELETE /api/contact/:id
  // ============================================

  const handleDeleteContact = async () => {
    if (!deleteContact?._id) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${deleteContact._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Contact delete failed"
        );
      }

      // Remove deleted contact from UI
      setContacts((prevContacts) =>
        prevContacts.filter(
          (contact) =>
            contact._id !== deleteContact._id
        )
      );

      // Close delete modal
      setDeleteContact(null);

      // Close details modal if same contact is open
      if (
        selectedContact?._id ===
        deleteContact._id
      ) {
        setSelectedContact(null);
      }

      setSuccess(
        "Contact deleted successfully."
      );

      // Remove success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Delete Contact Error:",
        err
      );

      setError(
        err.message ||
          "Contact delete करने में समस्या हुई।"
      );
    } finally {
      setDeleting(false);
    }
  };

  // ============================================
  // OPEN DELETE CONFIRMATION
  // ============================================

  const openDeleteModal = (contact) => {
    setError("");
    setSuccess("");
    setDeleteContact(contact);
  };

  // ============================================
  // RETURN
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* ======================================
          ADMIN HEADER
      ====================================== */}

      <AdminHeader />

      <main>

        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5">

                  <span className="h-2 w-2 rounded-full bg-[#b91c1c]" />

                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                    Contact Management
                  </span>

                </div>

                <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
                  Contacts
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  वेबसाइट से प्राप्त सभी संपर्क संदेश यहां देखें और
                  आवश्यक जानकारी प्राप्त करें।
                </p>

              </div>

              <button
                type="button"
                onClick={() => fetchContacts(true)}
                disabled={refreshing}
                className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <FiRefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}

              </button>

            </div>
          </div>
        </section>

        {/* ======================================
            CONTENT
        ====================================== */}

        <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

          {/* ======================================
              SUCCESS
          ====================================== */}

          {success && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-green-700">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                ✓
              </div>

              <p className="text-sm font-semibold">
                {success}
              </p>

            </div>
          )}

          {/* ======================================
              STATS
          ====================================== */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* TOTAL */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Total Contacts
                  </p>

                  <p className="mt-2 text-3xl font-black text-gray-950">
                    {contacts.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c]">
                  <FiInbox size={20} />
                </div>

              </div>
            </div>

            {/* SEARCH RESULTS */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Search Results
                  </p>

                  <p className="mt-2 text-3xl font-black text-gray-950">
                    {filteredContacts.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <FiSearch size={20} />
                </div>

              </div>
            </div>

            {/* STATUS */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Current Status
                  </p>

                  <p className="mt-2 text-lg font-black text-green-600">
                    Active
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                </div>

              </div>
            </div>

          </div>

          {/* ======================================
              SEARCH
          ====================================== */}

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

            <div className="relative">

              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="नाम, ईमेल, विषय या संदेश से खोजें..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-[#b91c1c]"
                >
                  <FiX size={16} />
                </button>
              )}

            </div>
          </div>

          {/* ======================================
              ERROR
          ====================================== */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-black text-red-700">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-xs text-red-600">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    fetchContacts()
                  }
                  className="w-fit rounded-lg bg-[#b91c1c] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#991b1b]"
                >
                  Try Again
                </button>

              </div>
            </div>
          )}

          {/* ======================================
              LOADING
          ====================================== */}

          {loading ? (

            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#b91c1c]" />

              <p className="mt-4 text-sm font-bold text-gray-600">
                Contacts load हो रहे हैं...
              </p>

            </div>

          ) : filteredContacts.length === 0 ? (

            /* ======================================
                EMPTY
            ====================================== */

            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#b91c1c]">
                <FiInbox size={24} />
              </div>

              <h3 className="mt-4 text-lg font-black text-gray-900">
                {search
                  ? "कोई contact नहीं मिला"
                  : "अभी कोई contact नहीं है"}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "अपनी search बदलकर दोबारा प्रयास करें।"
                  : "जब कोई visitor contact form submit करेगा, तो वह यहां दिखाई देगा।"}
              </p>

            </div>

          ) : (

            <>

              {/* ======================================
                  DESKTOP TABLE
              ====================================== */}

              <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[1000px]">

                    <thead>

                      <tr className="border-b border-gray-200 bg-gray-50">

                        <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">
                          Contact
                        </th>

                        <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">
                          Subject
                        </th>

                        <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">
                          Message
                        </th>

                        <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">
                          Date
                        </th>

                        <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-wider text-gray-400">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-100">

                      {filteredContacts.map(
                        (contact, index) => (

                          <tr
                            key={
                              contact._id ||
                              contact.id ||
                              index
                            }
                            className="transition hover:bg-gray-50"
                          >

                            {/* CONTACT */}

                            <td className="px-5 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-sm font-black text-[#b91c1c]">
                                  {contact.name
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "U"}
                                </div>

                                <div className="min-w-0">

                                  <p className="truncate text-sm font-black text-gray-900">
                                    {contact.name ||
                                      "Unknown"}
                                  </p>

                                  <a
                                    href={`mailto:${contact.email}`}
                                    className="mt-1 flex items-center gap-1.5 truncate text-xs text-gray-500 transition hover:text-[#b91c1c]"
                                  >
                                    <FiMail size={12} />

                                    {contact.email ||
                                      "-"}
                                  </a>

                                </div>

                              </div>

                            </td>

                            {/* SUBJECT */}

                            <td className="max-w-[220px] px-5 py-5">

                              <p className="truncate text-sm font-bold text-gray-800">
                                {contact.subject ||
                                  "-"}
                              </p>

                            </td>

                            {/* MESSAGE */}

                            <td className="max-w-[300px] px-5 py-5">

                              <p className="line-clamp-2 text-xs leading-5 text-gray-500">
                                {contact.message ||
                                  "-"}
                              </p>

                            </td>

                            {/* DATE */}

                            <td className="whitespace-nowrap px-5 py-5">

                              <div className="flex items-center gap-2 text-xs text-gray-500">

                                <FiCalendar size={13} />

                                {formatDate(
                                  contact.createdAt ||
                                    contact.created_at ||
                                    contact.date
                                )}

                              </div>

                            </td>

                            {/* ACTION */}

                            <td className="px-5 py-5">

                              <div className="flex items-center justify-end gap-2">

                                {/* VIEW */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedContact(
                                      contact
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
                                >
                                  <FiEye size={15} />
                                  View
                                </button>

                                {/* DELETE */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    openDeleteModal(
                                      contact
                                    )
                                  }
                                  className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-[#b91c1c] transition hover:bg-[#b91c1c] hover:text-white"
                                  title="Delete contact"
                                >
                                  <FiTrash2
                                    size={15}
                                  />
                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>
              </div>

              {/* ======================================
                  MOBILE CARDS
              ====================================== */}

              <div className="grid grid-cols-1 gap-4 lg:hidden">

                {filteredContacts.map(
                  (contact, index) => (

                    <div
                      key={
                        contact._id ||
                        contact.id ||
                        index
                      }
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                    >

                      <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-sm font-black text-[#b91c1c]">
                          {contact.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                        </div>

                        <div className="min-w-0 flex-1">

                          <h3 className="text-sm font-black text-gray-900">
                            {contact.name ||
                              "Unknown"}
                          </h3>

                          <a
                            href={`mailto:${contact.email}`}
                            className="mt-1 flex items-center gap-1.5 break-all text-xs text-gray-500 hover:text-[#b91c1c]"
                          >
                            <FiMail size={12} />

                            {contact.email ||
                              "-"}
                          </a>

                        </div>

                      </div>

                      <div className="mt-5 border-t border-gray-100 pt-4">

                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                          Subject
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-800">
                          {contact.subject ||
                            "-"}
                        </p>

                      </div>

                      <div className="mt-4">

                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                          Message
                        </p>

                        <p className="mt-1 line-clamp-3 text-sm leading-6 text-gray-600">
                          {contact.message ||
                            "-"}
                        </p>

                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">

                        <div className="flex items-center gap-2 text-xs text-gray-500">

                          <FiCalendar size={13} />

                          {formatDate(
                            contact.createdAt ||
                              contact.created_at ||
                              contact.date
                          )}

                        </div>

                        <div className="flex items-center gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedContact(
                                contact
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-[#b91c1c] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#991b1b]"
                          >
                            <FiEye size={14} />
                            View
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(
                                contact
                              )
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-[#b91c1c] transition hover:bg-[#b91c1c] hover:text-white"
                            title="Delete contact"
                          >
                            <FiTrash2 size={14} />
                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </>

          )}

        </section>
      </main>

      {/* =======================================================
          CONTACT DETAILS MODAL
      ======================================================== */}

      {selectedContact && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedContact(null)
          }
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c]">
                  <FiMessageSquare size={20} />
                </div>

                <div>

                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Contact Message
                  </p>

                  <h2 className="mt-1 text-lg font-black text-gray-950">
                    Message Details
                  </h2>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedContact(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-red-50 hover:text-[#b91c1c]"
              >
                <FiX size={18} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="max-h-[calc(90vh-90px)] overflow-y-auto px-5 py-6 sm:px-6">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* NAME */}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                  <div className="flex items-center gap-2 text-gray-400">

                    <FiUser size={15} />

                    <p className="text-[10px] font-black uppercase tracking-wider">
                      Name
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-black text-gray-900">
                    {selectedContact.name ||
                      "-"}
                  </p>

                </div>

                {/* EMAIL */}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                  <div className="flex items-center gap-2 text-gray-400">

                    <FiMail size={15} />

                    <p className="text-[10px] font-black uppercase tracking-wider">
                      Email
                    </p>

                  </div>

                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="mt-2 block break-all text-sm font-bold text-[#b91c1c]"
                  >
                    {selectedContact.email ||
                      "-"}
                  </a>

                </div>

                {/* PHONE */}

                {selectedContact.phone && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                    <div className="flex items-center gap-2 text-gray-400">

                      <FiPhone size={15} />

                      <p className="text-[10px] font-black uppercase tracking-wider">
                        Phone
                      </p>

                    </div>

                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="mt-2 block text-sm font-bold text-gray-900"
                    >
                      {selectedContact.phone}
                    </a>

                  </div>
                )}

                {/* DATE */}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                  <div className="flex items-center gap-2 text-gray-400">

                    <FiCalendar size={15} />

                    <p className="text-[10px] font-black uppercase tracking-wider">
                      Received
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-gray-900">
                    {formatDate(
                      selectedContact.createdAt ||
                        selectedContact.created_at ||
                        selectedContact.date
                    )}
                  </p>

                </div>

              </div>

              {/* SUBJECT */}

              <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">

                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Subject
                </p>

                <p className="mt-2 text-base font-black text-gray-900">
                  {selectedContact.subject ||
                    "-"}
                </p>

              </div>

              {/* MESSAGE */}

              <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">

                <div className="flex items-center gap-2">

                  <FiMessageSquare
                    size={15}
                    className="text-[#b91c1c]"
                  />

                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Message
                  </p>

                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                  {selectedContact.message ||
                    "-"}
                </p>

              </div>

              {/* ACTIONS */}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                {selectedContact.email && (
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#b91c1c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#991b1b]"
                  >
                    <FiMail size={16} />
                    Email Reply
                  </a>
                )}

                {selectedContact.phone && (
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
                  >
                    <FiPhone size={16} />
                    Call
                  </a>
                )}

                {/* DELETE FROM DETAILS */}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedContact(null);
                    openDeleteModal(
                      selectedContact
                    );
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-[#b91c1c] transition hover:bg-[#b91c1c] hover:text-white"
                >
                  <FiTrash2 size={16} />
                  Delete
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          DELETE CONFIRMATION MODAL
      ======================================================== */}

      {deleteContact && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!deleting) {
              setDeleteContact(null);
            }
          }}
        >

          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* DELETE ICON */}

            <div className="px-6 pt-7 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-[#b91c1c]">

                <FiAlertTriangle size={28} />

              </div>

              <h2 className="mt-5 text-xl font-black text-gray-950">
                Delete Contact?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                क्या आप इस contact message को permanently
                delete करना चाहते हैं?
              </p>

            </div>

            {/* CONTACT INFO */}

            <div className="mx-6 mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">

              <p className="truncate text-sm font-black text-gray-900">
                {deleteContact.name ||
                  "Unknown"}
              </p>

              <p className="mt-1 truncate text-xs text-gray-500">
                {deleteContact.email ||
                  "-"}
              </p>

              {deleteContact.subject && (
                <p className="mt-2 truncate text-xs font-semibold text-gray-700">
                  {deleteContact.subject}
                </p>
              )}

            </div>

            {/* BUTTONS */}

            <div className="flex gap-3 px-6 py-6">

              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setDeleteContact(null)
                }
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteContact}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#b91c1c] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#991b1b] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {deleting ? (
                  <>
                    <FiRefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    Delete
                  </>
                )}

              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminContacts;
