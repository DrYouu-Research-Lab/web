/**
 * Content Renderer
 * 
 * Renders dynamic content from configuration files
 * Handles navigation, projects, wiki articles, etc.
 */

class ContentRenderer {
  /**
   * Render navigation menu
   * @param {Object} navConfig - Navigation configuration
   * @param {HTMLElement} container - Container element
   * @param {string} type - Navigation type (public/private)
   */
  static renderNavigation(navConfig, container, type = 'public') {
    if (!container || !navConfig) return;

    const navItems = navConfig[type] || [];
    container.innerHTML = '';

    navItems.forEach(item => {
      const link = document.createElement('a');
      link.href = item.url;
      link.className = 'nav-link';
      link.textContent = item.label;
      
      // Highlight active link
      if (window.location.pathname.includes(item.url)) {
        link.classList.add('active');
      }

      const li = document.createElement('li');
      li.appendChild(link);
      container.appendChild(li);
    });
  }

  /**
   * Render hero section
   * @param {Object} heroConfig - Hero configuration
   * @param {HTMLElement} container - Container element
   */
  static renderHero(heroConfig, container) {
    if (!container || !heroConfig) return;

    container.innerHTML = `
      <div class="hero-content">
        <h2 class="hero-subtitle">${heroConfig.subtitle}</h2>
        <h1 class="hero-title">${heroConfig.title}</h1>
        <p class="hero-description">${heroConfig.description}</p>
        
        <div class="hero-buttons">
          ${heroConfig.cta.map(button => `
            <a href="${button.url}" class="btn btn-${button.style}">${button.label}</a>
          `).join('')}
        </div>
        
        ${heroConfig.status.show ? `
          <div class="status-badge">
            <span class="status-dot"></span>
            <span>${heroConfig.status.text}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Render features section
   * @param {Array} features - Features array
   * @param {HTMLElement} container - Container element
   */
  static renderFeatures(features, container) {
    if (!container || !features) return;

    container.innerHTML = features.map(feature => `
      <div class="card">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">${feature.icon}</div>
        <h3 class="card-header">${feature.title}</h3>
        <p class="card-body">${feature.description}</p>
      </div>
    `).join('');
  }

  /**
   * Render projects grid
   * @param {Array} projects - Projects array
   * @param {HTMLElement} container - Container element
   * @param {boolean} featuredOnly - Show only featured projects
   */
  static renderProjects(projects, container, featuredOnly = false) {
    if (!container || !projects) return;

    const filteredProjects = featuredOnly 
      ? projects.filter(p => p.featured)
      : projects;

    container.innerHTML = filteredProjects.map(project => `
      <div class="project-card" data-category="${project.category}">
        <div class="project-image">
          ${project.image ? 
            `<img src="${project.image}" alt="${project.title}" onerror="this.src='/assets/images/placeholder.jpg'">` :
            `<div class="project-placeholder">${project.technologies[0] || '💼'}</div>`
          }
        </div>
        <div class="project-content">
          <div class="project-header">
            <h3 class="project-title">${project.title}</h3>
            <span class="project-status status-${project.status}">${project.status}</span>
          </div>
          <p class="project-description">${project.shortDescription}</p>
          <div class="project-technologies">
            ${project.technologies.slice(0, 4).map(tech => 
              `<span class="tech-badge">${tech}</span>`
            ).join('')}
            ${project.technologies.length > 4 ? 
              `<span class="tech-badge">+${project.technologies.length - 4}</span>` : ''
            }
          </div>
          ${project.links && project.links.length > 0 ? `
            <div class="project-links">
              ${project.links.map(link => 
                `<a href="${link.url}" class="btn btn-sm btn-secondary" target="_blank">${link.label}</a>`
              ).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  /**
   * Render wiki sidebar
   * @param {Object} wikiConfig - Wiki configuration
   * @param {HTMLElement} container - Container element
   * @param {Function} onArticleSelect - Article select callback
   */
  static renderWikiSidebar(wikiConfig, container, onArticleSelect) {
    if (!container || !wikiConfig) return;

    const categories = wikiConfig.categories;
    const articles = wikiConfig.articles;

    container.innerHTML = '';

    categories.forEach(category => {
      const categoryArticles = articles.filter(a => a.category === category.id);
      
      if (categoryArticles.length === 0) return;

      const section = document.createElement('div');
      section.className = 'wiki-category';
      
      const header = document.createElement('div');
      header.className = 'wiki-category-header';
      header.innerHTML = `<span>${category.icon}</span> ${category.name}`;
      section.appendChild(header);

      const articlesList = document.createElement('ul');
      articlesList.className = 'wiki-articles-list';

      categoryArticles.forEach(article => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = article.title;
        link.className = 'wiki-article-link';
        link.dataset.articleId = article.id;
        
        if (article.featured) {
          const star = document.createElement('span');
          star.className = 'featured-star';
          star.textContent = '⭐';
          link.appendChild(star);
        }

        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Remove active class from all links
          container.querySelectorAll('.wiki-article-link').forEach(l => 
            l.classList.remove('active')
          );
          
          // Add active class to clicked link
          link.classList.add('active');
          
          onArticleSelect(article);
        });

        li.appendChild(link);
        articlesList.appendChild(li);
      });

      section.appendChild(articlesList);
      container.appendChild(section);
    });
  }

  /**
   * Render wiki article content
   * @param {Object} article - Article object
   * @param {HTMLElement} container - Container element
   */
  static renderWikiArticle(article, container) {
    if (!container || !article) return;

    // Convert markdown to HTML (basic implementation)
    const htmlContent = this.markdownToHtml(article.content);

    container.innerHTML = `
      <article class="wiki-article">
        <header class="wiki-article-header">
          <h1>${article.title}</h1>
          <div class="wiki-article-meta">
            <span>📝 ${article.author}</span>
            <span>📅 ${new Date(article.updated).toLocaleDateString('es-ES')}</span>
          </div>
          <div class="wiki-article-tags">
            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </header>
        <div class="wiki-article-content">
          ${htmlContent}
        </div>
      </article>
    `;
  }

  /**
   * Render private links
   * @param {Array} categories - Links categories
   * @param {HTMLElement} container - Container element
   */
  static renderPrivateLinks(categories, container) {
    if (!container || !categories) return;

    container.innerHTML = '';

    categories.forEach(category => {
      const section = document.createElement('div');
      section.className = 'links-category';
      
      section.innerHTML = `
        <h3 class="links-category-title">
          <span>${category.icon}</span> ${category.name}
        </h3>
        <div class="links-grid">
          ${category.links.map(link => `
            <a href="${link.url}" 
               class="link-card" 
               ${link.newTab ? 'target="_blank" rel="noopener noreferrer"' : ''}
               style="border-left: 4px solid ${link.color}">
              <div class="link-icon" style="background: ${link.color}20;">
                ${link.icon}
              </div>
              <div class="link-content">
                <h4 class="link-title">${link.title}</h4>
                <p class="link-description">${link.description}</p>
                ${link.requiresVPN ? '<span class="vpn-badge">🔒 VPN Required</span>' : ''}
              </div>
            </a>
          `).join('')}
        </div>
      `;

      container.appendChild(section);
    });
  }

  /**
   * Basic markdown to HTML converter
   * @param {string} markdown - Markdown text
   * @returns {string} HTML string
   */
  static markdownToHtml(markdown) {
    if (!markdown) return '';

    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>');

    // Line breaks
    html = html.replace(/\n/gim, '<br>');

    return html;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentRenderer;
}
