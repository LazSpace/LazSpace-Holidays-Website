import { t } from '../js/i18n.js';
import { GeminiClient } from './gemini-client.js';

export const LazBot = {
    init() {
        this.renderUI();
        this.bindEvents();
    },

    renderUI() {
        const botHTML = `
            <div id="lazbot-container" class="lazbot-container">
                <button id="lazbot-toggle" class="lazbot-toggle" aria-label="Open LazBot AI Assistant">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
                <div id="lazbot-window" class="lazbot-window">
                    <div class="lazbot-header">
                        <div class="lazbot-title">LazBot <span>AI Travel Assistant</span></div>
                        <button id="lazbot-close" class="lazbot-close">&times;</button>
                    </div>
                    <div id="lazbot-messages" class="lazbot-messages">
                        <div class="message bot-msg">
                            Hello! I am LazBot. I can help you plan your next trip, check visa requirements, or recommend destinations. How can I assist you today?
                        </div>
                    </div>
                    <div class="lazbot-input-area">
                        <input type="text" id="lazbot-input" placeholder="Type your message..." />
                        <button id="lazbot-send">Send</button>
                    </div>
                </div>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = botHTML;
        document.body.appendChild(wrapper.firstElementChild);
    },

    bindEvents() {
        const toggleBtn = document.getElementById('lazbot-toggle');
        const closeBtn = document.getElementById('lazbot-close');
        const windowEl = document.getElementById('lazbot-window');
        const sendBtn = document.getElementById('lazbot-send');
        const inputEl = document.getElementById('lazbot-input');

        toggleBtn.addEventListener('click', () => {
            windowEl.classList.toggle('active');
            if (windowEl.classList.contains('active')) {
                inputEl.focus();
            }
        });

        closeBtn.addEventListener('click', () => {
            windowEl.classList.remove('active');
        });

        sendBtn.addEventListener('click', () => this.handleSend());
        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });
    },

    async handleSend() {
        const inputEl = document.getElementById('lazbot-input');
        const text = inputEl.value.trim();
        if (!text) return;

        this.appendMessage('user', text);
        inputEl.value = '';

        // Typing indicator
        const typingId = this.appendTypingIndicator();

        try {
            const lang = document.documentElement.lang || 'en';
            console.log('[LazBot] Invoking direct Gemini connection...');
            const reply = await GeminiClient.generateChatResponse(text, lang);

            document.getElementById(typingId)?.remove();
            this.appendMessage('bot', reply || "I'm sorry, I'm having trouble thinking right now.");

        } catch (err) {
            console.error(err);
            document.getElementById(typingId)?.remove();
            this.appendMessage('bot', "Connection error. Please try again.");
        }
    },

    appendMessage(sender, text) {
        const messagesEl = document.getElementById('lazbot-messages');
        const div = document.createElement('div');
        div.className = `message ${sender}-msg`;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    },

    appendTypingIndicator() {
        const messagesEl = document.getElementById('lazbot-messages');
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'message bot-msg typing-indicator';
        div.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return id;
    }
};
