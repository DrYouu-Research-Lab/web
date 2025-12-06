/**
 * UI Components for Authentication
 * 
 * Provides reusable UI components for authentication
 */

class AuthUI {
  /**
   * Render authentication methods on login page
   * @param {HTMLElement} container - Container element
   * @param {Array} methods - Available auth methods
   * @param {Function} onSelect - Callback when method is selected
   */
  static renderAuthMethods(container, methods, onSelect) {
    if (!container) return;

    container.innerHTML = '';

    // Add local auth form if available
    const localMethod = methods.find(m => m.type === 'local');
    if (localMethod) {
      const localForm = this.createLocalAuthForm(onSelect);
      container.appendChild(localForm);
    }

    // Add divider if there are other methods
    const otherMethods = methods.filter(m => m.type !== 'local');
    if (localMethod && otherMethods.length > 0) {
      const divider = this.createDivider('O continuar con');
      container.appendChild(divider);
    }

    // Add other authentication methods
    const methodsContainer = document.createElement('div');
    methodsContainer.className = 'auth-methods-grid';
    
    otherMethods.forEach(method => {
      const button = this.createAuthMethodButton(method, onSelect);
      methodsContainer.appendChild(button);
    });

    container.appendChild(methodsContainer);
  }

  /**
   * Create local authentication form
   * @param {Function} onSubmit - Submit callback
   * @returns {HTMLElement} Form element
   */
  static createLocalAuthForm(onSubmit) {
    const form = document.createElement('form');
    form.id = 'loginForm';
    form.className = 'auth-form';
    
    form.innerHTML = `
      <div class="form-group">
        <label for="username" class="form-label">Usuario</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          class="form-input" 
          required 
          autocomplete="username"
          placeholder="Ingresa tu usuario"
        >
      </div>
      
      <div class="form-group">
        <label for="password" class="form-label">Contraseña</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          class="form-input" 
          required 
          autocomplete="current-password"
          placeholder="Ingresa tu contraseña"
        >
      </div>
      
      <div class="form-group form-options">
        <label class="checkbox-label">
          <input type="checkbox" id="rememberMe" name="rememberMe">
          <span>Recordarme</span>
        </label>
        <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
      </div>
      
      <div id="loginError" class="error-message hidden"></div>
      
      <button type="submit" class="btn btn-primary btn-block">
        Iniciar Sesión
      </button>
      
      <div class="demo-notice">
        <strong>Demo:</strong> Usuario: admin | Contraseña: DrYouu2024!
      </div>
    `;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = form.querySelector('#username').value;
      const password = form.querySelector('#password').value;
      
      await onSubmit('local', { username, password });
    });

    return form;
  }

  /**
   * Create authentication method button
   * @param {Object} method - Auth method configuration
   * @param {Function} onClick - Click callback
   * @returns {HTMLElement} Button element
   */
  static createAuthMethodButton(method, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `btn-auth-method btn-auth-${method.id}`;
    button.setAttribute('data-method', method.id);
    
    button.innerHTML = `
      <span class="auth-icon">${method.icon}</span>
      <span class="auth-label">${method.name}</span>
    `;

    button.addEventListener('click', () => onClick(method.id));

    return button;
  }

  /**
   * Create divider with text
   * @param {string} text - Divider text
   * @returns {HTMLElement} Divider element
   */
  static createDivider(text) {
    const divider = document.createElement('div');
    divider.className = 'auth-divider';
    divider.innerHTML = `<span>${text}</span>`;
    return divider;
  }

  /**
   * Show error message
   * @param {string} message - Error message
   * @param {HTMLElement} container - Container element
   */
  static showError(message, container = null) {
    const errorDiv = container || document.getElementById('loginError');
    if (!errorDiv) return;

    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');

    setTimeout(() => {
      errorDiv.classList.add('hidden');
    }, 5000);
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  static showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }

  /**
   * Show loading state
   * @param {HTMLElement} button - Button element
   * @param {boolean} loading - Loading state
   */
  static setLoading(button, loading) {
    if (!button) return;

    if (loading) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.innerHTML = '<span class="spinner"></span> Procesando...';
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || 'Iniciar Sesión';
    }
  }

  /**
   * Create WebAuthn registration UI
   * @param {Function} onRegister - Register callback
   * @returns {HTMLElement} Registration UI
   */
  static createWebAuthnRegistration(onRegister) {
    const container = document.createElement('div');
    container.className = 'webauthn-registration';
    
    container.innerHTML = `
      <h3>🔐 Configurar Passkey</h3>
      <p>Configura la autenticación biométrica para un acceso más rápido y seguro.</p>
      
      <div class="form-group">
        <label for="webauthn-username" class="form-label">Usuario</label>
        <input 
          type="text" 
          id="webauthn-username" 
          class="form-input" 
          placeholder="Tu nombre de usuario"
        >
      </div>
      
      <button type="button" id="register-webauthn" class="btn btn-primary">
        Registrar Passkey
      </button>
      
      <div class="info-box">
        <strong>¿Qué es un Passkey?</strong>
        <p>Un Passkey permite iniciar sesión usando tu huella dactilar, reconocimiento facial o PIN del dispositivo.</p>
      </div>
    `;

    const registerBtn = container.querySelector('#register-webauthn');
    const usernameInput = container.querySelector('#webauthn-username');

    registerBtn.addEventListener('click', async () => {
      const username = usernameInput.value.trim();
      
      if (!username) {
        AuthUI.showError('Por favor ingresa un nombre de usuario', container);
        return;
      }

      this.setLoading(registerBtn, true);
      
      try {
        await onRegister(username);
        this.showSuccess('Passkey registrado correctamente');
      } catch (error) {
        this.showError(error.message, container);
      } finally {
        this.setLoading(registerBtn, false);
      }
    });

    return container;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthUI;
}
