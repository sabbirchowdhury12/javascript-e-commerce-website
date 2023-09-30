const productContainer = document.getElementById("product-container");
const cartBtn = document.querySelector(".cart-btn");
const cart = document.querySelector(".cart");
const closeBtn = document.querySelector(".close-cart");
const main = document.querySelector(".main");
const cartContainer = document.querySelector(".cart-container");
const quantity = document.querySelector(".quantity");

let products = [];
let shoppingCart = JSON.parse(localStorage.getItem("shopping-cart")) || [];

cartBtn.onclick = () => {
  document.body.style.overflowX = "hidden";
  main.classList.add("active");
  cart.classList.add("active");
};

closeBtn.onclick = () => {
  document.body.style.overflow = "auto";
  main.classList.remove("active");
  cart.classList.remove("active");
};

async function fetchData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    products = data;
    displayCart(); // I got my data here but
    generateProducts(products);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

const generateProducts = (products) => {
  const data = products
    .map((product) => {
      return ` <div class="col-4" onclick=addToCart(${product.id})>
      <img src=${product.image} />
      <h4>${product.title}</h4>
      <div class="rating">
        <i class="fa fa-star"> </i>
        <i class="fa fa-star"> </i>
        <i class="fa fa-star"> </i>
        <i class="fa fa-star"> </i>
        <i class="fa fa-star-o"></i>
      </div>
      <p>$50.00</p>
    </div>`;
    })
    .join(" ");
  productContainer.innerHTML = data;
};

const addToCart = (id) => {
  let existedProduct = shoppingCart.find((item) => item.id == id);

  if (existedProduct) {
    existedProduct.quantity = existedProduct.quantity + 1;

    let removeExistedProduct = shoppingCart.filter((item) => item.id !== id);
    shoppingCart = [...removeExistedProduct, existedProduct];
    localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
  } else {
    const newProduct = {
      id,
      quantity: 1,
    };
    shoppingCart = [...shoppingCart, newProduct];
    localStorage.setItem("shopping-cart", JSON.stringify(shoppingCart));
  }

  displayCart();
};

const displayCart = () => {
  const cartItems = shoppingCart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return `
    <div class="item">
    <div class="item-header">
      <img src="${product?.image}" alt="" />
      <span>
        <span>"${product?.title}"</span>
        <p>"${product?.price}"</p>
      </span>
    </div>

    <div class="upadte-qaunity">
      <span onclick=(addQuantity(${item.id}))>+</span>
      <span class="quantity">${item.quantity}</span>
      <span onclick=(minusQuantity(${item.id})>-</span>
    </div>

    <span class="price">100</span>
  </div>
    `;
  });

  cartContainer.innerHTML = cartItems.join(" ");
};

displayCart();
