/* script.js */

// Redirige a la página indicada.
function goToForm(page) {
  window.location.href = page;
}

let cart = [];

// Agrega un producto al carrito (cada clic crea una nueva entrada)
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

// Agrega un producto promocional y redirige.
function addPromoAndGo(itemName, price) {
  addToCart(itemName, price, null);
  goToForm("opcion.html"); // Ajusta la redirección si es necesario.
}

// Renderiza el carrito en pantalla.
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

// Actualiza el contador del botón flotante del carrito.
function updateFloatingCartBtn() {
  const btn = document.getElementById("floatingCartCount");
  if (btn) {
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    btn.textContent = totalQty;
  }
}

// Carga el carrito desde localStorage.
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

// Inicializa el carrito al cargar la página.
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("cartItems")) {
    loadCartFromStorage();
  }
});

// ----- Sección de Pizzas -----
// Estas funciones se definirán en el ámbito global para que puedan llamarse
// después de cargar carta.html dinámicamente.

window.initializePizzaSection = function() {
  // Listas de sabores
  window.classicFlavors = ["Hawaiana", "Pollo", "Champiñones", "Carnes", "Mexicana", "Criolla", "Campesina"];
  window.gourmetFlavors = ["Costillas BBQ", "Peperoni", "Pollo Teriyaky", "Ranchera Mix", "Pizzaquira", "Oreo"];

  // Actualiza los desplegables de sabores según el tamaño seleccionado.
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
      numDropdowns = 1;
    } else if (size === "personal" || size === "mediana") {
      numDropdowns = 2;
    } else if (size === "familiar") {
      numDropdowns = 3;
    }
    for (let i = 1; i <= numDropdowns; i++) {
      const label = document.createElement("label");
      label.textContent = "Sabor " + i + ":";
      label.setAttribute("for", "flavor" + i);
      label.className = "form-label";
      const select = document.createElement("select");
      select.id = "flavor" + i;
      select.className = "form-select mb-2";
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Seleccione un sabor";
      select.appendChild(defaultOption);
      let options = [];
      if (size === "porcion") {
        options = window.classicFlavors;
      } else {
        options = window.classicFlavors.concat(window.gourmetFlavors);
      }
      options.forEach(function(flavor) {
        const opt = document.createElement("option");
        opt.value = flavor;
        opt.textContent = flavor;
        select.appendChild(opt);
      });
      select.addEventListener("change", updatePrice);
      container.appendChild(label);
      container.appendChild(select);
    }
    updatePrice();
  }

  // Calcula y muestra el precio según el tamaño y los sabores seleccionados.
  function updatePrice() {
    const size = document.getElementById("pizzaSize").value;
    if (!size) {
      document.getElementById("calculatedPrice").textContent = "";
      return;
    }
    let dropdownCount = (size === "porcion") ? 1 : (size === "personal" || size === "mediana") ? 2 : 3;
    let selectedFlavors = [];
    for (let i = 1; i <= dropdownCount; i++) {
      const flavor = document.getElementById("flavor" + i).value;
      selectedFlavors.push(flavor);
    }
    console.log("Sabores seleccionados:", selectedFlavors);
    let price = 0;
    if (size === "porcion") {
      price = 9000;
    } else if (size === "personal") {
      let hasGourmet = selectedFlavors.some(fl => window.gourmetFlavors.indexOf(fl) !== -1);
      price = hasGourmet ? 26000 : 23000;
    } else if (size === "mediana") {
      let hasGourmet = selectedFlavors.some(fl => window.gourmetFlavors.indexOf(fl) !== -1);
      price = hasGourmet ? 46000 : 43000;
    } else if (size === "familiar") {
      let gourmetCount = selectedFlavors.filter(fl => window.gourmetFlavors.indexOf(fl) !== -1).length;
      price = (gourmetCount >= 2) ? 67000 : 63000;
    }
    document.getElementById("calculatedPrice").textContent = "Precio: $" + price.toLocaleString();
  }
  
  const pizzaSizeEl = document.getElementById("pizzaSize");
  if (pizzaSizeEl) {
    pizzaSizeEl.addEventListener("change", updateFlavorOptions);
  }
};

window.addPizzaToCart = function() {
  const size = document.getElementById("pizzaSize").value;
  if (!size) {
    alert("Seleccione un tamaño para la pizza.");
    return;
  }
  let dropdownCount = (size === "porcion") ? 1 : (size === "personal" || size === "mediana") ? 2 : 3;
  let flavors = [];
  for (let i = 1; i <= dropdownCount; i++) {
    const flavor = document.getElementById("flavor" + i).value;
    if (!flavor) {
      alert("Seleccione el sabor en la opción " + i);
      return;
    }
    flavors.push(flavor);
  }
  let priceText = document.getElementById("calculatedPrice").textContent;
  if (!priceText) {
    alert("No se pudo calcular el precio.");
    return;
  }
  let price = parseInt(priceText.replace(/[^0-9]/g, ""), 10);
  const itemName = "Pizza " + size.charAt(0).toUpperCase() + size.slice(1) + " (" + flavors.join(", ") + ")";
  addToCart(itemName, price, null);
  alert("Pizza agregada al carrito: " + itemName + " - $" + price.toLocaleString());
};
