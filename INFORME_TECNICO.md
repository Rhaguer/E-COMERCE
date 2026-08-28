# Informe técnico — Axoryn Auto

Fecha: 27 de agosto de 2026  
Estado: prototipo estático preparado para Netlify

## Resumen ejecutivo

Se evolucionó la tienda hacia una experiencia e-commerce automotriz integral bajo la marca original **Axoryn Auto**. La marca fue escogida por su construcción distintiva y una búsqueda web básica no mostró una tienda automotriz homónima; esto no sustituye una búsqueda marcaria o de dominio formal. Se creó un logo SVG original y una identidad con azul profundo, turquesa técnico, naranja de acción y tonos neutros.

## Mejoras incluidas

- Catálogo ampliado a 20 productos con referencias de marcas reales como Bosch, MANN-FILTER, Brembo, Castrol, TRW, Denso, OSRAM, Foxwell y Sony.
- Buscador predictivo, filtros por categoría, marca, precio, stock y oferta; ordenamiento y recuperación de estado vacío.
- Fichas con especificaciones, compatibilidad, productos relacionados, favoritos, reciente navegación y reseñas demostrativas.
- Carrito persistente, límite por inventario, cálculo de despacho, retiro, formulario de checkout con validación de RUT y perfil del cliente.
- Promociones, contador de ofertas, aviso de últimas unidades y popup de oferta de último minuto con opción de no volver a mostrar.
- Panel de administración del prototipo para productos, inventario, promociones, pedidos e importación/exportación.
- Navegación responsive, diálogos con roles, foco visible, mensajes en vivo, texto alternativo y microinteracciones.
- Nueva sección superior **Tecnologías** con el uso resumido de cada componente.

## Arquitectura y stack

| Capa | Implementación | Uso |
| --- | --- | --- |
| Presentación | HTML5 + CSS3 | Semántica, diseño responsive, componentes y animaciones. |
| Comportamiento | JavaScript ES2022 | Estado, catálogo, filtros, formularios, checkout y panel demo. |
| Persistencia | `localStorage` | Carrito, favoritos, perfil, pedidos y catálogo del navegador. |
| Identidad | SVG | Logotipo vectorial original e iconos livianos. |
| Hosting | Netlify | Hosting estático, cabeceras, redirecciones y 404. |

## UX y accesibilidad

La navegación prioriza búsqueda, categorías y acciones de compra. El diseño colapsa correctamente en tablet y móvil, los botones tienen etiquetas accesibles, los modales declaran su rol y el área de notificaciones usa `aria-live`. La compatibilidad del vehículo se expone claramente en cada producto como una verificación necesaria antes de compra.

## Seguridad y pago

`netlify.toml` entrega cabeceras de protección básicas. Se evita almacenar datos de tarjeta o credenciales. El pago actual es un **simulador local de Webpay Plus Sandbox**: registra una orden de demostración y no contacta una entidad financiera. Un lanzamiento real requiere backend, autenticación, base de datos, creación de transacción desde servidor, validación del callback oficial, registro auditable y correo transaccional.

## Limitaciones conocidas

- Los precios, stock, pedidos, reseñas y promociones son demostrativos.
- Las referencias de producto no equivalen a disponibilidad, precio ni compatibilidad garantizada; se debe validar por VIN/OEM y fuente oficial.
- No existe inventario centralizado, usuarios autenticados, pago real, despacho conectado ni base de datos remota.
- Las imágenes externas deben revisarse por licencia y reemplazarse por activos propios o autorizados para uso comercial.

## Despliegue

La carpeta se publica directamente en Netlify sin build. Consultar `README.md` para los pasos. Antes de producción: asignar dominio propio, actualizar metadatos/URLs, cargar catálogo y políticas reales, reemplazar contactos demo y construir la integración de pagos server-side.
