# 🏗️ Nueva Arquitectura - Guía Completa

## 📋 Tabla de Contenidos
- [Resumen](#resumen)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Sistema de Configuración](#sistema-de-configuración)
- [Sistema de Autenticación](#sistema-de-autenticación)
- [Guía de Uso](#guía-de-uso)
- [Migración](#migración)

## Resumen

Esta nueva arquitectura separa completamente la **configuración** del **código**, permitiendo:

✅ **Mantenimiento Fácil**: Cambia contenido sin tocar código  
✅ **Estructura Profesional**: Código modular y organizado  
✅ **Seguridad Avanzada**: WebAuthn, OAuth2, rate limiting  
✅ **Sin Errores**: Validación de configuraciones  
✅ **Escalable**: Fácil añadir nuevas funcionalidades

## Estructura del Proyecto

```
web/
├── config/                          # 📁 CONFIGURACIONES (JSON)
│   ├── site.json                   # Información del sitio
│   ├── auth.json                   # Autenticación y seguridad
│   ├── projects.json               # Proyectos
│   ├── wiki.json                   # Artículos de la wiki
│   └── private-links.json          # Enlaces privados
│
├── src/                            # 📁 CÓDIGO FUENTE
│   ├── js/
│   │   ├── auth/                   # Módulos de autenticación
│   │   │   ├── webauthn.js        # WebAuthn/Passkey
│   │   │   ├── oauth2.js          # OAuth2 (Google, GitHub, Apple)
│   │   │   └── auth-manager.js    # Gestor unificado
│   │   ├── components/             # Componentes UI
│   │   │   ├── auth-ui.js         # UI de autenticación
│   │   │   └── content-renderer.js # Renderizado dinámico
│   │   ├── services/               # Servicios core
│   │   │   └── config-loader.js   # Cargador de configs
│   │   └── app.js                  # Inicialización principal
│   └── css/
│       └── enhanced-styles.css     # Estilos nuevos
│
├── assets/                         # 📁 RECURSOS ORIGINALES
│   ├── css/styles.css
│   ├── js/main.js
│   └── images/
│
├── public/                         # 📁 PÁGINAS PÚBLICAS
├── private/                        # 📁 ÁREA PRIVADA
└── docs/                           # 📁 DOCUMENTACIÓN
```

## Sistema de Configuración

### ¿Por Qué Separar la Configuración?

**ANTES** ❌
```html
<!-- index.html -->
<h1>Yoel Ferreiro Naya</h1>
<p>Laboratorio casero de investigación...</p>
```
❌ Si quieres cambiar tu nombre, debes editar HTML  
❌ Riesgo de romper el código  
❌ Difícil de mantener

**AHORA** ✅
```json
// config/site.json
{
  "hero": {
    "title": "Yoel Ferreiro Naya",
    "description": "Laboratorio casero de investigación..."
  }
}
```
✅ Cambias solo el JSON  
✅ Sin riesgo de romper código  
✅ Validación automática

### Archivos de Configuración

#### 1. `config/site.json`
**Qué contiene:**
- Información del sitio (nombre, descripción, autor)
- Navegación (menús públicos y privados)
- Hero section (landing page)
- Features (sección de características)
- Tema (colores, modo)
- Contacto y redes sociales

**Cómo cambiar tu nombre:**
```json
{
  "site": {
    "name": "Tu Nombre",
    "author": "Tu Nombre Completo"
  },
  "hero": {
    "title": "Tu Nombre"
  }
}
```

**Cómo añadir una nueva página a la navegación:**
```json
{
  "navigation": {
    "public": [
      {
        "id": "nueva-pagina",
        "label": "Mi Nueva Página",
        "url": "/public/nueva-pagina.html",
        "icon": "🎯"
      }
    ]
  }
}
```

#### 2. `config/auth.json`
**Qué contiene:**
- Proveedores de autenticación (local, WebAuthn, OAuth2)
- Configuración de seguridad
- Rate limiting
- Políticas de contraseñas

**Cómo habilitar Google Sign-In:**
```json
{
  "authentication": {
    "providers": {
      "google": {
        "enabled": true,
        "config": {
          "clientId": "TU_GOOGLE_CLIENT_ID",
          ...
        }
      }
    }
  }
}
```

**⚠️ IMPORTANTE:** Para usar OAuth2 en producción, necesitas:
1. Registrar tu aplicación en Google/GitHub/Apple
2. Obtener `clientId` y `clientSecret`
3. Configurar un backend para manejar el intercambio de tokens

#### 3. `config/projects.json`
**Qué contiene:**
- Lista de proyectos
- Categorías de proyectos
- Información detallada de cada proyecto

**Cómo añadir un nuevo proyecto:**
```json
{
  "projects": [
    {
      "id": "mi-proyecto",
      "title": "Mi Nuevo Proyecto",
      "category": "software",
      "status": "active",
      "featured": true,
      "shortDescription": "Descripción breve",
      "description": "Descripción completa...",
      "technologies": ["Python", "Docker", "React"],
      "image": "/assets/images/projects/mi-proyecto.jpg",
      "links": [
        {
          "label": "GitHub",
          "url": "https://github.com/...",
          "type": "github"
        }
      ],
      "startDate": "2024-01",
      "endDate": null,
      "highlights": [
        "Característica 1",
        "Característica 2"
      ]
    }
  ]
}
```

#### 4. `config/wiki.json`
**Qué contiene:**
- Artículos de la wiki
- Categorías
- Contenido en Markdown

**Cómo añadir un nuevo artículo:**
```json
{
  "wiki": {
    "articles": [
      {
        "id": "mi-articulo",
        "title": "Mi Nuevo Artículo",
        "category": "development",
        "author": "Tu Nombre",
        "created": "2024-12-06",
        "updated": "2024-12-06",
        "tags": ["tag1", "tag2"],
        "featured": true,
        "content": "# Título\n\nContenido en **Markdown**..."
      }
    ]
  }
}
```

#### 5. `config/private-links.json`
**Qué contiene:**
- Enlaces del área privada
- Organizados por categorías
- URLs de servicios internos

**Cómo añadir un nuevo enlace:**
```json
{
  "categories": [
    {
      "id": "tools",
      "name": "Herramientas",
      "icon": "🔧",
      "order": 1,
      "links": [
        {
          "id": "mi-servicio",
          "title": "Mi Servicio",
          "description": "Descripción del servicio",
          "url": "https://mi-servicio.local",
          "icon": "⚙️",
          "color": "#3b82f6",
          "newTab": true,
          "requiresVPN": true
        }
      ]
    }
  ]
}
```

### Cargador de Configuraciones

El módulo `src/js/services/config-loader.js` se encarga de:

✅ Cargar archivos JSON  
✅ Validar estructura  
✅ Cachear configuraciones  
✅ Proporcionar acceso centralizado

**Uso en código:**
```javascript
// Cargar una configuración
const siteConfig = await configLoader.load('site');

// Cargar múltiples
const configs = await configLoader.loadMultiple(['site', 'auth', 'projects']);

// Recargar (limpiar caché)
const freshConfig = await configLoader.reload('site');

// Acceder a valores anidados
const siteName = configLoader.get(siteConfig, 'site.name', 'Default Name');
```

## Sistema de Autenticación

### Métodos de Autenticación Disponibles

#### 1. **Local (Usuario/Contraseña)** 🔑
- Método tradicional
- Para demo y desarrollo
- **No usar en producción sin backend**

#### 2. **WebAuthn/Passkey** 🔐
- Autenticación biométrica
- Huella dactilar, Face ID, Windows Hello
- Sin contraseñas
- Resistente a phishing
- Seguro y conveniente

**Cómo funciona:**
1. Usuario registra su passkey
2. Sistema guarda clave pública
3. Login usa verificación biométrica
4. Sin contraseñas que robar

#### 3. **OAuth2 (Google, GitHub, Apple)** 🌐
- Inicio de sesión con terceros
- No necesitas gestionar contraseñas
- Usuarios usan cuentas existentes

**Proveedores soportados:**
- 🔵 Google
- ⚫ GitHub
- ⚪ Apple

### Arquitectura de Autenticación

```
┌─────────────────────────────────────┐
│     AuthManager                      │
│  (Gestor Unificado)                 │
│                                      │
│  - Coordina todos los métodos       │
│  - Gestión de sesiones              │
│  - Rate limiting                     │
│  - Protección de páginas            │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼─────┐  ┌─────▼──────┐  ┌──────▼─────┐
│  WebAuthn  │  │   OAuth2   │  │   Local    │
│            │  │            │  │            │
│ - Passkey  │  │ - Google   │  │ - User/Pass│
│ - Biometric│  │ - GitHub   │  │ - Demo     │
│ - FIDO2    │  │ - Apple    │  │            │
└────────────┘  └────────────┘  └────────────┘
```

### Seguridad Implementada

✅ **Rate Limiting**: Máximo 5 intentos en 15 minutos  
✅ **Expiración de Sesión**: 24 horas por defecto  
✅ **PKCE (OAuth2)**: Protección adicional para OAuth2  
✅ **State Parameter**: Protección CSRF en OAuth2  
✅ **WebAuthn**: Criptografía de clave pública  

### Componentes UI de Autenticación

El módulo `src/js/components/auth-ui.js` proporciona:

- Renderizado de métodos de autenticación
- Formularios dinámicos
- Mensajes de error/éxito
- Estados de carga
- Registro de passkeys

## Guía de Uso

### Para Usuarios (Sin Conocimientos Técnicos)

#### Cambiar Información Personal

1. **Abrir** `config/site.json`
2. **Buscar** la sección que quieres cambiar:
   ```json
   "site": {
     "name": "DrYouu",
     "author": "Tu Nombre Aquí"  ← Cambiar esto
   }
   ```
3. **Guardar** el archivo
4. **Recargar** la página web

#### Añadir un Proyecto

1. **Abrir** `config/projects.json`
2. **Copiar** un proyecto existente
3. **Modificar** los valores
4. **Guardar** el archivo

#### Añadir un Artículo a la Wiki

1. **Abrir** `config/wiki.json`
2. **Añadir** nuevo artículo en `articles`
3. **Usar Markdown** para el contenido
4. **Guardar** el archivo

### Para Desarrolladores

#### Integrar el Nuevo Sistema

**1. Actualizar el HTML para usar el nuevo sistema:**

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Estilos originales -->
  <link rel="stylesheet" href="/assets/css/styles.css">
  <!-- Estilos nuevos -->
  <link rel="stylesheet" href="/src/css/enhanced-styles.css">
</head>
<body>
  <!-- Contenedor para contenido dinámico -->
  <div id="app"></div>

  <!-- Cargar módulos -->
  <script src="/src/js/services/config-loader.js"></script>
  <script src="/src/js/auth/webauthn.js"></script>
  <script src="/src/js/auth/oauth2.js"></script>
  <script src="/src/js/auth/auth-manager.js"></script>
  <script src="/src/js/components/auth-ui.js"></script>
  <script src="/src/js/components/content-renderer.js"></script>
  <script src="/src/js/app.js"></script>
</body>
</html>
```

**2. Usar componentes en tu código:**

```javascript
// Renderizar proyectos dinámicamente
const projectsConfig = await configLoader.load('projects');
ContentRenderer.renderProjects(
  projectsConfig.projects,
  document.getElementById('projectsContainer')
);

// Usar autenticación
const authManager = new AuthManager();
await authManager.init(authConfig);
await authManager.authenticate('webauthn');
```

#### Extender el Sistema

**Añadir un nuevo proveedor OAuth2:**

1. Editar `config/auth.json`:
```json
{
  "providers": {
    "microsoft": {
      "enabled": true,
      "type": "oauth2",
      "name": "Microsoft",
      "icon": "🔷",
      "config": {
        "clientId": "YOUR_CLIENT_ID",
        "authUrl": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        ...
      }
    }
  }
}
```

2. El sistema lo detectará automáticamente

**Crear un nuevo tipo de configuración:**

1. Crear `config/mi-config.json`
2. Añadir validación en `config-loader.js`:
```javascript
validate(configName, config) {
  switch (configName) {
    case 'mi-config':
      this.validateMiConfig(config);
      break;
  }
}
```

## Migración

### Desde el Sistema Anterior

#### Opción 1: Convivencia (Recomendada)

El nuevo sistema puede coexistir con el anterior:

```
web/
├── config/          ← Nuevo sistema
├── src/             ← Nuevo sistema
├── assets/          ← Sistema original (mantener)
│   ├── css/styles.css
│   └── js/main.js
├── public/          ← Páginas originales (actualizar gradualmente)
└── private/         ← Páginas originales (actualizar gradualmente)
```

**Ventajas:**
- Sin cambios bruscos
- Migración gradual
- Rollback fácil

#### Opción 2: Migración Completa

1. **Backup**: Guardar copia del sitio original
2. **Actualizar HTML**: Cambiar referencias a nuevos módulos
3. **Migrar datos**: Mover datos hardcodeados a configs
4. **Probar**: Verificar todo funciona
5. **Eliminar**: Quitar código antiguo

### Script de Migración

```bash
#!/bin/bash
# migrate.sh

echo "Creando backup..."
cp -r /path/to/web /path/to/web.backup

echo "Actualizando HTML files..."
# Añadir nuevas referencias de scripts

echo "¡Migración completada!"
echo "Revisa tu sitio y si todo funciona, elimina el backup"
```

## Mejores Prácticas

### Configuraciones

✅ **DO:**
- Usar valores descriptivos
- Validar antes de guardar
- Mantener backup de configs
- Comentar cambios complejos
- Usar formato JSON válido

❌ **DON'T:**
- Hardcodear datos en HTML
- Ignorar errores de validación
- Guardar secretos en configs (usar variables de entorno)
- Mezclar código y configuración

### Autenticación

✅ **DO (Producción):**
- Implementar backend real
- Usar HTTPS siempre
- Guardar secretos en variables de entorno
- Implementar logging de seguridad
- Usar tokens JWT
- Rate limiting en servidor

❌ **DON'T:**
- Usar auth client-side en producción
- Guardar contraseñas en localStorage
- Ignorar expiración de sesiones
- Exponer client secrets

## Troubleshooting

### Configuraciones no se cargan

**Problema:** Error al cargar config
```
Failed to load config: site (404)
```

**Solución:**
1. Verificar que el archivo existe: `config/site.json`
2. Verificar formato JSON válido: https://jsonlint.com
3. Revisar permisos del archivo

### Autenticación no funciona

**Problema:** WebAuthn no disponible

**Solución:**
1. Usar HTTPS (WebAuthn requiere contexto seguro)
2. Verificar navegador compatible
3. Comprobar hardware (biométrico disponible)

### Contenido no se renderiza

**Problema:** Página en blanco

**Solución:**
1. Abrir consola del navegador (F12)
2. Revisar errores en console
3. Verificar que todos los scripts se cargan
4. Comprobar orden de carga de módulos

## Recursos

### Enlaces Útiles

- [WebAuthn Guide](https://webauthn.guide/)
- [OAuth 2.0 Simplified](https://www.oauth.com/)
- [JSON Validation](https://jsonlint.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Soporte

¿Necesitas ayuda?
- 📧 Email: lab@dryouu.uk
- 🐛 Issues: https://github.com/DrYouu-Research-Lab/web/issues
- 📚 Docs: `/docs/` directory

---

**🎉 ¡Disfruta tu nueva arquitectura profesional!**
