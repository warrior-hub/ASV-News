const News = require("../models/news.model");

const categoryMap = {
  india: "भारत",
  world: "दुनिया",
  business: "बिजनेस",
  technology: "टेक्नोलॉजी",
  sports: "खेल",
  entertainment: "मनोरंजन",
  education: "शिक्षा",
  politics: "राजनीति"
};
const createNews = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      content,
      category,
      images,
      videoUrl,
      tags,
      location,
      seoTitle,
      seoDescription,
      status,
      isTrending,
      isEditorsPick,
      isMostRead,
      isBreaking,
      isFeatured,
    } = req.body;


    const thumbnail = req.file?.path
    console.log("CREATE NEWS BODY:", req.body);

    // VALIDATION
    if (
      !title ||
      !shortDescription ||
      !content ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, shortDescription, content, category and thumbnail are required",
      });
    }

    // CREATE SLUG
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const existingNews = await News.findOne({ slug });

    if (existingNews) {
      slug = `${slug}-${Date.now()}`;
    }

    // CREATE NEWS
    const news = await News.create({
      title,
      shortDescription,
      content,
      category,

      thumbnail,

      images: Array.isArray(images) ? images : [],

      videoUrl: videoUrl || "",
      tags: Array.isArray(tags) ? tags : [],
      location: location || "",
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",

      slug,

      status: status || "draft",

      isTrending: isTrending ?? false,
      isEditorsPick: isEditorsPick ?? false,
      isMostRead: isMostRead ?? false,
      isBreaking: isBreaking ?? false,
      isFeatured: isFeatured ?? false,

      publishedAt: status === "published" ? new Date() : null,
    });

    return res.status(201).json({
      success: true,
      message: "News uploaded successfully",
      news,
    });

  } catch (error) {
    console.error("Create News Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload news",
      error: error.message,
    });
  }
};
const getAllNews = async (req, res) => {
  try {
    const news = await News.find({
      status: "published",
    })
      .sort({ publishedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: news.length,
      news,
    });
  } catch (error) {
    console.error("Get All News Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch news",
      error: error.message,
    });
  }
};
const getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const categoryKey = category?.toLowerCase();

    const categoryName = categoryMap[categoryKey];

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    const news = await News.find({
      category: categoryName,
      status: "published",
    })
      .sort({ publishedAt: -1 })
      .populate("author", "name")
      .lean();

    return res.status(200).json({
      success: true,
      category: categoryName,
      count: news.length,
      news,
    });
  } catch (error) {
    console.error("Get Category News Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category news",
      error: error.message,
    });
  }
};
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findOne({
      _id: id,
      status: "published",
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    console.error("Get News By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch news",
      error: error.message,
    });
  }
};
const getAdminNews = async (req, res) => {
  try {
    const news = await News.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: news.length,
      news,
    });
  } catch (error) {
    console.error("Admin Get News Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin news",
      error: error.message,
    });
  }
};
const updateNewsFlags = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const allowedFields = [
      "isBreaking",
      "isFeatured",
      "isTrending",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (typeof req.body[field] === "boolean") {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid flag",
      });
    }

    const news = await News.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News settings updated",
      news,
    });
  } catch (error) {
    console.error("Update Flags Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update news settings",
      error: error.message,
    });
  }
};
const publishNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndUpdate(
      id,
      {
        status: "published",
        publishedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News published successfully",
      news,
    });
  } catch (error) {
    console.error("Publish News Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to publish news",
      error: error.message,
    });
  }
};
const unpublishNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndUpdate(
      id,
      {
        status: "draft",
        publishedAt: null,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News moved to draft",
      news,
    });
  } catch (error) {
    console.error("Unpublish News Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unpublish news",
      error: error.message,
    });
  }
};
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Delete News Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete news",
      error: error.message,
    });
  }
};
const getAdminNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    console.error("Get Admin News Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch news",
      error: error.message,
    });
  }
};
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      content,
      category,
      isPublished,
      isBreaking,
      isTrending,
      isFeatured,
      isMostRead,
    } = req.body;

    /*
    ============================================
    BASIC VALIDATION
    ============================================
    */

    if (
      !title?.trim() ||
      !description?.trim() ||
      !content?.trim() ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, content and category are required",
      });
    }

    /*
    ============================================
    FIND NEWS
    ============================================
    */

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    /*
    ============================================
    CATEGORY
    ============================================
    */

    const allowedCategories = [
      "india",
      "world",
      "business",
      "technology",
      "sports",
      "entertainment",
      "education",
      "politics",
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    /*
    ============================================
    BOOLEAN CONVERSION
    ============================================
    
    FormData ke through values string me aa sakti hain:
    
    "true"  -> true
    "false" -> false
    */

    const toBoolean = (value) => {
      return value === true || value === "true";
    };

    const published = toBoolean(isPublished);
    const breaking = toBoolean(isBreaking);
    const trending = toBoolean(isTrending);
    const featured = toBoolean(isFeatured);
    const mostRead = toBoolean(isMostRead);

    /*
    ============================================
    SLUG
    ============================================
    */

    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const existingNews = await News.findOne({
      slug,
      _id: { $ne: id },
    });

    if (existingNews) {
      slug = `${slug}-${Date.now()}`;
    }

    /*
    ============================================
    UPDATE BASIC FIELDS
    ============================================
    */

    news.title = title.trim();

    news.shortDescription = description.trim();

    news.content = content;

    news.category = category;

    news.slug = slug;

    /*
    ============================================
    STATUS
    ============================================
    */

    news.status = published
      ? "published"
      : "draft";

    news.publishedAt = published
      ? news.publishedAt || new Date()
      : null;

    /*
    ============================================
    FLAGS
    ============================================
    */

    news.isBreaking = breaking;

    news.isTrending = trending;

    news.isFeatured = featured;

    news.isMostRead = mostRead;

    /*
    ============================================
    THUMBNAIL
    ============================================
    
    New image select ki hai:
      -> Cloudinary wali new image save hogi
    
    New image select nahi ki:
      -> Purani image database me same rahegi
    */

    if (req.file) {
      news.thumbnail = req.file.path;
    }

    /*
    ============================================
    SAVE
    ============================================
    */

    await news.save();

    return res.status(200).json({
      success: true,
      message: "News updated successfully",
      news,
    });
  } catch (error) {
    console.error("Update News Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update news",
      error: error.message,
    });
  }
};
const searchNews = async (req, res) => {
  try {
    const { q } = req.query;

    const searchQuery = q?.trim();

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const news = await News.find({
      status: "published",
      $or: [
        {
          title: {
            $regex: searchQuery,
            $options: "i",
          },
        },
        {
          shortDescription: {
            $regex: searchQuery,
            $options: "i",
          },
        },
        {
          content: {
            $regex: searchQuery,
            $options: "i",
          },
        },
        {
          category: {
            $regex: searchQuery,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: searchQuery,
            $options: "i",
          },
        },
        {
          location: {
            $regex: searchQuery,
            $options: "i",
          },
        },
      ],
    })
      .sort({ publishedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: news.length,
      query: searchQuery,
      news,
    });
  } catch (error) {
    console.error("Search News Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search news",
      error: error.message,
    });
  }
};


module.exports = {
  createNews,
  getAllNews,
  getNewsByCategory,
  getNewsById,
  searchNews,
  // Admin
  getAdminNews,
  getAdminNewsById,
  updateNews,
  deleteNews,
  publishNews,
  unpublishNews,
  updateNewsFlags,
};
