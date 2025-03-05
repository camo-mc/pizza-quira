/* script.js */

// Función para redirigir a la página indicada.
function goToForm(page) {
  window.location.href = page;
}

let cart = [];

// Función para agregar un producto al carrito (cada clic crea una nueva entrada).
function addToCart(itemName, price, qtyId) {
  let qty = 1;
  if (qtyId) {
    const qtyInput = document.getElementById(qtyId);
    qty = parseInt(qtyInput.value, 10) || 1;
  }
  cart.push({ name: itemName, price: price, qty: qty });
  localStorage.setItem("pizzaCart", JSON.stringify(cart));
  console.log("Producto agregado:", itemName, price, qty);
  alert("Producto agregado: " + itemName + " ($" + price + ")");
  updateFloatingCartBtn();
}

// Función para agregar un producto promocional y redirigir.
function addPromoAndGo(itemName, price) {
  addToCart(itemName, price, null);
  goToForm("opcion.html"); // Ajusta la redirección si es necesario.
}

// Función para renderizar el carrito en pantalla.
function renderCart() {
  const cartItemsUl = document.getElementById("cartItems");
  const cartEmptyMsg = document.getElementById("cartEmptyMessage");
  const cartTotalSpan = document.getElementById("cartTotal");

  if (!cartItemsUl || !cartEmptyMsg || !cartTotalSpan) return;

  cartItemsUl.innerHTML = "";
  if (cart.length === 0) {
    cartEmptyMsg.style.display = "block";
    cartTotalSpan.textContent = "0";
  } else {
    cartEmptyMsg.style.display = "none";
    let total = 0;
    cart.forEach((product, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = `${product.qty} x ${product.name} ($${product.price})`;
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "X";
      removeBtn.className = "btn btn-sm btn-danger ms-2";
      removeBtn.onclick = function () {
        cart.splice(index, 1);
        localStorage.setItem("pizzaCart", JSON.stringify(cart));
        renderCart();
        updateFloatingCartBtn();
      };
      li.appendChild(removeBtn);
      cartItemsUl.appendChild(li);
      total += product.price * product.qty;
    });
    cartTotalSpan.textContent = total.toLocaleString();
  }
}

// Función para actualizar el contador del botón flotante del carrito.
function updateFloatingCartBtn() {
  const btn = document.getElementById("floatingCartCount");
  if (btn) {
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    btn.textContent = totalQty;
  }
}

// Función para cargar el carrito desde localStorage.
function loadCartFromStorage() {
  const storedCart = localStorage.getItem("pizzaCart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
  } else {
    cart = [];
  }
  renderCart();
  updateFloatingCartBtn();
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("cartItems")) {
    loadCartFromStorage();
  }
});

// ----- Sección de Pizzas -----
// Esta función se llamará desde la página que cargue carta.html dinámicamente.
function initializePizzaSection() {
  // Define las listas de sabores.
  window.classicFlavors = ["Hawaiana", "Pollo", "Champiñones", "Carnes", "Mexicana", "Criolla", "Campesina"];
  window.gourmetFlavors = ["Costillas BBQ", "Peperoni", "Pollo Teriyaky", "Ranchera Mix", "Pizzaquira", "Oreo"];

  // Función para actualizar los desplegables de sabores según el tamaño seleccionado.
  function updateFlavorOptions() {
    const size = document.getElementById("pizzaSize").value;
    console.log("Tamaño seleccionado:", size);
    const container = document.getElementById("flavorContainer");
    container.innerHTML = "";
    if (!size) {
      document.getElementById("calculatedPrice").textContent = "";
      return;
    }
    let numDropdowns = 0;
    if (size === "porcion") {
    
