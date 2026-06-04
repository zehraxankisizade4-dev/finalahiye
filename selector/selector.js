const API_URL = "http://localhost:3000/products"; 
let allProducts = []; 

window.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

function fetchProducts() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            
            // 🌟 URL-dəki "?type=spf" parametrini tuturuq
            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('type'); // 'spf', 'moisturizer' və s. gələcək

            if (categoryParam) {
                // Əgər ana səhifədən müəyyən bir kateqoriya seçilib gəlibsə, onu göstər
                filterCategory(categoryParam);
            } else {
                // Əgər birbaşa daxil olubsa, hamısını göstər
                displayProducts(allProducts);
            }
        })
        .catch(error => {
            console.error("Datanı gətirərkən xəta:", error);
            document.getElementById("products").innerHTML = "<p style='text-align:center;'>Məlumatlar yüklənə bilmədi. json-server-in işlədiyindən əmin olun.</p>";
        });
}

function displayProducts(productsList) {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = ""; 

    if (productsList.length === 0) {
        productsContainer.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>Bu kateqoriyada məhsul tapılmadı.</p>";
        return;
    }

    productsList.forEach(product => {
        // Şəkillər əsas qovluqdakı image/ daxilində olduğu üçün qarşısına ../ artırırıq
        const productCard = `
            <div class="product-card" style="border: 1px solid #eaeaea; padding: 20px; border-radius: 4px; text-align: center; background: #fff; transition: 0.3s;">
                <div style="height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                    <img src="../${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                <h3 style="font-size: 15px; font-weight: 500; min-height: 40px; margin: 10px 0; color: #333;">${product.name}</h3>
                <p style="color: #888; font-size: 13px; margin-bottom: 5px;">${product.brand}</p>
                <p style="color: #b99d76; font-size: 16px; font-weight: bold; margin-bottom: 10px;">${product.price} AZN</p>
                <span style="font-size: 12px; padding: 3px 8px; border-radius: 20px; background: ${product.stock > 0 ? '#e6f4ea' : '#fce8e6'}; color: ${product.stock > 0 ? '#137333' : '#c5221f'}">
                    ${product.stock > 0 ? `Stokda var (${product.stock} ədəd)` : 'Stokda yoxdur'}
                </span>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });
}

function filterCategory(categoryName) {
    const pageTitle = document.getElementById("page-title");
    
    if (!categoryName || categoryName === 'all') {
        pageTitle.innerText = "Bütün Məhsullar";
        displayProducts(allProducts);
    } else {
        // Əgər parametr 'spf' gəlibsə, başlıqda böyük hərflərlə "SPF" yazsın
        pageTitle.innerText = categoryName === 'spf' ? 'SPF' : categoryName;
        
        // Süzgəcdən keçirərkən hər iki tərəfi kiçik hərfə gətiririk ki, tam uyğunlaşsın
        const filtered = allProducts.filter(product => product.category.toLowerCase() === categoryName.toLowerCase());
        displayProducts(filtered);
    }
}