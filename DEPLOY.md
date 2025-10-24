# Despliegue del sitio en Windsurf/Netlify

Estos son los comandos recomendados para desplegar tu web manualmente usando la Netlify CLI:

1. Instala la Netlify CLI (si no la tienes):

```bash
npm install -g netlify-cli
```

2. Inicia sesión en Netlify (solo la primera vez):

```bash
netlify login
```

3. Despliega el sitio (desde la raíz del proyecto):

```bash
netlify deploy --prod --site=despedida-gonzo
```

> Si es la primera vez, puedes omitir `--site` y seguir las instrucciones interactivas para asociar el sitio.

---

## Enlaces útiles
- Sitio en producción: https://despedida-francis.windsurf.build/
- Estado del build: https://codeium.com/redirect/deploy/544a7ad3-977e-4279-8336-c04e769b1ba1/status

## Notas
- Asegúrate de estar en la carpeta `/workspaces/Fransis-web` antes de ejecutar los comandos.
- Puedes reclamar el sitio en Netlify para tener control total sobre el mismo.


## Deployment using terminal

1. Use a docker image with node js.
2. execute commands below
```bash
sudo npm install -g netlify-cli
netlify link --name despedida-gonzo
# netlify init # primera vez
netlify deploy # despliegue de prueba
netlify deploy --prod
```
