# 🔒 Configuración de Seguridad - Guía Práctica

## Niveles de Seguridad

### Nivel 1: Demo/Desarrollo (Actual) 🟡

**Estado actual del proyecto:**
- ✅ WebAuthn implementado (client-side)
- ✅ OAuth2 framework listo
- ✅ Rate limiting básico
- ⚠️ Autenticación client-side (NO para producción)
- ⚠️ Sin backend

**Usar para:**
- Desarrollo local
- Demostraciones
- Prototipos
- Aprendizaje

### Nivel 2: Básico (Para hobby sites) 🟢

**Qué añadir:**
1. Backend simple (Node.js/Python)
2. Base de datos (SQLite/PostgreSQL)
3. HTTPS obligatorio
4. Variables de entorno para secretos

**Configuración:**

```javascript
// backend/.env
AUTH_SECRET=tu-secreto-super-seguro-aqui
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
```

```javascript
// backend/server.js (Node.js example)
const express = require('express');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Session configuration
app.use(session({
  secret: process.env.AUTH_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,  // HTTPS only
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000  // 24 hours
  }
}));

// OAuth2 setup (example with Google)
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://yourdomain.com/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // Find or create user in database
    User.findOrCreate({ googleId: profile.id }, (err, user) => {
      return done(err, user);
    });
  }
));
```

### Nivel 3: Producción (Empresarial) 🔴

**Implementación completa:**

```yaml
# Docker Compose para stack completo
version: '3.8'
services:
  web:
    image: nginx:alpine
    volumes:
      - ./web:/usr/share/nginx/html
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
  
  api:
    build: ./backend
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
```

## Configuración de Autenticación por Proveedor

### Google OAuth 2.0

#### 1. Crear Proyecto en Google Cloud

```bash
# 1. Ir a: https://console.cloud.google.com
# 2. Crear nuevo proyecto
# 3. Habilitar "Google+ API"
# 4. Credentials → Create Credentials → OAuth 2.0 Client ID
```

#### 2. Configurar Redirect URIs

```
https://tudominio.com/auth/google/callback
http://localhost:3000/auth/google/callback  (desarrollo)
```

#### 3. Obtener Credenciales

```json
// config/auth.json
{
  "providers": {
    "google": {
      "enabled": true,
      "config": {
        "clientId": "123456789-abcdef.apps.googleusercontent.com",
        "redirectUri": "https://tudominio.com/auth/google/callback"
      }
    }
  }
}
```

⚠️ **NUNCA subas el `clientSecret` a Git**

```javascript
// backend/.env
GOOGLE_CLIENT_SECRET=tu-client-secret-aqui
```

### GitHub OAuth

#### 1. Crear OAuth App

```bash
# 1. GitHub → Settings → Developer settings
# 2. OAuth Apps → New OAuth App
```

#### 2. Configuración

```
Application name: Tu App Name
Homepage URL: https://tudominio.com
Authorization callback URL: https://tudominio.com/auth/github/callback
```

#### 3. Integrar

```json
// config/auth.json
{
  "providers": {
    "github": {
      "enabled": true,
      "config": {
        "clientId": "tu_github_client_id",
        "redirectUri": "https://tudominio.com/auth/github/callback"
      }
    }
  }
}
```

### Apple Sign In

#### 1. Apple Developer Account (requiere pago)

```bash
# 1. https://developer.apple.com
# 2. Certificates, Identifiers & Profiles
# 3. Identifiers → App IDs → Create
```

#### 2. Configuración

```json
{
  "providers": {
    "apple": {
      "enabled": true,
      "config": {
        "clientId": "com.tudominio.app",
        "teamId": "TU_TEAM_ID",
        "keyId": "TU_KEY_ID",
        "redirectUri": "https://tudominio.com/auth/apple/callback"
      }
    }
  }
}
```

## WebAuthn/Passkey

### Configuración

```json
// config/auth.json
{
  "providers": {
    "webauthn": {
      "enabled": true,
      "config": {
        "rpName": "Tu Sitio Web",
        "rpId": "tudominio.com",  // Sin https://
        "timeout": 60000,
        "authenticatorAttachment": "platform",  // "platform" o "cross-platform"
        "userVerification": "preferred"  // "required", "preferred", "discouraged"
      }
    }
  }
}
```

### Requisitos

✅ **Obligatorio:**
- HTTPS (excepto localhost)
- Dominio válido
- Navegador compatible

✅ **Hardware:**
- Sensor biométrico (huella, Face ID)
- Windows Hello
- Security key USB (Yubikey, etc.)

### Implementación Backend

