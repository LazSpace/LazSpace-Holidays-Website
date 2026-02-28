import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateItineraryHandler } from './generate-itinerary.js';
import { chatHandler } from './chat.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple API rate limiter mock
const rateLimit = new Map();
app.use((req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    if (!rateLimit.has(ip)) rateLimit.set(ip, []);
    const requests = rateLimit.get(ip).filter(time => now - time < 60000); // 1 min window
    if (requests.length >= 15) {
        return res.status(429).json({ error: "Too many requests. Please try again later." });
    }
    requests.push(now);
    rateLimit.set(ip, requests);
    next();
});

// Sitemap Generator
app.get('/api/sitemap', (req, res) => {
    const baseUrl = 'https://lazspace.life';
    const staticPages = ['', '/contact.html', '/itinerary.html', '/ai-planner.html'];
    const dynamicPages = ['/local-seo.html?city=Trivandrum', '/local-seo.html?city=Neyyattinkara'];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    staticPages.concat(dynamicPages).forEach(page => {
        xml += `
    <url>
        <loc>${baseUrl}${page}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>`;
    });

    xml += `\n</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

// Routes
app.post('/api/generate-itinerary', generateItineraryHandler);
app.post('/api/chat', chatHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`LazSpace API Server running locally on port ${PORT}`);
});
