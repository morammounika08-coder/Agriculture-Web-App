"use strict";

const STORE = {
  users: "agriconnect_users",
  products: "agriconnect_products",
  orders: "agriconnect_orders",
  categories: "agriconnect_categories",
  prices: "agriconnect_market_prices",
  reports: "agriconnect_reports",
  session: "agriconnect_session"
};

const demoPrices = [
  { product: "Tomato", market: "Local market", price: 28, unit: "kg", change: 8 },
  { product: "Rice", market: "Local market", price: 42, unit: "kg", change: 3 },
  { product: "Wheat", market: "Local market", price: 34, unit: "kg", change: -2 },
  { product: "Potato", market: "Local market", price: 24, unit: "kg", change: 5 },
  { product: "Onion", market: "Local market", price: 31, unit: "kg", change: -4 },
  { product: "Maize", market: "Local market", price: 27, unit: "kg", change: 2 }
];

const demoUsers = [
  { id: "farmer-demo", name: "Ravi Kumar", email: "farmer@demo.com", password: "farmer123", role: "farmer", phone: "9876543210", location: "Nashik, Maharashtra" },
  { id: "buyer-demo", name: "Ananya Shah", email: "buyer@demo.com", password: "buyer123", role: "buyer", phone: "9876501234", location: "Pune, Maharashtra" }
];

