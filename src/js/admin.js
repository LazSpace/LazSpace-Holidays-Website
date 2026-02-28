import { MockDB } from '../crm/MockDB.js';
import { AnalyticsTracker } from '../utils/AnalyticsTracker.js';

document.addEventListener('DOMContentLoaded', () => {

    // Auth logic (Mock)
    const overlay = document.getElementById('auth-overlay');
    const passInput = document.getElementById('admin-pass');
    const loginBtn = document.getElementById('login-btn');

    loginBtn.addEventListener('click', () => {
        if (passInput.value === 'admin') {
            overlay.style.display = 'none';
            renderLeads();
            renderAnalytics();
        } else {
            alert("Invalid credentials.");
        }
    });

    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });

    // Tab Navigation
    const links = document.querySelectorAll('.sidebar a');
    const panels = document.querySelectorAll('.dashboard-panel');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            panels.forEach(p => p.style.display = 'none');

            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).style.display = 'block';
        });
    });

    // Render Leads Table
    function renderLeads() {
        const tbody = document.querySelector('#leads-table tbody');
        const leads = MockDB.getLeads();

        if (leads.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No leads found in CRM.</td></tr>';
            return;
        }

        // Sort by score descending
        leads.sort((a, b) => (b.score || 0) - (a.score || 0));

        tbody.innerHTML = leads.map(lead => {
            let scoreBadgeInfo = lead.score >= 50 ? 'badge-hot' : 'badge-new';
            let statusBadgeInfo = lead.status === 'Closed' ? 'badge-closed' : 'badge-new';

            return `
                <tr>
                    <td><strong>${lead.name || 'Anonymous'}</strong><br><small>${lead.email || ''}</small></td>
                    <td>${lead.destination}</td>
                    <td>${lead.budget || 'N/A'}</td>
                    <td><span class="badge ${scoreBadgeInfo}">${lead.score || 0} pts</span></td>
                    <td>
                        <select onchange="window.updateLeadStatus('${lead.id}', this.value)">
                            <option ${lead.status === 'New' ? 'selected' : ''}>New</option>
                            <option ${lead.status === 'Followed Up' ? 'selected' : ''}>Followed Up</option>
                            <option ${lead.status === 'Closed' ? 'selected' : ''}>Closed</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">View Itinerary</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Global expose for inline onChange
    window.updateLeadStatus = (id, status) => {
        MockDB.updateLeadStatus(id, status);
    };

    // Simulated AI Content Generation
    document.getElementById('generate-content-btn').addEventListener('click', async () => {
        const type = document.getElementById('ai-content-type').value;
        const topic = document.getElementById('ai-content-topic').value;
        const outBox = document.getElementById('ai-content-output');

        if (!topic) {
            alert('Please enter a topic.');
            return;
        }

        outBox.value = 'Connecting to AI Marketing Engine...\nApplying brand voice parameters...';

        // Mock generation delay
        setTimeout(() => {
            let res = '';
            if (type.includes('Instagram')) {
                res = `Escape the ordinary! ✈️ Discover the ultimate ${topic} tailored just for you.\n\nBecause your precious time off deserves LazSpace perfection. 🥂\n\n✨ Book your bespoke journey today via link in bio!\n\n#LazSpaceHolidays #TravelInStyle #${topic.replace(/\s+/g, '')}`;
            } else {
                res = `[Draft: ${type} - ${topic}]\nAt LazSpace Holidays, we understand that travel is more than a destination; it's an experience profoundly curated precisely for your taste. Our exploration into ${topic} offers unmatched comfort, premium logistics, and an itinerary designed to exceed expectations. Let our AI algorithms pair perfectly with our human expertise to craft your next unforgettable memory.`;
            }
            outBox.value = res;
        }, 2000);
    });

    // Analytics Render
    function renderAnalytics() {
        const dataBox = document.getElementById('analytics-data');
        const data = AnalyticsTracker.getData();
        dataBox.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

});
