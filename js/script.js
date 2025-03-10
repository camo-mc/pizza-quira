// js/script.js

// Función para cargar componentes comunes (header y footer)
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

// Función para redirigir a la página de formulario (domicilio o recoger)
function goToForm(url) {
  window.location.href = url;
}

// Función para agregar producto al carrito (lógica simplificada)
function addToCart(itemName, price, qtyInputId) {
  // Aquí se debe implementar la lógica real del carrito:
  // Ejemplo: actualizar un array, contador y total en la UI.
  showToast(`Se agregó ${itemName} al carrito`);
}

// Función para mostrar notificación tipo toast
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

// Función para enviar el pedido a WhatsApp
function sendPedidoWhatsApp(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre') ? document.getElementById('nombre').value : '';
  const email = document.getElementById('email') ? document.getElementById('email').value : '';
  const nota = document.getElementById('nota') ? document.getElementById('nota').value : '';
  const mensaje = `Pedido de ${nombre}%0ACorreo: ${email}%0ANota: ${nota}`;
  window.open(`https://wa.me/573018348558?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// Lógica para la sección de pizzas
function initializePizzaSection() {
  // Listas de sabores
  window.classicFlavors = ["Hawaiana", "Pollo", "Champiñones", "Carnes", "Mexicana", "Criolla", "Campesina"];
  window.gourmetFlavors = ["Costillas BBQ", "Peperoni", "Pollo Teriyaky", "Ranchera Mix", "Pizzaquira", "Oreo"];

  // Función para actualizar los desplegables de sabores según el tamaño seleccionado
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
  
  // Función para calcular y mostrar el precio según el tamaño y sabores seleccionados
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
  
  // Asignar el evento change al select de tamaño
  const pizzaSizeSelect = document.getElementById("pizzaSize");
  if (pizzaSizeSelect) {
    pizzaSizeSelect.addEventListener("change", updateFlavorOptions);
  }
}

// Función para agregar la pizza al carrito usando los datos seleccionados
function addPizzaToCart() {
  const size = document.getElementById("pizzaSize").value;
  if (!size) {
    alert("Seleccione un tamaño para la pizza.");
    return;
  }
  let dropdownCount = size === "porcion" ? 1 : (size === "personal" || size === "mediana" ? 2 : 3);
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
}

// Eventos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  loadCommonComponents();

  const btnEnviar = document.getElementById('btnEnviarPedido');
  if (btnEnviar) {
    btnEnviar.addEventListener('click', sendPedidoWhatsApp);
  }

  const floatingCartBtn = document.getElementById('floatingCartBtn');
  if (floatingCartBtn) {
    floatingCartBtn.addEventListener('click', function() {
      const cartContainer = document.getElementById('cartContainer');
      if (cartContainer) {
        cartContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
