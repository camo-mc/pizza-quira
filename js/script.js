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

// Función para agregar producto al carrito (ejemplo simplificado)
// Reemplaza alert() por notificaciones tipo toast
function addToCart(itemName, price, qtyInputId) {
  // Aquí iría la lógica para agregar el producto al carrito
  // Por simplicidad, mostramos un toast
  showToast(`Se agregó ${itemName} al carrito`);
  // Actualiza contador del carrito, total, etc., según tu lógica
}

// Función para mostrar notificación tipo toast
function showToast(message) {
  // Crear elemento toast (puedes personalizar o usar Bootstrap Toasts)
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

// Función para enviar pedido a WhatsApp
function sendPedidoWhatsApp(e) {
  e.preventDefault();
  // Recopilar datos del formulario (se adapta según la página)
  const nombre = document.getElementById('nombre') ? document.getElementById('nombre').value : '';
  const email = document.getElementById('email') ? document.getElementById('email').value : '';
  const nota = document.getElementById('nota') ? document.getEle
