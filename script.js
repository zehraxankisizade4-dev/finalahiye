document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SEARCH (Axtarış) MƏNTİQİ ---
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

    document.getElementById('search-trigger')?.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('active');
        input.focus();
    });

    clearBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

   input.addEventListener('input', async (e) => {
    const term = e.target.value.trim().toLowerCase();
    container.innerHTML = '';

    // Şəkil yolunu tənzimləyən köməkçi funksiya (axtarış daxilində)
    const getSearchImagePath = (path) => {
        const isSelectorPage = window.location.pathname.includes('selector.html');
        // Əgər artıq ../ ilə başlayırsa olduğu kimi saxla
        if (path.startsWith('../')) return path;
        // Selector səhifəsindəyiksə və şəkil kökdədirsə, ../ əlavə et
        return isSelectorPage ? `../${path}` : path;
    };

    if (term.length > 0) {
        try {
            const res = await fetch("http://localhost:3000/products");
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.products || []);
            
            const filtered = list.filter(p => 
                p.name.toLowerCase().includes(term) || 
                (p.brand && p.brand.toLowerCase().includes(term))
            );

            filtered.slice(0, 5).forEach(item => {
                const div = document.createElement('div');
                div.className = 'result-item';
                
                // Yenilənmiş şəkil yolu istifadə olunur
                div.innerHTML = `
                    <img src="${getSearchImagePath(item.image)}" alt="${item.name}">
                    <div>
                        <h3>${item.name.toUpperCase()}</h3>
                        <p>${item.price} AZN</p>
                    </div>
                `;

                div.addEventListener('click', () => {
                    overlay.classList.remove('active');
                    // Səhifəyə görə düzgün keçid
                    if (window.location.pathname.includes('selector.html')) {
                        window.location.href = `selector.html?id=${item.id}&cat=${item.category}`;
                    } else {
                        window.location.href = `selector/selector.html?id=${item.id}&cat=${item.category}`;
                    }
                });
                container.appendChild(div);
            });
        } catch (error) {
            console.error("Axtarışda xəta:", error);
        }
    }
});

    // --- 2. LOGIN MƏNTİQİ (Hər yerdən keçid) ---
    const loginTrigger = document.getElementById('login-trigger');
    if (loginTrigger) {
        loginTrigger.addEventListener('click', () => {
            // Əgər selector qovluğundayıqsa, bir qovluq geri qayıdıb login-ə get
            if (window.location.pathname.includes('selector.html')) {
                window.location.href = '../login/login.html';
            } else {
                // Əgər kökdəyiksə (index.html), login qovluğuna gir
                window.location.href = 'login/login.html';
            }
        });
    }
});


// --- ÜMUMİ KLİK HADİSƏLƏRİ ---
document.addEventListener('click', function(e) {
    
    // 1. ÜRƏK DÜYMƏSİ (Bəyənmə və Keçid)
    const heartBtn = e.target.closest('.heart-btn');
    if (heartBtn) {
        e.preventDefault();
        
        const productCard = heartBtn.closest('.product-card');
        if (!productCard) return;

        const productId = productCard.id.replace('product-', '');
        const product = allProducts.find(p => p.id == productId);

        if (product) {
            let lineItems = JSON.parse(localStorage.getItem('lineItems')) || [];
            
            // Əgər artıq siyahıdadırsa, sil (toggle məntiqi)
            const index = lineItems.findIndex(item => item.id == product.id);
            if (index > -1) {
                lineItems.splice(index, 1);
            } else {
                lineItems.push(product);
            }
            localStorage.setItem('lineItems', JSON.stringify(lineItems));
        }

        // Keçid: Səhifənin kökündən line/line.html-ə keçid
        window.location.href = 'line/line.html'; 
        return;
    }

    // 2. HEADER-DƏKİ LINE DÜYMƏSİ
    const lineBtn = e.target.closest('.go-to-line');
    if (lineBtn) {
        window.location.href = 'line/line.html';
    }
});