# Mission Quest

🎉 **Mission Quest**: ¡Una aplicación web para gestionar y visualizar misiones, perfecta para jugadores y organizadores de eventos!

🎮 **Sitio de demostración**: [Demo Mission Quest](https://daviidam.github.io/Mission_Quest)

## ✨ Características principales

🎯 **Únete a la aventura**: Gestiona y realiza un seguimiento de tus misiones con facilidad. Ya sea que estés planeando una fiesta o un evento, Mission Quest te tiene cubierto.

💻 **Personalizable**: Configura tus propias misiones según tus preferencias y las de tu grupo.

💾 **Seguimiento de progreso local**: Tu progreso se guarda automáticamente en el almacenamiento local de tu navegador, permitiendo que múltiples jugadores mantengan un progreso independiente si utilizan navegadores diferentes.

🧠 **Aplicaciones generadas por IA**: Esta aplicación web fue construida como una prueba de concepto, probando las capacidades de las aplicaciones generadas por IA. ¡Se generó en menos de 30 minutos!

## 📁 Capturas de pantalla

<div style="display: flex; flex-direction: row; justify-content: space-between;">
  <div style="display: flex; flex-direction: column; justify-content: space-between;">
    <img src="./docs_assests/main_website.JPG" alt="Sitio web principal" style="width: 300px;">
    <img src="./docs_assests/main_website_1_done.JPG" alt="Descripción de la misión" style="width: 300px;">
  </div>
  <div style="display: flex; flex-direction: column; justify-content: space-between;">
    <img src="./docs_assests/mission_description_website.JPG" alt="Descripción de la misión" style="width: 300px;">
    <img src="./docs_assests/mission_done_website.JPG" alt="Misión completada" style="width: 300px;">
  </div>
</div>

## 📁 Estructura del proyecto

```bash
Mission_Quest/
├── .github/
│   └── workflows/
│       └── deploy.yml # Acción de despliegue en GitHub
├── app/
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── missions/
│       ├── index.json
│       ├── update_index.py
│       └── list/ # Lista de misiones personalizadas
│           ├── 0_custom_mission.json
│           ├── 1_custom_mission.json
│           └── ...
├── README.md
└── DEPLOY.md
```

## ⚙ Personalizar el sitio web

Si estás interesado en usar este proyecto, puedes personalizarlo según tus necesidades.

1. Crea un fork de este proyecto.
2. Modifica el archivo `app/index.html` (líneas 24-31) según tus necesidades. Puedes configurar un título diferente, texto a mostrar, etc.
   ```html
   <div class="container">
    <h1 class="title">Tu título personalizado</h1>
    <p class="intro">Tu texto personalizado</p>
    <p class="intro">Tu texto personalizado</p>
    <p class="intro">Tu texto personalizado</p>
    <p class="level">Nivel actual: <span id="level">0</span></p>
    <div id="missions"></div>
  </div>
   ```
3. Agrega y modifica tus misiones personalizadas en la carpeta `app/missions/list`.
   - Crea tantos archivos JSON como desees. Pero asegúrate de que todos sigan la misma estructura:
      ```json
      {
         "title": "Título deseado",
         "desc": "Descripción deseada",
         "completed": false
      }
      ```
   - Puedes usar cualquier nombre de archivo para cada archivo JSON, pero ten en cuenta que la lista de misiones se ordenará por nombre de archivo.
4. Ejecuta el script `app/missions/update_index.py`. Esto recopilará todos los archivos JSON en la carpeta `app/missions/list` y creará un archivo `index.json` con la lista de misiones.
   ```bash
   make update_index
   ```
   o
   ```bash
   python3 app/missions/update_index.py
   ```
5. Ejecuta la aplicación web localmente.
   - Este paso solo es necesario si deseas probar los cambios que realizaste.
   - Puedes ejecutar la aplicación web localmente usando el siguiente comando:
      ```bash
      make run
      ```
      o
      ```bash
      python3 -m http.server 8000 --directory ./app
      ```
   - Abre tu navegador y ve a [http://localhost:8000](http://localhost:8000)
6. Para poder desplegar la aplicación web, necesitas enviar tus cambios a la rama main de tu repositorio fork.


## 🚀 Desplegar la aplicación

El despliegue de la aplicación web se automatiza usando GitHub Actions desde la rama **main**.

Cuando envíes tus cambios a la rama **main** de tu repositorio fork, se activará la Acción de GitHub y la aplicación web se desplegará en GitHub Pages.

### Habilitar GitHub Pages

GitHub Pages es un servicio gratuito proporcionado por GitHub. Es un servicio de alojamiento de sitios web estáticos que te permite alojar tu sitio web de forma gratuita.

Necesita estar habilitado para tu repositorio fork.

Para habilitar GitHub Pages, sigue estos pasos:

1. Ve a tu repositorio fork en GitHub.
2. Haz clic en la pestaña **Settings** (Configuración).
3. Desplázate hacia abajo hasta la sección **Pages**.
4. En **Source** (Origen), selecciona **Deploy from branch** (Desplegar desde rama), elige la rama **main** y la carpeta **/(root)**.
5. Haz clic en el botón **Save** (Guardar).

### Ver tu sitio web desplegado

Una vez que se complete el despliegue, puedes ver tu sitio web desplegado en la URL proporcionada por GitHub Pages.

Generalmente se ve como el ejemplo a continuación:

```
https://<tu-nombre-de-usuario>.github.io/Mission_Quest
```

Pero si no funciona, ve a la pestaña **Actions** (Acciones) y verifica los registros del último despliegue.


## 💡 Notas
- Asegúrate de tener Python instalado para ejecutar el script de actualización y la web localmente.
   - Hay una carpeta **.devcontainer** en el repositorio que te permite ejecutar la aplicación web localmente usando Visual Studio Code.
- ¡Si tienes alguna pregunta o necesitas ayuda, no dudes en preguntar!
