import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  FiArrowUpRight,
  FiClock,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";

/* =========================================================
   API
========================================================= */

const API_URL = "http://localhost:5000/api/news";

/* =========================================================
   CATEGORY CONFIG
========================================================= */

const categories = [
  {
    slug: "all",
    name: "सभी",
  },
  {
    slug: "india",
    name: "भारत",
  },
  {
    slug: "world",
    name: "दुनिया",
  },
  {
    slug: "business",
    name: "बिजनेस",
  },
  {
    slug: "technology",
    name: "टेक्नोलॉजी",
  },
  {
    slug: "sports",
    name: "खेल",
  },
  {
    slug: "entertainment",
    name: "मनोरंजन",
  },
  {
    slug: "education",
    name: "शिक्षा",
  },
];

/* =========================================================
   CATEGORY COLORS
========================================================= */

const categoryColors = {
  भारत: "bg-orange-50 text-orange-700",
  दुनिया: "bg-indigo-50 text-indigo-700",
  बिजनेस: "bg-emerald-50 text-emerald-700",
  टेक्नोलॉजी: "bg-blue-50 text-blue-700",
  खेल: "bg-purple-50 text-purple-700",
  मनोरंजन: "bg-pink-50 text-pink-700",
  शिक्षा: "bg-cyan-50 text-cyan-700",
};

/* =========================================================
   BADGE
========================================================= */

