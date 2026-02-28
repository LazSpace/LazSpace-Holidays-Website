import { AI_PROMPTS } from '../src/ai/prompts.js';

export const chatHandler = async (req, res) => {
    try {
        const { message, history, language } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const apiKey = process.env.AI_API_KEY;
        if (!apiKey) {
            // Mock Rule-based fallback
            const lower = message.toLowerCase();
            let reply = `I am LazBot. I can help you plan trips, check visas, or recommend destinations. (Language mode: ${language || 'en'})`;

            if (lower.includes("price") || lower.includes("cost") || lower.includes("budget")) {
                reply = "Our packages range from budget-friendly to ultra-luxury. Could you share your ideal budget range?";
            } else if (lower.includes("visa")) {
                reply = "Visa requirements depend on your passport and destination. Which country are you planning to visit?";
            } else if (lower.includes("book")) {
                reply = "Great! You can request a free AI-generated itinerary above, or I can connect you with one of our human experts.";
            }

            return res.status(200).json({ reply });
        }


        const systemPrompt = AI_PROMPTS.CHATBOT_SYSTEM.replace('{language}', language || 'en');
        const promptText = `${systemPrompt}\n\nUser Message: ${message}\n\nLazBot Response:`;

        const geminiPayload = {
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
                temperature: 0.7
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiPayload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.statusText}`);
        }

        const responseData = await response.json();
        const replyText = responseData.candidates[0].content.parts[0].text.trim();

        res.status(200).json({ reply: replyText });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
