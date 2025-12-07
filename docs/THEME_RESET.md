# Restablecer Tema y Contenido desde la Rama Principal

Este documento explica cómo reemplazar el contenido generado con el contenido de la rama principal, sin conservar los ajustes de tema hechos por el usuario.

## Objetivo

Revertir todas las personalizaciones de tema guardadas localmente y restaurar el tema predeterminado del sitio desde el repositorio principal.

## Métodos de Restablecimiento

### Método 1: Restablecimiento Completo (Usuario Final)

Para usuarios que visitan el sitio y quieren restablecer su configuración de tema:

1. **Limpiar localStorage del navegador:**
   - Abre las DevTools del navegador (F12)
   - Ve a la pestaña "Application" o "Almacenamiento"
   - Busca "Local Storage" → selecciona el dominio del sitio
   - Elimina las claves relacionadas con el tema:
     - `theme`
     - `dryouu_session` (si quieres también limpiar la sesión)
   - Recarga la página (F5)

2. **Usar el modo incógnito:**
   - Abre una ventana en modo incógnito/privado
   - El sitio se cargará con la configuración predeterminada
   - No se conservarán preferencias de tema

3. **Limpiar caché y cookies:**
   - Chrome: `Ctrl + Shift + Del` → Selecciona "Cookies y otros datos de sitios" y "Archivos e imágenes en caché"
   - Firefox: `Ctrl + Shift + Del` → Selecciona "Cookies" y "Caché"
   - Safari: Menú Safari → Preferencias → Privacidad → "Gestionar datos de sitios web"

### Método 2: Revertir Cambios de Código (Desarrollador)

Para desarrolladores que quieren revertir cambios locales y obtener el código limpio de la rama principal:

```bash
# 1. Asegúrate de estar en la rama principal
git checkout main

# 2. Descarta todos los cambios locales no guardados
git reset --hard origin/main

# 3. Elimina archivos no rastreados (opcional)
git clean -fd

# 4. Actualiza desde el remoto
git pull origin main

# 5. Si tienes cambios en rama feature, puedes recrearla
git checkout -b nueva-feature
```

### Método 3: Clonar de Nuevo el Repositorio

Si quieres empezar completamente limpio:

```bash
# 1. Elimina el directorio actual (guarda backup si necesitas)
cd ..
rm -rf web

# 2. Clona de nuevo desde GitHub
git clone https://github.com/DrYouu-Research-Lab/web.git
cd web

# 3. Ya tienes una copia limpia de la rama principal
```

## Archivos que Controlan el Tema

Los siguientes archivos contienen la configuración del tema predeterminado:

- **`assets/css/styles.css`** - Variables CSS y estilos del tema
- **`src/css/enhanced-styles.css`** - Estilos adicionales
- **`assets/js/main.js`** - Lógica de gestión de temas (líneas 296-348)

### Variables CSS Principales

El tema está definido en las variables CSS en `assets/css/styles.css`:

```css
:root {
  /* Primary Colors - Landing Page Theme */
  --primary-bg: #050816;
  --primary-text: #e5e7eb;
  --primary-accent: #3b82f6;
  
  /* Secondary Colors - Personal Section Theme */
  --secondary-bg: #0f172a;
  --secondary-text: #e2e8f0;
  --secondary-accent: #8b5cf6;
  
  /* Private Area Theme */
  --private-bg: #111827;
  --private-text: #f9fafb;
  --private-accent: #10b981;
  
  /* Wiki Theme */
  --wiki-bg: #f8fafc;
  --wiki-text: #1e293b;
  --wiki-accent: #0ea5e9;
}
```

## Deshabilitar Persistencia de Tema

Si quieres deshabilitar completamente la funcionalidad de guardar preferencias de tema:

### Opción 1: Comentar el código de persistencia

En `assets/js/main.js`, líneas 313-316:

```javascript
loadTheme() {
  // const savedTheme = localStorage.getItem('theme') || CONFIG.THEMES.default;
  // Siempre usar tema predeterminado:
  const savedTheme = CONFIG.THEMES.default;
  this.applyTheme(savedTheme);
}
```

Y en líneas 322-326:

```javascript
applyTheme(theme) {
  this.currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  // localStorage.setItem('theme', theme); // Comentado - no guardar
}
```

### Opción 2: Eliminar botones de cambio de tema

Busca y elimina o comenta todos los elementos con clase `theme-toggle` en las páginas HTML.

## Verificar Restablecimiento

Después de restablecer, verifica que:

1. ✅ El tema visual es el oscuro predeterminado
2. ✅ No hay datos en localStorage relacionados con el tema
3. ✅ La navegación funciona correctamente
4. ✅ Los botones tienen el estilo correcto (azul primario)
5. ✅ No hay errores en la consola del navegador

## Script de Limpieza Automática

Puedes añadir este código a la consola del navegador para limpiar automáticamente:

```javascript
// Limpiar todas las preferencias guardadas
localStorage.removeItem('theme');
localStorage.removeItem('dryouu_session');

// Recargar página
window.location.reload();
```

O crear un botón de "Restablecer" en el sitio que ejecute:

```javascript
function resetTheme() {
  if (confirm('¿Seguro que quieres restablecer el tema predeterminado?')) {
    localStorage.removeItem('theme');
    window.location.reload();
  }
}
```

## Notas de Seguridad

- Al limpiar localStorage, también se eliminará cualquier sesión activa
- Esto no afecta a las cookies de terceros ni a datos del servidor
- Es seguro realizar estas operaciones; solo afectan al almacenamiento local del navegador

## Soporte

Si tienes problemas para restablecer el tema, contacta a:
- **Email:** lab@dryouu.uk
- **GitHub Issues:** https://github.com/DrYouu-Research-Lab/web/issues

---

**Última actualización:** 2024-12-07
