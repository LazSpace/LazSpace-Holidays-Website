export const LeadScorer = {
    calculateScore(leadData) {
        let score = 0;

        // Budget scoring (Assuming INR)
        if (leadData.budget) {
            const budgetVal = parseInt(leadData.budget.replace(/\\D/g, ''), 10);
            if (budgetVal >= 200000) score += 30;
            else if (budgetVal >= 100000) score += 20;
            else score += 10;
        }

        // Travel Type scoring
        if (leadData.type === 'Corporate' || leadData.type === 'Luxury') score += 40;
        else if (leadData.type === 'Adventure' || leadData.type === 'Family') score += 20;

        // Urgency scoring (Travel in next 30 days)
        if (leadData.dates) {
            // Simplified check: if date string implies upcoming month
            // In a real app, parse actual date difference
            score += 20;
        }

        // Interaction scoring
        if (leadData.hasRequestedQuote) score += 50;
        if (leadData.hasClickedWhatsApp) score += 10;

        return score;
    }
};
