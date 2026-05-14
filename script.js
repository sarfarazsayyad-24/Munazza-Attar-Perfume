// 🔥 MUNAZZA STORE - COMPLETE JAVASCRIPT 🔥
class MunazzaStore {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('munazzaProducts')) || [];
        this.cart = JSON.parse(localStorage.getItem('munazzaCart')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderProducts();
        this.updateCartCount();
        this.loadSampleProducts();
        this.observeScroll();
        console.log('🚀 Munazza Store Initialized!');
    }

    bindEvents() {
        // Navigation & Cart
        document.getElementById('cartBtn').addEventListener('click', () => this.toggleCart());
        document.getElementById('mobileMenuBtn').addEventListener('click', () => this.toggleMobileMenu());
        document.querySelector('[href="#shop"]').addEventListener('click', () => this.scrollToShop());

        // Admin Panel Trigger
        const adminTrigger = document.createElement('button');
        adminTrigger.innerHTML = '<i class="fas fa-cog mr-2"></i>Admin Panel';
        adminTrigger.className = 'fixed top-24 right-4 z-40 bg-gradient-to-r from-gold to-gold-dark text-black px-6 py-3 rounded-xl font-bold hover:scale-105 shadow-2xl transition-all cursor-pointer admin-trigger';
        document.body.appendChild(adminTrigger);
        adminTrigger.addEventListener('click', () => this.toggleAdminPanel());

        // Admin Events
        document.getElementById('closeAdmin').addEventListener('click', () => this.toggleAdminPanel());
        document.getElementById('addProductForm').addEventListener('submit', (e) => this.addProduct(e));
        document.getElementById('clearAllProducts').addEventListener('click', () => this.clearAllProducts());
        document.getElementById('exportData').addEventListener('click', () => this.exportData());

        // Cart Modal
        document.getElementById('closeCart').addEventListener('click', () => this.toggleCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());
    }

    loadSampleProducts() {
        if (this.products.length === 0) {
            this.products = [
                {
                    id: 1, name: "Oud Sultan Attar", price: 2500, category: "attar",
                    image: "https://images.unsplash.com/photo-1611606061945-3d9fa22ebee6?w=400&h=500&fit=crop",
                    desc: "Pure Oud essence with saffron and rose. 12ml"
                },
                {
                    id: 2, name: "Amber Musk Attar", price: 1800, category: "attar",
                    image: "https://images.unsplash.com/photo-1590736969950-785e3d5facc9?w=400&h=500&fit=crop",
                    desc: "Rich amber with white musk. Long-lasting 10ml"
                },
                {
                    id: 3, name: "Royal French Perfume", price: 4500, category: "perfume",
                    image: "https://images.unsplash.com/photo-1587014611671-908f72ae54a0?w=400&h=500&fit=crop",
                    desc: "Eau de Parfum 100ml. Top notes: Bergamot, Lemon"
                },
                {
                    id: 4, name: "Noir Intense EDP", price: 5200, category: "perfume",
                    image: "https://images.unsplash.com/photo-1574126154838-42d8e2ac7e98?w=400&h=500&fit=crop",
                    desc: "Dark woody fragrance. 100ml luxury bottle"
                }
            ];
            this.saveProducts();
            this.renderProducts();
        }
    }

    toggleAdminPanel() {
        document.getElementById('adminPanel').classList.toggle('show');
    }

    addProduct(e) {
        e.preventDefault();
        const name = document.getElementById('productName').value;
        const price = parseInt(document.getElementById('productPrice').value);
        const category = document.getElementById('productCategory').value;
        const file = document.getElementById('productImage').files[0];
        const desc = document.getElementById('productDesc').value;

        if (!name || !price || !desc) {
            alert('❌ Please fill all fields!');
            return;
        }

        const newProduct = {
            id: Date.now(),
            name, price, category, desc,
            image: file ? URL.createObjectURL(file) : this.products[0]?.image
        };

        this.products.unshift(newProduct); // Add to beginning
        this.saveProducts();
        this.renderProducts();
        e.target.reset();
        this.showNotification('✅ Product Added Successfully!');
    }

    clearAllProducts() {
        if (confirm('⚠️ Delete ALL products? This cannot be undone!')) {
            this.products = [];
            this.saveProducts();
            document.getElementById('attarProducts').innerHTML = '';
            document.getElementById('perfumeProducts').innerHTML = '';
            this.showNotification('🗑️ All products cleared!');
        }
    }

    exportData() {
        const data = { products: this.products, cart: this.cart, timestamp: new Date().toISOString() };
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = munazza-backup-${new Date().toISOString().split('T')[0]}.json;
        link.click();
        this.showNotification('💾 Data exported!');
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'group product-hover rounded-3xl p-8 cursor-pointer overflow-hidden hover:border-gold transition-all duration-500';
        card.onclick = () => this.addToCart(product);

        card.innerHTML = `
            <div class="relative mb-6">
                <img src="${product.image}" alt="${product.name}" class="w-full h-80 object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700">
                <div class="absolute top-4 right-4 bg-gold text-black px-4 py-2 rounded-xl font-bold text-sm shadow-lg category-badge">
                    ${product.category.toUpperCase()}
                </div>
                <button class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-gold-dark text-black px-8 py-3 rounded-full font-bold text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 add-to-cart-btn">
                    <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                </button>
            </div>
            <div>
                <h3 class="font-cinzel text-2xl font-bold text-white mb-3 group-hover:text-gold transition-colors product-title">${product.name}</h3>
                <p class="font-inter text-gray-400 mb-4 leading-relaxed product-desc">${product.desc}</p>
                <div class="flex items-center justify-between">
                    <span class="font-bold text-3xl text-gold product-price">₹${product.price.toLocaleString()}</span>
                    <div class="flex items-center gap-2 text-gold rating">
                        <i class="fas fa-star text-yellow-400"></i>
                        <span class="font-bold">4.9</span>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    renderProducts() {
        const attarContainer = document.getElementById('attarProducts');
        const perfumeContainer = document.getElementById('perfumeProducts');

        attarContainer.innerHTML = '';
        perfumeContainer.innerHTML = '';

        this.products.forEach(product => {
            const card = this.createProductCard(product);
            if (product.category === 'attar') {
                attarContainer.appendChild(card);
            } else {
                perfumeContainer.appendChild(card);
            }
        });
    }

    addToCart(product) {
        const existing = this.cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.updateCartCount();
        this.showNotification(${product.name} added to cart! 🛒);
    }

    toggleCart() {
        const modal = document.getElementById('cartModal');
        modal.classList.toggle('show');
        if (modal.classList.contains('show')) {
            this.renderCart();
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<div class="text-center py-12"><p class="text-gray-400 text-lg">Your cart is empty 😔</p></div>';
            cartTotal.textContent = '₹0';
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="flex items-center gap-6 p-6 bg-black/50 rounded-2xl border border-gold/20 cart-item">
                <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-xl">
                <div class="flex-1">
                    <h4 class="font-bold text-xl mb-2">${item.name}</h4>
                    <p class="text-gray-400 mb-4">${item.desc}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-gold">₹${(item.price * item.quantity).toLocaleString()}</span>
                        <div class="flex items-center gap-4 bg-black/50 px-4 py-2 rounded-xl quantity-controls">
                            <button onclick="store.updateQuantity(${item.id}, -1)" class="text-2xl hover:text-gold qty-btn">-</button>
                            <span class="font-bold min-w-[2ch] text-center">${item.quantity}</span>
                            <button onclick="store.updateQuantity(${item.id}, 1)" class="text-2xl hover:text-gold qty-btn">+</button>
                        </div>
                    </div>
                </div>
                <button onclick="store.removeFromCart(${item.id})" class="text-red-400 hover:text-red-300 text-xl remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = ₹${total.toLocaleString()};
    }

    updateQuantity(id, change) {
        const item = this.cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(id);
            } else {
                this.saveCart();
                this.updateCartCount();
                this.renderCart();
            }
        }
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        this.showNotification('🗑️ Item removed from cart');
    }

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = count || 0;
    }

    saveProducts() {
        localStorage.setItem('munazzaProducts', JSON.stringify(this.products));
    }

    saveCart() {
        localStorage.setItem('munazzaCart', JSON.stringify(this.cart));
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is empty!');
            return;
        }
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(🎉 Order Confirmed!\n\nTotal: ₹${total.toLocaleString()}\n\nThank you for shopping with Munazza! 💎\nWe will contact you soon.);
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.toggleCart();
        this.showNotification('✅ Order placed successfully!');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-28 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-gold-dark text-black px-8 py-4 rounded-2xl font-bold shadow-2xl z-50 notification animate-pulse';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    scrollToShop() {
        document.getElementById('attar').scrollIntoView({ behavior: 'smooth' });
    }

    toggleMobileMenu() {
        const nav = document.querySelector('nav ul');
        nav.classList.toggle('hidden');
    }

    observeScroll() {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(0,0,0,0.95)';
                navbar.style.backdropFilter = 'blur(30px)';
            } else {
                navbar.style.background = 'rgba(0,0,0,0.8)';
                navbar.style.backdropFilter = 'blur(20px)';
            }

            if (window.scrollY > lastScroll && window.scrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScroll = window.scrollY;
        });
    }
}

// 🔥 INITIALIZE STORE 🔥
const store = new MunazzaStore();
