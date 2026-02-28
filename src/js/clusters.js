/**
 * Search Domination Strategy: Keyword Clusters Architecture
 * Provides a dynamic linking structure to be injected into Programmatic SEO pages and Blogs.
 */

export const SEOClusters = {
    Kerala: {
        title: "Kerala Backwaters & Nature",
        description: "Explore the best of God's Own Country.",
        keywords: [
            "Kerala tour packages",
            "Kerala honeymoon packages",
            "Kerala luxury tours",
            "Kerala houseboat packages",
            "Kerala itinerary 5 days",
            "Trivandrum travel agency"
        ],
        links: [
            { anchor: "Kerala Tour Packages", url: "/destinations/kerala-tour-packages" },
            { anchor: "Kerala Honeymoon Packages", url: "/destinations/kerala-honeymoon-packages" },
            { anchor: "Luxury Kerala Tours", url: "/destinations/kerala-luxury-tours" },
            { anchor: "Houseboat Packages", url: "/destinations/kerala-houseboat-packages" }
        ]
    },
    Corporate: {
        title: "Corporate & Team Outings",
        description: "Re-energize your team with professional, seamless corporate retreats.",
        keywords: [
            "Corporate tour planners Kerala",
            "Team outing Kerala",
            "Corporate travel packages South India",
            "MICE tourism Kerala"
        ],
        links: [
            { anchor: "Corporate Tour Planners in Kerala", url: "/services/corporate-tour-planners-kerala" },
            { anchor: "Team Outing Packages in Kerala", url: "/services/team-outing-kerala" },
            { anchor: "South India Corporate Travel", url: "/services/corporate-travel-packages-south-india" }
        ]
    },
    International: {
        title: "International & Outbound",
        description: "Breathtaking global destinations crafted perfectly for you.",
        keywords: [
            "Golden Triangle tour from Kerala",
            "Africa safari from India",
            "Singapore Malaysia package",
            "Dubai tour packages"
        ],
        links: [
            { anchor: "Golden Triangle from Kerala", url: "/destinations/golden-triangle-india" },
            { anchor: "Africa Safari from India", url: "/destinations/africa-safari-tours" },
            { anchor: "Singapore & Malaysia Deals", url: "/destinations/southeast-asia-trips" }
        ]
    }
};

/**
 * Generates an HTML block containing internal links for a specific cluster.
 * @param {string} clusterName - 'Kerala', 'Corporate', or 'International'
 * @returns {string} HTML markup
 */
export function generateInterlinksHTML(clusterName) {
    const cluster = SEOClusters[clusterName];
    if (!cluster) return '';

    let html = `<div class="seo-interlinks" style="margin-top: 2rem; padding: 1.5rem; background: var(--color-bg-light); border-radius: 8px;">`;
    html += `<h3 style="color: var(--color-primary); margin-bottom: 1rem; font-family: var(--font-heading);">Explore more: ${cluster.title}</h3>`;
    html += `<p style="font-size: 0.9rem; color: #555; margin-bottom: 1rem;">${cluster.description}</p>`;
    html += `<ul style="list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px;">`;

    cluster.links.forEach(link => {
        html += `<li><a href="${link.url}" style="color: var(--color-accent); text-decoration: none; font-weight: 500;">${link.anchor}</a></li>`;
    });

    html += `</ul></div>`;
    return html;
}

/**
 * Returns a random cross-cluster link block to prevent orphaned clusters.
 */
export function generateCrossClusterLinksHTML(excludeClusterName) {
    const clusters = Object.keys(SEOClusters).filter(k => k !== excludeClusterName);
    if (clusters.length === 0) return '';

    // Pick a random remaining cluster
    const randomClusterName = clusters[Math.floor(Math.random() * clusters.length)];
    return generateInterlinksHTML(randomClusterName);
}
