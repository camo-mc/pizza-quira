let cart = [];

/**
 * Agrega un producto de promoción y redirige a la página de opción.
 * Cada clic agrega una nueva entrada.
 */
function addPromoAndGo(itemName, price) {
  const qty = 1;
  cart.push({ name: itemName, price, qty });
  localStorage.setItem('pizzaCart', JSON.stringify(cart));
  updateFloatingCartBtn();
  window.location.href = 'opcion.html';
}

/**
 * Agrega un producto al carrito.
 * Cada clic agrega una nueva entrada, sin combinar duplicados.
 */
function addToCart(itemName, price, qtyId) {
  let qty = 1;
  if (qtyId) {
    const qtyInput = document.getElementById(qtyId);
    qty = parseInt(qtyInput.value, 10) || 1;
  }
  cart.push({ name: itemName, price, qty });
  localStorage.setItem('pizzaCart', JSON.stringify(cart));
  renderCart();
  updateFloatingCartBtn();
}

/**
 * Muestra el carrito en pantalla.
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

      // Botón para eliminar esta entrada
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
 * Actualiza el contador del botón flotante del carrito.
 */
function updateFloatingCartBtn() {
  const btn = document.getElementById('floatingCartCount');
  if (btn) {
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    btn.textContent = totalQty;
  }
}

/**
 * Guarda el carrito y redirige a otra página.
 */
function goToForm(page) {
  localStorage.setItem('pizzaCart', JSON.stringify(cart));
  window.location.href = page;
}

/**
 * Carga el carrito desde localStorage.
 */
function loadCartFromStorage() {
  const storedCart = localStorage.getItem('pizzaCart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
  } else {
    cart = [];
  }
  renderCart();
  updat
