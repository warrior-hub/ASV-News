import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  FiArrowLeft,
  FiClock,
  FiShare2,
  FiFacebook,
  FiTwitter,
  FiCopy,
  FiArrowUpRight,
  FiChevronRight,
  FiEye,
} from "react-icons/fi";

import { FaFire } from "react-icons/fa6";

/* =========================================================
   API
========================================================= */

const API_URL = "http://localhost:5000/api/news";

/* =========================================================
   CATEGORY COLORS
========================================================= */

const categoryColors = {
  टेक्नोलॉजी: "bg-blue-50 text-blue-700",
  बिजनेस: "bg-emerald-50 text-emerald-700",
  भारत: "bg-orange-50 text-orange-700",
  खेल: "bg-purple-50 text-purple-700",
  शिक्षा: "bg-cyan-50 text-cyan-700",
  दुनिया: "bg-indigo-50 text-indigo-700",
  मनोरंजन: "bg-pink-50 text-pink-700",
};

/* =========================================================
   BADGE
========================================================= */

const Badge = ({ category }) => {
  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-1.5 text-[10px] font-black tracking-wide ${
        categoryColors[category] || "bg-gray-100 text-gray-700"
      }`}
    >
      {category || "अन्य"}
    </span>
  );
};

/* =========================================================
   DATE FORMAT
========================================================= */

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* =========================================================
   TIME FORMAT
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
   CONTENT RENDERER
========================================================= */

const ArticleContent = ({ content }) => {
  if (!content) {
    return (
      <p className="text-gray-500">
        इस खबर की विस्तृत जानकारी उपलब्ध नहीं है।
      </p>
    );
  }

  if (typeof content !== "string") {
    return <p className="mb-6">{String(content)}</p>;
  }

  return (
    <>
      {content.split("\n").map((paragraph, index) => {
        const text = paragraph.trim();

        if (!text) return null;

        return (
          <p
            key={index}
            className="mb-7 text-[17px] leading-[2] text-gray-800 md:text-[18px]"
          >
            {text}
          </p>
        );
      })}
    </>
  );
};

/* =========================================================
   RELATED CARD
========================================================= */

const RelatedNewsCard = ({ item }) => {
  return (
    <Link
      to={`/news/${item._id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={item.thumbnail}
          alt={item.title}
          onError={handleImageError}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4">
          <Badge category={item.category} />
        </div>

        {item.isTrending && (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#b91c1c] px-3 py-1.5 text-[10px] font-black text-white">
            <FaFire />
            ट्रेंडिंग
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-3 text-lg font-black leading-tight text-gray-950 transition group-hover:text-[#b91c1c]">
          {item.title}
        </h3>

        {item.shortDescription && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
            {item.shortDescription}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-400">
          <span>{formatRelativeTime(item.publishedAt)}</span>

          <span className="flex items-center gap-1 font-bold text-gray-500 transition group-hover:text-[#b91c1c]">
            पढ़ें
            <FiArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
};

/* =========================================================
   NEWS DETAILS
========================================================= */

const NewsDetails = () => {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [allNews, setAllNews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     FETCH SINGLE NEWS
  ======================================================= */

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "News not found");
        }

        setNews(data.news);
      } catch (err) {
        console.error("Fetch News Details Error:", err);

        setError(err.message || "News load करने में समस्या हुई");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  /* =======================================================
     FETCH ALL NEWS FOR RELATED SECTION
  ======================================================= */

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        setRelatedLoading(true);

        const response = await fetch(API_URL);
        const data = await response.json();

        if (response.ok && data.success) {
          setAllNews(data.news || []);
        }
      } catch (err) {
        console.error("Fetch Related News Error:", err);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchAllNews();
  }, []);

  /* =======================================================
     RELATED NEWS
  ======================================================= */

  const relatedNews = useMemo(() => {
    if (!news || !allNews.length) return [];

    const currentId = String(news._id);

    const sameCategory = allNews.filter(
      (item) =>
        String(item._id) !== currentId &&
        item.category === news.category
    );

    const otherNews = allNews.filter(
      (item) =>
        String(item._id) !== currentId &&
        item.category !== news.category
    );

    return [...sameCategory, ...otherNews].slice(0, 6);
  }, [news, allNews]);

  /* =======================================================
     MORE NEWS
  ======================================================= */

  const moreNews = useMemo(() => {
    if (!news || !allNews.length) return [];

    return allNews
      .filter((item) => String(item._id) !== String(news._id))
      .slice(0, 4);
  }, [news, allNews]);

  /* =======================================================
     COPY LINK
  ======================================================= */

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      alert("News link copy हो गया");
    } catch (error) {
      console.error("Copy Error:", error);
    }
  };

  /* =======================================================
     SHARE
  ======================================================= */

  const shareNews = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: news?.title || "AVS News Digital",
          text: news?.shortDescription || "",
          url: window.location.href,
        });

        return;
      }

      await copyLink();
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <main className="mx-auto max-w-[1100px] px-5 py-20 lg:px-8">
          <div className="flex min-h-[550px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#b91c1c]" />

              <p className="mt-5 text-sm font-bold text-gray-500">
                खबर लोड हो रही है...
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

  if (error || !news) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <main className="mx-auto max-w-[1000px] px-5 py-20 lg:px-8">
          <div className="rounded-3xl border border-red-100 bg-red-50 p-10 text-center md:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#b91c1c] shadow-sm">
              <FiArrowLeft size={24} />
            </div>

            <h1 className="mt-6 text-3xl font-black text-gray-950">
              खबर नहीं मिली
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600">
              {error || "यह खबर उपलब्ध नहीं है या हटा दी गई है।"}
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#b91c1c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#991b1b]"
            >
              <FiArrowLeft size={16} />
              होम पर जाएं
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Header />

      <main>
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="mx-auto max-w-[1400px] px-5 pt-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-400">
            <Link
              to="/"
              className="transition hover:text-[#b91c1c]"
            >
              होम
            </Link>

            <FiChevronRight size={13} />

            <Link
              to={`/category/${news.category}`}
              className="transition hover:text-[#b91c1c]"
            >
              {news.category}
            </Link>

            <FiChevronRight size={13} />

            <span className="line-clamp-1 max-w-[250px] text-gray-500">
              {news.title}
            </span>
          </div>
        </div>

        {/* =================================================
            ARTICLE
        ================================================= */}

        <article className="mx-auto max-w-[1100px] px-5 pb-16 pt-7 lg:px-8 lg:pt-10">
          {/* BACK */}

          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-[#b91c1c]"
          >
            <FiArrowLeft size={16} />
            वापस होम पर
          </Link>

          {/* CATEGORY */}

          <Badge category={news.category} />

          {/* TRENDING LABEL */}

          {news.isTrending && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-[10px] font-black text-[#b91c1c]">
              <FaFire />
              ट्रेंडिंग
            </span>
          )}

          {/* TITLE */}

          <h1 className="mt-5 max-w-5xl text-3xl font-black leading-[1.15] tracking-tight text-gray-950 md:text-4xl lg:text-[52px]">
            {news.title}
          </h1>

          {/* DESCRIPTION */}

          {news.shortDescription && (
            <p className="mt-6 max-w-4xl text-base leading-8 text-gray-600 md:text-lg md:leading-9">
              {news.shortDescription}
            </p>
          )}

          {/* =================================================
              DATE / TIME / VIEWS + SHARE
          ================================================= */}

          <div className="mt-8 flex flex-col justify-between gap-5 border-y border-gray-200 py-5 md:flex-row md:items-center">
            {/* DATE + TIME + VIEWS */}

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span>{formatDate(news.publishedAt)}</span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <FiClock size={12} />
                {formatTime(news.publishedAt)}
              </span>

             
            </div>

            {/* SHARE */}

            <div className="flex items-center gap-2">
              <button
                onClick={shareNews}
                aria-label="Share news"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#b91c1c] hover:bg-red-50 hover:text-[#b91c1c]"
              >
                <FiShare2 size={16} />
              </button>

              <button
                onClick={copyLink}
                aria-label="Copy link"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#b91c1c] hover:bg-red-50 hover:text-[#b91c1c]"
              >
                <FiCopy size={16} />
              </button>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#b91c1c] hover:bg-red-50 hover:text-[#b91c1c]"
              >
                <FiFacebook size={16} />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  window.location.href
                )}&text=${encodeURIComponent(news.title)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#b91c1c] hover:bg-red-50 hover:text-[#b91c1c]"
              >
                <FiTwitter size={16} />
              </a>
            </div>
          </div>

          {/* =================================================
              HERO IMAGE
          ================================================= */}

          <div className="mt-9 overflow-hidden rounded-2xl bg-gray-100 md:rounded-3xl">
            <img
              src={news.thumbnail}
              alt={news.title}
              onError={handleImageError}
              className="max-h-[700px] min-h-[280px] w-full object-cover md:min-h-[450px]"
            />
          </div>

          {/* IMAGE CAPTION */}

          <p className="mt-3 text-right text-[11px] text-gray-400">
            AVS News Digital
          </p>

          {/* =================================================
              ARTICLE BODY
          ================================================= */}

          <div className="mx-auto mt-10 max-w-[850px]">
            <div className="border-l-4 border-[#b91c1c] bg-gray-50 px-5 py-4 md:px-6">
              <p className="text-sm font-semibold leading-7 text-gray-700 md:text-base">
                {news.shortDescription}
              </p>
            </div>

            <div className="mt-9">
              <ArticleContent content={news.content} />
            </div>
          </div>

          {/* =================================================
              ARTICLE END SHARE
          ================================================= */}

          <div className="mx-auto mt-12 max-w-[850px] rounded-2xl bg-[#111827] p-6 md:p-8">
            <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  खबर पसंद आई?
                </p>

                <h3 className="mt-2 text-xl font-black text-white">
                  इस खबर को अपने दोस्तों के साथ शेयर करें
                </h3>
              </div>

              <button
                onClick={shareNews}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#b91c1c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#991b1b]"
              >
                <FiShare2 size={16} />
                खबर शेयर करें
              </button>
            </div>
          </div>
        </article>

        {/* =================================================
            RELATED NEWS
        ================================================= */}

        <section className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-[1400px] px-5 py-14 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                  आपको यह भी पसंद आ सकता है
                </p>

                <h2 className="mt-1 text-3xl font-black text-gray-950">
                  संबंधित खबरें
                </h2>
              </div>

              <Link
                to={`/category/${news.category}`}
                className="hidden items-center gap-1 text-sm font-bold text-[#b91c1c] sm:flex"
              >
                और खबरें
                <FiArrowUpRight size={15} />
              </Link>
            </div>

            {relatedLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >
                    <div className="aspect-[16/10] animate-pulse bg-gray-200" />

                    <div className="space-y-3 p-5">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

                      <div className="h-5 w-full animate-pulse rounded bg-gray-200" />

                      <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : relatedNews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedNews.map((item) => (
                  <RelatedNewsCard
                    key={item._id}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-sm font-semibold text-gray-500">
                  अभी संबंधित खबरें उपलब्ध नहीं हैं।
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            MORE NEWS
        ================================================= */}

        {moreNews.length > 0 && (
          <section className="mx-auto max-w-[1400px] px-5 py-14 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                  न्यूज़रूम
                </p>

                <h2 className="mt-1 text-3xl font-black">
                  और पढ़ें
                </h2>
              </div>

              <Link
                to="/latest"
                className="hidden items-center gap-1 text-sm font-bold text-[#b91c1c] sm:flex"
              >
                सभी खबरें
                <FiArrowUpRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {moreNews.map((item) => (
                <Link
                  key={item._id}
                  to={`/news/${item._id}`}
                  className="group flex gap-4 border-b border-gray-200 pb-5"
                >
                  <div className="h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      onError={handleImageError}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div>
                    <Badge category={item.category} />

                    <h3 className="mt-2 line-clamp-3 text-sm font-black leading-5 transition group-hover:text-[#b91c1c]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-[11px] text-gray-400">
                      {formatRelativeTime(item.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetails;