// LinguaLexis Browser Extension Background Script

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu items
  createContextMenus();
  
  // Set up default settings
  chrome.storage.sync.get(['highlightingEnabled', 'selectedLanguage'], (result) => {
    if (result.highlightingEnabled === undefined) {
      chrome.storage.sync.set({ highlightingEnabled: true });
    }
    if (!result.selectedLanguage) {
      chrome.storage.sync.set({ selectedLanguage: 'spanish' });
    }
  });
});

function createContextMenus() {
  // Remove existing menus
  chrome.contextMenus.removeAll(() => {
    // Main menu
    chrome.contextMenus.create({
      id: 'lingualexis-main',
      title: 'LinguaLexis',
      contexts: ['selection']
    });

    // Collect word submenu
    chrome.contextMenus.create({
      id: 'collect-word',
      parentId: 'lingualexis-main',
      title: 'Collect "%s"',
      contexts: ['selection']
    });

    // Translate submenu
    chrome.contextMenus.create({
      id: 'translate-text',
      parentId: 'lingualexis-main',
      title: 'Translate "%s"',
      contexts: ['selection']
    });

    // Settings submenu
    chrome.contextMenus.create({
      id: 'toggle-highlighting',
      parentId: 'lingualexis-main',
      title: 'Toggle Highlighting',
      contexts: ['all']
    });

    // Open app submenu
    chrome.contextMenus.create({
      id: 'open-app',
      parentId: 'lingualexis-main',
      title: 'Open LinguaLexis App',
      contexts: ['all']
    });
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'collect-word':
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'collectSelectedText',
          text: info.selectionText
        });
      }
      break;

    case 'translate-text':
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'translateText',
          text: info.selectionText
        });
      }
      break;

    case 'toggle-highlighting':
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'toggleHighlighting'
        });
      }
      break;

    case 'open-app':
      chrome.tabs.create({
        url: 'https://igor-kan.github.io/repos/lingualexis/'
      });
      break;
  }
});

// Handle keyboard commands
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      switch (command) {
        case 'toggle-highlighting':
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggleHighlighting'
          });
          break;

        case 'quick-translate':
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'quickTranslate'
          });
          break;
      }
    }
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'openLinguaLexis':
      chrome.tabs.create({
        url: 'https://igor-kan.github.io/repos/lingualexis/'
      });
      break;

    case 'updateContextMenu':
      // Update context menu with selected text
      chrome.contextMenus.update('collect-word', {
        title: `Collect "${request.text.substring(0, 20)}${request.text.length > 20 ? '...' : ''}"`
      });
      chrome.contextMenus.update('translate-text', {
        title: `Translate "${request.text.substring(0, 20)}${request.text.length > 20 ? '...' : ''}"`
      });
      break;

    case 'showNotification':
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: 'LinguaLexis',
        message: request.message
      });
      break;

    case 'getStoredWords':
      chrome.storage.local.get(['collectedWords'], (result) => {
        sendResponse({ words: result.collectedWords || [] });
      });
      return true; // Keep message channel open for async response

    case 'saveWord':
      chrome.storage.local.get(['collectedWords'], (result) => {
        const words = result.collectedWords || [];
        words.push(request.word);
        chrome.storage.local.set({ collectedWords: words }, () => {
          sendResponse({ success: true });
        });
      });
      return true;
  }
});

// Handle extension installation/update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Show welcome notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Welcome to LinguaLexis!',
      message: 'Start learning languages by highlighting words on any webpage.'
    });

    // Open the main app
    setTimeout(() => {
      chrome.tabs.create({
        url: 'https://igor-kan.github.io/repos/lingualexis/'
      });
    }, 2000);
  }
});

// Handle tab updates to refresh context menus
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    createContextMenus();
  }
});

// Sync data with main app (if user is logged in)
async function syncWithMainApp() {
  try {
    chrome.storage.local.get(['collectedWords'], async (result) => {
      const words = result.collectedWords || [];
      
      // In a real implementation, this would sync with the server
      console.log('Syncing', words.length, 'collected words with main app');
      
      // For now, just store locally
      chrome.storage.sync.set({ 
        lastSync: Date.now(),
        wordCount: words.length 
      });
    });
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Periodic sync (every 30 minutes)
chrome.alarms.create('sync', { periodInMinutes: 30 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'sync') {
    syncWithMainApp();
  }
});