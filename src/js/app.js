/**
 * Main Application Module
 * 
 * Initializes and coordinates all application modules
 * Loads configurations and sets up the application
 */

class App {
  constructor() {
    this.config = {};
    this.authManager = null;
    this.initialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.initialized) return;

    try {
      console.log('🚀 Initializing DrYouu Website...');

      // Load all configurations
      await this.loadConfigurations();

      // Initialize authentication
      await this.initializeAuth();

      // Initialize page-specific features
      await this.initializePage();

      // Setup navigation
      this.setupNavigation();

      // Setup mobile menu
      this.setupMobileMenu();

      this.initialized = true;
      console.log('✅ Application initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      this.handleInitError(error);
    }
  }

  /**
   * Load all configuration files
   */
  async loadConfigurations() {
    try {
      const configs = await configLoader.loadMultiple([
        'site',
        'auth',
        'projects',
        'wiki',
        'private-links'
      ]);

      this.config = configs;
      
      console.log('✅ Configurations loaded:', Object.keys(configs));
    } catch (error) {
      console.error('Failed to load configurations:', error);
      throw error;
    }
  }

  /**
   * Initialize authentication system
   */
  async initializeAuth() {
    try {
      this.authManager = new AuthManager();
      await this.authManager.init(this.config.auth);
      
      console.log('✅ Authentication system initialized');
    } catch (error) {
      console.error('Failed to initialize authentication:', error);
      // Don't throw - auth is optional for public pages
    }
  }

  /**
   * Initialize page-specific features
   */
  async initializePage() {
    const pageName = this.getCurrentPage();

    switch (pageName) {
      case 'index':
        await this.initializeHomePage();
        break;
      
      case 'login':
        await this.initializeLoginPage();
        break;
      
      case 'projects':
        await this.initializeProjectsPage();
        break;
      
      case 'dashboard':
      case 'wiki':
      case 'links':
        // Protect private pages
        if (this.authManager) {
          this.authManager.protectPage();
        }
        
        if (pageName === 'wiki') {
          await this.initializeWikiPage();
        } else if (pageName === 'links') {
          await this.initializeLinksPage();
        } else if (pageName === 'dashboard') {
          await this.initializeDashboardPage();
        }
        break;
    }
  }

  /**
   * Initialize home page
   */
  async initializeHomePage() {
    // Render hero section
    const heroContainer = document.querySelector('.hero-content');
    if (heroContainer && this.config.site.hero) {
      ContentRenderer.renderHero(this.config.site.hero, heroContainer.parentElement);
    }

    // Render features
    const featuresContainer = document.querySelector('.projects-grid');
    if (featuresContainer && this.config.site.features) {
      ContentRenderer.renderFeatures(this.config.site.features, featuresContainer);
    }
  }

  /**
   * Initialize login page
   */
  async initializeLoginPage() {
    if (!this.authManager) return;

    // Check if already logged in
    if (this.authManager.checkSession()) {
      window.location.href = '/private/dashboard.html';
      return;
    }

    const container = document.getElementById('authMethodsContainer');
    if (!container) return;

    // Get available auth methods
    const methods = this.authManager.getAvailableMethods();

    // Render auth methods
    AuthUI.renderAuthMethods(container, methods, async (method, credentials) => {
      const errorDiv = document.getElementById('loginError');
      
      try {
        AuthUI.setLoading(document.querySelector('button[type="submit"]'), true);
        
        await this.authManager.authenticate(method, credentials);
        
        // Redirect on success
        window.location.href = '/private/dashboard.html';
      } catch (error) {
        AuthUI.showError(error.message, errorDiv);
      } finally {
        AuthUI.setLoading(document.querySelector('button[type="submit"]'), false);
      }
    });

    // Check if WebAuthn is available and show registration option
    if (await this.authManager.isWebAuthnAvailable()) {
      this.addWebAuthnRegistrationOption();
    }
  }

  /**
   * Initialize projects page
   */
  async initializeProjectsPage() {
    const container = document.getElementById('projectsGrid');
    if (!container || !this.config.projects) return;

    ContentRenderer.renderProjects(
      this.config.projects.projects,
      container,
      false // Show all projects
    );

    // Setup category filters
    this.setupProjectFilters();
  }

