import { PdfQuoteGenerator } from '../pdf/PdfQuoteGenerator.js';
import { MockDB } from '../crm/MockDB.js';
import { AnalyticsTracker } from '../utils/AnalyticsTracker.js';
import { GeminiClient } from '../ai/gemini-client.js';

// track page view
AnalyticsTracker.trackPageView();

console.log('[AI Planner] Script loaded. Version: 7 (Direct Web Connection)');

window.triggerAIGeneration = async () => {
    console.log('[AI Planner] Magic button submitted. Direct connection mode.');
    const form = document.getElementById('ai-planner-form');

    if (form && !form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const dest = document.getElementById('ai-dest').value;
    const budget = document.getElementById('ai-budget').value;
    const dates = document.getElementById('ai-dates').value;
    const pax = document.getElementById('ai-pax').value;
    const type = document.getElementById('ai-type').value;
    const hotels = document.getElementById('ai-hotels').value;
    const lang = document.documentElement.lang || 'en';

    console.log('[AI Planner] Preparing AI Generation for:', dest);

    // UI state toggle
    const formContainer = document.getElementById('ai-form-container');
    const loadingContainer = document.getElementById('ai-loading');
    const resContainer = document.getElementById('ai-result-container');

    if (formContainer) formContainer.style.display = 'none';
    if (loadingContainer) loadingContainer.style.display = 'block';
    if (resContainer) resContainer.style.display = 'none';

    try {
        console.log('[AI Planner] Invoking GeminiClient...');
        const data = await GeminiClient.generateItinerary({
            destination: dest, budget, dates, pax, type, hotels, language: lang
        });

        console.log('[AI Planner] AI Response Success.');

        // Track successful generation
        AnalyticsTracker.pushToDataLayer('Itinerary Generated', {
            destination: dest,
            budget_range: budget,
            travel_type: type,
            language: lang
        });

        // Save lead to Mock DB implicitly
        const leadData = {
            name: "Web Visitor",
            destination: dest,
            budget: budget,
            type: type,
            dates: dates,
            score: 20, // arbitrary base, LeadScorer could process this
            hasRequestedQuote: true
        };
        MockDB.saveLead(leadData);

        // Render Result
        document.getElementById('ai-loading').style.display = 'none';
        const resContainer = document.getElementById('ai-result-container');
        resContainer.style.display = 'block';

        // Check for API errors
        if (data.error) {
            // If the mock JSON kicks in, data will have days array. But just to be sure
            resContainer.innerHTML = `
                    <h2 style="color:var(--color-primary)">Drafting Issue</h2>
                    <p>${data.error}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
                `;
            return;
        }

        let resultHtml = `
                <div style="border-bottom:2px solid var(--color-accent); padding-bottom:1rem; margin-bottom:1rem;">
                    <h2 style="color:var(--color-primary); margin:0;">AI Crafted Itinerary: ${dest}</h2>
                    <p style="color:#666; margin-top:0.5rem;">Based on a budget of <strong>${budget}</strong> • <strong>${dates}</strong></p>
                </div>
                <p style="font-size:1.1rem; line-height:1.6; margin-bottom:2rem;">${data.overview}</p>
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <h3>Daily Schedule</h3>
            `;

        data.days.forEach(d => {
            resultHtml += `
                    <div style="background:#f9f9f9; padding:1.5rem; border-left:4px solid var(--color-primary); border-radius:4px;">
                        <h4 style="margin:0 0 0.5rem 0;">Day ${d.day}: ${d.title}</h4>
                        <ul style="margin:0; padding-left:1.2rem;">
                            ${d.activities.map(a => `<li>${a}</li>`).join('')}
                        </ul>
                    </div>
                `;
        });

        resultHtml += `
                </div>
                <div style="margin-top:2rem; padding-top:2rem; border-top:1px solid #eee; text-align:center;">
                    <p style="margin-bottom:1rem;">Love this plan? Save it as an official LazSpace quote PDF.</p>
                    <button id="download-pdf-btn" class="btn btn-accent" style="padding:1rem 2rem; font-size:1.1rem;">Download Official Quote PDF</button>
                </div>
            `;

        resContainer.innerHTML = resultHtml;

        // Bind PDF download
        document.getElementById('download-pdf-btn').addEventListener('click', () => {
            PdfQuoteGenerator.generate(data, { destination: dest, name: 'Web Guest' });
        });

    } catch (err) {
        console.error('[AI Planner] Critical Error fetching API:', err);
        const loadingContainer = document.getElementById('ai-loading');
        const resContainer = document.getElementById('ai-result-container');
        if (loadingContainer) loadingContainer.style.display = 'none';
        if (resContainer) {
            resContainer.style.display = 'block';
            resContainer.innerHTML = `
                    <h3 style="color:red;">AI Brain Connection Error</h3>
                    <p>We're having trouble connecting to the AI Trip Planner. If you're seeing this on the live site, ensure the <strong>VITE_AI_API_KEY</strong> environment variable is set in Netlify.</p>
                    <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
                    <p style="margin-top:1rem;"><small>Technical Error: ${err.message}</small></p>
                `;
        }
    }

    // Also trigger tracking for generating
    AnalyticsTracker.trackEvent('click', 'itineryGen');
};
