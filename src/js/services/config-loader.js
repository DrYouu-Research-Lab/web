/**
 * Configuration Loader Service
 * 
 * This service handles loading and caching of configuration files.
 * It provides a centralized way to access all configuration data.
 * 
 * Features:
 * - Loads JSON configuration files
 * - Caches configurations to avoid redundant requests
 * - Validates configuration structure
 * - Provides error handling
 */

class ConfigLoader {
  constructor() {
    this.cache = new Map();
    this.configBasePath = '/config';
  }

  /**
   * Load a configuration file
   * @param {string} configName - Name of the config file (without .json)
   * @returns {Promise<Object>} Configuration object
   */
  async load(configName) {
    // Check cache first
    if (this.cache.has(configName)) {
      return this.cache.get(configName);
    }

    try {
      const response = await fetch(`${this.configBasePath}/${configName}.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to load config: ${configName} (${response.status})`);
      }

      const config = await response.json();
      
      // Validate config
      this.validate(configName, config);
      
      // Cache the config
      this.cache.set(configName, config);
      
      return config;
    } catch (error) {
      console.error(`Error loading config ${configName}:`, error);
      throw error;
    }
  }

  /**
   * Load multiple configurations at once
   * @param {Array<string>} configNames - Array of config names
   * @returns {Promise<Object>} Object with all configs
   */
  async loadMultiple(configNames) {
    const configs = {};
    
    await Promise.all(
      configNames.map(async (name) => {
        configs[name] = await this.load(name);
      })
    );
    
    return configs;
  }

  /**
   * Reload a configuration (clear cache and load fresh)
   * @param {string} configName - Name of the config file
   * @returns {Promise<Object>} Configuration object
   */
  async reload(configName) {
    this.cache.delete(configName);
    return this.load(configName);
  }

  /**
   * Clear all cached configurations
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Basic validation of configuration structure
   * @param {string} configName - Name of the config
   * @param {Object} config - Configuration object
   */
  validate(configName, config) {
    if (!config || typeof config !== 'object') {
      throw new Error(`Invalid config format for ${configName}`);
    }

    // Specific validations per config type
    switch (configName) {
      case 'site':
        this.validateSiteConfig(config);
        break;
      case 'auth':
        this.validateAuthConfig(config);
        break;
      case 'projects':
        this.validateProjectsConfig(config);
        break;
      case 'wiki':
        this.validateWikiConfig(config);
        break;
      case 'private-links':
        this.validateLinksConfig(config);
        break;
    }
  }

  /**
   * Validate site configuration
   */
  validateSiteConfig(config) {
    if (!config.site || !config.site.name) {
      throw new Error('Site config must have site.name');
    }
    if (!config.navigation) {
      throw new Error('Site config must have navigation');
    }
  }

  /**
   * Validate auth configuration
   */
  validateAuthConfig(config) {
    if (!config.authentication || !config.authentication.providers) {
      throw new Error('Auth config must have authentication.providers');
    }
  }

  /**
   * Validate projects configuration
   */
  validateProjectsConfig(config) {
    if (!Array.isArray(config.projects)) {
      throw new Error('Projects config must have projects array');
    }
  }

  /**
   * Validate wiki configuration
   */
  validateWikiConfig(config) {
    if (!config.wiki || !Array.isArray(config.wiki.articles)) {
      throw new Error('Wiki config must have wiki.articles array');
    }
  }

  /**
   * Validate links configuration
   */
  validateLinksConfig(config) {
    if (!Array.isArray(config.categories)) {
      throw new Error('Links config must have categories array');
    }
  }

  /**
   * Get a nested value from config object using dot notation
   * @param {Object} config - Configuration object
   * @param {string} path - Dot notation path (e.g., 'site.name')
   * @param {*} defaultValue - Default value if path not found
   * @returns {*} Value at path or default value
   */
  get(config, path, defaultValue = null) {
    const keys = path.split('.');
    let value = config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  /**
   * Merge multiple configs into one object
   * @param {Array<Object>} configs - Array of config objects
   * @returns {Object} Merged configuration
   */
  merge(...configs) {
    return Object.assign({}, ...configs);
  }
}

// Create singleton instance
const configLoader = new ConfigLoader();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConfigLoader;
}
