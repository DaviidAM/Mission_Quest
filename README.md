# Fransis Web

¡Bienvenido/a a Fransis Web! Este proyecto es una aplicación web para gestionar y visualizar misiones para una fiesta.

## 🚀 Cómo lanzar la aplicación web

Puedes lanzar la aplicación de forma local utilizando un servidor simple. Aquí tienes dos formas recomendadas:

### Opción 1: Usando Python (recomendado por su sencillez)

1. Abre una terminal en la carpeta principal del proyecto:
   ```
   cd /<path_to_repo>
   ```
2. Ejecuta el siguiente comando:
   ```
   python3 -m http.server 8000
   ```
3. Abre tu navegador y ve a [http://localhost:8000](http://localhost:8000)

## 🔄 Cómo refrescar las misiones (`index.json`)

Cuando agregues, elimines o modifiques archivos de misión (`.json`) en la carpeta `missions`, debes actualizar el archivo `index.json` para reflejar los cambios. Para esto, ejecuta el script `update_index.py`:

1. Abre una terminal y navega a la carpeta de misiones:
   ```
   cd /<path_to_repo>/missions
   ```
2. Ejecuta el script:
   ```
   python3 update_index.py
   ```
3. El archivo `index.json` se actualizará automáticamente con la lista de archivos de misión.

## 📁 Estructura del proyecto

```
Fransis-web/
├── index.html
├── app.js
├── missions/
│   ├── index.json
│   ├── update_index.py
│   ├── <otras_misiones>.json
└── README.md
```

## 💡 Notas
- Asegúrate de tener Python instalado para ejecutar el script de actualización.
- Si tienes dudas o necesitas ayuda, ¡no dudes en preguntar!
