const productos = [];

// Cargar productos desde un archivo JSON
fetch("productos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al cargar productos: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data)) {
            throw new Error("El formato de los productos no es válido");
        }
        productos.push(...data);
        mostrarProductos(productos);
    })
    .catch(error => {
        console.error("Error al cargar productos:", error);
        document.querySelector(".lista-productos").innerHTML = "<p>Error al cargar los productos. Intente más tarde.</p>";
    });

// Diccionario de sinónimos
const sinonimos = {
    mando: "mando",
    monitor: "monitor",
    grafica: "grafica",
    notebook: "notebook",
    microfono: "microfono",
};

const carrito = [];

// Normaliza una palabra: sin acentos y en minúsculas
function normalizarPalabra(palabra) {
    return palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Buscar productos en tiempo real
function buscarProductos() {
    const busqueda = document.getElementById("menu-buscar").value.trim();
    if (!busqueda) {
        mostrarProductos(productos);
        return;
    }

    const palabrasBusqueda = busqueda.split(" ").map(normalizarPalabra);

    const productosFiltrados = productos.filter(producto => {
        const nombreProducto = normalizarPalabra(producto.nombre);
        const tipoProducto = normalizarPalabra(producto.tipo || "");
        const generoProducto = normalizarPalabra(producto.genero || "");

        return palabrasBusqueda.every(palabra => {
            const sinonimosPalabra = sinonimos[palabra] ? [palabra, sinonimos[palabra]] : [palabra];
            return sinonimosPalabra.some(sinonimo =>
                nombreProducto.includes(sinonimo) ||
                tipoProducto.includes(sinonimo) ||
                generoProducto.includes(sinonimo)
            );
        });
    });

    mostrarProductos(productosFiltrados);
}

// Mostrar productos en la página
function mostrarProductos(filtrados) {
    const contenedor = document.querySelector(".lista-productos");
    contenedor.innerHTML = "";

    if (!filtrados.length) {
        contenedor.innerHTML = "<p>No se encontraron productos</p>";
        return;
    }

    filtrados.forEach(producto => {
        contenedor.innerHTML += crearHTMLProducto(producto);
    });
}

// Crear el HTML de un producto
function crearHTMLProducto(producto) {
    return `
        <div class="producto">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <div class="precio">$${producto.precio.toFixed(2)}</div>
            <button class="boton-comprar" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        </div>
    `;
}

// Guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cargar el carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito.push(...JSON.parse(carritoGuardado));
        mostrarCarrito();
    }
}

// Agregar un producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) {
        console.error("Producto no encontrado");
        return;
    }

    const productoEnCarrito = carrito.find(item => item.id === idProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    mostrarCarrito();

    Swal.fire({
        title: "Producto agregado al carrito",
        html: `<p><strong>${producto.nombre}</strong></p><p>Precio: $${producto.precio.toFixed(2)}</p>`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
    });
}

// Mostrar el contenido del carrito
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("carrito");
    contenedorCarrito.style.display = "block";
    contenedorCarrito.innerHTML = "";

    if (!carrito.length) {
        contenedorCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    let total = 0;

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const item = document.createElement("div");
        item.classList.add("carrito-item");
        item.innerHTML = `
            <p>${producto.nombre} - $${producto.precio.toFixed(2)} x ${producto.cantidad} = $${subtotal.toFixed(2)}</p>
            <button onclick="cambiarCantidad(${index}, -1)">-</button>
            <span>${producto.cantidad}</span>
            <button onclick="cambiarCantidad(${index}, 1)">+</button>
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        contenedorCarrito.appendChild(item);
    });

    const totalContainer = document.createElement("div");
    totalContainer.classList.add("carrito-total");
    totalContainer.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    contenedorCarrito.appendChild(totalContainer);

    // Botones "Ver más productos" y "Realizar Pedido"
    const botonesContainer = document.createElement("div");
    botonesContainer.classList.add("botones-container");

    const botonVerProductos = document.createElement("button");
    botonVerProductos.textContent = "Ver más productos";
    botonVerProductos.onclick = () => (contenedorCarrito.style.display = "none");

    const botonPedido = document.createElement("button");
    botonPedido.textContent = "Realizar Pedido";
    botonPedido.onclick = mostrarVentanaPedido;

    botonesContainer.appendChild(botonVerProductos);
    botonesContainer.appendChild(botonPedido);
    contenedorCarrito.appendChild(botonesContainer);
}

// Cambiar cantidad de un producto
function cambiarCantidad(index, cambio) {
    const producto = carrito[index];
    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        eliminarDelCarrito(index);
    } else {
        guardarCarrito();
        mostrarCarrito();
    }
}

// Eliminar un producto del carrito
function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1);
    guardarCarrito();
    mostrarCarrito();
}

// Mostrar ventana de confirmación del pedido
function mostrarVentanaPedido() {
    if (!carrito.length) {
        Swal.fire("Carrito vacío", "Agrega productos antes de realizar un pedido.", "error");
        return;
    }

    const resumen = carrito
        .map(producto => `${producto.nombre} - $${producto.precio.toFixed(2)} x ${producto.cantidad} = $${(producto.precio * producto.cantidad).toFixed(2)}`)
        .join("<br>");

    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);

    Swal.fire({
        title: "Confirmar Pedido",
        html: `<p>${resumen}</p><p><strong>Total: $${total.toFixed(2)}</strong></p>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Realizar Pedido",
        cancelButtonText: "Cancelar",
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire("Pedido realizado", "Gracias por tu compra.", "success");
            carrito.length = 0;
            guardarCarrito();
            mostrarCarrito();
        }
    });
}

// Inicialización
cargarCarrito();
document.getElementById("menu-buscar").addEventListener("input", buscarProductos);
document.getElementById("btn-ver-carrito").addEventListener("click", mostrarCarrito);
