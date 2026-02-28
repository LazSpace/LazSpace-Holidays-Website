import '../styles/global.css';
import '../styles/components.css';
import '../styles/sections.css';

import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { SEOManager } from './seo.js';
import { AnalyticsTracker } from '../utils/AnalyticsTracker.js';

// Setup common UI
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const footerContainer = document.getElementById('footer');

    if (header) {
        header.innerHTML = Navbar();
        header.classList.add('navbar-inner-page');
    }
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

    // 1. Process URL Parameters for Local City
    // e.g. /local-seo.html?city=Trivandrum
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city') || 'Trivandrum';

    // 2. Perform DOM Swaps
    document.title = `Premium Travel Agency in ${city} | LazSpace Holidays`;

    const replaceTokens = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(/\{City\}/g, city);
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
            Array.from(node.childNodes).forEach(replaceTokens);
        }
    };

    replaceTokens(document.body);

    // 3. Optional distance logic overlay
    const distanceAlert = document.getElementById('distance-alert');
    if (['nagercoil', 'neyyattinkara', 'trivandrum', 'thiruvananthapuram', 'kovalam'].includes(city.toLowerCase())) {
        if (distanceAlert) {
            distanceAlert.style.display = 'block';
            distanceAlert.innerHTML = `<i class="fas fa-car"></i> You are very close to our headquarters! Drop by for a coffee.`;
        }
    }

    // 4. Inject Dynamic SEO Meta Data & LocalBusiness Schema
    SEOManager.injectMeta({
        title: `Best Travel Agency in ${city} | Tours & Packages | LazSpace`,
        description: `Looking for a trusted travel agency in ${city}? LazSpace Holidays offers premium domestic and international packages, corporate outings, and flight ticketing.`,
        canonical: window.location.href.split('?')[0]
    });

    // Inject LocalBusiness Schema specifically tailored for local results
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": `LazSpace Holidays LLP - Serving ${city}`,
        "image": "https://lazspace.life/logo.png",
        "@id": window.location.href,
        "url": window.location.href,
        "telephone": "+918921426073",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thazhe Veettuvilakam, Puthiyathura",
            "addressLocality": "Neyyattinkara",
            "addressRegion": "Kerala",
            "postalCode": "695526",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 8.359051,
            "longitude": 77.067307
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "09:30",
            "closes": "18:00"
        },
        "areaServed": city
    });
    document.head.appendChild(script);

    // 5. Handle Enquiry Modal
    const modal = document.getElementById('enquiry-modal');
    const btnEnq = document.getElementById('btn-local-enquire');
    const btnClose = document.getElementById('close-modal');
    const form = document.getElementById('local-lead-form');

    if (btnEnq) btnEnq.addEventListener('click', () => {
        modal.style.display = 'flex';
        AnalyticsTracker.pushToDataLayer('Local SEO Page CTA Click', { city });
    });
    if (btnClose) btnClose.addEventListener('click', () => modal.style.display = 'none');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            AnalyticsTracker.pushToDataLayer('Enquiry Submitted', { form_id: 'local_seo_lead', city });
            alert(`Thank you! A local travel expert from our Neyyattinkara office will call you shortly.`);
            modal.style.display = 'none';
        });
    }
});
