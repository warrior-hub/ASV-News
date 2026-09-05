import { useEffect, useMemo, useState } from "react";

import {
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Flame,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  FileText,
  Clock,
  Filter,
  CalendarDays,
  BarChart3,
  Newspaper,
  CircleAlert,
} from "lucide-react";

import AdminHeader from "./AdminHeader";

// =====================================================
// API
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://asv-news.onrender.com/api";

// =====================================================
// CATEGORY
// value = DATABASE VALUE
// label = UI VALUE
// =====================================================

const categories = [
  {
    label: "सभी",
    value: "all",
  },
  {
    label: "भारत",
    value: "india",
  },
  {
    label: "दुनिया",
    value: "world",
  },
  {
    label: "बिजनेस",
    value: "business",
  },
  {
    label: "टेक्नोलॉजी",
    value: "technology",
  },
  {
    label: "खेल",
    value: "sports",
  },
  {
    label: "मनोरंजन",
    value: "entertainment",
  },
  {
    label: "शिक्षा",
    value: "education",
  },
  {
    label: "राजनीति",
    value: "politics",
  },
];

// =====================================================
// ADMIN NEWS
// =====================================================

const AdminNews = () => {
  const [news, setNews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("all");

  const [status, setStatus] = useState("all");

  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedNews, setSelectedNews] = useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showPreview, setShowPreview] =
    useState(false);

  const [toast, setToast] = useState(null);

  const [page, setPage] = useState(1);

  const perPage = 8;

  // ===================================================
  // TOAST
  // ===================================================

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ===================================================
  // FETCH ADMIN NEWS
  // ===================================================

  const fetchNews = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/news/admin`,
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "News fetch failed"
        );
      }

      setNews(
        Array.isArray(data.news)
          ? data.news
          : []
      );
    } catch (error) {
      console.error(
        "Fetch News Error:",
        error
      );

      showToast(
        error.message ||
          "News load नहीं हो पाई",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchNews();
  }, []);

  // ===================================================
  // STATS
  // ===================================================

  const stats = useMemo(() => {
    return {
      total: news.length,

      published: news.filter(
        (item) =>
          item.status === "published"
      ).length,

      draft: news.filter(
        (item) =>
          item.status === "draft"
      ).length,

      breaking: news.filter(
        (item) =>
          item.isBreaking === true
      ).length,

      trending: news.filter(
        (item) =>
          item.isTrending === true
      ).length,

      featured: news.filter(
        (item) =>
          item.isFeatured === true
      ).length,
    };
  }, [news]);

  // ===================================================
  // FILTER
  // ===================================================

  const filteredNews = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return news.filter((item) => {
      const matchesSearch =
        !query ||
        item.title
          ?.toLowerCase()
          .includes(query) ||
        item.shortDescription
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "all" ||
        item.category
          ?.toLowerCase() ===
          category.toLowerCase();

      const matchesStatus =
        status === "all" ||
        item.status === status;

      let matchesSpecial = true;

      if (
        activeFilter === "breaking"
      ) {
        matchesSpecial =
          item.isBreaking === true;
      }

      if (
        activeFilter === "featured"
      ) {
        matchesSpecial =
          item.isFeatured === true;
      }

      if (
        activeFilter === "trending"
      ) {
        matchesSpecial =
          item.isTrending === true;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesSpecial
      );
    });
  }, [
    news,
    search,
    category,
    status,
    activeFilter,
  ]);

  // ===================================================
  // PAGINATION
  // ===================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredNews.length / perPage
    )
  );

  const currentNews =
    filteredNews.slice(
      (page - 1) * perPage,
      page * perPage
    );

  useEffect(() => {
    setPage(1);
  }, [
    search,
    category,
    status,
    activeFilter,
  ]);

  // ===================================================
  // UPDATE FLAG
  // ===================================================

  const updateFlag = async (
    id,
    field,
    value
  ) => {
    try {
      const token =
        localStorage.getItem(
          "adminToken"
        );

      const response = await fetch(
        `${API_URL}/news/admin/${id}/flags`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },

          body: JSON.stringify({
            [field]: value,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Update failed"
        );
      }

      setNews((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                ...data.news,
              }
            : item
        )
      );

      showToast(
        "News settings updated"
      );
    } catch (error) {
      console.error(error);

      showToast(
        error.message ||
          "Update failed",
        "error"
      );
    }
  };

  // ===================================================
  // PUBLISH / DRAFT
  // ===================================================

  const toggleStatus = async (
    item
  ) => {
    try {
      const token =
        localStorage.getItem(
          "adminToken"
        );

      const endpoint =
        item.status === "published"
          ? "unpublish"
          : "publish";

      const response = await fetch(
        `${API_URL}/news/admin/${item._id}/${endpoint}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Status update failed"
        );
      }

      setNews((prev) =>
        prev.map((newsItem) =>
          newsItem._id ===
          item._id
            ? data.news
            : newsItem
        )
      );

      showToast(
        item.status === "published"
          ? "News moved to draft"
          : "News published successfully"
      );
    } catch (error) {
      console.error(error);

      showToast(
        error.message ||
          "Status update failed",
        "error"
      );
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const deleteNews = async () => {
    if (!selectedNews) {
      return;
    }

    try {
      const token =
        localStorage.getItem(
          "adminToken"
        );

      const response = await fetch(
        `${API_URL}/news/admin/${selectedNews._id}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",

            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Delete failed"
        );
      }

      setNews((prev) =>
        prev.filter(
          (item) =>
            item._id !==
            selectedNews._id
        )
      );

      setShowDeleteModal(false);

      setSelectedNews(null);

      showToast(
        "News deleted successfully"
      );
    } catch (error) {
      console.error(error);

      showToast(
        error.message ||
          "News delete नहीं हुई",
        "error"
      );
    }
  };

  // ===================================================
  // DATE
  // ===================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not published";
    }

    return new Intl.DateTimeFormat(
      "hi-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  };

  // ===================================================
  // CLEAR FILTERS
  // ===================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setActiveFilter("all");
    setPage(1);
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-screen bg-[#f8f8f8]">

      {/* =================================================
          ADMIN HEADER
      ================================================= */}

      <AdminHeader />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* PAGE HEADING */}

        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>

            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-400">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-[#b91c1c]">
                News
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
              All News
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage, edit and publish
              all your news articles.
            </p>

          </div>

          <div className="flex items-center gap-2">

            <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-[#b91c1c]">
              {filteredNews.length} Articles
            </span>

          </div>

        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">

          <StatCard
            icon={
              <Newspaper size={18} />
            }
            title="Total News"
            value={stats.total}
          />

          <StatCard
            icon={
              <Check size={18} />
            }
            title="Published"
            value={stats.published}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            icon={
              <Clock size={18} />
            }
            title="Drafts"
            value={stats.draft}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            icon={
              <Flame size={18} />
            }
            title="Breaking"
            value={stats.breaking}
            iconClass="bg-red-50 text-red-600"
          />

          <StatCard
            icon={
              <TrendingUp size={18} />
            }
            title="Trending"
            value={stats.trending}
            iconClass="bg-blue-50 text-blue-600"
          />

        </div>

        {/* =================================================
            FILTER
        ================================================= */}

        <div className="mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search news by title..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50"
              />

              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#b91c1c]"
                >
                  <X size={16} />
                </button>
              )}

            </div>

            {/* FILTERS */}

            <div className="flex flex-wrap gap-2">

              {/* CATEGORY */}

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-50"
              >

                {categories.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label ===
                      "सभी"
                        ? "All Categories"
                        : item.label}
                    </option>
                  )
                )}

              </select>

              {/* STATUS */}

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-50"
              >

                <option value="all">
                  All Status
                </option>

                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>

              </select>

              {/* RESET */}

              <button
                onClick={clearFilters}
                className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
              >

                <Filter size={16} />

                Reset

              </button>

            </div>

          </div>

          {/* QUICK FILTERS */}

          <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-4 py-3">

            <span className="mr-1 text-xs font-semibold text-gray-400">
              Quick:
            </span>

            <QuickFilter
              active={
                activeFilter === "all"
              }
              onClick={() =>
                setActiveFilter("all")
              }
            >
              All News
            </QuickFilter>

            <QuickFilter
              active={
                activeFilter ===
                "breaking"
              }
              onClick={() =>
                setActiveFilter(
                  "breaking"
                )
              }
              icon={
                <Flame size={13} />
              }
            >
              Breaking
            </QuickFilter>

            <QuickFilter
              active={
                activeFilter ===
                "featured"
              }
              onClick={() =>
                setActiveFilter(
                  "featured"
                )
              }
              icon={
                <Star size={13} />
              }
            >
              Featured
            </QuickFilter>

            <QuickFilter
              active={
                activeFilter ===
                "trending"
              }
              onClick={() =>
                setActiveFilter(
                  "trending"
                )
              }
              icon={
                <TrendingUp size={13} />
              }
            >
              Trending
            </QuickFilter>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:px-5">

            <div>

              <h3 className="text-sm font-black text-gray-900">
                News Articles
              </h3>

              <p className="mt-0.5 text-xs text-gray-500">
                Review and manage your
                news content
              </p>

            </div>

            <div className="text-xs text-gray-500">

              Showing{" "}

              <span className="font-bold text-gray-800">
                {filteredNews.length === 0
                  ? 0
                  : (page - 1) *
                      perPage +
                    1}
              </span>

              {" - "}

              <span className="font-bold text-gray-800">
                {Math.min(
                  page * perPage,
                  filteredNews.length
                )}
              </span>

              {" of "}

              <span className="font-bold text-gray-800">
                {filteredNews.length}
              </span>

            </div>

          </div>

          {/* CONTENT */}

          {loading ? (
            <LoadingSkeleton />
          ) : currentNews.length === 0 ? (
            <EmptyState
              search={search}
              onClear={clearFilters}
            />
          ) : (
            <>
              {/* DESKTOP */}

              <div className="hidden overflow-x-auto lg:block">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-gray-100 bg-gray-50/80">

                      <th className="px-5 py-3 text-left text-[10px] font-black tracking-wider text-gray-400">
                        NEWS
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-black tracking-wider text-gray-400">
                        CATEGORY
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-black tracking-wider text-gray-400">
                        STATUS
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-black tracking-wider text-gray-400">
                        LABELS
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-black tracking-wider text-gray-400">
                        DATE
                      </th>
                      

                      <th className="px-5 py-3 text-right text-[10px] font-black tracking-wider text-gray-400">
                        ACTION
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {currentNews.map(
                      (item) => (
                        <NewsTableRow
                          key={
                            item._id
                          }
                          item={item}
                          formatDate={
                            formatDate
                          }
                          onEdit={() => {
                            window.location.href =
                              `/admin/news/${item._id}/edit`;
                          }}
                          onPreview={() => {
                            setSelectedNews(
                              item
                            );

                            setShowPreview(
                              true
                            );
                          }}
                          onDelete={() => {
                            setSelectedNews(
                              item
                            );

                            setShowDeleteModal(
                              true
                            );
                          }}
                          onStatus={() =>
                            toggleStatus(
                              item
                            )
                          }
                          onFlag={
                            updateFlag
                          }
                        />
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* MOBILE */}

              <div className="space-y-3 p-3 lg:hidden">

                {currentNews.map(
                  (item) => (
                    <MobileNewsCard
                      key={item._id}
                      item={item}
                      formatDate={
                        formatDate
                      }
                      onEdit={() => {
                        window.location.href =
                          `/admin/news/${item._id}/edit`;
                      }}
                      onPreview={() => {
                        setSelectedNews(
                          item
                        );

                        setShowPreview(
                          true
                        );
                      }}
                      onDelete={() => {
                        setSelectedNews(
                          item
                        );

                        setShowDeleteModal(
                          true
                        );
                      }}
                      onStatus={() =>
                        toggleStatus(
                          item
                        )
                      }
                      onFlag={
                        updateFlag
                      }
                    />
                  )
                )}

              </div>
            </>
          )}

          {/* PAGINATION */}

          {!loading &&
            filteredNews.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row">

                <p className="text-xs text-gray-500">

                  Page{" "}

                  <span className="font-bold text-gray-800">
                    {page}
                  </span>

                  {" of "}

                  <span className="font-bold text-gray-800">
                    {totalPages}
                  </span>

                </p>

                <div className="flex items-center gap-1">

                  <button
                    disabled={page === 1}
                    onClick={() =>
                      setPage((p) =>
                        Math.max(
                          1,
                          p - 1
                        )
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft
                      size={16}
                    />
                  </button>

                  {Array.from(
                    {
                      length:
                        Math.min(
                          totalPages,
                          5
                        ),
                    },
                    (_, i) =>
                      i + 1
                  ).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() =>
                          setPage(
                            number
                          )
                        }
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition ${
                          page === number
                            ? "bg-[#b91c1c] text-white shadow-sm"
                            : "text-gray-500 hover:bg-red-50 hover:text-[#b91c1c]"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}

                  <button
                    disabled={
                      page ===
                      totalPages
                    }
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          totalPages,
                          p + 1
                        )
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight
                      size={16}
                    />
                  </button>

                </div>

              </div>
            )}

        </div>

      </main>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {showDeleteModal && (
        <DeleteModal
          news={selectedNews}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedNews(null);
          }}
          onDelete={deleteNews}
        />
      )}

      {/* =================================================
          PREVIEW
      ================================================= */}

      {showPreview &&
        selectedNews && (
          <PreviewModal
            news={selectedNews}
            formatDate={formatDate}
            onClose={() => {
              setShowPreview(false);
              setSelectedNews(null);
            }}
          />
        )}

      {/* =================================================
          TOAST
      ================================================= */}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-2xl">

          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              toast.type === "error"
                ? "bg-red-50 text-red-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >

            {toast.type === "error" ? (
              <CircleAlert size={17} />
            ) : (
              <Check size={17} />
            )}

          </div>

          <p className="text-sm font-semibold text-gray-800">
            {toast.message}
          </p>

          <button
            onClick={() =>
              setToast(null)
            }
            className="ml-auto text-gray-400 transition hover:text-[#b91c1c]"
          >
            <X size={16} />
          </button>

        </div>
      )}

    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  icon,
  title,
  value,
  iconClass =
    "bg-red-50 text-[#b91c1c]",
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-red-100 hover:shadow-md">

      <div className="mb-3 flex items-center justify-between">

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <BarChart3
          size={15}
          className="text-gray-200"
        />

      </div>

      <p className="text-xs font-semibold text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-xl font-black tracking-tight text-gray-950">
        {Number(
          value || 0
        ).toLocaleString("en-IN")}
      </p>

    </div>
  );
};

// =====================================================
// QUICK FILTER
// =====================================================

const QuickFilter = ({
  active,
  onClick,
  icon,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
        active
          ? "bg-[#b91c1c] text-white shadow-sm"
          : "text-gray-500 hover:bg-red-50 hover:text-[#b91c1c]"
      }`}
    >
      {icon}

      {children}
    </button>
  );
};

// =====================================================
// TABLE ROW
// =====================================================

const NewsTableRow = ({
  item,
  formatDate,
  onEdit,
  onPreview,
  onDelete,
  onStatus,
  onFlag,
}) => {
  return (
    <tr className="group border-b border-gray-100 last:border-0 hover:bg-red-50/20">

      {/* NEWS */}

      <td className="px-5 py-4">

        <div className="flex min-w-[330px] items-center gap-3">

          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-100">

            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">
                <FileText size={20} />
              </div>
            )}

          </div>

          <div className="min-w-0">

            <h4
              className="line-clamp-2 max-w-[390px] text-sm font-bold leading-5 text-gray-900"
              title={item.title}
            >
              {item.title}
            </h4>

            <p className="mt-1 line-clamp-1 max-w-[390px] text-xs text-gray-500">
              {item.shortDescription ||
                "No description available"}
            </p>

          </div>

        </div>

      </td>

      {/* CATEGORY */}

      <td className="px-4 py-4">

        <span className="inline-flex whitespace-nowrap rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-bold text-gray-600">
          {getCategoryLabel(
            item.category
          )}
        </span>

      </td>

      {/* STATUS */}

      <td className="px-4 py-4">

        <button
          onClick={onStatus}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold transition ${
            item.status === "published"
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
          }`}
        >

          <span
            className={`h-1.5 w-1.5 rounded-full ${
              item.status === "published"
                ? "bg-emerald-500"
                : "bg-amber-500"
            }`}
          />

          {item.status === "published"
            ? "Published"
            : "Draft"}

        </button>

      </td>

      {/* LABELS */}

      <td className="px-4 py-4">

        <div className="flex items-center gap-1.5">

          <LabelButton
            active={item.isBreaking}
            title="Breaking"
            onClick={() =>
              onFlag(
                item._id,
                "isBreaking",
                !item.isBreaking
              )
            }
          >
            <Flame size={14} />
          </LabelButton>

          <LabelButton
            active={item.isFeatured}
            title="Featured"
            onClick={() =>
              onFlag(
                item._id,
                "isFeatured",
                !item.isFeatured
              )
            }
          >
            <Star size={14} />
          </LabelButton>

          <LabelButton
            active={item.isTrending}
            title="Trending"
            onClick={() =>
              onFlag(
                item._id,
                "isTrending",
                !item.isTrending
              )
            }
          >
            <TrendingUp size={14} />
          </LabelButton>

        </div>

      </td>

      {/* DATE */}

      <td className="px-4 py-4">

        <div className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-gray-500">

          <CalendarDays
            size={14}
            className="text-gray-400"
          />

          {formatDate(
            item.publishedAt ||
              item.createdAt
          )}

        </div>

      </td>

      {/* ACTION */}

      <td className="px-5 py-4">

        <div className="flex justify-end gap-1">

          <ActionButton
            title="Preview"
            onClick={onPreview}
          >
            <Eye size={15} />
          </ActionButton>

          <ActionButton
            title="Edit"
            onClick={onEdit}
          >
            <Pencil size={15} />
          </ActionButton>

          <ActionButton
            danger
            title="Delete"
            onClick={onDelete}
          >
            <Trash2 size={15} />
          </ActionButton>

        </div>

      </td>

    </tr>
  );
};

// =====================================================
// MOBILE CARD
// =====================================================

const MobileNewsCard = ({
  item,
  formatDate,
  onEdit,
  onPreview,
  onDelete,
  onStatus,
  onFlag,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-red-100 hover:shadow-md">

      <div className="flex gap-3">

        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">

          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <FileText size={18} />
            </div>
          )}

        </div>

        <div className="min-w-0 flex-1">

          <div className="mb-1 flex items-start justify-between gap-2">

            <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600">
              {getCategoryLabel(
                item.category
              )}
            </span>

            <button
              onClick={onEdit}
              className="text-gray-400 transition hover:text-[#b91c1c]"
              title="Edit"
            >
              <MoreVertical size={17} />
            </button>

          </div>

          <h4 className="line-clamp-2 text-sm font-bold leading-5 text-gray-900">
            {item.title}
          </h4>

        </div>

      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">

        <button
          onClick={onStatus}
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            item.status === "published"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {item.status === "published"
            ? "Published"
            : "Draft"}
        </button>

        <div className="flex items-center gap-1">

          <LabelButton
            active={item.isBreaking}
            title="Breaking"
            onClick={() =>
              onFlag(
                item._id,
                "isBreaking",
                !item.isBreaking
              )
            }
          >
            <Flame size={13} />
          </LabelButton>

          <LabelButton
            active={item.isFeatured}
            title="Featured"
            onClick={() =>
              onFlag(
                item._id,
                "isFeatured",
                !item.isFeatured
              )
            }
          >
            <Star size={13} />
          </LabelButton>

          <LabelButton
            active={item.isTrending}
            title="Trending"
            onClick={() =>
              onFlag(
                item._id,
                "isTrending",
                !item.isTrending
              )
            }
          >
            <TrendingUp size={13} />
          </LabelButton>

          <ActionButton
            title="Preview"
            onClick={onPreview}
          >
            <Eye size={14} />
          </ActionButton>

          <ActionButton
            title="Edit"
            onClick={onEdit}
          >
            <Pencil size={14} />
          </ActionButton>

          <ActionButton
            danger
            title="Delete"
            onClick={onDelete}
          >
            <Trash2 size={14} />
          </ActionButton>

        </div>

      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-gray-400">

        <CalendarDays size={12} />

        {formatDate(
          item.publishedAt ||
            item.createdAt
        )}

      </div>

    </div>
  );
};

// =====================================================
// CATEGORY LABEL
// =====================================================

const getCategoryLabel = (
  category
) => {
  const found =
    categories.find(
      (item) =>
        item.value === category
    );

  return (
    found?.label ||
    category ||
    "Unknown"
  );
};

// =====================================================
// LABEL BUTTON
// =====================================================

const LabelButton = ({
  active,
  onClick,
  title,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
        active
          ? "border-[#b91c1c] bg-[#b91c1c] text-white shadow-sm"
          : "border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
      }`}
    >
      {children}
    </button>
  );
};

