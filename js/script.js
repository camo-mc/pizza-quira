/************************************
  ARCHIVO: script.js
************************************/

/**
 * Estructura del carrito: array de objetos
 * [{ name, price, qty }, ...]
 */
let cart = [];

/**
 * Agregar producto al carrito
 * @param {string} itemName - nombre del producto
 * @param {number} price - precio unitario
 * @param {string} qtyId - id del input que contiene la cantidad
 */
function addToCart(itemName, price, qtyId) {
  const qtyInput = document.getElementById(qtyId);
  const qty = parseInt(qtyInput.value, 10) || 1;

  cart.push({ name: itemName, price, qty });
  renderCart();
}

/**
 * Muestra el carrito en pantalla
 */
function renderCart() {
  const cartItemsUl = document.getElementById('cartItems');
  const cartEmptyMsg = document.getElementById('cartEmptyMessage');
  const cartTotalSpan = document.getElementById('cartTotal');

  if (!cartItemsUl || !cartEmptyMsg || !cartTotalSpan) return;

  cartItemsUl.innerHTML = '';

  if (cart.length === 0) {
    cartEmptyMsg.style.display = 'block';
    cartTotalSpan.textContent = '0';
  } else {
    cartEmptyMsg.style.display = 'none';
    let total = 0;

    cart.forEach((producto, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      const productText = `${producto.qty} x ${producto.name} ($${producto.price})`;
      li.textContent = productText;

      // Botón para eliminar
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'X';
      removeBtn.className = 'btn btn-sm btn-danger ms-2';
      removeBtn.onclick = () => {
        cart.splice(index, 1);
        renderCart();
      };

      li.appendChild(removeBtn);
      cartItemsUl.appendChild(li);

      total += (producto.price * producto.qty);
    });

    cartTotalSpan.textContent = total.toLocaleString();
  }
}

/**
 * Guarda el carrito en LocalStorage y redirige a la página correspondiente
 */
function goToForm(page) {
  // Guardamos el carrito actual en local storage
  localStorage.setItem('pizzaCart', JSON.stringify(cart));
  // Redirigimos
  window.location.href = page;
}

/**
 * Carga el carrito desde Local Storage
 */
function loadCartFromStorage() {
  const storedCart = localStorage.getItem('pizzaCart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
  } else {
    cart = [];
  }
  renderCart();
}

/**
 * Enviar Pedido al dar clic
 */
document.addEventListener('DOMContentLoaded', () => {
  // Si existe #cartItems en esta página, significa que debemos cargar el carrito
  if (document.getElementById('cartItems')) {
    loadCartFromStorage();
  }

  const btnEnviarPedido = document.getElementById('btnEnviarPedido');
  if (btnEnviarPedido) {
    btnEnviarPedido.addEventListener('click', () => {
      // Determinar si estamos en domicilio o recoger
      const domicilioForm = document.getElementById('domicilioForm');
      const recogerForm = document.getElementById('recogerForm');

      let nombre = '';
      let email = '';
      let telefono = '';
      let direccion = '';
      let barrio = '';
      let nota = '';

      if (domicilioForm) {
        // Tomar los valores
        nombre = document.getElementById('nombre').value.trim();
        email = document.getElementById('email').value.trim();
        telefono = document.getElementById('telefono').value.trim();
        direccion = document.getElementById('direccion').value.trim();
        barrio = document.getElementById('barrio').value.trim();
        nota = document.getElementById('nota').value.trim();

        // Validación
        if (!nombre || !email || !telefono || !direccion || !barrio) {
          alert('Por favor, completa todos los campos obligatorios.');
          return;
        }
      }

      if (recogerForm) {
        nombre = document.getElementById('nombre').value.trim();
        email = document.getElementById('email').value.trim();
        nota = document.getElementById('nota').value.trim();

        // Validación
        if (!nombre || !email) {
          alert('Por favor, completa todos los campos obligatorios.');
          return;
        }
      }

      // Construimos el mensaje final
      let mensaje = 'Hola, quiero hacer un pedido!\n';
      mensaje += `Nombre: ${nombre}\n`;
      if (email) mensaje += `Correo: ${email}\n`;
      if (domicilioForm) {
        mensaje += `Teléfono: ${telefono}\n`;
        mensaje += `Dirección: ${direccion}\n`;
        mensaje += `Barrio: ${barrio}\n`;
      }
      if (nota) {
        mensaje += `Nota: ${nota}\n`;
      }

      if (cart.length > 0) {
        mensaje += 'Pedido:\n';
        let total = 0;
        cart.forEach((item) => {
          mensaje += `  - ${item.qty} x ${item.name} ($${item.price})\n`;
          total += item.price * item.qty;
        });
        mensaje += `Total: $${total.toLocaleString()}\n`;
      } else {
        mensaje += 'Pedido: (No se seleccionaron productos)\n';
      }

      // Abrir WhatsApp con el número real
      const encodedMsg = encodeURIComponent(mensaje);
      const whatsappNumber = '573018348558'; // +57 301 834 8558
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
      window.open(url, '_blank');
    });
  }
});
