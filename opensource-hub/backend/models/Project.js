const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    language: { type: String },
    desc: { type: String },
    githubUrl: { type: String, required: true },
    documentationLink: { type: String },
    discordLink: { type: String },
    stars: { type: Number, default: 0 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", ProjectSchema);