// =====================================================
// ACTION BUTTON
// =====================================================

const ActionButton = ({
  danger,
  title,
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
        danger
          ? "text-gray-400 hover:bg-red-50 hover:text-red-600"
          : "text-gray-400 hover:bg-red-50 hover:text-[#b91c1c]"
      }`}
    >
      {children}
    </button>
  );
};

// =====================================================
// DELETE MODAL
// =====================================================

const DeleteModal = ({
  news,
  onClose,
  onDelete,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <Trash2 size={21} />
        </div>

        <h3 className="text-lg font-black text-gray-950">
          Delete this news?
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Are you sure you want to
          delete this article? This
          action cannot be undone.
        </p>

        <div className="mt-3 rounded-xl bg-gray-50 p-3">

          <p className="line-clamp-2 text-sm font-bold text-gray-800">
            {news?.title}
          </p>

        </div>

        <div className="mt-6 flex justify-end gap-2">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="rounded-xl bg-[#b91c1c] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-800"
          >
            Delete News
          </button>

        </div>

      </div>

    </div>
  );
};

// =====================================================
// PREVIEW MODAL
// =====================================================

const PreviewModal = ({
  news,
  formatDate,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">

      <div className="mx-auto my-8 max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

          <div>

            <p className="text-[10px] font-black tracking-widest text-[#b91c1c]">
              ARTICLE PREVIEW
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Admin preview
            </p>

          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-red-50 hover:text-[#b91c1c]"
          >
            <X size={18} />
          </button>

        </div>

        {/* IMAGE */}

        {news.thumbnail && (
          <div className="aspect-[16/7] overflow-hidden bg-gray-100">

            <img
              src={news.thumbnail}
              alt={news.title}
              className="h-full w-full object-cover"
            />

          </div>
        )}

        {/* CONTENT */}

        <article className="p-5 sm:p-8">

          <div className="mb-4 flex flex-wrap items-center gap-2">

            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">
              {getCategoryLabel(
                news.category
              )}
            </span>

            {news.isBreaking && (
              <span className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                <Flame size={12} />
                Breaking
              </span>
            )}

            {news.isFeatured && (
              <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">
                <Star size={12} />
                Featured
              </span>
            )}

            {news.isTrending && (
              <span className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                <TrendingUp size={12} />
                Trending
              </span>
            )}

          </div>

          <h1 className="text-2xl font-black leading-tight tracking-tight text-gray-950 sm:text-4xl">
            {news.title}
          </h1>

          {news.shortDescription && (
            <p className="mt-4 text-base leading-7 text-gray-500">
              {news.shortDescription}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-5 text-xs font-medium text-gray-400">

            <span className="flex items-center gap-1.5">

              <CalendarDays size={14} />

              {formatDate(
                news.publishedAt ||
                  news.createdAt
              )}

            </span>

          </div>

          <div
            className="prose prose-sm mt-7 max-w-none text-gray-700 sm:prose-base"
            dangerouslySetInnerHTML={{
              __html:
                news.content || "",
            }}
          />

        </article>

      </div>

    </div>
  );
};

// =====================================================
// LOADING
// =====================================================

const LoadingSkeleton = () => {
  return (
    <div className="divide-y divide-gray-100">

      {Array.from(
        { length: 7 },
        (_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center gap-4 px-5 py-4"
          >

            <div className="h-16 w-24 rounded-xl bg-gray-200" />

            <div className="flex-1">

              <div className="h-3 w-2/3 rounded bg-gray-200" />

              <div className="mt-2 h-2.5 w-1/2 rounded bg-gray-100" />

            </div>

            <div className="hidden h-7 w-20 rounded-full bg-gray-100 md:block" />

            <div className="hidden h-7 w-20 rounded-full bg-gray-100 md:block" />

          </div>
        )
      )}

    </div>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = ({
  search,
  onClear,
}) => {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center px-5 text-center">

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#b91c1c]">
        <Search size={23} />
      </div>

      <h3 className="text-base font-black text-gray-900">

        {search
          ? "No news found"
          : "No news available"}

      </h3>

      <p className="mt-1 max-w-sm text-sm text-gray-500">

        {search
          ? "Try changing your search or filters."
          : "There are no news articles available yet."}

      </p>

      <button
        onClick={onClear}
        className="mt-4 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-800"
      >
        Clear Filters
      </button>

    </div>
  );
};

export default AdminNews;

