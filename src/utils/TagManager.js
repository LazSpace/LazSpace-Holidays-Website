/**
 * Google Tag Manager Modular Architecture
 */
export const TagManager = {
    init(gtmId) {
        if (!gtmId) {
            console.warn('[TagManager] GTM ID is missing. Tracking disabled.');
            return;
        }

        // Initialize script block
        (function (w, d, s, l, i) {
            w[l] = w[l] || []; w[l].push({
                'gtm.start':
                    new Date().getTime(), event: 'gtm.js'
            }); var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', gtmId);

        // Initialize noscript block for fallback
        const noscript = document.createElement('noscript');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
        iframe.height = 0;
        iframe.width = 0;
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        document.body.prepend(noscript);

        console.log(`[TagManager] Loaded GTM Container: ${gtmId}`);
    }
};
