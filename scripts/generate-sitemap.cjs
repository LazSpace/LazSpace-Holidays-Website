const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://lazspaceholidays.com';

const routes = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/itinerary.html', changefreq: 'monthly', priority: 0.8 },
    { url: '/ai-planner.html', changefreq: 'monthly', priority: 0.9 },
    { url: '/contact.html', changefreq: 'yearly', priority: 0.7 }
];

// Placeholder routes for destinations
const destinations = [
    'kerala-tour-packages',
    'golden-triangle-india',
    'africa-safari-tours',
    'southeast-asia-trips'
];

destinations.forEach(dest => {
    routes.push({
        url: `/destinations/${dest}`,
        changefreq: 'monthly',
        priority: 0.8
    });
});

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

routes.forEach(route => {
    xml += `
  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
});

xml += `
</urlset>`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml);

console.log(`Generated sitemap with ${routes.length} URLs at ${outPath}`);
