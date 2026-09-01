/* Extensiones demostrativas del prototipo Axoryn: datos y operaciones locales. */
(() => {
  const PC = {
    addresses: "axoryn.local.addresses.v1",
    chat: "axoryn.chat.history.v1",
    metrics: "axoryn.analytics.v1",
    account: "axoryn.local.accounts.v1"
  };
  const pcRead = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const pcWrite = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const pcMoney = value => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value || 0);
  const pcEscape = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  const pcMetrics = () => pcRead(PC.metrics, { views: {}, adds: 0, checkoutStarts: 0, conversions: 0 });
  const pcTrack = (name, value) => {
    const metrics = pcMetrics();
    if (name === "view") metrics.views[value] = (metrics.views[value] || 0) + 1;
    else metrics[name] = (metrics[name] || 0) + 1;
    pcWrite(PC.metrics, metrics);
  };

  products.forEach((product, index) => {
    if (product.variants) return;
    const baseStock = Math.max(2, Number(product.stock || 9));
    product.variants = [
      { color: index % 2 ? "Grafito" : "Negro", size: product.category === "Iluminación" ? "Única" : "S", stock: Math.ceil(baseStock * .35) },
      { color: index % 3 ? "Rojo torque" : "Azul eléctrico", size: product.category === "Iluminación" ? "Única" : "M", stock: Math.ceil(baseStock * .4) },
      { color: "Titanio", size: product.category === "Iluminación" ? "Única" : "L", stock: Math.max(1, Math.floor(baseStock * .25)) }
    ];
    product.gallery = [product.image, product.image, product.image];
  });

  const pcOriginalOpenProduct = openProduct;
  openProduct = function (id) {
    pcTrack("view", id);
    pcOriginalOpenProduct(id);
    const product = products.find(item => item.id === id);
    const content = document.querySelector("#productModalContent");
    if (!product || !content || content.querySelector(".axpc-product-tools")) return;
    let selected = product.variants[0];
    const tools = document.createElement("section");
    tools.className = "axpc-product-tools";
    tools.innerHTML = `
      <div class="axpc-gallery" aria-label="Galería del producto">
        <button class="axpc-main-image" type="button" aria-label="Ampliar imagen"><img src="${product.image}" alt="${pcEscape(product.name)}"></button>
        <div class="axpc-thumbnails">${product.gallery.map((image, index) => `<button type="button" class="${index === 0 ? "is-active" : ""}" data-image="${pcEscape(image)}" aria-label="Ver imagen ${index + 1}"><img src="${image}" alt="Vista ${index + 1}"></button>`).join("")}</div>
      </div>
      <div class="axpc-variant-area">
        <div class="axpc-option-title"><span>Color y variante</span><strong class="axpc-stock"></strong></div>
        <div class="axpc-variants">${product.variants.map((variant, index) => `<button type="button" class="${index === 0 ? "is-selected" : ""}" data-variant="${index}">${pcEscape(variant.color)} · ${pcEscape(variant.size)}</button>`).join("")}</div>
        <p class="axpc-size-guide"><button type="button" class="axpc-guide-trigger">Guía de medidas</button><span> · Selecciona una variante antes de añadir.</span></p>
      </div>
      <div class="axpc-share-row"><button type="button" class="axpc-share">↗ Compartir producto</button><span class="axpc-share-status" aria-live="polite"></span></div>`;
    content.insertBefore(tools, content.firstChild);
    const updateVariant = () => {
      tools.querySelector(".axpc-stock").textContent = selected.stock <= 3 ? `Últimas ${selected.stock} unidades` : `${selected.stock} unidades disponibles`;
      tools.querySelectorAll("[data-variant]").forEach(button => button.classList.toggle("is-selected", Number(button.dataset.variant) === product.variants.indexOf(selected)));
    };
    updateVariant();
    tools.addEventListener("click", async event => {
      const variantButton = event.target.closest("[data-variant]");
      const imageButton = event.target.closest("[data-image]");
      if (variantButton) { selected = product.variants[Number(variantButton.dataset.variant)]; updateVariant(); }
      if (imageButton) {
        tools.querySelector(".axpc-main-image img").src = imageButton.dataset.image;
        tools.querySelectorAll("[data-image]").forEach(button => button.classList.toggle("is-active", button === imageButton));
      }
      if (event.target.closest(".axpc-main-image")) tools.querySelector(".axpc-gallery").classList.toggle("is-zoomed");
      if (event.target.closest(".axpc-guide-trigger")) {
        alert("Guía demo: S (88–94 cm), M (95–102 cm), L (103–110 cm). Para accesorios de vehículo, confirma siempre compatibilidad con tu modelo.");
      }
      if (event.target.closest(".axpc-share")) {
        const shareData = { title: product.name, text: `${product.name} en Axoryn Auto`, url: location.href.split("#")[0] + `#product-${product.id}` };
        try { if (navigator.share) await navigator.share(shareData); else await navigator.clipboard.writeText(shareData.url); tools.querySelector(".axpc-share-status").textContent = "Enlace listo para compartir."; }
        catch { tools.querySelector(".axpc-share-status").textContent = "No se pudo compartir ahora."; }
      }
    });
    const addButton = document.querySelector("#detailAddBtn");
    if (addButton) {
      const freshButton = addButton.cloneNode(true);
      addButton.replaceWith(freshButton);
      freshButton.addEventListener("click", () => {
        if (selected.stock < 1) return alert("Esta variante no tiene stock disponible.");
        const previousQuantity = state.cart.find(item => item.id === id)?.qty || 0;
        addToCart(id);
        const line = state.cart.find(item => item.id === id);
        if (!line || line.qty === previousQuantity) return;
        selected.stock -= 1;
        line.variant = `${selected.color} · ${selected.size}`;
        saveAll();
        updateVariant();
      });
    }
  };

  const pcOriginalAddToCart = addToCart;
  addToCart = function (...args) { pcTrack("adds"); return pcOriginalAddToCart(...args); };

  function pcAddresses() { return pcRead(PC.addresses, []); }
  function pcRenderAddresses(host) {
    const addresses = pcAddresses();
    host.innerHTML = `<h3>Mis direcciones</h3><p class="axpc-muted">Se guardan solamente en este navegador para la demostración.</p>
      <div class="axpc-address-list">${addresses.length ? addresses.map(address => `<article><strong>${pcEscape(address.label)}</strong><span>${pcEscape(address.street)}, ${pcEscape(address.city)}</span><button type="button" data-delete-address="${address.id}">Eliminar</button></article>`).join("") : "<p>Aún no tienes direcciones guardadas.</p>"}</div>
      <form class="axpc-address-form"><input name="label" required placeholder="Casa, trabajo…"><input name="street" required placeholder="Dirección y número"><input name="city" required placeholder="Comuna / ciudad"><button>Guardar dirección</button></form>`;
    host.querySelector(".axpc-address-form").addEventListener("submit", event => {
      event.preventDefault(); const form = new FormData(event.currentTarget);
      const next = [...pcAddresses(), { id: `addr-${Date.now()}`, label: form.get("label"), street: form.get("street"), city: form.get("city") }];
      pcWrite(PC.addresses, next); pcRenderAddresses(host);
    });
    host.addEventListener("click", event => {
      const button = event.target.closest("[data-delete-address]"); if (!button) return;
      pcWrite(PC.addresses, pcAddresses().filter(address => address.id !== button.dataset.deleteAddress)); pcRenderAddresses(host);
    }, { once: true });
  }

  async function pcHash(value) {
    if (window.crypto?.subtle) { const bytes = new TextEncoder().encode(value); const hash = await crypto.subtle.digest("SHA-256", bytes); return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join(""); }
    return btoa(unescape(encodeURIComponent(value)));
  }
  function pcAddRecovery(authContent) {
    if (!authContent || authContent.querySelector(".axpc-recovery")) return;
    const button = document.createElement("button"); button.type = "button"; button.className = "axpc-recovery"; button.textContent = "¿Olvidaste tu contraseña?";
    button.addEventListener("click", () => {
      authContent.innerHTML = `<div class="axpc-recovery-panel"><p class="eyebrow">RECUPERACIÓN LOCAL</p><h2>Define una nueva clave</h2><p>Este proceso funciona solo para las cuentas demo almacenadas en este equipo.</p><form><input type="email" name="email" placeholder="Correo registrado" required><input type="password" name="password" placeholder="Nueva contraseña (8 caracteres)" minlength="8" required><button>Actualizar clave</button></form><button type="button" class="secondary axpc-back-login">Volver al acceso</button></div>`;
      authContent.querySelector("form").addEventListener("submit", async event => {
        event.preventDefault(); const form = new FormData(event.currentTarget); const email = String(form.get("email")).trim().toLowerCase(); const accounts = pcRead(PC.account, []); const account = accounts.find(item => item.email === email);
        if (!account) return alert("No encontramos esa cuenta demo en este navegador.");
        account.passwordHash = await pcHash(form.get("password")); pcWrite(PC.account, accounts); alert("Clave actualizada. Ahora puedes iniciar sesión."); location.reload();
      });
      authContent.querySelector(".axpc-back-login").addEventListener("click", () => location.reload());
    });
    authContent.append(button);
  }

  function pcInjectAnalytics() {
    const panel = document.querySelector("#managementModal [data-mview=dashboard]");
    if (!panel || panel.querySelector(".axpc-analytics")) return;
    const metric = pcMetrics(); const totalViews = Object.values(metric.views).reduce((sum, value) => sum + value, 0); const orders = (state.orders || []).length;
    const box = document.createElement("section"); box.className = "axpc-analytics";
    box.innerHTML = `<h3>Analítica simulada</h3><div><span><b>${totalViews}</b> vistas</span><span><b>${metric.adds || 0}</b> añadidos</span><span><b>${orders}</b> pedidos</span><span><b>${metric.checkoutStarts || 0}</b> checkouts</span></div><p>Conversión demo: ${totalViews ? ((orders / totalViews) * 100).toFixed(1) : "0.0"}% · Carritos con abandono estimado: ${state.cart.length ? "1" : "0"}.</p>`;
    panel.prepend(box);
  }

  function pcOpenCheckout() {
    if (!state.cart.length) return alert("Tu carrito está vacío.");
    pcTrack("checkoutStarts");
    let coupon = ""; let method = "delivery";
    const dialog = document.querySelector("#axpcCheckout") || document.body.appendChild(Object.assign(document.createElement("dialog"), { id: "axpcCheckout", className: "axpc-checkout" }));
    const render = () => {
      const subtotal = state.cart.reduce((sum, line) => { const product = products.find(item => item.id === line.id); return sum + (product?.price || 0) * line.qty; }, 0);
      const discount = coupon === "TORQUE10" ? Math.round(subtotal * .1) : 0; const shipping = method === "pickup" ? 0 : subtotal >= 100000 ? 0 : 4990; const tax = Math.round((subtotal - discount) * .19); const total = subtotal - discount + shipping;
      const addresses = pcAddresses();
      dialog.innerHTML = `<button class="axpc-close" aria-label="Cerrar">×</button><p class="eyebrow">CHECKOUT DEMO SEGURO</p><h2>Finaliza tu pedido</h2><ol class="axpc-steps"><li class="active">1. Entrega</li><li class="active">2. Pago</li><li>3. Confirmación</li></ol><div class="axpc-checkout-grid"><form class="axpc-payment-form"><fieldset><legend>Entrega</legend><label><input type="radio" name="method" value="delivery" ${method === "delivery" ? "checked" : ""}> Despacho a domicilio</label><label><input type="radio" name="method" value="pickup" ${method === "pickup" ? "checked" : ""}> Retiro en tienda (sin costo)</label>${method === "delivery" ? `<select name="address" required><option value="">${addresses.length ? "Selecciona una dirección" : "Agrega una dirección desde Mi cuenta"}</option>${addresses.map(a => `<option value="${a.id}">${pcEscape(a.label)} — ${pcEscape(a.street)}</option>`).join("")}</select>` : "<p class=\"axpc-muted\">Retiro demo: Av. Torque 450, Santiago. Te avisaremos cuando esté listo.</p>"}</fieldset><fieldset><legend>Pago protegido (simulación)</legend><label><input type="radio" name="paytype" value="card" checked> Tarjeta de crédito/débito</label><label><input type="radio" name="paytype" value="bank"> Transferencia bancaria</label><div class="axpc-card-fields"><input name="card" inputmode="numeric" placeholder="Número de tarjeta demo: 4242 4242 4242 4242" required><div><input name="expiry" placeholder="MM/AA" required><input name="cvv" inputmode="numeric" placeholder="CVV" required></div></div><select name="bank"><option>Banco de Chile (demo)</option><option>Santander (demo)</option><option>BCI (demo)</option><option>BancoEstado (demo)</option></select><small>No se procesa ni transmite ningún pago real.</small></fieldset><fieldset class="axpc-coupon"><legend>Cupón</legend><input name="coupon" value="${coupon}" placeholder="TORQUE10"><button type="button" class="axpc-apply-coupon">Aplicar</button><span>${coupon === "TORQUE10" ? "10% aplicado" : "Usa TORQUE10"}</span></fieldset><button class="primary">Pagar ${pcMoney(total)} (demo)</button></form><aside><h3>Resumen</h3>${state.cart.map(line => { const p = products.find(item => item.id === line.id); return `<p>${pcEscape(p?.name || "Producto")} × ${line.qty}<b>${pcMoney((p?.price || 0) * line.qty)}</b></p>`; }).join("")}<p>Subtotal <b>${pcMoney(subtotal)}</b></p><p>Descuento <b>−${pcMoney(discount)}</b></p><p>IVA incluido (19%) <b>${pcMoney(tax)}</b></p><p>Despacho <b>${shipping ? pcMoney(shipping) : "Gratis"}</b></p><hr><p class="total">Total <b>${pcMoney(total)}</b></p></aside></div>`;
      dialog.querySelector(".axpc-close").onclick = () => dialog.close();
      dialog.querySelectorAll("input[name=method]").forEach(input => input.onchange = () => { method = input.value; render(); });
      dialog.querySelector(".axpc-apply-coupon").onclick = () => { coupon = dialog.querySelector("[name=coupon]").value.trim().toUpperCase(); if (coupon && coupon !== "TORQUE10") { coupon = ""; alert("Cupón demo no válido. Prueba TORQUE10."); } render(); };
      dialog.querySelector("form").onsubmit = event => {
        event.preventDefault(); const form = new FormData(event.currentTarget); if (method === "delivery" && !form.get("address")) return alert("Selecciona una dirección o elige retiro en tienda.");
        const order = { id: `AX-${Date.now().toString().slice(-7)}`, createdAt: new Date().toISOString(), status: "Pago aprobado (demo)", payment: form.get("paytype") === "bank" ? "Transferencia bancaria demo" : "Tarjeta demo", totals: { subtotal, savings: discount, shipping, total }, items: state.cart.map(item => ({ ...item })), delivery: method, addressId: form.get("address") || null };
        state.orders = [order, ...(state.orders || [])]; state.cart = []; saveAll(); renderCart(); pcTrack("conversions");
        dialog.innerHTML = `<button class="axpc-close" aria-label="Cerrar">×</button><section class="axpc-confirmation"><span>✓</span><p class="eyebrow">PEDIDO CONFIRMADO</p><h2>Gracias por tu compra</h2><p>Tu orden demo es <strong>${order.id}</strong>. Te enviaremos actualizaciones simuladas a tu perfil local.</p><button class="primary axpc-finish">Volver a la tienda</button></section>`;
        dialog.querySelector(".axpc-close").onclick = dialog.querySelector(".axpc-finish").onclick = () => dialog.close();
      };
    };
    render(); dialog.showModal();
  }
  const oldCheckout = document.querySelector("#checkoutBtn");
  if (oldCheckout) { const newCheckout = oldCheckout.cloneNode(true); oldCheckout.replaceWith(newCheckout); newCheckout.addEventListener("click", pcOpenCheckout); }

  function pcOpenHelp() {
    const dialog = document.querySelector("#axpcHelp") || document.body.appendChild(Object.assign(document.createElement("dialog"), { id: "axpcHelp", className: "axpc-help" }));
    const latest = state.orders?.[0];
    dialog.innerHTML = `<button class="axpc-close" aria-label="Cerrar">×</button><p class="eyebrow">CENTRO DE AYUDA</p><h2>¿Cómo podemos ayudarte?</h2><details open><summary>Despachos y retiro</summary><p>El despacho y retiro son una simulación. En un sitio productivo se conectaría a un operador logístico y se validarían zonas de cobertura.</p></details><details><summary>Cambios y devoluciones</summary><p>Para el prototipo, solicita ayuda por el chat. Una tienda real debe publicar plazos, condiciones y canal de devolución.</p></details><details><summary>Seguimiento de pedido</summary><p>${latest ? `Último pedido: ${latest.id}, estado: ${latest.status}.` : "No tienes pedidos demo todavía."}</p></details><details><summary>Contacto</summary><p>soporte@axoryn.demo · +56 2 2000 2026 (datos de demostración)</p></details><form><label>Escríbenos<input required placeholder="Describe tu consulta"></label><button>Enviar consulta demo</button></form>`;
    dialog.querySelector(".axpc-close").onclick = () => dialog.close(); dialog.querySelector("form").onsubmit = event => { event.preventDefault(); alert("Consulta registrada localmente. Un agente demo responderá por el chat."); event.currentTarget.reset(); };
    dialog.showModal();
  }
  const helpLink = document.createElement("button"); helpLink.type = "button"; helpLink.className = "axpc-help-launcher"; helpLink.textContent = "? Ayuda"; helpLink.addEventListener("click", pcOpenHelp); document.body.append(helpLink);

  const pcBaseAddChat = addChat;
  addChat = function (message, who, product) {
    const response = pcBaseAddChat(message, who, product);
    const history = pcRead(PC.chat, []); history.push({ text: String(message).replace(/<[^>]*>/g, "").slice(0, 500), who, at: Date.now() }); pcWrite(PC.chat, history.slice(-30)); return response;
  };
  setTimeout(() => {
    const messages = document.querySelector("#chatMessages"); if (!messages || messages.dataset.pcRestored) return; messages.dataset.pcRestored = "true";
    pcRead(PC.chat, []).slice(-6).forEach(item => { const line = document.createElement("div"); line.className = `chat-message ${item.who || "bot"}`; line.textContent = item.text; messages.append(line); });
  }, 300);

  const observer = new MutationObserver(() => {
    pcAddRecovery(document.querySelector("#axAuthContent"));
    const account = document.querySelector("#accountModal .account-layout");
    if (account && !account.querySelector(".axpc-addresses")) { const addresses = document.createElement("section"); addresses.className = "axpc-addresses"; account.append(addresses); pcRenderAddresses(addresses); }
    pcInjectAnalytics();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const requestedCategory = new URLSearchParams(location.search).get("category");
  if (requestedCategory && products.some(product => product.category === requestedCategory)) {
    state.filters.category = requestedCategory;
    setTimeout(() => { const selector = document.querySelector("#filterCategory"); if (selector) selector.value = requestedCategory; renderCategoryNav(); renderCatalog(); document.querySelector("#catalog")?.scrollIntoView({ behavior: "smooth" }); }, 80);
  }
  document.addEventListener("error", event => {
    const image = event.target; if (!(image instanceof HTMLImageElement) || image.dataset.pcFallback) return;
    image.dataset.pcFallback = "true"; image.alt = "Imagen no disponible"; image.src = "assets/axoryn-logo.svg"; image.closest(".product-card, .axpc-gallery")?.classList.add("image-fallback");
  }, true);
})();
