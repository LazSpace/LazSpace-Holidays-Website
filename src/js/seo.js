/**
 * SEO Architecture Manager for LazSpace Holidays
 * Handles dynamic Meta tag generation, Open Graph, Twitter Cards, and Schema.org JSON-LD
 */

const COMPANY_INFO = {
    name: "LazSpace Holidays LLP",
    url: "https://lazspaceholidays.com", // Replace with actual production URL
    logo: "https://lazspaceholidays.com/assets/logo.png", // Replace
    telephone: "+91-8921426073",
    email: "contact@lazspaceholidays.com",
    address: {
        "@type": "PostalAddress",
        "streetAddress": "TC 15/121",
        "addressLocality": "Trivandrum",
        "addressRegion": "Kerala",
        "postalCode": "695001",
        "addressCountry": "IN"
    },
    socials: [
        "https://instagram.com/lazspace",
        "https://facebook.com/lazspace"
    ]
};

export const SEOManager = {
    injectMeta(config) {
        document.title = config.title.slice(0, 60);

        this.setOrCreateMeta('description', config.description.slice(0, 155));
        this.setOrCreateMeta('robots', config.noindex ? 'noindex, nofollow' : 'index, follow');

        // Open Graph
        this.setOrCreateMeta('og:title', config.title, true);
        this.setOrCreateMeta('og:description', config.description, true);
        this.setOrCreateMeta('og:type', config.type || 'website', true);
        this.setOrCreateMeta('og:url', window.location.href, true);
        this.setOrCreateMeta('og:image', config.image || COMPANY_INFO.logo, true);

        // Twitter Cards
        this.setOrCreateMeta('twitter:card', 'summary_large_image');
        this.setOrCreateMeta('twitter:title', config.title);
        this.setOrCreateMeta('twitter:description', config.description);
        this.setOrCreateMeta('twitter:image', config.image || COMPANY_INFO.logo);

        this.setCanonical(config.canonical || window.location.href.split('?')[0]);

        // Always inject base organization schema
        this.injectOrganizationSchema();

        if (config.schema) {
            this.injectCustomSchema(config.schema);
        }
    },

    setOrCreateMeta(name, content, isProperty = false) {
        let meta = isProperty
            ? document.querySelector(`meta[property="${name}"]`)
            : document.querySelector(`meta[name="${name}"]`);

        if (!meta) {
            meta = document.createElement('meta');
            if (isProperty) meta.setAttribute('property', name);
            else meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    },

    setCanonical(url) {
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', url);
    },

    injectSchemaScript(schemaObj, id) {
        let script = document.getElementById(id);
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = id;
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schemaObj);
    },

    injectOrganizationSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": COMPANY_INFO.name,
            "url": COMPANY_INFO.url,
            "logo": COMPANY_INFO.logo,
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": COMPANY_INFO.telephone,
                "contactType": "customer service",
                "email": COMPANY_INFO.email
            },
            "address": COMPANY_INFO.address,
            "sameAs": COMPANY_INFO.socials
        };
        this.injectSchemaScript(schema, 'schema-org');
    },

    injectTourOperatorSchema(destination, priceRange) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "TravelAgency", // TravelAgency matches TourOperator closely
            "name": COMPANY_INFO.name,
            "areaServed": destination || "Global",
            "priceRange": priceRange || "$$$",
            "telephone": COMPANY_INFO.telephone,
            "address": COMPANY_INFO.address
        };
        this.injectSchemaScript(schema, 'schema-tour-operator');
    },

    injectFAQSchema(faqs) {
        if (!faqs || faqs.length === 0) return;
        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        };
        this.injectSchemaScript(schema, 'schema-faq');
    },

    injectBreadcrumbSchema(crumbs) {
        if (!crumbs || crumbs.length === 0) return;
        const schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": crumbs.map((crumb, idx) => ({
                "@type": "ListItem",
                "position": idx + 1,
                "name": crumb.name,
                "item": crumb.item
            }))
        };
        this.injectSchemaScript(schema, 'schema-breadcrumb');
    },

    injectCustomSchema(schemaObj) {
        this.injectSchemaScript(schemaObj, 'schema-custom');
    }
};
