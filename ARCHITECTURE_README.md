# 🏗️ Arquitectura Profesional y Sistema de Seguridad Avanzado

## 🎯 Características Principales

### ✅ Nueva Arquitectura Basada en Configuración
- **Separación total** entre código y datos
- **Archivos JSON** para toda la configuración
- **Sin riesgo** de romper el código al cambiar contenido
- **Validación automática** de configuraciones
- **Estructura profesional** y escalable

### 🔐 Sistema de Autenticación Avanzado
- **WebAuthn/Passkey**: Autenticación biométrica (huella, Face ID)
- **OAuth 2.0**: Google, GitHub, Apple Sign-In
- **Multi-Factor**: Soporte para MFA
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Sesiones seguras**: Gestión profesional de sesiones

### 🛡️ Seguridad Intensiva
- **WebAuthn (FIDO2)**: Estándar de autenticación resistente a phishing
- **OAuth 2.0 con PKCE**: Flujo OAuth seguro
- **Rate Limiting**: Máximo 5 intentos en 15 minutos
- **Session Management**: Expiración automática de sesiones
- **CSRF Protection**: Protección contra ataques CSRF
- **Input Validation**: Validación de todas las configuraciones

## 🚀 Inicio Rápido

### 1. Clonar Repositorio

```bash
git clone https://github.com/DrYouu-Research-Lab/web.git
cd web
```

### 2. Personalizar Configuración

```bash
# Editar información del sitio
nano config/site.json

# Cambiar credenciales (IMPORTANTE)
nano config/auth.json

# Añadir tus proyectos
nano config/projects.json
```

### 3. Desplegar

```bash
# GitHub Pages (Recomendado)
git add .
git commit -m "Mi configuración personalizada"
git push origin main

# Activar en: Settings → Pages
```

## 📁 Nueva Estructura

```
web/
├── config/                    # ⭐ CONFIGURACIONES (edita aquí)
│   ├── site.json             # Info del sitio, navegación, hero
│   ├── auth.json             # Autenticación, OAuth, seguridad
│   ├── projects.json         # Tus proyectos
│   ├── wiki.json             # Artículos de wiki
│   └── private-links.json    # Enlaces privados
│
├── src/                       # ⚙️ CÓDIGO FUENTE (no tocar)
│   ├── js/
│   │   ├── auth/             # Módulos de autenticación
│   │   │   ├── webauthn.js   # WebAuthn/Passkey
│   │   │   ├── oauth2.js     # OAuth2 (Google, GitHub, Apple)
│   │   │   └── auth-manager.js
│   │   ├── components/       # Componentes UI
│   │   ├── services/         # Servicios (config loader)
│   │   └── app.js            # Inicialización
│   └── css/
│       └── enhanced-styles.css
│
├── assets/                    # Recursos estáticos
├── public/                    # Páginas públicas
├── private/                   # Área privada
└── docs/                      # Documentación completa
```

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| **[QUICK_SETUP.md](docs/QUICK_SETUP.md)** | 👈 **Empieza aquí** - Guía rápida (5 min) |
| [NEW_ARCHITECTURE.md](docs/NEW_ARCHITECTURE.md) | Arquitectura completa y detallada |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Guía original de inicio |
| [docs/SECURITY.md](docs/SECURITY.md) | Seguridad y mejores prácticas |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Guías de despliegue |

## 🔐 Sistema de Autenticación

### Métodos Disponibles

#### 1. **Local (Usuario/Contraseña)** 🔑
Autenticación tradicional para demo y desarrollo.

#### 2. **WebAuthn/Passkey** 🔐
```
✅ Autenticación biométrica
✅ Huella dactilar, Face ID, Windows Hello
✅ Sin contraseñas
✅ Resistente a phishing
✅ Estándar FIDO2
```

#### 3. **OAuth 2.0** 🌐
```
✅ Google Sign-In
✅ GitHub Sign-In
✅ Apple Sign-In
✅ Sin gestionar contraseñas
✅ Experiencia familiar para usuarios
```

### Configurar Autenticación

Edita `config/auth.json`:

```json
{
  "authentication": {
    "providers": {
      "webauthn": {
        "enabled": true,  // ✅ Activar/desactivar
        "config": { ... }
      },
      "google": {
        "enabled": true,
        "config": {
          "clientId": "TU_GOOGLE_CLIENT_ID"
        }
      }
    },
    "security": {
      "rateLimit": {
        "enabled": true,
        "maxAttempts": 5,
        "windowMs": 900000  // 15 minutos
      }
    }
  }
}
```

## 🎨 Personalización Fácil

### Cambiar Información Personal

```json
// config/site.json
{
  "site": {
    "name": "Tu Nombre",
    "author": "Tu Nombre Completo",
    "description": "Tu descripción..."
  },
  "hero": {
    "title": "Tu Nombre",
    "description": "Tu descripción profesional..."
  }
}
```

