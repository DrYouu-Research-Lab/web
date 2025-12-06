/**
 * WebAuthn / Passkey Authentication Module
 * 
 * Implements FIDO2/WebAuthn authentication for passwordless login
 * Supports biometric authentication (fingerprint, Face ID, Windows Hello)
 * 
 * Security Features:
 * - Public key cryptography
 * - Phishing resistant
 * - No passwords to steal
 * - Hardware-backed security
 * 
 * IMPORTANT: This is a client-side demo implementation.
 * For production, you MUST implement a proper backend server.
 */

class WebAuthnAuth {
  constructor() {
    this.rpName = 'DrYouu Research Lab';
    this.rpId = window.location.hostname;
    this.config = null;
  }

  /**
   * Initialize WebAuthn with configuration
   * @param {Object} config - WebAuthn configuration
   */
  async init(config) {
    this.config = config;
    
    if (config.rpName) this.rpName = config.rpName;
    if (config.rpId) this.rpId = config.rpId;

    // Check if WebAuthn is supported
    if (!this.isSupported()) {
      console.warn('WebAuthn is not supported in this browser');
      return false;
    }

    return true;
  }

  /**
   * Check if WebAuthn is supported by the browser
   * @returns {boolean} True if supported
   */
  isSupported() {
    return !!(
      window.PublicKeyCredential &&
      navigator.credentials &&
      navigator.credentials.create &&
      navigator.credentials.get
    );
  }

  /**
   * Check if platform authenticator is available (biometrics)
   * @returns {Promise<boolean>} True if available
   */
  async isPlatformAuthenticatorAvailable() {
    if (!this.isSupported()) return false;

    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (error) {
      console.error('Error checking platform authenticator:', error);
      return false;
    }
  }

  /**
   * Register a new credential (passkey)
   * @param {string} username - Username
   * @returns {Promise<Object>} Credential data
   */
  async register(username) {
    if (!this.isSupported()) {
      throw new Error('WebAuthn is not supported');
    }

    try {
      // Generate a challenge (in production, this comes from server)
      const challenge = this.generateChallenge();
      
      // Generate user ID
      const userId = this.generateUserId(username);

      // Create credential options
      const publicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: {
          name: this.rpName,
          id: this.rpId
        },
        user: {
          id: userId,
          name: username,
          displayName: username
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },   // ES256
          { alg: -257, type: 'public-key' }  // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: this.config?.authenticatorAttachment || 'platform',
          requireResidentKey: this.config?.requireResidentKey || false,
          userVerification: this.config?.userVerification || 'preferred'
        },
        timeout: this.config?.timeout || 60000,
        attestation: this.config?.attestation || 'none'
      };

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      // Store credential info (in production, send to server)
      const credentialData = {
        id: credential.id,
        rawId: this.arrayBufferToBase64(credential.rawId),
        type: credential.type,
        response: {
          clientDataJSON: this.arrayBufferToBase64(credential.response.clientDataJSON),
          attestationObject: this.arrayBufferToBase64(credential.response.attestationObject)
        }
      };

      // Store in localStorage (DEMO ONLY - use server in production)
      this.storeCredential(username, credentialData);

      return credentialData;
    } catch (error) {
      console.error('WebAuthn registration error:', error);
      throw error;
    }
  }

  /**
   * Authenticate using existing credential (passkey)
   * @returns {Promise<Object>} Authentication result
   */
  async authenticate() {
    if (!this.isSupported()) {
      throw new Error('WebAuthn is not supported');
    }

    try {
      // Get stored credentials (in production, get from server)
      const storedCredentials = this.getStoredCredentials();
      
      if (storedCredentials.length === 0) {
        throw new Error('No credentials registered. Please register first.');
      }

      // Generate challenge (in production, from server)
      const challenge = this.generateChallenge();

      // Create authentication options
      const publicKeyCredentialRequestOptions = {
        challenge: challenge,
        rpId: this.rpId,
        allowCredentials: storedCredentials.map(cred => ({
          id: this.base64ToArrayBuffer(cred.rawId),
          type: 'public-key',
          transports: ['internal', 'usb', 'nfc', 'ble']
        })),
        timeout: this.config?.timeout || 60000,
        userVerification: this.config?.userVerification || 'preferred'
      };

      // Get assertion (authenticate)
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      // Verify assertion (in production, send to server for verification)
      const result = {
        id: assertion.id,
        rawId: this.arrayBufferToBase64(assertion.rawId),
        type: assertion.type,
        response: {
          authenticatorData: this.arrayBufferToBase64(assertion.response.authenticatorData),
          clientDataJSON: this.arrayBufferToBase64(assertion.response.clientDataJSON),
          signature: this.arrayBufferToBase64(assertion.response.signature),
          userHandle: assertion.response.userHandle ? 
            this.arrayBufferToBase64(assertion.response.userHandle) : null
        }
      };

      // Find matching credential
      const matchedCredential = storedCredentials.find(
        cred => cred.id === assertion.id
      );

      return {
        success: true,
        credential: result,
        username: matchedCredential?.username || 'unknown'
      };
    } catch (error) {
      console.error('WebAuthn authentication error:', error);
      throw error;
    }
  }

  /**
   * Generate a random challenge
   * @returns {Uint8Array} Challenge bytes
   */
  generateChallenge() {
    return crypto.getRandomValues(new Uint8Array(32));
  }

  /**
   * Generate user ID from username
   * @param {string} username - Username
   * @returns {Uint8Array} User ID bytes
   */
  generateUserId(username) {
    const encoder = new TextEncoder();
    return encoder.encode(username);
  }

  /**
   * Convert ArrayBuffer to Base64
   * @param {ArrayBuffer} buffer - Array buffer
   * @returns {string} Base64 string
   */
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert Base64 to ArrayBuffer
   * @param {string} base64 - Base64 string
   * @returns {ArrayBuffer} Array buffer
   */
  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Store credential locally (DEMO ONLY)
   * @param {string} username - Username
   * @param {Object} credential - Credential data
   */
  storeCredential(username, credential) {
    const key = 'webauthn_credentials';
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    
    stored.push({
      username,
      ...credential,
      createdAt: Date.now()
    });
    
    localStorage.setItem(key, JSON.stringify(stored));
  }

  /**
   * Get stored credentials (DEMO ONLY)
   * @returns {Array} Array of credentials
   */
  getStoredCredentials() {
    const key = 'webauthn_credentials';
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  /**
   * Delete all stored credentials
   */
  clearCredentials() {
    localStorage.removeItem('webauthn_credentials');
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebAuthnAuth;
}
