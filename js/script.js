let cart = [];

/**
 * Agrega un producto y redirige a opcion.html
 */
function addPromoAndGo(itemName, price) {
  const qty = 1;
  const existingItem = cart.find(item => item.name === itemName && item.price === price);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({ name: itemName, price, qty });
  }
  console.log("Carrito:", cart);
  localStorage.setItem('pizzaCart', JSON.stringify(cart));
  updateFloatingCartBtn();
  window.location.href = 'opcion.html';
}

/**
 * Agrega un producto con qtyId (usado en menus)
 */
function addToCart(itemName, price, qtyId) {
  let qty = 1;
  if (qtyId) {
    const qtyInput = document.getElementById(qtyId);
    qty = parseInt(qtyInput.value, 10) || 1;
  }
  const existingItem = cart.find(item => item.name === itemName && item.price === price);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({ name: itemName, price, qty });
  }
  localStorage.setItem('pizzaCart', JSON.stringify(cart));
  renderCart();
  updateFloatingCartBtn();
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
        localStorage.setItem('pizzaCart', JSON.stringify(cart));
        renderCart();
        updateFloatingCartBtn();
      };

      li.appendChild(removeBtn);
      cartItemsUl.appendChild(li);

      total += producto.price * producto.qty;
    });
    cartTotalSpan.textContent = total.toLocaleString();
  }
}

/**
 * Actualiza el contador del botón flotante del carrito
 */
function updateFloatingCartBtn() {
  const btn = document.getElementById('floatingCartCount');
  if (btn) {
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    btn.textContent = totalQty;
  }
}

/**
 * Guarda el carrito y redirige a la página
 */
function goToForm(page) {
  localStorage.setItem('pizzaCart', JSON.stringify(cart));
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
  updateFloatingCartBtn();
}

/**
 * Escucha el DOMContentLoaded para cargar el carrito y setear eventos
 */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cartItems')) {
    loadCartFromStorage();
  }

  const btnEnviarPedido = document.getElementById('btnEnviarPedido');
  if (btnEnviarPedido) {
    btnEnviarPedido.addEventListener('click', () => {
      if (!confirm("¿Seguro que deseas enviar el pedido?")) {
        return;
      }
      
      const domicilioForm = document.getElementById('domicilioForm');
      const recogerForm = document.getElementById('recogerForm');

      let nombre = '';
      let email = '';
      let telefono = '';
      let direccion = '';
      let barrio = '';
      let nota = '';

      let mensaje = 'Hola, quiero hacer un pedido!\n';

      if (domicilioForm) {
        nombre = document.getElementById('nombre').value.trim();
        email = document.getElementById('email').value.trim();
        telefono = document.getElementById('telefono').value.trim();
        direccion = document.getElementById('direccion').value.trim();
        barrio = document.getElementById('barrio').value.trim();
        nota = document.getElementById('nota').value.trim();
        const paymentMethod = document.getElementById('paymentMethod').value;
        if (!nombre || !email || !telefono || !direccion || !barrio || !paymentMethod) {
          alert('Por favor, completa todos los campos obligatorios.');
          return;
        }
        mensaje += `Nombre: ${nombre}\nCorreo: ${email}\nTeléfono: ${telefono}\nDirección: ${direccion}\nBarrio: ${barrio}\nForma de Pago: ${paymentMethod}\n`;
      } else if (recogerForm) {
        nombre = document.getElementById('nombre').value.trim();
        email = document.getElementById('email').value.trim();
        nota = document.getElementById('nota').value.trim();
        if (!nombre || !email) {
          alert('Por favor, completa todos los campos obligatorios.');
          return;
        }
        mensaje += `Nombre: ${nombre}\nCorreo: ${email}\n`;
      }

      if (nota) {
        mensaje += `Nota: ${nota}\n`;
      }

      if (cart.length > 0) {
        mensaje += 'Pedido:\n';
        let total = 0;
        cart.forEach((item) => {
          mensaje += `  - ${item.qty} x ${item.name} ($${item.price})\n`;
          total += (item.price * item.qty);
        });
        mensaje += `Total: $${total.toLocaleString()}\n`;
      } else {
        mensaje += 'Pedido: (No se seleccionaron productos)\n';
      }

      const encodedMsg = encodeURIComponent(mensaje);
      const whatsappNumber = '573018348558';
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
      window.open(url, '_blank');
    });
  }
});
