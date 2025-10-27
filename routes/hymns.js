const express = require("express");
const router = express.Router();

// 💡 FIX: When a CJS file (this file) imports an ESM file (hymnsController.js) 
// using 'require', it resolves the named exports differently.
// To ensure the new functions are available, we must access all functions 
// as properties of the imported object: hymnsController.functionName.
const hymnsController = require("../controllers/hymnsController");

// Get all hymns
router.get("/", hymnsController.getAll);

// Get hymns by mandala
router.get("/mandala/:id", hymnsController.getByMandala);

// Get deity-verse graph
// 🛑 FIX: Access the function via the imported object
router.get("/deity-graph", hymnsController.getDeityGraphData);

// fetch hymns for specific deity
// 🛑 FIX: Access the function via the imported object
router.get("/deity/:name", hymnsController.getHymnsByDeity);

// Search hymns
router.get("/search", hymnsController.search);

// Get specific verse
router.get("/:mandala/:hymn/:verse", hymnsController.getVerse);

// Add this new dedicated route for themes
router.get("/themes/:name", hymnsController.getByThemeName);

module.exports = router;

