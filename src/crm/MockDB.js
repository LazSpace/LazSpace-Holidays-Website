// Simple mock DB using localStorage for Admin Dashboard

const DB_KEY = 'lazspace_crm_leads';

export const MockDB = {
    init() {
        if (!localStorage.getItem(DB_KEY)) {
            localStorage.setItem(DB_KEY, JSON.stringify([]));
        }
    },

    getLeads() {
        this.init();
        return JSON.parse(localStorage.getItem(DB_KEY));
    },

    saveLead(lead) {
        this.init();
        const leads = this.getLeads();

        const newLead = {
            id: 'LZ-' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'New', // New, Followed Up, Closed
            ...lead
        };

        leads.push(newLead);
        localStorage.setItem(DB_KEY, JSON.stringify(leads));
        return newLead;
    },

    updateLeadStatus(id, newStatus) {
        const leads = this.getLeads();
        const lead = leads.find(l => l.id === id);
        if (lead) {
            lead.status = newStatus;
            localStorage.setItem(DB_KEY, JSON.stringify(leads));
            return true;
        }
        return false;
    }
};
