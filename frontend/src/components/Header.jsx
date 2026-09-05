import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import bg from "../assets/bg.jpeg";

import { FiMenu, FiX, FiSearch, FiChevronRight, FiHome } from "react-icons/fi";

const API_URL = "https://asv-news.onrender.com/api/news";

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  { name: "भारत", slug: "india" },
  { name: "दुनिया", slug: "world" },
  { name: "राजनीति", slug: "politics" },
  { name: "बिजनेस", slug: "business" },
  { name: "टेक्नोलॉजी", slug: "technology" },
  { name: "खेल", slug: "sports" },
  { name: "मनोरंजन", slug: "entertainment" },
  { name: "स्वास्थ्य", slug: "health" },
  { name: "शिक्षा", slug: "education" },
];

/* =========================================================
   HEADER
========================================================= */

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [breakingNews, setBreakingNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* =======================================================
     FETCH BREAKING NEWS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchBreakingNews = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`News API Error: ${response.status}`);
        }

        const data = await response.json();

        let newsArray = [];

        if (Array.isArray(data)) {
          newsArray = data;
        } else if (Array.isArray(data.news)) {
          newsArray = data.news;
        } else if (Array.isArray(data.data)) {
          newsArray = data.data;
        } else if (Array.isArray(data.results)) {
          newsArray = data.results;
        } else if (Array.isArray(data.docs)) {
          newsArray = data.docs;
        }

        const filteredNews = newsArray
          .filter(
            (news) =>
              news &&
              news.status === "published" &&
              news.title &&
              news.isBreaking === true,
          )
          .sort((a, b) => {
            const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
            const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
            return dateB - dateA;
          });

        if (mounted) {
          setBreakingNews(filteredNews);
        }
      } catch (error) {
        console.error("BREAKING NEWS ERROR:", error);
        if (mounted) {
          setBreakingNews([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBreakingNews();
    const interval = setInterval(fetchBreakingNews, 120000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  /* =======================================================
     ESCAPE MOBILE MENU
  ======================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileMenu(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  /* =======================================================
     CLOSE MOBILE MENU ON RESIZE
  ======================================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearchClick = () => {
    setMobileMenu(false);
    navigate("/search");
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <>
      {/* BACKGROUND IMAGE */}
      <div className="relative w-full overflow-hidden bg-gray-100">
        <img
          src={bg}
          alt="AVS News Background"
          className="block w-full h-auto max-w-none"
        />
      </div>

      {/* STICKY NAVIGATION */}
      <header className="sticky top-0 z-[60] w-full bg-white isolate">
        <nav className="relative w-full h-14 border-b border-gray-100 bg-white shadow-sm">
          <div className="mx-auto max-w-[1400px] h-full px-3 sm:px-5 lg:px-8">
            <div className="flex h-full items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6">
              {/* LOGO - Hidden on mobile, visible on sm+ */}
              <Link to="/" className="hidden sm:flex shrink-0 items-center">
                <img
                  src={logo}
                  alt="AVS News"
                  className="h-9 w-9 lg:h-10 lg:w-10 object-contain"
                />
              </Link>

              {/* HOME - Mobile visible with icon */}
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex h-full shrink-0 items-center gap-1 border-b-2 px-1 sm:px-2 text-xs sm:text-sm font-bold transition-colors duration-200 ${
                    isActive
                      ? "border-[#b91c1c] text-[#b91c1c]"
                      : "border-transparent text-gray-600 hover:text-gray-950"
                  }`
                }
              >
                <FiHome size={16} className="sm:hidden" />
                <span className="hidden sm:inline">होम</span>
              </NavLink>

              {/* CATEGORIES - Scrollable */}
              <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-4 overflow-x-auto scrollbar-hide flex-1 md:flex-none">
                {/* Mobile: Show first 4 categories */}
                <div className="flex md:hidden items-center gap-0.5">
                  {categories.slice(0, 4).map((category) => (
                    <NavLink
                      key={category.slug}
                      to={`/category/${category.slug}`}
                      className={({ isActive }) =>
                        `flex h-full shrink-0 items-center border-b-2 px-2 sm:px-3 text-[11px] sm:text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
                          isActive
                            ? "border-[#b91c1c] text-[#b91c1c]"
                            : "border-transparent text-gray-600 hover:text-gray-950"
                        }`
                      }
                    >
                      {category.name}
                    </NavLink>
                  ))}
                </div>

                {/* Desktop: Show first 6 categories */}
                <div className="hidden md:flex lg:hidden items-center gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <NavLink
                      key={category.slug}
                      to={`/category/${category.slug}`}
                      className={({ isActive }) =>
                        `flex h-full shrink-0 items-center border-b-2 px-1 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                          isActive
                            ? "border-[#b91c1c] text-[#b91c1c]"
                            : "border-transparent text-gray-600 hover:text-gray-950"
                        }`
                      }
                    >
                      {category.name}
                    </NavLink>
                  ))}
                </div>

                {/* Large Desktop: Show all categories */}
                <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                  {categories.map((category) => (
                    <NavLink
                      key={category.slug}
                      to={`/category/${category.slug}`}
                      className={({ isActive }) =>
                        `flex h-full shrink-0 items-center border-b-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                          isActive
                            ? "border-[#b91c1c] text-[#b91c1c]"
                            : "border-transparent text-gray-600 hover:text-gray-950"
                        }`
                      }
                    >
                      {category.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* RIGHT ACTIONS - Fixed on right */}
              <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5 md:gap-2">
                {/* SEARCH */}
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:border-[#b91c1c] hover:bg-red-50 hover:text-[#b91c1c]"
                  aria-label="Search"
                >
                  <FiSearch size={16} className="sm:size-[17px] md:size-[18px]" />
                </button>

                {/* MOBILE MENU BUTTON */}
                <button
                  type="button"
                  onClick={() => setMobileMenu((prev) => !prev)}
                  className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-all duration-200 hover:bg-gray-200 lg:hidden"
                  aria-label="Menu"
                >
                  {mobileMenu ? (
                    <FiX size={18} className="sm:size-[19px] md:size-[20px]" />
                  ) : (
                    <FiMenu size={18} className="sm:size-[19px] md:size-[20px]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* MOBILE MENU - FULL SCREEN */}
        {mobileMenu && (
          <div className="fixed inset-0 top-14 z-[70] bg-black/50 lg:hidden" onClick={() => setMobileMenu(false)}>
            <div 
              className="absolute left-0 right-0 top-0 bg-white shadow-xl max-h-[calc(100vh-56px)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-3">
                {/* QUICK LINKS */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <NavLink
                    to="/"
                    end
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                        isActive
                          ? "bg-red-50 text-[#b91c1c]"
                          : "bg-gray-50 text-gray-700"
                      }`
                    }
                  >
                    <FiHome size={16} />
                    होम
                  </NavLink>

                  <button
                    onClick={() => {
                      setMobileMenu(false);
                      navigate("/search");
                    }}
                    className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700"
                  >
                    <FiSearch size={16} />
                    खोजें
                  </button>
                </div>

                {/* ALL CATEGORIES */}
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((category) => (
                    <NavLink
                      key={category.slug}
                      to={`/category/${category.slug}`}
                      onClick={() => setMobileMenu(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? "bg-red-50 font-bold text-[#b91c1c]"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      <span className="h-1 w-1 rounded-full bg-gray-300" />
                      {category.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* BREAKING NEWS TICKER */}
      <BreakingNewsTicker news={breakingNews} loading={loading} />
    </>
  );
};

/* =========================================================
   BREAKING NEWS TICKER - JAVASCRIPT ANIMATION
========================================================= */

const BreakingNewsTicker = ({ news, loading }) => {
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const lastTimeRef = useRef(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    if (!news || news.length === 0 || loading) {
      return;
    }

    positionRef.current = 0;
    lastTimeRef.current = null;

    const SPEED = 50;

    const animate = (time) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!isPausedRef.current && trackRef.current) {
        positionRef.current -= (SPEED * delta) / 1000;

        const contentWidth = trackRef.current.scrollWidth / 2;

        if (contentWidth > 0 && Math.abs(positionRef.current) >= contentWidth) {
          positionRef.current = 0;
        }

        trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      lastTimeRef.current = null;
      positionRef.current = 0;
    };
  }, [news, loading]);

  if (loading) {
    return (
      <section className="sticky top-14 z-[50] w-full overflow-hidden bg-[#111827] border-b border-gray-800">
        <div className="mx-auto flex h-11 max-w-[1400px]">
          <BreakingLabel />
          <div className="flex min-w-0 flex-1 items-center px-4 sm:px-5">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-gray-500" />
              <span className="truncate">ब्रेकिंग न्यूज़ लोड हो रही है...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!news || news.length === 0) {
    return (
      <section className="sticky top-14 z-[50] w-full overflow-hidden bg-[#111827] border-b border-gray-800">
        <div className="mx-auto flex h-11 max-w-[1400px]">
          <BreakingLabel />
          <div className="flex min-w-0 flex-1 items-center px-4 sm:px-5">
            <span className="truncate text-xs text-gray-400">
              अभी कोई ब्रेकिंग न्यूज़ उपलब्ध नहीं है।
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sticky top-14 z-[50] w-full overflow-hidden bg-[#111827] border-b border-gray-800">
      <div className="mx-auto flex h-11 max-w-[1400px]">
        <BreakingLabel />
        <div
          className="relative min-w-0 flex-1 overflow-hidden"
          onMouseEnter={() => {
            isPausedRef.current = true;
          }}
          onMouseLeave={() => {
            isPausedRef.current = false;
            lastTimeRef.current = null;
          }}
        >
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-8 sm:w-12 bg-gradient-to-r from-[#111827] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-8 sm:w-12 bg-gradient-to-l from-[#111827] to-transparent" />

          <div
            ref={trackRef}
            className="flex h-11 w-max items-center whitespace-nowrap will-change-transform"
            style={{ transform: "translate3d(0, 0, 0)" }}
          >
            <BreakingNewsGroup news={news} />
            <BreakingNewsGroup news={news} duplicate />
          </div>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   BREAKING LABEL
========================================================= */

const BreakingLabel = () => {
  return (
    <div className="relative z-30 flex h-11 shrink-0 items-center gap-1.5 sm:gap-2 bg-[#b91c1c] px-2.5 sm:px-5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-white shadow-[8px_0_18px_rgba(0,0,0,0.25)]">
      <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-white" />
      </span>
      <span className="whitespace-nowrap">ब्रेकिंग</span>
      <span className="hidden sm:inline whitespace-nowrap">न्यूज़</span>
    </div>
  );
};

/* =========================================================
   BREAKING NEWS GROUP
========================================================= */

const BreakingNewsGroup = ({ news, duplicate = false }) => {
  return (
    <div className="flex h-11 shrink-0 items-center" aria-hidden={duplicate}>
      {news.map((item, index) => {
        const newsId = item?._id || index;

        return (
          <Link
            key={`${duplicate ? "duplicate" : "main"}-${newsId}`}
            to={`/news/${newsId}`}
            tabIndex={duplicate ? -1 : 0}
            className="group flex h-11 shrink-0 items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 text-[11px] sm:text-sm font-medium text-gray-200 transition-colors duration-200 hover:bg-white/[0.04] hover:text-white"
          >
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full bg-red-500 transition-transform duration-200 group-hover:scale-125" />
            <span className="max-w-[180px] sm:max-w-[400px] lg:max-w-[500px] truncate">
              {item.title}
            </span>
            <FiChevronRight
              size={12}
              className="shrink-0 text-gray-500 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white sm:size-[14px]"
            />
          </Link>
        );
      })}
    </div>
  );
};

export default Header;