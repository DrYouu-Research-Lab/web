# 📦 Guía de Migración al Nuevo Sistema

## Resumen Ejecutivo

Has recibido una nueva arquitectura profesional para tu sitio web que incluye:
- ✅ **Sistema de configuración basado en JSON**
- ✅ **Autenticación avanzada** (WebAuthn/Passkey + OAuth2)
- ✅ **Código modular y organizado**
- ✅ **Documentación completa**

## Estado Actual

### ✅ Completado

```
✅ Configuraciones creadas (config/*.json)
✅ Código fuente modularizado (src/js/*)
✅ Autenticación avanzada implementada
✅ Componentes UI creados
✅ Documentación completa (40KB+)
✅ Página de login de ejemplo
```

### ⏳ Pendiente

```
⏳ Actualizar páginas HTML existentes
⏳ Probar sistema completo
⏳ Migrar datos a configs
⏳ Opcional: Implementar backend
```

## Opciones de Migración

### Opción 1: Convivencia (Recomendada para empezar) 🟢

**Ventajas:**
- Sin riesgos
- Puedes probar el nuevo sistema
- Fácil rollback
- Migración gradual

**Cómo:**

1. **Mantén el sitio actual funcionando**
2. **Prueba el nuevo login:** `/public/login-new.html`
3. **Si funciona bien:** Renombra archivos
   ```bash
   mv public/login.html public/login-old.html
   mv public/login-new.html public/login.html
   ```
4. **Actualiza otras páginas gradualmente**

### Opción 2: Migración Completa 🔵

**Para usuarios más técnicos:**

1. Backup completo
2. Actualizar todos los HTML
3. Migrar datos a configs
4. Probar exhaustivamente
5. Eliminar código antiguo

### Opción 3: Solo Usar Configs (Híbrido) 🟡

**Usar las configs sin cambiar auth:**

1. Mantén la autenticación actual (`assets/js/main.js`)
2. Usa solo `config/*.json` para datos
3. Carga configs con JavaScript
4. Renderiza contenido dinámicamente

## Paso a Paso: Migración Gradual

### Fase 1: Preparación (5 minutos)

1. **Hacer backup:**
```bash
cd /ruta/a/tu/web
cp -r . ../web-backup-$(date +%Y%m%d)
```

2. **Verificar archivos nuevos:**
```bash
ls config/          # Debe mostrar 5 archivos .json
ls src/js/          # Debe mostrar auth/, components/, services/
```

3. **Probar que configs cargan:**
- Abre: `/public/login-new.html`
- Abre Console (F12)
- No debe haber errores críticos

### Fase 2: Personalizar Configs (10 minutos)

1. **Editar `config/site.json`:**
```bash
nano config/site.json
```
   - Cambia `site.name`, `site.author`
   - Cambia `hero.title`, `hero.description`
   - Actualiza `contact.email`

2. **Editar `config/auth.json`:**
```bash
nano config/auth.json
```
   - Cambia `demo.credentials.username`
   - Cambia `demo.credentials.password`

3. **Verificar JSON válido:**
   - Usa https://jsonlint.com/

### Fase 3: Actualizar Login (5 minutos)

**Opción A: Reemplazar directamente**
```bash
cd public/
mv login.html login-old.html
mv login-new.html login.html
```

**Opción B: Probar primero**
- Visita `/public/login-new.html`
- Prueba login con credenciales del config
- Si funciona, entonces reemplaza

### Fase 4: Actualizar Otras Páginas (Opcional)

Para cada página que quieras actualizar:

1. **Añadir scripts nuevos:**
```html
<!-- Antes del </body> -->
<script src="/src/js/services/config-loader.js"></script>
<script src="/src/js/auth/auth-manager.js"></script>
<script src="/src/js/components/content-renderer.js"></script>
<script src="/src/js/app.js"></script>
```

2. **Inicializar sistema:**
```html
<script>
// Después de cargar los módulos
document.addEventListener('DOMContentLoaded', async () => {
  // El sistema se auto-inicializa via app.js
});
</script>
```

### Fase 5: Migrar Datos a Configs (Opcional)

Si quieres usar el sistema de renderizado dinámico:

**Ejemplo: Projects Page**

**Antes (hardcoded):**
```html
<div class="project-card">
  <h3>Mi Proyecto</h3>
  <p>Descripción...</p>
</div>
```

**Después (config-driven):**

1. Añadir a `config/projects.json`:
```json
{
  "projects": [
    {
      "id": "mi-proyecto",
      "title": "Mi Proyecto",
      "description": "Descripción...",
      ...
    }
  ]
}
```

2. En HTML:
```html
<div id="projectsGrid"></div>

<script>
(async () => {
  const config = await configLoader.load('projects');
  ContentRenderer.renderProjects(
    config.projects,
    document.getElementById('projectsGrid')
  );
})();
</script>
```

## Checklist de Migración

### Pre-Migración
- [ ] Backup completo realizado
- [ ] Verificar archivos nuevos existen
- [ ] Configuraciones personalizadas
- [ ] JSON validado

