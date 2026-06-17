// C:/Users/user/OneDrive/Desktop/form management/server/src/routes/form.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const role = require('../middleware/role');
const mongoose = require('mongoose');
const { 
  createForm, 
  getForms, 
  getForm, 
  updateForm, 
  deleteForm, 
  duplicateForm 
} = require('../controllers/formController');
const Response = require('../models/Response');

const guard = [protect, role('admin', 'user')];

// ─── Route Order Rules ────────────────────────────────────────────────────────
// 1. Specific paths (e.g. /  /:id/responses  /:id/duplicate) come FIRST
// 2. Wildcard /:id routes come LAST to avoid swallowing specific sub-paths
// 3. Public routes have NO auth middleware
// 4. Protected routes use `guard` array = [protect, role()]
// ─────────────────────────────────────────────────────────────────────────────

// ── Protected: Collection-level ───────────────────────────────────────────────
router.get('/', ...guard, getForms);
router.post('/', ...guard, createForm);

// ── Protected: Sub-resource routes (MUST be before /:id wildcard) ─────────────
const { getResponses } = require('../controllers/responseController');
router.get('/:formId/responses', ...guard, getResponses);

router.post('/:id/duplicate', ...guard, duplicateForm);

// ── Protected: All /:id operations ───────────────────────────────────────────
router.put('/:id', ...guard, updateForm);
router.delete('/:id', ...guard, deleteForm);

// ── PUBLIC: Get form by ID (no auth — needed for public submission page) ──────
// MUST be last — acts as a fallback for /:id
router.get('/:id', getForm);

module.exports = router;
