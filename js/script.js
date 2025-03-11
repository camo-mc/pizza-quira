
   // js/script.js

// --- COMPONENTES COMUNES ---

function loadCommonComponents() {
  fetch('common/header.html')
    .then(response => response.text())
    .then(data => { 
      document.getElementById('headerContainer').innerHTML = data; 
    })
    .catch(error => console.error('Error cargando header:', error));

  fetch('common/footer.html')
    .then(response => response.text())
    .then(data => { 
      document.getElementById('footerContainer').innerHTML = data; 
    })
    .catch(error => console.error('Error cargando footer:', error));
}

// --- NAVEGACIÓN ---

function goToForm(url) {
  window.location.href = url;
}

// --- GESTIÓN DEL CARRITO ---

function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(itemName, price, qty = 1) {
  const cart = getCart();
  // Si el producto ya existe, sumar cantidad (opcional)
  cart.push({ itemName, price, qty });
  saveCart(cart);
  showToast(`Se agregó ${itemName} al carrito`);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  let count = 0;
  cart.forEach(item => count += item.qty);
  const countElem = document.getElementById('floatingCartCount');
  if (countElem) {
    countElem.textContent = count;
  }
}

// --- NOTIFICACIONES (TOASTS) ---

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

// --- ENVÍO DEL PEDIDO A WHATSAPP (del Carrito) ---

function sendCartToWhatsApp() {
  const cart = getCart();
  if (!cart || cart.length === 0) {
    showToast("El carrito está vacío.");
    return;
  }
  let mensaje = "Pedido:%0A";
  let total = 0;
  cart.forEach(item => {
    mensaje += `${item.itemName} x${item.qty} - $${item.price.toLocaleString()}%0A`;
    total += item.price * item.qty;
  });
  mensaje += `Total: $${total.toLocaleString()}`;
  window.open(`https://wa.me/573018348558?text=${mensaje}`, '_blank');
}

// --- SECCIÓN DE PIZZAS ---

function initializePizzaSection() {
  window.classicFlavors = ["Hawaiana", "Pollo", "Champiñones", "Carnes", "Mexicana", "Criolla", "Campesina"];
  window.gourmetFlavors = ["Costillas BBQ", "Peperoni", "Pollo Teriyaky", "Ranchera Mix", "Pizzaquira", "Oreo"];

  function updateFlavorOptions() {
    const size = document.getElementById("pizzaSize").value;
    const container = document.getElementById("flavorContainer");
    container.innerHTML = "";
    if (!size) {
      document.getElementById("calculatedPrice").textContent = "";
      return;
    }
    let numDropdowns = size === "porcion" ? 1 : (size === "personal" || size === "mediana" ? 2 : 3);
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
      let options = size === "porcion" ? window.classicFlavors : window.classicFlavors.concat(window.gourmetFlavors);
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
  
  function updatePrice() {
    const size = document.getElementById("pizzaSize").value;
    if (!size) {
      document.getElementById("calculatedPrice").textContent = "";
      return;
    }
    let dropdownCount = size === "porcion" ? 1 : (size === "personal" || size === "mediana" ? 2 : 3);
    let selectedFlavors = [];
    for (let i = 1; i <= dropdownCount; i++) {
      const select = document.getElementById("flavor" + i);
      if (select) {
        selectedFlavors.push(select.value);
      }
    }
    let price = 0;
    if (size === "porcion") {
      price = 9000;
    } else if (size === "personal") {
      price = selectedFlavors.some(fl => window.gourmetFlavors.includes(fl)) ? 26000 : 23000;
    } else if (size === "mediana") {
      price = selectedFlavors.some(fl => window.gourmetFlavors.includes(fl)) ? 46000 : 43000;
    } else if (size === "familiar") {
      let gourmetCount = selectedFlavors.filter(fl => window.gourmetFlavors.includes(fl)).length;
      price = gourmetCount >= 2 ? 67000 : 63000;
    }
    document.getElementById("calculatedPrice").textContent = "Precio: $" + price.toLocaleString();
  }
  
  const pizzaSizeSelect = document.getElementById("pizzaSize");
  if (pizzaSizeSelect) {
    pizzaSizeSelect.addEventListener("change", updateFlavorOptions);
  }
}

function addPizzaToCart() {
  const size = document.getElementById("pizzaSize").value;
  if (!size) {
    showToast("Seleccione un tamaño para la pizza.");
    return;
  }
  let dropdownCount = size === "porcion" ? 1 : (size === "personal" || size === "mediana" ? 2 : 3);
  let flavors = [];
  for (let i = 1; i <= dropdownCount; i++) {
    const flavor = document.getElementById("flavor" + i).value;
    if (!flavor) {
      showToast("Seleccione el sabor en la opción " + i);
      return;
    }
    flavors.push(flavor);
  }
  let priceText = document.getElementById("calculatedPrice").textContent;
  if (!priceText) {
    showToast("No se pudo calcular el precio.");
    return;
  }
  let price = parseInt(priceText.replace(/[^0-9]/g, ""), 10);
  const itemName = "Pizza " + size.charAt(0).toUpperCase() + size.slice(1) + " (" + flavors.join(", ") + ")";
  addToCart(itemName, price);
  showToast("Pizza agregada: " + itemName);
}

document.addEventListener('DOMContentLoaded', function() {
  loadCommonComponents();
  updateCartCount();
  
  const btnEnviar = document.getElementById('btnEnviarPedido');
  if (btnEnviar) {
    btnEnviar.addEventListener('click', sendPedidoWhatsApp);
  }
  
  const floatingCartBtn = document.getElementById('floatingCartBtn');
  if (floatingCartBtn) {
    // Si deseas que el botón flotante redirija al carrito:
    floatingCartBtn.addEventListener('click', function() {
      window.location.href = "carrito.html";
    });
  }
});
