new Vue({
  el: '#app',
  data: {
    deliveryMethod: 'domicilio',
    formDomicilio: {
      nombre: '',
      telefono: '',
      direccion: '',
      barrio: '',
      pago: '',
      comentarios: ''
    },
    formTienda: {
      nombre: '',
      telefono: '',
      comentarios: ''
    },
    pizza: {
      tamano: '',
      sabores: []
    },
    // Pizzas Clásicas
    flavorsClassic: [
      {
        name: 'Hawaiana',
        ingredients: 'piña, jamón ahumado, queso mozzarella, salsa napolitana',
        type: 'clasica'
      },
      {
        name: 'Pollo Champiñones',
        ingredients: 'pollo, champiñones, queso mozzarella, salsa napolitana',
        type: 'clasica'
      },
      {
        name: 'Carnes',
        ingredients: 'carne de res, jamón ahumado, queso mozzarella, salsa napolitana',
        type: 'clasica'
      },
      {
        name: 'Mexicana',
        ingredients: 'carne, pico de gallo, jalapeños, queso mozzarella, salsa napolitana',
        type: 'clasica'
      },
      {
        name: 'Criolla',
        ingredients: 'carne molida, cebolla, pimentón, queso mozzarella, salsa napolitana',
        type: 'clasica'
      },
      {
        name: 'Campesina',
        ingredients: 'maíz tierno, tocineta, queso mozzarella, salsa napolitana',
        type: 'clasica'
      }
    ],
    // Pizzas Gourmet
    flavorsGourmet: [
      {
        name: 'Costillas BBQ',
        ingredients: 'trozos en salsa BBQ, gouda, queso mozzarella, salsa napolitana',
        type: 'gourmet'
      },
      {
        name: 'Peperoni',
        ingredients: 'peperoni, queso mozzarella, salsa napolitana',
        type: 'gourmet'
      },
      {
        name: 'Pollo Teriyaki',
        ingredients: 'pollo, salsa teriyaki, queso mozzarella, salsa napolitana',
        type: 'gourmet'
      },
      {
        name: 'Ranchera Mix',
        ingredients: 'carne, tocineta, salsa ranch, queso mozzarella, salsa napolitana',
        type: 'gourmet'
      },
      {
        name: 'Colombiana',
        ingredients: 'chorizo, hogao, queso mozzarella, salsa napolitana',
        type: 'gourmet'
      },
      {
        name: 'Oreo (dulce)',
        ingredients: 'queso mozzarella, galleta oreo, base dulce',
        type: 'gourmet'
      }
    ],
    // Hamburguesas
    hamburguesas: [
      {
        name: 'Minera',
        ingredients: 'carne, costilla BBQ, cebolla caramelizada, lechuga, tomate, salsa especial'
      },
      {
        name: 'Paisa',
        ingredients: 'carne, chorizo, arepa, hogao, lechuga, tomate, salsa de la casa'
      },
      {
        name: 'Miami',
        ingredients: 'carne, queso, lechuga, tomate, papas en casco, salsa tártara'
      },
      {
        name: 'Mexicana',
        ingredients: 'carne, jalapeños, queso, lechuga, tomate, pico de gallo'
      },
      {
        name: 'Clásica',
        ingredients: 'carne, queso, lechuga, tomate, cebolla caramelizada'
      }
    ],
    // Pizza Dog
    pizzaDogs: [
      {
        name: 'Mexicano',
        ingredients: 'masa de pizza, salchicha zenú, carne, pico de gallo, jalapeños, salsa napolitana'
      },
      {
        name: 'Pollo Champiñones',
        ingredients: 'masa de pizza, salchicha zenú, pollo, champiñones, salsa napolitana'
      },
      {
        name: 'Napolitano',
        ingredients: 'masa de pizza, salchicha zenú, queso mozzarella, salsa napolitana'
      },
      {
        name: 'Hawaiano',
        ingredients: 'masa de pizza, salchicha zenú, jamón, piña, queso mozzarella, salsa napolitana'
      }
    ],
    // Bebidas
    bebidas: [
      { name: 'Gaseosa 250 ml', price: 3000 },
      { name: 'Gaseosa 400 ml', price: 4000 },
      { name: 'Gaseosa 1.5 L', price: 6000 },
      { name: 'Té o Jugo del Valle', price: 4000 }
    ],
    carrito: []
  },
  computed: {
    allFlavors() {
      return this.flavorsClassic.concat(this.flavorsGourmet);
    },
    total() {
      return this.carrito.reduce((sum, item) => sum + item.precio, 0);
    }
  },
  methods: {
    // Formatear número con punto de miles
    numberFormat(value) {
      return value.toLocaleString('es-CO');
    },
    // Agregar producto al carrito
    agregarProducto(nombre, precio) {
      if (precio > 0) {
        this.carrito.push({ nombre, precio });
      }
    },
    // Eliminar producto
    eliminarProducto(index) {
      this.carrito.splice(index, 1);
    },
    // Calcular precio pizza según tamaño y sabores
    calcularPrecioPizza() {
      let precio = 0;
      const tamano = this.pizza.tamano;
      const s = this.pizza.sabores; // array de sabores

      // Asegurarnos de que s[0], s[1], s[2] existan cuando corresponda
      if (tamano === 'porcion') {
        // Porción: $9.000
        precio = 9000;
      } else if (tamano === 'personal') {
        // Personal con 2 sabores:
        // Si ambos son clásicos => $15.000
        // Si alguno es gourmet => $17.000
        if (s[0] && s[1]) {
          const isGourmet = s[0].type === 'gourmet' || s[1].type === 'gourmet';
          precio = isGourmet ? 17000 : 15000;
        }
      } else if (tamano === 'mediana') {
        // Mediana: 2 sabores
        // Ambos clásicos => $43.000
        // Al menos uno gourmet => $46.000
        if (s[0] && s[1]) {
          if (s[0].type === 'clasica' && s[1].type === 'clasica') {
            precio = 43000;
          } else {
            precio = 46000;
          }
        }
      } else if (tamano === 'familiar') {
        // Familiar: 3 sabores
        // Todos clásicos => $63.000
        // Alguno gourmet => $67.000
        if (s[0] && s[1] && s[2]) {
          const isGourmet =
            s[0].type === 'gourmet' ||
            s[1].type === 'gourmet' ||
            s[2].type === 'gourmet';
          precio = isGourmet ? 67000 : 63000;
        }
      }
      return precio;
    },
    // Enviar pedido a WhatsApp con validaciones
    enviarPedido() {
      // Validar datos
      if (this.deliveryMethod === 'domicilio') {
        const { nombre, telefono, direccion, barrio, pago } = this.formDomicilio;
        if (!nombre || !telefono || !direccion || !barrio || !pago) {
          alert('Por favor llena todos los campos de domicilio antes de enviar el pedido.');
          return;
        }
      } else {
        const { nombre, telefono } = this.formTienda;
        if (!nombre || !telefono) {
          alert('Por favor llena todos los campos de recoger en tienda antes de enviar el pedido.');
          return;
        }
      }

      if (this.carrito.length === 0) {
        alert('No has agregado ningún producto al carrito.');
        return;
      }

      // Construir mensaje
      let mensaje = 'Hola, quisiera realizar el siguiente pedido:\n';
      this.carrito.forEach((item) => {
        mensaje += `- ${item.nombre}: $${this.numberFormat(item.precio)}\n`;
      });
      mensaje += `Total: $${this.numberFormat(this.total)}\n\n`;

      if (this.deliveryMethod === 'domicilio') {
        const { nombre, telefono, direccion, barrio, pago, comentarios } = this.formDomicilio;
        mensaje += 'Datos de entrega a domicilio:\n';
        mensaje += `Nombre: ${nombre}\n`;
        mensaje += `Teléfono: ${telefono}\n`;
        mensaje += `Dirección: ${direccion}\n`;
        mensaje += `Barrio: ${barrio}\n`;
        mensaje += `Medio de Pago: ${pago}\n`;
        mensaje += `Comentarios: ${comentarios}\n`;
      } else {
        const { nombre, telefono, comentarios } = this.formTienda;
        mensaje += 'Datos para recoger en tienda:\n';
        mensaje += `Nombre: ${nombre}\n`;
        mensaje += `Teléfono: ${telefono}\n`;
        mensaje += `Comentarios: ${comentarios}\n`;
      }

      // Abrir WhatsApp
      const url = `https://wa.me/573018348558?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    }
  }
});
