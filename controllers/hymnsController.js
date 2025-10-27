import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url'; // Required for getting __dirname in ESM

// ESM equivalent of __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to your JSON data file
const dataPath = path.join(__dirname, "../data/rigveda.json");

// Read the data once when the server starts
// Use synchronous file reading for initial setup, wrap in try/catch
let hymns = [];
try {
    hymns = JSON.parse(fs.readFileSync(dataPath, "utf8"));
} catch (error) {
    console.error("CRITICAL ERROR: Failed to load rigveda.json:", error.message);
    // Exit process or handle gracefully if data is essential
}

// 1. Handler for: router.get("/", hymnsController.getAll);
export const getAll = (req, res) => {
    // Returns all data. In a large-scale app, you'd implement pagination here.
    res.json(hymns);
};

// 2. Handler for: router.get("/mandala/:id", hymnsController.getByMandala);
export const getByMandala = (req, res) => {
    const { id } = req.params;
    
    // Filters based on the 'mandala' property 
    const results = hymns.filter(hymn => 
        String(hymn.mandala) === id
    );
    
    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ message: `Mandala ${id} not found.` });
    }
};

// 3. Handler for: router.get("/search", hymnsController.search);
export const search = (req, res) => {
    // It looks for a single query parameter 'q' (e.g., /search?q=Agni)
    const { q } = req.query; 

    if (!q) {
        return res.status(400).json({ message: "Search requires a 'q' query parameter (e.g., /search?q=Agni)." });
    }

    const query = q.toLowerCase();

    // Filters for results where the query matches keywords, deities, OR themes
    const results = hymns.filter(hymn =>
        hymn.keywords?.some(k => k.toLowerCase().includes(query)) ||
        hymn.deities?.some(d => d.toLowerCase().includes(query)) ||
        hymn.themes?.some(t => t.toLowerCase().includes(query))
    );

    res.json(results);
};

// 4. Handler for: router.get("/:mandala/:hymn/:verse", hymnsController.getVerse);
export const getVerse = (req, res) => {
    const { mandala, hymn, verse } = req.params;
    
    // Finds the specific verse by its unique coordinates
    const result = hymns.find(hymnData => 
        String(hymnData.mandala) === mandala && 
        String(hymnData.hymn) === hymn && 
        String(hymnData.verse) === verse 
    );
    
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ message: `Verse ${mandala}.${hymn}.${verse} not found.` });
    }
};

// 5. Handler for: router.get("/themes/:name", hymnsController.getByThemeName);
export const getByThemeName = (req, res) => {
    const { name } = req.params;
    const themeName = name.toLowerCase();

    const results = hymns.filter(hymn =>
        hymn.themes?.some(t => t.toLowerCase() === themeName)
    );

    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ message: `No verses found for theme: ${name}` });
    }
};

// 6. Handler for: router.get("/graph/deities", hymnsController.getDeityGraphData);
export const getDeityGraphData = async (req, res) => {
    try {
        // Since we are moving away from reading 'data.json' inside the function, 
        // we'll use a simplified version of the logic or assume the 'hymns' array is pre-populated.
        // NOTE: The original function had hardcoded example data, I'm keeping a static response 
        // structure for the purpose of demonstrating the fix. If you want this endpoint 
        // to use the full 'hymns' array, you'll need to update its logic significantly.

        // Mapping 'hymns' array to generate graph nodes/links (simplified logic)
        const deityMap = new Map();

        hymns.forEach(hymnData => {
            const hymnRef = `Rig ${hymnData.mandala}.${hymnData.hymn}.${hymnData.verse}`;
            hymnData.deities?.forEach(deity => {
                const lowerDeity = deity.toLowerCase();
                if (!deityMap.has(lowerDeity)) {
                    deityMap.set(lowerDeity, { deity, hymns: [], relations: new Set() });
                }
                deityMap.get(lowerDeity).hymns.push(hymnRef);
            });
        });

        // Simplified relations logic (just show hymn connections, skip deity-to-deity relations for now)
        const nodes = [];
        const links = [];

        deityMap.forEach((item, lowerDeity) => {
            // Add Deity Node
            nodes.push({
                data: { id: lowerDeity, label: item.deity, type: "Deity" },
            });

            item.hymns.forEach((hymn) => {
                // Add Hymn Node (only if unique, though the reference should be unique)
                if (!nodes.some(n => n.data.id === hymn)) {
                    nodes.push({
                        data: { id: hymn, label: hymn, type: "Hymn" },
                    });
                }
                // Link Deity to Hymn
                links.push({
                    data: { source: lowerDeity, target: hymn },
                });
            });
        });

        res.json({ nodes, links });
    } catch (err) {
        console.error("Error generating graph:", err);
        res.status(500).json({ error: "Failed to generate deity graph" });
    }
};

// ✅ Endpoint 7 (Renumbered to maintain flow) — Hymns for a given deity
export const getHymnsByDeity = (req, res) => {
    try {
        const { name } = req.params;

        // Since hymns is loaded once globally, we filter it here.
        const filtered = hymns.filter((h) =>
            h.deities?.some((d) => d.toLowerCase() === name.toLowerCase())
        );

        if (filtered.length === 0) {
            return res
                .status(404)
                .json({ message: `No hymns found for deity ${name}` });
        }

        res.json({
            deity: name,
            hymnCount: filtered.length,
            hymns: filtered.map((h) => ({
                mandala: h.mandala,
                hymn: h.hymn,
                verse: h.verse,
                sanskrit: h.sanskrit,
                translation: h.translation,
            })),
        });
    } catch (error) {
        console.error("Error processing request for hymns by deity:", error);
        res.status(500).json({ error: "Failed to load hymns" });
    }
};

// Keep the previous CommonJS exports mapping for compatibility if needed, 
// though the above named exports are the primary fix.
// Note: If your router file uses `require('./hymnsController')` and accesses `.getAll`, 
// you will need to map them back for compatibility in a mixed environment, 
// or ensure your router is also using `import`.

// If your main index/router file uses `const hymnsController = require('./hymnsController')`:
// export default {
//     getAll,
//     getByMandala,
//     search,
//     getVerse,
//     getByThemeName,
//     getDeityGraphData,
//     getHymnsByDeity
// };
