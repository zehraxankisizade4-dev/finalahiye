// URL-dən kliklənən kateqoriyanı oxuyuruq (Məs: toner, cleanser, serum)
const urlParams = new URLSearchParams(window.location.search);
const currentType = urlParams.get('type') || 'toner'; 

const brandTagsContainer = document.getElementById('brandTags');
const productsGrid = document.getElementById('productsGrid');

let allProducts = []; // Lokal JSON-dan gələn datanı bura yığacağıq
let selectedBrand = "All";

// 1. Öz yaratdığımız lokal JSON faylını oxuyuruq (Çox sürətlidir!)
async function loadLocalData() {
  try {

const response = await fetch('../../products.json');
    const data = await response.json();
    
    // İlk növbədə bütün datadan YALNIZ URL-dən gələn kateqoriyanı ayırırıq (Eyni məhsullar çıxmasın deyə)
    allProducts = data.filter(product => product.type.toLowerCase() === currentType.toLowerCase());

    if (allProducts.length === 0) {
      productsGrid.innerHTML = `<div class="no-products">Bu kateqoriyaya aid hələ ki məhsul yoxdur.</div>`;
      return;
    }

    // Düymələri və Məhsulları ekrana veririk
    renderBrandTags();
    displayProducts();

  } catch (error) {
    console.error("Məlumat oxunarkən xəta:", error);
    productsGrid.innerHTML = `<div>Məlumatlar yüklənə bilmədi.</div>`;
  }
}

// 2. Kliklənən kateqoriyaya aid olan unikal markaları tapıb teq daxil etmək
function renderBrandTags() {
  brandTagsContainer.innerHTML = "";
  
  // Sırf bu kateqoriyada olan fərqli markaları çıxarırıq
  const brands = allProducts.map(p => p.brand);
  const uniqueBrands = ["All", ...new Set(brands)];
  
  uniqueBrands.forEach(brand => {
    const button = document.createElement('button');
    button.textContent = brand;
    button.className = `brand-btn ${selectedBrand === brand ? 'active' : ''}`;
    
    button.addEventListener('click', () => {
      selectedBrand = brand;
      renderBrandTags(); 
      displayProducts(); 
    });
    
    brandTagsContainer.appendChild(button);
  });
}

// 3. Məhsulları grid formatında düzmək
function displayProducts() {
  productsGrid.innerHTML = "";
  
  // Marka filtrasiyası
  const filtered = selectedBrand === "All" 
    ? allProducts 
    : allProducts.filter(p => p.brand === selectedBrand);

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${product.img}" alt="${product.name}">
        <button class="save-btn">Kaydet</button>
      </div>
      <div class="product-info">
        <span class="product-brand">${product.brand.toUpperCase()}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${product.price}$</p>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// Səhifə açılan kimi funksiyanı başladırıq
loadLocalData();