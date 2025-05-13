// Referencias
const menuToggle = document.getElementById('menuToggle');
const barsMenu = document.getElementById('navMenu');
const cartIcon = document.querySelector('.cart-icon');
const cartMenu = document.querySelector('.cart');
const overlay = document.getElementById('overlay');
const navbarLinks = document.querySelectorAll('.navbar-link');
const addToCartBtns = document.querySelectorAll('.btn-add');
const productsCart = document.querySelector('.cart-container');
const total = document.querySelector('.total');
const buyBtn = document.querySelector('.btn-buy');
const deleteBtn = document.querySelector('.btn-delete');
const cartBubble = document.querySelector('.cart-bubble');

//loader 
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');

  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 1000);
  }, 3000);
});

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const toggleMenu = () => {
  barsMenu.classList.toggle("open");
  if (cartMenu.classList.contains("open-cart")) {
    cartMenu.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
    return;
  }
  overlay.classList.toggle("show-overlay");
};

const toggleCart = () => {
  cartMenu.classList.toggle("open-cart");
  if (barsMenu.classList.contains("open")) {
    barsMenu.classList.remove("open");
    overlay.classList.remove("show-overlay");
    return;
  }
  overlay.classList.toggle("show-overlay");
};

const closeOnScroll = () => {
  if (!barsMenu.classList.contains("open") && !cartMenu.classList.contains("open-cart")) return;
  barsMenu.classList.remove("open");
  cartMenu.classList.remove("open-cart");
  overlay.classList.remove("show-overlay");
};

const closeOnClick = (e) => {
  if (!e.target.classList.contains("navbar-link")) return;
  barsMenu.classList.remove("open");
  overlay.classList.remove("show-overlay");
};

const closeOnOverlayClick = () => {
  barsMenu.classList.remove("open");
  cartMenu.classList.remove("open-cart");
  overlay.classList.remove("show-overlay");
};

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const renderCart = () => {
  if (!cart.length) {
    productsCart.innerHTML = `<p class="empty-msg">No hay productos en el carrito</p>`;
    return;
  }
  productsCart.innerHTML = cart.map(createCartProductTemplate).join("");
};

const createCartProductTemplate = ({ id, name, price, cardImg, quantity }) => {
  return `
    <div class="cart-item">
      <img src="${cardImg}" alt="gorra" />
      <div class="item-info">
        <h3 class="item-title">${name}</h3>
        <p class="item-bid">Precio</p>
        <span class="item-price">$ ${price}</span>
      </div>
      <div class="item-handler">
        <span class="quantity-handler down" data-id="${id}">-</span>
        <span class="item-quantity">${quantity}</span>
        <span class="quantity-handler up" data-id="${id}">+</span>
      </div>
    </div>
  `;
};

const showCartTotal = () => {
  total.innerHTML = `$ ${getCartTotal().toFixed(2)}`;
};

const getCartTotal = () => {
  return cart.reduce((acc, cur) => acc + Number(getEffectivePrice(cur)) * cur.quantity, 0);
};

const getEffectivePrice = (product) => {
  if (product.id === 1 && product.quantity >= 2 && product.price == 55) {
    return 49.99;
  }
  return product.price;
};

const showAddModal = () => {
  const modal = document.querySelector('.add-modal');
  modal.classList.add('active-modal');

  setTimeout(() => {
    modal.classList.remove('active-modal');
  }, 2000);
};

const addProduct = (product) => {
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartState();
  showAddModal();
};

const addUnitToProduct = (product) => {
  cart = cart.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
};

const substractProductUnit = (product) => {
  cart = cart.map(p => p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p);
};

const removeProductFromCart = (product) => {
  cart = cart.filter(p => p.id !== product.id);
};

const handleQuantity = (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  const product = cart.find(p => p.id.toString() === id);
  if (!product) return;

  if (e.target.classList.contains("down")) {
    if (product.quantity === 1) {
      if (window.confirm("¿Desea Eliminar el producto del carrito?")) {
        removeProductFromCart(product);
      }
    } else {
      substractProductUnit(product);
    }
  } else if (e.target.classList.contains("up")) {
    addUnitToProduct(product);
  }

  updateCartState();
};

const resetCartItems = () => {
  cart = [];
  updateCartState();
};

const completeCartAction = (confirmMsg, successMsg) => {
  if (!cart.length) return;
  if (window.confirm(confirmMsg)) {
    resetCartItems();
    alert(successMsg);
  }
};

const completeBuy = () => completeCartAction("¿Desea completar su compra?", "¡Gracias por su compra!");
const deleteCart = () => completeCartAction("¿Desea vaciar el carrito?", "No hay productos en el carrito");

const disableBtn = (btn) => {
  btn.classList.toggle("disabled", !cart.length);
};

const renderCartBubble = () => {
  cartBubble.textContent = cart.reduce((acc, cur) => acc + cur.quantity, 0);
};

const updateCartState = () => {
  saveCart();
  renderCart();
  showCartTotal();
  renderCartBubble();
  disableBtn(buyBtn);
  disableBtn(deleteBtn);
};

menuToggle.addEventListener("click", toggleMenu);
cartIcon.addEventListener("click", toggleCart);
window.addEventListener("scroll", closeOnScroll);
navbarLinks.forEach(link => link.addEventListener("click", closeOnClick));
overlay.addEventListener("click", closeOnOverlayClick);

addToCartBtns.forEach(btn => {
  btn.addEventListener("click", () => addProduct(gorras[0]));
});

productsCart.addEventListener("click", handleQuantity);
buyBtn.addEventListener("click", completeBuy);
deleteBtn.addEventListener("click", deleteCart);

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  showCartTotal();
  renderCartBubble();
  disableBtn(buyBtn);
  disableBtn(deleteBtn);
});