const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  githubUsername: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // These are for the complete profile step
  number: { type: String },
  year: { type: String },
  branch: { type: String },
  section: { type: String },
  totalScore: { type: Number, default: 0 },
  selectedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
