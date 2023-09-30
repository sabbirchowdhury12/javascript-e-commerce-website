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
    displayCart();
    getTotalPrice();
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
  let cartItems;
  if (!shoppingCart.length) {
    return;
  }
  cartItems = shoppingCart
    .sort((a, b) => a.id - b.id)
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return `
    <div class="item">
    <div class="item-header">
    <span class="cross-btn" onclick=(removeFromCart(${item.id}))>x</span>
      <img src=${product?.image} alt="" />
      <span>
        <span>${product?.title}</span>
        <p>${product?.price}</p>
      </span>
    </div>

    <div class="upadte-qaunity">
      <span onclick=(addQuantity(${item.id}))>+</span>
      <span class="quantity">${item.quantity}</span>
      <span onclick=(minusQuantity(${item.id}))>-</span>
    </div>

    <span class="price">${product?.price * item?.quantity}</span>
  </div>
    `;
    });

  cartContainer.innerHTML = cartItems.join(" ");

  getTotalPrice();
};
const getTotalPrice = () => {
  const totalPriceField = document.querySelector(".totol-price");
  const price = shoppingCart.map((cart) => {
    const selectedProduct = products.filter((product) => product.id == cart.id);
    const totalPrice = selectedProduct.map((p) => p.price * cart.quantity);
    return totalPrice;
  });

  const totalPrice = price.reduce((a, b) => parseInt(a) + parseInt(b), 0);
  totalPriceField.innerHTML = totalPrice;
};

displayCart();

const existedProduct = (id) => {
  let product = shoppingCart.find((product) => product.id == id);
  return product;
};
const removeExistedProduct = (id) => {
  let products = shoppingCart.filter((product) => product.id !== id);
  return products;
};
const setIntoLcalStorage = (name, data) => {
  localStorage.setItem(name, JSON.stringify(data));
};

const addQuantity = (id) => {
  let updatedProduct = existedProduct(id);

  if (updatedProduct) {
    updatedProduct.quantity = updatedProduct.quantity + 1;
  }

  quantity.innerHTML = updatedProduct.quantity;

  const products = removeExistedProduct(id);

  shoppingCart = [...products, updatedProduct];

  setIntoLcalStorage("shopping-cart", shoppingCart);
  displayCart();
  getTotalPrice();
};
const minusQuantity = (id) => {
  let updatedProduct = existedProduct(id);

  if (updatedProduct.quantity < 2) {
    return;
  }
  if (updatedProduct) {
    updatedProduct.quantity = updatedProduct.quantity - 1;
  }

  const products = removeExistedProduct(id);

  shoppingCart = [...products, updatedProduct];

  setIntoLcalStorage("shopping-cart", shoppingCart);
  displayCart();
  getTotalPrice();
};

const removeFromCart = (id) => {
  const filteredProducts = removeExistedProduct(id);
  shoppingCart = filteredProducts;
  setIntoLcalStorage("shopping-cart", shoppingCart);
  displayCart();
  getTotalPrice();
};

const clearCart = () => {
  shoppingCart = [];
  localStorage.clear();
  displayCart();
};
