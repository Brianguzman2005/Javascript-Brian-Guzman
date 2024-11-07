// Elementos del DOM
const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const rowProduct = document.querySelector('.row-product');
const productsList = document.querySelector('.container-items');
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');
const todosBtn = document.getElementById('todosBtn');
const moniBtn = document.getElementById('moniBtn');
const aurisBtn = document.getElementById('aurisBtn');
const grafiBtn = document.getElementById('grafiBtn');
const mandoBtn = document.getElementById('mandoBtn');
const comprarBtn = document.getElementById('comprarBtn');

let allProducts = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    showHTML();
    toggleCartVisibility();
    toggleBuyButtonVisibility(); 
});

btnCart.addEventListener('click', () => {
	containerCartProducts.classList.toggle('hidden-cart');
});

productsList.addEventListener('click', e => {
	if (e.target.classList.contains('btn-add-cart')) {
		const product = e.target.parentElement;

		const infoProduct = {
			quantity: 1,
			title: product.querySelector('h2').textContent,
			price: product.querySelector('.price').textContent,
		};

		const exists = allProducts.some(product => product.title === infoProduct.title);

		if (exists) {
			allProducts = allProducts.map(product => {
				if (product.title === infoProduct.title) {
					product.quantity++;
				}
				return product;
			});
		} else {
			allProducts = [...allProducts, infoProduct];
		}

		updateLocalStorage();
		showHTML();
		toggleCartVisibility();
	}
});

rowProduct.addEventListener('click', e => {
	if (e.target.classList.contains('icon-close')) {
		const product = e.target.parentElement;
		const title = product.querySelector('p').textContent;

		allProducts = allProducts.filter(product => product.title !== title);

		updateLocalStorage();
		showHTML();
		toggleCartVisibility();
	}
});

const updateLocalStorage = () => {
	localStorage.setItem('cart', JSON.stringify(allProducts));
};

const showHTML = () => {
	rowProduct.innerHTML = '';

	let total = 0;
	let totalOfProducts = 0;

	allProducts.forEach(product => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('cart-product');

		containerProduct.innerHTML = `
			<div class="info-cart-product">
				<span class="cantidad-producto-carrito">${product.quantity}</span>
				<p class="titulo-producto-carrito">${product.title}</p>
				<span class="precio-producto-carrito">${product.price}</span>
			</div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="icon-close"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		`;

		rowProduct.append(containerProduct);

		total += product.quantity * parseFloat(product.price.slice(1));
		totalOfProducts += product.quantity;
	});

	valorTotal.innerText = `$${total.toFixed(2)}`;
	countProducts.innerText = totalOfProducts;
    toggleBuyButtonVisibility();
};

const toggleCartVisibility = () => {
	if (!allProducts.length) {
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
	} else {
		cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
	}
};

const vaciarCarrito = () => {
    allProducts = []; 
    updateLocalStorage(); 
    showHTML();
    toggleCartVisibility(); 
};

comprarBtn.addEventListener('click', () => {
    vaciarCarrito();
    Swal.fire({
        title: '¡Gracias por su compra!',
        text: 'Su carrito ha sido vaciado.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
});

const toggleBuyButtonVisibility = () => {
    if (!allProducts.length) {
        comprarBtn.classList.add('hidden'); 
    } else {
        comprarBtn.classList.remove('hidden'); 
    }
};

const items = document.querySelectorAll('.container-items .item');

// Función para filtrar productos por categoría según ID
const filterProducts = (category) => {
    items.forEach(item => {
        if (category === 'todos') {
            item.style.display = 'block';
        } else if (item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
};

// Evento de filtro
todosBtn.addEventListener('click', () => filterProducts('todos'));
moniBtn.addEventListener('click', () => filterProducts('monitor'));
aurisBtn.addEventListener('click', () => filterProducts('auriculares'));
grafiBtn.addEventListener('click', () => filterProducts('grafica'));
mandoBtn.addEventListener('click', () => filterProducts('mando'));
