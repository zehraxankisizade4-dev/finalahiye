document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('line-container');
    let lineItems = JSON.parse(localStorage.getItem('lineItems')) || [];

    // 1. Məhsulları render etmək
    if (!container) return; // Əgər element yoxdursa kodu dayandır

    if (lineItems.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>Siyahınız boşdur.</p>";
    } else {
        container.innerHTML = lineItems.map((product, index) => `
            <div class="product-card">
                <img src="../${product.image}" alt="${product.name}">
                
                <div class="product-info">
                    <h3>${product.brand || product.category}</h3>
                    <h4>${product.name}</h4>
                  <p class="price-text">Qiymət:  ${product.price} AZN</p>
                    <p><strong>Stock:</strong> ${product.stock} left in stock</p>
                    <button onclick="removeFromLine(${index})" style="background:none; border:none; cursor:pointer; font-size:18px; color:red; position:absolute; top:10px; right:10px;">&times;</button>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})"> + ADD TO CART</button>

                </div>
            </div>
        `).join('');
    }

    // 2. "BACK TO HOME" düyməsi
    const backBtn = document.getElementById('back-to-selector');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../selector/selector.html';
        });
    }
});

// Məhsulu siyahıdan silmək funksiyası
function removeFromLine(index) {
    let lineItems = JSON.parse(localStorage.getItem('lineItems')) || [];
    lineItems.splice(index, 1);
    localStorage.setItem('lineItems', JSON.stringify(lineItems));
    location.reload(); // Səhifəni yeniləyir
}

// Səbətə əlavə etmək üçün boş funksiya (əgər səbət sistemin varsa bura yazarsan)
function addToCart(productId) {
    alert("Məhsul səbətə əlavə olundu!");
    console.log("Səbətə əlavə edildi: ", productId);
}