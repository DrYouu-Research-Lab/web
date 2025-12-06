/**
 * DrYouu Professional Website - Main JavaScript
 * 
 * This file handles all client-side functionality including:
 * - Authentication and session management
 * - Navigation and routing
 * - Theme switching
 * - Interactive components
 * - Form handling
 * 
 * SECURITY NOTE: This is a client-side only implementation.
 * For production use, implement server-side authentication.
 */

// ===========================
// CONFIGURATION
// ===========================

const CONFIG = {
  // Authentication - CHANGE THESE VALUES FOR YOUR SECURITY
  // In production, use server-side authentication
  AUTH: {
    // Demo credentials - CHANGE THESE!
    username: 'admin',
    password: 'DrYouu2024!', // CHANGE THIS PASSWORD!
    sessionKey: 'dryouu_session',
    tokenExpiry: 24 * 60 * 60 * 1000 // 24 hours
  },
  
  // Pages configuration
  PAGES: {
    public: ['home', 'about', 'projects', 'contact'],
    private: ['dashboard', 'wiki', 'private-links']
  },
  
  // Theme configuration
  THEMES: {
    default: 'dark',
    available: ['dark', 'light']
  }
};

// ===========================
// AUTHENTICATION MODULE
// ===========================

const Auth = {
  /**
   * Initialize authentication system
   */
  init() {
    this.checkSession();
    this.setupLoginForm();
    this.setupLogoutButtons();
  },
  
  /**
   * Check if user has a valid session
   * @returns {boolean} True if session is valid
   */
  checkSession() {
    const session = localStorage.getItem(CONFIG.AUTH.sessionKey);
    
    if (!session) {
      return false;
    }
    
    try {
      const sessionData = JSON.parse(session);
      const now = Date.now();
      
      // Check if session is expired
      if (sessionData.expiry < now) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      this.logout();
      return false;
    }
  },
  
  /**
   * Login user with credentials
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {boolean} True if login successful
   */
  login(username, password) {
    // Simple client-side authentication
    // WARNING: This is NOT secure for production!
    // Implement server-side authentication for real applications
    
    if (username === CONFIG.AUTH.username && password === CONFIG.AUTH.password) {
      const sessionData = {
        username: username,
        loginTime: Date.now(),
        expiry: Date.now() + CONFIG.AUTH.tokenExpiry
      };
      
      localStorage.setItem(CONFIG.AUTH.sessionKey, JSON.stringify(sessionData));
      return true;
    }
    
    return false;
  },
  
  /**
   * Logout user and clear session
   */
  logout() {
    localStorage.removeItem(CONFIG.AUTH.sessionKey);
    window.location.href = '/index.html';
  },
  
  /**
   * Get current user session data
   * @returns {object|null} Session data or null
   */
  getSession() {
    const session = localStorage.getItem(CONFIG.AUTH.sessionKey);
    if (!session) return null;
    
    try {
      return JSON.parse(session);
    } catch (error) {
      return null;
    }
  },
  
  /**
   * Setup login form handler
   */
  setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const errorDiv = document.getElementById('loginError');
      
      if (this.login(username, password)) {
        // Successful login
        window.location.href = '/private/dashboard.html';
      } else {
        // Failed login
        errorDiv.textContent = 'Usuario o contraseña incorrectos';
        errorDiv.classList.remove('hidden');
        
        // Clear error after 3 seconds
        setTimeout(() => {
          errorDiv.classList.add('hidden');
        }, 3000);
      }
    });
  },
  
  /**
   * Setup logout buttons
   */
  setupLogoutButtons() {
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    });
  },
  
  /**
   * Protect a page - redirect to login if not authenticated
   */
  protectPage() {
    if (!this.checkSession()) {
      window.location.href = '/public/login.html';
    }
  }
};

// ===========================
// NAVIGATION MODULE
// ===========================

const Navigation = {
  /**
   * Initialize navigation
   */
  init() {
    this.setupMobileMenu();
    this.setupScrollEffect();
    this.highlightActiveLink();
    this.setupSmoothScroll();
  },
  
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
    
    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  },
  
  /**
   * Add scroll effect to navbar
   */
  setupScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  },
  
  /**
   * Highlight active navigation link
   */
  highlightActiveLink() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (currentPage.includes(href) || (currentPage === '/' && href === '/index.html')) {
        link.classList.add('active');
      }
    });
  },
  
  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }
};

// ===========================
// THEME MODULE
// ===========================

const Theme = {
  currentTheme: 'dark',
  
  /**
   * Initialize theme system
   */
  init() {
    this.loadTheme();
    this.setupThemeToggle();
  },
  
  /**
   * Load saved theme from localStorage
   */
  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || CONFIG.THEMES.default;
    this.applyTheme(savedTheme);
  },
  
  /**
   * Apply theme to page
   * @param {string} theme - Theme name
   */
  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },
  
  /**
   * Toggle between themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  },
  
  /**
   * Setup theme toggle button
   */
  setupThemeToggle() {
    const toggleButtons = document.querySelectorAll('.theme-toggle');
    
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.toggleTheme();
      });
    });
  }
};

// ===========================
// WIKI MODULE
// ===========================

