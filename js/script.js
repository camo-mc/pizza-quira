// Función para cargar componentes comunes (header y footer)
function loadCommonComponents() {
  fetch('common/header.html')
    .then(response => response.text())
    .then(data => { document.getElementById('headerContainer').innerHTML = data; })
    .catch(error => console.error('Error cargando header:', error));

  fetch('common/footer.html')
    .then(response => response.text())
    .then(data => { document.getElementById('footerContainer').innerHTML = data; })
    .catch(error => console.error('Error cargando footer:', error));
}

// Función para redirigir a la página de formulario (domicilio o recoger)
function goToForm(url) {
  window.location.href = url;
}

// Función para agregar producto al carrito (ejemplo simplificado)
// Se recomienda reemplazar alert() por notificaciones tipo toast.
function addToCart(itemName, price, qtyInputId) {
  // Lógica para agregar al carrito...
  // Aquí se muestra un toast simple en lugar de alert:
  showToast(`Se agregó ${itemName} al carrito`);
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
document.addEventListener('DOMContentLoaded', function() {
  const btnEnviar = document.getElementById('btnEnviarPedido');
  if (btnEnviar) {
    btnEnviar.addEventListener('click', function(e) {
      e.preventDefault();
      // Recopilar datos del formulario
      const nombre = document.getElementById('nombre') ? document.getElementById('nombre').value : '';
      const email = document.getElementById('email') ? document.getElementById('email').value : '';
      const nota = document.getElementById('nota') ? document.getElementById('nota').value : '';
      // Se pueden agregar más campos según la página (por ejemplo, teléfono, dirección)
      
      // Opcional: agregar datos del carrito (aquí se puede serializar la información del carrito)
      const mensaje = `Pedido de ${nombre}%0ACorreo: ${email}%0ANota: ${nota}`;
      window.open(`https://wa.me/573018348558?text=${encodeURIComponent(mensaje)}`, '_blank');
    });
  }

  // Función para scroll suave al carrito
  const floatingCartBtn = document.getElementById('floatingCartBtn');
  if (floatingCartBtn) {
    floatingCartBtn.addEventListener('click', function() {
      const cartContainer = document.getElementById('cartContainer');
      if (cartContainer) {
        cartContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Cargar los componentes comunes
  loadCommonComponents();
});
