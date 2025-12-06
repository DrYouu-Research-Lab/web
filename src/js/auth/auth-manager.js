/**
 * Unified Authentication Manager
 * 
 * Coordinates all authentication methods:
 * - Local (username/password)
 * - WebAuthn/Passkey (biometric)
 * - OAuth2 (Google, GitHub, Apple)
 * 
 * Provides a single interface for authentication operations
 */

class AuthManager {
  constructor() {
    this.config = null;
    this.webauthn = null;
    this.oauth2 = null;
    this.sessionKey = 'dryouu_session';
    this.rateLimiter = new Map();
  }

  /**
   * Initialize authentication system
   * @param {Object} authConfig - Authentication configuration
   */
  async init(authConfig) {
    this.config = authConfig.authentication;
    
    // Update session key from config
    if (this.config.providers.local?.config?.sessionKey) {
      this.sessionKey = this.config.providers.local.config.sessionKey;
    }

    // Initialize WebAuthn if enabled
    if (this.config.providers.webauthn?.enabled) {
      this.webauthn = new WebAuthnAuth();
      await this.webauthn.init(this.config.providers.webauthn.config);
    }

    // Initialize OAuth2 if any provider is enabled
    const hasOAuthProvider = Object.values(this.config.providers).some(
      p => p.type === 'oauth2' && p.enabled
    );
    
    if (hasOAuthProvider) {
      this.oauth2 = new OAuth2Auth();
      await this.oauth2.init(this.config);
    }

    // Setup rate limiting
    this.setupRateLimiting();
  }

  /**
   * Get available authentication methods
   * @returns {Array} Array of available auth methods
   */
  getAvailableMethods() {
    const methods = [];

    // Local authentication
    if (this.config.providers.local?.enabled) {
      methods.push({
        id: 'local',
        name: 'Username & Password',
        type: 'local',
        icon: '🔑'
      });
    }

    // WebAuthn/Passkey
    if (this.config.providers.webauthn?.enabled && this.webauthn?.isSupported()) {
      methods.push({
        id: 'webauthn',
        name: this.config.providers.webauthn.name,
        type: 'webauthn',
        icon: this.config.providers.webauthn.icon
      });
    }

    // OAuth2 providers
    if (this.oauth2) {
      this.oauth2.getProviders().forEach(provider => {
        methods.push({
          id: provider.id,
          name: provider.name,
          type: 'oauth2',
          icon: provider.icon
        });
      });
    }

    return methods;
  }

  /**
   * Authenticate using specified method
   * @param {string} method - Authentication method
   * @param {Object} credentials - Credentials (for local auth)
   * @returns {Promise<Object>} Authentication result
   */
  async authenticate(method, credentials = null) {
    // Check rate limit
    if (!this.checkRateLimit(method)) {
      throw new Error('Too many attempts. Please try again later.');
    }

    try {
      let result;

      switch (method) {
        case 'local':
          result = await this.authenticateLocal(credentials);
          break;
        
        case 'webauthn':
          result = await this.authenticateWebAuthn();
          break;
        
        default:
          // OAuth2 provider
          result = await this.authenticateOAuth2(method);
          break;
      }

      // Reset rate limit on success
      this.resetRateLimit(method);

      // Create session
      if (result.success) {
        this.createSession(result.user || { username: credentials?.username });
      }

      return result;
    } catch (error) {
      // Increment rate limit counter
      this.incrementRateLimit(method);
      throw error;
    }
  }

  /**
   * Local authentication (username/password)
   * @param {Object} credentials - Username and password
   * @returns {Promise<Object>} Authentication result
   */
  async authenticateLocal(credentials) {
    if (!credentials || !credentials.username || !credentials.password) {
      throw new Error('Username and password required');
    }

    // In production, this would verify against a backend
    // For demo, check against config
    const demoCredentials = this.config.demo?.credentials;
    
    if (demoCredentials && 
        credentials.username === demoCredentials.username &&
        credentials.password === demoCredentials.password) {
      
      return {
        success: true,
        method: 'local',
        user: {
          username: credentials.username,
          displayName: credentials.username
        }
      };
    }

    throw new Error('Invalid username or password');
  }

