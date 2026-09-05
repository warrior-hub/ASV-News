import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  FiSearch,
  FiClock,
  FiArrowUpRight,
  FiX,
  FiChevronLeft,
} from "react-icons/fi";

import { FaFire } from "react-icons/fa6";

/* =========================================================
   API
========================================================= */

const API_URL = "https://asv-news.onrender.com/api/news";

/* =========================================================
   CATEGORY COLORS
========================================================= */

const categoryColors = {
  india: "bg-orange-50 text-orange-700",
  world: "bg-indigo-50 text-indigo-700",
  politics: "bg-red-50 text-red-700",
  business: "bg-emerald-50 text-emerald-700",
  technology: "bg-blue-50 text-blue-700",
  sports: "bg-purple-50 text-purple-700",
  entertainment: "bg-pink-50 text-pink-700",
  health: "bg-green-50 text-green-700",
  education: "bg-cyan-50 text-cyan-700",

  भारत: "bg-orange-50 text-orange-700",
  दुनिया: "bg-indigo-50 text-indigo-700",
  राजनीति: "bg-red-50 text-red-700",
  बिजनेस: "bg-emerald-50 text-emerald-700",
  टेक्नोलॉजी: "bg-blue-50 text-blue-700",
  खेल: "bg-purple-50 text-purple-700",
  मनोरंजन: "bg-pink-50 text-pink-700",
  स्वास्थ्य: "bg-green-50 text-green-700",
  शिक्षा: "bg-cyan-50 text-cyan-700",
};

/* =========================================================
   CATEGORY LABEL
========================================================= */

