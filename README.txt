NexoTorque
==========

E-commerce automotriz interactivo y autocontenido orientado a repuestos, mantenimiento, diagnóstico y tecnología vehicular.

Ejecución recomendada
---------------------
1. Descomprimir la carpeta completa.
2. Abrir una terminal dentro de NexoTorque_Store.
3. Ejecutar: python -m http.server 8080
4. Abrir en Chrome o Edge: http://127.0.0.1:8080

También puede abrirse index.html directamente, aunque un servidor local ofrece un comportamiento más consistente para recursos web.

Funciones principales
---------------------
- Identidad visual NexoTorque con logotipo vectorial propio.
- Banner automotriz y banner dinámico de oferta destacada.
- Catálogo inicial de 12 productos con SKU, marca, categoría, precio CLP, oferta, stock, compatibilidad y especificaciones.
- Fotografías referenciales remotas de componentes automotrices con respaldo gráfico local si una imagen externa no responde.
- Búsqueda predictiva por producto, SKU, marca, categoría y compatibilidad.
- Filtros, ordenamiento, categorías, destacados, ofertas, favoritos e historial.
- Carrito persistente mediante localStorage y límite de cantidad según stock.
- Checkout con validación de RUT chileno, correo, teléfono, entrega y medio de pago seleccionado.
- Creación local de pedidos, descuento automático de inventario e historial en Mi cuenta.
- Gestión de tienda integrada: indicadores, productos, inventario, ofertas y pedidos.
- Alta, edición, publicación y eliminación de productos.
- Carga de imágenes desde archivo o URL.
- Creación y retiro de ofertas con fecha de vigencia.
- Cambio de estado de pedidos.
- Importación/exportación del catálogo en JSON y exportación de pedidos en CSV.
- TorqueBot conectado al estado actual del catálogo: precios, ofertas, stock, SKU, marcas, categorías, compatibilidad, despacho, garantías y pedidos.
- Persistencia local de carrito, favoritos, productos, pedidos, perfil e historial.
- Diseño responsive para escritorio, tablet y móvil.

Persistencia
------------
La información generada por el usuario se conserva en localStorage del navegador utilizado. Si se eliminan los datos del sitio o se utiliza otro navegador/perfil, ese estado local no se comparte.

Límite técnico del paquete
--------------------------
El proyecto no contiene backend, base de datos remota ni credenciales de una pasarela bancaria. El flujo de compra registra pedidos y descuenta inventario dentro de la aplicación local, pero una operación productiva requeriría servicios de servidor, autenticación, base de datos, integración de pago, correo transaccional, seguridad y despliegue.
