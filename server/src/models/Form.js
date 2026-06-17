const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  id: { type: String }, // Frontend temporary ID
  type: { type: String, required: true },
  label: { type: String },
  name: { type: String, required: true },
  placeholder: { type: String },
  helpText: { type: String },
  defaultValue: { type: mongoose.Schema.Types.Mixed },
  options: [
    {
      label: String,
      value: String,
    },
  ],
  validation: {
    required: { type: Boolean, default: false },
    minLength: Number,
    maxLength: Number,
    pattern: String,
    min: Number,
    max: Number,
  },
  styling: {
    width: { type: String, default: '100%' },
    color: String,
    backgroundColor: String,
  },
  props: { type: mongoose.Schema.Types.Mixed }, // Catch-all for specialized props like 'step' or 'maxSize'
  order: { type: Number, default: 0 },
});

const formSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    settings: {
      submitButtonText: { type: String, default: 'Submit' },
      successMessage: { type: String, default: 'Thank you for your response!' },
      redirectUrl: String,
      active: { type: Boolean, default: true },
      closeDate: Date,
    },
    fields: [fieldSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { 
    timestamps: true,
    minimize: false // Ensure empty objects like settings are saved
  }
);

module.exports = mongoose.model('Form', formSchema);
