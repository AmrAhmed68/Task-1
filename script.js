document.addEventListener('DOMContentLoaded', function() {
        const productsContainer = document.getElementById('products-container');
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const categoryFilter = document.getElementById('category');
        const applyFilterButton = document.getElementById('apply-filter-button');
        const sortSelect = document.getElementById('Sort');
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');
        const pageInfo = document.getElementById('page-info');
        const totalQuantityElement = document.getElementById('total-quantity');
        const totalPriceElement = document.getElementById('total-price');
        const cartList = document.getElementById('cart-list');

        
        let products = [];
        let filteredProducts = [];
        let currentPage = 1;
        const productsPerPage = 5;
        let cart = [];

    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            filteredProducts = products;
            displayProducts(filteredProducts, currentPage);
        })
        .catch(error => {
            console.error('Error fetching the products:', error);
        });

    function displayProducts(products, page) {
        productsContainer.innerHTML = '';
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        const paginatedProducts = products.slice(start, end);

        paginatedProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';

            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h2>${product.title}</h2>
                <p>$${product.price}</p>
                <button class="add-to-cart">Add to Cart</button>
            `;

            productsContainer.appendChild(productDiv);
        });

        updatePaginationInfo(products.length);
        attachAddToCartEvents();
    }

    function updatePaginationInfo(totalProducts) {
        pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(totalProducts / productsPerPage)}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === Math.ceil(totalProducts / productsPerPage);
    }

    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        const query = searchInput.value.toLowerCase();
        filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(query)
        );
        currentPage = 1;
        displayProducts(filteredProducts, currentPage);
    });

    applyFilterButton.addEventListener('click', (event) => {
        event.preventDefault();
        const selectedCategory = categoryFilter.value;
        const minPrice = parseFloat(minPriceInput.value);
        const maxPrice = parseFloat(maxPriceInput.value);

        filteredProducts = products.filter(product => {
            const matchesCategory = selectedCategory === "" || product.category.toLowerCase() === selectedCategory.toLowerCase();
            const matchesMinPrice = isNaN(minPrice) || product.price >= minPrice;
            const matchesMaxPrice = isNaN(maxPrice) || product.price <= maxPrice;
            return matchesCategory && matchesMinPrice && matchesMaxPrice;
        });

        currentPage = 1;
        displayProducts(filteredProducts, currentPage);
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts(filteredProducts, currentPage);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
            currentPage++;
            displayProducts(filteredProducts, currentPage);
        }
    });

    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        filteredProducts.sort((a, b) => {
            if (sortValue === 'price') {
                return a.price - b.price;
            } else if (sortValue === 'title') {
                return a.title.localeCompare(b.title);
            } else if (sortValue === 'category') {
                return a.category.localeCompare(b.category);
            }
        });
        currentPage = 1;
        displayProducts(filteredProducts, currentPage);
    });

   function attachAddToCartEvents() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    });
}

function addToCart(product) {
    const existingProduct = cart.find(p => p.id === product.id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
    const totalPrice = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    totalQuantityElement.textContent = totalQuantity;
    totalPriceElement.textContent = totalPrice.toFixed(2);
    displayCartItems();
}

function displayCartItems() {
    cartList.innerHTML = '';
    cart.forEach(product => {
        const cartItem = document.createElement('li');
        cartItem.textContent = `${product.title} (x${product.quantity})`;
        cartList.appendChild(cartItem);
    });
}

});
