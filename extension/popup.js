// LinguaLexis Extension Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  // Load saved settings
  await loadSettings();
  
  // Load statistics
  await loadStats();
  
  // Load recent words
  await loadRecentWords();
  
  // Set up event listeners
  setupEventListeners();
});

async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['highlightingEnabled', 'selectedLanguage']);
    
    // Update highlighting toggle
    const highlightingToggle = document.getElementById('highlighting-toggle');
    if (result.highlightingEnabled !== false) {
      highlightingToggle.classList.add('active');
    }
    
    // Update language selector
    const languageSelect = document.getElementById('language-select');
    if (result.selectedLanguage) {
      languageSelect.value = result.selectedLanguage;
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

async function loadStats() {
  try {
    const result = await chrome.storage.local.get(['collectedWords']);
    const words = result.collectedWords || [];
    
    // Update words collected count
    document.getElementById('words-collected').textContent = words.length;
    
    // Calculate study streak (mock data for now)
    const streak = Math.min(words.length, 7); // Simple calculation
    document.getElementById('study-streak').textContent = streak;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

async function loadRecentWords() {
  try {
    const result = await chrome.storage.local.get(['collectedWords']);
    const words = result.collectedWords || [];
    
    const recentWordsContainer = document.getElementById('recent-words');
    
    if (words.length === 0) {
      recentWordsContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; opacity: 0.6; font-size: 12px;">
          No words collected yet.<br>
          Start by highlighting words on any webpage!
        </div>
      `;
      return;
    }
    
    // Show last 5 words
    const recentWords = words.slice(-5).reverse();
    recentWordsContainer.innerHTML = recentWords.map(word => `
      <div class="word-item">
        <div>
          <div class="word-text">${word.word}</div>
          <div class="word-translation">${word.translation}</div>
        </div>
        <div style="font-size: 10px; opacity: 0.6;">
          ${new Date(word.timestamp).toLocaleDateString()}
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load recent words:', error);
  }
}

function setupEventListeners() {
  // Open main app
  document.getElementById('open-app').addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://igor-kan.github.io/repos/lingualexis/'
    });
    window.close();
  });
  
  // Start collection (activate highlighting)
  document.getElementById('start-collection').addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, { action: 'toggleHighlighting' });
        
        // Update UI to show it's active
        const button = document.getElementById('start-collection');
        button.innerHTML = '<span class="action-icon">✅</span>Collection Active';
        
        setTimeout(() => {
          window.close();
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to start collection:', error);
    }
  });
  
  // Highlighting toggle
  document.getElementById('highlighting-toggle').addEventListener('click', async () => {
    const toggle = document.getElementById('highlighting-toggle');
    const isActive = toggle.classList.contains('active');
    
    // Toggle state
    if (isActive) {
      toggle.classList.remove('active');
      await chrome.storage.sync.set({ highlightingEnabled: false });
    } else {
      toggle.classList.add('active');
      await chrome.storage.sync.set({ highlightingEnabled: true });
    }
    
    // Notify content script
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, { action: 'toggleHighlighting' });
      }
    } catch (error) {
      console.error('Failed to notify content script:', error);
    }
  });
  
  // Language selector
  document.getElementById('language-select').addEventListener('change', async (e) => {
    const selectedLanguage = e.target.value;
    await chrome.storage.sync.set({ selectedLanguage });
    
    // Notify content script
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, { 
          action: 'updateLanguage', 
          language: selectedLanguage 
        });
      }
    } catch (error) {
      console.error('Failed to update language:', error);
    }
  });
  
  // View all words
  document.getElementById('view-all-words').addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://igor-kan.github.io/repos/lingualexis/?tab=vocabulary'
    });
    window.close();
  });
}

// Update popup when storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.collectedWords) {
    loadStats();
    loadRecentWords();
  }
  
  if (areaName === 'sync') {
    if (changes.highlightingEnabled || changes.selectedLanguage) {
      loadSettings();
    }
  }
});

// Add keyboard shortcuts info
document.addEventListener('keydown', (e) => {
  if (e.key === '?' || e.key === 'h') {
    showKeyboardShortcuts();
  }
});

function showKeyboardShortcuts() {
  // Create a temporary tooltip showing keyboard shortcuts
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 16px;
    border-radius: 8px;
    font-size: 12px;
    z-index: 1000;
    max-width: 250px;
  `;
  
  tooltip.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 8px;">Keyboard Shortcuts</div>
    <div>Ctrl+Shift+L - Toggle highlighting</div>
    <div>Ctrl+Shift+T - Quick translate</div>
    <div style="margin-top: 8px; opacity: 0.7;">Press any key to close</div>
  `;
  
  document.body.appendChild(tooltip);
  
  // Remove on any key press
  const removeTooltip = () => {
    tooltip.remove();
    document.removeEventListener('keydown', removeTooltip);
  };
  
  setTimeout(() => {
    document.addEventListener('keydown', removeTooltip);
  }, 100);
  
  // Auto-remove after 5 seconds
  setTimeout(removeTooltip, 5000);
}