const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    dob: {
      type: Date,
      required: true
    },

    designation: {
      type: String,
      enum: [
        "Reporter",
        "News Anchor",
        "Content Writer",
        "Video Editor",
        "Photographer"
      ],
      required: true
    },

    profileImage: {
      type: String,
      default: ""
    },

    city: {
      type: String,
      default: "",
      trim: true
    },

    address: {
      type: String,
      default: "",
      trim: true
    },

    joiningDate: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Employee", employeeSchema);