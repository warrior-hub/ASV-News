import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Save,
  Eye,
  Flame,
  Star,
  TrendingUp,
  Check,
  Loader2,
  Image as ImageIcon,
  CircleAlert,
  Upload,
  X,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// =========================================================
// CATEGORY MAP
// =========================================================

const categoryMap = {
  india: "भारत",
  world: "दुनिया",
  business: "बिजनेस",
  technology: "टेक्नोलॉजी",
  sports: "खेल",
  entertainment: "मनोरंजन",
  education: "शिक्षा",
  politics: "राजनीति",
};

const reverseCategoryMap = {
  भारत: "india",
  दुनिया: "world",
  बिजनेस: "business",
  टेक्नोलॉजी: "technology",
  खेल: "sports",
  मनोरंजन: "entertainment",
  शिक्षा: "education",
  राजनीति: "politics",
};

const categories = Object.entries(categoryMap).map(
  ([value, label]) => ({
    value,
    label,
  })
);

// =========================================================
// EDIT NEWS
// =========================================================

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Existing Cloudinary image
  const [existingImage, setExistingImage] = useState("");

  // New selected image
  const [imageFile, setImageFile] = useState(null);

  // Image preview
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "india",
    isPublished: false,
    isBreaking: false,
    isTrending: false,
    isFeatured: false,
    isMostRead: false,
  });

  // =========================================================
  // FETCH NEWS
  // =========================================================

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/news/admin/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "News fetch failed"
        );
      }

      const news = data.news;

      let categoryValue = "india";

      if (reverseCategoryMap[news.category]) {
        categoryValue =
          reverseCategoryMap[news.category];
      } else if (
        categoryMap[news.category?.toLowerCase()]
      ) {
        categoryValue =
          news.category.toLowerCase();
      }

      setForm({
        title: news.title || "",
        description: news.shortDescription || "",
        content: news.content || "",
        category: categoryValue,

        isPublished:
          news.status === "published",

        isBreaking:
          news.isBreaking ?? false,

        isTrending:
          news.isTrending ?? false,

        isFeatured:
          news.isFeatured ?? false,

        isMostRead:
          news.isMostRead ?? false,
      });

      // Existing Cloudinary image
      setExistingImage(news.thumbnail || "");
      setImagePreview(news.thumbnail || "");
      setImageFile(null);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "News load नहीं हो पाई"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNews();
    }
  }, [id]);

  // =========================================================
  // CLEANUP IMAGE PREVIEW
  // =========================================================

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================================================
  // HANDLE IMAGE
  // =========================================================

  const handleImageChange = (e) => {
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

    // 10 MB
    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Featured image must be less than 10 MB."
      );

      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");

    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // =========================================================
  // REMOVE NEW IMAGE
  // =========================================================

  const handleRemoveImage = () => {
    setImageFile(null);

    const input =
      document.getElementById(
        "featuredImage"
      );

    if (input) {
      input.value = "";
    }

    // Restore old image
    setImagePreview(existingImage);

    setError("");
    setSuccess("");
  };

  // =========================================================
  // UPDATE NEWS
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (
        !form.title.trim() ||
        !form.description.trim() ||
        !form.content.trim() ||
        !form.category
      ) {
        setError(
          "Title, description, content और category required हैं."
        );

        setSaving(false);
        return;
      }

      const token =
        localStorage.getItem("adminToken");

      // =====================================================
      // FORM DATA
      // =====================================================

      const updateData = new FormData();

      updateData.append(
        "title",
        form.title.trim()
      );

      updateData.append(
        "description",
        form.description.trim()
      );

      updateData.append(
        "content",
        form.content
      );

      updateData.append(
        "category",
        form.category
      );

      updateData.append(
        "isPublished",
        String(form.isPublished)
      );

      updateData.append(
        "isBreaking",
        String(form.isBreaking)
      );

      updateData.append(
        "isTrending",
        String(form.isTrending)
      );

      updateData.append(
        "isFeatured",
        String(form.isFeatured)
      );

      updateData.append(
        "isMostRead",
        String(form.isMostRead)
      );

      // IMPORTANT:
      // Only send image if a new image was selected
      if (imageFile) {
        updateData.append(
          "thumbnail",
          imageFile
        );
      }

      const response = await fetch(
        `${API_URL}/news/admin/${id}`,
        {
          method: "PATCH",

          headers: {
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },

          // DO NOT set Content-Type manually
          body: updateData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "News update failed"
        );
      }

      setSuccess(
        "News successfully update हो गई."
      );

      setTimeout(() => {
        navigate("/admin/news");
      }, 1000);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "News update नहीं हो पाई"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <Loader2
            size={20}
            className="animate-spin text-[#b91c1c]"
          />

          <span className="text-sm font-semibold text-gray-600">
            Loading news...
          </span>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR SCREEN
  // =========================================================

  if (error && !form.title) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f8] p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c]">
            <CircleAlert size={22} />
          </div>

          <h2 className="text-lg font-bold text-gray-900">
            News Load नहीं हुई
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={() =>
                navigate("/admin/news")
              }
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back
            </button>

            <button
              type="button"
              onClick={fetchNews}
              className="rounded-xl bg-[#b91c1c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#991b1b]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f7f7f8]">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/admin/news")
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-base font-bold text-gray-900">
                Edit News
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                Update your news article
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#991b1b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* PAGE TITLE */}

        <div className="mb-7">

          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">

            <button
              type="button"
              onClick={() =>
                navigate("/admin/news")
              }
              className="transition hover:text-[#b91c1c]"
            >
              Dashboard
            </button>

            <span>/</span>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/news")
              }
              className="transition hover:text-[#b91c1c]"
            >
              News
            </button>

            <span>/</span>

            <span className="font-medium text-gray-700">
              Edit
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
            Edit Article
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update title, content, category and
            publishing settings.
          </p>
        </div>

        {/* ALERTS */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[#b91c1c]">
            <CircleAlert
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-semibold">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700">
            <Check
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-semibold">
              {success}
            </p>
          </div>
        )}

        {/* =====================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_350px]"
        >

          {/* ===================================================
              LEFT
          ==================================================== */}

          <div className="space-y-5">

            {/* ARTICLE INFORMATION */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">
                <h3 className="text-base font-black text-gray-900">
                  Article Information
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Update your article details.
                </p>
              </div>

              {/* TITLE */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter news title"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Short Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write a short description..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
                />
              </div>

              {/* CONTENT */}

              <div>

                <label className="mb-2 block text-sm font-bold text-gray-800">
                  Content
                </label>

                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={18}
                  placeholder="Write your news content..."
                  className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
                />

                <p className="mt-2 text-xs text-gray-400">
                  HTML content भी यहां रखा जा सकता है।
                </p>
              </div>
            </section>

            {/* =================================================
                FEATURED IMAGE
            ================================================== */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">
                <h3 className="text-base font-black text-gray-900">
                  Featured Image
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Upload a new image or keep the existing image.
                </p>
              </div>

              {/* IMAGE PREVIEW */}

              <div className="relative mb-4 flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={form.title || "News"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <ImageIcon size={30} />

                    <span className="text-xs">
                      No image
                    </span>
                  </div>
                )}

                {imageFile && (
                  <div className="absolute right-3 top-3 rounded-full bg-[#b91c1c] px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                    New Image
                  </div>
                )}
              </div>

              {/* FILE INPUT */}

              <input
                id="featuredImage"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* UPLOAD */}

              <label
                htmlFor="featuredImage"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-[#b91c1c] transition hover:bg-red-100"
              >
                <Upload size={17} />

                {imageFile
                  ? "Change Image"
                  : "Choose New Image"}
              </label>

              {/* SELECTED FILE */}

              {imageFile && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-3">

                  <div className="min-w-0">

                    <p className="truncate text-xs font-bold text-gray-800">
                      {imageFile.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {(
                        imageFile.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-white text-gray-500 transition hover:bg-red-100 hover:text-[#b91c1c]"
                    title="Remove selected image"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <p className="mt-3 text-xs leading-5 text-gray-400">
                JPG, JPEG, PNG या WEBP. Maximum file size
                10 MB. New image select नहीं करने पर existing
                image बनी रहेगी।
              </p>
            </section>
          </div>

          {/* ===================================================
              RIGHT SIDEBAR
          ==================================================== */}

          <div className="space-y-5">

            {/* CATEGORY */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <h3 className="mb-4 text-base font-black text-gray-900">
                Category
              </h3>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
              >
                {categories.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-gray-400">
                Database में English category save होगी।
              </p>
            </section>

            {/* PUBLISHING */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <h3 className="mb-4 text-base font-black text-gray-900">
                Publishing
              </h3>

              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                  form.isPublished
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >

                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Published
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Make this article public
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={handleChange}
                  className="h-5 w-5 accent-[#b91c1c]"
                />
              </label>
            </section>

            {/* ARTICLE LABELS */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <h3 className="mb-4 text-base font-black text-gray-900">
                Article Labels
              </h3>

              <div className="space-y-2">

                <FlagToggle
                  name="isBreaking"
                  checked={form.isBreaking}
                  onChange={handleChange}
                  icon={<Flame size={17} />}
                  title="Breaking News"
                  description="Show as breaking news"
                />

                <FlagToggle
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  icon={<Star size={17} />}
                  title="Featured"
                  description="Show in featured section"
                />

                <FlagToggle
                  name="isTrending"
                  checked={form.isTrending}
                  onChange={handleChange}
                  icon={<TrendingUp size={17} />}
                  title="Trending"
                  description="Show in trending section"
                />

                <FlagToggle
                  name="isMostRead"
                  checked={form.isMostRead}
                  onChange={handleChange}
                  icon={<Eye size={17} />}
                  title="Most Read"
                  description="Show in most read section"
                />
              </div>
            </section>

            {/* SAVE */}

            <button
              type="submit"
              disabled={saving}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#b91c1c] text-sm font-bold text-white shadow-sm transition hover:bg-[#991b1b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>

            {/* PREVIEW */}

            <button
              type="button"
              onClick={() =>
                window.open(
                  `/news/${id}`,
                  "_blank"
                )
              }
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
            >
              <Eye size={17} />
              View Article
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

// =========================================================
// FLAG TOGGLE
// =========================================================

const FlagToggle = ({
  name,
  checked,
  onChange,
  icon,
  title,
  description,
}) => {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
        checked
          ? "border-red-200 bg-red-50"
          : "border-gray-200 hover:bg-gray-50"
      }`}
    >

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          checked
            ? "bg-[#b91c1c] text-white"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-bold text-gray-800">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] text-gray-400">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-[#b91c1c]"
      />
    </label>
  );
};

export default EditNews;

