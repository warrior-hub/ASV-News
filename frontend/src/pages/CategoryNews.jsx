import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  FiArrowUpRight,
  FiClock,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api/news";

/* =========================================================
   CATEGORY CONFIG
========================================================= */

const categories = {
  india: {
    name: "भारत",
    apiName: "भारत",
    description: "भारत से जुड़ी ताजा और महत्वपूर्ण खबरें",
  },

  politics: {
    name: "राजनीति",
    apiName: "राजनीति",
    description: "राजनीति, चुनाव, सरकार और नेताओं से जुड़ी ताजा खबरें",
  },

  world: {
    name: "दुनिया",
    apiName: "दुनिया",
    description: "देश-दुनिया की बड़ी और महत्वपूर्ण खबरें",
  },

  business: {
    name: "बिजनेस",
    apiName: "बिजनेस",
    description: "बिजनेस, अर्थव्यवस्था, कंपनियों और बाजार की ताजा खबरें",
  },

  technology: {
    name: "टेक्नोलॉजी",
    apiName: "टेक्नोलॉजी",
    description: "टेक्नोलॉजी, AI, गैजेट्स और डिजिटल दुनिया की खबरें",
  },

  sports: {
    name: "खेल",
    apiName: "खेल",
    description: "क्रिकेट, फुटबॉल और खेल जगत की सभी बड़ी खबरें",
  },

  entertainment: {
    name: "मनोरंजन",
    apiName: "मनोरंजन",
    description: "फिल्म, टीवी, वेब सीरीज और मनोरंजन जगत की खबरें",
  },

  education: {
    name: "शिक्षा",
    apiName: "शिक्षा",
    description: "शिक्षा, परीक्षा, रिजल्ट और करियर से जुड़ी खबरें",
  },

  health: {
    name: "स्वास्थ्य",
    apiName: "स्वास्थ्य",
    description: "स्वास्थ्य, फिटनेस और मेडिकल जगत से जुड़ी खबरें",
  },

  lifestyle: {
    name: "लाइफस्टाइल",
    apiName: "लाइफस्टाइल",
    description: "लाइफस्टाइल, फैशन, खान-पान और रोजमर्रा की जिंदगी से जुड़ी खबरें",
  },

  science: {
    name: "विज्ञान",
    apiName: "विज्ञान",
    description: "विज्ञान, अंतरिक्ष, रिसर्च और नई खोजों की खबरें",
  },

  auto: {
    name: "ऑटोमोबाइल",
    apiName: "ऑटोमोबाइल",
    description: "कार, बाइक, इलेक्ट्रिक वाहन और ऑटोमोबाइल की ताजा खबरें",
  },

  crime: {
    name: "क्राइम",
    apiName: "क्राइम",
    description: "अपराध, पुलिस और देश-दुनिया से जुड़ी क्राइम खबरें",
  },

  weather: {
    name: "मौसम",
    apiName: "मौसम",
    description: "मौसम, बारिश, गर्मी, ठंड और मौसम विभाग की ताजा जानकारी",
  },

  jobs: {
    name: "नौकरी",
    apiName: "नौकरी",
    description: "सरकारी नौकरी, प्राइवेट जॉब और रोजगार से जुड़ी खबरें",
  },

  agriculture: {
    name: "कृषि",
    apiName: "कृषि",
    description: "किसानों, खेती, फसल और कृषि क्षेत्र से जुड़ी खबरें",
  },

  religion: {
    name: "धर्म",
    apiName: "धर्म",
    description: "धर्म, आस्था, मंदिर और धार्मिक आयोजनों से जुड़ी खबरें",
  },

  viral: {
    name: "वायरल",
    apiName: "वायरल",
    description: "सोशल मीडिया और इंटरनेट पर वायरल हो रही खबरें",
  },

  trending: {
    name: "ट्रेंडिंग",
    apiName: "ट्रेंडिंग",
    description: "इस समय सबसे ज्यादा चर्चा में रहने वाली खबरें",
  },

  local: {
    name: "लोकल",
    apiName: "लोकल",
    description: "स्थानीय शहर, जिले और आसपास की ताजा खबरें",
  },

  opinion: {
    name: "ओपिनियन",
    apiName: "ओपिनियन",
    description: "विशेषज्ञों और लेखकों की राय और विचार",
  },

  special: {
    name: "स्पेशल",
    apiName: "स्पेशल",
    description: "खास रिपोर्ट, एक्सक्लूसिव स्टोरी और विशेष खबरें",
  },
};


