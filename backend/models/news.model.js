const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    shortDescription: {
      type: String,
      // required: true,
      maxlength: 500
    },

    content: {
      type: String,
      required: true
    },

    thumbnail: {
      type: String,
      required: true
    },

    images: [
      {
        type: String
      }
    ],

    videoUrl: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      required: true
    },

    tags: [
      {
        type: String,
        trim: true
      }
    ],
    location: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    isEditorsPick: { type: Boolean, default: false }, isMostRead: { type: Boolean, default: false },

    isBreaking: {
      type: Boolean,
      default: false
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    isTrending: {
      type: Boolean,
      default: false
    },

    views: {
      type: Number,
      default: 0
    },

    likes: {
      type: Number,
      default: 0
    },

    seoTitle: {
      type: String,
      default: ""
    },

    seoDescription: {
      type: String,
      default: ""
    },

    publishedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("News", newsSchema);