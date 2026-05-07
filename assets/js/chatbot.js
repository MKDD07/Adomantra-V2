/**
 * Adomantra AI Chatbot
 * Powered by Groq API — strictly scoped to adomantra.com content
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     CONFIG
  ───────────────────────────────────────── */
  const GROQ_API_URL = '/api/groq';
  const MODEL = 'openai/gpt-oss-120b';
  const SYSTEM_PROMPT = `You are the official AI assistant for Adomantra (adomantra.com) — an award-winning digital advertising agency based in New Delhi, India.

Your role: Answer and request for what may i help your and from your side question asked by client should be small and natural tone and not always talk about adomantra's only questions related to Adomantra's services, team, achievements, contact info, and digital marketing topics they specialise in and dont use "**".

Key facts about Adomantra:
- Full name: Adomantra Digital India Pvt Ltd
- Website: https://www.adomantra.com/
- Address: 3rd Floor, Tower-1, Plot No. 48, Rama Rd, Industrial Area, Najafgarh Road Industrial Area, New Delhi – 110015
- Email: connect@adomantra.com | info@adomantra.com
- Phone: +91-9650706427
- Social: Facebook, Instagram, LinkedIn, Twitter (@adomantra1)
- Rating: 4.4 stars from 52 reviews
- Founded: 13+ years ago (ISO-certified)
- Working hours: Mon–Fri, 09:30 AM – 6:30 PM IST

Core services:
1. Programmatic Advertising & CTV Advertising
2. Performance Marketing (PPC, Google Ads, Meta Ads)
3. SEO Services (organic search growth)
4. Social Media Marketing & Optimization (SMO)
5. Display & Rich Media Advertising
6. DV360 & Amazon DSP Campaigns
7. UI/UX Design & Web Development
8. Branding & Creative Design
9. Digital Strategy & Consulting

Key stats:
- 500+ Happy Clients
- 20+ Industry Verticals
- 400+ Active Campaigns
- 100B+ Monthly Impressions
- 800M+ Monthly Clicks
- 1B+ Monthly Video Views

Team:
- Mohit — Graphics Designer & Video Editor
- Deepak — SEO Expert & Digital Marketing Expert
- Annie — Content Writer
- Harshita — Creative Content & Social Media
- Shubham — Programmatic Manager
- Naman — Media Buyer
- Nupur — SEO Expert & Digital Marketing Expert
- Simran — Media Buyer

FAQ:
Q1: What does Adomantra specialize in?
A: Adomantra specializes in performance marketing, programmatic advertising, SEO, social media marketing, and creative digital campaigns.

Q2: How can I contact Adomantra?
A: Email connect@adomantra.com or info@adomantra.com, or call +91-9650706427. Office hours: Mon–Fri, 09:30 AM – 6:30 PM IST.

Q3: Where is Adomantra located?
A: 3rd Floor, Tower-1, Plot No. 48, Rama Rd, Industrial Area, Najafgarh Road, New Delhi – 110015.

Q4: Does Adomantra handle large-scale campaigns?
A: Yes — 400+ active campaigns across Google, Meta, DV360, and Amazon DSP with 100B+ monthly impressions.

Q5: What makes Adomantra different?
A: Data-driven strategy + advanced ad-tech + creative execution = measurable business growth for 500+ clients.

Q6: Can Adomantra help with SEO and web development?
A: Yes, they offer full SEO services, UI/UX design, and web development to improve both rankings and user experience.

Rules:
- Keep answers SHORT (2–4 sentences max).
- Only answer Adomantra or digital-marketing related queries.
- Be friendly, professional, and brand-aligned.
- For contact/sales queries direct users to connect@adomantra.com or the Contact page.`;
  /* ─────────────────────────────────────────
     1. INJECT CSS
  ───────────────────────────────────────── */
  const style = document.createElement('style');
  style.id = 'adomantra-chatbot-css';
  document.head.appendChild(style);

  /* ─────────────────────────────────────────
     2. DYNAMIC GREETING based on IST time
  ───────────────────────────────────────── */
  function getGreeting() {
    // Use IST (UTC+5:30) for correct greeting regardless of user timezone
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
    const hour = istTime.getHours();

    if (hour >= 5 && hour < 12) return { text: 'Good morning', emoji: '☀️' };
    if (hour >= 12 && hour < 17) return { text: 'Good afternoon', emoji: '🌤️' };
    if (hour >= 17 && hour < 21) return { text: 'Good evening', emoji: '🌇' };
    return { text: 'Hello', emoji: '🌙' };
  }

  const { text: greetingText, emoji: greetingEmoji } = getGreeting();

  /* ─────────────────────────────────────────
     3. INJECT HTML
  ───────────────────────────────────────── */
  const root = document.createElement('div');
  root.id = 'ado-chatbot-root';
  root.innerHTML = `
    <!-- FAB -->
    <button id="ado-chat-fab" aria-label="Open Adomantra AI Assistant">
      <i class="fa-solid fa-comment-dots ado-icon-chat"></i>
      <i class="fa-solid fa-xmark ado-icon-close"></i>
    </button>

    <!-- Chat Window -->
    <div id="ado-chat-window" role="dialog" aria-label="Adomantra AI Assistant">

      <!-- Header -->
      <div class="ado-chat-header">
        <div class="ado-chat-header-avatar">
          <i class="fa-solid fa-robot"></i>
        </div>
        <div class="ado-chat-header-info">
          <h4>Adomantra Assistant</h4>
          <span><span class="ado-online-dot"></span> Active Now</span>
        </div>
      </div>

      <!-- Scrollable body -->
      <div class="ado-chat-messages" id="ado-chat-messages">

        <!-- Welcome / Home view -->
        <div class="ado-welcome-area" id="ado-welcome-area">
          <h3>Hi, ${greetingText}! ${greetingEmoji}</h3>
          <p>What may I help you with today?</p>

          <div class="ado-features-grid">
            <button class="ado-feature-item" data-q="What services does Adomantra offer?">
              <i class="fa-solid fa-briefcase"></i>
              <span>Services</span>
            </button>
            <button class="ado-feature-item" data-q="What is CTV advertising?">
              <i class="fa-solid fa-tv"></i>
              <span>CTV Ads</span>
            </button>
            <button class="ado-feature-item" data-q="Tell me about Adomantra achievements and stats.">
              <i class="fa-solid fa-trophy"></i>
              <span>Success</span>
            </button>
            <button class="ado-feature-item" data-q="How can I contact Adomantra?">
              <i class="fa-solid fa-headset"></i>
              <span>Support</span>
            </button>
          </div>

          <div class="ado-section-title">Common Questions</div>
          <button class="ado-question-prompt" data-q="What services does Adomantra offer?">What services do you offer?</button>
          <button class="ado-question-prompt" data-q="How can I start a digital marketing campaign with Adomantra?">How do I start a campaign?</button>
          <button class="ado-question-prompt" data-q="What technology and platforms does Adomantra use?">Tell me about your technology.</button>
        </div>

        <!-- Conversation messages injected here -->
        <div class="ado-conversation" id="ado-conversation"></div>

      </div>

      <!-- Input -->
      <div class="ado-chat-input-area">
        <textarea id="ado-chat-input" placeholder="Ask anything about Adomantra…" rows="1"></textarea>
        <button id="ado-chat-send" aria-label="Send">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>

      <div class="ado-chat-footer">
        Powered by <a href="https://www.adomantra.com/" target="_blank" rel="noopener">Adomantra</a> &amp; Groq AI
      </div>
    </div>
  `;
  document.body.appendChild(root);

  /* ─────────────────────────────────────────
     4. REFERENCES
  ───────────────────────────────────────── */
  const fab = document.getElementById('ado-chat-fab');
  const chatWindow = document.getElementById('ado-chat-window');
  const msgArea = document.getElementById('ado-chat-messages');
  const conversation = document.getElementById('ado-conversation');
  const welcomeArea = document.getElementById('ado-welcome-area');
  const inputEl = document.getElementById('ado-chat-input');
  const sendBtn = document.getElementById('ado-chat-send');

  const history = [];
  let isOpen = false;
  let isLoading = false;

  /* ─────────────────────────────────────────
     5. TOGGLE
  ───────────────────────────────────────── */
  fab.addEventListener('click', () => {
    isOpen = !isOpen;
    fab.classList.toggle('open', isOpen);
    chatWindow.classList.toggle('visible', isOpen);
    if (isOpen) inputEl.focus();
  });

  /* ─────────────────────────────────────────
     6. QUICK-QUESTION HANDLERS (event delegation)
  ───────────────────────────────────────── */
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-q]');
    if (btn && btn.dataset.q) {
      sendMessage(btn.dataset.q);
    }
  });

  /* ─────────────────────────────────────────
     7. RENDER HELPERS
  ───────────────────────────────────────── */
  function addMessage(role, text) {
    // Hide welcome on first real message
    if (welcomeArea && conversation.children.length === 0) {
      welcomeArea.style.display = 'none';
    }

    const msg = document.createElement('div');
    msg.className = `ado-msg ${role}`;

    const avatar = role === 'bot'
      ? `<div class="ado-bot-mini"><i class="fa-solid fa-robot"></i></div>`
      : '';

    msg.innerHTML = `
      ${avatar}
      <div class="ado-bubble">${escapeHtml(text)}</div>
    `;
    conversation.appendChild(msg);
    scrollToBottom();
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'ado-msg bot';
    row.id = 'ado-typing-indicator';
    row.innerHTML = `
      <div class="ado-bot-mini"><i class="fa-solid fa-robot"></i></div>
      <div class="ado-typing-dots"><span></span><span></span><span></span></div>
    `;
    conversation.appendChild(row);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById('ado-typing-indicator');
    if (el) el.remove();
  }

  function scrollToBottom() {
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  /* ─────────────────────────────────────────
     8. CONTACT FORM — shown inside chat
  ───────────────────────────────────────── */
  let contactFormShown = false; // prevent duplicate forms

  function showContactForm() {
    if (contactFormShown) return;
    contactFormShown = true;

    const formId = 'ado-chat-contact-form-' + Date.now();
    const msg = document.createElement('div');
    msg.className = 'ado-msg bot';
    msg.id = 'ado-contact-form-msg';
    msg.innerHTML = `
      <div class="ado-bot-mini"><i class="fa-solid fa-robot"></i></div>
      <div class="ado-bubble ado-form-bubble">
        <div class="ado-form-title">
          <i class="fa-solid fa-address-card"></i>
          Share your details &amp; we'll reach out!
        </div>
        <form id="${formId}" autocomplete="off">
          <div class="ado-form-field">
            <i class="fa-solid fa-user ado-field-icon"></i>
            <input type="text" name="name" placeholder="Your Name" required />
          </div>
          <div class="ado-form-field">
            <i class="fa-solid fa-envelope ado-field-icon"></i>
            <input type="email" name="email" placeholder="Your Email" required />
          </div>
          <div class="ado-form-field">
            <i class="fa-solid fa-phone ado-field-icon"></i>
            <input type="tel" name="phone" placeholder="Your Phone (with country code)" required />
          </div>
          <div class="ado-form-field">
            <i class="fa-solid fa-comment ado-field-icon"></i>
            <input type="text" name="message" placeholder="What can we help you with?" />
          </div>
          <button type="submit" class="ado-form-submit">
            <i class="fa-solid fa-paper-plane"></i> Send Message
          </button>
        </form>
      </div>
    `;
    conversation.appendChild(msg);
    scrollToBottom();

    document.getElementById(formId).addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const name = data.get('name') || '';
      const email = data.get('email') || '';
      const phone = data.get('phone') || '';
      const message = data.get('message') || '';

      // Replace form with confirmation
      msg.innerHTML = `
        <div class="ado-bot-mini"><i class="fa-solid fa-robot"></i></div>
        <div class="ado-bubble ado-form-bubble ado-form-success">
          <i class="fa-solid fa-circle-check ado-success-icon"></i>
          <strong>Thank you, ${escapeHtml(name)}!</strong><br>
          Our team will contact you shortly at <em>${escapeHtml(email)}</em>.
        </div>
      `;

      // If phone number provided, offer WhatsApp/SMS options
      const cleanPhone = phone.replace(/[\s\-()]/g, '');
      if (cleanPhone.length >= 10) {
        setTimeout(() => {
          showWhatsAppPrompt(cleanPhone, name);
        }, 600);
      }

      history.push({ role: 'assistant', content: `Thank you, ${name}! Our team will contact you shortly.` });
    });
  }

  /* ─────────────────────────────────────────
     9. WHATSAPP / SMS PROMPT
        — shown when a phone number is detected
  ───────────────────────────────────────── */
  function showWhatsAppPrompt(rawPhone, name) {
    // Normalise: strip leading zeros and add country code if missing
    let phone = rawPhone.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = phone.substring(1);
    if (!phone.startsWith('91') && phone.length === 10) phone = '91' + phone; // default to India

    const prefilledMsg = encodeURIComponent(
      `Hi Adomantra! I'm ${name || 'a potential client'} and I'd like to know more about your services.`
    );
    const waLink = `https://wa.me/${phone}?text=${prefilledMsg}`;
    const smsLink = `sms:${rawPhone}?body=${prefilledMsg}`;

    const prompt = document.createElement('div');
    prompt.className = 'ado-msg bot';
    prompt.innerHTML = `
      <div class="ado-bot-mini"><i class="fa-solid fa-robot"></i></div>
      <div class="ado-bubble ado-wa-bubble">
        <p style="margin:0 0 10px;font-size:13px;">
          <i class="fa-solid fa-mobile-screen" style="color:#25D366;margin-right:5px;"></i>
          Want us to reach out to <strong>${escapeHtml(rawPhone)}</strong> right now?
        </p>
        <div class="ado-wa-actions">
          <a href="${waLink}" target="_blank" rel="noopener" class="ado-wa-btn ado-wa-green">
            <i class="fa-brands fa-whatsapp"></i> WhatsApp
          </a>
          <a href="${smsLink}" class="ado-wa-btn ado-wa-blue">
            <i class="fa-solid fa-sms"></i> SMS
          </a>
        </div>
        <p style="margin:8px 0 0;font-size:11px;color:#888;">
          Tapping opens your messaging app — no data is sent automatically.
        </p>
      </div>
    `;
    conversation.appendChild(prompt);
    scrollToBottom();
  }

  /* ─────────────────────────────────────────
     10. PHONE DETECTION — mid-conversation
  ───────────────────────────────────────── */
  function extractPhone(text) {
    // Matches: +91-9876543210, 09876543210, 9876543210, +1 800 555 0199, etc.
    const match = text.match(/(?:\+?\d{1,3}[\s\-]?)?(?:\(?\d{2,4}\)?[\s\-]?)?\d{6,10}/);
    return match ? match[0].replace(/[\s\-()]/g, '') : null;
  }

  /* ─────────────────────────────────────────
     11. SEND MESSAGE
  ───────────────────────────────────────── */
  async function sendMessage(userText) {
    userText = (userText || '').trim();
    if (!userText || isLoading) return;

    isLoading = true;
    sendBtn.disabled = true;

    addMessage('user', userText);
    history.push({ role: 'user', content: userText });

    inputEl.value = '';
    inputEl.style.height = 'auto';

    showTyping();

    // Intent detection
    const isContactIntent = /\b(contact|connect|reach|call me|get in touch|talk to|speak|sales|quote|enquire|inquiry|demo)\b/i.test(userText);
    const detectedPhone = extractPhone(userText);

    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.slice(-10)
          ],
          max_tokens: 200,
          temperature: 0.6,
          stream: false
        })
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errBody}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim()
        || "Sorry, I couldn't get a response. Please try again.";

      removeTyping();
      addMessage('bot', reply);
      history.push({ role: 'assistant', content: reply });

      // ── Post-reply actions ──
      if (detectedPhone) {
        // User dropped their number mid-chat → offer WhatsApp/SMS immediately
        setTimeout(() => {
          const ack = `Got your number! Would you like our team to reach out to you on WhatsApp or SMS?`;
          addMessage('bot', ack);
          history.push({ role: 'assistant', content: ack });
          showWhatsAppPrompt(detectedPhone, '');
        }, 600);

      } else if (isContactIntent && !contactFormShown) {
        // User asked to connect → slide in the contact form
        setTimeout(() => {
          addMessage('bot', 'Sure! Please fill in a few quick details and our team will get back to you shortly. 👇');
          showContactForm();
        }, 600);
      }

    } catch (err) {
      removeTyping();
      addMessage('bot', '⚠️ Something went wrong. Please check your connection and try again.');
      console.error('[Adomantra Chatbot]', err);
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  /* ─────────────────────────────────────────
     12. INPUT EVENT LISTENERS
  ───────────────────────────────────────── */
  sendBtn.addEventListener('click', () => sendMessage(inputEl.value));

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });

  // Auto-grow textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 90) + 'px';
  });

})();