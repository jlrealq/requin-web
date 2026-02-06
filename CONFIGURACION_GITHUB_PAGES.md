# Guía de Configuración para GitHub Pages

## ✅ Cambios Realizados

He modificado tu proyecto para que funcione correctamente con GitHub Pages:

### 1. Workflow de GitHub Actions (`.github/workflows/main.yml`)
- ✅ **Eliminado**: Despliegue vía FTP
- ✅ **Agregado**: Despliegue automático a GitHub Pages
- ✅ **Agregado**: Permisos necesarios para escribir en `gh-pages`
- El workflow ahora ejecuta `cerebro.py` y luego publica el `index.html` actualizado

### 2. Script cerebro.py
- ✅ Mejorado el logging para debugging en GitHub Actions
- ✅ Agregada validación de datos de la API
- ✅ Mejor manejo de errores con mensajes específicos

---

## 🚀 Pasos para Activar GitHub Pages

Sigue estos pasos **exactamente** en tu repositorio de GitHub:

### Paso 1: Hacer Push de los Cambios

```bash
cd /Users/jlrealq/Documents/requin-web1
git add .
git commit -m "Configurar GitHub Pages con actualización automática"
git push origin main
```

### Paso 2: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral izquierdo, click en **Pages**
4. En la sección **Source** (Fuente):
   - Selecciona **Deploy from a branch**
   - Branch: selecciona **gh-pages**
   - Folder: selecciona **/ (root)**
5. Click en **Save** (Guardar)

### Paso 3: Esperar el Primer Deploy

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás que el workflow "Robot Noticias e Indicadores" se está ejecutando
3. Espera a que termine (tarda ~1-2 minutos)
4. GitHub Pages tardará otros 1-2 minutos en publicar el sitio

### Paso 4: Verificar el Sitio

Tu sitio estará disponible en:
```
https://[tu-usuario-github].github.io/[nombre-repositorio]/
```

**Deberías ver:**
- ✅ Un ticker superior con indicadores económicos actualizados
- ✅ Sección "Panorama Económico" con noticias del día
- ✅ Todo el contenido correctamente formateado

---

## 🔄 Funcionamiento Automático

El sitio se actualizará automáticamente:

- **Diariamente** a las 8:00 AM (hora Chile)
- **Cada vez** que hagas push a la rama `main`

Los datos se obtienen de:
- Indicadores económicos: `mindicador.cl`
- Noticias: Google News RSS (Chile y Global)

---

## 🧹 Limpieza Opcional

Los siguientes secrets ya **no son necesarios** y pueden eliminarse en Settings → Secrets:
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

---

## ✅ Verificación Local (Opcional)

Si quieres probar localmente antes de hacer push:

```bash
cd /Users/jlrealq/Documents/requin-web1
python cerebro.py
```

Luego abre `index.html` en tu navegador. Deberías ver los datos actualizados.

---

## 🐛 Troubleshooting

### El sitio muestra "Sincronizando..."

**Causa**: El workflow aún no se ha ejecutado o falló.

**Solución**:
1. Ve a Actions en GitHub
2. Revisa los logs del workflow
3. Busca mensajes de error en los pasos "🧠 Ejecutar Cerebro" o "🌐 Deploy to GitHub Pages"

### Los indicadores/noticias no se actualizan

**Causa**: Error al obtener datos de las APIs.

**Solución**:
1. Revisa los logs del workflow en GitHub Actions
2. Busca mensajes que empiecen con `⚠️`
3. Las APIs pueden estar temporalmente caídas - espera al siguiente ciclo (8 AM)

### Error de permisos en GitHub Pages

**Causa**: El token no tiene permisos para escribir.

**Solución**:
1. Ve a Settings → Actions → General
2. En "Workflow permissions", selecciona "Read and write permissions"
3. Guarda y vuelve a ejecutar el workflow

---

## 📞 Soporte

Si encuentras algún problema, revisa:
- Los logs en la pestaña **Actions** de GitHub
- La consola del navegador (F12) para errores de JavaScript
- Que GitHub Pages esté configurado correctamente en Settings → Pages
