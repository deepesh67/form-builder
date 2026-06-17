// C:/Users/user/OneDrive/Desktop/form management/server/src/controllers/responseController.js
const Response = require('../models/Response');
const Form = require('../models/Form');
const mongoose = require('mongoose');

exports.submitResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    
    // Explicitly handle data nesting
    const responseData = req.body.data || req.body;
    
    // DUPLICATE PREVENTION: Find Email ID in responseData
    // We look for a field where key is 'email' or the value looks like an email and the form field type is 'email'
    let emailValue = null;
    try {
      const form = await Form.findById(formId);
      if (!form) return res.status(404).json({ success: false, message: 'Form not found' });

      // Identify the email field name
      const emailField = form.fields.find(f => f.type === 'email' || f.name.toLowerCase().includes('email'));
      if (emailField) {
        emailValue = responseData[emailField.name];
      }

      if (emailValue) {
        // Check if this form already has a response with this email
        // We need to query the 'data' field which is Mixed. In MongoDB, we can dot-notate into it.
        const query = { form: formId };
        query[`data.${emailField.name}`] = emailValue;
        
        const existingResponse = await Response.findOne(query);
        if (existingResponse) {
          return res.status(409).json({ 
            success: false, 
            message: 'Your response has already been submitted.' 
          });
        }
      }
    } catch (e) {
      console.warn('Duplicate check failed, proceeding anyway:', e.message);
    }

    const response = await Response.create({
      form: formId,
      data: responseData,
      ip: req.ip || req.get('X-Forwarded-For') || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    });

    res.status(201).json({ 
      success: true, 
      message: 'Submission recorded successfully', 
      responseId: response._id 
    });
  } catch (err) { 
    console.error('Submission Error:', err);
    res.status(400).json({ success: false, error: 'Database rejected submission', message: err.message });
  }
};

exports.getResponses = async (req, res) => {
  try {
    const { formId } = req.params;

    console.log('\n=== RESPONSES REQUEST ===');
    console.log('Form ID:', formId);
    console.log('Route: GET /api/responses/:formId');

    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ success: false, message: 'Invalid Form ID' });
    }

    const responses = await Response.find({ form: formId }).sort({ createdAt: -1 });
    
    console.log('Mongo Query: { form: "' + formId + '" }');
    console.log('Result Count:', responses.length);
    console.log('========================\n');

    res.json(responses);
  } catch (err) { 
    console.error('Fetch Error:', err);
    res.status(500).json({ success: false, message: 'Server error' }); 
  }
};

exports.exportCsv = async (req, res) => {
  const { formId } = req.params;
  try {
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    
    const responses = await Response.find({ form: formId }).sort({ createdAt: -1 });
    // Note: The frontend handles the CSV generation now, but keeping this for API consistency
    res.json({ success: true, responses });
  } catch (err) { res.status(500).json({ message: 'Export logic failed' }); }
};
