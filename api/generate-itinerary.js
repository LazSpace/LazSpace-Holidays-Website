import { AI_PROMPTS } from '../src/ai/prompts.js';

// Placeholder for OpenAI / Gemini API call
// export default async function(req, res) { ... } for Vercel

export const generateItineraryHandler = async (req, res) => {
    try {
        const { destination, budget, dates, pax, type, food, hotels, language } = req.body;

        // Basic input sanitization
        if (!destination || !budget) {
            return res.status(400).json({ error: "Destination and Budget are required." });
        }

        const apiKey = process.env.AI_API_KEY;
        console.log("TRACE API KEY TYPE:", typeof apiKey, "VALUE:", apiKey ? "EXISTS" : "MISSING");
        if (!apiKey) {
            // Return Mock JSON if no API Key (for local dev testing)
            console.warn("No AI_API_KEY found, returning mock data.");
            return res.status(200).json({
                error_trace: `TRACED TYPE=${typeof apiKey}, VALUE=${apiKey}, CWD=${process.cwd()}`,
                overview: `A fantastic ${type} trip to ${destination} tailored to your budget of ${budget}.`,
                days: [
                    { day: 1, title: `Arrival in ${destination}`, activities: ["Airport transfer", "Check-in at hotel", "Evening leisure walk"] },
                    { day: 2, title: "City Tour", activities: ["Guided city tour", "Local cuisine tasting"] },
                    { day: 3, title: "Departure", activities: ["Breakfast", "Airport transfer"] }
                ],
                inclusions: [`${hotels} Hotel accommodation`, "Daily Breakfast", "Airport Transfers"],
                exclusions: ["Flights", "Visa fees", "Personal expenses"],
                estimated_price_range: budget
            });
        }

        const promptText = AI_PROMPTS.ITINERARY_GENERATION
            .replace('{destination}', destination)
            .replace('{budget}', budget)
            .replace('{dates}', dates)
            .replace('{pax}', pax)
            .replace('{type}', type)
            .replace('{food}', food)
            .replace('{hotels}', hotels)
            .replace('{language}', language || 'en');

        const geminiPayload = {
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json"
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiPayload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
        }

        const responseData = await response.json();
        const responseText = responseData.candidates[0].content.parts[0].text;

        let parsedData;
        try {
            parsedData = JSON.parse(responseText.trim());
        } catch (e) {
            console.error("Failed to parse AI JSON:", responseText);
            throw new Error("AI returned invalid JSON format.");
        }

        res.status(200).json(parsedData);

    } catch (error) {
        console.error("Itinerary Gen Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
