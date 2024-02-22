const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    bloodtype: { type: String, required: true },
    gender: { type: String, required: true },
    condition: { type: String, required: true },
    patient_details: { type: String, required: true }
  },
  {
    versionKey: false,
  }
);

const BlogModel = mongoose.model("blogs", blogSchema);

module.exports = { BlogModel };
