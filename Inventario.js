class Producto {
    constructor(nombre, precio, cantidad, categoria){
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.categoria = categoria;
    }
}

class Inventario {
    //Encapsulamiento del atributo 'productos'
    #productos;

    constructor() {
        this.#productos = [];
    }

    agregarProducto(nombre, precio, cantidad, categoria) {
        const nuevoProducto = new Producto(nombre, precio, cantidad, categoria);
        const listaProductos = new Array(this.#productos.length + 1);

        for (let i = 0; i < this.#productos.length; i++) {
            listaProductos[i] = this.#productos[i];
        }

        listaProductos[this.#productos.length] = nuevoProducto;
        this.#productos = listaProductos;
    }

    listarProductos(orden = "ascendente") {
        const varProductos = new Array(this.#productos.length);

        for (let i = 0; i < this.#productos.length; i++) {
            varProductos[i] = this.#productos[i];
        }

        for (let i = 0; i < varProductos.length - 1; i++) {
            for (let j = 0; j < varProductos.length - i - 1; j++) {
                if (
                    //Asignar un nombre de tipo String para llamar a la función y establecer el orden de los precios según el String
                    (orden === "Ascendente" && varProductos[j].precio > varProductos[j + 1].precio) ||
                    (orden === "Descendente" && varProductos[j].precio < varProductos[j + 1].precio)
                ) {
                    const prod = varProductos[j];
                    varProductos[j] = varProductos[j + 1];
                    varProductos[j + 1] = prod;
                }
            }
        }
        return varProductos;
    }

    //Método para filtrar productos por categoría usando filter
    filtrarPorCategoria(categoria) {
        return this.#productos.filter(producto => producto.categoria === categoria);
    }

    //Método para buscar productos por nombre usando find
    buscarProducto(nombre) {
        return this.#productos.find(producto => producto.nombre === nombre);
    }

    //Método para aplicar cualquier descuento que se ingrese por teclado
    aplicarDescuento(categoria, porcentaje) {
        this.#productos.forEach(producto => {
            if (producto.categoria === categoria) {
                producto.precio *= (1 - porcentaje / 100);
            }
        });
    }

    get productos() {
        return this.#productos;
    }
}

class Venta {
    //Encapsulamiento del atributo 'ventas'
    #ventas;

    constructor() {
        this.#ventas = [];
    }

    realizarVenta(inventario, nombreProducto, cantidad) {
        const producto = inventario.buscarProducto(nombreProducto);

        //Validaciones para productos inexistentes o por falta de Stock.

        if (!producto) {
            console.error(`Error. El producto: '${nombreProducto}' no existe en el inventario.`);
            return;
        }

        if (producto.cantidad < cantidad) {
            console.error(`Error. Cantidad insuficiente de: '${nombreProducto}'.`);
            return;
        }

        //Objeto que nos permite realizar la transacción de la venta del producto, el cual se mostrará mas adelante en pantalla con los
        //datos correspondientes
        producto.cantidad -= cantidad;
        const venta = {
            producto: producto.nombre,
            cantidad: cantidad,
            precioUnitario: producto.precio,
            total: producto.precio * cantidad,
            fecha: new Date() //Date() crea objetos de tipo Date que cuando se lo llama como función, 
            //devuelve una cadena que representa la hora actual.
        };

        const listaVentas = new Array(this.#ventas.length + 1);
        
        for (let i = 0; i < this.#ventas.length; i++) {
            listaVentas[i] = this.#ventas[i];
        }

        listaVentas[this.#ventas.length] = venta;
        this.#ventas = listaVentas;

        console.log(`Venta realizada: ${cantidad} unidades de '${producto.nombre}' por $${venta.total}.`);
    }

    //Muestra las ventas realizadas de los productos 
    informeVentas() {
        let totalIngresos = 0;
        const productosVendidos = {};

        for (let i = 0; i < this.#ventas.length; i++) {
            const venta = this.#ventas[i];
            totalIngresos += venta.total;
            if (!productosVendidos[venta.producto]) {
                productosVendidos[venta.producto] = 0;
            }
            productosVendidos[venta.producto] += venta.cantidad;
        }

        //Inicialización de variables
        let productoMasVendido = null;
        let maxCantidad = 0;

        for (const producto in productosVendidos) {
            if (productosVendidos[producto] > maxCantidad) {
                maxCantidad = productosVendidos[producto];
                productoMasVendido = producto;
            }
        }

        //Devuelve los datos ya calculados luego de las ventas
        return {
            ventas: this.#ventas,
            totalIngresos,
            productoMasVendido
        };
    }

    //Muestar en pantalla el inventario actualizado luego de aplicar el descuento
    imprimirInforme(inventario) {
        const reporte = this.informeVentas();

        console.log("                                          Inventario actualizado");
        inventario.productos.forEach(producto => {
            console.log(`${producto.nombre} - Precio: $${producto.precio} - Cantidad: ${producto.cantidad} - Categoría: ${producto.categoria}`);
        });

        console.log("                                            Ventas realizadas");
        reporte.ventas.forEach(venta => {
            console.log(`Producto: ${venta.producto} - Cantidad: ${venta.cantidad} - Total: $${venta.total} - Fecha: ${venta.fecha}`);
        });

        console.log("                                              Estadísticas");
        console.log(`Total ingresos: $${reporte.totalIngresos}`);
        console.log(`Producto más vendido: ${reporte.productoMasVendido}`);
    }
}

//Main
const inventario = new Inventario();
const ventas = new Venta();

inventario.agregarProducto("Leche", 1.00, 100, "Lácteos");
inventario.agregarProducto("Atún", 1.10, 150, "Pescados");
inventario.agregarProducto("Arroz", 3.00, 125, "Cereales");
inventario.agregarProducto("Lenteja", 0.85, 90, "Legumbre");
inventario.agregarProducto("Azúcar", 1.30, 70, "Carbohidratos simples");

console.log("Productos ordenados por precio ascendente:");
inventario.listarProductos("Ascendente").forEach(producto => {
    console.log(`${producto.nombre} - $${producto.precio}`);
});

console.log("Productos ordenados por precio descendente:");
inventario.listarProductos("Descendente").forEach(producto => {
    console.log(`${producto.nombre} - $${producto.precio}`);
});

ventas.realizarVenta(inventario, "Leche", 40);
ventas.realizarVenta(inventario, "Azúcar", 60);
ventas.realizarVenta(inventario, "Atún", 100);
ventas.realizarVenta(inventario, "Arroz", 55);
ventas.realizarVenta(inventario, "Lenteja", 91);
ventas.realizarVenta(inventario, "Yogurt", 40);

//Descuento del 10%
inventario.aplicarDescuento("Productos", 10);

ventas.imprimirInforme(inventario);
