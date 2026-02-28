/**
 * Budget Calculation Utility for Travel Intelligence Hub
 */
export const BudgetCalculator = {
    /**
     * Estimate total trip cost
     * @param {Object} data - { days, pax, tier, destination, matrix }
     * @returns {Object} { total, breakDown }
     */
    estimate: (data) => {
        const { days, pax, tier, destination, matrix } = data;
        const rates = matrix.base_rates;
        const multiplier = matrix.destination_multipliers[destination.toLowerCase()] || 1.0;

        const dailyAcc = rates.accommodation[tier] * Math.ceil(pax / 2); // Assuming double occupancy
        const dailyFood = rates.food[tier] * pax;
        const dailyTrans = rates.transport[tier] * multiplier;

        const subtotal = (dailyAcc + dailyFood + dailyTrans) * days;
        const visaFee = (matrix.misc_fees.visa_service + (multiplier > 1.1 ? 5000 : 0)) * pax; // Mock logic for intl visa
        const insurance = matrix.misc_fees.insurance_base * pax;

        const total = subtotal + visaFee + insurance;

        return {
            total: Math.round(total),
            breakDown: {
                accommodation: Math.round(dailyAcc * days),
                food: Math.round(dailyFood * days),
                transport: Math.round(dailyTrans * days),
                visa_insurance: Math.round(visaFee + insurance)
            },
            currency: "INR"
        };
    }
};
