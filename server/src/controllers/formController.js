const Form = require('../models/Form');
const mongoose = require('mongoose');

// Helper to sanitize fields and remove problematic frontend _id
const sanitizeFields = (fields) => {
  return (fields || []).map((f, index) => {
    const cleanField = { ...f };
    delete cleanField._id; 
    
    return {
      ...cleanField,
      id: f.id || f._id || `f_${Date.now()}_${index}`,
      type: f.type || 'text',
      name: f.name || `${f.type || 'field'}_${Date.now()}_${index}`,
      label: f.label || 'Untitled Field',
      order: f.order || index,
      validation: f.validation || { required: true },
      styling: f.styling || { width: '100%' }
    };
  });
};

exports.createForm = async (req, res) => {
  try {
    console.log('\n=======================');
    console.log('=== FORM SAVE ERROR ===');
    console.log('Request Payload:', JSON.stringify(req.body, null, 2));

    const normalizedData = {
      title: req.body.title || req.body.name || 'Untitled Collection',
      description: req.body.description || '',
      fields: sanitizeFields(req.body.fields || req.body.components),
      settings: req.body.settings || {
        submitButtonText: 'Submit',
        successMessage: 'Thank you for your response!',
        active: true
      },
      createdBy: req.user?._id
    };

    if (!normalizedData.createdBy) {
      console.log('❌ Error: Not Authorized (req.user missing)');
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const form = new Form(normalizedData);
    const validationError = form.validateSync();

    if (validationError) {
      console.log('❌ Validation Error:', validationError.message);
      console.log('Schema Error:', JSON.stringify(validationError.errors, null, 2));
      console.log('=======================');
      
      const details = Object.entries(validationError.errors).map(([path, err]) => ({
        field: path,
        message: err.message
      }));

      return res.status(400).json({ 
        success: false, 
        error: 'Data Validation Failed',
        details: details
      });
    }

    const savedForm = await form.save();
    console.log('✅ Success: Form Saved:', savedForm._id);
    res.status(201).json(savedForm);

  } catch (err) {
    console.error('❌ Mongoose Error:', err.message);
    console.log('Stack Trace:', err.stack);
    console.log('=======================');
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Invalid Form ID' });
    }

    const updateData = { ...req.body };
    if (updateData.fields) updateData.fields = sanitizeFields(updateData.fields);
    
    const updatedForm = await Form.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedForm) return res.status(404).json({ success: false, error: 'Form not found' });
    res.json(updatedForm);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    const Response = require('../models/Response');
    
    // Add response count to each form
    const formsWithCounts = await Promise.all(forms.map(async (f) => {
      const count = await Response.countDocuments({ form: f._id });
      return { ...f.toObject(), responseCount: count };
    }));
    
    res.json(formsWithCounts);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getForm = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ message: 'Invalid Form ID' });
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.deleteForm = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ message: 'Invalid Form ID' });
    const result = await Form.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!result) return res.status(404).json({ message: 'Form not found or unauthorized' });
    res.json({ success: true, message: 'Form deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.duplicateForm = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ message: 'Invalid Form ID' });
    const original = await Form.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Original form not found' });
    const duplicatedData = original.toObject();
    delete duplicatedData._id;
    const duplicated = await Form.create({ ...duplicatedData, title: `${original.title} (Copy)`, createdBy: req.user._id });
    res.status(201).json(duplicated);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
