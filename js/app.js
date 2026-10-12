/**
 * Nexus Suite - Master Application Orchestrator
 */

const App = (() => {
  let activeModuleId = 'dashboard';
  let isDarkMode = true;

  const commandItems = [
    { title: 'Go to SaaS Analytics Dashboard', icon: 'grid', action: () => switchModule('dashboard') },
    { title: 'Browse E-Commerce Marketplace', icon: 'shopping-bag', action: () => switchModule('store') },
    { title: 'Open AI Prompt & Chat Studio', icon: 'cpu', action: () => switchModule('ai-studio') },
    { title: 'Manage Kanban Tasks Board', icon: 'trello', action: () => switchModule('kanban') },
    { title: 'View Developer Portfolio & Agency', icon: 'user', action: () => switchModule('portfolio') },
    { title: 'Toggle Dark / Light Theme', icon: 'sun', action: () => toggleTheme() },
    { title: 'Open Shopping Cart Drawer', icon: 'shopping-cart', action: () => document.getElementById('openCartBtn')?.click() },
    { title: 'Create New Kanban Task', icon: 'plus-circle', action: () => { switchModule('kanban'); openModal('newTaskModal'); } }
  ];

  function init() {
    initTheme();
    setupNavigation();
    setupCommandPalette();
    setupModals();

    // Initialize sub-modules
    if (window.DashboardModule) DashboardModule.init();
    if (window.StoreModule) StoreModule.init();
    if (window.AIStudioModule) AIStudioModule.init();
    if (window.KanbanModule) KanbanModule.init();
    if (window.PortfolioModule) PortfolioModule.init();

    // Check URL Hash for deep linking
    const hash = window.location.hash.replace('#', '');
    if (['dashboard', 'store', 'ai-studio', 'kanban', 'portfolio'].includes(hash)) {
      switchModule(hash);
    }
  }

  function initTheme() {
    const saved = localStorage.getItem('nexus_theme');
    if (saved) {
      isDarkMode = saved === 'dark';
    } else {
      isDarkMode = true;
    }
    applyTheme();

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('nexus_theme', isDarkMode ? 'dark' : 'light');
    applyTheme();
    showToast(`Switched to ${isDarkMode ? 'Dark' : 'Light'} Mode`);
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    const iconContainer = document.getElementById('themeToggleIcon');
    if (iconContainer) {
      iconContainer.innerHTML = isDarkMode
        ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
        : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
  }

  function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.targetModule;
        if (target) switchModule(target);
      });
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'store', 'ai-studio', 'kanban', 'portfolio'].includes(hash)) {
        switchModule(hash);
      }
    });
  }

  function switchModule(moduleId) {
    activeModuleId = moduleId;
    window.location.hash = moduleId;

    // Update active tab buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.dataset.targetModule === moduleId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update module visibility
    document.querySelectorAll('.app-module').forEach(mod => {
      if (mod.id === `module-${moduleId}`) {
        mod.classList.add('active');
      } else {
        mod.classList.remove('active');
      }
    });

    // Refresh charts or layout if needed
    if (moduleId === 'dashboard' && window.DashboardModule) {
      setTimeout(() => DashboardModule.renderChart('7D'), 50);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setupCommandPalette() {
    const paletteOverlay = document.getElementById('commandPaletteOverlay');
    const paletteInput = document.getElementById('paletteSearchInput');
    const openBtn = document.getElementById('openPaletteBtn');
    const resultsContainer = document.getElementById('paletteResultsList');

    const renderResults = (query = '') => {
      if (!resultsContainer) return;
      const filtered = commandItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
      
      resultsContainer.innerHTML = filtered.map((item, idx) => `
        <div class="palette-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <div class="palette-item-left">
            <span>●</span>
            <span>${item.title}</span>
          </div>
          <span class="kbd-shortcut">↵ Enter</span>
        </div>
      `).join('');

      resultsContainer.querySelectorAll('.palette-item').forEach((elem, idx) => {
        elem.addEventListener('click', () => {
          filtered[idx].action();
          closeAllModals();
        });
      });
    };

    const openPalette = () => {
      openModal('commandPaletteModal');
      if (paletteInput) {
        paletteInput.value = '';
        paletteInput.focus();
        renderResults('');
      }
    };

    if (openBtn) openBtn.addEventListener('click', openPalette);

    if (paletteInput) {
      paletteInput.addEventListener('input', (e) => {
        renderResults(e.target.value);
      });

      paletteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const firstItem = resultsContainer.querySelector('.palette-item');
          if (firstItem) firstItem.click();
        }
      });
    }

    // Global shortcut Ctrl+K or Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openPalette();
      } else if (e.key === 'Escape') {
        closeAllModals();
      }
    });
  }

  function setupModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });
  }

  function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('open');
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('open'));
  }

  function showToast(message, duration = 3200) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent-emerald)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  return { init, switchModule, openModal, closeAllModals, showToast, toggleTheme };
})();

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
