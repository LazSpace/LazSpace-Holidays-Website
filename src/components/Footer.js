export function Footer() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col brand-col">
            <h4 class="footer-logo">LazSpace Holidays LLP</h4>
            <p data-i18n="footer.p1">Curated Journeys. Meaningful Experiences. Premium travel planning from Kerala to the world.</p>
            <div class="footer-badges">
              <span class="badge badge-trust" data-i18n="footer.b1">LLP Registered</span>
              <span class="badge badge-trust" data-i18n="footer.b2">MSME Certified</span>
              <span class="badge badge-trust">🔒 100% Secure Payments</span>
            </div>
            <div style="margin-top: 15px;">
              <!-- Google Reviews Placeholder -->
              <div style="background: white; color: black; padding: 10px; border-radius: 5px; display: inline-flex; align-items: center; gap: 10px;">
                <img src="https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" width="20">
                <div>
                    <div style="color: #fbbc04; font-size: 14px; letter-spacing: 2px;">★★★★★</div>
                    <div style="font-size: 11px; font-weight: bold; color: #555;">5.0 Rating (42 Reviews)</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer-col links-col">
            <h4 data-i18n="footer.quick">Quick Links</h4>
            <ul class="footer-links">
              <li><a href="/" data-i18n="nav.home">Home</a></li>
              <li><a href="#about" data-i18n="nav.about">About Us</a></li>
              <li><a href="#services" data-i18n="nav.services">Services</a></li>
              <li><a href="/itinerary.html" data-i18n="nav.itinerary">Sample Itinerary</a></li>
              <li><a href="/contact.html" data-i18n="nav.contact">Contact Us</a></li>
            </ul>
          </div>
          
          <div class="footer-col contact-col">
            <h4 data-i18n="footer.contact">Contact Details</h4>
            <ul class="footer-links">
              <li><i class="icon-map"></i> <span data-i18n="footer.address">Thazhe Veettuvilakam, Puthiyathura, Neyyattinkara, Thiruvananthapuram – 695526, Kerala, India</span></li>
              <li><i class="icon-phone"></i> <a href="https://wa.me/918921426073">+91 89214 26073</a></li>
              <li><i class="icon-mail"></i> <a href="mailto:find@lazspace.life">find@lazspace.life</a></li>
              <li><i class="icon-instagram"></i> <a href="https://instagram.com/lazspace.holidays" target="_blank">@lazspace.holidays</a></li>
            </ul>
          </div>
          
          <div class="footer-col legal-col">
            <h4 data-i18n="footer.official">Official Information</h4>
            <ul class="footer-links">
              <li><small>LLPIN: ACQ-0572</small></li>
              <li><small>PAN: AAMFL5041L</small></li>
              <li><small>TAN: TVDL02475E</small></li>
              <li><small>MSME: UDYAM-KL-12-0105360</small></li>
              <li><small>NIC Code: 79120 – Tour Operator Activities</small></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} <span data-i18n="footer.bottom">LazSpace Holidays LLP. All Rights Reserved.</span></p>
        </div>
      </div>
    </footer>
  `;
}
