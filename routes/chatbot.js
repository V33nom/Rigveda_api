const express = require('express');
const router = express.Router();

// 🛑 FIX: Import the function with the correct name: getChatResponse
const { getChatResponse } = require('../controllers/chatbotController');

// 🛑 FIX: Use the correctly imported function name in the route handler.
router.post("/ask", getChatResponse);

// ✅ Keep the export syntax as CommonJS
module.exports = router;