```javascript
// backend/webauthn-server.js
const { Fido2Lib } = require('fido2-lib');

const f2l = new Fido2Lib({
  timeout: 60000,
  rpId: "tudominio.com",
  rpName: "Tu Sitio",
  challengeSize: 128,
  attestation: "none",
  cryptoParams: [-7, -257]
});

// Registration endpoint
app.post('/auth/webauthn/register', async (req, res) => {
  const { username } = req.body;
  
  // Generate registration options
  const registrationOptions = await f2l.attestationOptions();
  
  // Store challenge in session
  req.session.challenge = registrationOptions.challenge;
  
  res.json(registrationOptions);
});

// Verification endpoint
app.post('/auth/webauthn/verify', async (req, res) => {
  const { credential } = req.body;
  const { challenge } = req.session;
  
  const attestationExpectations = {
    challenge: challenge,
    origin: "https://tudominio.com",
    factor: "either"
  };
  
  const regResult = await f2l.attestationResult(
    credential,
    attestationExpectations
  );
  
  // Save credential to database
  await saveCredential(regResult);
  
  res.json({ success: true });
});
```

## Rate Limiting Avanzado

### Client-Side (Actual)

```json
// config/auth.json
{
  "security": {
    "rateLimit": {
      "enabled": true,
      "maxAttempts": 5,
      "windowMs": 900000,  // 15 minutos
      "blockDuration": 1800000  // 30 minutos
    }
  }
}
```

### Server-Side (Recomendado)

```javascript
// backend/rate-limit.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const loginLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient
  }),
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 5,  // 5 intentos
  message: 'Demasiados intentos, intenta de nuevo más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/auth/login', loginLimiter);
```

## Content Security Policy (CSP)

### Configuración Básica

```html
<!-- En tus HTML files -->
<meta http-equiv="Content-Security-Policy" 
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://accounts.google.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://accounts.google.com https://api.github.com;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
      ">
```

### Configuración Nginx

```nginx
# /etc/nginx/sites-available/default
server {
    listen 443 ssl http2;
    server_name tudominio.com;
    
    # SSL Configuration
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    
    # Security Headers
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com;" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitorización de Seguridad

### Log de Eventos

```javascript
// backend/security-logger.js
const winston = require('winston');

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'security.log',
      level: 'warn'
    }),
    new winston.transports.File({ 
      filename: 'combined.log' 
    })
  ]
});

// Log eventos de seguridad
function logSecurityEvent(event, details) {
  securityLogger.warn({
    timestamp: new Date().toISOString(),
    event: event,
    ip: details.ip,
    userAgent: details.userAgent,
    details: details
  });
}

// Uso
app.post('/auth/login', (req, res) => {
  if (loginFailed) {
    logSecurityEvent('FAILED_LOGIN', {
      username: req.body.username,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  }
});
```

### Alertas

```javascript
// backend/alerts.js
const nodemailer = require('nodemailer');

async function sendSecurityAlert(event, details) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ALERT_EMAIL,
      pass: process.env.ALERT_PASSWORD
    }
  });

  await transporter.sendMail({
    from: 'security@tudominio.com',
    to: 'admin@tudominio.com',
    subject: `🚨 Security Alert: ${event}`,
    html: `
      <h2>Security Event Detected</h2>
      <p><strong>Event:</strong> ${event}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Details:</strong></p>
      <pre>${JSON.stringify(details, null, 2)}</pre>
    `
  });
}

// Disparar alerta en eventos críticos
if (failedAttempts > 10) {
  sendSecurityAlert('BRUTE_FORCE_ATTEMPT', {
    ip: req.ip,
    attempts: failedAttempts
  });
}
```

## Checklist de Seguridad

### Antes de Producción

- [ ] HTTPS configurado y forzado
- [ ] Secretos en variables de entorno
- [ ] CSP headers implementados
- [ ] Rate limiting server-side
- [ ] Logging de seguridad activo
- [ ] Backups automáticos configurados
- [ ] Firewall configurado
- [ ] 2FA/MFA habilitado para admin
- [ ] Dependencias actualizadas
- [ ] Escaneo de vulnerabilidades realizado

### Mantenimiento Regular

- [ ] Revisar logs de seguridad (semanal)
- [ ] Actualizar dependencias (mensual)
- [ ] Rotar secrets (trimestral)
- [ ] Auditoría de seguridad (anual)
- [ ] Backup testing (mensual)

## Recursos

### Herramientas

- [SSL Labs](https://www.ssllabs.com/ssltest/) - Test SSL/TLS
- [Security Headers](https://securityheaders.com/) - Test headers
- [Observatory](https://observatory.mozilla.org/) - Security scan
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing

### Documentación

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [WebAuthn Guide](https://webauthn.guide/)
- [OAuth 2.0 Security](https://oauth.net/2/security/)

---

**⚠️ Recuerda:** La seguridad es un proceso continuo, no un producto.
