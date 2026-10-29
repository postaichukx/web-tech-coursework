const PRODUCTS = [
  { id: 1, name: "Zvonček na bicykel", price: 8.5, tags: ["bike"] },
  { id: 2, name: "Fľaša na vodu", price: 12, tags: ["sport"] },
  { id: 3, name: "Svetlá na bicykel", price: 24.9, tags: ["bike", "safety"] },
];

const list = document.getElementById("products");
const statusText = document.getElementById("status");
const reloadButton = document.getElementById("reload");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartItems = document.getElementById("cart-items");
const discountButton = document.getElementById("discount");
const discountState = document.getElementById("discount-state");
const eventLoopButton = document.getElementById("event-loop-demo");
const eventLog = document.getElementById("event-log");

const cart = [];
let discountActive = false;

function formatPrice(price) {
  return price.toFixed(2);
}

function createProductItem(product) {
  const item = document.createElement("li");

  const info = document.createElement("div");
  info.className = "product-info";

  const name = document.createElement("span");
  name.className = "product-name";
  name.textContent = product.name;

  const tags = document.createElement("span");
  tags.className = "product-tags";
  tags.textContent = `Tagy: ${product.tags.join(", ")}`;

  const price = document.createElement("span");
  price.textContent = `${formatPrice(product.price)} €`;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Do košíka";
  button.addEventListener("click", () => addToCart(product));

  info.append(name, tags);
  item.append(info, price, button);
  return item;
}

function renderProducts(products) {
  list.replaceChildren();

  const fragment = document.createDocumentFragment();
  for (const product of products) {
    fragment.append(createProductItem(product));
  }

  list.appendChild(fragment);
}

function addToCart(product) {
  cart.push(product);
  renderCart();
}

function applyDiscount(items) {
  return items.map((item) => ({
    ...item,
    price: item.price * 0.9,
  }));
}

function renderCart() {
  const items = discountActive ? applyDiscount(cart) : cart;
  const total = items.reduce((sum, item) => sum + item.price, 0);

  cartCount.textContent = cart.length;
  cartTotal.textContent = formatPrice(total);
  discountState.textContent = discountActive
    ? "Zľava 10 % je zapnutá. Katalóg sa nezmenil."
    : "Zľava nie je zapnutá.";

  cartItems.replaceChildren();
  const fragment = document.createDocumentFragment();

  for (const item of items) {
    const cartItem = document.createElement("li");
    const itemName = document.createElement("span");
    itemName.textContent = item.name;
    const itemPrice = document.createElement("strong");
    itemPrice.textContent = `${formatPrice(item.price)} €`;
    cartItem.append(itemName, itemPrice);
    fragment.appendChild(cartItem);
  }

  cartItems.appendChild(fragment);
}

function loadProducts() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error("Server neodpovedá"));
      } else {
        resolve(structuredClone(PRODUCTS));
      }
    }, 1500);
  });
}

async function showProducts() {
  statusText.textContent = "Načítavam…";
  reloadButton.disabled = true;

  try {
    const products = await loadProducts();
    renderProducts(products);
    statusText.textContent = `Načítaných produktov: ${products.length}`;
  } catch (error) {
    statusText.textContent = `Chyba: ${error.message}. Skúste to znova.`;
  } finally {
    reloadButton.disabled = false;
  }
}

discountButton.addEventListener("click", () => {
  discountActive = !discountActive;
  discountButton.textContent = discountActive ? "Zrušiť zľavu" : "Zľava 10 %";
  renderCart();
});

reloadButton.addEventListener("click", showProducts);

async function continueAfterAwait(writeLine) {
  writeLine("4 – async funkcia pred await");
  await Promise.resolve();
  writeLine("5 – pokračovanie po await");
}

function showEventLoopDemo() {
  const lines = [];

  function writeLine(line) {
    lines.push(line);
    eventLog.textContent = lines.join("\n");
    console.log(line);
  }

  writeLine("1 – bežný kód");
  setTimeout(() => writeLine("2 – task queue / setTimeout"), 0);
  Promise.resolve().then(() => writeLine("3 – microtask queue / Promise.then"));
  continueAfterAwait(writeLine);
  writeLine("6 – bežný kód po zavolaní async funkcie");
}

eventLoopButton.addEventListener("click", showEventLoopDemo);

renderCart();
showProducts();
