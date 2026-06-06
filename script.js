document.addEventListener("DOMContentLoaded", () => {
 
    // --- 1. SEARCH LOGIC ---
 
    // Create search overlay if it doesn't exist
    if (!document.getElementById('search-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'search-overlay';
        overlay.innerHTML = `
            <div class="search-container">
                <h2 class="search-title">WHAT ARE YOU LOOKING FOR?</h2>
                <div class="search-input-wrapper">
                    <input type="text" class="search-input-field" placeholder="Start typing...">
                    <button class="clear-btn">Delete</button>
                </div>
                <div class="search-results"></div>
            </div>
        `;
        document.body.prepend(overlay);
    }
 
    const overlay = document.getElementById('search-overlay');
    const input = overlay.querySelector('.search-input-field');
    const container = overlay.querySelector('.search-results');
    const clearBtn = overlay.querySelector('.clear-btn');
 
    // Open search overlay when search icon is clicked
    document.getElementById('search-trigger')?.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('active');
        input.focus();
    });
 
    // Close search overlay when clear button is clicked
    clearBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });
 
    // Fetch and show products as user types
    input.addEventListener('input', async (e) => {
        const term = e.target.value.trim().toLowerCase();
        container.innerHTML = '';
 
        // Helper: fix image path based on current page
        const getSearchImagePath = (path) => {
            const isSelectorPage = window.location.pathname.includes('selector.html');
            if (path.startsWith('../')) return path;
            return isSelectorPage ? `../${path}` : path;
        };
 
        if (term.length > 0) {
            try {
                const res = await fetch("http://localhost:3000/products");
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.products || []);
 
                // Filter products by name or brand
                const filtered = list.filter(p =>
                    p.name.toLowerCase().includes(term) ||
                    (p.brand && p.brand.toLowerCase().includes(term))
                );
 
                // Show up to 5 results
                filtered.slice(0, 5).forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'result-item';
                    div.innerHTML = `
                        <img src="${getSearchImagePath(item.image)}" alt="${item.name}">
                        <div>
                            <h3>${item.name.toUpperCase()}</h3>
                            <p>${item.price} AZN</p>
                        </div>
                    `;
 
                    // Go to product page when result is clicked
                    div.addEventListener('click', () => {
                        overlay.classList.remove('active');
                        if (window.location.pathname.includes('selector.html')) {
                            window.location.href = `selector.html?id=${item.id}&cat=${item.category}`;
                        } else {
                            window.location.href = `selector/selector.html?id=${item.id}&cat=${item.category}`;
                        }
                    });
 
                    container.appendChild(div);
                });
 
            } catch (error) {
                console.error("Search error:", error);
            }
        }
    });
 
 
    // --- 2. LOGIN LOGIC ---
 
    // Go to login page when login icon is clicked
    const loginTrigger = document.getElementById('login-trigger');
    if (loginTrigger) {
        loginTrigger.addEventListener('click', () => {
            if (window.location.pathname.includes('selector.html')) {
                window.location.href = '../login/login.html';
            } else {
                window.location.href = 'login/login.html';
            }
        });
    }
 
});
 
 
// --- GLOBAL CLICK EVENTS ---
document.addEventListener('click', (e) => {
 
    // 1. HEART BUTTON — Add or remove product from wishlist
    const heartBtn = e.target.closest('.heart-btn');
    if (heartBtn) {
        e.preventDefault();
 
        const productCard = heartBtn.closest('.product-card');
        if (!productCard) return;
 
        const productId = productCard.id.replace('product-', '');
        const product = allProducts.find(p => p.id == productId);
 
        if (product) {
            const lineItems = JSON.parse(localStorage.getItem('lineItems')) || [];
 
            // If already in list, remove it. Otherwise add it.
            const index = lineItems.findIndex(item => item.id == product.id);
            if (index > -1) {
                lineItems.splice(index, 1);
            } else {
                lineItems.push(product);
            }
 
            localStorage.setItem('lineItems', JSON.stringify(lineItems));
        }
 
        window.location.href = 'line/line.html';
        return;
    }
 
    // 2. HEADER LINE BUTTON — Go to line page
    const lineBtn = e.target.closest('.go-to-line');
    if (lineBtn) {
        window.location.href = 'line/line.html';
    }
 
});