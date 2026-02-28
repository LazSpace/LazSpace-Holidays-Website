/**
 * Client-Side Behavioral Analytics & GA4 Event Tracker
 * Ensures standard datalayer exists and pushes events.
 */
const TRACK_KEY = 'lazspace_analytics';

export const AnalyticsTracker = {
    init() {
        if (!localStorage.getItem(TRACK_KEY)) {
            localStorage.setItem(TRACK_KEY, JSON.stringify({
                pageViews: {},
                clicks: { whatsapp: 0, itineryGen: 0 },
                interests: {}
            }));
        }

        // Ensure dataLayer exists
        window.dataLayer = window.dataLayer || [];

        this.trackPageView();
        this.initScrollTracking();
        this.initTimeOnPageTracking();
    },

    getData() {
        const data = JSON.parse(localStorage.getItem(TRACK_KEY)) || {};
        if (!data.pageViews) data.pageViews = {};
        if (!data.clicks) data.clicks = {};
        if (!data.interests) data.interests = {};
        return data;
    },

    saveData(data) {
        localStorage.setItem(TRACK_KEY, JSON.stringify(data));
    },

    trackPageView() {
        const path = window.location.pathname;
        const data = this.getData();
        data.pageViews[path] = (data.pageViews[path] || 0) + 1;
        this.saveData(data);

        // Push GA4 event
        let eventName = 'page_view';
        if (path.includes('/destinations/')) {
            eventName = 'Destination Page Viewed';
        }

        this.pushToDataLayer(eventName, { page_path: path });
    },

    trackEvent(category, action, label = null) {
        const data = this.getData();
        if (category === 'click') {
            data.clicks[action] = (data.clicks[action] || 0) + 1;
        } else if (category === 'interest') {
            data.interests[action] = (data.interests[action] || 0) + 5;
        }
        this.saveData(data);
    },

    /**
     * GA4 Event Dispatcher
     * Example: pushToDataLayer('Itinerary Generated', { destination: 'Kerala', travel_type: 'Family' })
     */
    pushToDataLayer(eventName, customParams = {}) {
        window.dataLayer = window.dataLayer || [];

        const baseParams = {
            event: eventName,
            language: document.documentElement.lang || 'en',
            timestamp: new Date().toISOString()
        };

        window.dataLayer.push({ ...baseParams, ...customParams });
        console.log(`[Analytics] Pushed: ${eventName}`, customParams);
    },

    initScrollTracking() {
        let maxScroll = 0;
        let tracked25 = false, tracked50 = false, tracked75 = false, tracked90 = false;

        window.addEventListener('scroll', () => {
            const h = document.documentElement;
            const b = document.body;
            const scrollPercent = (h.scrollTop || b.scrollTop) / ((h.scrollHeight || b.scrollHeight) - h.clientHeight) * 100;

            if (scrollPercent > maxScroll) maxScroll = scrollPercent;

            if (maxScroll > 25 && !tracked25) { tracked25 = true; this.pushToDataLayer('Scroll Depth', { depth: '25%' }); }
            if (maxScroll > 50 && !tracked50) { tracked50 = true; this.pushToDataLayer('Scroll Depth', { depth: '50%' }); }
            if (maxScroll > 75 && !tracked75) { tracked75 = true; this.pushToDataLayer('Scroll Depth', { depth: '75%' }); }
            if (maxScroll > 90 && !tracked90) { tracked90 = true; this.pushToDataLayer('Scroll Depth', { depth: '90%' }); }
        });
    },

    initTimeOnPageTracking() {
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
            this.pushToDataLayer('Time on Page', { duration_seconds: timeSpentSeconds });
        });
    }
};
