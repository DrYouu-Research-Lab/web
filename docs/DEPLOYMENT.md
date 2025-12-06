# 🚀 Guía de Despliegue

Esta guía te mostrará cómo publicar tu sitio web en diferentes plataformas de hosting.

## 📋 Índice

1. [GitHub Pages (Recomendado)](#github-pages)
2. [Cloudflare Pages](#cloudflare-pages)
3. [Netlify](#netlify)
4. [Vercel](#vercel)
5. [Servidor Propio](#servidor-propio)
6. [Configuración de Dominio](#configuración-de-dominio)
7. [HTTPS y Seguridad](#https-y-seguridad)
8. [Troubleshooting](#troubleshooting)

## GitHub Pages

### Ventajas
- ✅ Gratis
- ✅ Fácil de configurar
- ✅ Integración directa con Git
- ✅ HTTPS automático
- ✅ CDN global

### Paso 1: Preparar el Repositorio

1. **Asegúrate de que tu código está en GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verifica la estructura**
   - El archivo `index.html` debe estar en la raíz
   - Todas las rutas deben ser absolutas o relativas correctamente

### Paso 2: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click en **Save**

### Paso 3: Esperar el Despliegue

- GitHub comenzará a publicar tu sitio
- El proceso toma 1-2 minutos
- Verás una URL como: `https://tu-usuario.github.io/web`

### Paso 4: Visitar tu Sitio

```
https://tu-usuario.github.io/web
```

### Configurar Dominio Personalizado en GitHub Pages

1. **Editar CNAME**
   ```bash
   # Edita el archivo CNAME con tu dominio
   echo "tudominio.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Configurar DNS** (ver sección [Configuración de Dominio](#configuración-de-dominio))

3. **En GitHub Pages Settings**
   - Ingresa tu dominio personalizado
   - Espera verificación DNS
   - Activa "Enforce HTTPS"

## Cloudflare Pages

### Ventajas
- ✅ Gratis
- ✅ Muy rápido (CDN global)
- ✅ Builds ilimitados
- ✅ HTTPS automático
- ✅ Integración con Git

### Paso 1: Cuenta de Cloudflare

1. Crea una cuenta en [Cloudflare](https://cloudflare.com)
2. Ve a **Pages** en el dashboard

### Paso 2: Conectar Repositorio

1. Click en **Create a project**
2. Selecciona **Connect to Git**
3. Autoriza acceso a GitHub
4. Selecciona tu repositorio `web`

### Paso 3: Configurar Build

```yaml
Build command: (dejar vacío - sitio estático)
Build output directory: /
Root directory: /
```

### Paso 4: Deploy

1. Click en **Save and Deploy**
2. Espera 1-2 minutos
3. Tu sitio estará en: `https://tu-proyecto.pages.dev`

### Dominio Personalizado en Cloudflare

1. En Pages → tu proyecto → Custom domains
2. Click en **Set up a custom domain**
3. Ingresa tu dominio
4. Sigue las instrucciones DNS

## Netlify

### Ventajas
- ✅ Gratis
- ✅ Muy fácil de usar
- ✅ Deploy automático en cada push
- ✅ HTTPS automático
- ✅ Formularios integrados

### Despliegue Drag & Drop (Más Fácil)

1. Ve a [Netlify](https://netlify.com)
2. Crea una cuenta
3. Arrastra la carpeta de tu proyecto a Netlify
4. ¡Listo! Tu sitio está online

### Despliegue con Git

1. **Conectar repositorio**
   - Click en **New site from Git**
   - Selecciona GitHub
   - Autoriza y selecciona tu repo

2. **Configurar build**
   ```yaml
   Build command: (vacío)
   Publish directory: /
   ```

3. **Deploy**
   - Click en **Deploy site**
   - URL: `https://random-name.netlify.app`

### Dominio Personalizado en Netlify

1. Site settings → Domain management
2. Click en **Add custom domain**
3. Ingresa tu dominio
4. Configura DNS según las instrucciones

## Vercel

### Ventajas
- ✅ Gratis
- ✅ Muy rápido
- ✅ Deploy automático
- ✅ HTTPS automático
- ✅ Preview deployments

### Despliegue

1. **Instalar Vercel CLI (Opcional)**
   ```bash
   npm install -g vercel
   ```

2. **Deploy desde CLI**
   ```bash
   cd /ruta/a/tu/proyecto
   vercel
   ```

3. **O desde Web**
   - Ve a [vercel.com](https://vercel.com)
   - Import Git Repository
   - Selecciona tu repo
   - Deploy

### Configuración

```json
{
  "buildCommand": null,
  "outputDirectory": "./",
  "framework": null
}
```

## Servidor Propio

### Requisitos
- Servidor Linux (Ubuntu/Debian recomendado)
- Nginx o Apache
- Certificado SSL (Let's Encrypt)
- Dominio apuntando al servidor

### Opción 1: Nginx

1. **Instalar Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Copiar archivos**
   ```bash
   sudo cp -r /ruta/local/web/* /var/www/html/
   ```

3. **Configurar Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
   
   ```nginx
   server {
       listen 80;
       server_name tudominio.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
       
       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
   }
   ```

4. **Reiniciar Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

5. **Instalar SSL (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tudominio.com
   ```

### Opción 2: Apache

1. **Instalar Apache**
   ```bash
   sudo apt update
   sudo apt install apache2
   ```

2. **Copiar archivos**
   ```bash
   sudo cp -r /ruta/local/web/* /var/www/html/
   ```

3. **Configurar Apache**
   ```bash
   sudo nano /etc/apache2/sites-available/000-default.conf
   ```
   
   ```apache
   <VirtualHost *:80>
       ServerName tudominio.com
       DocumentRoot /var/www/html
       
       <Directory /var/www/html>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
       
       # Security headers
       Header always set X-Frame-Options "SAMEORIGIN"
       Header always set X-Content-Type-Options "nosniff"
       Header always set X-XSS-Protection "1; mode=block"
   </VirtualHost>
   ```

4. **Habilitar módulos**
   ```bash
   sudo a2enmod rewrite
   sudo a2enmod headers
   ```

5. **Reiniciar Apache**
   ```bash
   sudo systemctl restart apache2
   ```

6. **Instalar SSL**
   ```bash
   sudo apt install certbot python3-certbot-apache
   sudo certbot --apache -d tudominio.com
   ```

## Configuración de Dominio

### DNS Records

Para configurar tu dominio, necesitas añadir estos registros DNS:

#### Para GitHub Pages
```
Tipo: A
Nombre: @
Valor: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153

Tipo: CNAME
Nombre: www
Valor: tu-usuario.github.io
```

#### Para Cloudflare Pages
```
Tipo: CNAME
Nombre: @
Valor: tu-proyecto.pages.dev

Tipo: CNAME
Nombre: www
Valor: tu-proyecto.pages.dev
```

#### Para Netlify
```
Tipo: A
Nombre: @
Valor: 75.2.60.5

Tipo: CNAME
Nombre: www
Valor: tu-sitio.netlify.app
```

#### Para Servidor Propio
```
Tipo: A
Nombre: @
Valor: [IP de tu servidor]

Tipo: CNAME
Nombre: www
Valor: tudominio.com
```

### Proveedores de Dominio Populares

#### Cloudflare (Recomendado)
1. Añade tu dominio a Cloudflare
2. Cambia los nameservers en tu registrador
3. Añade los registros DNS
4. Activa SSL/TLS (Full)

#### Namecheap
1. Panel de control → Advanced DNS
2. Añade los registros A/CNAME
3. Espera propagación (hasta 48h)

#### GoDaddy
1. My Products → DNS
2. Añade registros
3. Guarda cambios

### Verificar Propagación DNS

```bash
# Linux/Mac
dig tudominio.com

# Windows
nslookup tudominio.com

# Online
https://dnschecker.org
```

## HTTPS y Seguridad

### Forzar HTTPS

#### En GitHub Pages
- Activa "Enforce HTTPS" en Settings → Pages

#### En Cloudflare
- SSL/TLS → Always Use HTTPS

#### En Netlify
- Automático por defecto

#### En Nginx
```nginx
server {
    listen 80;
    server_name tudominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tudominio.com;
    
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;
    
    # ... resto de configuración
}
```

### Headers de Seguridad

Añade estos headers en tu configuración:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self' 'unsafe-inline'
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

#### En Nginx
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Content-Security-Policy "default-src 'self' 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

#### En Apache (.htaccess)
```apache
Header set X-Frame-Options "SAMEORIGIN"
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
Header set Content-Security-Policy "default-src 'self' 'unsafe-inline'"
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

#### En Cloudflare
- Transform Rules → Modify Response Header
- Añade los headers

## Automatización

### GitHub Actions para Deploy

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### Pre-deploy Checks

Script para validar antes de desplegar:

```bash
#!/bin/bash
# pre-deploy.sh

echo "Verificando archivos..."

# Verificar que index.html existe
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html no encontrado"
    exit 1
fi

# Verificar que CSS existe
if [ ! -f "assets/css/styles.css" ]; then
    echo "❌ Error: styles.css no encontrado"
    exit 1
fi

# Verificar que JS existe
if [ ! -f "assets/js/main.js" ]; then
    echo "❌ Error: main.js no encontrado"
    exit 1
fi

echo "✅ Todos los archivos principales existen"
echo "Listo para desplegar!"
```

## Monitoreo Post-Deploy

### Verificar que todo funciona

1. **Página principal carga**
   ```bash
   curl -I https://tudominio.com
   # Debe devolver 200 OK
   ```

2. **HTTPS funciona**
   ```bash
   curl -I https://tudominio.com
   # Verifica SSL
   ```

3. **Assets cargan**
   - Abre DevTools (F12)
   - Pestaña Network
   - Recarga la página
   - Verifica que CSS y JS cargan (200 OK)

4. **Navegación funciona**
   - Prueba todos los enlaces
   - Verifica páginas públicas
   - Prueba login y área privada

### Herramientas de Monitoreo

- **Google Search Console**: SEO y indexación
- **Google Analytics**: Tráfico y usuarios
- **UptimeRobot**: Monitoreo de disponibilidad
- **Pingdom**: Performance monitoring

## Troubleshooting

### Página 404 Not Found

**Causa**: Rutas incorrectas
**Solución**: 
- Verifica que todas las rutas empiecen con `/`
- Ejemplo: `/assets/css/styles.css` (no `assets/css/styles.css`)

### Estilos no se aplican

**Causa**: CSS no carga
**Solución**:
- Verifica ruta del CSS en el HTML
- Comprueba que el archivo existe
- Revisa MIME type en headers

### JavaScript no funciona

**Causa**: Script no carga o tiene errores
**Solución**:
- Abre consola (F12)
- Busca errores JavaScript
- Verifica ruta del script
- Comprueba sintaxis

### DNS no propaga

**Causa**: Cambios DNS tardan en propagarse
**Solución**:
- Espera 24-48 horas
- Usa [DNSChecker](https://dnschecker.org)
- Limpia caché DNS: `ipconfig /flushdns` (Windows)

### HTTPS no funciona

**Causa**: Certificado no instalado
**Solución**:
- Espera que se emita el certificado
- Verifica configuración SSL
- Fuerza HTTPS en settings

### Mixed Content Error

**Causa**: Recursos HTTP en página HTTPS
**Solución**:
- Usa HTTPS para todos los recursos externos
- O usa rutas relativas

## Checklist de Deploy

Antes de publicar, verifica:

- [ ] Todas las credenciales de demo han sido cambiadas
- [ ] Tu información personal está actualizada
- [ ] Enlaces de redes sociales están correctos
- [ ] Imágenes están optimizadas
- [ ] CSS y JS funcionan localmente
- [ ] Responsive design funciona en móvil
- [ ] CNAME está configurado (si usas dominio propio)
- [ ] Headers de seguridad están activos
- [ ] HTTPS está activado
- [ ] Favicon está presente
- [ ] Meta tags están completos

## Siguientes Pasos

Después del deploy:

1. **Configura Analytics** (Google Analytics, Plausible, etc.)
2. **Registra en Search Console** (Google, Bing)
3. **Crea Sitemap** (opcional para SEO)
4. **Configura Backups** (automatiza git push)
5. **Monitorea Performance** (Lighthouse, PageSpeed)

## Recursos Adicionales

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Netlify Docs](https://docs.netlify.com)
- [Let's Encrypt](https://letsencrypt.org)
- [DNS Checker](https://dnschecker.org)

## Soporte

¿Problemas con el deploy?
1. Revisa esta guía completa
2. Consulta la documentación de tu plataforma
3. Abre un Issue en GitHub
4. Contacta: yferreiro@gmail.com

---

**¡Tu sitio está listo para el mundo!** 🌍

Hecho con ❤️ por DrYouu
