import './styles/global.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/rtl.css'; // Automatically handles `.rtl` scopes on body
import './styles/ai.css';

import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { initI18n, setLang } from './js/i18n.js';
import { LazBot } from './ai/lazbot.js';
import { AnalyticsTracker } from './utils/AnalyticsTracker.js';
import { RecommendationEngine } from './utils/RecommendationEngine.js';
import { SEOManager } from './js/seo.js';
import { TagManager } from './utils/TagManager.js';
import { HeatmapManager } from './utils/HeatmapManager.js';
import { SmartForm } from './utils/smart-form.js';

// Setup common UI
document.addEventListener('DOMContentLoaded', async () => {
  const header = document.getElementById('header');
  const footerContainer = document.getElementById('footer');

  if (header) {
    header.innerHTML = Navbar();
    // Auto-apply inner-page styling if not the main landing page
    if (window.location.pathname !== '/' && !window.location.pathname.includes('index.html')) {
      header.classList.add('navbar-inner-page');
    }
  }

  if (footerContainer) {
    footerContainer.innerHTML = Footer();
  }

  // Initialize Language Engine after UI is stamped
  await initI18n();

  // Attach Language Switcher listener
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.value = localStorage.getItem('lazspace_lang') || 'en';
    langSelect.addEventListener('change', (e) => {
      setLang(e.target.value);
    });
  }

  // Initialize SEO Manager with default fallbacks
  SEOManager.injectMeta({
    title: document.title || 'LazSpace Holidays | Premium Travel Planning',
    description: 'Premium travel planning from Kerala to the world. LazSpace Holidays offers curated family trips, corporate tours, and international travel experiences.',
  });

  // Initialize Advanced Analytics (Phase 2)
  // TagManager.init('GTM-XXXXXXX'); // Uncomment and replace with real GTM ID
  HeatmapManager.init(); // Ready for Clarity/Hotjar IDs

  // Mobile Menu Toggle
  const toggle = document.getElementById('navbar-toggle');
  const menu = document.getElementById('navbar-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }

  // Sticky Navbar
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Accordion Logic (for itinerary page)
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(acc => {
    acc.addEventListener('click', function () {
      this.parentElement.classList.toggle('active');
    });
  });

  // Initialize AI Assistants & Trackers
  LazBot.init();
  AnalyticsTracker.init(); // Initialize GA4 tracking wrapper
  SmartForm.init(); // Initialize Multi-Step & Exit Intent
  RecommendationEngine.renderRecommendations('#recommendations-container'); // Ensure there's a container in index.html, else it fails safely

  // Global Event Delegation for Tracking
  document.body.addEventListener('click', (e) => {
    // Track WhatsApp Clicks
    if (e.target.closest('a[href*="wa.me"]')) {
      AnalyticsTracker.pushToDataLayer('WhatsApp Click', { source: window.location.pathname });
    }
    // Track Payment Link Clicks (assuming Razorpay links or payment buttons)
    if (e.target.closest('a[href*="razorpay.com"]') || e.target.closest('.btn-pay')) {
      AnalyticsTracker.pushToDataLayer('Payment Link Click', { source: window.location.pathname });
    }
  });

  // Track Form Submissions globally (Enquiry Submitted)
  document.body.addEventListener('submit', (e) => {
    // Exclude AI planner form which is tracked separately
    if (e.target.id === 'ai-planner-form') return;
    AnalyticsTracker.pushToDataLayer('Enquiry Submitted', { form_id: e.target.id || 'general' });
  });
});
