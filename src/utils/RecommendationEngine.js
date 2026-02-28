import { AnalyticsTracker } from './AnalyticsTracker.js';

export const RecommendationEngine = {
    getRecommendedPackages() {
        const data = AnalyticsTracker.getData();
        const interests = data.interests || {};

        let recommendedDestinations = [];

        // Find top interests
        const sortedInterests = Object.entries(interests).sort((a, b) => b[1] - a[1]);

        if (sortedInterests.length > 0) {
            const top = sortedInterests[0][0].toLowerCase();

            // Basic hardcoded rule logic mapping interest to packages
            if (top.includes('dubai') || top.includes('uae')) {
                recommendedDestinations = [
                    { title: "Dubai Luxury Weekend", price: "₹45,000", tag: "Luxury" },
                    { title: "Abu Dhabi Theme Parks", price: "₹55,000", tag: "Family" }
                ];
            } else if (top.includes('europe') || top.includes('swiss')) {
                recommendedDestinations = [
                    { title: "Swiss Alps Adventure", price: "₹1,50,000", tag: "Adventure" },
                    { title: "Paris & Rome Romance", price: "₹1,80,000", tag: "Couples" }
                ];
            } else {
                recommendedDestinations = [
                    { title: "Bali Tropical Escape", price: "₹35,000", tag: "Trending" },
                    { title: "Maldives Honeymoon", price: "₹85,000", tag: "Luxury" }
                ];
            }
        }

        return recommendedDestinations;
    },

    renderRecommendations(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const recs = this.getRecommendedPackages();
        if (recs.length === 0) return; // Not enough data yet to recommend anything specific

        let html = `
            <div class="recommendation-box" style="margin-top:2rem; padding:1.5rem; background:var(--color-bg-light); border-radius:8px;">
                <h3 style="color:var(--color-primary); margin-bottom:1rem;">Recommended for You (AI Driven)</h3>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
        `;

        recs.forEach(r => {
            html += `
                <div style="background:white; padding:1rem; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.05); border-left:3px solid var(--color-accent);">
                    <span style="font-size:0.7rem; background:var(--color-primary); color:white; padding:2px 6px; border-radius:3px;">${r.tag}</span>
                    <h4 style="margin: 0.5rem 0;">${r.title}</h4>
                    <p style="margin:0; font-weight:bold; color:var(--color-accent);">From ${r.price}</p>
                </div>
            `;
        });

        html += `</div></div>`;
        container.innerHTML = html;
    }
};