const Badge = ({ category }) => {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-black tracking-wide ${
        categoryColors[category] || "bg-gray-100 text-gray-700"
      }`}
    >
      {category || "समाचार"}
    </span>
  );
};

/* =========================================================
   TIME FORMAT
========================================================= */

const formatTime = (date) => {
  if (!date) return "";

  const newsDate = new Date(date);

  if (Number.isNaN(newsDate.getTime())) {
    return "";
  }

  const now = new Date();

  const diff = Math.floor(
    (now.getTime() - newsDate.getTime()) / 1000
  );

  if (diff < 60) {
    return "अभी";
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)} मिनट पहले`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)} घंटे पहले`;
  }

  if (diff < 604800) {
    return `${Math.floor(diff / 86400)} दिन पहले`;
  }

  return newsDate.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   AUTHOR
========================================================= */

const getAuthor = (item) => {
  if (!item?.author) {
    return "News24";
  }

  if (typeof item.author === "object") {
    return item.author.name || "News24";
  }

  return item.author;
};

/* =========================================================
   DATE SORT
========================================================= */

const getDateValue = (item) => {
  const date =
    item?.publishedAt ||
    item?.createdAt ||
    item?.updatedAt;

  const value = new Date(date).getTime();

  return Number.isNaN(value) ? 0 : value;
};

/* =========================================================
   LATEST NEWS PAGE
========================================================= */

const LatestNews = () => {
  const [news, setNews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [visibleCount, setVisibleCount] = useState(9);

  /* =======================================================
     FETCH ALL NEWS
  ======================================================= */

  const fetchNews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("News fetch failed");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "News load नहीं हुई"
        );
      }

      const allNews = Array.isArray(data.news)
        ? data.news
        : [];

      /* newest first */

      allNews.sort(
        (a, b) => getDateValue(b) - getDateValue(a)
      );

      setNews(allNews);
    } catch (err) {
      console.error("Latest News Error:", err);

      setError(
        err.message ||
          "News load करने में समस्या हुई"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  /* =======================================================
     CATEGORY FILTER
  ======================================================= */

  const filteredNews = useMemo(() => {
    if (activeCategory === "all") {
      return news;
    }

    const selectedCategory = categories.find(
      (item) => item.slug === activeCategory
    );

    if (!selectedCategory) {
      return news;
    }

    return news.filter(
      (item) =>
        item.category === selectedCategory.name
    );
  }, [news, activeCategory]);

  /* =======================================================
     FEATURED NEWS
  ======================================================= */

  const featuredNews = useMemo(() => {
    if (!filteredNews.length) {
      return null;
    }

    return (
      filteredNews.find(
        (item) => item.isTrending
      ) || filteredNews[0]
    );
  }, [filteredNews]);

  /* =======================================================
     GRID NEWS
  ======================================================= */

  const gridNews = useMemo(() => {
    if (!featuredNews) {
      return [];
    }

    return filteredNews
      .filter(
        (item) => item._id !== featuredNews._id
      )
      .slice(0, visibleCount);
  }, [
    filteredNews,
    featuredNews,
    visibleCount,
  ]);

  /* =======================================================
     RESET LOAD MORE ON CATEGORY CHANGE
  ======================================================= */

  useEffect(() => {
    setVisibleCount(9);
  }, [activeCategory]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <main className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-[#b91c1c]" />

              <p className="mt-5 text-sm font-bold text-gray-500">
                ताजा खबरें लोड हो रही हैं...
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <main className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
            <h1 className="text-3xl font-black text-[#b91c1c]">
              खबरें लोड नहीं हो सकीं
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-600">
              {error}
            </p>

            <button
              onClick={() => fetchNews()}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#b91c1c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#991b1b]"
            >
              <FiRefreshCw size={15} />
              फिर से कोशिश करें
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (!news.length) {
    return (
      <div className="min-h-screen bg-white text-[#111827]">
        <Header />

        <main className="mx-auto max-w-[1400px] px-5 py-12 lg:px-8">
          <div className="border-b-2 border-gray-900 pb-7">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
              न्यूज़रूम
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
              Latest News
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              भारत और दुनिया की ताजा खबरें।
            </p>
          </div>

          <div className="py-24 text-center">
            <h2 className="text-2xl font-black">
              अभी कोई खबर उपलब्ध नहीं है
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Admin panel से खबर publish होने के बाद
              यहां दिखाई देगी।
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#b91c1c] px-6 py-3 text-sm font-bold text-white"
            >
              होम पर जाएं
              <FiChevronRight size={16} />
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* =======================================================
     MAIN PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Header />

      <main>

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="mx-auto max-w-[1400px] px-5 pt-8 lg:px-8 lg:pt-12">
          <div className="flex flex-col gap-5 border-b-2 border-gray-900 pb-7 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                न्यूज़रूम / Latest
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
                ताज़ा खबरें
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                देश, दुनिया, बिजनेस, टेक्नोलॉजी,
                खेल और मनोरंजन की हर जरूरी खबर एक जगह।
              </p>
            </div>

            <button
              onClick={() => fetchNews(true)}
              disabled={refreshing}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-black text-gray-700 transition hover:border-[#b91c1c] hover:text-[#b91c1c] md:self-auto"
            >
              <FiRefreshCw
                size={14}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "अपडेट हो रहा है..."
                : "खबरें अपडेट करें"}
            </button>

          </div>
        </section>

       
        {/* =================================================
            FEATURED
        ================================================= */}

        {featuredNews && (
          <section className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-10">

            <Link
              to={`/news/${featuredNews._id}`}
              className="group relative block min-h-[430px] overflow-hidden rounded-2xl bg-gray-900 shadow-sm md:min-h-[550px]"
            >

              <img
                src={featuredNews.thumbnail}
                alt={featuredNews.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* TRENDING LABEL */}

              {featuredNews.isTrending && (
                <div className="absolute left-5 top-5 rounded-md bg-[#b91c1c] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white md:left-7 md:top-7">
                  Trending
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-10 lg:p-12">

                <Badge
                  category={featuredNews.category}
                />

                <h2 className="mt-4 max-w-5xl text-3xl font-black leading-[1.12] md:text-4xl lg:text-5xl">
                  {featuredNews.title}
                </h2>

                {featuredNews.shortDescription && (
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-200 md:text-base">
                    {featuredNews.shortDescription}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-gray-300">

                  <span className="font-bold text-white">
                    {getAuthor(featuredNews)}
                  </span>

                  <span className="text-gray-500">
                    •
                  </span>

                  <span className="flex items-center gap-1.5">
                    <FiClock size={13} />
                    {formatTime(
                      featuredNews.publishedAt
                    )}
                  </span>

                  <span className="ml-1 inline-flex items-center gap-1 font-bold text-white transition group-hover:text-red-300">
                    पूरी खबर
                    <FiArrowUpRight size={14} />
                  </span>

                </div>

              </div>
            </Link>
          </section>
        )}

        {/* =================================================
            LATEST GRID
        ================================================= */}

        <section className="mx-auto max-w-[1400px] px-5 pb-14 lg:px-8">

          <div className="mb-7 flex items-end justify-between border-b-2 border-gray-900 pb-3">

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                Latest Updates
              </p>

              <h2 className="mt-1 text-2xl font-black md:text-3xl">
                {activeCategory === "all"
                  ? "आज की ताज़ा खबरें"
                  : `${
                      categories.find(
                        (item) =>
                          item.slug ===
                          activeCategory
                      )?.name || ""
                    } की खबरें`}
              </h2>
            </div>

            <span className="text-sm font-bold text-gray-400">
              {filteredNews.length} खबरें
            </span>

          </div>

          {gridNews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

              {gridNews.map((item) => (
                <Link
                  key={item._id}
                  to={`/news/${item._id}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
                >

                  {/* IMAGE */}

                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">

                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-4 top-4">
                      <Badge
                        category={item.category}
                      />
                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-5">

                    <h3 className="line-clamp-2 text-xl font-black leading-tight transition group-hover:text-[#b91c1c]">
                      {item.title}
                    </h3>

                    {item.shortDescription && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                        {item.shortDescription}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-400">

                      <span className="font-bold text-gray-600">
                        {getAuthor(item)}
                      </span>

                      <span>•</span>

                      <span className="flex items-center gap-1">
                        <FiClock size={12} />
                        {formatTime(
                          item.publishedAt
                        )}
                      </span>

                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                      <span className="text-xs font-bold text-gray-400">
                        पूरी खबर पढ़ें
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-[#b91c1c] transition group-hover:bg-red-50">
                        <FiArrowUpRight
                          size={16}
                        />
                      </span>

                    </div>

                  </div>
                </Link>
              ))}

            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 p-12 text-center">
              <h3 className="text-xl font-black">
                इस कैटेगरी में खबर नहीं मिली
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                दूसरी category चुनकर देखें।
              </p>
            </div>
          )}

          {/* =================================================
              LOAD MORE
          ================================================= */}

          {gridNews.length <
            filteredNews.length - 1 && (
            <div className="mt-10 text-center">

              <button
                onClick={() =>
                  setVisibleCount(
                    (prev) => prev + 9
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-7 py-3 text-sm font-black text-gray-800 transition hover:border-[#b91c1c] hover:text-[#b91c1c]"
              >
                और खबरें देखें
                <FiChevronRight size={16} />
              </button>

            </div>
          )}

        </section>

        {/* =================================================
            CATEGORY QUICK LINKS
        ================================================= */}

        <section className="mx-auto max-w-[1400px] px-5 pb-12 lg:px-8">

          <div className="rounded-2xl bg-gray-50 p-6 md:p-8">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                  Explore
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  अपनी पसंद की खबरें पढ़ें
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  अलग-अलग कैटेगरी की ताजा खबरें देखें।
                </p>
              </div>

              <div className="flex flex-wrap gap-2">

                {categories
                  .filter(
                    (category) =>
                      category.slug !== "all"
                  )
                  .map((category) => (
                    <Link
                      key={category.slug}
                      to={`/category/${category.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:border-[#b91c1c] hover:text-[#b91c1c]"
                    >
                      {category.name}
                      <FiArrowUpRight size={13} />
                    </Link>
                  ))}

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            CTA
        ================================================= */}

        <section className="mx-auto max-w-[1400px] px-5 pb-12 lg:px-8">

          <div className="relative overflow-hidden rounded-2xl bg-[#b91c1c]">

            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-black/10" />

            <div className="relative flex flex-col items-start justify-between gap-7 px-6 py-10 md:px-10 md:py-12 lg:flex-row lg:items-center">

              <div className="max-w-2xl text-white">

                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-200">
                  News24
                </p>

                <h2 className="mt-2 text-2xl font-black md:text-3xl">
                  कोई जरूरी खबर मिस न करें।
                </h2>

                <p className="mt-3 text-sm leading-6 text-red-100">
                  भारत और दुनिया की हर बड़ी खबर
                  सबसे पहले पढ़ें।
                </p>

              </div>

              <Link
                to="/"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-black text-[#b91c1c] transition hover:bg-gray-100"
              >
                होम पर जाएं
                <FiChevronRight size={17} />
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
};

export default LatestNews;