const categoryLabels = {
  india: "भारत",
  world: "दुनिया",
  politics: "राजनीति",
  business: "बिजनेस",
  technology: "टेक्नोलॉजी",
  sports: "खेल",
  entertainment: "मनोरंजन",
  health: "स्वास्थ्य",
  education: "शिक्षा",
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   FORMAT TIME
========================================================= */

const formatTime = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleTimeString("hi-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

/* =========================================================
   RELATIVE TIME
========================================================= */

const formatRelativeTime = (date) => {
  if (!date) return "";

  const newsDate = new Date(date);

  if (Number.isNaN(newsDate.getTime())) return "";

  const now = new Date();
  const diff = Math.floor((now - newsDate) / 1000);

  if (diff < 60) return "अभी";

  if (diff < 3600) {
    return `${Math.floor(diff / 60)} मिनट पहले`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)} घंटे पहले`;
  }

  if (diff < 604800) {
    return `${Math.floor(diff / 86400)} दिन पहले`;
  }

  return formatDate(date);
};

/* =========================================================
   IMAGE FALLBACK
========================================================= */

const handleImageError = (event) => {
  event.currentTarget.src =
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";
};

/* =========================================================
   BADGE
========================================================= */

const Badge = ({ category }) => {
  const label = categoryLabels[category] || category || "अन्य";

  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-1.5 text-[10px] font-black tracking-wide ${
        categoryColors[category] || "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
};

/* =========================================================
   SEARCH RESULT CARD
========================================================= */

const SearchResultCard = ({ item }) => {
  return (
    <Link
      to={`/news/${item._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl md:flex-row"
    >
      {/* IMAGE */}

      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-gray-100 md:h-auto md:w-[300px] lg:w-[340px]">
        <img
          src={item.thumbnail}
          alt={item.title}
          onError={handleImageError}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {item.isTrending && (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#b91c1c] px-3 py-1.5 text-[10px] font-black text-white shadow-lg">
            <FaFire />
            ट्रेंडिंग
          </div>
        )}
      </div>

      {/* CONTENT */}

      <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6 lg:p-7">
        <div>
          <Badge category={item.category} />
        </div>

        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight text-gray-950 transition group-hover:text-[#b91c1c] md:text-2xl">
          {item.title}
        </h2>

        {item.shortDescription && (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500 md:text-[15px]">
            {item.shortDescription}
          </p>
        )}
      </div>

      {/* META */}

      <div className="flex items-center border-t border-gray-100 px-5 py-4 md:absolute md:bottom-0 md:left-[340px] md:right-0 md:border-t-0 md:px-7">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FiClock size={12} />
            {formatDate(item.publishedAt)}
          </span>

          <span>•</span>

          <span>{formatTime(item.publishedAt)}</span>

          <span className="hidden sm:inline">•</span>

          <span className="hidden items-center gap-1 font-bold text-[#b91c1c] sm:flex">
            पढ़ें
            <FiArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
};

/* =========================================================
   SEARCH PAGE
========================================================= */

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get("q") || "";

  const [input, setInput] = useState(urlQuery);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(Boolean(urlQuery));
  const [error, setError] = useState("");

  /* =======================================================
     KEEP INPUT SYNC WITH URL
  ======================================================= */

  useEffect(() => {
    setInput(urlQuery);
  }, [urlQuery]);

  /* =======================================================
     SEARCH API
  ======================================================= */

  useEffect(() => {
    const searchNews = async () => {
      if (!urlQuery.trim()) {
        setResults([]);
        setSearched(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/search?q=${encodeURIComponent(urlQuery)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Search करने में समस्या हुई"
          );
        }

        setResults(data.news || []);
        setSearched(true);
      } catch (err) {
        console.error("Search News Error:", err);

        setResults([]);

        setError(
          err.message || "Search करने में समस्या हुई"
        );
      } finally {
        setLoading(false);
      }
    };

    searchNews();
  }, [urlQuery]);

  /* =======================================================
     SUBMIT SEARCH
  ======================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    const query = input.trim();

    if (!query) {
      setSearchParams({});
      return;
    }

    setSearchParams({
      q: query,
    });
  };

  /* =======================================================
     CLEAR SEARCH
  ======================================================= */

  const clearSearch = () => {
    setInput("");
    setSearchParams({});
  };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Header />

      <main>
        {/* =================================================
            SEARCH HERO
        ================================================= */}

        <section className="border-b border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-[1100px] px-5 py-12 lg:px-8 lg:py-16">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b91c1c]">
                न्यूज़रूम सर्च
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 md:text-4xl lg:text-5xl">
                खबरें खोजें
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
                अपनी पसंद की खबर, विषय या कहानी खोजें।
              </p>
            </div>

            {/* SEARCH FORM */}

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 max-w-3xl"
            >
              <div className="flex h-14 items-center overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-sm transition focus-within:border-[#b91c1c] focus-within:shadow-lg">
                <FiSearch
                  size={20}
                  className="ml-5 shrink-0 text-gray-400"
                />

                <input
                  type="text"
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  placeholder="खबर, विषय या कहानी खोजें..."
                  className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 md:text-base"
                />

                {input && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Clear search"
                  >
                    <FiX size={17} />
                  </button>
                )}

                <button
                  type="submit"
                  className="mr-1.5 h-11 shrink-0 rounded-xl bg-[#b91c1c] px-5 text-sm font-bold text-white transition hover:bg-[#991b1b] md:px-7"
                >
                  खोजें
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* =================================================
            RESULTS
        ================================================= */}

        <section className="mx-auto max-w-[1100px] px-5 py-10 lg:px-8 lg:py-14">
          {/* NO QUERY */}

          {!urlQuery && !loading && (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <FiSearch size={25} />
              </div>

              <h2 className="mt-5 text-xl font-black text-gray-900">
                खबर खोजने के लिए ऊपर सर्च करें
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                जैसे: भारत, राजनीति, खेल, टेक्नोलॉजी आदि
              </p>
            </div>
          )}

          {/* SEARCHING */}

          {loading && (
            <div className="py-16 text-center">
              <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-[#b91c1c]" />

              <p className="mt-5 text-sm font-bold text-gray-500">
                खबरें खोजी जा रही हैं...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
              <h2 className="text-xl font-black text-gray-900">
                कुछ समस्या हुई
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                {error}
              </p>

              <button
                onClick={() => {
                  if (urlQuery) {
                    setSearchParams({
                      q: urlQuery,
                    });
                  }
                }}
                className="mt-5 rounded-xl bg-[#b91c1c] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#991b1b]"
              >
                फिर से कोशिश करें
              </button>
            </div>
          )}

          {/* RESULTS HEADER */}

          {!loading && !error && searched && (
            <div className="mb-7 flex flex-col gap-3 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                  Search Results
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-950 md:text-3xl">
                  "{urlQuery}"
                </h2>
              </div>

              <p className="text-sm font-semibold text-gray-500">
                {results.length}{" "}
                {results.length === 1
                  ? "परिणाम मिला"
                  : "परिणाम मिले"}
              </p>
            </div>
          )}

          {/* RESULTS LIST */}

          {!loading && !error && results.length > 0 && (
            <div className="space-y-5">
              {results.map((item) => (
                <SearchResultCard
                  key={item._id}
                  item={item}
                />
              ))}
            </div>
          )}

          {/* NO RESULTS */}

          {!loading &&
            !error &&
            searched &&
            results.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <FiSearch size={25} />
                </div>

                <h2 className="mt-5 text-xl font-black text-gray-900">
                  कोई खबर नहीं मिली
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  "{urlQuery}" के लिए कोई परिणाम उपलब्ध नहीं है।
                  कृपया कोई दूसरा keyword डालकर फिर से खोजें।
                </p>

                <button
                  onClick={clearSearch}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b91c1c]"
                >
                  <FiChevronLeft size={16} />
                  नई खोज करें
                </button>
              </div>
            )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Search;

