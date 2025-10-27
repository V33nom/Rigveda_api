// --------------------------------------------------------
// RIGVEDA API SERVER SETUP (index.js)
// Combines existing Hymn API and new Chatbot API routes
// --------------------------------------------------------
require('dotenv').config(); 
const express = require('express');
const app = express();
// You should install and use the 'cors' package to allow your frontend 
// (which runs on a different port, e.g., 5173) to communicate with this backend.
const cors = require('cors'); 

// 🛑 IMPORTANT: Corrected Route Imports based on your file names
// Your existing hymns route file is named 'hymns.js'
const hymnRoutes = require('./routes/hymns'); 
// Your new chatbot route file is named 'chatbot.js'
const chatbotRoutes = require('./routes/chatbot'); 

// --------------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------------

// 1. CORS: Allows your React frontend to communicate with this server
app.use(cors());

// 2. Body Parser: To parse incoming JSON requests (needed for the chatbot prompt)
app.use(express.json()); 

// 3. Simple logging (Optional)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// --------------------------------------------------------
// API ROUTES MOUNTING
// --------------------------------------------------------

// --- Existing API Mount (Unaffected) ---
// Handles routes like /api/hymns/all or /api/hymns/:mandala
app.use('/api/hymns', hymnRoutes); 

// --- 🛑 NEW: Chatbot API Mount ---
// Handles the new chatbot endpoint, e.g., POST /api/chatbot/ask
app.use('/api/chatbot', chatbotRoutes); 

// --------------------------------------------------------
// SERVER START
// --------------------------------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running successfully on port ${PORT}`);
    console.log(`   - Hymn API available at: http://localhost:${PORT}/api/hymns/...`);
    console.log(`   - Chatbot API available at: http://localhost:${PORT}/api/chatbot/ask (POST)`);
});