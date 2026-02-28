import '../styles/global.css';
import '../styles/components.css';
import '../styles/sections.css';

import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { SEOManager } from './seo.js';
import { AnalyticsTracker } from '../utils/AnalyticsTracker.js';
import { SEOClusters } from './clusters.js';

// Configuration for AI Blog Engine
const BLOG_DB = {
    // This serves as an example of what an AI-generated CMS payload would look like
    1: {
        title: "The Ultimate Guide to Kerala Backwaters",
        category: "Travel Guides",
        cluster: "Kerala",
        faqs: [
            {
                question: "What is the best time to visit Kerala backwaters?",
                answer: "The ideal time is from October to March when the weather is cool and dry. Monsoon season (June to August) offers lush greenery but heavy rains."
            },
            {
                question: "Are luxury houseboats safe?",
                answer: "Yes, all premium LazSpace approved houseboats maintain rigorous safety standards, including life jackets, modern navigation, and well-trained crew."
            }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Init UI 
    const header = document.getElementById('header');
    const footerContainer = document.getElementById('footer');

    if (header) header.innerHTML = Navbar();
    if (footerContainer) footerContainer.innerHTML = Footer();

    // Mobile Menu Toggle
    const toggle = document.getElementById('navbar-toggle');
    const menu = document.getElementById('navbar-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    AnalyticsTracker.init();

    // 1. Determine Blog ID (Simulated ID 1 for now)
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id') || 1;
    const blogData = BLOG_DB[blogId];

    if (!blogData) return; // In a real app, redirect to 404 block

    // 2. Inject SEO Metadata
    SEOManager.injectMeta({
        title: `${blogData.title} | LazSpace Holidays Premium Blog`,
        description: `Read "${blogData.title}", an exclusive premium travel guide by the experts at LazSpace Holidays. Discover insights on ${blogData.category}.`
    });

    // 3. Render FAQs and generate Schema
    const faqContainer = document.getElementById('blog-faqs');
    if (faqContainer && blogData.faqs.length > 0) {
        let faqHtml = '';
        blogData.faqs.forEach(f => {
            faqHtml += `
                <div style="margin-bottom: 1.5rem;">
                    <strong style="display: block; font-size: 1.1rem; color: var(--color-primary); margin-bottom: 0.5rem;">${f.question}</strong>
                    <p style="color: #444;">${f.answer}</p>
                </div>
            `;
        });
        faqContainer.innerHTML = faqHtml;

        // Auto-inject JSON-LD FAQ Schema!
        SEOManager.injectFAQSchema(blogData.faqs);
    }

    // 4. Inject Dynamic Interlinking CTA based on Cluster
    const promoBox = document.getElementById('blog-internal-promo');
    const clusterData = SEOClusters[blogData.cluster];

    if (promoBox && clusterData) {
        // Find a random link to promote
        const randomLink = clusterData.links[Math.floor(Math.random() * clusterData.links.length)];
        promoBox.innerHTML = `
            <h4 style="margin-top: 0; color: var(--color-primary);">Exclusive LazSpace Package</h4>
            <p style="margin-bottom: 10px;">Want to experience this beautifully crafted journey? Check out our <a href="${randomLink.url}" style="color: var(--color-accent); font-weight: bold; text-decoration: underline;">${randomLink.anchor}</a> tailored exactly to your needs.</p>
        `;
    }

    // 5. Track Enquiries
    const btnEnquire = document.getElementById('blog-enquire-btn');
    if (btnEnquire) {
        btnEnquire.addEventListener('click', () => {
            // Can open a modal or redirect
            AnalyticsTracker.pushToDataLayer('Blog CTA Click', { blog_title: blogData.title, category: blogData.category });
            window.location.href = '/contact.html';
        });
    }
});