const Wiki = {
  currentArticle: null,
  articles: {},
  
  /**
   * Initialize wiki functionality
   */
  init() {
    this.loadArticles();
    this.setupNavigation();
    this.loadArticle('getting-started');
  },
  
  /**
   * Load available wiki articles
   */
  loadArticles() {
    // In a real application, this would fetch from a backend
    // For now, we'll define articles inline
    this.articles = {
      'getting-started': {
        title: 'Primeros Pasos',
        content: `
          <h2>Bienvenido a la Wiki Privada</h2>
          <p>Esta es tu área de conocimiento personal donde puedes documentar todo lo que vayas aprendiendo.</p>
          
          <h3>Cómo usar esta wiki</h3>
          <p>Navega por las diferentes secciones usando el menú lateral. Cada artículo puede contener:</p>
          <ul>
            <li>Documentación técnica</li>
            <li>Notas personales</li>
            <li>Guías y tutoriales</li>
            <li>Referencias rápidas</li>
          </ul>
          
          <h3>Personalización</h3>
          <p>Para añadir nuevos artículos, edita el archivo <code>assets/js/main.js</code> y agrega entradas en el objeto <code>articles</code>.</p>
        `
      },
      'technical-docs': {
        title: 'Documentación Técnica',
        content: `
          <h2>Documentación Técnica</h2>
          <p>Aquí puedes documentar aspectos técnicos de tus proyectos.</p>
          
          <h3>Ejemplo: Configuración de Servidor</h3>
          <pre><code>sudo apt update
sudo apt install nginx
sudo systemctl start nginx</code></pre>
          
          <h3>Comandos útiles</h3>
          <p>Lista de comandos que usas frecuentemente:</p>
          <ul>
            <li><code>git status</code> - Ver estado del repositorio</li>
            <li><code>npm install</code> - Instalar dependencias</li>
            <li><code>docker-compose up</code> - Iniciar contenedores</li>
          </ul>
        `
      },
      'projects-notes': {
        title: 'Notas de Proyectos',
        content: `
          <h2>Notas de Proyectos</h2>
          <p>Documenta el progreso y las decisiones de tus proyectos aquí.</p>
          
          <h3>Proyecto Ejemplo</h3>
          <p><strong>Estado:</strong> En desarrollo</p>
          <p><strong>Tecnologías:</strong> Node.js, React, PostgreSQL</p>
          <p><strong>Descripción:</strong> Aplicación web para gestión de tareas.</p>
          
          <h3>Decisiones importantes</h3>
          <ul>
            <li>Decidimos usar PostgreSQL por sus capacidades relacionales</li>
            <li>Implementamos autenticación con JWT</li>
            <li>Usamos Docker para facilitar el despliegue</li>
          </ul>
        `
      },
      'learning-resources': {
        title: 'Recursos de Aprendizaje',
        content: `
          <h2>Recursos de Aprendizaje</h2>
          <p>Enlaces y recursos útiles para tu desarrollo profesional.</p>
          
          <h3>Tutoriales</h3>
          <ul>
            <li>JavaScript moderno - MDN Web Docs</li>
            <li>React documentation</li>
            <li>Node.js best practices</li>
          </ul>
          
          <h3>Libros recomendados</h3>
          <ul>
            <li>Clean Code - Robert C. Martin</li>
            <li>The Pragmatic Programmer</li>
            <li>Designing Data-Intensive Applications</li>
          </ul>
          
          <h3>Cursos online</h3>
          <p>Mantén un registro de los cursos que has completado o planeas hacer.</p>
        `
      }
    };
  },
  
  /**
   * Load and display an article
   * @param {string} articleId - Article identifier
   */
  loadArticle(articleId) {
    const article = this.articles[articleId];
    if (!article) return;
    
    this.currentArticle = articleId;
    
    const titleElement = document.getElementById('wikiArticleTitle');
    const contentElement = document.getElementById('wikiArticleContent');
    
    if (titleElement) titleElement.textContent = article.title;
    if (contentElement) contentElement.innerHTML = article.content;
    
    // Update active state in navigation
    document.querySelectorAll('.wiki-nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-article') === articleId) {
        link.classList.add('active');
      }
    });
  },
  
  /**
   * Setup wiki navigation
   */
  setupNavigation() {
    const navLinks = document.querySelectorAll('.wiki-nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const articleId = link.getAttribute('data-article');
        this.loadArticle(articleId);
      });
    });
  }
};

// ===========================
// FORM UTILITIES
// ===========================

const Forms = {
  /**
   * Sanitize input to prevent XSS
   * @param {string} input - User input
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },
  
  /**
   * Validate email format
   * @param {string} email - Email address
   * @returns {boolean} True if valid
   */
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  /**
   * Show form error message
   * @param {HTMLElement} element - Error message element
   * @param {string} message - Error message
   */
  showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('hidden');
  },
  
  /**
   * Hide form error message
   * @param {HTMLElement} element - Error message element
   */
  hideError(element) {
    if (!element) return;
    element.classList.add('hidden');
  }
};

// ===========================
// UTILITIES
// ===========================

const Utils = {
  /**
   * Format date to readable string
   * @param {Date} date - Date object
   * @returns {string} Formatted date
   */
  formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  },
  
  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info)
   */
  showNotification(message, type = 'info') {
    // Simple console notification
    // In production, implement a proper notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // You can add a toast notification system here
    alert(message);
  }
};

// ===========================
// INITIALIZATION
// ===========================

/**
 * Initialize all modules when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize authentication
  Auth.init();
  
  // Initialize navigation
  Navigation.init();
  
  // Initialize theme system
  Theme.init();
  
  // Initialize wiki if on wiki page
  if (document.getElementById('wikiArticleContent')) {
    Wiki.init();
  }
  
  // Add fade-in animation to main content
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('fade-in');
  }
  
  console.log('DrYouu Website initialized successfully');
});

// ===========================
// EXPORTS (for module usage)
// ===========================

// Make modules available globally
window.DrYouu = {
  Auth,
  Navigation,
  Theme,
  Wiki,
  Forms,
  Utils,
  CONFIG
};
