// Si necesitas funcionalidades de JavaScript, puedes agregarlas aquí.
// Por ejemplo, para manejar eventos de clic en los botones, etc.

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

