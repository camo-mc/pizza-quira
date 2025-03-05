// Si necesitas funcionalidades de JavaScript, puedes agregarlas aquí.
// Por ejemplo, para manejar eventos de clic en los botones, etc.

// Variable global para el carrito
let cart = [];

function addToCart(itemName) {
  // Agregamos el producto al array
  cart.push(itemName);
  // Actualizamos la vista
  renderCart();
}

// Muestra los productos en #cartItems
function renderCart() {
  const cartItemsUl = document.getElementById('cartItems');
  const cartEmptyMsg = document.getElementById('cartEmptyMessage');
  if (!cartItemsUl || !cartEmptyMsg) return;

  cartItemsUl.innerHTML = '';

  if (cart.length === 0) {
    cartEmptyMsg.style.display = 'block';
  } else {
    cartEmptyMsg.style.display = 'none';
    cart.forEach((producto, index) => {
      const li = document.createElement('li');
      li.textContent = producto;
      // Botón para eliminar un ítem si lo deseas
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'X';
      removeBtn.className = 'btn-remove';
      removeBtn.onclick = () => {
        cart.splice(index, 1);
        renderCart();
      };
      li.appendChild(removeBtn);
      cartItemsUl.appendChild(li);
    });
  }
}

// Esperamos a que cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Detectar si estamos en domicilio.html o recoger.html
  const btnEnviarPedido = document.getElementById('btnEnviarPedido');
  if (btnEnviarPedido) {
    btnEnviarPedido.addEventListener('click', () => {
      // Verificamos qué formulario existe en la página
      let nombre = '';
      let telefono = '';
      let direccion = '';
      let barrio = '';
      let nota = '';

      // DOMICILIO
      const domicilioForm = document.getElementById('domicilioForm');
      if (domicilioForm) {
        nombre = document.getElementById('nombre').value.trim();
        telefono = document.getElementById('telefono').value.trim();
        direccion = document.getElementById('direccion').value.trim();
        barrio = document.getElementById('barrio').value.trim();
        nota = document.getElementById('nota').value.trim();
      }

      // RECOGER
      const recogerForm = document.getElementById('recogerForm');
      if (recogerForm) {
        nombre = document.getElementById('nombre').value.trim();
        telefono = document.getElementById('telefono').value.trim();
        nota = document.getElementById('nota').value.trim();
      }

      // Construimos el mensaje
      let mensaje = 'Hola, quiero hacer un pedido!\n';
      mensaje += `Nombre: ${nombre}\n`;
      mensaje += `Teléfono: ${telefono}\n`;

      if (domicilioForm) {
        mensaje += `Dirección: ${direccion}\n`;
        mensaje += `Barrio: ${barrio}\n`;
      }

      if (nota) {
        mensaje += `Nota: ${nota}\n`;
      }

      if (cart.length > 0) {
        mensaje += 'Pedido:\n';
        cart.forEach((item, i) => {
          mensaje += `  - ${item}\n`;
        });
      } else {
        mensaje += 'Pedido: (No se seleccionaron productos)\n';
      }

      const encodedMsg = encodeURIComponent(mensaje);
      // Número de WhatsApp
      const whatsappNumber = '573018348558';
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

      // Abrimos WhatsApp
      window.open(url, '_blank');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Formulario de domicilio
  const domicilioForm = document.getElementById('domicilioForm');
  if (domicilioForm) {
    domicilioForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Evita el envío tradicional del formulario

      // Tomamos los valores
      const nombre = document.getElementById('nombre').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const direccion = document.getElementById('direccion').value.trim();
      const barrio = document.getElementById('barrio').value.trim();
      const nota = document.getElementById('nota').value.trim();

      // Construimos el texto para WhatsApp
      let mensaje = `Hola, quiero hacer un pedido!\n`;
      mensaje += `Nombre: ${nombre}\n`;
      mensaje += `Teléfono: ${telefono}\n`;
      mensaje += `Dirección: ${direccion}\n`;
      mensaje += `Barrio: ${barrio}\n`;
      if (nota) {
        mensaje += `Nota/Pedido: ${nota}\n`;
      }

      // Codificamos el mensaje para URL
      const encodedMensaje = encodeURIComponent(mensaje);

      // Número de WhatsApp (Colombia +57 301 834 8558)
      const whatsappNumber = '573018348558';

      // Armamos la URL
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMensaje}`;

      // Abrimos WhatsApp en otra pestaña
      window.open(url, '_blank');
    });
  }
});


// Ejemplo de evento en los botones del banner:
document.addEventListener('DOMContentLoaded', () => {
  const deliveryBtn = document.querySelector('.btn-delivery');
  const pickupBtn = document.querySelector('.btn-pickup');

  if (deliveryBtn) {
    deliveryBtn.addEventListener('click', () => {
      alert('Has elegido entrega a domicilio. ¡Gracias por tu preferencia!');
    });
  }

  if (pickupBtn) {
    pickupBtn.addEventListener('click', () => {
      alert('Has elegido recoger en tienda. ¡Te esperamos pronto!');
    });
  }
});

