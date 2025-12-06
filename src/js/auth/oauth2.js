/**
 * OAuth2 Authentication Module
 * 
 * Handles OAuth2 authentication with third-party providers
 * Supports: Google, GitHub, Apple, and other OAuth2 providers
 * 
 * IMPORTANT: This is a client-side implementation.
 * For production, you MUST implement a proper backend server
 * to handle token exchange and store client secrets securely.
 */

class OAuth2Auth {
  constructor() {
    this.providers = new Map();
    this.currentProvider = null;
    this.callbackUrl = window.location.origin + '/auth/callback';
  }

  /**
   * Initialize OAuth2 with configuration
   * @param {Object} config - OAuth2 providers configuration
   */
  async init(config) {
    if (!config || !config.providers) {
      throw new Error('OAuth2 config must have providers');
    }

    // Register all enabled providers
    Object.entries(config.providers).forEach(([key, provider]) => {
      if (provider.enabled && provider.type === 'oauth2') {
        this.registerProvider(key, provider);
      }
    });
  }

  /**
   * Register an OAuth2 provider
   * @param {string} name - Provider name
   * @param {Object} config - Provider configuration
   */
  registerProvider(name, config) {
    this.providers.set(name, {
      name: config.name || name,
      clientId: config.config.clientId,
      authUrl: config.config.authUrl,
      tokenUrl: config.config.tokenUrl,
      scope: config.config.scope,
      redirectUri: config.config.redirectUri || this.callbackUrl,
      responseMode: config.config.responseMode,
      icon: config.icon
    });
  }

  /**
   * Get list of available providers
   * @returns {Array} Array of provider objects
   */
  getProviders() {
    return Array.from(this.providers.entries()).map(([key, config]) => ({
      id: key,
      name: config.name,
      icon: config.icon
    }));
  }

  /**
   * Start OAuth2 authentication flow
   * @param {string} providerName - Name of the provider (google, github, apple)
   */
  async authenticate(providerName) {
    const provider = this.providers.get(providerName);
    
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    this.currentProvider = providerName;

    // Generate state for CSRF protection
    const state = this.generateState();
    this.storeState(state);

    // Generate PKCE challenge (for enhanced security)
    const { codeVerifier, codeChallenge } = await this.generatePKCE();
    this.storeCodeVerifier(codeVerifier);

    // Build authorization URL
    const authUrl = this.buildAuthUrl(provider, state, codeChallenge);

    // Store provider info
    localStorage.setItem('oauth2_provider', providerName);

    // Redirect to provider's authorization page
    window.location.href = authUrl;
  }

  /**
   * Build authorization URL
   * @param {Object} provider - Provider configuration
   * @param {string} state - CSRF state
   * @param {string} codeChallenge - PKCE challenge
   * @returns {string} Authorization URL
   */
  buildAuthUrl(provider, state, codeChallenge) {
    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      response_type: 'code',
      scope: provider.scope,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    // Add response_mode for Apple
    if (provider.responseMode) {
      params.append('response_mode', provider.responseMode);
    }

    return `${provider.authUrl}?${params.toString()}`;
  }

  /**
   * Handle OAuth2 callback
   * This should be called on the callback page
   * @returns {Promise<Object>} Authentication result
   */
  async handleCallback() {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    // Check for errors
    if (error) {
      throw new Error(`OAuth2 error: ${error} - ${params.get('error_description')}`);
    }

    // Verify state (CSRF protection)
    const storedState = this.getStoredState();
    if (state !== storedState) {
      throw new Error('Invalid state parameter - possible CSRF attack');
    }

    // Get provider
    const providerName = localStorage.getItem('oauth2_provider');
    const provider = this.providers.get(providerName);

    if (!provider) {
      throw new Error('Provider not found');
    }

    // Exchange code for token
    // IMPORTANT: In production, this MUST be done on the server
    // to keep the client secret secure
    const tokenData = await this.exchangeCodeForToken(provider, code);

    // Get user info
    const userInfo = await this.getUserInfo(providerName, tokenData.access_token);

    // Clean up
    this.clearStoredState();
    this.clearCodeVerifier();
    localStorage.removeItem('oauth2_provider');

    return {
      success: true,
      provider: providerName,
      user: userInfo,
      tokens: tokenData
    };
  }

  /**
   * Exchange authorization code for access token
   * WARNING: This should be done on the server in production
   * @param {Object} provider - Provider configuration
   * @param {string} code - Authorization code
   * @returns {Promise<Object>} Token data
   */
  async exchangeCodeForToken(provider, code) {
    // DEMO IMPLEMENTATION ONLY
    // In production, make this request from your backend server
    
    console.warn('⚠️ Token exchange should be done on the server in production!');
    
    // For demo purposes, we'll simulate a successful token exchange
    // In a real implementation, you would:
    // 1. Send the code to your backend server
    // 2. Server exchanges code for token with provider
    // 3. Server returns token to client
    
    return {
      access_token: 'demo_access_token_' + Date.now(),
      token_type: 'Bearer',
      expires_in: 3600,
      scope: provider.scope
    };
  }

  /**
   * Get user information from provider
   * @param {string} providerName - Provider name
   * @param {string} accessToken - Access token
   * @returns {Promise<Object>} User information
   */
  async getUserInfo(providerName, accessToken) {
    // Demo implementation
    // In production, this would make actual API calls to the provider
    
    const userInfoUrls = {
      google: 'https://www.googleapis.com/oauth2/v2/userinfo',
      github: 'https://api.github.com/user',
      apple: 'https://appleid.apple.com/auth/userinfo'
    };

    // For demo, return mock user data
    return {
      id: 'demo_user_id',
      email: 'user@example.com',
      name: 'Demo User',
      provider: providerName,
      verified: true
    };
  }

  /**
   * Generate random state for CSRF protection
   * @returns {string} Random state string
   */
  generateState() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate PKCE challenge
   * @returns {Promise<Object>} Code verifier and challenge
   */
  async generatePKCE() {
    // Generate code verifier
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const codeVerifier = Array.from(array, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');

    // Generate code challenge (SHA-256 hash of verifier)
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return { codeVerifier, codeChallenge };
  }

  /**
   * Store state in localStorage
   * @param {string} state - State string
   */
  storeState(state) {
    localStorage.setItem('oauth2_state', state);
  }

  /**
   * Get stored state
   * @returns {string} State string
   */
  getStoredState() {
    return localStorage.getItem('oauth2_state');
  }

  /**
   * Clear stored state
   */
  clearStoredState() {
    localStorage.removeItem('oauth2_state');
  }

  /**
   * Store code verifier
   * @param {string} verifier - Code verifier
   */
  storeCodeVerifier(verifier) {
    localStorage.setItem('oauth2_code_verifier', verifier);
  }

  /**
   * Clear code verifier
   */
  clearCodeVerifier() {
    localStorage.removeItem('oauth2_code_verifier');
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OAuth2Auth;
}
