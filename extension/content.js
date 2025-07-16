// LinguaLexis Browser Extension Content Script
// This script runs on all web pages to enable seamless language learning

class LinguaLexisExtension {
  constructor() {
    this.isActive = false;
    this.highlightingEnabled = true;
    this.selectedLanguage = 'spanish';
    this.collectedWords = new Set();
    this.tooltip = null;
    this.init();
  }

  init() {
    this.loadSettings();
    this.setupEventListeners();
    this.createTooltip();
    this.setupContextMenu();
    this.injectStyles();
  }

  loadSettings() {
    chrome.storage.sync.get(['highlightingEnabled', 'selectedLanguage'], (result) => {
      this.highlightingEnabled = result.highlightingEnabled !== false;
      this.selectedLanguage = result.selectedLanguage || 'spanish';
    });
  }

  setupEventListeners() {
    // Double-click to collect words
    document.addEventListener('dblclick', (e) => {
      if (this.highlightingEnabled) {
        this.handleWordSelection(e);
      }
    });

    // Selection change for phrase collection
    document.addEventListener('mouseup', (e) => {
      if (this.highlightingEnabled) {
        this.handleTextSelection(e);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        this.toggleHighlighting();
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.quickTranslate();
      }
    });

    // Hide tooltip on scroll or click elsewhere
    document.addEventListener('scroll', () => this.hideTooltip());
    document.addEventListener('click', (e) => {
      if (!this.tooltip.contains(e.target)) {
        this.hideTooltip();
      }
    });
  }

  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.id = 'lingualexis-tooltip';
    this.tooltip.className = 'lingualexis-tooltip';
    this.tooltip.style.display = 'none';
    document.body.appendChild(this.tooltip);
  }

  setupContextMenu() {
    // Context menu is handled by background script
    document.addEventListener('contextmenu', (e) => {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText) {
        chrome.runtime.sendMessage({
          action: 'updateContextMenu',
          text: selectedText
        });
      }
    });
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .lingualexis-tooltip {
        position: fixed;
        z-index: 10000;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        max-width: 300px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      }

      .lingualexis-tooltip h3 {
        margin: 0 0 8px 0;
        color: #4f46e5;
        font-size: 16px;
        font-weight: 600;
      }

      .lingualexis-tooltip p {
        margin: 0 0 8px 0;
        color: #6b7280;
      }

      .lingualexis-tooltip .translation {
        color: #059669;
        font-weight: 500;
      }

      .lingualexis-tooltip .actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .lingualexis-tooltip button {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .lingualexis-tooltip .primary-btn {
        background: #4f46e5;
        color: white;
      }

      .lingualexis-tooltip .primary-btn:hover {
        background: #4338ca;
      }

      .lingualexis-tooltip .secondary-btn {
        background: #f3f4f6;
        color: #374151;
      }

      .lingualexis-tooltip .secondary-btn:hover {
        background: #e5e7eb;
      }

      .lingualexis-highlight {
        background-color: #fef3c7;
        border-radius: 2px;
        padding: 1px 2px;
        cursor: pointer;
      }

      .lingualexis-collected {
        background-color: #d1fae5;
        border-bottom: 2px solid #059669;
      }

      .lingualexis-floating-icon {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #4f46e5;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        z-index: 9999;
        transition: transform 0.2s;
      }

      .lingualexis-floating-icon:hover {
        transform: scale(1.1);
      }

      .lingualexis-floating-icon svg {
        width: 24px;
        height: 24px;
        fill: white;
      }
    `;
    document.head.appendChild(style);
  }

  handleWordSelection(event) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && this.isValidWord(selectedText)) {
      this.showWordTooltip(selectedText, event.pageX, event.pageY);
    }
  }

  handleTextSelection(event) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText.length > 1) {
      setTimeout(() => {
        if (window.getSelection().toString().trim() === selectedText) {
          this.showPhraseTooltip(selectedText, event.pageX, event.pageY);
        }
      }, 100);
    }
  }

  isValidWord(text) {
    // Check if text is a valid word (not just punctuation, numbers, etc.)
    return /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/.test(text) && text.length > 1;
  }

  async showWordTooltip(word, x, y) {
    const wordInfo = await this.getWordInfo(word);
    
    this.tooltip.innerHTML = `
      <h3>${word}</h3>
      <p class="translation">${wordInfo.translation}</p>
      <p>${wordInfo.definition}</p>
      ${wordInfo.pronunciation ? `<p><em>/${wordInfo.pronunciation}/</em></p>` : ''}
      <div class="actions">
        <button class="primary-btn" data-action="collect">${
          this.collectedWords.has(word) ? 'Collected ✓' : 'Collect Word'
        }</button>
        <button class="secondary-btn" data-action="pronounce">🔊 Pronounce</button>
      </div>
    `;

    this.positionTooltip(x, y);
    this.tooltip.style.display = 'block';
    this.setupTooltipActions(word, wordInfo);
  }

  async showPhraseTooltip(phrase, x, y) {
    const phraseInfo = await this.getPhraseInfo(phrase);
    
    this.tooltip.innerHTML = `
      <h3>Selected Phrase</h3>
      <p class="translation">${phraseInfo.translation}</p>
      <p>${phraseInfo.explanation}</p>
      <div class="actions">
        <button class="primary-btn" data-action="collect-phrase">Collect Phrase</button>
        <button class="secondary-btn" data-action="pronounce-phrase">🔊 Pronounce</button>
      </div>
    `;

    this.positionTooltip(x, y);
    this.tooltip.style.display = 'block';
    this.setupTooltipActions(phrase, phraseInfo, true);
  }

  positionTooltip(x, y) {
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = x + 10;
    let top = y + 10;

    // Adjust if tooltip goes off-screen
    if (left + tooltipRect.width > viewportWidth) {
      left = x - tooltipRect.width - 10;
    }
    if (top + tooltipRect.height > viewportHeight) {
      top = y - tooltipRect.height - 10;
    }

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
  }

  setupTooltipActions(text, info, isPhrase = false) {
    const buttons = this.tooltip.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        switch (action) {
          case 'collect':
          case 'collect-phrase':
            this.collectWord(text, info, isPhrase);
            break;
          case 'pronounce':
          case 'pronounce-phrase':
            this.pronounceText(text);
            break;
        }
      });
    });
  }

  async getWordInfo(word) {
    // Mock translation - in real app, this would call a translation API
    const mockTranslations = {
      'hello': { translation: 'hola', definition: 'A greeting', pronunciation: 'həˈloʊ' },
      'beautiful': { translation: 'hermoso', definition: 'Pleasing to the senses', pronunciation: 'ˈbjuːtɪfəl' },
      'language': { translation: 'idioma', definition: 'A system of communication', pronunciation: 'ˈlæŋɡwɪdʒ' },
      'learning': { translation: 'aprendizaje', definition: 'The process of acquiring knowledge', pronunciation: 'ˈlɜːrnɪŋ' }
    };

    return mockTranslations[word.toLowerCase()] || {
      translation: `[${word} translation]`,
      definition: `Definition for ${word}`,
      pronunciation: null
    };
  }

  async getPhraseInfo(phrase) {
    // Mock phrase translation
    return {
      translation: `[Translation of "${phrase}"]`,
      explanation: `This phrase means...`
    };
  }

  collectWord(text, info, isPhrase = false) {
    this.collectedWords.add(text);
    
    // Store in extension storage
    chrome.storage.local.get(['collectedWords'], (result) => {
      const words = result.collectedWords || [];
      words.push({
        word: text,
        translation: info.translation,
        definition: info.definition,
        pronunciation: info.pronunciation,
        isPhrase,
        timestamp: Date.now(),
        url: window.location.href
      });
      
      chrome.storage.local.set({ collectedWords: words });
    });

    // Update tooltip
    const collectBtn = this.tooltip.querySelector('[data-action="collect"], [data-action="collect-phrase"]');
    if (collectBtn) {
      collectBtn.textContent = 'Collected ✓';
      collectBtn.disabled = true;
    }

    // Show notification
    this.showNotification(`"${text}" collected!`, 'success');
  }

  pronounceText(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.selectedLanguage === 'spanish' ? 'es-ES' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }

  hideTooltip() {
    this.tooltip.style.display = 'none';
  }

  toggleHighlighting() {
    this.highlightingEnabled = !this.highlightingEnabled;
    chrome.storage.sync.set({ highlightingEnabled: this.highlightingEnabled });
    
    this.showNotification(
      `Word highlighting ${this.highlightingEnabled ? 'enabled' : 'disabled'}`,
      'info'
    );
  }

  quickTranslate() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      this.showWordTooltip(selectedText, 0, 0);
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `lingualexis-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      background: ${type === 'success' ? '#10b981' : '#3b82f6'};
      color: white;
      border-radius: 8px;
      z-index: 10001;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  createFloatingIcon() {
    const icon = document.createElement('div');
    icon.className = 'lingualexis-floating-icon';
    icon.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    `;
    
    icon.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openLinguaLexis' });
    });
    
    document.body.appendChild(icon);
  }
}

// Initialize the extension when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LinguaLexisExtension();
  });
} else {
  new LinguaLexisExtension();
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleHighlighting') {
    window.linguaLexis.toggleHighlighting();
  } else if (request.action === 'collectSelectedText') {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      window.linguaLexis.collectWord(selectedText, {
        translation: '[Translation]',
        definition: '[Definition]'
      });
    }
  }
});

// Add CSS animation
const animationStyle = document.createElement('style');
animationStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(animationStyle);