/* =========================================================
   CATEGORY COLORS
========================================================= */


const categoryColors = {
  भारत: "bg-orange-50 text-orange-700",
  राजनीति: "bg-red-50 text-red-700",
  दुनिया: "bg-indigo-50 text-indigo-700",
  बिजनेस: "bg-emerald-50 text-emerald-700",
  टेक्नोलॉजी: "bg-blue-50 text-blue-700",
  खेल: "bg-purple-50 text-purple-700",
  मनोरंजन: "bg-pink-50 text-pink-700",
  शिक्षा: "bg-cyan-50 text-cyan-700",
  स्वास्थ्य: "bg-green-50 text-green-700",
  लाइफस्टाइल: "bg-rose-50 text-rose-700",
  विज्ञान: "bg-violet-50 text-violet-700",
  ऑटोमोबाइल: "bg-slate-50 text-slate-700",
  क्राइम: "bg-red-50 text-red-700",
  मौसम: "bg-sky-50 text-sky-700",
  नौकरी: "bg-teal-50 text-teal-700",
  कृषि: "bg-lime-50 text-lime-700",
  धर्म: "bg-amber-50 text-amber-700",
  वायरल: "bg-fuchsia-50 text-fuchsia-700",
  ट्रेंडिंग: "bg-yellow-50 text-yellow-700",
  लोकल: "bg-orange-50 text-orange-700",
  ओपिनियन: "bg-gray-100 text-gray-700",
  स्पेशल: "bg-stone-100 text-stone-700",
};


/* =========================================================
   BADGE
========================================================= */

