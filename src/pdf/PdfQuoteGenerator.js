import { AnalyticsTracker } from '../utils/AnalyticsTracker.js';

export const PdfQuoteGenerator = {
    async generate(itineraryData, customerData) {
        // Dynamically load html2pdf.js via CDN if not present
        if (!window.html2pdf) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        // Build HTML template for the PDF
        const pdfContent = `
            <div style="font-family: 'Inter', sans-serif; color: #0B1C2D; padding: 40px;">
                <div style="border-bottom: 2px solid #C9A227; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <h1 style="margin: 0; font-family: 'Playfair Display', serif;">LazSpace Holidays</h1>
                    <span style="color: #666;">Official Quote</span>
                </div>

                <h2>Custom Itinerary: ${customerData.destination}</h2>
                <p><strong>Prepared for:</strong> ${customerData.name || 'Valued Guest'}</p>
                <p>${itineraryData.overview}</p>

                <div style="margin-top: 30px;">
                    <h3>Day-by-Day Plan</h3>
                    ${itineraryData.days.map(d => `
                        <div style="margin-bottom: 15px;">
                            <strong>Day ${d.day}: ${d.title}</strong>
                            <ul style="margin-top: 5px;">
                                ${d.activities.map(act => `<li>${act}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>

                <div style="display: flex; gap: 40px; margin-top: 30px;">
                    <div>
                        <h3>Inclusions</h3>
                        <ul>
                            ${itineraryData.inclusions.map(inc => `<li>${inc}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <h3>Exclusions</h3>
                        <ul>
                            ${itineraryData.exclusions.map(exc => `<li>${exc}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div style="margin-top: 40px; text-align: right; border-top: 1px solid #ccc; padding-top: 20px;">
                    <h2>Estimated Investment: ${itineraryData.estimated_price_range}</h2>
                    <p style="font-size: 0.8rem; color: #666;">Razorpay placeholder: To secure your booking, a payment link will be sent to your email.</p>
                </div>
            </div>
        `;

        // Configure PDF options
        const opt = {
            margin: 0,
            filename: `LazSpace_Quote_${customerData.destination.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Create a temporary container
        const container = document.createElement('div');
        container.innerHTML = pdfContent;

        // Generate and save
        html2pdf().set(opt).from(container).save().then(() => {
            AnalyticsTracker.pushToDataLayer('Quote PDF Downloaded', {
                destination: customerData.destination
            });
        });
    }
};
