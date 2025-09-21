


function setupDropdown(btnId, menuId, arrowId) {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  const arrow = document.getElementById(arrowId);

  btn.addEventListener("click", () => {
    menu.classList.toggle("scale-y-100");
    menu.classList.toggle("opacity-100");
    menu.classList.toggle("scale-y-0");
    menu.classList.toggle("opacity-0");
    arrow.classList.toggle("rotate-180");
  });
}

setupDropdown("dropdownBtn1", "dropdownMenu1", "arrowIcon1");
setupDropdown("dropdownBtn2", "dropdownMenu2", "arrowIcon2");


async function loadProducts() {
  try {
    const res = await fetch("http://localhost:1337/api/products?populate=img1&populate=img2");
    const data = await res.json();
    const container = document.getElementById("products");

    container.innerHTML = data.data.map(item => {
      const img1 = item.img1?.url ? "http://localhost:1337" + item.img1.url : "https://via.placeholder.com/300x320";
      const img2 = item.img2?.url ? "http://localhost:1337" + item.img2.url : img1;
      const category = item.category || "Other";

      return `
        <div class="card1 flex flex-col mt-8 relative w-[300px] bg-white p-4 rounded-2xl shadow" data-category="${category}" data-title="${item.title}" data-newnumber="${item.newnumber}" data-img="${img1}"  data-price="${item.newnumber.replace(/[^\d.]/g, '')}"  >
          <div class="img relative group w-full h-[365px]">
            <img src="${img1}" class="w-full h-[376px] object-cover rounded-2xl" alt="${item.title}">
            <img src="${img2}" class="absolute top-0 left-0 w-full h-[376px] object-cover rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" alt="${item.title}">
            <div class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button data-id="${item.id}" class="openCartBtn w-10 h-10 rounded-full bg-white text-[20px] hover:bg-[#79553d] hover:text-white"><i class="ri-shopping-bag-2-line"></i></button>
              <button class="w-10 h-10 rounded-full  bg-white text-[20px] hover:bg-[#79553d] hover:text-white"><i class="ri-heart-line"></i></button>
              <button class="w-10 h-10 rounded-full bg-white text-[20px] hover:bg-[#79553d] hover:text-white"><i class="ri-eye-line"></i></button>
            </div>
          </div>
          <h1 class="mt-6 text-[18px] font-medium">${item.title}</h1>
          <div class="price flex gap-4 mt-2">
            ${item.oldnumber ? `<s class="text-[#FF0000]">${item.oldnumber} ₼</s>` : ''}
            <p>${item.newnumber} ₼</p>
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error("Ошибка загрузки:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);


const cartSidebar = document.getElementById("cartSidebar");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cart = [];

function openCart() {
  cartSidebar.classList.remove("-translate-x-full");
}

document.getElementById("closeCart").addEventListener("click", () => {
  cartSidebar.classList.add("-translate-x-full");
});

function addToCart(productId, title, priceText, imgUrl) {
  const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, title, price, quantity: 1, imgUrl });
  }

  updateCartUI();
}

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const el = document.createElement("div");
    el.className = "cart-item flex justify-between mb-2 items-center gap-2";

    el.innerHTML = `
      <img src="${item.imgUrl}" class="w-16 h-26 object-cover rounded" />
      <span class="flex-1">${item.title} x${item.quantity}</span>
      <span>${(item.price * item.quantity).toFixed(2)} ₼</span>
    `;

    cartItemsContainer.appendChild(el);
    total += item.price * item.quantity;
  });

  cartTotalEl.innerText = total.toFixed(2) + " ₼";
}


document.addEventListener("click", (e) => {
  const btn = e.target.closest(".openCartBtn");
  if (!btn) return;

  const card = btn.closest(".card1");
  const title = card.dataset.title;
  const price = card.dataset.newnumber;
  const imgUrl = card.dataset.img;
  const productId = btn.dataset.id;

  addToCart(productId, title, price, imgUrl);
  openCart();
});


document.getElementById("clearCartBtn").addEventListener("click", () => {
  cart.length = 0;
  updateCartUI();
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".openCartBtn");
  if (!btn) return;

  const card = btn.closest(".card1");
  const title = card.dataset.title;
  const price = card.dataset.newnumber;
  const imgUrl = card.dataset.img;
  const productId = btn.dataset.id;

  addToCart(productId, title, price, imgUrl);
  openCart();
});


document.getElementById("clearCartBtn").addEventListener("click", () => { cart.length = 0; updateCartUI(); });


document.addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  e.preventDefault();
  const category = (btn.dataset.category || "").trim().toLowerCase();
  document.querySelectorAll(".card1").forEach(card => {
    const cardCategory = (card.getAttribute("data-category") || "other").trim().toLowerCase();
    card.style.display = (cardCategory === category || category === "all") ? "flex" : "none";
  });
});



document.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-price");
  if (!btn) return;
  e.preventDefault();

  const min = parseFloat(btn.dataset.min);
  const max = parseFloat(btn.dataset.max);

  document.querySelectorAll(".card1").forEach(card => {
    const price = parseFloat(card.dataset.price) || 0;
    card.style.display = (price >= min && price <= max) ? "flex" : "none";
  });
});