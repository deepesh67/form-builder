// C:/Users/user/OneDrive/Desktop/form management/server/src/models/Response.js
const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Response', responseSchema);
