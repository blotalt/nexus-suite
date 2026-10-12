/**
 * AI Studio Module - Interactive AI Chat Assistant & Prompt Playground
 */

const AIStudioModule = (() => {
  const models = [
    { id: 'gemini-3.8-pro', name: 'Gemini 3.8 Pro', desc: 'High intelligence & multimodal reasoning', latency: '180ms' },
    { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', desc: 'Nuanced code generation & analytical writing', latency: '220ms' },
    { id: 'gpt-4o', name: 'GPT-4o Omnimodal', desc: 'Fast general-purpose conversational responses', latency: '210ms' },
    { id: 'deepseek-r1', name: 'DeepSeek R1', desc: 'Open reasoning chain logic model', latency: '310ms' }
  ];

  let selectedModel = models[0];
  let isGenerating = false;
  let totalTokens = 1420;

  const cannedKnowledge = {
    'audit': `Here is an automated code audit analysis for your snippet:

\`\`\`javascript
// Recommended Optimizations
export function calculateTotals(items = []) {
  if (!Array.isArray(items)) return { subtotal: 0, tax: 0, total: 0 };

  const subtotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity || 0), 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  return {
    subtotal,
    tax,
    total: Number((subtotal + tax).toFixed(2))
  };
}
\`\`\`

**Key findings:**
1. **Memory efficiency**: Removed intermediate object allocation within iteration.
2. **Defensive validation**: Handled non-array inputs gracefully.
3. **Floating-point precision**: Rounded currency calculations to standard cent representations.`,
    
    'quantum': `### Quantum Superposition & Entanglement Explained Simply

Think of a traditional coin resting flat on a table: it is either **Heads (0)** or **Tails (1)**.

1. **Superposition**: While that coin is spinning in mid-air, it is not strictly Heads or Tails—it exists in a probabilistic blend of both states until it is measured (slapped down onto the table).
2. **Entanglement**: Imagine two coins spun together whose fates become inextricably linked. Even if you separate them by galaxies, measuring one instantly defines the state of the other.

\`\`\`python
# Quantum State Representation
# |Ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1
import numpy as np

state_zero = np.array([1, 0])
state_one  = np.array([0, 1])
superposition = (state_zero + state_one) / np.sqrt(2)
print("Superposition vector:", superposition)
\`\`\``,

    'sql': `### Optimized Indexing & SQL Query Strategy

\`\`\`sql
-- Query with Composite Covering Index
CREATE INDEX idx_orders_customer_status_created 
ON orders (customer_id, status, created_at DESC)
INCLUDE (total_amount);

SELECT 
    order_id,
    customer_id,
    total_amount,
    created_at
FROM orders
WHERE customer_id = @customerId 
  AND status = 'COMPLETED'
ORDER BY created_at DESC
LIMIT 20;
\`\`\`

**Performance Gains:**
- Eliminates sequential table scans (O(N) ➔ O(log N)).
- Avoids heap lookups by serving data straight from the index b-tree leaf nodes.`,

    'marketing': `### High-Converting SaaS Landing Page Hero Copy

**Headline**:  
*Transform Fragmented Workflows into One Harmonious Command Center.*

**Sub-headline**:  
Empower engineering, product, and data teams with real-time telemetry, automated tasks, and AI reasoning—all running at 60 FPS in your browser.

**CTA Buttons**:  
- **Primary**: *Launch Free Workspace ➔*
- **Secondary**: *Explore Interactive Demo (No CC Required)*`
  };

  function init() {
    renderModelCards();
    setupTemplates();
    setupChatInputs();
  }

  function renderModelCards() {
    const list = document.getElementById('aiModelCardsList');
    if (!list) return;

    list.innerHTML = models.map(m => `
      <div class="model-selector-card ${m.id === selectedModel.id ? 'selected' : ''}" onclick="AIStudioModule.selectModel('${m.id}')">
        <div class="model-meta">
          <h4>${m.name}</h4>
          <p>${m.desc}</p>
        </div>
        <span style="font-size: 0.6875rem; font-weight: 700; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.1); padding: 2px 6px; border-radius: 4px;">
          ${m.latency}
        </span>
      </div>
    `).join('');

    const activeDisplay = document.getElementById('activeModelBadge');
    if (activeDisplay) activeDisplay.innerText = selectedModel.name;
  }

  function selectModel(id) {
    const found = models.find(m => m.id === id);
    if (!found) return;
    selectedModel = found;
    renderModelCards();
    if (window.App) window.App.showToast(`Switched active AI model to ${selectedModel.name}`);
  }

  function setupTemplates() {
    const buttons = document.querySelectorAll('.prompt-chip-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.promptType;
        const textarea = document.getElementById('aiChatInput');
        if (!textarea) return;

        if (type === 'audit') textarea.value = 'Can you perform a security and optimization code audit on this JavaScript function?';
        else if (type === 'quantum') textarea.value = 'Explain quantum computing and superposition in simple terms with code.';
        else if (type === 'sql') textarea.value = 'Optimize this SQL query for high-traffic e-commerce order lookups.';
        else if (type === 'marketing') textarea.value = 'Write a modern, sleek SaaS landing page hero title and value proposition.';
        
        textarea.focus();
      });
    });
  }

  function setupChatInputs() {
    const sendBtn = document.getElementById('btnSendAiChat');
    const textarea = document.getElementById('aiChatInput');
    const clearBtn = document.getElementById('btnClearAiChat');

    if (sendBtn) sendBtn.addEventListener('click', handleSendMessage);
    if (textarea) {
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const container = document.getElementById('chatMessagesContainer');
        if (container) {
          container.innerHTML = `
            <div class="message-bubble-wrapper ai">
              <div class="chat-avatar ai">AI</div>
              <div class="message-bubble">
                Hello! I am your <strong>${selectedModel.name}</strong> assistant. How can I assist you with your project, architecture, or coding today?
              </div>
            </div>
          `;
        }
        totalTokens = 120;
        updateTokensDisplay();
        if (window.App) window.App.showToast('Chat history cleared');
      });
    }
  }

  function handleSendMessage() {
    if (isGenerating) return;
    const textarea = document.getElementById('aiChatInput');
    if (!textarea) return;
    const text = textarea.value.trim();
    if (!text) return;

    appendUserMessage(text);
    textarea.value = '';

    // Pick response
    let responseText = '';
    const lower = text.toLowerCase();
    if (lower.includes('audit') || lower.includes('javascript') || lower.includes('function')) responseText = cannedKnowledge['audit'];
    else if (lower.includes('quantum') || lower.includes('physics')) responseText = cannedKnowledge['quantum'];
    else if (lower.includes('sql') || lower.includes('database') || lower.includes('query')) responseText = cannedKnowledge['sql'];
    else if (lower.includes('marketing') || lower.includes('hero') || lower.includes('copy')) responseText = cannedKnowledge['marketing'];
    else {
      responseText = `I analyzed your request: "${text}".\n\nI can help you architect, code, test, or deploy full-stack solutions. Try exploring the prompt templates in the left sidebar for deep-dive examples!`;
    }

    streamAiResponse(responseText);
  }

  function appendUserMessage(text) {
    const container = document.getElementById('chatMessagesContainer');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'message-bubble-wrapper user';
    div.innerHTML = `
      <div class="chat-avatar user">You</div>
      <div class="message-bubble">${escapeHtml(text)}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;

    totalTokens += Math.floor(text.length / 3);
    updateTokensDisplay();
  }

  function streamAiResponse(fullText) {
    isGenerating = true;
    const container = document.getElementById('chatMessagesContainer');
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'message-bubble-wrapper ai';
    wrapper.innerHTML = `
      <div class="chat-avatar ai">AI</div>
      <div class="message-bubble"><span class="typing-text"></span><span class="cursor-blink">▍</span></div>
    `;
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;

    const target = wrapper.querySelector('.typing-text');
    let index = 0;
    const speed = 12;

    const interval = setInterval(() => {
      index += 3;
      if (index >= fullText.length) {
        clearInterval(interval);
        isGenerating = false;
        wrapper.querySelector('.cursor-blink').remove();
        target.innerHTML = formatMarkdown(fullText);
        container.scrollTop = container.scrollHeight;
        totalTokens += Math.floor(fullText.length / 3);
        updateTokensDisplay();
      } else {
        target.innerHTML = formatMarkdown(fullText.slice(0, index));
        container.scrollTop = container.scrollHeight;
      }
    }, speed);
  }

  function formatMarkdown(text) {
    // Basic code block formatting
    return text
      .replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
      })
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  function updateTokensDisplay() {
    const el = document.getElementById('totalTokensBadge');
    if (el) el.innerText = `${totalTokens.toLocaleString()} tokens`;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return { init, selectModel };
})();
