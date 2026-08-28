# Axoryn Auto

Prototipo e-commerce automotriz estático para demostración. Incluye un catálogo ampliado de referencias reales de fabricantes, pero precios, stock, promociones, contacto y disponibilidad son datos demostrativos: se deben sustituir por información comercial validada antes de publicar.

## Ejecutar localmente

No requiere instalación ni compilación.

```powershell
python -m http.server 8080
```

Abrir `http://127.0.0.1:8080`. También puede abrirse `index.html`, aunque un servidor local permite comprobar todos los recursos con mayor fidelidad.

## Desplegar en Netlify

1. Crear un nuevo sitio en Netlify mediante **Add new site > Deploy manually**.
2. Arrastrar esta carpeta completa, sin comprimir, o conectarla a un repositorio Git.
3. Si se conecta Git, usar directorio de publicación `.` y no configurar comando de build.
4. Asignar el subdominio disponible que se prefiera en Netlify.
5. Verificar el catálogo, recursos e interacción del checkout en el dominio final.

`netlify.toml`, `_headers`, `_redirects` y `404.html` ya están incluidos. Las cabeceras limitan tipos de contenido, framing, referrer y permisos del navegador.

## Pago demo

La interfaz presenta **Webpay Plus Sandbox** como flujo demostrativo. No hay conexión a Transbank, no se solicitan tarjetas ni se efectúan cobros. Para producción se debe implementar un backend que cree la transacción con las credenciales sandbox/producción de Transbank y valide el resultado mediante el endpoint oficial antes de confirmar el pedido.

## Persistencia y reinicio

El carrito, favoritos, perfil y pedidos simulados se guardan solamente en `localStorage`. Para volver al catálogo inicial, borrar los datos del sitio desde las herramientas del navegador.

## Licencias y contenido

El logo Axoryn es un SVG original de este proyecto. Las imágenes de producto son referenciales y cuentan con fallback local; validar licencias, fichas oficiales y fotos propias antes de un lanzamiento comercial.
