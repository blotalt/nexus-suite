/**
 * Store Module - E-Commerce Showcase, Product Filtering, Cart & Checkout
 */

const StoreModule = (() => {
  const products = [
    {
      id: 1,
      name: 'Aether Pro Studio Headphones',
      category: 'Audio',
      price: 299,
      oldPrice: 349,
      rating: 4.9,
      reviews: 142,
      badge: 'hot',
      icon: 'headphone',
      description: 'Spatial audio with active noise cancellation and 40-hour ultra-low latency wireless battery life.'
    },
    {
      id: 2,
      name: 'Chronos OLED Smartwatch v3',
      category: 'Wearables',
      price: 249,
      oldPrice: 289,
      rating: 4.8,
      reviews: 98,
      badge: 'new',
      icon: 'watch',
      description: 'Continuous biometric monitoring, sapphire crystal display, titanium bezel, and water-resistance up to 50m.'
    },
    {
      id: 3,
      name: 'Apex Mechanical Keyboard',
      category: 'Tech & Gadgets',
      price: 189,
      oldPrice: 219,
      rating: 4.9,
      reviews: 210,
      badge: '',
      icon: 'keyboard',
      description: 'Custom hot-swappable tactile switches, gasket mounted, aerospace-grade aluminum chassis with RGB underglow.'
    },
    {
      id: 4,
      name: 'AeroGlide Wireless Precision Mouse',
      category: 'Tech & Gadgets',
      price: 119,
      oldPrice: 149,
      rating: 4.7,
      reviews: 84,
      badge: 'sale',
      icon: 'mouse',
      description: 'Ultralight 52g carbon frame, 30,000 DPI optical sensor, and zero-drag magnetic charging dock.'
    },
    {
      id: 5,
      name: 'Lumix Beam 4K Webcam & Mic',
      category: 'Accessories',
      price: 159,
      oldPrice: 199,
      rating: 4.6,
      reviews: 73,
      badge: 'new',
      icon: 'camera',
      description: 'Ultra HD 60fps streaming sensor with dual beamforming noise-isolating microphones and auto-framing.'
    },
    {
      id: 6,
      name: 'NovaSound Ambient Bluetooth Pod',
      category: 'Audio',
      price: 139,
      oldPrice: 169,
      rating: 4.8,
      reviews: 115,
      badge: '',
      icon: 'speaker',
      description: '360-degree omnidirectional acoustics with deep punchy bass radiators and IPX7 waterproof housing.'
    }
  ];

  let cart = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';

  function init() {
    renderProducts();
    setupFilters();
    setupCartDrawerEvents();
  }

  function getProductSvg(type) {
    switch (type) {
      case 'headphone':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`;
      case 'watch':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.34a2 2 0 0 1 2 1.82l.35 3.83"></path></svg>`;
      case 'keyboard':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="8" x2="6.01" y2="8"></line><line x1="10" y1="8" x2="10.01" y2="8"></line><line x1="14" y1="8" x2="14.01" y2="8"></line><line x1="18" y1="8" x2="18.01" y2="8"></line><line x1="6" y1="12" x2="6.01" y2="12"></line><line x1="10" y1="12" x2="10.01" y2="12"></line><line x1="14" y1="12" x2="14.01" y2="12"></line><line x1="18" y1="12" x2="18.01" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>`;
      case 'mouse':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="7"></rect><line x1="12" y1="6" x2="12" y2="10"></line></svg>`;
      case 'camera':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>`;
    }
  }

  function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let filtered = products.filter(p => {
      const matchCat = currentCategory === 'all' || p.category.toLowerCase().includes(currentCategory.toLowerCase());
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (currentSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <h3>No products found</h3>
          <p>Try adjusting your search query or category filters.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-image-container">
          ${p.badge ? `<span class="product-badge-tag ${p.badge}">${p.badge}</span>` : ''}
          ${getProductSvg(p.icon)}
          <button class="btn-quick-view" onclick="StoreModule.openQuickView(${p.id})" title="Quick view">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
        <div class="product-details">
          <span class="product-category">${p.category}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-ratings">
            ★★★★★ <strong>${p.rating}</strong> <span>(${p.reviews})</span>
          </div>
          <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.4;">${p.description}</p>
          <div class="product-footer">
            <div class="product-price">
              $${p.price}
              ${p.oldPrice ? `<span class="product-old-price">$${p.oldPrice}</span>` : ''}
            </div>
            <button class="btn-add-cart" onclick="StoreModule.addToCart(${p.id})">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function setupFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentCategory = chip.dataset.category;
        renderProducts();
      });
    });

    const searchInput = document.getElementById('storeSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProducts();
      });
    }

    const sortSelect = document.getElementById('storeSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
      });
    }
  }

  function addToCart(productId) {
    const item = products.find(p => p.id === productId);
    if (!item) return;

    const existing = cart.find(c => c.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    updateCartUI();
    if (window.App) window.App.showToast(`Added "${item.name}" to cart`);
  }

  function updateQuantity(productId, delta) {
    const item = cart.find(c => c.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(c => c.id !== productId);
    }

    updateCartUI();
  }

  function updateCartUI() {
    const countElem = document.getElementById('headerCartCount');
    const totalItems = cart.reduce((acc, cur) => acc + cur.quantity, 0);
    if (countElem) {
      countElem.innerText = totalItems;
      countElem.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    const cartList = document.getElementById('cartDrawerItems');
    const subtotalElem = document.getElementById('cartSubtotal');
    const grandTotalElem = document.getElementById('cartGrandTotal');
    const checkoutBtn = document.getElementById('btnProceedCheckout');

    if (!cartList) return;

    if (cart.length === 0) {
      cartList.innerHTML = `
        <div class="cart-empty-state">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <p>Your shopping cart is empty.</p>
        </div>
      `;
      if (subtotalElem) subtotalElem.innerText = '$0.00';
      if (grandTotalElem) grandTotalElem.innerText = '$0.00';
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    cartList.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-thumb">
          ${getProductSvg(item.icon)}
        </div>
        <div class="cart-item-meta">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-price">$${item.price}</span>
        </div>
        <div class="cart-item-actions">
          <div class="qty-control">
            <button class="qty-btn" onclick="StoreModule.updateQuantity(${item.id}, -1)">−</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn" onclick="StoreModule.updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
      </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxes = Math.round(subtotal * 0.08);
    const total = subtotal + taxes;

    if (subtotalElem) subtotalElem.innerText = `$${subtotal.toLocaleString()}`;
    if (grandTotalElem) grandTotalElem.innerText = `$${total.toLocaleString()}`;
  }

  function setupCartDrawerEvents() {
    const trigger = document.getElementById('openCartBtn');
    const overlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    const closeBtn = document.getElementById('closeCartBtn');
    const checkoutBtn = document.getElementById('btnProceedCheckout');

    const toggleCart = (open) => {
      if (overlay && drawer) {
        if (open) {
          overlay.classList.add('open');
          drawer.classList.add('open');
        } else {
          overlay.classList.remove('open');
          drawer.classList.remove('open');
        }
      }
    };

    if (trigger) trigger.addEventListener('click', () => toggleCart(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleCart(false));
    if (overlay) overlay.addEventListener('click', (e) => {
      if (e.target === overlay) toggleCart(false);
    });

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        toggleCart(false);
        if (window.App) {
          window.App.openModal('checkoutModal');
        }
      });
    }
  }

  function openQuickView(productId) {
    const item = products.find(p => p.id === productId);
    if (!item) return;

    const modalBody = document.getElementById('quickViewContent');
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
          <div style="width: 140px; height: 140px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
            ${getProductSvg(item.icon)}
          </div>
          <div style="flex: 1; min-width: 240px;">
            <span style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 700; text-transform: uppercase;">${item.category}</span>
            <h2 style="font-size: 1.35rem; margin: 0.25rem 0 0.5rem;">${item.name}</h2>
            <div style="margin-bottom: 0.75rem; color: var(--accent-amber); font-size: 0.85rem;">★★★★★ <strong>${item.rating}</strong> (${item.reviews} verified reviews)</div>
            <p style="font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.25rem; color: var(--text-muted);">${item.description}</p>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 1.5rem; font-weight: 800;">$${item.price}</span>
              <button class="btn-primary" onclick="StoreModule.addToCart(${item.id}); window.App.closeAllModals();">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
      if (window.App) window.App.openModal('quickViewModal');
    }
  }

  function completeOrder() {
    cart = [];
    updateCartUI();
    if (window.App) {
      window.App.closeAllModals();
      window.App.showToast('🎉 Order confirmed! Invoice sent to your email.');
    }
  }

  return { init, addToCart, updateQuantity, openQuickView, completeOrder };
})();
