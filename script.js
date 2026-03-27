// Global state
let cart = [];
let products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 99999,
        oldPrice: 119900,
        image: "https://www.triveniworld.com/cdn/shop/files/apple-iphone-15-pro-512-gb-natural-titanium-triveni-world-1.jpg?v=1736343995&width=1100"
    },
    {
        id: 2,
        name: "Gaming Laptop",
        price: 149999,
        oldPrice: 179999,
        image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?w=400&h=250&fit=crop&auto=compress&cs=tinysrgb"
    },
    {
        id: 3,
        name: "Apple Watch Ultra",
        price: 79999,
        oldPrice: 89900,
        image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MGCC4_VW_34FR+watch-case-49-titanium-natural-ultra3_VW_34FR+watch-face-49-ocean-ultra3_VW_34FR?wid=5120&hei=3280&bgc=fafafa&trim=1&fmt=p-jpg&qlt=80&.v=T1lWTTZnNjJ0cHU5TWZLUktueGVoS1ZGV0ZiSDllNHd6YWJwdVV2Z2xBWm9SMGMvQkpTNDBiSVZSVExOcXdwL21waDNwS2JiYllsTkdSSzZVQyt6UTA3TEpxSjk0aTYwUmxLdzg5clk4QlA0djFINWxKM2N1ODZxM3paRjhkcHlyVDRiVmdZZVNaZWZoQXpFYWZuTUJwdCtjanNSR3I0b2ZzaC9XVGo3anVzYlh2NG8wVjlsTCtqMWFNc20rOXN6UUxEaDhOQldDNkNRMFdXOG9BTC9JMlBEaGQxRytQT2dxQXNWKzI0c0ViQQ"
    }
];

// DOM elements
const productGrid = document.getElementById('productGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
const newsletterForm = document.getElementById('newsletterForm');
const contactForm = document.getElementById('contactForm');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    initSmoothScroll();
    initScrollEffects();
});

// Smooth scroll
function scrollToProducts() {
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
}

// Render products
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="col-lg-4 col-md-6">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top product-img" alt="${product.name}" loading="lazy">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${product.name}</h5>
                    <div class="mt-auto">
                        <p class="text-success fs-3 fw-bold mb-2">₹${product.price.toLocaleString()}
                            <span class="text-decoration-line-through text-muted fs-6 ms-2">₹${product.oldPrice.toLocaleString()}</span>
                        </p>
                        <button class="btn btn-primary w-100 add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus me-2"></i>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            addToCart(parseInt(this.dataset.id));
        });
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showNotification('Added to cart!', 'success');
}

// Update cart UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBtn.innerHTML = `<i class="fas fa-shopping-cart me-1"></i>Cart (${totalItems})`;
}

// Newsletter form validation
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    const msgDiv = document.getElementById('newsletterMsg');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        msgDiv.innerHTML = '<div class="alert alert-danger">Please enter a valid email address!</div>';
        return;
    }
    
    msgDiv.innerHTML = '<div class="alert alert-success">✅ Thank you for subscribing!</div>';
    this.reset();
    setTimeout(() => msgDiv.innerHTML = '', 3000);
});

// Contact form validation
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const submitBtn = document.getElementById('submitBtn');
    const msgDiv = document.getElementById('contactMsg');
    
    // Reset previous states
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    msgDiv.innerHTML = '';
    
    let isValid = true;
    
    // Name validation
    if (!name) {
        document.getElementById('contactName').classList.add('is-invalid');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('contactEmail').classList.add('is-invalid');
        isValid = false;
    }
    
    // Message validation
    if (message.length < 10) {
        document.getElementById('contactMessage').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!isValid) {
        msgDiv.innerHTML = '<div class="alert alert-danger">Please fix the errors above!</div>';
        return;
    }
    
    // Show loading
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Sending...';
    submitBtn.classList.add('btn-loading');
    
    // Simulate API call
    setTimeout(() => {
        msgDiv.innerHTML = '<div class="alert alert-success">✅ Message sent successfully! We\'ll get back to you soon.</div>';
        contactForm.reset();
        submitBtn.innerHTML = 'Send Message';
        submitBtn.classList.remove('btn-loading');
    }, 2000);
});

// Cart modal
cartBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted mb-0">Your cart is empty 😢</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="d-flex align-items-center p-3 border-bottom">
                <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" alt="${item.name}" class="me-3">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="mb-1 text-success fw-bold">₹${item.price.toLocaleString()}</p>
                    <small class="text-muted">Qty: ${item.quantity}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');
        
        document.getElementById('checkoutBtn').onclick = function() {
            alert(`Proceeding to checkout with ${cart.length} items! 🚀`);
            cart = [];
            updateCartUI();
            cartModal.hide();
        };
    }
    
    cartModal.show();
});

// Utility functions
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    // Refresh modal content
    cartBtn.click();
}

function showNotification(message, type = 'info') {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : 'info'} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initScrollEffects() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}
// End of script.js