const demoProducts = [
  { id: "crop-tomato", farmerId: "farmer-demo", name: "Fresh farm tomatoes", category: "Vegetables", quantity: 180, unit: "kg", price: 28, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80", description: "Freshly harvested, naturally grown tomatoes from our family farm.", status: "approved", createdAt: "2026-10-01" },
  { id: "crop-rice", farmerId: "farmer-demo", name: "Organic sona masoori rice", category: "Grains", quantity: 320, unit: "kg", price: 42, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80", description: "Clean, aromatic rice harvested this season.", status: "approved", createdAt: "2026-10-02" },
  { id: "crop-potato", farmerId: "farmer-demo", name: "Farm fresh potatoes", category: "Vegetables", quantity: 250, unit: "kg", price: 24, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80", description: "Good-quality potatoes, carefully sorted and ready for delivery.", status: "approved", createdAt: "2026-10-03" },
  { id: "crop-wheat", farmerId: "farmer-demo", name: "Whole wheat grain", category: "Grains", quantity: 400, unit: "kg", price: 34, image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80", description: "Golden whole wheat from the latest harvest.", status: "approved", createdAt: "2026-10-03" },
  { id: "crop-onion", farmerId: "farmer-demo", name: "Red onions", category: "Vegetables", quantity: 90, unit: "kg", price: 31, image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=900&q=80", description: "Locally grown red onions, available in bulk.", status: "approved", createdAt: "2026-10-04" },
  { id: "crop-mango", farmerId: "farmer-demo", name: "Seasonal mangoes", category: "Fruits", quantity: 75, unit: "kg", price: 85, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80", description: "Sweet seasonal mangoes picked at the right time.", status: "pending", createdAt: "2026-10-05" }
];

function readStore(key, fallback) {
  const value = localStorage.getItem(key);
  return value === null ? fallback : JSON.parse(value);
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function initializeDemoData() {
  const initial = [
    [STORE.users, demoUsers],
    [STORE.products, demoProducts],
    [STORE.orders, []],
    [STORE.categories, ["Vegetables", "Fruits", "Grains", "Dairy", "Pulses", "Other"]],
    [STORE.prices, demoPrices],
    [STORE.reports, []]
  ];
  initial.forEach(([key, value]) => {
    if (localStorage.getItem(key) === null) writeStore(key, value);
  });
}

function allUsers() { return readStore(STORE.users, []); }
function allProducts() { return readStore(STORE.products, []); }
function allOrders() { return readStore(STORE.orders, []); }
function session() { return readStore(STORE.session, null); }
function categories() { return readStore(STORE.categories, []); }
function money(amount) { return `₹${Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`; }
function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}
function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function currentUser() {
  const active = session();
  return active ? allUsers().find(user => user.id === active.userId) || null : null;
}
function pageLink(page) { return `${page}.html`; }
function field(label, name, type = "text", value = "", options = {}) {
  const required = options.required === false ? "" : "required";
  const attrs = options.attrs || "";
  const inputValue = value === "" ? "" : ` value="${safe(value)}"`;
  return `<label class="field">${safe(label)}<input type="${type}" name="${safe(name)}"${inputValue} ${required} ${attrs}></label>`;
}
function notice(message, kind = "success") {
  const element = document.querySelector("#notice");
  if (!element) return;
  element.className = `notice ${kind}`;
  element.textContent = message;
  element.hidden = false;
  element.scrollIntoView({ behavior: "smooth", block: "center" });
}
function setPageTitle(title, subtitle = "") {
  return `<div class="page-heading"><div><p class="eyebrow">AGRICONNECT</p><h1>${title}</h1>${subtitle ? `<p class="muted">${subtitle}</p>` : ""}</div></div>`;
}
function statCard(label, value, icon, detail = "") {
  return `<article class="stat-card"><span class="stat-icon">${icon}</span><div><p>${label}</p><strong>${value}</strong>${detail ? `<small>${detail}</small>` : ""}</div></article>`;
}
function statusPill(value) {
  return `<span class="status status-${safe(String(value).toLowerCase())}">${safe(value)}</span>`;
}
function farmerName(id) {
  const farmer = allUsers().find(user => user.id === id);
  return farmer ? farmer.name : "Farmer";
}

function renderHeader() {
  const active = session();
  let links = [["Home", "index.html"], ["Browse produce", "products.html"], ["Market prices", "market-prices.html"]];
  if (active?.role === "farmer") links = [["Dashboard", "farmer-dashboard.html"], ["My products", "add-product.html"], ["Orders", "orders.html"], ["Market prices", "market-prices.html"]];
  if (active?.role === "buyer") links = [["Dashboard", "buyer-dashboard.html"], ["Browse produce", "products.html"], ["My orders", "orders.html"]];
  if (active?.role === "admin") links = [["Admin dashboard", "admin-dashboard.html"]];
  const account = active
    ? `<a class="nav-link account-link" href="${active.role === "admin" ? "admin-dashboard.html" : "profile.html"}">${active.role === "admin" ? "Admin" : safe(currentUser()?.name || "Account")}</a><button class="button button-quiet button-small" data-action="logout">Log out</button>`
    : `<a class="nav-link" href="login.html">Log in</a><a class="button button-primary button-small" href="signup.html">Join AgriConnect</a>`;
  return `<header class="site-header"><a class="brand" href="index.html"><span class="brand-mark">A</span><span>Agri<span>Connect</span><small>FARM DIRECT. BUY FAIR.</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav class="main-nav">${links.map(([label, url]) => `<a href="${url}">${label}</a>`).join("")}</nav><div class="header-actions">${account}</div></header>`;
}

function productCard(product, showReport = false) {
  const image = product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80";
  return `<article class="product-card"><a class="product-image" href="product-details.html?id=${encodeURIComponent(product.id)}"><img src="${safe(image)}" alt="${safe(product.name)}" loading="lazy"><span class="category-tag">${safe(product.category)}</span></a><div class="product-card-body"><p class="farmer-label">Grown by ${safe(farmerName(product.farmerId))}</p><h3><a href="product-details.html?id=${encodeURIComponent(product.id)}">${safe(product.name)}</a></h3><div class="product-price"><strong>${money(product.price)}</strong><span>/ ${safe(product.unit)}</span></div><p class="muted">${Number(product.quantity)} ${safe(product.unit)} available</p><div class="card-actions"><a class="button button-outline button-small" href="product-details.html?id=${encodeURIComponent(product.id)}">View details</a>${showReport ? `<button class="text-button" data-action="report-product" data-id="${safe(product.id)}">Report</button>` : ""}</div></div></article>`;
}

function table(headers, rows, emptyMessage = "Nothing to show yet.") {
  if (!rows.length) return `<div class="empty-state"><span>🌱</span><h3>Nothing here yet</h3><p>${emptyMessage}</p></div>`;
  return `<div class="table-wrap"><table><thead><tr>${headers.map(header => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}

function renderHome() {
  const listings = allProducts().filter(product => product.status === "approved").slice(0, 3);
  return `<section class="hero"><div class="hero-copy"><span class="hero-kicker">A fairer way to grow together</span><h1>Good food.<br><em>Fair prices.</em><br>Direct from farms.</h1><p>AgriConnect brings local farmers and buyers together. Discover fresh produce, know who grew it, and support a fairer food system.</p><div class="hero-actions"><a class="button button-primary" href="products.html">Explore fresh produce <span>→</span></a><a class="button button-light" href="signup.html">Join as a farmer</a></div><div class="hero-note"><span>✓</span> No middlemen. Clear prices. Stronger communities.</div></div><div class="hero-visual"><img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85" alt="Green farm fields at sunrise"><div class="hero-badge"><span>🌿</span><div><strong>Grown with care</strong><small>From local farms to your table</small></div></div></div></section><section class="trust-strip"><div><strong>Direct connections</strong><span>Meet the people who grow your food</span></div><div><strong>Fair, clear prices</strong><span>Know what you pay and earn</span></div><div><strong>Fresh local produce</strong><span>Harvested by nearby farmers</span></div></section><section class="section"><div class="section-heading"><div><p class="eyebrow">FROM OUR FARMERS</p><h2>Fresh picks for you</h2></div><a class="arrow-link" href="products.html">See all produce <span>→</span></a></div><div class="product-grid">${listings.map(product => productCard(product)).join("")}</div></section><section class="how-section"><div class="how-intro"><p class="eyebrow">HOW IT WORKS</p><h2>A simple path<br>from farm to table.</h2><p>We make local trade easy, transparent, and fair for everyone.</p></div><div class="how-steps"><article><span>01</span><h3>Farmers list produce</h3><p>Share what's fresh, how much is available, and your fair price.</p></article><article><span>02</span><h3>Buyers find their match</h3><p>Browse local listings and place a simple simulated order.</p></article><article><span>03</span><h3>Communities grow</h3><p>Trade directly and keep more value with the people who grow food.</p></article></div></section><section class="callout"><div><p class="eyebrow">GROW WITH AGRICONNECT</p><h2>Are you ready to connect?</h2><p>Start selling your harvest or discover produce from your local farms.</p></div><a class="button button-primary" href="signup.html">Create a free account →</a></section>`;
}

function renderSignup() {
  const options = categories();
  return `<section class="auth-layout"><div class="auth-aside"><p class="eyebrow">GROW TOGETHER</p><h1>Good things<br>start <em>here.</em></h1><p>Join a community built around fair prices and fresh food.</p><div class="aside-quote">“When farmers and buyers connect directly, everyone grows.”</div></div><div class="auth-card"><p class="eyebrow">CREATE YOUR ACCOUNT</p><h2>Welcome to AgriConnect</h2><p class="muted">Choose how you'd like to use the marketplace.</p><div id="notice" class="notice" hidden></div><form data-action="signup" class="form-grid"><label class="field">I am a<select name="role" required><option value="">Choose your role</option><option value="farmer">Farmer — I sell produce</option><option value="buyer">Buyer — I purchase produce</option></select></label>${field("Full name", "name")}${field("Email address", "email", "email")}${field("Phone number", "phone", "tel", "", { attrs: 'pattern="[0-9+() -]{7,20}"' })}${field("Village / city", "location")}${field("Password (at least 6 characters)", "password", "password", "", { attrs: 'minlength="6" autocomplete="new-password"' })}<button class="button button-primary button-wide" type="submit">Create my account →</button></form><p class="auth-switch">Already a member? <a href="login.html">Log in</a></p><p class="fine-print">Your account is stored in this browser for this project demonstration.</p></div></section>`;
}

function renderLogin(admin = false) {
  return `<section class="auth-layout"><div class="auth-aside"><p class="eyebrow">${admin ? "PLATFORM ADMINISTRATION" : "WELCOME BACK"}</p><h1>${admin ? "Keep the<br>marketplace <em>fair.</em>" : "Good to see<br>you <em>again.</em>"}</h1><p>${admin ? "Review listings, monitor orders, and keep the community healthy." : "Log in to manage your farm or find fresh local produce."}</p><div class="aside-quote">${admin ? "Demo admin: admin@agriconnect.com · admin123" : "Demo farmer: farmer@demo.com · farmer123<br>Demo buyer: buyer@demo.com · buyer123"}</div></div><div class="auth-card"><p class="eyebrow">${admin ? "ADMIN ACCESS" : "YOUR ACCOUNT"}</p><h2>${admin ? "Admin login" : "Log in to AgriConnect"}</h2><p class="muted">Enter your account details to continue.</p><div id="notice" class="notice" hidden></div><form data-action="${admin ? "admin-login" : "login"}" class="form-grid">${field("Email address", "email", "email", "", { attrs: 'autocomplete="username"' })}${field("Password", "password", "password", "", { attrs: 'autocomplete="current-password"' })}<button class="button button-primary button-wide" type="submit">Log in →</button></form><p class="auth-switch">${admin ? "Not an admin? <a href=\"login.html\">User login</a>" : `New to AgriConnect? <a href="signup.html">Create an account</a>`}</p>${!admin ? `<a class="subtle-link" href="admin-login.html">Administrator access</a>` : ""}</div></section>`;
}

function renderFarmerDashboard(user) {
  const products = allProducts().filter(item => item.farmerId === user.id);
  const orders = allOrders().filter(order => order.farmerId === user.id);
  const sales = orders.filter(order => order.status === "completed").reduce((sum, order) => sum + order.total, 0);
  const rows = products.slice(0, 5).map(product => `<tr><td><strong>${safe(product.name)}</strong><small>${safe(product.category)}</small></td><td>${product.quantity} ${safe(product.unit)}</td><td>${money(product.price)} / ${safe(product.unit)}</td><td>${statusPill(product.status)}</td><td><a class="table-link" href="add-product.html?id=${encodeURIComponent(product.id)}">Edit</a></td></tr>`);
  return `${setPageTitle(`Hello, ${safe(user.name.split(" ")[0])} 👋`, "Here's what's happening on your farm today.")}<div id="notice" class="notice" hidden></div><div class="stats-grid">${statCard("My listings", products.length, "🌱")}${statCard("Orders received", orders.length, "📦")}${statCard("Completed sales", orders.filter(item => item.status === "completed").length, "✓")}${statCard("Earnings", money(sales), "₹", "From completed orders")}</div><div class="dashboard-columns"><section class="panel"><div class="panel-heading"><div><p class="eyebrow">YOUR PRODUCE</p><h2>Recent listings</h2></div><a class="button button-primary button-small" href="add-product.html">+ Add product</a></div>${table(["Product", "Quantity", "Price", "Status", ""], rows, "Add your first product to start selling.")}</section><aside class="panel accent-panel"><span class="panel-icon">📊</span><p class="eyebrow">MARKET INSIGHT</p><h2>Know your market</h2><p>See sample price movements to help you plan your next listing. These are demonstration values, not live rates.</p><a class="arrow-link" href="market-prices.html">View market trends →</a><hr><a class="arrow-link" href="orders.html">Manage incoming orders →</a></aside></div>`;
}

function renderBuyerDashboard(user) {
  const products = allProducts().filter(item => item.status === "approved");
  const orders = allOrders().filter(order => order.buyerId === user.id);
  const rows = orders.slice(-4).reverse().map(order => `<tr><td>${safe(order.productName)}</td><td>${order.quantity} ${safe(order.unit)}</td><td>${money(order.total)}</td><td>${statusPill(order.status)}</td></tr>`);
  return `${setPageTitle(`Welcome, ${safe(user.name.split(" ")[0])} 👋`, "Find fresh produce from farmers in your community.")}<div id="notice" class="notice" hidden></div><div class="stats-grid">${statCard("Available products", products.length, "🥬")}${statCard("My orders", orders.length, "📦")}${statCard("In progress", orders.filter(order => !["completed", "cancelled"].includes(order.status)).length, "🚚")}${statCard("Community", "Local", "🤝", "Every order supports farmers")}</div><section class="panel"><div class="panel-heading"><div><p class="eyebrow">READY TO HARVEST</p><h2>Fresh from local farms</h2></div><a class="arrow-link" href="products.html">Browse all →</a></div><div class="product-grid compact-grid">${products.slice(0, 3).map(product => productCard(product)).join("")}</div></section><section class="panel"><div class="panel-heading"><div><p class="eyebrow">ORDER UPDATES</p><h2>Recent orders</h2></div><a class="table-link" href="orders.html">View all</a></div>${table(["Produce", "Quantity", "Total", "Status"], rows, "Your orders will appear here.")}</section>`;
}

function renderAddProduct(user) {
  const id = new URLSearchParams(location.search).get("id");
  const product = id ? allProducts().find(item => item.id === id && item.farmerId === user.id) : null;
  if (id && !product) return `${setPageTitle("Product not found")}<section class="panel"><p>This product could not be found in your listings.</p><a href="farmer-dashboard.html" class="button button-primary">Back to dashboard</a></section>`;
  return `<div class="form-page">${setPageTitle(product ? "Edit your listing" : "Add a product", product ? "Update the details of your produce." : "Tell buyers what's fresh on your farm.")}<div id="notice" class="notice" hidden></div><form data-action="save-product" data-id="${product ? safe(product.id) : ""}" class="panel form-grid product-form"><label class="field">Product name<input name="name" required maxlength="80" value="${safe(product?.name || "")}"></label><label class="field">Category<select name="category" required><option value="">Choose a category</option>${categories().map(category => `<option value="${safe(category)}"${product?.category === category ? " selected" : ""}>${safe(category)}</option>`).join("")}</select></label><div class="form-row">${field("Quantity available", "quantity", "number", product?.quantity ?? "", { attrs: 'min="0.1" step="0.1"' })}<label class="field">Unit<select name="unit" required>${["kg", "quintal", "piece", "litre", "dozen"].map(unit => `<option value="${unit}"${product?.unit === unit ? " selected" : ""}>${unit}</option>`).join("")}</select></label></div>${field("Price per unit (₹)", "price", "number", product?.price ?? "", { attrs: 'min="0.01" step="0.01"' })}<label class="field">Image URL <span class="optional">(optional)</span><input name="image" type="url" value="${safe(product?.image || "")}" placeholder="https://example.com/your-produce.jpg"></label><label class="field">Description<textarea name="description" rows="4" maxlength="500" placeholder="Describe your harvest, quality, or pickup details">${safe(product?.description || "")}</textarea></label><p class="form-hint">New listings are sent to the admin for approval before buyers can see them.</p><div class="form-actions"><button class="button button-primary" type="submit">${product ? "Save changes" : "Submit listing"} →</button><a class="button button-quiet" href="farmer-dashboard.html">Cancel</a>${product ? `<button class="button button-danger" type="button" data-action="delete-product" data-id="${safe(product.id)}">Delete listing</button>` : ""}</div></form></div>`;
}

function renderProducts() {
  const activeUser = currentUser();
  const isFarmer = activeUser?.role === "farmer";
  return `${setPageTitle("Fresh produce, fairly priced", "Browse approved listings and buy directly from local farmers.")}<div id="notice" class="notice" hidden></div><section class="filter-bar"><label class="search-field"><span>⌕</span><input type="search" id="product-search" placeholder="Search produce..." aria-label="Search produce"></label><label class="filter-select"><span class="sr-only">Filter by category</span><select id="category-filter"><option value="">All categories</option>${categories().map(category => `<option value="${safe(category)}">${safe(category)}</option>`).join("")}</select></label><label class="filter-select"><span class="sr-only">Sort products</span><select id="product-sort"><option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A–Z</option></select></label></section><p id="product-count" class="muted result-count"></p><div id="product-results" class="product-grid"></div>${isFarmer ? `<div class="callout compact-callout"><div><h2>Have produce to sell?</h2><p>Add a listing from your farmer dashboard.</p></div><a class="button button-primary" href="add-product.html">Add a listing →</a></div>` : ""}`;
}

function renderProductDetails() {
  const product = allProducts().find(item => item.id === new URLSearchParams(location.search).get("id") && item.status === "approved");
  if (!product) return `${setPageTitle("Product unavailable")}<section class="panel"><p>This listing may have been removed or is awaiting approval.</p><a href="products.html" class="button button-primary">Browse produce</a></section>`;
  const activeUser = currentUser();
  const form = activeUser?.role === "buyer"
    ? `<form data-action="place-order" data-id="${safe(product.id)}" class="order-form"><label class="field">Quantity (${safe(product.unit)})<input name="quantity" type="number" min="0.1" max="${Number(product.quantity)}" step="0.1" value="1" required></label><p class="order-total">Estimated total <strong id="order-total">${money(product.price)}</strong></p><button class="button button-primary button-wide" type="submit">Place simulated order →</button><p class="fine-print">No payment is collected. This is a project demonstration.</p></form>`
    : activeUser?.role === "farmer" && activeUser.id === product.farmerId
      ? `<a href="add-product.html?id=${encodeURIComponent(product.id)}" class="button button-primary">Edit your listing</a>`
      : `<a href="login.html" class="button button-primary">Log in as a buyer to order</a>`;
  return `${setPageTitle("Meet your next fresh find")}<div id="notice" class="notice" hidden></div><section class="detail-layout"><div class="detail-image"><img src="${safe(product.image)}" alt="${safe(product.name)}"></div><div class="detail-content"><span class="category-tag">${safe(product.category)}</span><p class="farmer-label">GROWN BY ${safe(farmerName(product.farmerId)).toUpperCase()}</p><h1>${safe(product.name)}</h1><p class="detail-description">${safe(product.description || "Fresh local produce, carefully grown and harvested.")}</p><div class="detail-price">${money(product.price)} <span>/ ${safe(product.unit)}</span></div><p class="availability">${Number(product.quantity)} ${safe(product.unit)} available</p><hr>${form}<p class="fine-print">Orders are simulated and do not process real payments.</p></div></section>`;
}

function renderOrders(user) {
  const active = session();
  let orders = allOrders();
  if (active.role === "buyer") orders = orders.filter(order => order.buyerId === user.id);
  if (active.role === "farmer") orders = orders.filter(order => order.farmerId === user.id);
  orders = orders.slice().reverse();
  const rows = orders.map(order => {
    const otherParty = active.role === "buyer" ? farmerName(order.farmerId) : safe(order.buyerName);
    const controls = active.role === "farmer" && ["pending", "confirmed", "shipped"].includes(order.status)
      ? `<select class="status-select" data-action="update-order" data-id="${safe(order.id)}" aria-label="Update order status"><option value="">Update status</option>${(order.status === "pending" ? ["confirmed", "cancelled"] : order.status === "confirmed" ? ["shipped", "cancelled"] : ["completed"]).map(status => `<option value="${status}">${status[0].toUpperCase()}${status.slice(1)}</option>`).join("")}</select>`
      : "—";
    return `<tr><td><strong>${safe(order.productName)}</strong><small>${new Date(order.createdAt).toLocaleDateString()}</small></td><td>${safe(otherParty)}</td><td>${Number(order.quantity)} ${safe(order.unit)}</td><td>${money(order.total)}</td><td>${statusPill(order.status)}</td><td>${controls}</td></tr>`;
  });
  const kind = active.role === "buyer" ? "Your purchase history and order updates." : active.role === "admin" ? "Monitor marketplace orders and their progress." : "Review buyer orders and update their progress.";
  const headers = ["Product", active.role === "buyer" ? "Farmer" : "Buyer", "Quantity", "Total", "Status"];
  if (active.role === "farmer") headers.push("Update");
  return `${setPageTitle("Orders", kind)}<div id="notice" class="notice" hidden></div><section class="panel">${active.role === "admin" ? `<div class="panel-heading"><h2>All marketplace orders</h2></div>` : ""}${table(headers, rows, "Orders placed through AgriConnect will appear here.")}</section><p class="fine-print">This application simulates orders. It does not process payments or arrange real delivery.</p>`;
}

function renderMarketPrices() {
  const prices = readStore(STORE.prices, demoPrices);
  const rows = prices.map(item => `<tr><td><strong>${safe(item.product)}</strong></td><td>${safe(item.market)}</td><td>${money(item.price)} / ${safe(item.unit)}</td><td class="${item.change >= 0 ? "trend-up" : "trend-down"}">${item.change >= 0 ? "↑" : "↓"} ${Math.abs(item.change)}%</td><td><div class="mini-bars" aria-label="Sample price trend"><i style="height:${Math.max(18, 35 + item.change * 3)}%"></i><i style="height:${Math.max(22, 48 + item.change * 2)}%"></i><i style="height:${Math.max(24, 60 + item.change)}%"></i><i style="height:${Math.max(20, 52 + item.change * 2)}%"></i><i style="height:${Math.max(28, 66 + item.change)}%"></i></div></td></tr>`);
  return `${setPageTitle("Market price trends", "Use sample market information to help plan your next buying or selling decision.")}<div class="demo-warning"><strong>Demonstration data — not live market rates.</strong> Prices are sample values included for the project review. Please check your local market for current rates.</div><div class="stats-grid">${statCard("Sample crops", prices.length, "🌾")}${statCard("Price unit", "Per unit", "₹")}${statCard("Data source", "Demo", "ℹ️")}${statCard("Last updated", "Sample set", "◷")}</div><section class="panel"><div class="panel-heading"><div><p class="eyebrow">SAMPLE LOCAL MARKET SNAPSHOT</p><h2>Indicative prices</h2></div></div>${table(["Product", "Market", "Sample price", "Change", "Recent trend"], rows, "No sample price data is available.")}</section><p class="fine-print">These values are for demonstration only and should not be treated as live or guaranteed prices.</p>`;
}

function renderProfile(user) {
  return `${setPageTitle("Your profile", "Keep your contact information up to date.")}<div id="notice" class="notice" hidden></div><form data-action="save-profile" class="panel profile-form form-grid"><div class="profile-avatar">${safe(user.name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase())}</div><div class="profile-role">${safe(user.role)} account · ${safe(user.email)}</div>${field("Full name", "name", "text", user.name)}${field("Email address (cannot be changed)", "email", "email", user.email, { attrs: "disabled" })}${field("Phone number", "phone", "tel", user.phone || "", { attrs: 'pattern="[0-9+() -]{7,20}"' })}${field("Village / city", "location", "text", user.location || "")}<label class="field">New password <span class="optional">(leave blank to keep current password)</span><input name="password" type="password" minlength="6" autocomplete="new-password"></label><button class="button button-primary" type="submit">Save profile changes</button></form>`;
}

function renderAdminDashboard() {
  const users = allUsers();
  const products = allProducts();
  const orders = allOrders();
  const totalSales = orders.filter(order => order.status === "completed").reduce((sum, order) => sum + order.total, 0);
  const reports = readStore(STORE.reports, []);
  const listingRows = products.slice().reverse().map(product => `<tr><td><strong>${safe(product.name)}</strong><small>${safe(farmerName(product.farmerId))}</small></td><td>${safe(product.category)}</td><td>${money(product.price)} / ${safe(product.unit)}</td><td>${statusPill(product.status)}</td><td>${product.status === "pending" ? `<button class="table-action" data-action="approve-product" data-id="${safe(product.id)}">Approve</button>` : ""}<button class="table-action danger-text" data-action="remove-product" data-id="${safe(product.id)}">Remove</button></td></tr>`);
  const userRows = users.map(user => `<tr><td><strong>${safe(user.name)}</strong><small>${safe(user.email)}</small></td><td>${safe(user.role)}</td><td>${safe(user.location || "—")}</td><td>${safe(user.phone || "—")}</td></tr>`);
  const orderRows = orders.slice().reverse().map(order => `<tr><td>${safe(order.productName)}</td><td>${safe(order.buyerName)}</td><td>${safe(farmerName(order.farmerId))}</td><td>${money(order.total)}</td><td>${statusPill(order.status)}</td></tr>`);
  const reportRows = reports.map(report => {
    const item = products.find(product => product.id === report.productId);
    return `<tr><td>${safe(item?.name || "Listing removed")}</td><td>${safe(report.reason)}</td><td>${safe(report.reportedAt)}</td><td><button class="table-action" data-action="dismiss-report" data-id="${safe(report.id)}">Dismiss</button>${item ? `<button class="table-action danger-text" data-action="remove-product" data-id="${safe(item.id)}">Remove listing</button>` : ""}</td></tr>`;
  });
  const categoryRows = categories().map(category => `<span class="category-chip">${safe(category)}<button type="button" aria-label="Remove ${safe(category)} category" data-action="remove-category" data-category="${safe(category)}">×</button></span>`).join("");
  return `${setPageTitle("Admin dashboard", "Manage the AgriConnect community and marketplace.")}<div id="notice" class="notice" hidden></div><div class="stats-grid">${statCard("Registered users", users.length, "👥")}${statCard("Product listings", products.length, "🌿")}${statCard("Orders", orders.length, "📦")}${statCard("Completed sales", money(totalSales), "₹", "Simulated completed orders")}</div><section class="panel"><div class="panel-heading"><div><p class="eyebrow">MARKETPLACE MODERATION</p><h2>Product listings</h2></div><span class="status status-pending">${products.filter(item => item.status === "pending").length} awaiting review</span></div>${table(["Product / farmer", "Category", "Price", "Status", "Actions"], listingRows, "No listings have been added.")}</section><div class="dashboard-columns"><section class="panel"><div class="panel-heading"><div><p class="eyebrow">COMMUNITY</p><h2>Registered users</h2></div></div>${table(["Name / email", "Role", "Location", "Phone"], userRows, "No users have registered.")}</section><section class="panel"><div class="panel-heading"><div><p class="eyebrow">REPORTED LISTINGS</p><h2>Reports (${reports.length})</h2></div></div>${table(["Listing", "Reason", "Reported", "Actions"], reportRows, "No listings have been reported.")}</section></div><section class="panel"><div class="panel-heading"><div><p class="eyebrow">ORDER MONITOR</p><h2>Recent orders</h2></div><a class="table-link" href="orders.html">Open orders</a></div>${table(["Product", "Buyer", "Farmer", "Total", "Status"], orderRows, "No orders have been placed.")}</section><section class="panel category-panel"><div class="panel-heading"><div><p class="eyebrow">MARKETPLACE SETUP</p><h2>Product categories</h2></div></div><div class="category-list">${categoryRows || `<span class="muted">No categories added.</span>`}</div><form data-action="add-category" class="inline-form"><label class="sr-only" for="new-category">New category name</label><input id="new-category" name="category" maxlength="30" placeholder="Add a category" required><button class="button button-primary button-small" type="submit">Add category</button></form></section>`;
}

function renderPage(page) {
  const user = currentUser();
  const templates = {
    home: () => renderHome(),
    signup: () => renderSignup(),
    login: () => renderLogin(),
    "admin-login": () => renderLogin(true),
    "farmer-dashboard": () => renderFarmerDashboard(user),
    "buyer-dashboard": () => renderBuyerDashboard(user),
    "add-product": () => renderAddProduct(user),
    products: () => renderProducts(),
    "product-details": () => renderProductDetails(),
    orders: () => renderOrders(user),
    "market-prices": () => renderMarketPrices(),
    profile: () => renderProfile(user),
    "admin-dashboard": () => renderAdminDashboard()
  };
  return (templates[page] || templates.home)();
}

function renderProductResults() {
  const search = (document.querySelector("#product-search")?.value || "").trim().toLowerCase();
  const category = document.querySelector("#category-filter")?.value || "";
  const sort = document.querySelector("#product-sort")?.value || "newest";
  const products = allProducts().filter(product => product.status === "approved")
    .filter(product => product.name.toLowerCase().includes(search) || product.category.toLowerCase().includes(search) || farmerName(product.farmerId).toLowerCase().includes(search))
    .filter(product => !category || product.category === category);
  if (sort === "price-low") products.sort((a, b) => a.price - b.price);
  if (sort === "price-high") products.sort((a, b) => b.price - a.price);
  if (sort === "name") products.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "newest") products.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  document.querySelector("#product-count").textContent = `${products.length} ${products.length === 1 ? "product" : "products"} found`;
  document.querySelector("#product-results").innerHTML = products.length
    ? products.map(product => productCard(product, true)).join("")
    : `<div class="empty-state"><span>🔎</span><h3>No matching produce</h3><p>Try another search or choose a different category.</p></div>`;
}

function redirectForRole(role) {
  const pages = { farmer: "farmer-dashboard.html", buyer: "buyer-dashboard.html", admin: "admin-dashboard.html" };
  location.href = pages[role] || "index.html";
}

function onFormSubmit(event) {
  const form = event.target.closest("form[data-action]");
  if (!form) return;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const action = form.dataset.action;

  if (action === "signup") {
    const users = allUsers();
    const email = data.email.trim().toLowerCase();
    if (users.some(user => user.email.toLowerCase() === email)) return notice("An account with this email already exists.", "error");
    const user = { id: makeId("user"), name: data.name.trim(), email, password: data.password, role: data.role, phone: data.phone.trim(), location: data.location.trim() };
    users.push(user);
    writeStore(STORE.users, users);
    writeStore(STORE.session, { userId: user.id, role: user.role });
    redirectForRole(user.role);
  }

  if (action === "login") {
    const email = data.email.trim().toLowerCase();
    const user = allUsers().find(item => item.email.toLowerCase() === email && item.password === data.password);
    if (!user) return notice("The email or password is incorrect. Please try again.", "error");
    writeStore(STORE.session, { userId: user.id, role: user.role });
    redirectForRole(user.role);
  }

  if (action === "admin-login") {
    if (data.email.trim().toLowerCase() !== "admin@agriconnect.com" || data.password !== "admin123") return notice("Admin email or password is incorrect.", "error");
    writeStore(STORE.session, { userId: "admin", role: "admin" });
    redirectForRole("admin");
  }

  if (action === "save-product") {
    const user = currentUser();
    const products = allProducts();
    const existing = form.dataset.id ? products.find(item => item.id === form.dataset.id && item.farmerId === user.id) : null;
    const updated = {
      id: existing?.id || makeId("crop"), farmerId: user.id, name: data.name.trim(), category: data.category,
      quantity: Number(data.quantity), unit: data.unit, price: Number(data.price), image: data.image.trim(),
      description: data.description.trim(), status: existing?.status || "pending",
      createdAt: existing?.createdAt || new Date().toISOString().slice(0, 10)
    };
    if (existing) products[products.indexOf(existing)] = updated;
    else products.push(updated);
    writeStore(STORE.products, products);
    location.href = "farmer-dashboard.html";
  }

  if (action === "place-order") {
    const user = currentUser();
    const products = allProducts();
    const product = products.find(item => item.id === form.dataset.id && item.status === "approved");
    const quantity = Number(data.quantity);
    if (!product) return notice("This listing is no longer available.", "error");
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > product.quantity) return notice("Enter a quantity that is available for this listing.", "error");
    product.quantity = Number((product.quantity - quantity).toFixed(2));
    writeStore(STORE.products, products);
    const orders = allOrders();
    orders.push({
      id: makeId("order"), productId: product.id, productName: product.name, farmerId: product.farmerId,
      buyerId: user.id, buyerName: user.name, quantity, unit: product.unit,
      unitPrice: product.price, total: Number((quantity * product.price).toFixed(2)),
      status: "pending", createdAt: new Date().toISOString()
    });
    writeStore(STORE.orders, orders);
    location.href = "orders.html?placed=1";
  }

  if (action === "save-profile") {
    const user = currentUser();
    const users = allUsers();
    const index = users.findIndex(item => item.id === user.id);
    users[index] = { ...users[index], name: data.name.trim(), phone: data.phone.trim(), location: data.location.trim() };
    if (data.password) users[index].password = data.password;
    writeStore(STORE.users, users);
    notice("Your profile has been updated.");
    setTimeout(() => location.reload(), 900);
  }

  if (action === "add-category") {
    const list = categories();
    const category = data.category.trim();
    if (list.some(item => item.toLowerCase() === category.toLowerCase())) return notice("That category already exists.", "error");
    list.push(category);
    writeStore(STORE.categories, list);
    location.reload();
  }
}

function onClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button || button.matches("form")) return;
  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === "logout") {
    localStorage.removeItem(STORE.session);
    location.href = "index.html";
  }
  if (action === "delete-product") {
    if (!confirm("Delete this product listing? This cannot be undone.")) return;
    writeStore(STORE.products, allProducts().filter(item => item.id !== id));
    location.href = "farmer-dashboard.html";
  }
  if (action === "approve-product") {
    const products = allProducts();
    const item = products.find(product => product.id === id);
    if (item) { item.status = "approved"; writeStore(STORE.products, products); location.reload(); }
  }
  if (action === "remove-product") {
    if (!confirm("Remove this listing from the marketplace?")) return;
    writeStore(STORE.products, allProducts().filter(item => item.id !== id));
    writeStore(STORE.reports, readStore(STORE.reports, []).filter(report => report.productId !== id));
    location.reload();
  }
  if (action === "report-product") {
    const reports = readStore(STORE.reports, []);
    if (reports.some(report => report.productId === id)) return notice("This listing has already been reported.");
    reports.push({ id: makeId("report"), productId: id, reason: "Reported by a marketplace user", reportedAt: new Date().toLocaleDateString() });
    writeStore(STORE.reports, reports);
    notice("Thank you. The listing has been reported to the admin.");
  }
  if (action === "dismiss-report") {
    writeStore(STORE.reports, readStore(STORE.reports, []).filter(report => report.id !== id));
    location.reload();
  }
  if (action === "remove-category") {
    const name = button.dataset.category;
    if (allProducts().some(product => product.category === name)) return notice("This category is used by a listing and cannot be removed yet.", "error");
    writeStore(STORE.categories, categories().filter(category => category !== name));
    location.reload();
  }
}

function onChange(event) {
  const select = event.target.closest('select[data-action="update-order"]');
  if (!select || !select.value) return;
  const orders = allOrders();
  const order = orders.find(item => item.id === select.dataset.id);
  if (!order) return notice("This order could not be found.", "error");
  const allowed = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["shipped", "cancelled"],
    shipped: ["completed"]
  };
  if (!allowed[order.status]?.includes(select.value)) return notice("That order status change is not allowed.", "error");
  if (select.value === "cancelled") {
    const product = allProducts().find(item => item.id === order.productId);
    if (product) {
      product.quantity = Number((product.quantity + order.quantity).toFixed(2));
      writeStore(STORE.products, allProducts().map(item => item.id === product.id ? product : item));
    }
  }
  order.status = select.value;
  writeStore(STORE.orders, orders);
  location.reload();
}

