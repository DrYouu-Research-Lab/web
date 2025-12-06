# 🚀 Guía Rápida de Configuración

## Primeros Pasos (5 minutos)

### 1. Personalizar Tu Información

Edita `config/site.json`:

```json
{
  "site": {
    "name": "TuNombre",
    "author": "Tu Nombre Completo",
    "domain": "tudominio.com",
    "description": "Tu descripción"
  },
  "hero": {
    "title": "Tu Nombre",
    "description": "Tu descripción profesional..."
  },
  "contact": {
    "email": "tu@email.com"
  }
}
```

### 2. Cambiar Credenciales (IMPORTANTE)

Edita `config/auth.json`:

```json
{
  "demo": {
    "credentials": {
      "username": "tu_usuario",
      "password": "TuContraseñaSegura123!"
    }
  }
}
```

### 3. Añadir Tus Proyectos

Edita `config/projects.json`:

```json
{
  "projects": [
    {
      "id": "mi-proyecto",
      "title": "Mi Proyecto",
      "category": "software",
      "status": "active",
      "featured": true,
      "shortDescription": "Descripción breve",
      "technologies": ["Python", "Docker"],
      "links": [
        {
          "label": "GitHub",
          "url": "https://github.com/tu-usuario/tu-repo"
        }
      ]
    }
  ]
}
```

## Autenticación Avanzada

### Habilitar WebAuthn (Passkey/Biométrico)

Ya está habilitado por defecto. Los usuarios pueden:

1. Ir a la página de login
2. Hacer clic en "🔐 Configurar Passkey/Biométrico"
3. Seguir las instrucciones
4. Usar huella/Face ID para login

### Habilitar Google Sign-In

**Prerrequisitos:**
1. Cuenta de Google Cloud
2. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com)
3. Habilitar Google Sign-In API
4. Crear OAuth 2.0 Client ID

**Configuración:**

Edita `config/auth.json`:

```json
{
  "providers": {
    "google": {
      "enabled": true,
      "config": {
        "clientId": "TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        "redirectUri": "https://tudominio.com/auth/callback"
      }
    }
  }
}
```

**⚠️ IMPORTANTE:** Para producción, necesitas un backend que maneje:
- Token exchange
- Validación de tokens
- Gestión de usuarios

### Habilitar GitHub Sign-In

**Prerrequisitos:**
1. Cuenta de GitHub
2. Crear OAuth App en [GitHub Settings](https://github.com/settings/developers)
3. Obtener Client ID y Client Secret

**Configuración:**

```json
{
  "providers": {
    "github": {
      "enabled": true,
      "config": {
        "clientId": "TU_GITHUB_CLIENT_ID",
        "redirectUri": "https://tudominio.com/auth/callback"
      }
    }
  }
}
```

## Personalización de Contenido

### Añadir Página a Navegación

Edita `config/site.json`:

```json
{
  "navigation": {
    "public": [
      {
        "id": "nueva-pagina",
        "label": "Nueva Página",
        "url": "/public/nueva-pagina.html",
        "icon": "🎯"
      }
    ]
  }
}
```

### Añadir Artículo a Wiki

Edita `config/wiki.json`:

```json
{
  "wiki": {
    "articles": [
      {
        "id": "nuevo-articulo",
        "title": "Título del Artículo",
        "category": "development",
        "author": "Tu Nombre",
        "created": "2024-12-06",
        "updated": "2024-12-06",
        "tags": ["tag1", "tag2"],
        "featured": true,
        "content": "# Título\n\n## Subtítulo\n\nContenido en **Markdown**..."
      }
    ]
  }
}
```

### Añadir Enlace Privado

Edita `config/private-links.json`:

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
          "description": "Descripción",
          "url": "https://mi-servicio.local",
          "icon": "⚙️",
          "color": "#3b82f6",
          "newTab": true,
          "requiresVPN": false
        }
      ]
    }
  ]
}
```

## Temas y Colores

Edita `config/site.json`:

```json
{
  "theme": {
    "colors": {
      "primary": "#3b82f6",     // Azul
      "secondary": "#10b981",   // Verde
      "accent": "#f59e0b",      // Naranja
      "danger": "#ef4444"       // Rojo
    },
    "mode": "dark"  // o "light"
  }
}
```

## Validación

### Verificar JSON válido

Usa [JSONLint](https://jsonlint.com/) para validar tus archivos JSON.

### Probar Localmente

```bash
# Servidor HTTP simple
python3 -m http.server 8000

# O con Node.js
npx serve .
```

Abre: http://localhost:8000

## Despliegue

### GitHub Pages

```bash
git add .
git commit -m "Configuración personalizada"
git push origin main
```

Habilita GitHub Pages en Settings → Pages

### Cloudflare Pages

1. Conecta tu repositorio
2. Configura build:
   - Build command: (ninguno)
   - Output directory: `.`
3. Deploy

## Troubleshooting

### Error: Failed to load config

**Causa:** Archivo JSON inválido o no existe

**Solución:**
1. Verificar que el archivo existe en `config/`
2. Validar JSON en https://jsonlint.com
3. Revisar console del navegador (F12)

### Autenticación no funciona

**Causa:** Falta HTTPS o configuración incorrecta

**Solución:**
1. Usar HTTPS (WebAuthn lo requiere)
2. Verificar credenciales en `config/auth.json`
3. Para OAuth2, verificar Client IDs

### Página en blanco

**Causa:** Error de JavaScript

**Solución:**
1. Abrir console (F12)
2. Revisar errores
3. Verificar orden de carga de scripts

## Recursos

- 📚 [Documentación Completa](./NEW_ARCHITECTURE.md)
- 🔐 [Guía de Seguridad](./SECURITY.md)
- 🎨 [Guía de Personalización](./CUSTOMIZATION.md)
- 🚀 [Guía de Despliegue](./DEPLOYMENT.md)

## Soporte

- 📧 Email: yferreiro@gmail.com
- 🐛 Issues: https://github.com/DrYouu-Research-Lab/web/issues

---

¡Listo! Tu sitio con arquitectura profesional está configurado. 🎉
