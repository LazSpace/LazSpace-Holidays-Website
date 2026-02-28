import { languages, defaultLang } from '../js/langs.js';

export function Navbar() {
  const options = Object.entries(languages).map(([code, config]) => {
    // e.g., <option value="ar">العربية</option>
    return `<option value="${code}">${config.native}</option>`;
  }).join('\n                ');

  return `
    <nav class="navbar" id="navbar">
      <div class="container navbar-container">
        <a href="/" class="navbar-logo">
          LazSpace <span>Holidays</span>
        </a>
        
        <div class="navbar-toggle" id="navbar-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="navbar-menu" id="navbar-menu">
          <ul class="navbar-nav">
            <li><a href="/" class="nav-link" data-i18n="nav.home">Home</a></li>
            <li><a href="#about" class="nav-link" data-i18n="nav.about">About Us</a></li>
            <li><a href="#services" class="nav-link" data-i18n="nav.services">Services</a></li>
            <li><a href="#destinations" class="nav-link" data-i18n="nav.destinations">Destinations</a></li>
            <li><a href="/contact.html" class="nav-link" data-i18n="nav.contact">Contact</a></li>
          </ul>
          
          <div class="navbar-actions">
            <div class="lang-toggle">
              <select id="lang-select" class="lang-select" aria-label="Language Selector">
                ${options}
              </select>
            </div>
            <a href="https://wa.me/918921426073" class="btn btn-accent btn-sm" data-i18n="buttons.whatsapp">WhatsApp Us</a>
          </div>
        </div>
      </div>
    </nav>
  `;
}