  /**
   * WebAuthn authentication
   * @returns {Promise<Object>} Authentication result
   */
  async authenticateWebAuthn() {
    if (!this.webauthn) {
      throw new Error('WebAuthn is not available');
    }

    const result = await this.webauthn.authenticate();
    
    return {
      success: result.success,
      method: 'webauthn',
      user: {
        username: result.username,
        displayName: result.username
      }
    };
  }

  /**
   * OAuth2 authentication
   * @param {string} provider - Provider name
   * @returns {Promise<Object>} Authentication result
   */
  async authenticateOAuth2(provider) {
    if (!this.oauth2) {
      throw new Error('OAuth2 is not available');
    }

    // This will redirect to the provider
    await this.oauth2.authenticate(provider);
    
    // This line won't be reached due to redirect
    return { success: false };
  }

  /**
   * Register WebAuthn credential
   * @param {string} username - Username
   * @returns {Promise<Object>} Registration result
   */
  async registerWebAuthn(username) {
    if (!this.webauthn) {
      throw new Error('WebAuthn is not available');
    }

    const credential = await this.webauthn.register(username);
    
    return {
      success: true,
      credential: credential
    };
  }

  /**
   * Check if WebAuthn is available
   * @returns {boolean} True if available
   */
  async isWebAuthnAvailable() {
    if (!this.webauthn) return false;
    return await this.webauthn.isPlatformAuthenticatorAvailable();
  }

  /**
   * Create user session
   * @param {Object} user - User data
   */
  createSession(user) {
    const sessionData = {
      user: user,
      loginTime: Date.now(),
      expiry: Date.now() + (this.config.providers.local?.config?.tokenExpiry || 86400000)
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
  }

  /**
   * Check if session is valid
   * @returns {boolean} True if session is valid
   */
  checkSession() {
    const session = localStorage.getItem(this.sessionKey);
    
    if (!session) return false;

    try {
      const sessionData = JSON.parse(session);
      const now = Date.now();

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
  }

  /**
   * Get current session
   * @returns {Object|null} Session data or null
   */
  getSession() {
    const session = localStorage.getItem(this.sessionKey);
    if (!session) return null;

    try {
      return JSON.parse(session);
    } catch (error) {
      return null;
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem(this.sessionKey);
    window.location.href = '/index.html';
  }

  /**
   * Setup rate limiting
   */
  setupRateLimiting() {
    if (!this.config.security?.rateLimit?.enabled) return;

    this.maxAttempts = this.config.security.rateLimit.maxAttempts || 5;
    this.windowMs = this.config.security.rateLimit.windowMs || 900000; // 15 min
  }

  /**
   * Check rate limit
   * @param {string} method - Auth method
   * @returns {boolean} True if allowed
   */
  checkRateLimit(method) {
    if (!this.config.security?.rateLimit?.enabled) return true;

    const key = `ratelimit_${method}`;
    const attempts = this.rateLimiter.get(key) || { count: 0, timestamp: Date.now() };

    // Reset if window expired
    if (Date.now() - attempts.timestamp > this.windowMs) {
      this.rateLimiter.delete(key);
      return true;
    }

    return attempts.count < this.maxAttempts;
  }

  /**
   * Increment rate limit counter
   * @param {string} method - Auth method
   */
  incrementRateLimit(method) {
    if (!this.config.security?.rateLimit?.enabled) return;

    const key = `ratelimit_${method}`;
    const attempts = this.rateLimiter.get(key) || { count: 0, timestamp: Date.now() };
    
    attempts.count++;
    this.rateLimiter.set(key, attempts);
  }

  /**
   * Reset rate limit for method
   * @param {string} method - Auth method
   */
  resetRateLimit(method) {
    const key = `ratelimit_${method}`;
    this.rateLimiter.delete(key);
  }

  /**
   * Protect a page - redirect if not authenticated
   */
  protectPage() {
    if (!this.checkSession()) {
      window.location.href = '/public/login.html';
    }
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthManager;
}
