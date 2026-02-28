import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        cssCodeSplit: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                itinerary: resolve(__dirname, 'itinerary.html'),
                contact: resolve(__dirname, 'contact.html'),
                aiPlanner: resolve(__dirname, 'ai-planner.html'),
                admin: resolve(__dirname, 'admin/index.html'),
                localSeo: resolve(__dirname, 'src/pages/local-seo.html'),
                blog: resolve(__dirname, 'src/pages/blog.html'),
                travelInfo: resolve(__dirname, 'travel-info.html'),
                budgetCalculator: resolve(__dirname, 'budget-calculator.html')
            },
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor'; // Split all node_modules into a vendor chunk
                    }
                    if (id.includes('src/components/')) {
                        return 'components'; // Split reusable UI components
                    }
                    if (id.includes('src/ai/') || id.includes('src/pdf/')) {
                        return 'ai-engine'; // Split heavy AI logic
                    }
                }
            }
        }
    },
    server: {
        watch: {
            usePolling: true
        }
    }
});
