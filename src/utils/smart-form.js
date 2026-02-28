import { AnalyticsTracker } from './AnalyticsTracker.js';

export const SmartForm = {
    init() {
        // Initialize multi-step form logic if the container exists
        const multiStepForm = document.getElementById('smart-multi-step-form');
        if (multiStepForm) {
            this.initMultiStep(multiStepForm);
        }

        // Initialize Exit Intent Popup
        this.initExitIntent();
    },

    initMultiStep(form) {
        let currentStep = 1;
        const totalSteps = 2;

        const step1 = document.getElementById('form-step-1');
        const step2 = document.getElementById('form-step-2');
        const nextBtn = document.getElementById('btn-next-step');

        if (!step1 || !step2 || !nextBtn) return;

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Basic validation for Step 1
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const honeypot = document.getElementById('form-honeypot');

            // If the honeypot is filled, it's a bot. Silently drop.
            if (honeypot && honeypot.value !== '') {
                console.warn('Spam detected via honeypot.');
                form.innerHTML = `<div style="text-align:center; padding: 2rem;">
                    <h3 style="color:var(--color-primary)">Checking secure connection...</h3>
                </div>`;
                return;
            }

            if (nameInput.checkValidity() && emailInput.checkValidity()) {
                // Move to Step 2
                step1.style.display = 'none';
                step2.style.display = 'block';
                currentStep = 2;
                AnalyticsTracker.pushToDataLayer('Form Step Completed', { step: 1, form_name: 'Main Enquiry' });
            } else {
                nameInput.reportValidity();
                emailInput.reportValidity();
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            AnalyticsTracker.pushToDataLayer('Form Step Completed', { step: 2, form_name: 'Main Enquiry' });
            AnalyticsTracker.pushToDataLayer('Enquiry Submitted', { form_id: 'smart-multi-step-form', lead_type: 'High Intent' });

            form.innerHTML = `<div style="text-align:center; padding: 2rem;">
                <h3 style="color:var(--color-primary)">Thank You!</h3>
                <p>An expert will be in touch shortly to plan your perfect trip.</p>
            </div>`;
        });

        // Track abandonment
        let abandoned = false;
        window.addEventListener('beforeunload', () => {
            if (currentStep < totalSteps && !abandoned) {
                abandoned = true;
                AnalyticsTracker.pushToDataLayer('Form Abandoned', { step: currentStep, form_name: 'Main Enquiry' });
            }
        });
    },

    initExitIntent() {
        const modal = document.getElementById('exit-intent-modal');
        if (!modal) return;

        let hasFired = sessionStorage.getItem('exitIntentFired');

        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 0 && !hasFired) {
                modal.style.display = 'flex';
                sessionStorage.setItem('exitIntentFired', 'true');
                hasFired = true;
                AnalyticsTracker.pushToDataLayer('Exit Intent Triggered', { page: window.location.pathname });
            }
        });

        const closeBtn = document.getElementById('close-exit-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    }
};
