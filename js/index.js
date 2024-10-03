function Producto(producto) {
    const productosDisponibles = ['mouse', 'monitor', 'teclado'];
    return productosDisponibles.includes(producto.toLowerCase());
}

function Tipo(tipo) {
    const tiposDisponibles = ['gamer', 'oficina'];
    return tiposDisponibles.includes(tipo.toLowerCase());
}

function Cantidad(cantidad) {
    return !isNaN(cantidad) && cantidad > 0;
}

function obtenerPrecioProducto(producto) {
    const precios = {
        mouse:500,
        monitor:1000,
        teclado:700
    };
    return precios[producto.toLowerCase()] || 0;
}

function calcularTotal(precioUnidad, cantidad) {
    return precioUnidad * cantidad;
}

function realizarCompra() {
    let totalGeneral = 0;
    let resumenCompra = "";

    let seguirComprando = true;
    
    while (seguirComprando) {
        const producto = prompt("Seleccione un producto (mouse, monitor , teclado):");
        const tipo = prompt("Seleccione el tipo (gamer, oficina):");
        const cantidad = Number(prompt("Ingrese la cantidad que desea comprar:"));

        if (!Tipo(tipo)) {
            alert("Tipo de producto no válido. Por favor, intentelo de nuevo.");
            return;
        }
        if (!Cantidad(cantidad)) {
            alert("Cantidad no válida. Por favor, ingrese un número válido.");
            return;
        }

        const precioUnidad = obtenerPrecioProducto(producto);
        const totalProducto = calcularTotal(precioUnidad, cantidad);

        totalGeneral += totalProducto;

        resumenCompra += `${cantidad} ${producto}(s) de tipo ${tipo}, Precio unitario: $${precioUnidad}, Total: $${totalProducto} \n`;
        seguirComprando = confirm(`Has seleccionado:\n
        ${cantidad} ${producto}(s) de tipo ${tipo}, precio total: $${totalProducto}.\n
        ¿Deseas agregar otro producto?`);

    }
    alert(`Resumen de tu compra:\n${resumenCompra}\nTotal a pagar: $${totalGeneral}`);
}
    window.onload = function() {
        setTimeout(realizarCompra, 500);
    };