function validateAccess(page) {
  const active = session();
  const user = currentUser();
  if (active && active.role !== "admin" && !user) {
    localStorage.removeItem(STORE.session);
    location.href = "login.html";
    return false;
  }
  const required = {
    "farmer-dashboard": "farmer", "add-product": "farmer", "buyer-dashboard": "buyer",
    orders: ["buyer", "farmer", "admin"], profile: ["buyer", "farmer"], "admin-dashboard": "admin"
  }[page];
  if (required && (!active || (Array.isArray(required) ? !required.includes(active.role) : active.role !== required))) {
    location.href = active ? (active.role === "farmer" ? "farmer-dashboard.html" : active.role === "buyer" ? "buyer-dashboard.html" : "admin-dashboard.html") : "login.html";
    return false;
  }
  if (["signup", "login", "admin-login"].includes(page) && active) {
    redirectForRole(active.role);
    return false;
  }
  return true;
}

function startApp() {
  initializeDemoData();
  const page = document.body.dataset.page || "home";
  if (!validateAccess(page)) return;
  const app = document.querySelector("#app");
  app.innerHTML = `${renderHeader()}<main class="main-content">${renderPage(page)}</main><footer class="site-footer"><div class="footer-main"><a class="brand brand-footer" href="index.html"><span class="brand-mark">A</span><span>Agri<span>Connect</span><small>FARM DIRECT. BUY FAIR.</small></span></a><p>Connecting local farmers and buyers for a fairer, fresher food system.</p><div class="footer-links"><a href="products.html">Browse produce</a><a href="market-prices.html">Market prices</a><a href="admin-login.html">Admin</a></div></div><div class="footer-bottom"><span>© 2026 AgriConnect · College project demonstration</span><span>Sample prices · Simulated orders · No real payments</span></div></footer>`;
  if (page === "products") renderProductResults();
  if (page === "product-details") {
    const input = document.querySelector('input[name="quantity"]');
    if (input) input.addEventListener("input", () => {
      const product = allProducts().find(item => item.id === new URLSearchParams(location.search).get("id"));
      document.querySelector("#order-total").textContent = money((Number(input.value) || 0) * (product?.price || 0));
    });
  }
  if (location.search.includes("placed=1")) notice("Your order was placed. You can follow its status below.");
  document.addEventListener("submit", onFormSubmit);
  document.addEventListener("click", onClick);
  document.addEventListener("change", onChange);
  const search = document.querySelector("#product-search");
  if (search) search.addEventListener("input", renderProductResults);
  ["#category-filter", "#product-sort"].forEach(selector => {
    const element = document.querySelector(selector);
    if (element) element.addEventListener("change", renderProductResults);
  });
  const menu = document.querySelector(".menu-toggle");
  menu?.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!expanded));
    document.querySelector(".site-header").classList.toggle("nav-open", !expanded);
  });
}

startApp();
