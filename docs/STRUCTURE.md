# 🏗️ Arquitectura y Estructura del Sitio

Esta documentación explica cómo está organizado el código y cómo funcionan las diferentes partes del sitio web.

## 📋 Índice

1. [Visión General](#visión-general)
2. [Estructura de Directorios](#estructura-de-directorios)
3. [Arquitectura del CSS](#arquitectura-del-css)
4. [Arquitectura del JavaScript](#arquitectura-del-javascript)
5. [Sistema de Navegación](#sistema-de-navegación)
6. [Sistema de Autenticación](#sistema-de-autenticación)
7. [Flujo de Datos](#flujo-de-datos)
8. [Componentes Reutilizables](#componentes-reutilizables)

## Visión General

### Tecnologías Base
- **HTML5**: Estructura semántica
- **CSS3**: Estilos y diseño responsive
- **JavaScript (ES6+)**: Interactividad y lógica

### Arquitectura General
```
┌─────────────────────────────────────┐
│         Frontend (Cliente)          │
├─────────────────────────────────────┤
│  HTML Pages                         │
│  ├── Public (index, about, etc.)    │
│  └── Private (dashboard, wiki)      │
├─────────────────────────────────────┤
│  CSS Styling                        │
│  └── Variables + Components         │
├─────────────────────────────────────┤
│  JavaScript Modules                 │
│  ├── Auth (login/logout)            │
│  ├── Navigation                     │
│  ├── Theme                          │
│  └── Wiki                           │
├─────────────────────────────────────┤
│  LocalStorage                       │
│  └── Session Management             │
└─────────────────────────────────────┘
```

### Principios de Diseño
1. **Simplicidad**: Sin frameworks, código vanilla
2. **Modularidad**: Código organizado en módulos
3. **Reutilización**: Componentes CSS reutilizables
4. **Accesibilidad**: Semántica HTML y ARIA labels
5. **Responsividad**: Mobile-first design
6. **Seguridad**: Headers y sanitización

## Estructura de Directorios

```
web/
├── index.html              # Landing page principal
├── CNAME                   # Dominio personalizado
│
├── assets/                 # Recursos estáticos
│   ├── css/
│   │   └── styles.css     # Todos los estilos (21KB)
│   ├── js/
│   │   └── main.js        # Toda la lógica (16KB)
│   └── images/            # Imágenes y favicons
│
├── public/                 # Páginas públicas
│   ├── about.html         # Información personal
│   ├── projects.html      # Portafolio de proyectos
│   ├── contact.html       # Información de contacto
│   └── login.html         # Página de login
│
├── private/                # Área protegida
│   ├── dashboard.html     # Panel de control
│   ├── wiki.html          # Base de conocimiento
│   └── links.html         # Enlaces privados
│
└── docs/                   # Documentación
    ├── README.md          # Documentación principal
    ├── CUSTOMIZATION.md   # Guía de personalización
    ├── STRUCTURE.md       # Este archivo
    ├── DEPLOYMENT.md      # Guía de despliegue
    └── SECURITY.md        # Notas de seguridad
```

### Decisiones de Estructura

**¿Por qué un solo archivo CSS?**
- Menos solicitudes HTTP = carga más rápida
- Más fácil de mantener para principiantes
- Usa variables CSS para temas, no archivos separados

**¿Por qué un solo archivo JS?**
- Evita problemas de dependencias
- Más fácil de debuggear
- Todo el código está en un lugar

**¿Por qué separar public/ y private/?**
- Clara distinción entre áreas públicas y privadas
- Facilita aplicar reglas de acceso
- Mejor organización mental del proyecto

## Arquitectura del CSS

### Organización del Archivo styles.css

```css
/* 1. Variables CSS (líneas 1-90) */
:root {
  --primary-color: #...;
  --spacing-md: 1rem;
  /* Etc. */
}

/* 2. Reset y Base (líneas 91-130) */
*, *::before, *::after { box-sizing: border-box; }

/* 3. Utilidades (líneas 131-180) */
.container { max-width: 1200px; }

/* 4. Componentes (líneas 181-600) */
.navbar { /* ... */ }
.btn { /* ... */ }
.card { /* ... */ }

/* 5. Secciones (líneas 601-800) */
.hero { /* ... */ }
.about-section { /* ... */ }

/* 6. Responsive (líneas 801-900) */
@media (max-width: 768px) { /* ... */ }

/* 7. Animaciones (líneas 901-950) */
@keyframes fadeIn { /* ... */ }
```

### Sistema de Variables CSS

#### Colores
```css
/* Cada sección tiene su propia paleta */
--primary-*    /* Landing page */
--secondary-*  /* Personal section */
--private-*    /* Private area */
--wiki-*       /* Wiki section */
```

#### Espaciado
```css
/* Sistema de espaciado basado en rem */
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
```

#### Diseño Responsive
```css
/* Breakpoints */
- Mobile: < 480px
- Tablet: 481px - 768px
- Desktop: > 768px
```

### Metodología de Clases

Usamos una combinación de:
- **Clases de utilidad**: `.flex`, `.text-center`
- **Clases de componente**: `.btn`, `.card`, `.navbar`
- **Clases de sección**: `.hero`, `.about-section`

```css
/* Patrón de nomenclatura */
.component { }              /* Componente base */
.component-element { }      /* Elemento del componente */
.component--modifier { }    /* Variación del componente */
```

## Arquitectura del JavaScript

### Estructura Modular

```javascript
// assets/js/main.js

CONFIG                    // Configuración global
├── AUTH                  // Credenciales y configuración
├── PAGES                 // Páginas públicas/privadas
└── THEMES                // Configuración de temas

Auth Module              // Autenticación
├── init()
├── login()
├── logout()
├── checkSession()
└── protectPage()

Navigation Module        // Navegación
├── init()
├── setupMobileMenu()
├── setupScrollEffect()
└── highlightActiveLink()

Theme Module            // Temas
├── init()
├── loadTheme()
├── applyTheme()
└── toggleTheme()

Wiki Module             // Wiki
├── init()
├── loadArticles()
├── loadArticle()
└── setupNavigation()

Forms Module            // Formularios
├── sanitizeInput()
├── validateEmail()
├── showError()
└── hideError()

Utils Module            // Utilidades
├── formatDate()
├── debounce()
└── showNotification()
```

### Patrón de Módulos

Cada módulo sigue este patrón:

```javascript
const ModuleName = {
  // Estado privado (si es necesario)
  _privateVar: null,
  
  // Propiedades públicas
  publicProp: 'value',
  
  /**
   * Inicialización
   */
  init() {
    // Setup inicial
  },
  
  /**
   * Métodos públicos
   */
  publicMethod() {
    // Lógica
  }
};
```

### Flujo de Inicialización

```javascript
// 1. DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  
  // 2. Inicializar módulos base
  Auth.init();
  Navigation.init();
  Theme.init();
  
  // 3. Inicializar módulos condicionales
  if (document.getElementById('wikiArticleContent')) {
    Wiki.init();
  }
  
  // 4. Animaciones de entrada
  addFadeInAnimations();
});

// 5. Protección de páginas privadas
Auth.protectPage(); // Si es página privada
```

## Sistema de Navegación

### Estructura de Navegación

```html
<nav class="navbar">
  <div class="container nav-container">
    <!-- Logo/Brand -->
    <a href="/" class="nav-brand">DRYOUU</a>
    
    <!-- Menu -->
    <ul class="nav-menu">
      <li><a href="/index.html" class="nav-link">Inicio</a></li>
      <!-- Más enlaces -->
    </ul>
    
    <!-- Mobile Toggle -->
    <button class="nav-toggle">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</nav>
```

### Navegación Responsive

```javascript
// Mobile Menu Logic
setupMobileMenu() {
  // 1. Toggle menu on button click
  // 2. Close menu on outside click
  // 3. Close menu on link click
  // 4. Prevent body scroll when open
}
```

### Scroll Effect

```javascript
// Navbar scroll behavior
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
```

## Sistema de Autenticación

### Arquitectura de Autenticación

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │ 1. Submit credentials
       ▼
┌─────────────────┐
│  Auth.login()   │
└──────┬──────────┘
       │ 2. Validate
       ▼
┌─────────────────┐
│ LocalStorage    │ 3. Store session
│ {               │
│   username,     │
│   loginTime,    │
│   expiry        │
│ }               │
└──────┬──────────┘
       │ 4. Redirect
       ▼
┌─────────────────┐
│ Private Page    │
└──────┬──────────┘
       │ 5. Check session
       ▼
┌─────────────────┐
│Auth.protectPage │ 6. Validate or redirect
└─────────────────┘
```

### Componentes de Autenticación

#### 1. Login
```javascript
login(username, password) {
  // Validar credenciales
  if (valid) {
    // Crear sesión
    const session = {
      username,
      loginTime: Date.now(),
      expiry: Date.now() + 24*60*60*1000
    };
    // Guardar en LocalStorage
    localStorage.setItem('session', JSON.stringify(session));
  }
}
```

#### 2. Session Check
```javascript
checkSession() {
  // Obtener sesión
  const session = localStorage.getItem('session');
  
  // Validar existencia
  if (!session) return false;
  
  // Validar expiración
  if (session.expiry < Date.now()) {
    this.logout();
    return false;
  }
  
  return true;
}
```

#### 3. Page Protection
```javascript
protectPage() {
  if (!this.checkSession()) {
    // Redirigir a login
    window.location.href = '/public/login.html';
  }
}
```

### Limitaciones de Seguridad

⚠️ **Este es un sistema de DEMOSTRACIÓN**

Limitaciones:
- Credenciales en código fuente
- Validación solo en cliente
- LocalStorage accesible desde consola
- Sin cifrado de datos
- Sin protección contra fuerza bruta

Para producción, necesitas:
- Backend con autenticación real
- JWT o cookies HTTP-only
- Hash de contraseñas (bcrypt)
- HTTPS obligatorio
- Rate limiting

## Flujo de Datos

### Páginas Públicas
```
Usuario → HTML Page → CSS Styles → JavaScript Events → UI Update
```

### Páginas Privadas
```
Usuario → Login → Auth.login()
                     ↓
              LocalStorage ← Session Data
                     ↓
           Auth.checkSession()
                     ↓
         Private Page (if valid)
                     ↓
              Load Content
```

### Wiki
```
User Action → Wiki.loadArticle(id)
                     ↓
            Get from articles{}
                     ↓
         Update DOM (title, content)
                     ↓
      Update navigation (active state)
```

## Componentes Reutilizables

### Buttons
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
```

### Cards
```html
<div class="card">
  <h3 class="card-header">Title</h3>
  <div class="card-body">Content</div>
</div>
```

### Forms
```html
<div class="form-group">
  <label class="form-label">Label</label>
  <input class="form-input" type="text">
</div>
```

### Navigation Links
```html
<a href="#" class="nav-link">Link</a>
<a href="#" class="nav-link active">Active Link</a>
```

## Patrones de Código

### HTML Pattern
```html
<!-- Semantic structure -->
<section class="section-name">
  <div class="container">
    <h2>Section Title</h2>
    <!-- Content -->
  </div>
</section>
```

### CSS Pattern
```css
/* Component → Element → Modifier */
.component {
  /* Base styles */
}

.component-element {
  /* Element styles */
}

.component--modifier {
  /* Variation */
}
```

### JavaScript Pattern
```javascript
// Module pattern
const Module = {
  init() {
    this.setupEvents();
    this.loadData();
  },
  
  setupEvents() {
    // Event listeners
  },
  
  loadData() {
    // Load initial data
  }
};
```

## Performance

### Optimizaciones Implementadas

1. **CSS**
   - Un solo archivo (menos requests)
   - Variables CSS (sin preprocesador)
   - Mobile-first media queries

2. **JavaScript**
   - Un solo archivo (menos requests)
   - Event delegation cuando posible
   - Debounce en scroll/resize
   - Lazy initialization de módulos

3. **HTML**
   - Semántica correcta
   - Sin frameworks (menor tamaño)
   - Assets al final del body

4. **Imágenes**
   - Usa emojis cuando posible
   - Lazy loading recomendado
   - Formatos modernos (WebP)

### Métricas Objetivo

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Total Page Size: < 100KB (sin imágenes)

## Extensibilidad

### Añadir Nuevo Módulo JavaScript

```javascript
// 1. Crear el módulo
const NewModule = {
  init() {
    // Initialization
  },
  
  // Methods...
};

// 2. Inicializarlo en DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // ... otros módulos
  NewModule.init();
});

// 3. Exponer globalmente si es necesario
window.DrYouu.NewModule = NewModule;
```

### Añadir Nuevo Componente CSS

```css
/* 1. Definir el componente */
.new-component {
  /* Base styles */
}

/* 2. Elementos del componente */
.new-component-header {
  /* Element styles */
}

/* 3. Variaciones */
.new-component--large {
  /* Modifier styles */
}

/* 4. Estados */
.new-component:hover {
  /* Hover styles */
}
```

### Añadir Nueva Página

1. Crear archivo HTML con estructura base
2. Copiar navbar de otra página
3. Actualizar enlaces en todas las navbars
4. Añadir estilos específicos si es necesario
5. Añadir lógica JavaScript si es necesario

## Debugging

### Herramientas Útiles

1. **Console de navegador (F12)**
   - Ver errores JavaScript
   - Inspeccionar LocalStorage
   - Ver requests de red

2. **Inspección de elementos**
   - Ver estructura HTML
   - Modificar CSS en vivo
   - Ver estilos aplicados

3. **Breakpoints**
   ```javascript
   debugger; // Pausa ejecución aquí
   ```

### Problemas Comunes

**Página en blanco**
- Revisa consola para errores
- Verifica rutas de archivos CSS/JS
- Comprueba sintaxis HTML

**Estilos no se aplican**
- Verifica especificidad CSS
- Comprueba que el archivo CSS carga
- Revisa media queries

**JavaScript no funciona**
- Revisa errores en consola
- Verifica que el script carga
- Comprueba eventos DOM

## Conclusión

Esta arquitectura está diseñada para ser:
- ✅ **Simple**: Fácil de entender y modificar
- ✅ **Modular**: Componentes independientes
- ✅ **Escalable**: Fácil de extender
- ✅ **Mantenible**: Código limpio y documentado
- ✅ **Performante**: Optimizado para velocidad

Para más información:
- [README.md](README.md) - Documentación general
- [CUSTOMIZATION.md](CUSTOMIZATION.md) - Guía de personalización
- [DEPLOYMENT.md](DEPLOYMENT.md) - Despliegue
- [SECURITY.md](SECURITY.md) - Seguridad

---

Documentado con ❤️ por DrYouu
