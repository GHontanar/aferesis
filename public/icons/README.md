# Iconos de la Aplicación

## ✅ Estado Actual

**Icono incluido:** `icon.svg` - Icono SVG simple con cruz médica y letra "A"

El icono actual es un placeholder funcional que:
- ✅ Funciona en todos los navegadores modernos
- ✅ Se escala a cualquier tamaño
- ✅ Usa los colores de la marca (#2563EB)
- ⚠️ Es básico y puede mejorarse

## 🎨 Mejorar el Icono (Opcional)

### Opción 1: Convertir el SVG actual a PNG

Usa una herramienta online:
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Convertio](https://convertio.co/svg-png/)

Tamaños necesarios: 192x192 y 512x512

### Opción 2: Diseñar uno nuevo

Herramientas recomendadas:
- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon Generator](https://realfavicongenerator.net/)
- Figma, Canva, o cualquier editor gráfico

### Opción 3: Usar iconos profesionales

Sitios con iconos médicos:
- [Flaticon](https://www.flaticon.com/) (buscar "medical", "blood", "hospital")
- [Font Awesome](https://fontawesome.com/) (iconos médicos)
- [Material Icons](https://fonts.google.com/icons)

## 📝 Cómo reemplazar

1. Crea tus nuevos iconos PNG (192x192 y 512x512)
2. Guárdalos como `icon-192.png` y `icon-512.png` en este directorio
3. Actualiza `manifest.json` para usar PNG en lugar de SVG
4. Commit y push:
   ```bash
   git add public/icons/ public/manifest.json
   git commit -m "Update PWA icons"
   git push
   ```

El icono SVG actual es perfectamente funcional para producción. Mejóralo cuando tengas tiempo.
