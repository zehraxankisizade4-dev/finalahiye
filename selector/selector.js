const API_URL = "http://localhost:3000/products";
let allProducts = [];

// Köməkçi funksiya: Şəkil yolunu avtomatik təyin edir
function getImagePath(imagePath) {
    const isSelectorPage = window.location.pathname.includes('selector.html');
    // Əgər artıq ../ ilə başlayırsa olduğu kimi qaytar
    if (imagePath.startsWith('../')) return imagePath;
    // Selector səhifəsindəyiksə və şəkil kökdədirsə, ../ əlavə et
    return isSelectorPage ? `../${imagePath}` : imagePath;
}

window.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    setupLoginTrigger();
    setupURLParams();
});

function fetchProducts() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            allProducts = data;

            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('type');

            if (categoryParam) {
                filterCategory(categoryParam);
            } else {
                displayProducts(allProducts);
                updateActiveButton('all');
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("products").innerHTML = `
                <p style='grid-column: 1/-1; text-align:center;'>
                    Products could not be loaded.
                </p>`;
        });
}

function displayProducts(productsList) {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";

    productsList.forEach(product => {
        const productCard = `
            <div class="product-card" id="product-${product.id}">
                <div class="product-image-container">
                    <img src="${getImagePath(product.image)}" alt="${product.name}" class="product-img">
                    <div class="product-action-icons">
                        <button class="action-icon quick-view-btn" data-product-id="${product.id}">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                        <button class="action-icon">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h4 class="product-brand">${product.brand || product.category}</h4>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${product.price} AZN</p>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        + ADD TO CART
                    </button>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });
}

function filterCategory(categoryName) {
    const pageTitle = document.getElementById("page-title");
    updateActiveButton(categoryName);

    if (!pageTitle) return; // Əgər element yoxdursa xəta verməsin

    if (!categoryName || categoryName === 'all') {
        pageTitle.innerText = "OUR PRODUCTS";
        displayProducts(allProducts);
    } else {
        pageTitle.innerText = categoryName.toUpperCase();
        const filtered = allProducts.filter(product =>
            product.category.toLowerCase() === categoryName.toLowerCase()
        );
        displayProducts(filtered);
    }
}

function updateActiveButton(categoryName) {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => {
        const onclick = btn.getAttribute('onclick') || '';
        if (onclick.includes(`'${categoryName}'`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

document.addEventListener('click', function (e) {
    const viewBtn = e.target.closest('.quick-view-btn');
    if (viewBtn) {
        e.preventDefault();
        const productId = viewBtn.getAttribute('data-product-id');
        openProductModal(productId);
    }

    if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
        closeModal();
    }
});

function openProductModal(productId) {
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = `
        <div class="modal-left">
            <img src="${getImagePath(product.image)}" alt="${product.name}">
        </div>
        <div class="modal-right">
            <h4 class="modal-brand">${product.brand || product.category}</h4>
            <h2 class="modal-name">${product.name}</h2>
            <p class="modal-price">${product.price} AZN</p>
            
            <div class="quantity-selector">
                <button onclick="changeQty(-1)">-</button>
                <span id="qty-val" style="margin: 0 15px;">1</span>
                <button onclick="changeQty(1)">+</button>
            </div>
            
            <button class="add-to-cart-big" data-product-id="${product.id}">
                + ADD TO CART
            </button>

            <p class="stock-info">
                <strong>Stock:</strong>
                <span class="stock-status ${product.stock > 0 ? 'in-stock' : 'out-stock'}">
                    ${product.stock > 0 ? `${product.stock} left in stock` : 'Out of stock'}
                </span>
            </p>

            <p class="category-link">
                Category:
                <a href="selector.html?type=${product.category.toLowerCase()}">
                    ${product.category}
                </a>
            </p>
        </div>
    `;
    modal.classList.add('show');
}

function changeQty(val) {
    let qtySpan = document.getElementById('qty-val');
    if (!qtySpan) return;
    let current = parseInt(qtySpan.innerText);
    if (current + val >= 1) {
        qtySpan.innerText = current + val;
    }
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('show');
}

function setupURLParams() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const category = params.get('cat');

    function highlightProduct() {
        const targetElement = document.getElementById(`product-${productId}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetElement.classList.add('highlight-product');
        } else {
            setTimeout(highlightProduct, 100);
        }
    }

    if (category) {
        filterCategory(category);
        highlightProduct();
    } else if (productId) {
        highlightProduct();
    }
}




// --- LOGIN FUNKSİYASI ---
function setupLoginTrigger() {
    const loginTrigger = document.getElementById('login-trigger');
    if (!loginTrigger) return;

    loginTrigger.addEventListener('click', (e) => {
        if (localStorage.getItem('user')) {
            console.log("İstifadəçi artıq daxil olub.");
            return;
        } else {
            const isInSelector = window.location.pathname.includes('selector.html');
            window.location.href = isInSelector ? '../login/login.html' : 'login/login.html';
        }
    });
}
 

// --- ÜMUMİ CLICK HADİSƏLƏRİ ---
document.addEventListener('click', function(e) {
    
    // 1. ÜRƏK İKONU (Line-a əlavə etmə, rəng dəyişmə və keçid)
    const heartBtn = e.target.closest('.action-icon');
    
    if (heartBtn && heartBtn.querySelector('.fa-heart')) {
        e.preventDefault();
        
        const icon = heartBtn.querySelector('.fa-heart');
        const productCard = heartBtn.closest('.product-card');
        
        if (productCard) {
            const productId = productCard.id.replace('product-', '');
            const product = allProducts.find(p => p.id == productId);

            if (product) {
                let lineItems = JSON.parse(localStorage.getItem('lineItems')) || [];
                const index = lineItems.findIndex(item => item.id == product.id);
                
                if (index > -1) {
                    // Əgər artıq bəyənilibsə, siyahıdan sil
                    lineItems.splice(index, 1);
                    icon.classList.remove('liked');
                } else {
                    // Əgər bəyənilməyibsə, əlavə et
                    lineItems.push(product);
                    icon.classList.add('liked');
                }
                localStorage.setItem('lineItems', JSON.stringify(lineItems));
            }
        }
        
        // İndi bu sətir aktivdir: Ürəyə basan kimi line səhifəsinə gedəcək
        window.location.href = '../line/line.html'; 
        return; 
    }

    // 2. LINE-A GEDİŞ DÜYMƏLƏRİ (Header və s. üçün)
    const lineBtn = e.target.closest('.go-to-line');
    if (lineBtn) {
        window.location.href = '../line/line.html';
    }
});

// --- SƏHİFƏ YÜKLƏNƏNDƏ ÇAĞIRILANLAR ---
window.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    setupLoginTrigger();
    setupURLParams();
});

