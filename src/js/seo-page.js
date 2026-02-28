import '../styles/global.css';
import '../styles/components.css';
import '../styles/sections.css';

import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { SEOManager } from './seo.js';
import { AnalyticsTracker } from '../utils/AnalyticsTracker.js';
import { generateInterlinksHTML, generateCrossClusterLinksHTML } from './clusters.js';

// Setup common UI
document.addEventListener('DOMContentLoaded', () => {
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

    // 1. Process URL Parameters or Route to extract {Destination} and {City}
    // For static hosting, we assume URLs like /seo-template.html?dest=Kerala&city=Dubai
    // In a true programmatic build, these strings are replaced natively.

    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('dest') || 'Kerala';
    const city = urlParams.get('city') || 'Anywhere';

    const clusterMapping = {
        'Kerala': 'Kerala',
        'Munnar': 'Kerala',
        'Wayanad': 'Kerala',
        'Golden Triangle': 'International',
        'Africa': 'International',
        'Corporate': 'Corporate'
    };

    const currentCluster = clusterMapping[destination] || 'Kerala';

    // 2. Perform DOM Swaps
    document.title = `${destination} Tour Package from ${city} | LazSpace Holidays`;

    const replaceTokens = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(/\{Destination\}/g, destination).replace(/\{City\}/g, city);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(replaceTokens);
        }
    };

    replaceTokens(document.body);

    // 3. Inject Dynamic SEO Meta Data
    SEOManager.injectMeta({
        title: `${destination} Tour Package from ${city} - Premium LazSpace Holidays`,
        description: `Book an exclusive ${destination} tour package starting from ${city}. Experience premium luxury travel, 24/7 concierge, and handcrafted itineraries by LazSpace Holidays LLP.`,
        canonical: window.location.href.split('?')[0] // Ideal: clean URL
    });

    // Inject Tour Operator Schema
    SEOManager.injectTourSchema({
        serviceType: `${destination} Tours from ${city}`,
        areaServed: destination,
        priceRange: "₹30,000 - ₹5,00,000"
    });

    // 4. Inject Keyword Cluster Interlinking (Sidebar)
    const sidebarLinksContainer = document.getElementById('seo-cluster-links');
    if (sidebarLinksContainer) {
        // Primary links for the current destination's cluster
        let linkHtml = generateInterlinksHTML(currentCluster);

        // Secondary cross-links to keep crawler moving
        linkHtml += generateCrossClusterLinksHTML(currentCluster);

        sidebarLinksContainer.innerHTML = linkHtml;
    }

    // 5. Handle Enquiry Modal
    const modal = document.getElementById('enquiry-modal');
    const btnEnq = document.getElementById('btn-seo-enquire');
    const btnClose = document.getElementById('close-modal');
    const form = document.getElementById('seo-lead-form');

    if (btnEnq) btnEnq.addEventListener('click', () => {
        modal.style.display = 'flex';
        AnalyticsTracker.pushToDataLayer('SEO Template CTA Click', { destination, city });
    });
    if (btnClose) btnClose.addEventListener('click', () => modal.style.display = 'none');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            AnalyticsTracker.pushToDataLayer('Enquiry Submitted', { form_id: 'seo_template_lead', destination, city });
            alert(`Thank you! A travel expert will contact you regarding your trip from ${city} to ${destination}.`);
            modal.style.display = 'none';
        });
    }
});
