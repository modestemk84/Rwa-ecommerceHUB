// Basic front-end cart + navigation, product loading

const products = {
  p1: { id: "p1", name: "Product One", price: 50000, img: "images/product1.jpg", desc: "Description for product one." },
  p2: { id: "p2", name: "Product Two", price: 30000, img: "images/product2.jpg", desc: "Description for product two." },
  // add more products as needed
};

let cart = {};

// Update cart count display
function updateCartCount() {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  document.querySelectorAll("#cart-count").forEach(el => {
    el.textContent = count;
  });
}

// Add to cart
function addToCart(id) {
  if (!cart[id]) cart[id] = 0;
  cart[id]++;
  updateCartCount();
  alert("Added to cart: " + products[id].name);
}

// WhatsApp order
function whatsappOrder(id) {
  const prod = products[id];
  const text = `Hello, I’d like to order *${prod.name}* (ID: ${prod.id}). Price: ${prod.price}.`;
  const waUrl = `https://wa.me/250723502423?text=${encodeURIComponent(text)}`;
  window.open(waUrl, "_blank");
}

// Load products onto category page
function loadCategory() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");
  const titleEl = document.getElementById("cat-title");
  if (titleEl) {
    titleEl.textContent = cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "All Products";
  }
  const container = document.getElementById("cat-products");
  if (container) {
    container.innerHTML = "";
    for (let id in products) {
      const prod = products[id];
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${prod.img}" alt="${prod.name}" />
        <h4>${prod.name}</h4>
        <p>RWF ${prod.price.toLocaleString()}</p>
        <button class="btn-add" data-id="${prod.id}">Add to Cart</button>
        <button class="btn-whatsapp" data-id="${prod.id}">WhatsApp Order</button>
        <a href="product.html?id=${prod.id}">View Details</a>
      `;
      container.appendChild(card);
    }
  }
  attachButtons();
}

// Load product detail page
function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id || !products[id]) return;
  const prod = products[id];
  const imgEl = document.getElementById("prod-img");
  const nameEl = document.getElementById("prod-name");
  const priceEl = document.getElementById("prod-price");
  const descEl = document.getElementById("prod-desc");
  const btnAdd = document.getElementById("btn-add-detail");
  const btnWa = document.getElementById("btn-whatsapp-detail");

  if (imgEl) imgEl.src = prod.img;
  if (nameEl) nameEl.textContent = prod.name;
  if (priceEl) priceEl.textContent = `RWF ${prod.price.toLocaleString()}`;
  if (descEl) descEl.textContent = prod.desc;
  if (btnAdd) {
    btnAdd.setAttribute("data-id", prod.id);
    btnAdd.addEventListener("click", () => addToCart(prod.id));
  }
  if (btnWa) {
    btnWa.setAttribute("data-id", prod.id);
    btnWa.addEventListener("click", () => whatsappOrder(prod.id));
  }
}

// Load cart page
function loadCartPage() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  let total = 0;
  for (let id in cart) {
    const qty = cart[id];
    const prod = products[id];
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    const sub = qty * prod.price;
    total += sub;
    itemDiv.innerHTML = `
      <span>${prod.name} (x${qty})</span>
      <span>RWF ${sub.toLocaleString()}</span>
    `;
    container.appendChild(itemDiv);
  }
  const totalEl = document.getElementById("total-price");
  if (totalEl) totalEl.textContent = `RWF ${total.toLocaleString()}`;
  document.getElementById("checkout")?.addEventListener("click", () => {
    let summary = "Order summary:\n";
    for (let id in cart) {
      summary += `${products[id].name} x${cart[id]}\n`;
    }
    summary += `Total: RWF ${total.toLocaleString()}`;
    const waUrl = `https://wa.me/250723502423?text=${encodeURIComponent(summary)}`;
    window.open(waUrl, "_blank");
  });
}

// Attach Add / WhatsApp button handlers
function attachButtons() {
  document.querySelectorAll(".btn-add").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (id) addToCart(id);
    });
  });
  document.querySelectorAll(".btn-whatsapp").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (id) whatsappOrder(id);
    });
  });
}

// On page load
window.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  attachButtons();
  loadCategory();
  loadProductDetail();
  loadCartPage();
});
