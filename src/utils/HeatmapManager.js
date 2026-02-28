/**
 * Heatmap & Session Recording Manager
 * Initializes Microsoft Clarity and/or Hotjar placeholders.
 */
export const HeatmapManager = {
    initClarity(projectId) {
        if (!projectId) return;
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
            t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", projectId);
        console.log(`[HeatmapManager] Loaded Microsoft Clarity: ${projectId}`);
    },

    initHotjar(hjid, hjsv) {
        if (!hjid || !hjsv) return;
        (function (h, o, t, j, a, r) {
            h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
            h._hjSettings = { hjid: hjid, hjsv: hjsv };
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script'); r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
        console.log(`[HeatmapManager] Loaded Hotjar: ${hjid}`);
    },

    init() {
        // Placeholders: Read IDs from environment variables or provide config
        // this.initClarity('YOUR_CLARITY_ID_HERE');
        // this.initHotjar('YOUR_HOTJAR_ID_HERE', 6);
    }
};
