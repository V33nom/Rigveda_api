// --------------------------------------------------------
// RIGVEDA API SERVER SETUP (index.js)
// Combines existing Hymn API and new Chatbot API routes
// --------------------------------------------------------

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// --------------------------------------------------------
// ROUTES IMPORTS
// --------------------------------------------------------
const hymnRoutes = require('./routes/hymns');
const chatbotRoutes = require('./routes/chatbot');

// --------------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------------

// 1️⃣ CORS: Allow frontend (like Vite/React or deployed frontend) to access API
app.use(cors({
  origin: '*', // 👈 You can restrict this later to your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// 2️⃣ Body Parser: For JSON requests
app.use(express.json());

// 3️⃣ Simple request logger (for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// --------------------------------------------------------
// ROUTE MOUNTING
// --------------------------------------------------------
app.use('/api/hymns', hymnRoutes);
app.use('/api/chatbot', chatbotRoutes);

// --------------------------------------------------------
// HEALTH CHECK (✅ Optional but Recommended for Render)
// --------------------------------------------------------
app.get('/', (req, res) => {
  res.send('Rigveda API is live and running! 🔱');
});

// --------------------------------------------------------
// SERVER START
// --------------------------------------------------------
const PORT = process.env.PORT || 10000; 
// 👆 Render dynamically assigns PORT — this fallback is just for local dev

app.listen(PORT, '0.0.0.0', () => { // 👈 ensure accessible externally on Render
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   - Hymn API: /api/hymns`);
  console.log(`   - Chatbot API: /api/chatbot/ask`);
});