const Badge = ({ category }) => {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-black tracking-wide ${
        categoryColors[category] ||
        "border-gray-200 bg-gray-100 text-gray-700"
      }`}
    >
      {category || "न्यूज़"}
    </span>
  );
};

/* =========================================================
   IMAGE FALLBACK
========================================================= */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";

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

  if (diff < 0) {
    return newsDate.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

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
   NORMALIZE NEWS
========================================================= */

const normalizeNews = (item) => {
  if (!item) return null;

  return {
    ...item,

    _id:
      item._id ||
      item.id ||
      Math.random().toString(36).substring(2),

    title: item.title || "बिना शीर्षक की खबर",

    category: item.category || "",

    shortDescription:
      item.shortDescription ||
      item.description ||
      item.excerpt ||
      "",

    thumbnail:
      item.thumbnail ||
      item.image ||
      item.imageUrl ||
      FALLBACK_IMAGE,

    publishedAt:
      item.publishedAt ||
      item.createdAt ||
      item.updatedAt ||
      null,
  };
};

/* =========================================================
   CATEGORY NEWS PAGE
========================================================= */

const CategoryNews = () => {
  const { category: categorySlug } = useParams();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  /* =======================================================
     CATEGORY INFO
  ======================================================= */

  const categoryInfo = useMemo(() => {
    const slug = categorySlug?.toLowerCase();

    return (
      categories[slug] || {
        name: categorySlug || "Category",
        apiName: categorySlug || "",
        description: "इस श्रेणी की ताजा खबरें",
      }
    );
  }, [categorySlug]);

  /* =======================================================
     FETCH CATEGORY NEWS
     
     FIRST:
     /category/भारत

     FALLBACK:
     /api/news
     और frontend पर category filter
  ======================================================= */

  const fetchCategoryNews = async () => {
    try {
      setLoading(true);
      setError("");
      setUsingFallback(false);

      if (!categorySlug) {
        throw new Error("Category नहीं मिली");
      }

      const apiCategory = categoryInfo.apiName;

      console.log(
        "Fetching category:",
        apiCategory
      );

      /* ---------------------------------------------------
         STEP 1: CATEGORY API
      --------------------------------------------------- */

      let response = await fetch(
        `${API_URL}/category/${encodeURIComponent(
          apiCategory
        )}`
      );

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      /*
        अगर backend category endpoint सही response देता है
        तो सीधे वही news use करेंगे।
      */

      if (
        response.ok &&
        data?.success &&
        Array.isArray(data.news)
      ) {
        const normalized = data.news
          .map(normalizeNews)
          .filter(Boolean);

        setNews(normalized);
        return;
      }

      /* ---------------------------------------------------
         STEP 2: FALLBACK - ALL NEWS
         
         अगर /category/:category endpoint नहीं है
         या category format अलग है तो सभी news लाकर
         frontend पर filter करेंगे।
      --------------------------------------------------- */

      console.warn(
        "Category API failed. Trying all news fallback..."
      );

      response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "News API से response नहीं मिला"
        );
      }

      data = await response.json();

      if (!data?.success) {
        throw new Error(
          data?.message || "News load नहीं हुई"
        );
      }

      const allNews = Array.isArray(data.news)
        ? data.news
        : [];

      /*
        Hindi category और slug दोनों से match करेंगे।
        
        Example:
        भारत === india
        टेक्नोलॉजी === technology
      */

      const slugMap = {
        india: ["भारत", "india"],
        world: ["दुनिया", "world"],
        business: ["बिजनेस", "business"],
        technology: ["टेक्नोलॉजी", "technology", "tech"],
        sports: ["खेल", "sports"],
        entertainment: ["मनोरंजन", "entertainment"],
        education: ["शिक्षा", "education"],
      };

      const allowedCategories =
        slugMap[categorySlug?.toLowerCase()] || [
          apiCategory,
        ];

      const filteredNews = allNews.filter((item) => {
        const itemCategory = String(
          item?.category || ""
        )
          .trim()
          .toLowerCase();

        return allowedCategories.some(
          (allowed) =>
            String(allowed).trim().toLowerCase() ===
            itemCategory
        );
      });

      console.log(
        "All news:",
        allNews.length,
        "Filtered:",
        filteredNews.length,
        "Category:",
        allowedCategories
      );

      setUsingFallback(true);

      setNews(
        filteredNews
          .map(normalizeNews)
          .filter(Boolean)
      );
    } catch (err) {
      console.error(
        "Category News Error:",
        err
      );

      setError(
        err.message ||
          "News load करने में समस्या हुई"
      );

      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     EFFECT
  ======================================================= */

  useEffect(() => {
    fetchCategoryNews();
  }, [categorySlug]);

  /* =======================================================
     SORT NEWS
     
     Latest first
  ======================================================= */

  const sortedNews = useMemo(() => {
    return [...news].sort((a, b) => {
      const dateA = new Date(
        a.publishedAt || a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.publishedAt || b.createdAt || 0
      ).getTime();

      return dateB - dateA;
    });
  }, [news]);

  /* =======================================================
     FEATURED
  ======================================================= */

  const featuredNews = useMemo(() => {
    return (
      sortedNews.find(
        (item) => item.isTrending === true
      ) || sortedNews[0]
    );
  }, [sortedNews]);

  /* =======================================================
     OTHER NEWS
  ======================================================= */

  const otherNews = useMemo(() => {
    if (!featuredNews) {
      return sortedNews;
    }

    return sortedNews.filter(
      (item) => item._id !== featuredNews._id
    );
  }, [sortedNews, featuredNews]);

  /* =======================================================
     TOP SIDE NEWS
  ======================================================= */

  const sideNews = useMemo(() => {
    return otherNews.slice(0, 4);
  }, [otherNews]);

  /* =======================================================
     REST NEWS
  ======================================================= */

  const gridNews = useMemo(() => {
    return otherNews.slice(4);
  }, [otherNews]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Header />

        <main className="mx-auto max-w-[1400px] px-5 py-16 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-gray-200" />

            <div className="mt-4 h-12 w-72 rounded bg-gray-200" />

            <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-200" />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="h-[430px] rounded-2xl bg-gray-200 lg:col-span-2" />

              <div className="space-y-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-28 rounded-xl bg-gray-200"
                  />
                ))}
              </div>
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
      <div className="min-h-screen bg-[#fafafa]">
        <Header />

        <main className="mx-auto max-w-[1000px] px-5 py-20 lg:px-8">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
            <h1 className="text-3xl font-black text-[#b91c1c]">
              खबरें लोड नहीं हो सकीं
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600">
              {error}
            </p>

            <button
              onClick={fetchCategoryNews}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#b91c1c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#991b1b]"
            >
              <FiRefreshCw size={16} />
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

  if (!sortedNews.length) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-[#111827]">
        <Header />

        <main className="mx-auto max-w-[1400px] px-5 py-10 lg:px-8">
          <section className="border-b-2 border-gray-900 pb-7">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
              न्यूज़रूम / कैटेगरी
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
              {categoryInfo.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              {categoryInfo.description}
            </p>
          </section>

          <section className="py-24 text-center">
            <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                📰
              </div>

              <h2 className="mt-6 text-2xl font-black">
                इस कैटेगरी में अभी कोई खबर नहीं है
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                अभी <b>{categoryInfo.name}</b> category
                में कोई published news उपलब्ध नहीं है।
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  onClick={fetchCategoryNews}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  <FiRefreshCw size={15} />
                  Refresh
                </button>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#b91c1c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#991b1b]"
                >
                  होम पर जाएं
                  <FiChevronRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  /* =======================================================
     MAIN PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111827]">
      <Header />

      <main>
        {/* =================================================
            CATEGORY HEADER
        ================================================== */}

        <section className="mx-auto max-w-[1400px] px-5 pt-8 lg:px-8 lg:pt-12">
          <div className="flex flex-col justify-between gap-5 border-b-2 border-gray-900 pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                न्यूज़रूम / कैटेगरी
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
                {categoryInfo.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                {categoryInfo.description}
              </p>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black text-gray-500 shadow-sm">
                {sortedNews.length} खबरें
              </span>
            </div>
          </div>
        </section>

        {/* =================================================
            FEATURED + SIDE NEWS
        ================================================== */}

        {featuredNews && (
          <section className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              {/* FEATURED */}

              <Link
                to={`/news/${featuredNews._id}`}
                className="group relative block min-h-[440px] overflow-hidden rounded-2xl bg-gray-900 shadow-sm md:min-h-[520px]"
              >
                <img
                  src={
                    featuredNews.thumbnail ||
                    FALLBACK_IMAGE
                  }
                  alt={featuredNews.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      FALLBACK_IMAGE;
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-9">
                  <Badge
                    category={featuredNews.category}
                  />

                  <h2 className="mt-4 max-w-4xl text-3xl font-black leading-[1.15] md:text-4xl lg:text-[44px]">
                    {featuredNews.title}
                  </h2>

                  {featuredNews.shortDescription && (
                    <p className="mt-4 max-w-2xl line-clamp-2 text-sm leading-7 text-gray-200 md:text-base">
                      {featuredNews.shortDescription}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-gray-300">
                    {featuredNews.author && (
                      <>
                        <span className="font-bold text-white">
                          {featuredNews.author?.name ||
                            featuredNews.author}
                        </span>

                        <span className="text-gray-500">
                          •
                        </span>
                      </>
                    )}

                    <span className="flex items-center gap-1.5">
                      <FiClock size={13} />
                      {formatTime(
                        featuredNews.publishedAt
                      )}
                    </span>
                  </div>
                </div>
              </Link>

              {/* SIDE LATEST NEWS */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b91c1c]">
                      Latest
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      ताज़ा खबरें
                    </h2>
                  </div>

                  <span className="text-xs font-bold text-gray-400">
                    {sideNews.length}
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {sideNews.length > 0 ? (
                    sideNews.map((item) => (
                      <Link
                        key={item._id}
                        to={`/news/${item._id}`}
                        className="group flex gap-4 py-5 first:pt-5"
                      >
                        <div className="h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          <img
                            src={
                              item.thumbnail ||
                              FALLBACK_IMAGE
                            }
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.src =
                                FALLBACK_IMAGE;
                            }}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="min-w-0">
                          <Badge
                            category={item.category}
                          />

                          <h3 className="mt-2 line-clamp-2 text-sm font-black leading-5 transition group-hover:text-[#b91c1c]">
                            {item.title}
                          </h3>

                          <p className="mt-2 flex items-center gap-1 text-[11px] text-gray-400">
                            <FiClock size={11} />

                            {formatTime(
                              item.publishedAt
                            )}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-gray-400">
                      अभी और खबरें नहीं हैं।
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            ALL NEWS
        ================================================== */}

        {otherNews.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-5 pb-14 lg:px-8">
            <div className="mb-7 flex items-end justify-between border-b-2 border-gray-900 pb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                  News Feed
                </p>

                <h2 className="mt-1 text-2xl font-black md:text-3xl">
                  {categoryInfo.name} की ताज़ा खबरें
                </h2>
              </div>

              <span className="hidden text-sm font-bold text-gray-400 sm:block">
                {otherNews.length} खबरें
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gridNews.map((item) => (
                <Link
                  key={item._id}
                  to={`/news/${item._id}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={
                        item.thumbnail ||
                        FALLBACK_IMAGE
                      }
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src =
                          FALLBACK_IMAGE;
                      }}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {item.isTrending && (
                      <span className="absolute left-3 top-3 rounded-md bg-[#b91c1c] px-2.5 py-1 text-[9px] font-black text-white">
                        TRENDING
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <Badge
                      category={item.category}
                    />

                    <h3 className="mt-3 line-clamp-3 text-xl font-black leading-tight transition group-hover:text-[#b91c1c]">
                      {item.title}
                    </h3>

                    {item.shortDescription && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                        {item.shortDescription}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      {item.author && (
                        <>
                          <span className="font-semibold text-gray-600">
                            {item.author?.name ||
                              item.author}
                          </span>

                          <span>•</span>
                        </>
                      )}

                      <span>
                        {formatTime(
                          item.publishedAt
                        )}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-xs font-bold text-gray-400">
                        पूरी खबर पढ़ें
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-[#b91c1c] transition group-hover:bg-[#b91c1c] group-hover:text-white">
                        <FiArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* =================================================
            MORE NEWS STRIP
        ================================================== */}

        {gridNews.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-5 pb-12 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b91c1c]">
                  More From {categoryInfo.name}
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  और पढ़ें
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {gridNews.slice(0, 6).map((item, index) => (
                  <Link
                    key={`more-${item._id}`}
                    to={`/news/${item._id}`}
                    className="group flex items-center gap-4 px-6 py-5 transition hover:bg-gray-50"
                  >
                    <span className="hidden w-8 shrink-0 text-lg font-black text-gray-300 sm:block">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={
                          item.thumbnail ||
                          FALLBACK_IMAGE
                        }
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.src =
                            FALLBACK_IMAGE;
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-black leading-5 transition group-hover:text-[#b91c1c] md:text-base">
                        {item.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-400">
                        <Badge
                          category={item.category}
                        />

                        <span>
                          {formatTime(
                            item.publishedAt
                          )}
                        </span>
                      </div>
                    </div>

                    <FiChevronRight
                      className="shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#b91c1c]"
                      size={20}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            CTA
        ================================================== */}

        <section className="mx-auto max-w-[1400px] px-5 pb-12 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-[#b91c1c]">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10" />

            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-black/10" />

            <div className="relative flex flex-col items-start justify-between gap-7 px-6 py-10 md:px-10 md:py-12 lg:flex-row lg:items-center">
              <div className="max-w-2xl text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-200">
                  News24
                </p>

                <h2 className="mt-2 text-2xl font-black md:text-3xl">
                  कोई भी जरूरी खबर मिस न करें।
                </h2>

                <p className="mt-3 text-sm leading-6 text-red-100">
                  भारत और दुनिया की ताजा खबरों के
                  साथ जुड़े रहें।
                </p>
              </div>

              <Link
                to="/latest"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-black text-[#b91c1c] transition hover:bg-gray-100"
              >
                सभी खबरें पढ़ें
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

export default CategoryNews;

