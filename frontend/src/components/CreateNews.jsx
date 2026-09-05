import { useMemo, useState } from "react";
import axios from "axios";

import {
  FiArrowLeft,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiEye,
  FiFileText,
  FiImage,
  FiLink,
  FiLoader,
  FiMapPin,
  FiSend,
  FiTag,
  FiTrendingUp,
  FiUpload,
  FiUser,
  FiX,
  FiZap,
} from "react-icons/fi";

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  { hindi: "भारत", english: "India" },
  { hindi: "दुनिया", english: "World" },
  { hindi: "राजनीति", english: "Politics" },
  { hindi: "बिजनेस", english: "Business" },
  { hindi: "टेक्नोलॉजी", english: "Technology" },
  { hindi: "खेल", english: "Sports" },
  { hindi: "मनोरंजन", english: "Entertainment" },
  { hindi: "स्वास्थ्य", english: "Health" },
  { hindi: "शिक्षा", english: "Education" },
  { hindi: "क्राइम", english: "Crime" },
  { hindi: "रोजगार", english: "Jobs" },
  { hindi: "लाइफस्टाइल", english: "Lifestyle" },
  { hindi: "ऑटोमोबाइल", english: "Automobile" },
  { hindi: "मौसम", english: "Weather" },
  { hindi: "वेब स्टोरी", english: "Web Story" },
  { hindi: "वायरल", english: "Viral" },
];

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  title: "",
  shortDescription: "",
  content: "",
  category: "",

  // Actual File
  thumbnail: null,

  // Local preview URL
  thumbnailPreview: "",

  images: [],

  videoUrl: "",
  tags: "",
  location: "",
  seoTitle: "",
  seoDescription: "",

  isPublished: true,
  isTrending: false,
};

/* =========================================================
   CREATE NEWS
========================================================= */

