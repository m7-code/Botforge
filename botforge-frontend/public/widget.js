(function () {
  const script = document.currentScript;
  const BOT_ID = script?.getAttribute('data-bot-id');
  const API_BASE = 'http://localhost:3000/api/v1';

  if (!BOT_ID) return console.error('BotForge: data-bot-id missing');

  let conversationId = null;
  let config = {};

  const style = document.createElement('style');
  style.textContent = `
    #bf-widget-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.25);
      z-index: 99998;
      transition: transform 0.2s;
    }
    #bf-widget-btn:hover { transform: scale(1.08); }
    #bf-widget {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 320px;
      height: 440px;
      border-radius: 14px;
      display: none;
      flex-direction: column;
      box-shadow: 0 6px 30px rgba(0,0,0,0.2);
      z-index: 99999;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      background: #fff;
    }
    #bf-header {
      padding: 12px 16px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    #bf-header-title { font-weight: 700; font-size: 14px; }
    #bf-header-sub { font-size: 11px; opacity: 0.8; margin-top: 1px; }
    #bf-close {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #bf-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      background: #f5f5f5;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .bf-msg {
      max-width: 82%;
      padding: 8px 12px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.5;
      word-wrap: break-word;
    }
    .bf-msg.user {
      align-self: flex-end;
      color: white;
      border-bottom-right-radius: 3px;
    }
    .bf-msg.bot {
      align-self: flex-start;
      background: white;
      color: #1a1a1a;
      border-bottom-left-radius: 3px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .bf-typing {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
      background: white;
      border-radius: 14px;
      align-self: flex-start;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .bf-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #aaa;
      animation: bf-bounce 1.2s infinite;
    }
    .bf-dot:nth-child(2) { animation-delay: 0.2s; }
    .bf-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bf-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-6px); }
    }
    #bf-input-area {
      padding: 10px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 6px;
      background: white;
      flex-shrink: 0;
    }
    #bf-input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 20px;
      padding: 8px 14px;
      font-size: 13px;
      outline: none;
    }
    #bf-input:focus { border-color: var(--bf-color, #0F2A4A); }
    #bf-send {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    #bf-send:disabled { opacity: 0.5; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.id = 'bf-widget';
  widget.innerHTML = `
    <div id="bf-header">
      <div>
        <div id="bf-header-title">AI Assistant</div>
        <div id="bf-header-sub">● Online</div>
      </div>
      <button id="bf-close">✕</button>
    </div>
    <div id="bf-messages"></div>
    <div id="bf-input-area">
      <input id="bf-input" placeholder="Type your message..." />
      <button id="bf-send">➤</button>
    </div>
  `;

  const btn = document.createElement('button');
  btn.id = 'bf-widget-btn';
  btn.innerHTML = '💬';

  document.body.appendChild(widget);
  document.body.appendChild(btn);

  function setColor(color) {
    document.documentElement.style.setProperty('--bf-color', color);
    document.getElementById('bf-header').style.background = color;
    document.getElementById('bf-widget-btn').style.background = color;
    document.getElementById('bf-send').style.background = color;
  }

  async function loadConfig() {
    try {
      const res = await fetch(`${API_BASE}/chat/${BOT_ID}/config`);
      const data = await res.json();
      if (data.success) {
        config = data.data;
        setColor(config.accent_color || '#0F2A4A');
        document.getElementById('bf-header-title').textContent = config.bot_name || 'AI Assistant';
        addMessage('bot', config.greeting || 'Hello! How can I help you?');
      } else {
        setColor('#0F2A4A');
        addMessage('bot', 'Hello! How can I help you?');
      }
    } catch (e) {
      setColor('#0F2A4A');
      addMessage('bot', 'Hello! How can I help you?');
    }
  }

  async function startConversation() {
    if (conversationId) return;
    try {
      const res = await fetch(`${API_BASE}/chat/${BOT_ID}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) conversationId = data.data.conversation_id;
    } catch (e) {
      console.error('Start error:', e);
    }
  }

  function addMessage(role, text) {
    const msgs = document.getElementById('bf-messages');
    const div = document.createElement('div');
    div.className = `bf-msg ${role}`;
    if (role === 'user') div.style.background = config.accent_color || '#0F2A4A';
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function showTyping() {
    const msgs = document.getElementById('bf-messages');
    const div = document.createElement('div');
    div.className = 'bf-typing';
    div.id = 'bf-typing';
    div.innerHTML = '<div class="bf-dot"></div><div class="bf-dot"></div><div class="bf-dot"></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    document.getElementById('bf-typing')?.remove();
  }

  async function sendMessage() {
    const input = document.getElementById('bf-input');
    const sendBtn = document.getElementById('bf-send');
    const message = input.value.trim();
    if (!message || sendBtn.disabled) return;

    input.value = '';
    sendBtn.disabled = true;
    addMessage('user', message);

    // Conversation start karo agar nahi hai
    await startConversation();

    if (!conversationId) {
      addMessage('bot', 'Connection error. Please refresh and try again.');
      sendBtn.disabled = false;
      return;
    }

    showTyping();

    try {
      const response = await fetch(`${API_BASE}/chat/${BOT_ID}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId, message })
      });

      hideTyping();

      if (!response.ok) {
        addMessage('bot', 'Sorry, something went wrong. Please try again.');
        sendBtn.disabled = false;
        return;
      }

      const botMsg = addMessage('bot', '');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          try {
            const data = JSON.parse(line.replace('data: ', ''));
            if (data.token) {
              fullText += data.token;
              botMsg.textContent = fullText;
              document.getElementById('bf-messages').scrollTop = 99999;
            }
            if (data.error) {
              botMsg.textContent = 'Sorry, something went wrong.';
            }
          } catch {}
        }
      }

      if (!fullText) botMsg.textContent = 'Sorry, I could not generate a response.';

    } catch (e) {
      hideTyping();
      addMessage('bot', 'Connection error. Please check your internet and try again.');
    }

    sendBtn.disabled = false;
    input.focus();
  }

  // Toggle widget
  btn.addEventListener('click', () => {
    const isOpen = widget.style.display === 'flex';
    widget.style.display = isOpen ? 'none' : 'flex';
    btn.innerHTML = isOpen ? '💬' : '✕';
    if (!isOpen) document.getElementById('bf-input').focus();
  });

  document.getElementById('bf-close').addEventListener('click', () => {
    widget.style.display = 'none';
    btn.innerHTML = '💬';
  });

  document.getElementById('bf-send').addEventListener('click', sendMessage);

  document.getElementById('bf-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  loadConfig();
})();