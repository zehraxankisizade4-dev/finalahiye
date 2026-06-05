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
                    <button class="clear-btn">Clear</button>
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
        if (term.length > 0) {
            const res = await fetch("http://localhost:3000/products");
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.products || []);
            const filtered = list.filter(p => p.name.toLowerCase().includes(term) || (p.brand && p.brand.toLowerCase().includes(term)));

            filtered.slice(0, 5).forEach(item => {
                const div = document.createElement('div');
                div.className = 'result-item';
                div.innerHTML = `<img src="${item.image}"><div><h3>${item.name.toUpperCase()}</h3><p>${item.price} AZN</p></div>`;
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