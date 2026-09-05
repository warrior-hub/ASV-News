import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  FiArrowUpRight,
  FiClock,
  FiMail,
  FiTrendingUp,
  FiChevronRight,
  FiEye,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

import {
  FaFire,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa6";

const API_URL = "https://asv-news.onrender.com/api/news";

/* =========================================================
   CATEGORY COLORS
========================================================= */

const categoryColors = {
  टेक्नोलॉजी: "bg-blue-50 text-blue-700 ring-blue-200",
  बिजनेस: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  भारत: "bg-orange-50 text-orange-700 ring-orange-200",
  खेल: "bg-purple-50 text-purple-700 ring-purple-200",
  शिक्षा: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  दुनिया: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  मनोरंजन: "bg-pink-50 text-pink-700 ring-pink-200",
  स्वास्थ्य: "bg-rose-50 text-rose-700 ring-rose-200",
  राजनीति: "bg-red-50 text-red-700 ring-red-200",
};

/* =========================================================
   BADGE
========================================================= */

const Badge = ({ category }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black tracking-wide ring-1 ${
        categoryColors[category] ||
        "bg-gray-50 text-gray-700 ring-gray-200"
      }`}
    >
      {category || "अन्य"}
    </span>
  );
};

/* =========================================================
   FORMAT TIME
========================================================= */

const formatTime = (date) => {
  if (!date) return "";

  const newsDate = new Date(date);

  if (Number.isNaN(newsDate.getTime())) {
    return "";
  }

  const now = new Date();
  const diff = Math.floor((now - newsDate) / 1000);

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
   AUTHOR
========================================================= */

const getAuthorName = (author) => {
  if (!author) return "";

  if (typeof author === "string") {
    return author;
  }

  return author.name || author.fullName || author.username || "";
};

/* =========================================================
   HOME
========================================================= */

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     SLIDER STATE
  ======================================================= */

  const [sliderIndex, setSliderIndex] = useState(0);

  /* =======================================================
     FETCH NEWS
  ======================================================= */

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "News load नहीं हुई");
      }

      const newsData = Array.isArray(data.news)
        ? data.news
        : [];

      setNews(newsData);
    } catch (err) {
      console.error("Fetch News Error:", err);

      setError(
        err.message || "News load करने में समस्या हुई"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  /* =======================================================
     SORTED NEWS
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
     SLIDER NEWS
  ======================================================= */

  const sliderNews = useMemo(() => {
    return sortedNews.slice(0, 5);
  }, [sortedNews]);

  /* =======================================================
     RESET SLIDER
  ======================================================= */

  useEffect(() => {
    setSliderIndex(0);
  }, [sliderNews.length]);

  /* =======================================================
     AUTO SLIDER
  ======================================================= */

  useEffect(() => {
    if (sliderNews.length <= 1) return;

    const interval = setInterval(() => {
      setSliderIndex((prev) => {
        return (prev + 1) % sliderNews.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderNews.length]);

  /* =======================================================
     NEXT SLIDE
  ======================================================= */

  const nextSlide = () => {
    if (!sliderNews.length) return;

    setSliderIndex((prev) => {
      return (prev + 1) % sliderNews.length;
    });
  };

  /* =======================================================
     PREVIOUS SLIDE
  ======================================================= */

  const prevSlide = () => {
    if (!sliderNews.length) return;

    setSliderIndex((prev) => {
      return (
        (prev - 1 + sliderNews.length) %
        sliderNews.length
      );
    });
  };

  /* =======================================================
     FEATURED
  ======================================================= */

  const featuredNews = useMemo(() => {
    const trending = sortedNews.find(
      (item) => item.isTrending === true
    );

    return trending || sortedNews[0] || null;
  }, [sortedNews]);

  /* =======================================================
     SIDE NEWS
  ======================================================= */

  const sideNews = useMemo(() => {
    if (!featuredNews) return [];

    return sortedNews
      .filter(
        (item) => item._id !== featuredNews._id
      )
      .slice(0, 4);
  }, [sortedNews, featuredNews]);

  /* =======================================================
     LATEST NEWS
  ======================================================= */

  const latestNews = useMemo(() => {
    return sortedNews
      .filter(
        (item) =>
          !featuredNews ||
          item._id !== featuredNews._id
      )
      .slice(0, 4);
  }, [sortedNews, featuredNews]);

  /* =======================================================
     EDITOR PICKS
  ======================================================= */

  const editorsPick = useMemo(() => {
    const picked = sortedNews.filter(
      (item) => item.isEditorsPick === true
    );

    if (picked.length > 0) {
      return picked.slice(0, 3);
    }

    return sortedNews.slice(0, 3);
  }, [sortedNews]);

  /* =======================================================
     MOST READ
  ======================================================= */

  const mostRead = useMemo(() => {
    const readNews = sortedNews.filter(
      (item) => item.isMostRead === true
    );

    if (readNews.length > 0) {
      return readNews.slice(0, 5);
    }

    return sortedNews.slice(0, 5);
  }, [sortedNews]);

  /* =======================================================
     TRENDING
  ======================================================= */

  const trendingNews = useMemo(() => {
    const trending = sortedNews.filter(
      (item) => item.isTrending === true
    );

    if (trending.length > 0) {
      return trending.slice(0, 5);
    }

    return sortedNews.slice(0, 5);
  }, [sortedNews]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <main className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#b91c1c]" />

              <p className="mt-4 text-sm font-bold text-gray-500">
                खबरें लोड हो रही हैं...
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
            <h2 className="text-2xl font-black text-[#b91c1c]">
              खबरें लोड नहीं हो सकीं
            </h2>

            <p className="mt-3 text-sm text-gray-600">
              {error}
            </p>

            <button
              onClick={fetchNews}
              className="mt-6 rounded-lg bg-[#b91c1c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#991b1b]"
            >
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
      <div className="min-h-screen bg-white">
        <Header />

        <main className="mx-auto max-w-[1400px] px-5 py-20 lg:px-8">
          <div className="rounded-2xl border border-gray-200 p-10 text-center">
            <h2 className="text-2xl font-black">
              अभी कोई खबर उपलब्ध नहीं है
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Admin panel से पहली खबर publish करें।
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Header />

      <main>

        {/* =================================================
            NEWS SLIDER
        ================================================= */}

        {sliderNews.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-5 pt-6 lg:px-8 lg:pt-10">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-xl">

              <div className="relative h-[260px] sm:h-[340px] md:h-[430px] lg:h-[500px]">

                {sliderNews.map((item, index) => (
                  <Link
                    key={item._id}
                    to={`/news/${item._id}`}
                    className={`absolute inset-0 transition-all duration-700 ${
                      index === sliderIndex
                        ? "translate-x-0 opacity-100"
                        : "pointer-events-none translate-x-8 opacity-0"
                    }`}
                  >

                    {/* IMAGE */}

                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    {/* OVERLAY */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                    {/* SLIDE CONTENT */}

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7 md:p-10 lg:p-12">

                      <Badge
                        category={item.category}
                      />

                      <h2 className="mt-3 max-w-4xl text-2xl font-black leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
                        {item.title}
                      </h2>

                      {item.shortDescription && (
                        <p className="mt-3 hidden max-w-2xl text-sm leading-6 text-gray-200 sm:block md:text-base">
                          {item.shortDescription}
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-300">
                        <FiClock size={13} />

                        {formatTime(
                          item.publishedAt ||
                            item.createdAt
                        )}
                      </div>
                    </div>
                  </Link>
                ))}

                {/* PREVIOUS BUTTON */}

                {sliderNews.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      prevSlide();
                    }}
                    aria-label="Previous slide"
                    className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/75 sm:left-5"
                  >
                    <FiArrowLeft size={18} />
                  </button>
                )}

                {/* NEXT BUTTON */}

                {sliderNews.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextSlide();
                    }}
                    aria-label="Next slide"
                    className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/75 sm:right-5"
                  >
                    <FiArrowRight size={18} />
                  </button>
                )}

                {/* DOTS */}

                {sliderNews.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
                    {sliderNews.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSliderIndex(index);
                        }}
                        aria-label={`Go to slide ${
                          index + 1
                        }`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === sliderIndex
                            ? "w-7 bg-white"
                            : "w-2 bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            HERO SECTION
        ================================================= */}

        {featuredNews && (
          <section className="mx-auto max-w-[1400px] px-5 pb-8 pt-6 lg:px-8 lg:pt-10">

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">

              {/* FEATURED NEWS */}

              <Link
                to={`/news/${featuredNews._id}`}
                className="group relative min-h-[450px] overflow-hidden rounded-2xl bg-gray-900 shadow-xl md:min-h-[520px] lg:min-h-[560px]"
              >
                <img
                  src={featuredNews.thumbnail}
                  alt={featuredNews.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8 lg:p-10">

                  <Badge
                    category={featuredNews.category}
                  />

                  <h1 className="mt-4 max-w-4xl text-3xl font-black leading-[1.12] tracking-tight md:text-4xl lg:text-5xl">
                    {featuredNews.title}
                  </h1>

                  {featuredNews.shortDescription && (
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-200 md:text-base">
                      {featuredNews.shortDescription}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-gray-300">

                    {getAuthorName(
                      featuredNews.author
                    ) && (
                      <>
                        <span className="font-bold text-white">
                          {getAuthorName(
                            featuredNews.author
                          )}
                        </span>

                        <span className="text-gray-500">
                          •
                        </span>
                      </>
                    )}

                    <span className="flex items-center gap-1.5">
                      <FiClock size={13} />

                      {formatTime(
                        featuredNews.publishedAt ||
                          featuredNews.createdAt
                      )}
                    </span>
                  </div>
                </div>
              </Link>

              {/* SIDE STORIES */}

              <div className="flex flex-col gap-4">
                {sideNews
                  .slice(0, 4)
                  .map((item) => (
                    <Link
                      key={item._id}
                      to={`/news/${item._id}`}
                      className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-3 transition hover:border-gray-200 hover:shadow-md"
                    >
                      <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex flex-col justify-center">
                        <Badge
                          category={item.category}
                        />

                        <h3 className="mt-2 text-sm font-bold leading-snug transition group-hover:text-[#b91c1c]">
                          {item.title}
                        </h3>

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                          <FiClock size={11} />

                          {formatTime(
                            item.publishedAt ||
                              item.createdAt
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            TRENDING NEWS
        ================================================= */}

        {trendingNews.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-5 lg:px-8">
            <div className="rounded-2xl border-2 border-red-100 bg-gradient-to-br from-red-50 to-orange-50 p-6">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b91c1c] text-white">
                    <FiTrendingUp size={18} />
                  </span>

                  <div>
                    <h2 className="text-xl font-black">
                      ट्रेंडिंग न्यूज़
                    </h2>

                    <p className="text-xs text-gray-500">
                      सबसे ज्यादा चर्चित खबरें
                    </p>
                  </div>
                </div>

                <FaFire className="animate-pulse text-2xl text-red-500" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                {trendingNews.map((item, index) => (
                  <Link
                    key={item._id}
                    to={`/news/${item._id}`}
                    className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 transition hover:border-red-200 hover:shadow-md"
                  >

                    <div className="flex-shrink-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-black text-[#b91c1c]">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    </div>

                    <div className="flex-1">

                      <div className="mb-2 flex items-center gap-2">
                        <Badge
                          category={item.category}
                        />

                        {item.views && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <FiEye size={12} />
                            {item.views}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold leading-snug transition group-hover:text-[#b91c1c]">
                        {item.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                        <FiClock size={11} />

                        {formatTime(
                          item.publishedAt ||
                            item.createdAt
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <section className="mx-auto max-w-[1400px] px-5 py-12 lg:px-8">

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_370px]">

            {/* LATEST NEWS */}

            <div>

              <div className="mb-7 flex items-end justify-between border-b-2 border-gray-900 pb-3">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                    न्यूज़रूम
                  </p>

                  <h2 className="mt-1 text-3xl font-black">
                    ताज़ा खबरें
                  </h2>
                </div>

                <Link
                  to="/latest"
                  className="hidden items-center gap-1 text-sm font-bold text-[#b91c1c] hover:underline sm:flex"
                >
                  सभी खबरें
                  <FiArrowUpRight size={15} />
                </Link>
              </div>

              <div className="space-y-6">

                {latestNews.map((item) => (
                  <Link
                    key={item._id}
                    to={`/news/${item._id}`}
                    className="group grid grid-cols-[140px_1fr] gap-4 rounded-lg border-b border-gray-100 p-4 pb-6 transition hover:bg-gray-50 md:grid-cols-[250px_1fr] md:gap-6"
                  >

                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">

                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                    </div>

                    <div className="flex flex-col justify-center">

                      <Badge
                        category={item.category}
                      />

                      <h3 className="mt-2 text-lg font-black leading-tight transition group-hover:text-[#b91c1c] md:text-xl">
                        {item.title}
                      </h3>

                      {item.shortDescription && (
                        <p className="mt-2 hidden text-sm text-gray-500 line-clamp-2 md:block">
                          {item.shortDescription}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-400">

                        {getAuthorName(item.author) && (
                          <>
                            <span className="font-semibold text-gray-600">
                              {getAuthorName(
                                item.author
                              )}
                            </span>

                            <span>•</span>
                          </>
                        )}

                        <span>
                          {formatTime(
                            item.publishedAt ||
                              item.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside>

              {/* MOST READ */}

              <div className="overflow-hidden rounded-2xl bg-[#111827] shadow-xl">

                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      पाठकों की पसंद
                    </p>

                    <h2 className="mt-1 text-xl font-black text-white">
                      सबसे ज्यादा पढ़ी गई
                    </h2>
                  </div>

                  <FaFire className="text-xl text-red-500" />
                </div>

                <div>
                  {mostRead.map((item, index) => (
                    <Link
                      key={item._id}
                      to={`/news/${item._id}`}
                      className="group flex gap-4 border-b border-white/10 px-6 py-4 transition last:border-none hover:bg-white/5"
                    >

                      <span className="text-2xl font-black text-gray-600 transition group-hover:text-red-500">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div className="flex-1">

                        <h3 className="text-sm font-bold leading-6 text-gray-200 transition group-hover:text-white">
                          {item.title}
                        </h3>

                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                          <FiClock size={11} />

                          {formatTime(
                            item.publishedAt ||
                              item.createdAt
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* =================================================
                  ADVERTISEMENT
              ================================================= */}

              <div className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

                {/* AD HEADER */}

                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-3">

                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Advertisement
                  </span>

                  <span className="rounded-full bg-gray-100 px-2 py-1 text-[8px] font-bold text-gray-400">
                    AD
                  </span>
                </div>

                {/* AD AREA */}

                <div className="flex min-h-[280px] items-center justify-center p-4">

                  <div className="flex h-[250px] w-full max-w-[336px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">

                      <span className="text-sm font-black text-gray-400">
                        AD
                      </span>

                    </div>

                    <p className="mt-3 text-xs font-bold text-gray-400">
                      विज्ञापन के लिए स्थान
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Advertisement Space
                    </p>
                  </div>
                </div>
              </div>

            </aside>
          </div>
        </section>

        {/* =================================================
            EDITOR PICKS
        ================================================= */}

        {editorsPick.length > 0 && (
          <section className="border-y border-gray-100 bg-gradient-to-b from-gray-50 to-white">

            <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-8">

              <div className="mb-7 flex items-end justify-between">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                    संपादक की पसंद
                  </p>

                  <h2 className="mt-1 text-3xl font-black">
                    खास खबरें
                  </h2>
                </div>

                <Link
                  to="/editors-picks"
                  className="hidden items-center gap-1 text-sm font-bold text-[#b91c1c] sm:flex"
                >
                  सभी देखें
                  <FiArrowUpRight size={15} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {editorsPick.map((item, index) => (
                  <Link
                    key={item._id}
                    to={`/news/${item._id}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                  >

                    <div className="relative aspect-[16/10] overflow-hidden">

                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute left-3 top-3">

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-xs font-black text-[#b91c1c] shadow">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                      </div>
                    </div>

                    <div className="p-5">

                      <Badge
                        category={item.category}
                      />

                      <h3 className="mt-3 text-lg font-black leading-tight transition group-hover:text-[#b91c1c]">
                        {item.title}
                      </h3>

                      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">

                        <span>
                          {getAuthorName(item.author)}

                          {getAuthorName(item.author) &&
                            " • "}

                          {formatTime(
                            item.publishedAt ||
                              item.createdAt
                          )}
                        </span>

                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            CATEGORY SECTION
        ================================================= */}

        <section className="mx-auto max-w-[1400px] px-5 py-12 lg:px-8">

          <div className="mb-7 text-center">

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
              खबरों की दुनिया
            </p>

            <h2 className="mt-1 text-3xl font-black">
              श्रेणी के अनुसार खबरें
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

            {[
              {
                name: "भारत",
                slug: "india",
                image:
                  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=700&q=80",
                icon: "🇮🇳",
              },
              {
                name: "दुनिया",
                slug: "world",
                image:
                  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=700&q=80",
                icon: "🌍",
              },
              {
                name: "बिजनेस",
                slug: "business",
                image:
                  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80",
                icon: "💼",
              },
              {
                name: "टेक्नोलॉजी",
                slug: "technology",
                image:
                  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=700&q=80",
                icon: "💻",
              },
              {
                name: "खेल",
                slug: "sports",
                image:
                  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=700&q=80",
                icon: "🏏",
              },
              {
                name: "मनोरंजन",
                slug: "entertainment",
                image:
                  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=80",
                icon: "🎬",
              },
            ].map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group relative h-32 overflow-hidden rounded-xl bg-gray-900 shadow-md transition-all duration-300 hover:shadow-xl"
              >

                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-110 group-hover:opacity-60"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/20" />

                <div className="absolute bottom-3 left-4 right-4 text-white">

                  <div className="flex items-center gap-2">

                    <span className="text-lg">
                      {category.icon}
                    </span>

                    <h3 className="text-base font-black">
                      {category.name}
                    </h3>

                  </div>
                </div>

                <span className="absolute right-3 top-3 text-white/60 transition group-hover:text-white">
                  <FiArrowUpRight size={16} />
                </span>

              </Link>
            ))}
          </div>
        </section>

        {/* =================================================
            SOCIAL + CTA
        ================================================= */}

        <section className="mx-auto max-w-[1400px] px-5 pb-12 lg:px-8">

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* SOCIAL */}

            <div className="overflow-hidden rounded-2xl bg-[#111827] p-8">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                AVS News से जुड़े रहें
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                हर जरूरी खबर आप तक सबसे पहले।
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                हमारी सोशल मीडिया कम्युनिटी से जुड़ें और
                ताजा अपडेट पाएं।
              </p>

              <div className="mt-5 flex items-center gap-3">

                {/* FACEBOOK */}

                <a
                  href="https://www.facebook.com/profile.php?id=61576768812323"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white transition hover:-translate-y-1 hover:bg-blue-700"
                >
                  <FaFacebookF size={14} />
                </a>

                {/* INSTAGRAM */}

                <a
                  href="https://www.instagram.com/avsnews9000?igsh=MTltMHN5aWF4YnI2NA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/30"
                >
                  <FaInstagram size={17} />
                </a>

                {/* YOUTUBE */}

                <a
                  href="https://youtube.com/@avsnews-b5b?si=80v1_MdAHdfVMeZy"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white transition hover:-translate-y-1 hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30"
                >
                  <FaYoutube size={16} />
                </a>

                {/* WHATSAPP */}

                <a
                  href="https://wa.me/917084159000"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30"
                >
                  <FaWhatsapp size={16} />
                </a>

              </div>
            </div>

            {/* CTA */}

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#b91c1c] to-red-800 p-8">

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/20" />

              <div className="relative flex h-full flex-col justify-between">

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-200">
                    अपडेट रहें
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    कोई भी जरूरी खबर मिस न करें।
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-red-100">
                    भारत और दुनिया की ताजा खबरों के साथ
                    जुड़े रहें। AVS News Digital पर पढ़ें
                    हर बड़ी खबर सबसे पहले।
                  </p>

                </div>

                <Link
                  to="/latest"
                  className="mt-4 inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-black text-[#b91c1c] shadow-lg transition hover:bg-gray-100"
                >
                  ताज़ा खबरें पढ़ें
                  <FiChevronRight size={17} />
                </Link>

              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;