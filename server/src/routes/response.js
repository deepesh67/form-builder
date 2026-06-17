// C:/Users/user/OneDrive/Desktop/form management/server/src/routes/response.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const role = require('../middleware/role');
const { 
  submitResponse, 
  getResponses, 
  exportCsv 
} = require('../controllers/responseController');

// Public route for submissions
router.post('/:formId', submitResponse);

// Protected routes - users can view responses to forms they managed
router.use(protect);
router.use(role('admin', 'user'));

router.get('/:formId', getResponses);
router.get('/:formId/export', exportCsv);

module.exports = router;
