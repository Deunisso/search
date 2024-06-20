document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const resultsContainer = document.getElementById('results');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close');

    let products = [];

    // Carregar dados do JSON
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            populateCategories(products);
            displayResults(products); // Exibir todos os produtos inicialmente

            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase();
                const selectedCategory = categorySelect.value;
                displayResults(filterProducts(products, query, selectedCategory));
            });

            categorySelect.addEventListener('change', () => {
                const query = searchInput.value.toLowerCase();
                const selectedCategory = categorySelect.value;
                displayResults(filterProducts(products, query, selectedCategory));
            });
        });

    function populateCategories(products) {
        const categories = new Set(products.map(product => product.category));
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    function filterProducts(products, query, category) {
        return products.filter(product => {
            const matchesQuery = product.description.toLowerCase().includes(query) ||
                                 product.code.toLowerCase().includes(query);
            const matchesCategory = category === 'all' || product.category === category;
            return matchesQuery && matchesCategory;
        });
    }

    function displayResults(products) {
        resultsContainer.innerHTML = ''; // Limpar resultados anteriores
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.addEventListener('click', () => showDetails(product));

            const productImage = document.createElement('img');
            productImage.src = product.image;
            productImage.alt = product.description;

            const productDescription = document.createElement('p');
            productDescription.textContent = product.description;

            const productCode = document.createElement('p');
            productCode.textContent = `Código: ${product.code}`;

            productElement.appendChild(productImage);
            productElement.appendChild(productDescription);
            productElement.appendChild(productCode);
            resultsContainer.appendChild(productElement);
        });
    }

    function showDetails(product) {
        modalBody.innerHTML = `
            <h2>${product.description}</h2>
            <img src="${product.image}" alt="${product.description}">
            <h3>Variações</h3>
            <ul>
                ${product.variations.map(variation => `
                    <li>${variation.size} - Código: ${variation.code}</li>
                `).join('')}
            </ul>
        `;
        modal.style.display = 'block';
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', event => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
