# 🔒 Guía de Seguridad

Esta guía explica las consideraciones de seguridad del sitio web, sus limitaciones y cómo mejorarlas.

## ⚠️ ADVERTENCIA IMPORTANTE

**Este sitio web incluye un sistema de autenticación de DEMOSTRACIÓN que NO es seguro para uso en producción.**

### Limitaciones Actuales

El sistema actual tiene estas limitaciones:
- ❌ Credenciales almacenadas en código fuente
- ❌ Validación solo en el cliente
- ❌ Sin backend real
- ❌ LocalStorage accesible desde consola
- ❌ Sin cifrado de datos
- ❌ Sin protección contra fuerza bruta
- ❌ Tokens predecibles

**NUNCA uses este sistema para proteger información sensible o real.**

## 📋 Índice

1. [Seguridad Actual](#seguridad-actual)
2. [Mejoras Recomendadas](#mejoras-recomendadas)
3. [Implementación de Backend](#implementación-de-backend)
4. [Headers de Seguridad](#headers-de-seguridad)
5. [Protección XSS](#protección-xss)
6. [HTTPS y SSL](#https-y-ssl)
7. [Mejores Prácticas](#mejores-prácticas)
8. [Checklist de Seguridad](#checklist-de-seguridad)

## Seguridad Actual

### Lo que SÍ tiene el sitio

#### 1. Headers de Seguridad Meta Tags
```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
```

**Protegen contra:**
- MIME type sniffing
- Ataques de clickjacking
- XSS básicos

#### 2. Sanitización de Inputs
```javascript
sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}
```

**Protege contra:**
- Inyección de HTML
- Algunos XSS básicos

#### 3. Validación de Email
```javascript
validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
```

#### 4. Session Expiry
```javascript
sessionData = {
  expiry: Date.now() + 24*60*60*1000 // 24 horas
}
```

### Lo que NO tiene (y debería)

- ❌ Backend de autenticación real
- ❌ Hash de contraseñas
- ❌ Rate limiting
- ❌ CSRF protection
- ❌ Cifrado de datos
- ❌ Logging de seguridad
- ❌ 2FA / MFA
- ❌ Password recovery seguro
- ❌ Protección contra ataques de timing

## Mejoras Recomendadas

### Prioridad ALTA (Antes de producción)

#### 1. Implementar Backend Real

**Nunca** uses el sistema actual en producción. Implementa un backend:

```javascript
// ❌ MAL - Sistema actual
const CONFIG = {
  AUTH: {
    username: 'admin',
    password: 'password123'
  }
};

// ✅ BIEN - Backend real
async function login(username, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  return data.token; // JWT token
}
```

#### 2. Usar HTTPS

**OBLIGATORIO** para producción:
- Obtén certificado SSL (Let's Encrypt gratis)
- Fuerza redirección HTTPS
- Usa HSTS header

```nginx
# Nginx config
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert;
    ssl_certificate_key /path/to/key;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

#### 3. Cambiar Credenciales

Si usas el sistema de demo:
1. Abre `assets/js/main.js`
2. Cambia username y password (línea ~15)
3. Usa contraseña fuerte

```javascript
AUTH: {
  username: 'mi_usuario_unico',
  password: 'Contraseña_Muy_Segura_2024!@#',
  // ...
}
```

### Prioridad MEDIA

#### 4. Headers de Seguridad Adicionales

Añade en tu servidor:

```nginx
# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions Policy
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

#### 5. Subresource Integrity (SRI)

Si usas CDNs, añade SRI:

```html
<script 
  src="https://cdn.example.com/library.js"
  integrity="sha384-hash_aqui"
  crossorigin="anonymous">
</script>
```

#### 6. Rate Limiting

Implementa límites de intentos:

```javascript
// Ejemplo conceptual
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

const loginAttempts = {
  count: 0,
  lastAttempt: null
};

function checkRateLimit() {
  if (loginAttempts.count >= MAX_ATTEMPTS) {
    const timeSinceLastAttempt = Date.now() - loginAttempts.lastAttempt;
    if (timeSinceLastAttempt < LOCKOUT_TIME) {
      return false; // Bloqueado
    } else {
      loginAttempts.count = 0; // Reset
    }
  }
  return true;
}
```

### Prioridad BAJA

#### 7. Logging y Monitoreo

Registra eventos de seguridad:
- Intentos de login fallidos
- Accesos a áreas privadas
- Errores de validación
- Peticiones sospechosas

#### 8. Auditorías Regulares

- Revisa código regularmente
- Usa herramientas de análisis estático
- Mantén dependencias actualizadas
- Haz penetration testing

## Implementación de Backend

### Ejemplo con Node.js + Express

#### Backend (server.js)
```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Simulación de base de datos
const users = {
  'admin': {
    passwordHash: '$2b$10$...' // Hash de bcrypt
  }
};

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Validar usuario
  const user = users[username];
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Verificar password
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generar JWT
  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ token });
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Ruta protegida
app.get('/api/private/data', authenticateToken, (req, res) => {
  res.json({ message: 'Private data', user: req.user });
});

app.listen(3000);
```

#### Frontend (actualizado)
```javascript
// Login
async function login(username, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const { token } = await response.json();
    
    // Guardar token
    localStorage.setItem('authToken', token);
    
    // Redirigir
    window.location.href = '/private/dashboard.html';
  } catch (error) {
    console.error('Login error:', error);
    showError('Login failed');
  }
}

// Hacer peticiones autenticadas
async function fetchPrivateData() {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('/api/private/data', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token inválido o expirado
      logout();
    }
    throw new Error('Request failed');
  }
  
  return await response.json();
}
```

### Ejemplo con Python + Flask

```python
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Simulación de base de datos
users = {
    'admin': {
        'password_hash': bcrypt.generate_password_hash('password').decode('utf-8')
    }
}

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = users.get(username)
    if not user or not bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=username)
    return jsonify({'token': access_token})

@app.route('/api/private/data', methods=['GET'])
@jwt_required()
def private_data():
    return jsonify({'message': 'Private data'})

if __name__ == '__main__':
    app.run(ssl_context='adhoc')  # HTTPS
```

## Headers de Seguridad

### Lista Completa de Headers Recomendados

```nginx
# HTTPS Strict Transport Security
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'self';" always;

# X-Frame-Options
add_header X-Frame-Options "SAMEORIGIN" always;

# X-Content-Type-Options
add_header X-Content-Type-Options "nosniff" always;

# X-XSS-Protection
add_header X-XSS-Protection "1; mode=block" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions Policy
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### Verificar Headers

Usa estas herramientas:
- [Security Headers](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)
- Browser DevTools (F12 → Network → Headers)

## Protección XSS

### Prevención de XSS

#### 1. Sanitizar Todo Input
```javascript
function sanitize(input) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  return input.replace(/[&<>"'/]/g, (m) => map[m]);
}
```

#### 2. Usar textContent en vez de innerHTML
```javascript
// ❌ Vulnerable a XSS
element.innerHTML = userInput;

// ✅ Seguro
element.textContent = userInput;
```

#### 3. CSP Estricto
```
Content-Security-Policy: default-src 'self'; script-src 'self'
```

### XSS Protection en el Código Actual

El sitio ya tiene algunas protecciones:

```javascript
// En Forms.sanitizeInput()
sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}
```

Úsalo siempre antes de mostrar input de usuario:
```javascript
const userInput = document.getElementById('input').value;
const safe = Forms.sanitizeInput(userInput);
element.textContent = safe;
```

## HTTPS y SSL

### ¿Por qué HTTPS?

HTTPS es **OBLIGATORIO** para:
- Proteger credenciales en tránsito
- Evitar man-in-the-middle attacks
- Usar APIs modernas (geolocation, camera, etc.)
- SEO (Google penaliza HTTP)
- Confianza del usuario

### Obtener Certificado SSL Gratis

#### Let's Encrypt (Recomendado)

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com
```

#### Cloudflare

1. Añade tu sitio a Cloudflare
2. Activa SSL/TLS
3. Modo: "Full" o "Full (strict)"
4. Activa "Always Use HTTPS"

### Configurar HTTPS en Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name tudominio.com;
    
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;
    
    # Protocolos seguros
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Cifrados seguros
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;
    
    # ... resto de configuración
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name tudominio.com;
    return 301 https://$server_name$request_uri;
}
```

## Mejores Prácticas

### Gestión de Contraseñas

#### ❌ NUNCA:
- Almacenar contraseñas en texto plano
- Guardar contraseñas en código fuente
- Usar contraseñas débiles
- Compartir contraseñas por email/chat

#### ✅ SIEMPRE:
- Usar hash (bcrypt, argon2)
- Salt único por usuario
- Requerir contraseñas fuertes
- Implementar cambio de contraseña
- Ofrecer 2FA

### Gestión de Tokens

```javascript
// ✅ Buenas prácticas
- Tokens con expiración corta
- Refresh tokens seguros
- Almacenar en httpOnly cookies (no LocalStorage si es posible)
- Invalidar al logout
- Rotar regularmente
```

### Validación de Inputs

```javascript
// ✅ Validar TODO
function validateUsername(username) {
  // Solo alfanuméricos y guiones
  const re = /^[a-zA-Z0-9_-]{3,20}$/;
  return re.test(username);
}

function validatePassword(password) {
  // Mínimo 8 chars, mayúscula, minúscula, número
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password);
}
```

### Logging de Seguridad

```javascript
// Log eventos importantes
function logSecurityEvent(event, data) {
  console.log(`[SECURITY] ${event}`, {
    timestamp: new Date().toISOString(),
    ...data
  });
  
  // En producción: enviar a servidor
  // fetch('/api/logs', { method: 'POST', body: JSON.stringify({...}) });
}

// Ejemplos
logSecurityEvent('LOGIN_ATTEMPT', { username, success: false });
logSecurityEvent('UNAUTHORIZED_ACCESS', { page: '/private/dashboard' });
```

## Checklist de Seguridad

### Antes de Producción

- [ ] Backend implementado con autenticación real
- [ ] Contraseñas hasheadas (bcrypt/argon2)
- [ ] HTTPS configurado y forzado
- [ ] Headers de seguridad configurados
- [ ] Rate limiting implementado
- [ ] Input validation en frontend y backend
- [ ] XSS protection activa
- [ ] CSRF protection implementada
- [ ] Logging de seguridad configurado
- [ ] Backups automáticos configurados

### Mantenimiento Regular

- [ ] Actualizar dependencias mensualmente
- [ ] Revisar logs de seguridad semanalmente
- [ ] Hacer auditorías de seguridad trimestrales
- [ ] Rotar tokens/secretos anualmente
- [ ] Revisar permisos y accesos
- [ ] Probar backups regularmente

### Monitoreo

- [ ] Alertas de intentos de login fallidos
- [ ] Monitoreo de errores 4xx/5xx
- [ ] Alertas de certificado SSL por expirar
- [ ] Monitoreo de performance
- [ ] Uptime monitoring

## Herramientas Útiles

### Análisis de Seguridad

- [OWASP ZAP](https://www.zaproxy.org) - Scanner de vulnerabilidades
- [Security Headers](https://securityheaders.com) - Verificar headers
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Test SSL/TLS
- [Mozilla Observatory](https://observatory.mozilla.org) - Análisis general

### Testing

- [Burp Suite](https://portswigger.net/burp) - Testing de seguridad
- [Postman](https://www.postman.com) - Testing de APIs
- [curl](https://curl.se) - Testing de requests

## Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE Top 25](https://cwe.mitre.org/top25/)

## Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO** abras un issue público
2. Envía email a: yferreiro@gmail.com
3. Incluye:
   - Descripción detallada
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de fix (opcional)

## Conclusión

**Recuerda:** Este sitio es una demostración educativa. Para uso en producción con datos reales:

1. ✅ Implementa backend real
2. ✅ Usa HTTPS
3. ✅ Hashea contraseñas
4. ✅ Implementa rate limiting
5. ✅ Monitorea constantemente

**La seguridad es un proceso continuo, no un estado final.**

---

Mantente seguro 🔒

Documentado por DrYouu
