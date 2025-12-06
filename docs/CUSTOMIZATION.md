# 🎨 Guía de Personalización

Esta guía te enseñará cómo personalizar tu sitio web paso a paso, incluso si no tienes experiencia en programación.

## 📋 Índice

1. [Personalización Básica](#personalización-básica)
2. [Cambiar Colores y Temas](#cambiar-colores-y-temas)
3. [Modificar Textos e Imágenes](#modificar-textos-e-imágenes)
4. [Añadir Tus Proyectos](#añadir-tus-proyectos)
5. [Configurar el Área Privada](#configurar-el-área-privada)
6. [Personalizar la Wiki](#personalizar-la-wiki)
7. [Añadir Enlaces Privados](#añadir-enlaces-privados)
8. [Personalización Avanzada](#personalización-avanzada)

## Personalización Básica

### 1. Tu Información Personal

#### Página Principal (index.html)

1. Abre el archivo `index.html` con un editor de texto
2. Busca estas líneas (aproximadamente línea 42):
   ```html
   <h2 class="hero-subtitle">DRYOUU.UK</h2>
   <h1 class="hero-title">Yoel Ferreiro Naya</h1>
   ```
3. Reemplaza con tu información:
   ```html
   <h2 class="hero-subtitle">TU-DOMINIO.COM</h2>
   <h1 class="hero-title">Tu Nombre Completo</h1>
   ```

4. Busca la descripción (línea ~44):
   ```html
   <p class="hero-description">
     Laboratorio casero de investigación...
   </p>
   ```
5. Reemplaza con tu propia descripción

#### Página Sobre Mí (public/about.html)

1. Abre `public/about.html`
2. Busca la sección de biografía (línea ~40):
   ```html
   <p>
     Soy un apasionado de la tecnología...
   </p>
   ```
3. Reemplaza con tu biografía personal
4. Actualiza las habilidades y competencias según tu perfil

#### Información de Contacto (public/contact.html)

1. Abre `public/contact.html`
2. Busca todos los `mailto:yferreiro@gmail.com`
3. Reemplaza con tu email:
   ```html
   <a href="mailto:tuemail@ejemplo.com">
   ```

### 2. Enlaces y Redes Sociales

En **todos los archivos HTML**, busca y reemplaza:

```html
<!-- GitHub -->
<a href="https://github.com/DrYouu-Research-Lab">
<!-- Reemplaza con tu perfil de GitHub -->
<a href="https://github.com/tu-usuario">

<!-- Email -->
<a href="mailto:yferreiro@gmail.com">
<!-- Reemplaza con tu email -->
<a href="mailto:tuemail@ejemplo.com">
```

**Archivos que necesitas editar:**
- `index.html`
- `public/about.html`
- `public/projects.html`
- `public/contact.html`
- `private/dashboard.html`
- `private/wiki.html`
- `private/links.html`

## Cambiar Colores y Temas

### Método Simple: Variables CSS

1. Abre `assets/css/styles.css`
2. Las primeras 90 líneas contienen todas las variables de color
3. Cambia los valores hexadecimales de los colores:

```css
:root {
  /* Colores principales */
  --primary-accent: #3b82f6;  /* Azul - Cambia a tu color favorito */
  --primary-accent-hover: #2563eb;  /* Azul oscuro al pasar el mouse */
  
  /* Ejemplo: Cambiar a verde */
  --primary-accent: #10b981;
  --primary-accent-hover: #059669;
  
  /* Ejemplo: Cambiar a púrpura */
  --primary-accent: #8b5cf6;
  --primary-accent-hover: #7c3aed;
}
```

### Colores por Sección

#### Landing Page
```css
--primary-bg: #050816;              /* Fondo principal */
--primary-text: #e5e7eb;            /* Texto principal */
--primary-accent: #3b82f6;          /* Color de acento */
```

#### Área Personal
```css
--secondary-bg: #0f172a;            /* Fondo sección personal */
--secondary-accent: #8b5cf6;        /* Color acento personal */
```

#### Área Privada
```css
--private-bg: #111827;              /* Fondo área privada */
--private-accent: #10b981;          /* Color acento privado */
```

#### Wiki
```css
--wiki-bg: #f8fafc;                 /* Fondo wiki (claro) */
--wiki-accent: #0ea5e9;             /* Color acento wiki */
```

### Herramientas para Elegir Colores

- [Coolors.co](https://coolors.co) - Generador de paletas
- [Adobe Color](https://color.adobe.com) - Rueda de colores
- [ColorHunt](https://colorhunt.co) - Paletas prediseñadas

## Modificar Textos e Imágenes

### Cambiar Textos

Los textos están en HTML entre etiquetas. Por ejemplo:

```html
<h1>Este es un título</h1>
<p>Este es un párrafo de texto.</p>
```

**Busca el texto que quieres cambiar y reemplázalo.** No modifiques las etiquetas HTML (las partes entre `<` y `>`).

### Añadir Imágenes

1. Coloca tus imágenes en la carpeta `assets/images/`
2. En el HTML, usa:
   ```html
   <img src="/assets/images/tu-imagen.jpg" alt="Descripción">
   ```

### Añadir un Favicon (Icono del Sitio)

1. Crea o descarga un favicon (archivo .ico o .png)
2. Guárdalo como `favicon.ico` en `assets/images/`
3. En cada archivo HTML, añade en el `<head>`:
   ```html
   <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
   ```

## Añadir Tus Proyectos

1. Abre `public/projects.html`
2. Busca la sección de proyectos (línea ~35)
3. Copia este bloque para cada proyecto:

```html
<div class="project-card">
  <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
  <h3 class="project-title">Nombre del Proyecto</h3>
  <p class="project-description">
    Descripción breve del proyecto y qué tecnologías usaste.
  </p>
  <div class="project-tags">
    <span class="tag">HTML</span>
    <span class="tag">CSS</span>
    <span class="tag">JavaScript</span>
  </div>
  <div class="project-links">
    <a href="https://github.com/tu-usuario/proyecto" 
       target="_blank" 
       class="btn btn-primary">Ver en GitHub</a>
  </div>
</div>
```

4. Personaliza cada proyecto:
   - Cambia el emoji (🎯)
   - Cambia el título
   - Escribe la descripción
   - Actualiza las etiquetas (tags)
   - Añade el enlace a GitHub o demo

## Configurar el Área Privada

### Cambiar Credenciales de Login

**⚠️ IMPORTANTE: Haz esto primero**

1. Abre `assets/js/main.js`
2. Busca la línea 15 (CONFIG.AUTH):
```javascript
AUTH: {
  username: 'admin',           // ← Cambia este usuario
  password: 'DrYouu2024!',     // ← Cambia esta contraseña
  sessionKey: 'dryouu_session',
  tokenExpiry: 24 * 60 * 60 * 1000 // 24 horas
}
```

3. Reemplaza con tus credenciales:
```javascript
AUTH: {
  username: 'mi_usuario',
  password: 'MiContraseñaSegura123!',
  sessionKey: 'mi_session',
  tokenExpiry: 24 * 60 * 60 * 1000
}
```

### Personalizar el Dashboard

1. Abre `private/dashboard.html`
2. Edita las tarjetas de acceso rápido (línea ~50)
3. Añade o elimina secciones según necesites

## Personalizar la Wiki

### Añadir Nuevos Artículos

1. Abre `assets/js/main.js`
2. Busca `Wiki.articles` (línea ~380)
3. Añade un nuevo artículo:

```javascript
'mi-nuevo-articulo': {
  title: 'Título de Mi Artículo',
  content: `
    <h2>Encabezado Principal</h2>
    <p>Contenido del artículo con HTML.</p>
    
    <h3>Subsección</h3>
    <p>Más contenido aquí.</p>
    
    <ul>
      <li>Lista de elementos</li>
      <li>Otro elemento</li>
    </ul>
    
    <h3>Código de Ejemplo</h3>
    <pre><code>console.log("Hola mundo");</code></pre>
  `
}
```

4. Añade el enlace en la navegación:
   - Abre `private/wiki.html`
   - Busca la lista de navegación (línea ~40)
   - Añade:
   ```html
   <li class="wiki-nav-item">
     <a href="#" class="wiki-nav-link" data-article="mi-nuevo-articulo">
       Título del Artículo
     </a>
   </li>
   ```

### Formatear Artículos de la Wiki

Puedes usar estas etiquetas HTML en el contenido:

```html
<h2>Título Grande</h2>
<h3>Título Medio</h3>
<p>Párrafo de texto normal</p>
<strong>Texto en negrita</strong>
<em>Texto en cursiva</em>
<code>código en línea</code>

<!-- Lista sin orden -->
<ul>
  <li>Elemento 1</li>
  <li>Elemento 2</li>
</ul>

<!-- Lista numerada -->
<ol>
  <li>Primero</li>
  <li>Segundo</li>
</ol>

<!-- Bloque de código -->
<pre><code>
Tu código aquí
con múltiples líneas
</code></pre>

<!-- Enlaces -->
<a href="https://ejemplo.com">Texto del enlace</a>
```

## Añadir Enlaces Privados

1. Abre `private/links.html`
2. Busca una sección (por ejemplo, "Infraestructura" en línea ~40)
3. Copia y modifica un bloque de enlace:

```html
<a href="https://tu-servicio.local:8080" 
   class="dashboard-card" 
   style="text-decoration: none; color: inherit;" 
   target="_blank">
  <div class="dashboard-card-icon">🔧</div>
  <h3 class="dashboard-card-title">Nombre del Servicio</h3>
  <p class="dashboard-card-description">
    Descripción breve del servicio
  </p>
  <div style="margin-top: 1rem; color: var(--private-accent); font-weight: 600; font-size: 0.85rem;">
    https://tu-servicio.local:8080
  </div>
</a>
```

### Crear Nueva Sección de Enlaces

```html
<section style="margin-bottom: 3rem;">
  <h2 style="font-size: 1.8rem; margin-bottom: 1.5rem; color: var(--private-text);">
    🎯 Nombre de la Sección
  </h2>
  <div class="dashboard-grid">
    <!-- Aquí van tus enlaces -->
  </div>
</section>
```

## Personalización Avanzada

### Añadir Nueva Página

1. Crea un nuevo archivo HTML (por ejemplo, `public/nueva-pagina.html`)
2. Copia la estructura de una página existente
3. Añade el enlace en la navegación de todos los archivos:
   ```html
   <li><a href="/public/nueva-pagina.html" class="nav-link">Nueva Página</a></li>
   ```

### Modificar la Navegación

En cada archivo HTML, busca:
```html
<nav class="navbar">
  <div class="container nav-container">
    <a href="/index.html" class="nav-brand">DRYOUU</a>
    <ul class="nav-menu">
      <!-- Enlaces de navegación aquí -->
    </ul>
  </div>
</nav>
```

Añade o elimina elementos `<li>` según necesites.

### Cambiar Fuentes

En `assets/css/styles.css`, busca:
```css
:root {
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

Para usar Google Fonts:
1. Ve a [Google Fonts](https://fonts.google.com)
2. Selecciona una fuente
3. Copia el código de enlace en el `<head>` de tus HTML:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
   ```
4. Actualiza la variable CSS:
   ```css
   --font-sans: 'Inter', system-ui, sans-serif;
   ```

### Añadir Animaciones Personalizadas

En `assets/css/styles.css`, al final del archivo:

```css
/* Mi animación personalizada */
@keyframes miAnimacion {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.mi-elemento-animado {
  animation: miAnimacion 0.5s ease-out;
}
```

Aplica la clase en tu HTML:
```html
<div class="mi-elemento-animado">Contenido</div>
```

## 🎓 Consejos y Mejores Prácticas

### 1. Haz Copias de Seguridad
Antes de hacer cambios importantes:
```bash
git add .
git commit -m "Backup antes de cambios"
```

### 2. Prueba en Local Primero
Siempre prueba los cambios en tu servidor local antes de publicar.

### 3. Usa un Editor Adecuado
Recomendaciones:
- [Visual Studio Code](https://code.visualstudio.com) (Gratis)
- [Sublime Text](https://www.sublimetext.com)
- [Notepad++](https://notepad-plus-plus.org) (Windows)

### 4. Valida tu HTML
Usa [W3C Validator](https://validator.w3.org) para verificar errores.

### 5. Optimiza Imágenes
Antes de subir imágenes:
- Reduce el tamaño con [TinyPNG](https://tinypng.com)
- Usa formatos modernos (WebP)
- No uses imágenes mayores a 1MB

### 6. Mantén la Consistencia
- Usa el mismo estilo de escritura en todo el sitio
- Mantén los colores coherentes
- Usa iconos similares (emojis o Font Awesome)

## 🆘 Solución de Problemas

### Los cambios no se ven
1. Borra la caché del navegador (Ctrl+Shift+R)
2. Verifica que guardaste el archivo
3. Comprueba que el archivo está en la ubicación correcta

### La página se ve rota
1. Revisa que no borraste etiquetas HTML por accidente
2. Verifica que todas las etiquetas estén cerradas (`<div></div>`)
3. Usa la consola del navegador (F12) para ver errores

### El login no funciona
1. Verifica que cambiaste las credenciales en `assets/js/main.js`
2. Comprueba que el navegador permite LocalStorage
3. Borra los datos del sitio en la configuración del navegador

## 📚 Recursos Adicionales

- [MDN Web Docs](https://developer.mozilla.org) - Documentación web completa
- [CSS-Tricks](https://css-tricks.com) - Tutoriales de CSS
- [JavaScript.info](https://javascript.info) - Guía de JavaScript

## ¿Necesitas Ayuda?

Si algo no funciona o tienes dudas:
1. Revisa esta guía completa
2. Consulta la [documentación de estructura](STRUCTURE.md)
3. Abre un Issue en GitHub
4. Contacta por email: yferreiro@gmail.com

---

**¡Disfruta personalizando tu sitio web!** 🎉
