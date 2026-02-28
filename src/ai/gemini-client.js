import { AI_PROMPTS } from './prompts.js';

/**
 * GeminiClient - Handles direct connection to Google Gemini API from the browser.
 * WARNING: Exposes API Key in frontend. Use only for rapid prototyping or trusted environments.
 */
export const GeminiClient = {
    async generateItinerary(prefs) {
        const apiKey = import.meta.env.VITE_AI_API_KEY;

        if (!apiKey) {
            throw new Error("Missing VITE_AI_API_KEY in environment variables.");
        }

        const promptText = AI_PROMPTS.ITINERARY_GENERATION
            .replace('{destination}', prefs.destination)
            .replace('{budget}', prefs.budget)
            .replace('{dates}', prefs.dates)
            .replace('{pax}', prefs.pax)
            .replace('{type}', prefs.type)
            .replace('{food}', prefs.food || 'Any')
            .replace('{hotels}', prefs.hotels)
            .replace('{language}', prefs.language || 'en');

        const payload = {
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json"
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to connect to Gemini API.");
        }

        const data = await response.json();
        const textResult = data.candidates[0].content.parts[0].text;

        try {
            return JSON.parse(textResult.trim());
        } catch (e) {
            console.error("Failed to parse Gemini JSON output:", textResult);
            throw new Error("AI returned an invalid data format. Please try again.");
        }
    },

    async generateChatResponse(message, language = 'en') {
        const apiKey = import.meta.env.VITE_AI_API_KEY;
        const promptText = AI_PROMPTS.CHATBOT_SYSTEM.replace('{language}', language);

        const payload = {
            contents: [
                { role: "user", parts: [{ text: promptText }] },
                { role: "user", parts: [{ text: message }] }
            ],
            generationConfig: { temperature: 0.7 }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to connect to LazBot Intelligence.");
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
};
