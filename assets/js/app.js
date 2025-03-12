
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
    // Datos para la pizza
    pizza: {
      tamano: '',
      // Para cada tamaño, iremos guardando los sabores en el array 'sabores'
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
    // Hamburguesas (todas a $15.000)
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
    // Pizza Dog (todas a $15.000)
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
    // Carrito
    carrito: []
  },
  computed: {
    // Unir sabores clásicos y gourmet en un solo array para mostrarlos
    allFlavors() {
      return this.flavorsClassic.concat(this.flavorsGourmet);
    },
    // Calcular total del carrito
    total() {
      return this.carrito.reduce((sum, item) => sum + item.precio, 0);
    }
  },
  methods: {
    // Formatear números con punto de miles en pesos colombianos
    numberFormat(value) {
      return value.toLocaleString('es-CO');
    },

    // Agregar producto al carrito
    agregarProducto(nombre, precio) {
      // Evitar agregar si el precio es 0 (por ejemplo, si no seleccionó sabores)
      if (precio > 0) {
        this.carrito.push({ nombre, precio });
      }
    },
    // Eliminar producto del carrito
    eliminarProducto(index) {
      this.carrito.splice(index, 1);
    },

    // Calcular el precio de la pizza según tamaño y tipo de sabor
    calcularPrecioPizza() {
      let precio = 0;
      const tamano = this.pizza.tamano;
      const sabores = this.pizza.sabores;

      // Asegurarnos de tener limpio el array de sabores según el tamaño
      // (Por ejemplo, si cambia de familiar a porción, sobrarían indices)
      if (tamano === 'porcion') {
        // Porción: $9.000 (tanto clásica como gourmet)
        precio = 9000;
      } else if (tamano === 'personal') {
        // Pizza Personal:
        // Clásica = $15.000, Gourmet = $17.000
        // Asumimos 1 sabor
        if (sabores[0]) {
          if (sabores[0].type === 'clasica') {
            precio = 15000;
          } else {
            precio = 17000;
          }
        }
      } else if (tamano === 'mediana') {
        // Mediana:
        // Si ambos sabores son clásicos = $43.000
        // Si al menos uno es gourmet = $46.000
        if (sabores[0] && sabores[1]) {
          if (
            sabores[0].type === 'clasica' &&
            sabores[1].type === 'clasica'
          ) {
            precio = 43000;
          } else {
            precio = 46000;
          }
        }
      } else if (tamano === 'familiar') {
        // Familiar:
        // Si todos son clásicos = $63.000
        // Si alguno es gourmet = $67.000
        if (sabores[0] && sabores[1] && sabores[2]) {
          const isGourmet =
            sabores[0].type === 'gourmet' ||
            sabores[1].type === 'gourmet' ||
            sabores[2].type === 'gourmet';
          if (isGourmet) {
            precio = 67000;
          } else {
            precio = 63000;
          }
        }
      }
      return precio;
    },

    // Enviar pedido por WhatsApp
    enviarPedido() {
      let mensaje = 'Hola, quisiera realizar el siguiente pedido:\n';
      this.carrito.forEach((item) => {
        mensaje += `- ${item.nombre}: $${this.numberFormat(item.precio)}\n`;
      });
      mensaje += `Total: $${this.numberFormat(this.total)}\n\n`;

      // Datos del formulario
      if (this.deliveryMethod === 'domicilio') {
        mensaje += 'Datos de entrega a domicilio:\n';
        mensaje += `Nombre: ${this.formDomicilio.nombre}\n`;
        mensaje += `Teléfono: ${this.formDomicilio.telefono}\n`;
        mensaje += `Dirección: ${this.formDomicilio.direccion}\n`;
        mensaje += `Barrio: ${this.formDomicilio.barrio}\n`;
        mensaje += `Medio de Pago: ${this.formDomicilio.pago}\n`;
        mensaje += `Comentarios: ${this.formDomicilio.comentarios}\n`;
      } else {
        mensaje += 'Datos para recoger en tienda:\n';
        mensaje += `Nombre: ${this.formTienda.nombre}\n`;
        mensaje += `Teléfono: ${this.formTienda.telefono}\n`;
        mensaje += `Comentarios: ${this.formTienda.comentarios}\n`;
      }

      const url = `https://wa.me/573018348558?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    },

    // Regresar a la sección de productos
    continuarPedido() {
      window.scrollTo({
        top: document.querySelector('.productos').offsetTop,
        behavior: 'smooth'
      });
    }
  }
});
