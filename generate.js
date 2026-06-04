const fs = require("fs");

const categories = [
  "cleanser",
  "toner",
  "serum",
  "moisturizer",
  "spf", // bu kateqoriya gələndə real datanı qoyacağıq
  "self-care",
  "mask-care",
  "body-care",
  "hair-care"
];

// Digər kateqoriyalar üçün qarışıq brendlər (təkrarlanmanı azaltdım və düzəltdim)
const brands = [
  "Beauty of Joseon",
  "Skin1004",
  "Round Lab",
  "Isntree",
  "COSRX",
  "Torriden",
  "Anua",
  "Purito",
  "Axis-Y",
  "Missha"
];

const productNames = {
  cleanser: "Cleanser",
  toner: "Hydrating Toner",
  serum: "Ampoule Serum",
  moisturizer: "Moisturizing Cream",
  spf: "Sunscreen SPF50",
  self_care: "Self Care Essence",
  mask_care: "Sheet Mask",
  body_care: "Body Lotion",
  hair_care: "Hair Care "
};

// Sənin şəkildəki və qovluğundakı REAL SPF-lərin siyahısı
const realSpfProducts = [
  { name: "Beauty of Joseon Sunscreen Rice + Probiotics", brand: "Beauty of Joseon", image: "image/beauty-spf.jpeg" },
  { name: "Skin1004 Madagascar Centella Hyalu-Cica Water-Fit Sun Serum", brand: "Skin1004", image: "image/centella-spf.jpeg" },
  { name: "Round Lab Birch Juice Moisturizing Sun Cream", brand: "Round Lab", image: "image/round-spf.jpeg" },
  { name: "Isntree Hyaluronic Acid Watery Sun Gel", brand: "Isntree", image: "image/isrtree-spf.jpeg" },
  { name: "COSRX Aloe Soothing Sun Cream", brand: "COSRX", image: "image/aloe-spf.jpeg" },
  { name: "Torriden Dive In Mild Sun Cream", brand: "Torriden", image: "image/torriden-spf.jpeg" },
  { name: "Anua Heartleaf Silky Moisture Sun Cream", brand: "Anua", image: "image/anua-spf.jpeg" },
  { brand: "Purito", name: "Purito Daily Soft Touch Sunscreen", image: "image/purito-spf.jpeg" },
  { brand: "Axis-Y", name: "Axis-Y Complete No-Stress Physical Sunscreen", image: "image/complete-spf.jpeg" },
  { brand: "Missha", name: "Missha All Around Safe Block Soft Finish Sun Milk", image: "image/softfinish-spf.jpeg" }
];

let products = [];
let id = 1;

categories.forEach(category => {
  for (let i = 0; i < 10; i++) {
    // Əgər kateqoriya SPF-dirsə, bizim real siyahıdan məlumatları götürsün
    if (category === "spf") {
      const realSpf = realSpfProducts[i];
      products.push({
        id: id++,
        name: realSpf.name,
        brand: realSpf.brand,
        origin: "Korea",
        category: "spf",
        price: 15 + Math.floor(Math.random() * 20),
        image: realSpf.image, // Tam sənin qovluğundakı adlar
        stock: 5 + Math.floor(Math.random() * 25)
      });
    } else {
      // Digər kateqoriyalar üçün köhnə qaydada avtomatik yaratsın
      const brand = brands[i];
      products.push({
        id: id++,
        name: `${brand} ${productNames[category]} ${i + 1}`,
        brand,
        origin: "Korea",
        category,
        price: 15 + Math.floor(Math.random() * 20),
        image: `image/${category}${i + 1}.jpg`, // Qovluq adını 'image' etdim
        stock: 5 + Math.floor(Math.random() * 25)
      });
    }
  }
});

const db = { products };

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

console.log("db.json generated successfully ✅");