  /**
   * Initialize wiki page
   */
  async initializeWikiPage() {
    const sidebar = document.getElementById('wikiSidebar');
    const content = document.getElementById('wikiContent');
    
    if (!sidebar || !content || !this.config.wiki) return;

    const wikiData = this.config.wiki.wiki;

    // Render sidebar
    ContentRenderer.renderWikiSidebar(wikiData, sidebar, (article) => {
      ContentRenderer.renderWikiArticle(article, content);
    });

    // Load default article
    const defaultArticle = wikiData.articles.find(
      a => a.id === wikiData.defaultArticle
    ) || wikiData.articles[0];

    if (defaultArticle) {
      ContentRenderer.renderWikiArticle(defaultArticle, content);
      
      // Highlight default article in sidebar
      const defaultLink = sidebar.querySelector(`[data-article-id="${defaultArticle.id}"]`);
      if (defaultLink) {
        defaultLink.classList.add('active');
      }
    }
  }

  /**
   * Initialize links page
   */
  async initializeLinksPage() {
    const container = document.getElementById('linksContainer');
    if (!container || !this.config['private-links']) return;

    ContentRenderer.renderPrivateLinks(
      this.config['private-links'].categories,
      container
    );
  }

  /**
   * Initialize dashboard page
   */
  async initializeDashboardPage() {
    // Get user session
    if (!this.authManager) return;
    
    const session = this.authManager.getSession();
    if (!session) return;

    // Update welcome message
    const welcomeElement = document.querySelector('.dashboard-welcome h2');
    if (welcomeElement && session.user) {
      welcomeElement.textContent = `Bienvenido, ${session.user.displayName || session.user.username}`;
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.authManager.logout();
      });
    }
  }

  /**
   * Setup navigation highlighting
   */
  setupNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPath.includes(href) || (currentPath === '/' && href === '/index.html')) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Setup mobile menu toggle
   */
  setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }

  /**
   * Setup project filters
   */
  setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter projects
        projectCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * Add WebAuthn registration option
   */
  addWebAuthnRegistrationOption() {
    const loginCard = document.querySelector('.login-card');
    if (!loginCard) return;

    const registrationSection = document.createElement('div');
    registrationSection.className = 'webauthn-registration-section';
    registrationSection.innerHTML = `
      <div class="divider">
        <span>Configuración Avanzada</span>
      </div>
      <button type="button" id="setupPasskeyBtn" class="btn btn-outline">
        🔐 Configurar Passkey/Biométrico
      </button>
    `;

    loginCard.appendChild(registrationSection);

    const setupBtn = registrationSection.querySelector('#setupPasskeyBtn');
    setupBtn.addEventListener('click', () => {
      this.showWebAuthnRegistration();
    });
  }

  /**
   * Show WebAuthn registration modal
   */
  async showWebAuthnRegistration() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div id="webauthnRegistrationContainer"></div>
      </div>
    `;

    document.body.appendChild(modal);

    const container = modal.querySelector('#webauthnRegistrationContainer');
    const registrationUI = AuthUI.createWebAuthnRegistration(async (username) => {
      await this.authManager.registerWebAuthn(username);
      modal.remove();
    });

    container.appendChild(registrationUI);

    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  /**
   * Get current page name
   * @returns {string} Page name
   */
  getCurrentPage() {
    const path = window.location.pathname;
    
    if (path === '/' || path.includes('index.html')) return 'index';
    if (path.includes('login.html')) return 'login';
    if (path.includes('projects.html')) return 'projects';
    if (path.includes('dashboard.html')) return 'dashboard';
    if (path.includes('wiki.html')) return 'wiki';
    if (path.includes('links.html')) return 'links';
    
    return 'unknown';
  }

  /**
   * Handle initialization error
   * @param {Error} error - Error object
   */
  handleInitError(error) {
    console.error('Initialization error:', error);
    
    // Show error message to user
    const errorDiv = document.createElement('div');
    errorDiv.className = 'init-error';
    errorDiv.innerHTML = `
      <h3>⚠️ Error de Inicialización</h3>
      <p>No se pudo cargar la aplicación correctamente.</p>
      <p class="error-details">${error.message}</p>
      <button onclick="location.reload()" class="btn btn-primary">Reintentar</button>
    `;
    
    document.body.insertBefore(errorDiv, document.body.firstChild);
  }
}

// Create and initialize app when DOM is ready
const app = new App();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for debugging
window.app = app;