### Migración
- [ ] Login actualizado y probado
- [ ] Autenticación funciona
- [ ] WebAuthn probado (si aplica)
- [ ] Páginas críticas actualizadas

### Post-Migración
- [ ] Todas las páginas funcionan
- [ ] Login/logout funciona
- [ ] Contenido se muestra correctamente
- [ ] No hay errores en Console
- [ ] Backup antiguo guardado
- [ ] Documentación leída

## Testing

### Probar Autenticación Local

1. Ir a `/public/login.html` (o `login-new.html`)
2. Ingresar credenciales del `config/auth.json`
3. Debe redirigir a `/private/dashboard.html`
4. Verificar sesión persiste (refresh)
5. Logout funciona

### Probar WebAuthn (si disponible)

1. HTTPS debe estar activo (o localhost)
2. Click en "🔐 Configurar Passkey"
3. Ingresar username
4. Seguir prompt biométrico
5. Debe mostrar "Passkey registrado"
6. Cerrar sesión
7. Login con "🔐 Passkey / Biometric"
8. Debe autenticar con biometría

### Probar Config Loading

Abrir Console (F12) y ejecutar:
```javascript
// Probar carga de config
configLoader.load('site').then(config => {
  console.log('Site config:', config);
});

// Probar acceso a valores
configLoader.load('site').then(config => {
  const name = configLoader.get(config, 'site.name');
  console.log('Site name:', name);
});
```

## Troubleshooting

### "Failed to load config: site (404)"

**Causa:** Archivo no existe o ruta incorrecta

**Solución:**
```bash
# Verificar archivo existe
ls config/site.json

# Verificar desde navegador
curl http://localhost:8000/config/site.json
```

### "WebAuthn is not supported"

**Causa:** No estás en HTTPS o navegador no compatible

**Solución:**
- Usar HTTPS (o localhost para dev)
- Verificar navegador compatible (Chrome, Edge, Safari)

### Página en blanco después de migración

**Causa:** Error de JavaScript

**Solución:**
1. Abrir Console (F12)
2. Revisar errores rojos
3. Verificar orden de carga de scripts
4. Asegurar que todos los archivos existen

### Autenticación no funciona después de migración

**Causa:** Configs no cargadas o credenciales incorrectas

**Solución:**
1. Verificar `config/auth.json` existe
2. Verificar credenciales correctas
3. Limpiar localStorage: `localStorage.clear()`
4. Recargar página

## Rollback (Si algo sale mal)

### Opción 1: Rollback Rápido

Si renombraste archivos:
```bash
cd public/
mv login.html login-new.html
mv login-old.html login.html
```

### Opción 2: Restaurar Backup

```bash
cd /ruta/a/
rm -rf web
mv web-backup-YYYYMMDD web
```

### Opción 3: Git Reset

Si usas Git:
```bash
git reset --hard HEAD~1  # Volver 1 commit atrás
```

## Soporte Post-Migración

### Si tienes problemas:

1. **Revisar documentación:**
   - [QUICK_SETUP.md](QUICK_SETUP.md)
   - [NEW_ARCHITECTURE.md](NEW_ARCHITECTURE.md)
   - [SECURITY_CONFIG.md](SECURITY_CONFIG.md)

2. **Debugging:**
   - Abrir Console (F12)
   - Revisar Network tab
   - Buscar errores rojos

3. **Contacto:**
   - 📧 Email: lab@dryouu.uk
   - 🐛 Issues: GitHub Issues
   - 📚 Docs: `/docs/` directory

## Próximos Pasos Después de Migración

### Corto Plazo
1. ✅ Verificar todo funciona
2. ✅ Personalizar más configs
3. ✅ Añadir tus proyectos reales
4. ✅ Probar en móvil

### Mediano Plazo
1. Habilitar OAuth2 (Google/GitHub)
2. Configurar WebAuthn para usuarios
3. Añadir más artículos a wiki
4. Personalizar estilos

### Largo Plazo
1. Implementar backend real
2. Base de datos para usuarios
3. Analytics y monitorización
4. Funcionalidades adicionales

## Recursos

### Documentación Completa
- 📖 [NEW_ARCHITECTURE.md](NEW_ARCHITECTURE.md) - Arquitectura completa
- 🚀 [QUICK_SETUP.md](QUICK_SETUP.md) - Setup rápido
- 🔒 [SECURITY_CONFIG.md](SECURITY_CONFIG.md) - Configuración de seguridad
- 📝 [ARCHITECTURE_README.md](../ARCHITECTURE_README.md) - Overview

### Herramientas Útiles
- [JSONLint](https://jsonlint.com/) - Validar JSON
- [Can I Use](https://caniuse.com/?search=webauthn) - Compatibilidad WebAuthn
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Test HTTPS

---

**🎉 ¡Buena suerte con tu migración!**

Recuerda: La migración es gradual. No tienes que hacerlo todo de una vez.
