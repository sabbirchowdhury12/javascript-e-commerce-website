const cartBtn = document.querySelector(".cart-btn");
const cart = document.querySelector(".cart");
const closeBtn = document.querySelector(".close-cart");
const main = document.querySelector(".main");
const cartContainer = document.querySelector(".cart-container");

//initial value
let products = [];
let shoppingCart = JSON.parse(localStorage.getItem("shopping-cart")) || [];

// OPEN CART
cartBtn.onclick = () => {
  document.body.style.overflowX = "hidden";
  main.classList.add("active");
  cart.classList.add("active");
};

//CLOSE CART
closeBtn.onclick = () => {
  document.body.style.overflow = "auto";
  main.classList.remove("active");
  cart.classList.remove("active");
};

//CALCULATE TOTAL PRICE
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
// FIND THE EXISTED PRODUCT
const existedProduct = (id) => {
  let product = shoppingCart.find((product) => product.id == id);
  return product;
};
//FILTER PRODUCTS REMOVE EXISTED ONE
const removeExistedProduct = (id) => {
  let products = shoppingCart.filter((product) => product.id !== id);
  return products;
};

// SET LOCAL STORAGE
const setIntoLcalStorage = (data) => {
  localStorage.setItem("shopping-cart", JSON.stringify(data));
};
//LOAD PRODUCTS DATA
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

//DISPLAY PRODUCTS-------
const generateProducts = (products) => {
  const productContainer = document.getElementById("product-container");

  const data = products
    .map((product) => {
      return ` <div class="col-4" onclick=addToCart(${product?.id})>
      <img src=${product?.image} />
      <span class="cart-info">
      <span>
      <h4>${product?.title}</h4>
      <div class="rating">
        <i class="fa fa-star"> </i>
        <i class="fa fa-star"> </i>
        <i class="fa fa-star"> </i>
        <i class="fa fa-star"> </i>
        <i class="fa fa-star-o"></i>
      </div>
      <p>$${product?.price}</p>
      </span>

      <button class="add-to-cart">Add TO Cart</button>
     </span>
    </div>`;
    })
    .join(" ");
  productContainer.innerHTML = data;
};

//ADD TO CART A PRODUCT
const addToCart = (id) => {
  let existedProduct = shoppingCart.find((product) => product.id == id);

  if (existedProduct) {
    existedProduct.quantity = existedProduct.quantity + 1;

    let removeExistedProduct = shoppingCart.filter((item) => item.id !== id);
    shoppingCart = [...removeExistedProduct, existedProduct];
    setIntoLcalStorage(shoppingCart);
    showToast(false);
  } else {
    const newProduct = {
      id,
      quantity: 1,
    };
    shoppingCart = [...shoppingCart, newProduct];
    setIntoLcalStorage(shoppingCart);
    showToast(true);
  }

  displayCart();
  cartItems();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

//SHOW CART
function displayCart() {
  let cartItems;
  if (!shoppingCart.length) {
    cartItems = `<p class="empty-cart">No Produts. Add a Products</p>`;
    cartContainer.innerHTML = cartItems;
  } else {
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
  }

  getTotalPrice();
}

displayCart();

//ADD PRODUCT QUANTITY
const addQuantity = (id) => {
  let updatedProduct = existedProduct(id);

  if (updatedProduct) {
    updatedProduct.quantity = updatedProduct.quantity + 1;
  }

  const products = removeExistedProduct(id);

  shoppingCart = [...products, updatedProduct];

  setIntoLcalStorage(shoppingCart);
  displayCart();
  getTotalPrice();
};

//MINUS PRODUCT QUANTITY
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

  setIntoLcalStorage(shoppingCart);
  displayCart();
  getTotalPrice();
};

//REMOVE A PRODUCT FROM CART
const removeFromCart = (id) => {
  const filteredProducts = removeExistedProduct(id);
  shoppingCart = filteredProducts;
  setIntoLcalStorage(shoppingCart);
  displayCart();
  getTotalPrice();
  cartItems();
};

//CLEAR CART
function clearCart() {
  shoppingCart = [];
  localStorage.clear();
  displayCart(shoppingCart);
  cartItems();
}

// cart item QUANTITY
const cartItems = () => {
  const cartItemQauntity = document.querySelector(".cart-item");
  cartItemQauntity.textContent = shoppingCart.length;
};

cartItems();

//toast------
function showToast(result) {
  const toast = document.getElementById("toast");
  if (result) {
    toast.textContent = "Successfully Added Product";
    toast.style.color = "#fff";
  } else {
    toast.textContent = "You Already Added This In Cart";
    toast.style.color = "#ff523b";
  }

  toast.style.opacity = "2";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2000); // Hide the toast after 3 seconds
}