### Añadir Proyecto

```json
// config/projects.json
{
  "projects": [
    {
      "id": "mi-proyecto",
      "title": "Mi Proyecto",
      "category": "software",
      "status": "active",
      "featured": true,
      "technologies": ["Python", "Docker"],
      ...
    }
  ]
}
```

### Añadir Artículo Wiki

```json
// config/wiki.json
{
  "wiki": {
    "articles": [
      {
        "id": "mi-articulo",
        "title": "Mi Artículo",
        "content": "# Título\n\nContenido en **Markdown**..."
      }
    ]
  }
}
```

## 🛡️ Seguridad

### Implementado ✅

- **WebAuthn (FIDO2)**: Autenticación sin contraseñas
- **OAuth 2.0 con PKCE**: Flujo OAuth seguro
- **Rate Limiting**: 5 intentos / 15 minutos
- **Session Expiry**: Caducidad automática (24h)
- **CSRF Protection**: State parameter en OAuth
- **Input Validation**: Validación de configs

### Para Producción ⚠️

**IMPORTANTE:** El sistema actual es para DEMO. Para producción:

1. ✅ Implementar backend real (Node.js/Python/Go)
2. ✅ Usar base de datos para usuarios
3. ✅ Guardar client secrets en variables de entorno
4. ✅ Implementar JWT tokens
5. ✅ Usar HTTPS siempre
6. ✅ Añadir logging de seguridad

Ver [docs/SECURITY.md](docs/SECURITY.md) para más detalles.

## 💡 Ventajas de la Nueva Arquitectura

### Antes ❌
```html
<!-- index.html -->
<h1>Yoel Ferreiro Naya</h1>  ← Hardcoded
```
- Riesgo de romper HTML
- Difícil mantener
- Datos mezclados con código

### Ahora ✅
```json
// config/site.json
{
  "hero": {
    "title": "Yoel Ferreiro Naya"  ← Configurable
  }
}
```
- Cambios seguros
- Fácil mantener
- Separación clara

## 🔧 Uso Avanzado

### Cargar Configuraciones en Código

```javascript
// Cargar una configuración
const siteConfig = await configLoader.load('site');

// Cargar múltiples
const configs = await configLoader.loadMultiple(['site', 'auth']);

// Acceder a valores anidados
const siteName = configLoader.get(siteConfig, 'site.name');
```

### Renderizar Contenido Dinámico

```javascript
// Renderizar proyectos
ContentRenderer.renderProjects(
  projectsConfig.projects,
  document.getElementById('projectsGrid')
);

// Renderizar wiki
ContentRenderer.renderWikiSidebar(
  wikiConfig.wiki,
  sidebar,
  onArticleSelect
);
```

### Usar Autenticación

```javascript
// Inicializar
const authManager = new AuthManager();
await authManager.init(authConfig);

// Autenticar con WebAuthn
await authManager.authenticate('webauthn');

// Autenticar con Google
await authManager.authenticate('google');

// Proteger página
authManager.protectPage();
```

## 📊 Comparación

| Característica | Sistema Anterior | Nueva Arquitectura |
|----------------|------------------|-------------------|
| Configuración | Hardcoded en HTML | JSON separado ✅ |
| Riesgo cambios | Alto ❌ | Bajo ✅ |
| Mantenimiento | Difícil ❌ | Fácil ✅ |
| Auth básica | Solo local | WebAuthn + OAuth2 ✅ |
| Seguridad | Básica | Avanzada ✅ |
| Escalabilidad | Limitada | Alta ✅ |
| Validación | Manual | Automática ✅ |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

MIT License - Usa este código libremente.

## 👤 Autor

**Yoel Ferreiro Naya (DrYouu)**

- 🌐 Website: [dryouu.uk](https://dryouu.uk)
- 💻 GitHub: [@DrYouu-Research-Lab](https://github.com/DrYouu-Research-Lab)
- 📧 Email: lab@dryouu.uk

## 🙏 Créditos

- Comunidad open source
- WebAuthn Working Group
- OAuth 2.0 community

## 📞 Soporte

¿Necesitas ayuda?

1. 📖 Lee [QUICK_SETUP.md](docs/QUICK_SETUP.md)
2. 📚 Consulta [NEW_ARCHITECTURE.md](docs/NEW_ARCHITECTURE.md)
3. 🔍 Busca en [Issues](https://github.com/DrYouu-Research-Lab/web/issues)
4. ✉️ Contacta por email

---

## ⭐ Dale una Estrella

Si este proyecto te resultó útil, ¡considera darle una estrella en GitHub!

---

<div align="center">

**🏗️ Arquitectura Profesional • 🔐 Seguridad Avanzada • 📝 Fácil de Usar**

Hecho con ❤️ por [DrYouu](https://github.com/DrYouu-Research-Lab)

</div>
