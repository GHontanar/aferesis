# Guía de Deployment - Calculadora de Aféresis

Esta guía te ayudará a preparar y desplegar tu aplicación en Cloudflare Pages.

## ✅ Lista de Verificación Pre-Deployment

### 1. Configuración de Dominio

- [ ] **robots.txt** (`/public/robots.txt`): Reemplaza `[tudominio]` con tu dominio real
- [ ] **sitemap.xml** (`/public/sitemap.xml`): Actualiza todas las URLs con tu dominio y fecha

### 2. Iconos PWA

La aplicación necesita iconos para funcionar como PWA:

- [ ] Crear `icon-192.png` (192x192px) en `/public/icons/`
- [ ] Crear `icon-512.png` (512x512px) en `/public/icons/`

**Opciones:**
- Usar herramientas como [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- Diseñar iconos personalizados con Figma, Photoshop, GIMP
- Usar iconos placeholder de Material Icons o FontAwesome

### 3. Verificar Build Local

```bash
# Compilar para producción
npm run build

# Verificar que no hay errores
# Preview local
npm run preview

# Abrir http://localhost:4173 y probar:
# - Todas las calculadoras funcionan
# - Navegación entre páginas legales
# - Disclaimer aparece correctamente
# - Footer muestra licencia
# - Responsive en móvil/tablet
```

## 🚀 Deployment en Cloudflare Pages

### Paso 1: Preparar Repositorio Git

```bash
# Asegurarse de que todos los cambios están commiteados
git add .
git commit -m "Preparar para deployment en producción"
git push origin main
```

### Paso 2: Configurar Cloudflare Pages

1. **Iniciar sesión** en [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. **Ir a Pages** en el menú lateral
3. **Crear proyecto** → Conectar con Git
4. **Seleccionar repositorio**: `web-aferesis`
5. **Configurar build**:

```
Build command: npm run build
Build output directory: dist
Root directory: (dejar vacío)
Environment variables: (ninguna necesaria)
```

6. **Build settings avanzados**:
   - Node version: `18` o superior
   - Package manager: `npm`

7. **Deploy**

### Paso 3: Verificar Deployment

Después del primer deploy, verifica:

- [ ] La aplicación carga correctamente
- [ ] El disclaimer aparece en la primera visita
- [ ] Todas las calculadoras funcionan
- [ ] Las páginas legales son accesibles (/terms, /privacy, /legal)
- [ ] El footer muestra correctamente
- [ ] La página 404 funciona
- [ ] Headers de seguridad están activos (puedes verificar con https://securityheaders.com/)

### Paso 4: Configurar Dominio Custom (Opcional)

Si tienes un dominio personalizado:

1. En Cloudflare Pages → Tu proyecto → Custom domains
2. Agregar dominio
3. Configurar DNS según las instrucciones de Cloudflare
4. **Actualizar** los archivos:
   - `public/robots.txt`
   - `public/sitemap.xml`
   - Rebuild el proyecto

## 📝 Post-Deployment

### Verificar SEO

1. **Google Search Console**:
   - Agregar propiedad con tu dominio
   - Verificar propiedad
   - Subir sitemap: `https://tudominio.com/sitemap.xml`

2. **Verificar meta tags**:
   - Usar [Meta Tags](https://metatags.io/)
   - Verificar Open Graph con [Open Graph Debugger](https://www.opengraph.xyz/)

### Monitoreo (Opcional)

Cloudflare Pages proporciona:
- Analytics de tráfico
- Logs de build
- Métricas de rendimiento

## 🔧 Troubleshooting

### Build falla

```bash
# Limpiar cache de npm
npm clean-install

# Verificar versión de Node
node --version  # Debe ser >= 18

# Build local para debug
npm run build
```

### Rutas no funcionan (404 en páginas internas)

- Verificar que existe `public/_redirects`
- Contenido debe ser: `/* /index.html 200`

### Headers de seguridad no funcionan

- Verificar que existe `public/_headers`
- Cloudflare Pages copia automáticamente estos archivos al build

### PWA no funciona

- Verificar que los iconos existen en `/public/icons/`
- Verificar que `manifest.json` está siendo servido
- Usar Chrome DevTools → Application → Manifest para debug

## 📊 Métricas de Performance

Tu bundle actual:
- `index.html`: ~2 KB
- `CSS`: ~0.5 KB
- `JS`: ~553 KB (167 KB gzipped)

La advertencia sobre chunk size es normal con Material-UI. Para optimizar en el futuro:

```javascript
// En vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'mui': ['@mui/material', '@mui/icons-material'],
        'router': ['react-router-dom']
      }
    }
  }
}
```

## 🆕 Updates Futuros

Para actualizar la aplicación:

1. Hacer cambios localmente
2. Probar: `npm run build && npm run preview`
3. Commit y push a Git
4. Cloudflare Pages rebuilds automáticamente
5. Verificar deployment en la URL de preview
6. Si todo OK, promover a producción

## 📞 Soporte

- Documentación Cloudflare Pages: https://developers.cloudflare.com/pages/
- Community Forum: https://community.cloudflare.com/

---

¡Buena suerte con tu deployment! 🚀

## 📨 Formulario de feedback (Resend)

El botón de feedback envía a `POST /api/feedback`, una Cloudflare Pages Function
(`functions/api/feedback.js`) que manda el correo con Resend:

- **Remitente**: `avisos@ghontanar.com` (dominio verificado en Resend)
- **Destinatario**: `privacidad@ghontanar.com`
- **Reply-To**: el email del usuario, si lo indica

### Configuración

1. En Resend → **API Keys** → *Create API Key*: permiso **Sending access**,
   dominio `ghontanar.com`.
2. En Cloudflare → Pages → proyecto → **Settings → Variables and Secrets**:
   añadir `RESEND_API_KEY` como **Secret** (tipo *encrypted*) en **Production**
   (y en **Preview** si quieres probar desde `dev`).
3. Volver a desplegar: los secrets solo se aplican en despliegues nuevos.

Sin `RESEND_API_KEY` el endpoint responde 500 y el formulario muestra un error.

### Desarrollo local

Crear `.dev.vars` (ignorado por git) con `RESEND_API_KEY=re_...` y ejecutar:

```bash
npm run build
npx wrangler pages dev dist
```

### Anti-spam

- Honeypot (campo oculto `website`): los envíos que lo rellenan se descartan en silencio.
- Solo acepta peticiones con `Origin` de la propia web.
- Rate limit en memoria: 5 envíos / 10 min por IP. Es por isolate (best-effort);
  para un límite global, añadir una regla de **Rate limiting** en Cloudflare WAF
  sobre `/api/feedback`.