const CreateNews = () => {
  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);

  /* =======================================================
     SLUG
  ======================================================= */

  const slug = useMemo(() => {
    return formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  }, [formData.title]);

  /* =======================================================
     HANDLE NORMAL CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setMessage(null);
  };

  /* =======================================================
     HANDLE THUMBNAIL UPLOAD
  ======================================================= */

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /* File Type Validation */

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "कृपया JPG, PNG या WEBP image upload करें।",
      });

      e.target.value = "";
      return;
    }

    /* File Size Validation - 10MB */

    if (file.size > 10 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image का size 10MB से कम होना चाहिए।",
      });

      e.target.value = "";
      return;
    }

    /* Local Preview */

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => {
      // पुराने preview URL को release करें
      if (prev.thumbnailPreview) {
        URL.revokeObjectURL(
          prev.thumbnailPreview
        );
      }

      return {
        ...prev,
        thumbnail: file,
        thumbnailPreview: previewUrl,
      };
    });

    setMessage(null);
  };

  /* =======================================================
     REMOVE THUMBNAIL
  ======================================================= */

  const removeThumbnail = () => {
    if (formData.thumbnailPreview) {
      URL.revokeObjectURL(
        formData.thumbnailPreview
      );
    }

    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
      thumbnailPreview: "",
    }));

    // File input reset
    const input =
      document.getElementById("thumbnail-upload");

    if (input) {
      input.value = "";
    }

    setMessage(null);
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Thumbnail Required */

    if (!formData.thumbnail) {
      setMessage({
        type: "error",
        text: "कृपया खबर की मुख्य तस्वीर upload करें।",
      });

      return;
    }

    /* Required fields */

    if (!formData.title.trim()) {
      setMessage({
        type: "error",
        text: "कृपया खबर की headline डालें।",
      });

      return;
    }

    if (!formData.category) {
      setMessage({
        type: "error",
        text: "कृपया category चुनें।",
      });

      return;
    }

    if (!formData.shortDescription.trim()) {
      setMessage({
        type: "error",
        text: "कृपया खबर का सारांश डालें।",
      });

      return;
    }

    if (!formData.content.trim()) {
      setMessage({
        type: "error",
        text: "कृपया खबर की पूरी रिपोर्ट लिखें।",
      });

      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const selectedCategory =
        categories.find(
          (item) =>
            item.hindi ===
            formData.category
        );

      /* =================================================
         FORMDATA
      ================================================= */

      const uploadData = new FormData();

      uploadData.append(
        "title",
        formData.title
      );

      uploadData.append(
        "slug",
        slug
      );

      uploadData.append(
        "shortDescription",
        formData.shortDescription
      );

      uploadData.append(
        "content",
        formData.content
      );

      uploadData.append(
        "category",
        selectedCategory?.english ||
          formData.category
      );

      /* ⭐ ACTUAL IMAGE FILE */

      uploadData.append(
        "thumbnail",
        formData.thumbnail
      );

      uploadData.append(
        "videoUrl",
        formData.videoUrl
      );

      uploadData.append(
        "location",
        formData.location
      );

      uploadData.append(
        "seoTitle",
        formData.seoTitle
      );

      uploadData.append(
        "seoDescription",
        formData.seoDescription
      );

      /* Tags */

      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      uploadData.append(
        "tags",
        JSON.stringify(tags)
      );

      /* Trending */

      uploadData.append(
        "isTrending",
        String(formData.isTrending)
      );

      /* Status */

      uploadData.append(
        "status",
        formData.isPublished
          ? "published"
          : "draft"
      );

      /* Published Date */

      if (formData.isPublished) {
        uploadData.append(
          "publishedAt",
          new Date().toISOString()
        );
      }

      /* =================================================
         API REQUEST
      ================================================= */

      const { data } =
        await axios.post(
          "http://localhost:5000/api/news",
          uploadData
        );

      /* =================================================
         SUCCESS
      ================================================= */

      if (data.success) {
        setMessage({
          type: "success",
          text: "खबर और image सफलतापूर्वक प्रकाशित हो गई।",
        });

        /* Cleanup Preview */

        if (
          formData.thumbnailPreview
        ) {
          URL.revokeObjectURL(
            formData.thumbnailPreview
          );
        }

        /* Reset Form */

        setFormData(initialForm);

        const input =
          document.getElementById(
            "thumbnail-upload"
          );

        if (input) {
          input.value = "";
        }
      }

    } catch (error) {
      console.error(
        "Create News Error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data
            ?.message ||
          "खबर प्रकाशित नहीं हो सकी। कृपया दोबारा प्रयास करें।",
      });

    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     RESET
  ======================================================= */

  const resetForm = () => {
    if (formData.thumbnailPreview) {
      URL.revokeObjectURL(
        formData.thumbnailPreview
      );
    }

    setFormData(initialForm);

    setMessage(null);

    const input =
      document.getElementById(
        "thumbnail-upload"
      );

    if (input) {
      input.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#111827]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">

        <div className="max-w-[1500px] mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                window.history.back()
              }
              className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"
            >
              <FiArrowLeft size={18} />
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#b91c1c] flex items-center justify-center text-white font-black shadow-lg shadow-red-900/10">
              N
            </div>

            <div>
              <h1 className="font-black text-lg leading-none">
                न्यूज़रूम
              </h1>

              <p className="text-[11px] text-gray-500 mt-1">
                Editorial Management
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              सिस्टम ऑनलाइन
            </div>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">

              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <FiUser className="text-gray-500" />
              </div>

              <div>
                <p className="text-sm font-bold">
                  एडमिन
                </p>

                <p className="text-[11px] text-gray-500">
                  संपादक
                </p>
              </div>

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="max-w-[1500px] mx-auto px-4 md:px-8 py-8">

        {/* TOP HEADING */}

        <div className="mb-8">

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <span>डैशबोर्ड</span>
            <span>/</span>

            <span className="font-semibold text-gray-900">
              नई खबर
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

            <div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-[#b91c1c] text-[10px] uppercase tracking-[0.15em] font-black">
                <FiZap />
                न्यूज़ स्टूडियो
              </div>

              <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-3">
                नई खबर तैयार करें
              </h2>

              <p className="text-gray-500 mt-2 max-w-2xl">
                खबर लिखें, तस्वीर जोड़ें, SEO सेट करें और
                अपने पाठकों तक खबर तुरंत पहुँचाएँ।
              </p>

            </div>

            <div className="inline-flex self-start lg:self-auto items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-500 shadow-sm">
              <FiClock />
              अंतिम बदलाव अभी
            </div>

          </div>

        </div>

        {/* MESSAGE */}

        {message && (
          <div
            className={`mb-7 rounded-xl px-4 py-4 flex items-center justify-between border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >

            <div className="flex items-center gap-3">

              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">

                {message.type === "success" ? (
                  <FiCheck />
                ) : (
                  <FiX />
                )}

              </div>

              <span className="text-sm font-semibold">
                {message.text}
              </span>

            </div>

            <button
              type="button"
              onClick={() =>
                setMessage(null)
              }
              className="opacity-50 hover:opacity-100"
            >
              <FiX />
            </button>

          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_390px] gap-7">

            {/* =================================================
                LEFT COLUMN
            ================================================== */}

            <div className="space-y-7">

              {/* STORY DETAILS */}

              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <SectionHeader
                  number="01"
                  icon={<FiFileText />}
                  title="खबर की जानकारी"
                  description="अपनी खबर की मुख्य जानकारी दर्ज करें"
                />

                <div className="p-6 space-y-6">

                  {/* TITLE */}

                  <div>

                    <div className="flex items-center justify-between mb-2">

                      <label className="text-sm font-bold">
                        खबर की हेडलाइन
                      </label>

                      <span className="text-xs text-gray-400">
                        {formData.title.length}/200
                      </span>

                    </div>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      maxLength={200}
                      required
                      placeholder="उदाहरण: भारत में डिजिटल टेक्नोलॉजी के क्षेत्र में बड़ा बदलाव..."
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50/60 text-xl md:text-2xl font-black placeholder:text-gray-300 outline-none focus:bg-white focus:border-[#b91c1c] focus:ring-4 focus:ring-red-50 transition"
                    />

                    {formData.title && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">

                        <FiLink />

                        <span>
                          Slug:
                        </span>

                        <span className="font-medium text-gray-600 break-all">
                          /news/{slug}
                        </span>

                      </div>
                    )}

                  </div>

                  {/* CATEGORY + LOCATION */}

                  <div className="grid md:grid-cols-2 gap-5">

                    <div>

                      <label className="block text-sm font-bold mb-2">
                        श्रेणी
                      </label>

                      <div className="relative">

                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="appearance-none w-full px-4 py-3.5 pr-10 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#b91c1c] focus:ring-4 focus:ring-red-50"
                        >

                          <option value="">
                            श्रेणी चुनें
                          </option>

                          {categories.map(
                            (category) => (
                              <option
                                key={
                                  category.english
                                }
                                value={
                                  category.hindi
                                }
                              >
                                {category.hindi}
                              </option>
                            )
                          )}

                        </select>

                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />

                      </div>

                    </div>

                    <div>

                      <label className="block text-sm font-bold mb-2">
                        स्थान
                      </label>

                      <div className="relative">

                        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="नई दिल्ली, भारत"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#b91c1c] focus:ring-4 focus:ring-red-50"
                        />

                      </div>

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div>

                    <div className="flex items-center justify-between mb-2">

                      <label className="text-sm font-bold">
                        खबर का सारांश
                      </label>

                      <span className="text-xs text-gray-400">
                        {formData.shortDescription.length}/500
                      </span>

                    </div>

                    <textarea
                      name="shortDescription"
                      value={
                        formData.shortDescription
                      }
                      onChange={handleChange}
                      maxLength={500}
                      rows={4}
                      required
                      placeholder="इस खबर में क्या खास है? 2-4 लाइनों में बताएं..."
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/60 resize-none outline-none focus:bg-white focus:border-[#b91c1c] focus:ring-4 focus:ring-red-50"
                    />

                  </div>

                </div>

              </section>

              {/* CONTENT */}

              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <SectionHeader
                  number="02"
                  icon={<FiFileText />}
                  title="खबर की पूरी रिपोर्ट"
                  description="पूरी खबर को विस्तार से लिखें"
                />

                <div className="p-6">

                  <div className="rounded-xl border border-gray-200 overflow-hidden">

                    <div className="h-11 px-3 bg-gray-50 border-b border-gray-200 flex items-center gap-1">

                      <ToolbarButton
                        text="B"
                        bold
                      />

                      <ToolbarButton
                        text="I"
                        italic
                      />

                      <ToolbarButton
                        text="U"
                        underline
                      />

                      <div className="w-px h-5 bg-gray-200 mx-2" />

                      <ToolbarButton text="H2" />

                      <ToolbarButton text="• सूची" />

                      <ToolbarButton text="❝ उद्धरण" />

                    </div>

                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      required
                      rows={18}
                      placeholder={`यहाँ पूरी खबर लिखना शुरू करें...

पहले पैराग्राफ में खबर की सबसे महत्वपूर्ण जानकारी दें।

इसके बाद घटना, बयान, आंकड़े और जरूरी संदर्भ विस्तार से लिखें।`}
                      className="w-full px-5 py-5 resize-y outline-none text-[16px] leading-8"
                    />

                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-3 text-xs text-gray-400">

                    <span>
                      छोटे पैराग्राफ आपकी खबर को पढ़ने में आसान बनाते हैं।
                    </span>

                    <span>
                      {formData.content.length} अक्षर
                    </span>

                  </div>

                </div>

              </section>

              {/* SEO */}

              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <SectionHeader
                  number="05"
                  icon={<FiTag />}
                  title="SEO और टैग्स"
                  description="Google और सर्च के लिए खबर को बेहतर बनाएं"
                />

                <div className="p-6 space-y-5">

                  {/* TAGS */}

                  <div>

                    <label className="block text-sm font-bold mb-2">
                      टैग्स
                    </label>

                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="भारत, टेक्नोलॉजी, AI, डिजिटल इंडिया"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#b91c1c] focus:ring-4 focus:ring-red-50"
                    />

                    <p className="text-xs text-gray-400 mt-2">
                      टैग्स को comma से अलग करें।
                    </p>

                  </div>

                  {/* SEO TITLE */}

                  <div>

                    <div className="flex justify-between mb-2">

                      <label className="text-sm font-bold">
                        SEO Title
                      </label>

                      <span className="text-xs text-gray-400">
                        {formData.seoTitle.length}/70
                      </span>

                    </div>

                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleChange}
                      maxLength={70}
                      placeholder="Google में दिखाई देने वाला title"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#b91c1c] focus:ring-4 focus:ring-red-50"
                    />

                  </div>

                  {/* SEO DESCRIPTION */}

                  <div>

                    <div className="flex justify-between mb-2">

                      <label className="text-sm font-bold">
                        SEO Description
                      </label>

                      <span className="text-xs text-gray-400">
                        {formData.seoDescription.length}/160
                      </span>

                    </div>

                    <textarea
                      name="seoDescription"
                      value={
                        formData.seoDescription
                      }
                      onChange={handleChange}
                      rows={3}
                      maxLength={160}
                      placeholder="Google search result में दिखाई देने वाला छोटा description..."
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 resize-none outline-none focus:border-[#b91c1c] focus:ring-4 focus:ring-red-50"
                    />

                  </div>

                </div>

              </section>

            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================== */}

            <aside className="space-y-7">

              {/* =================================================
                  THUMBNAIL UPLOAD
              ================================================== */}

              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <SectionHeader
                  number="03"
                  icon={<FiImage />}
                  title="मुख्य तस्वीर"
                  description="खबर की featured image"
                />

                <div className="p-6">

                  {/* IMAGE PREVIEW */}

                  {formData.thumbnailPreview ? (

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4">

                      <img
                        src={
                          formData.thumbnailPreview
                        }
                        alt="News Preview"
                        className="w-full h-full object-cover"
                      />

                      {/* Live Preview Badge */}

                      <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs">

                        <FiEye />

                        लाइव प्रीव्यू

                      </div>

                      {/* Remove Button */}

                      <button
                        type="button"
                        onClick={
                          removeThumbnail
                        }
                        className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition shadow-lg"
                        title="Image हटाएं"
                      >
                        <FiX />
                      </button>

                    </div>

                  ) : (

                    /* UPLOAD BOX */

                    <label
                      htmlFor="thumbnail-upload"
                      className="aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 hover:border-red-300 transition"
                    >

                      <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-3">

                        <FiUpload size={22} />

                      </div>

                      <p className="font-bold text-gray-700">
                        तस्वीर अपलोड करें
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG या WEBP
                      </p>

                      <p className="text-[11px] text-gray-400 mt-1">
                        अधिकतम 10MB
                      </p>

                    </label>

                  )}

                  {/* HIDDEN FILE INPUT */}

                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                      handleThumbnailChange
                    }
                    className="hidden"
                  />

                  {/* SELECTED FILE INFO */}

                  {formData.thumbnail && (

                    <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200">

                      <div className="flex items-start gap-3">

                        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-green-600 shrink-0">
                          <FiCheck />
                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-semibold text-green-700 truncate">
                            {
                              formData.thumbnail
                                .name
                            }
                          </p>

                          <p className="text-xs text-green-600 mt-1">
                            {(
                              formData.thumbnail
                                .size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </p>

                        </div>

                      </div>

                    </div>

                  )}

                  <p className="text-xs text-gray-400 mt-3">
                    बेहतर परिणाम के लिए 16:9 image इस्तेमाल करें।
                  </p>

                </div>

              </section>

              {/* VIDEO */}

              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <SectionHeader
                  number="04"
                  icon={<FiLink />}
                  title="वीडियो"
                  description="खबर से संबंधित वीडियो जोड़ें"
                />

                <div className="p-6">

                  <div className="relative">

                    <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleChange}
                      placeholder="https://youtube.com/..."
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#b91c1c] focus:ring-4 focus:ring-red-50"
                    />

                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    YouTube या supported video URL डाल सकते हैं।
                  </p>

                </div>

              </section>

              {/* PUBLISH */}

              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <SectionHeader
                  number="06"
                  icon={<FiSend />}
                  title="पब्लिश सेटिंग्स"
                  description="खबर कहाँ और कैसे दिखाई देगी"
                />

                <div className="p-4">

                  <Toggle
                    icon={<FiSend />}
                    label="खबर प्रकाशित करें"
                    description="खबर वेबसाइट पर दिखाई देगी"
                    name="isPublished"
                    checked={
                      formData.isPublished
                    }
                    onChange={handleChange}
                  />

                  <Toggle
                    icon={<FiTrendingUp />}
                    label="ट्रेंडिंग में दिखाएं"
                    description="Trending section में शामिल करें"
                    name="isTrending"
                    checked={
                      formData.isTrending
                    }
                    onChange={handleChange}
                  />

                </div>

              </section>

              {/* LIVE PREVIEW */}

              <section className="bg-[#111827] rounded-2xl overflow-hidden shadow-xl text-white">

                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400">
                      लाइव प्रीव्यू
                    </p>

                    <h3 className="font-bold mt-1">
                      न्यूज़ कार्ड
                    </h3>

                  </div>

                  <span className="px-2 py-1 rounded bg-white/10 text-[10px]">
                    PREVIEW
                  </span>

                </div>

                {/* PREVIEW IMAGE */}

                {formData.thumbnailPreview ? (

                  <img
                    src={
                      formData.thumbnailPreview
                    }
                    alt=""
                    className="w-full aspect-video object-cover"
                  />

                ) : (

                  <div className="w-full aspect-video bg-gray-800 flex items-center justify-center text-gray-500">

                    <FiImage size={35} />

                  </div>

                )}

                <div className="p-5">

                  {formData.category && (

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#b91c1c] text-white text-[9px] uppercase tracking-wider font-black">

                      <FiTag />

                      {formData.category}

                    </span>

                  )}

                  <h4 className="text-xl font-black leading-tight mt-3">

                    {formData.title ||
                      "आपकी खबर की हेडलाइन यहाँ दिखाई देगी"}

                  </h4>

                  <p className="text-sm text-gray-400 leading-6 mt-3 line-clamp-3">

                    {formData.shortDescription ||
                      "खबर का सारांश यहाँ दिखाई देगा।"}

                  </p>

                  {formData.location && (

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-4">

                      <FiMapPin />

                      {formData.location}

                    </div>

                  )}

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs text-gray-500">

                    <span>
                      न्यूज़ डेस्क
                    </span>

                    <span>
                      अभी
                    </span>

                  </div>

                </div>

              </section>

            </aside>

          </div>

          {/* =================================================
              ACTION BAR
          ================================================== */}

          <div className="mt-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <div className="flex items-center gap-2">

                  <span className="w-2 h-2 rounded-full bg-green-500" />

                  <p className="font-bold text-sm">
                    खबर तैयार है?
                  </p>

                </div>

                <p className="text-xs text-gray-500 mt-1">
                  प्रकाशित करने से पहले headline, image और content जरूर जांचें।
                </p>

              </div>

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-bold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  साफ करें
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="min-w-[180px] px-6 py-3 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] disabled:opacity-60 text-white text-sm font-black shadow-lg shadow-red-900/10 transition flex items-center justify-center gap-2"
                >

                  {loading ? (

                    <>
                      <FiLoader className="animate-spin" />

                      प्रकाशित हो रही है...
                    </>

                  ) : (

                    <>
                      <FiSend />

                      खबर प्रकाशित करें
                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        </form>

      </main>

    </div>
  );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
  number,
  icon,
  title,
  description,
}) => {
  return (
    <div className="px-6 py-5 border-b border-gray-100">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-red-50 text-[#b91c1c] flex items-center justify-center">
          {icon}
        </div>

        <div className="flex-1">

          <div className="flex items-center gap-2">

            <span className="text-[9px] font-black text-gray-400">
              {number}
            </span>

            <h3 className="font-black text-base">
              {title}
            </h3>

          </div>

          <p className="text-xs text-gray-500 mt-0.5">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
};

/* =========================================================
   TOOLBAR BUTTON
========================================================= */

const ToolbarButton = ({
  text,
  bold,
  italic,
  underline,
}) => {
  return (
    <button
      type="button"
      className={`h-8 px-2.5 rounded-lg hover:bg-white text-xs text-gray-600 ${
        bold ? "font-black" : ""
      } ${
        italic ? "italic" : ""
      } ${
        underline ? "underline" : ""
      }`}
    >
      {text}
    </button>
  );
};

/* =========================================================
   TOGGLE
========================================================= */

const Toggle = ({
  icon,
  label,
  description,
  name,
  checked,
  onChange,
}) => {
  return (
    <label className="flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition">

      <div className="flex items-start gap-3">

        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            checked
              ? "bg-red-50 text-[#b91c1c]"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {icon}
        </div>

        <div>

          <p className="text-sm font-bold text-gray-800">
            {label}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {description}
          </p>

        </div>

      </div>

      <div className="relative shrink-0">

        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />

        <div className="w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-[#b91c1c] transition" />

        <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />

      </div>

    </label>
  );
};

export default CreateNews;

