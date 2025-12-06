# DrYouu Professional Website

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Sitio web profesional completo con área pública, sección privada con autenticación y wiki personal. Diseñado para ser fácil de personalizar incluso sin conocimientos técnicos profundos.

## 🌟 Características

### Área Pública
- **Landing Page Profesional**: Página de inicio moderna y atractiva
- **Sección Personal**: Información sobre ti, habilidades y experiencia
- **Portafolio de Proyectos**: Muestra tus trabajos y proyectos
- **Página de Contacto**: Facilita que te contacten
- **Diseño Responsive**: Se adapta a móviles, tablets y escritorio

### Área Privada (Protegida con Login)
- **Dashboard**: Panel de control con acceso rápido a recursos
- **Wiki Personal**: Base de conocimiento privada para tus notas
- **Enlaces Privados**: Organiza accesos a tus servicios y herramientas
- **Autenticación Segura**: Sistema de login con sesiones

### Características Técnicas
- **Temas Personalizables**: Diferentes estilos para cada sección
- **Seguridad**: Headers de seguridad, protección XSS, sanitización
- **Sin Dependencias**: HTML, CSS y JavaScript vanilla
- **Documentación Completa**: Guías paso a paso para personalización
- **Código Comentado**: Todo el código está explicado

## 📁 Estructura del Proyecto

```
web/
├── index.html                 # Página principal (landing page)
├── CNAME                      # Configuración de dominio
├── assets/                    # Recursos estáticos
│   ├── css/
│   │   └── styles.css        # Estilos principales (muy comentado)
│   ├── js/
│   │   └── main.js           # JavaScript principal (muy comentado)
│   └── images/               # Imágenes del sitio
├── public/                    # Páginas públicas
│   ├── about.html            # Sobre ti
│   ├── projects.html         # Tus proyectos
│   ├── contact.html          # Información de contacto
│   └── login.html            # Página de inicio de sesión
├── private/                   # Área privada (requiere login)
│   ├── dashboard.html        # Panel de control
│   ├── wiki.html             # Wiki personal
│   └── links.html            # Enlaces privados
└── docs/                      # Documentación
    ├── README.md             # Este archivo
    ├── CUSTOMIZATION.md      # Guía de personalización
    ├── STRUCTURE.md          # Explicación de la arquitectura
    ├── DEPLOYMENT.md         # Guía de despliegue
    └── SECURITY.md           # Notas de seguridad
```

## 🚀 Inicio Rápido

### Opción 1: GitHub Pages (Recomendado para principiantes)

1. **Fork o clona este repositorio**
   ```bash
   git clone https://github.com/DrYouu-Research-Lab/web.git
   cd web
   ```

2. **Personaliza el contenido básico**
   - Edita `index.html` con tu información
   - Actualiza `public/about.html` con tu biografía
   - Modifica `public/projects.html` con tus proyectos

3. **Configura GitHub Pages**
   - Ve a Settings → Pages en tu repositorio
   - Selecciona la rama `main` como fuente
   - Tu sitio estará en `https://tu-usuario.github.io/web`

4. **[Opcional] Configura dominio personalizado**
   - Edita el archivo `CNAME` con tu dominio
   - Configura los DNS según [DEPLOYMENT.md](DEPLOYMENT.md)

### Opción 2: Servidor Web Local

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/DrYouu-Research-Lab/web.git
   cd web
   ```

2. **Inicia un servidor local**
   
   Con Python 3:
   ```bash
   python -m http.server 8000
   ```
   
   Con Node.js:
   ```bash
   npx http-server
   ```

3. **Abre en tu navegador**
   ```
   http://localhost:8000
   ```

## 🎨 Personalización

### Cambios Básicos (Sin programar)

1. **Tu Información Personal**
   - Abre `index.html`, `public/about.html`
   - Busca y reemplaza textos como nombre, descripción, etc.
   - No necesitas entender el código, solo cambiar el texto entre etiquetas

2. **Colores y Estilos**
   - Abre `assets/css/styles.css`
   - Ve a las líneas 1-50 (sección de variables CSS)
   - Cambia los valores de color (ej: `#3b82f6` por otro color)

