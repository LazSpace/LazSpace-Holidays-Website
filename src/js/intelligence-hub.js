import { SEOManager } from './seo.js';
import { AnalyticsTracker } from '../utils/AnalyticsTracker.js';

/**
 * Travel Intelligence Hub Controller
 * Handles dynamic data injection for Visa, Best Time, and Guides
 */
export const IntelligenceHub = {
    data: {
        visa: null,
        seasons: null,
        budget: null
    },

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type'); // visa, best-time, guide
        const id = urlParams.get('id'); // e.g., bali, kerala

        if (!type || !id) return;

        try {
            await this.loadData(type);
            this.render(type, id);
        } catch (err) {
            console.error("Intelligence Hub Load Error:", err);
        }
    },

    async loadData(type) {
        const fileMap = {
            'visa': '/data/visa.json',
            'best-time': '/data/seasons.json',
            'guide': '/data/visa.json' // Guide combines multiple, but let's start with basic
        };

        const res = await fetch(fileMap[type] || '/data/visa.json');
        this.data[type] = await res.json();
    },

    render(type, id) {
        const contentArea = document.getElementById('hub-content');
        if (!contentArea) return;

        const item = this.data[type].destinations[id.toLowerCase()];
        if (!item) {
            contentArea.innerHTML = `<h3>Information not found for ${id}</h3>`;
            return;
        }

        if (type === 'visa') {
            this.renderVisa(item, id);
        } else if (type === 'best-time') {
            this.renderSeasons(item, id);
        }

        // Inject SEO
        this.injectSEO(type, id, item);
    },

    renderVisa(data, id) {
        const container = document.getElementById('hub-content');
        container.innerHTML = `
      <div class="visa-engine card" style="padding: 2rem; border-top: 5px solid var(--color-accent);">
        <div style="margin-bottom: 2rem;">
          <span class="badge badge-trust">Visa Information</span>
          <h2 style="margin-top: 1rem;">${data.country} Visa Requirements</h2>
          <p class="text-muted">Last updated: ${data.last_updated}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
          <div>
            <h4 style="color: var(--color-accent);">Visa Type</h4>
            <p>${data.visa_type}</p>
          </div>
          <div>
            <h4 style="color: var(--color-accent);">Official Cost</h4>
            <p>${data.cost}</p>
          </div>
          <div>
            <h4 style="color: var(--color-accent);">Processing Time</h4>
            <p>${data.processing_time}</p>
          </div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h3>Required Documents</h3>
          <ul style="list-style: disc; padding-left: 20px; margin-top: 1rem; line-height: 2;">
            ${data.documents.map(doc => `<li>${doc}</li>`).join('')}
          </ul>
        </div>

        <div style="background: var(--color-bg-light); padding: 1.5rem; border-radius: 8px; font-size: 0.9rem; border-left: 4px solid #f44336;">
          <strong>Disclaimer:</strong> ${data.disclaimer}
        </div>

        <div style="margin-top: 3rem; border-top: 1px solid #eee; padding-top: 2rem;">
          <h3>Frequently Asked Questions</h3>
          <div class="faq-accordion" style="margin-top: 1rem;">
            ${data.faqs.map(faq => `
              <div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--color-primary);">${faq.q}</h4>
                <p style="margin-top: 0.5rem; color: #666;">${faq.a}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    },

    renderSeasons(data, id) {
        const container = document.getElementById('hub-content');
        const currentMonthIdx = new Date().getMonth();
        const monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        container.innerHTML = `
      <div class="seasons-engine card" style="padding: 2rem; border-top: 5px solid #4caf50;">
        <div style="margin-bottom: 2rem;">
          <span class="badge" style="background: #e8f5e9; color: #2e7d32;">Best Time to Visit</span>
          <h2 style="margin-top: 1rem;">When to visit ${id.charAt(0).toUpperCase() + id.slice(1)}?</h2>
          <p class="text-muted">Seasonal Matrix & Weather Guide</p>
        </div>

        <div style="background: var(--color-primary); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
          <h3 style="color: var(--color-accent);">Overall Best Time: ${data.best_overall}</h3>
          <p style="color: rgba(255,255,255,0.8); margin-bottom: 0;">${data.why}</p>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: var(--color-bg-light);">
                <th style="padding: 1rem; text-align: left;">Month</th>
                <th style="padding: 1rem; text-align: left;">Temp</th>
                <th style="padding: 1rem; text-align: left;">Rainfall</th>
                <th style="padding: 1rem; text-align: left;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.months.map((m, idx) => `
                <tr style="${idx === currentMonthIdx ? 'background: rgba(201,162,39,0.1); font-weight: bold;' : ''}">
                  <td style="padding: 1rem; border-bottom: 1px solid #eee;">${m.month} ${idx === currentMonthIdx ? '(Now)' : ''}</td>
                  <td style="padding: 1rem; border-bottom: 1px solid #eee;">${m.temp}</td>
                  <td style="padding: 1rem; border-bottom: 1px solid #eee;">${m.rain}</td>
                  <td style="padding: 1rem; border-bottom: 1px solid #eee;">
                    <span class="badge" style="font-size: 0.7rem; border-color: ${m.status === 'Peak' ? '#4caf50' : m.status === 'Off-Season' ? '#f44336' : '#ff9800'}">
                      ${m.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    },

    injectSEO(type, id, data) {
        const title = type === 'visa'
            ? `${data.country} Visa Guide for Indians | LazSpace Holidays`
            : `Best Time to Visit ${id.charAt(0).toUpperCase() + id.slice(1)} | Weather Guide`;

        SEOManager.injectMeta({
            title,
            description: `Plan your trip to ${id} with LazSpace Holidays. Expert advice on ${type === 'visa' ? 'visa requirements and documents' : 'the best months to visit and weather conditions'}.`
        });

        // Inject FAQ Schema
        if (data.faqs) {
            SEOManager.injectFAQSchema(data.faqs);
        }

        // Breadcrumb
        SEOManager.injectBreadcrumbSchema([
            { name: "Home", item: "/" },
            { name: "Intelligence Hub", item: "/travel-info.html" },
            { name: title, item: window.location.href }
        ]);
    }
};
