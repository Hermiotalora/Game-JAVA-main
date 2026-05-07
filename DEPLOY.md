# Despliegue en Cloudflare Pages

Este proyecto es un sitio estático de HTML y JavaScript. Para publicarlo en Cloudflare Pages, sigue estos pasos:

## 1. Subir el proyecto a GitHub
1. Crea un repositorio en GitHub.
2. Sube los archivos `index.html`, `game.js` y `DEPLOY.md` (y cualquier otro archivo del proyecto).
3. Empuja los cambios al repositorio remoto.

## 2. Conectar el repositorio a Cloudflare Pages
1. Ve a https://pages.cloudflare.com y accede con tu cuenta.
2. Haz clic en **Create a project**.
3. Conecta tu cuenta de GitHub y selecciona el repositorio donde esté este proyecto.
4. En el asistente de configuración, deja los valores por defecto si no tienes un proceso de build. Este proyecto no necesita build, así que puedes dejar el directorio raíz (`/`) y no especificar comandos de build.

## 3. Configurar y desplegar
1. Revisa que el directorio de salida sea la raíz del repositorio (`/`).
2. Haz clic en **Save and Deploy**.
3. Cloudflare Pages desplegará tu sitio automáticamente.

## 4. URL del sitio
Después de desplegar, el sitio quedará disponible en un dominio como:

```
https://<nombre-del-proyecto>.pages.dev
```

Por ejemplo, si usas `game-java-main` como nombre del proyecto, la URL podría ser:

```
https://game-java-main.pages.dev
```

Si eliges un nombre personalizado, ese será el dominio que aparezca.

## 5. Nota adicional
Si quieres cambiar el nombre del proyecto para obtener una URL más amigable, hazlo cuando crees el proyecto en Cloudflare Pages.

---

### Resumen rápido
- Repositorio GitHub: sube `index.html` y `game.js`
- Cloudflare Pages: conecta tu repo
- URL final: `https://<nombre-del-proyecto>.pages.dev`