3. **Enlaces y Redes Sociales**
   - Busca `href="https://github.com"` en los archivos HTML
   - Reemplaza con tus URLs

### Cambios Avanzados

Ver la [Guía de Personalización Completa](docs/CUSTOMIZATION.md) para:
- Añadir nuevas páginas
- Modificar el sistema de autenticación
- Añadir artículos a la wiki
- Personalizar enlaces privados
- Cambiar la estructura de navegación

## 🔐 Configuración de Seguridad

### IMPORTANTE: Cambiar Credenciales

**El sitio viene con credenciales de demostración. DEBES cambiarlas:**

1. Abre `assets/js/main.js`
2. Busca la línea ~15 (objeto `CONFIG.AUTH`)
3. Cambia:
   ```javascript
   AUTH: {
     username: 'admin',          // ← Cambia esto
     password: 'DrYouu2024!',    // ← Y esto también
     // ...
   }
   ```

### Notas de Seguridad

⚠️ **ADVERTENCIA**: Este sistema de autenticación es solo para demostración. Las credenciales están almacenadas en el código cliente.

Para un sitio de producción:
- Implementa autenticación del lado del servidor
- Usa HTTPS (obligatorio)
- Implementa rate limiting
- Usa bases de datos para usuarios
- Considera OAuth o similar

Ver [SECURITY.md](docs/SECURITY.md) para más detalles.

## 📖 Documentación Completa

- **[CUSTOMIZATION.md](docs/CUSTOMIZATION.md)** - Guía paso a paso para personalizar todo
- **[STRUCTURE.md](docs/STRUCTURE.md)** - Explicación detallada de la arquitectura
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Cómo publicar tu sitio
- **[SECURITY.md](docs/SECURITY.md)** - Mejores prácticas de seguridad

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS y grid/flexbox
- **JavaScript (Vanilla)**: Sin frameworks, código limpio y comentado
- **LocalStorage**: Para gestión de sesiones (lado cliente)

### ¿Por qué sin frameworks?

- ✅ Más fácil de entender para principiantes
- ✅ Más rápido (sin dependencias que descargar)
- ✅ Más fácil de mantener
- ✅ Funciona en cualquier navegador moderno
- ✅ No requiere compilación ni build tools

## 🎯 Casos de Uso

Este sitio es perfecto para:
- 👨‍💻 Desarrolladores que necesitan un portfolio profesional
- 🔬 Investigadores que quieren compartir su trabajo
- 🏠 Entusiastas del homelab que quieren un dashboard personal
- 📚 Cualquiera que necesite un wiki personal privado
- 🚀 Profesionales que buscan presencia web rápida

## 🤝 Contribuir

Las contribuciones son bienvenidas! Si encuentras un bug o tienes una sugerencia:

1. Abre un Issue describiendo el problema o mejora
2. Haz un Fork del repositorio
3. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

Esto significa que puedes:
- ✅ Usar el código comercialmente
- ✅ Modificar el código como quieras
- ✅ Distribuir el código
- ✅ Usar el código de forma privada

Solo debes:
- Incluir el aviso de copyright
- Incluir la licencia MIT

## 👤 Autor

**Yoel Ferreiro Naya (DrYouu)**
- Website: [dryouu.uk](https://dryouu.uk)
- GitHub: [@DrYouu-Research-Lab](https://github.com/DrYouu-Research-Lab)
- Email: yferreiro@gmail.com

## 🙏 Agradecimientos

- Gracias a la comunidad open source
- Inspirado en las mejores prácticas de diseño web moderno
- Construido con amor y café ☕

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
1. Revisa la [documentación completa](docs/)
2. Busca en los [Issues](https://github.com/DrYouu-Research-Lab/web/issues) existentes
3. Abre un nuevo Issue si no encuentras respuesta
4. Contacta por [email](mailto:yferreiro@gmail.com)

---

**⭐ Si este proyecto te resultó útil, considera darle una estrella en GitHub!**

Hecho con ❤️ por DrYouu
