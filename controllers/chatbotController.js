//  FIX 1: Access the API key safely from environment variables
const apiKey = process.env.GEMINI_API_KEY; 

//  FIX 2: Check for missing key before proceeding (optional but recommended)
if (!apiKey) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not set in environment variables. The chatbot will not function until this is resolved.");
}

//  IMPORTANT: Updated model URL to use the retrieved API Key
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;


/**
 * Executes a POST request with exponential backoff for resilience.
 * @param {string} url - The API endpoint URL.
 * @param {object} payload - The request body.
 * @param {number} maxRetries - Maximum number of retry attempts.
 * @returns {Promise<object>} The JSON response data.
 */
async function fetchWithRetry(url, payload, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Throw an error to trigger a retry for transient issues (e.g., 500 status)
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();

        } catch (error) {
            lastError = error;
            const delay = Math.pow(2, i) * 1000;
            if (i < maxRetries - 1) {
                // Wait for the calculated delay before retrying
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    // If all retries fail, throw the last encountered error
    throw new Error(`API request failed after ${maxRetries} attempts: ${lastError.message}`);
}


/**
 * Handles the chatbot request, ensuring the AI only responds to Rigveda-related topics.
 * @param {object} req - Express request object (contains user's prompt in req.body.prompt).
 * @param {object} res - Express response object.
 */
exports.getChatResponse = async (req, res) => {
    // 🛑 Check if the key is available before making the call
    if (!apiKey) {
        return res.status(500).json({ error: "Server configuration error: API key is missing." });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

    // 🛑 CRITICAL: The System Instruction enforces the Rigveda restriction.
    const systemPrompt = `You are a knowledgeable and dedicated Vedic scholar and expert on the Rigveda. Your primary and sole function is to provide detailed and accurate answers about the Rigveda, its Mandalas, Hymns, Deities (like Indra, Agni, Soma, Ushas, etc.), Vedic philosophy, and related historical context. You MUST NOT answer questions on any other topic, including modern events, politics, science, other religious texts, or general knowledge. If a user asks a non-Rigveda question, politely state: "My purpose is strictly limited to the Rigveda. Please ask me a question about the Vedic text."`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        // Use Google Search grounding to ensure answers are based on external, real-time knowledge
        tools: [{ "google_search": {} }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    try {
        const result = await fetchWithRetry(apiUrl, payload);
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            const text = candidate.content.parts[0].text;
            
            // Extract grounding sources for citations (optional but good practice)
            let sources = [];
            const groundingMetadata = candidate.groundingMetadata;
            if (groundingMetadata && groundingMetadata.groundingAttributions) {
                sources = groundingMetadata.groundingAttributions
                    .map(attribution => ({
                        uri: attribution.web?.uri,
                        title: attribution.web?.title,
                    }))
                    .filter(source => source.uri && source.title); 
            }

            return res.json({ response: text, sources: sources });
        } else {
            // Handle cases where the model returns an empty or blocked response
            return res.status(500).json({ error: "The AI model did not return a valid response." });
        }

    } catch (error) {
        console.error("Gemini API call failed:", error.message);
        return res.status(500).json({ 
            error: "We encountered an issue communicating with the AI. Please try again later.",
            details: error.message 
        });
    }
};