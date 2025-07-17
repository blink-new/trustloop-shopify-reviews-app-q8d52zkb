// TrustLoop Universal Widget Loader
// This script automatically detects page types and loads appropriate widgets

(function() {
  'use strict';

  // Configuration
  const TRUSTLOOP_CONFIG = {
    apiBase: window.location.origin,
    shopDomain: window.location.hostname,
    version: '1.0.0',
    projectId: 'q8d52zkb' // TrustLoop project ID
  };

  // Utility functions
  function detectPageType() {
    const path = window.location.pathname;
    const url = window.location.href;
    
    // Product page detection
    if (path.includes('/products/') || document.querySelector('[data-product-id]')) {
      return 'product';
    }
    
    // Collection page detection
    if (path.includes('/collections/') || document.querySelector('.product-grid, .collection-grid')) {
      return 'collection';
    }
    
    // Cart page detection
    if (path.includes('/cart') || document.querySelector('.cart, #cart')) {
      return 'cart';
    }
    
    // Homepage detection
    if (path === '/' || path === '/index' || path === '/home') {
      return 'homepage';
    }
    
    return 'unknown';
  }

  function getProductId() {
    // Try multiple methods to get product ID
    const productIdElement = document.querySelector('[data-product-id]');
    if (productIdElement) {
      return productIdElement.getAttribute('data-product-id');
    }
    
    // Try to extract from URL
    const pathMatch = window.location.pathname.match(/\/products\/([^\/\?]+)/);
    if (pathMatch) {
      return pathMatch[1];
    }
    
    // Try to find in page data
    if (window.ShopifyAnalytics && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.product) {
      return window.ShopifyAnalytics.meta.product.id.toString();
    }
    
    // Try meta tags
    const productMeta = document.querySelector('meta[property="product:retailer_item_id"]');
    if (productMeta) {
      return productMeta.getAttribute('content');
    }
    
    return null;
  }

  function createWidget(type, config = {}) {
    const widgetId = `trustloop-${type}-${Date.now()}`;
    const widget = document.createElement('div');
    widget.id = widgetId;
    widget.className = `trustloop-widget trustloop-${type}`;
    
    // Add basic styling
    widget.style.cssText = `
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: #374151;
    `;
    
    return widget;
  }

  // API functions
  async function fetchReviews(productId) {
    try {
      // In a real implementation, this would fetch from your backend
      // For demo, return mock data
      return {
        averageRating: 4.8,
        totalReviews: 127,
        reviews: [
          {
            id: '1',
            rating: 5,
            title: 'Amazing product!',
            text: 'Exceeded my expectations. Great quality and fast shipping.',
            customerName: 'Sarah J.',
            verified: true,
            date: '2024-01-15',
            helpful: 12
          },
          {
            id: '2',
            rating: 4,
            title: 'Good value',
            text: 'Nice product for the price. Would recommend.',
            customerName: 'Mike R.',
            verified: true,
            date: '2024-01-14',
            helpful: 8
          },
          {
            id: '3',
            rating: 5,
            title: 'Perfect!',
            text: 'Exactly what I was looking for. Very satisfied.',
            customerName: 'Emma L.',
            verified: false,
            date: '2024-01-13',
            helpful: 5
          }
        ]
      };
    } catch (error) {
      console.error('TrustLoop: Error fetching reviews:', error);
      return null;
    }
  }

  function openReviewModal(productId) {
    // Create review submission modal
    const modal = document.createElement('div');
    modal.className = 'trustloop-modal';
    modal.innerHTML = `
      <div class="trustloop-modal-overlay">
        <div class="trustloop-modal-content">
          <div class="trustloop-modal-header">
            <h3>Write a Review</h3>
            <button class="trustloop-modal-close">&times;</button>
          </div>
          <form class="trustloop-review-form">
            <div class="trustloop-form-group">
              <label>Rating</label>
              <div class="trustloop-star-input">
                <span data-rating="1">★</span>
                <span data-rating="2">★</span>
                <span data-rating="3">★</span>
                <span data-rating="4">★</span>
                <span data-rating="5">★</span>
              </div>
            </div>
            <div class="trustloop-form-group">
              <label>Name</label>
              <input type="text" name="name" required>
            </div>
            <div class="trustloop-form-group">
              <label>Email</label>
              <input type="email" name="email" required>
            </div>
            <div class="trustloop-form-group">
              <label>Review Title</label>
              <input type="text" name="title">
            </div>
            <div class="trustloop-form-group">
              <label>Review</label>
              <textarea name="review" rows="4" required></textarea>
            </div>
            <div class="trustloop-form-actions">
              <button type="button" class="trustloop-btn-secondary">Cancel</button>
              <button type="submit" class="trustloop-btn-primary">Submit Review</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Add modal CSS
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
      .trustloop-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
      }
      .trustloop-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .trustloop-modal-content {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      }
      .trustloop-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 24px 0;
        border-bottom: 1px solid #e5e7eb;
        margin-bottom: 24px;
      }
      .trustloop-modal-header h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }
      .trustloop-modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
      }
      .trustloop-review-form {
        padding: 0 24px 24px;
      }
      .trustloop-form-group {
        margin-bottom: 16px;
      }
      .trustloop-form-group label {
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
        color: #374151;
      }
      .trustloop-form-group input,
      .trustloop-form-group textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
      }
      .trustloop-star-input {
        display: flex;
        gap: 4px;
      }
      .trustloop-star-input span {
        font-size: 24px;
        color: #d1d5db;
        cursor: pointer;
        transition: color 0.2s;
      }
      .trustloop-star-input span:hover,
      .trustloop-star-input span.active {
        color: #fbbf24;
      }
      .trustloop-form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
      }
      .trustloop-btn-primary,
      .trustloop-btn-secondary {
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        border: none;
      }
      .trustloop-btn-primary {
        background: #00A96E;
        color: white;
      }
      .trustloop-btn-primary:hover {
        background: #047857;
      }
      .trustloop-btn-secondary {
        background: #f3f4f6;
        color: #374151;
      }
      .trustloop-btn-secondary:hover {
        background: #e5e7eb;
      }
    `;
    document.head.appendChild(modalStyle);

    // Add event listeners
    const starInput = modal.querySelector('.trustloop-star-input');
    const stars = starInput.querySelectorAll('span');
    let selectedRating = 0;

    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        selectedRating = index + 1;
        stars.forEach((s, i) => {
          s.classList.toggle('active', i < selectedRating);
        });
      });
    });

    // Close modal
    const closeModal = () => {
      document.body.removeChild(modal);
      document.head.removeChild(modalStyle);
    };

    modal.querySelector('.trustloop-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.trustloop-btn-secondary').addEventListener('click', closeModal);
    modal.querySelector('.trustloop-modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

    // Handle form submission
    modal.querySelector('.trustloop-review-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      // Simulate review submission
      console.log('TrustLoop: Submitting review:', {
        productId,
        rating: selectedRating,
        name: formData.get('name'),
        email: formData.get('email'),
        title: formData.get('title'),
        review: formData.get('review')
      });

      // Show success message
      alert('Thank you for your review! It will be published after moderation.');
      closeModal();
    });

    document.body.appendChild(modal);
  }

  // Widget implementations
  const widgets = {
    product: async function(container, productId) {
      if (!productId) {
        container.innerHTML = '<p>Product ID not found</p>';
        return;
      }
      
      const reviewData = await fetchReviews(productId);
      if (!reviewData) {
        container.innerHTML = '<p>Unable to load reviews</p>';
        return;
      }

      container.innerHTML = `
        <div class="trustloop-product-reviews">
          <div class="trustloop-header">
            <h3>Customer Reviews</h3>
            <div class="trustloop-rating-summary">
              <div class="trustloop-rating-display">
                <span class="trustloop-rating-number">${reviewData.averageRating}</span>
                <div class="trustloop-stars">${'★'.repeat(Math.floor(reviewData.averageRating))}${'☆'.repeat(5 - Math.floor(reviewData.averageRating))}</div>
                <span class="trustloop-rating-text">Based on ${reviewData.totalReviews} reviews</span>
              </div>
              <button class="trustloop-write-review" data-product-id="${productId}">Write a Review</button>
            </div>
          </div>
          <div class="trustloop-reviews-list">
            ${reviewData.reviews.map(review => `
              <div class="trustloop-review">
                <div class="trustloop-review-header">
                  <div class="trustloop-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                  <span class="trustloop-reviewer">${review.customerName}</span>
                  ${review.verified ? '<span class="trustloop-verified">✓ Verified Purchase</span>' : ''}
                  <span class="trustloop-date">${new Date(review.date).toLocaleDateString()}</span>
                </div>
                ${review.title ? `<h4 class="trustloop-review-title">${review.title}</h4>` : ''}
                <p class="trustloop-review-text">${review.text}</p>
                <div class="trustloop-review-footer">
                  <span class="trustloop-helpful">Helpful (${review.helpful})</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      // Add CSS
      if (!document.querySelector('#trustloop-product-styles')) {
        const style = document.createElement('style');
        style.id = 'trustloop-product-styles';
        style.textContent = `
          .trustloop-product-reviews {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 24px;
            margin: 24px 0;
            background: white;
          }
          .trustloop-header h3 {
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 600;
          }
          .trustloop-rating-summary {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
          }
          .trustloop-rating-display {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .trustloop-rating-number {
            font-size: 32px;
            font-weight: 700;
            color: #00A96E;
          }
          .trustloop-stars {
            color: #fbbf24;
            font-size: 18px;
          }
          .trustloop-rating-text {
            color: #6b7280;
            font-size: 14px;
          }
          .trustloop-review {
            border-bottom: 1px solid #f3f4f6;
            padding: 16px 0;
          }
          .trustloop-review:last-child {
            border-bottom: none;
          }
          .trustloop-review-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
            flex-wrap: wrap;
          }
          .trustloop-review-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 8px 0;
            color: #111827;
          }
          .trustloop-reviewer {
            font-weight: 500;
            color: #374151;
          }
          .trustloop-verified {
            color: #059669;
            font-size: 12px;
            background: #d1fae5;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .trustloop-date {
            color: #9ca3af;
            font-size: 12px;
          }
          .trustloop-review-text {
            color: #374151;
            line-height: 1.6;
            margin: 8px 0;
          }
          .trustloop-review-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .trustloop-helpful {
            color: #6b7280;
            font-size: 12px;
          }
          .trustloop-write-review {
            background: #00A96E;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .trustloop-write-review:hover {
            background: #047857;
          }
          @media (max-width: 768px) {
            .trustloop-rating-summary {
              flex-direction: column;
              align-items: stretch;
            }
            .trustloop-rating-display {
              justify-content: center;
            }
            .trustloop-review-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 4px;
            }
          }
        `;
        document.head.appendChild(style);
      }

      // Add event listener for write review button
      container.querySelector('.trustloop-write-review').addEventListener('click', () => {
        openReviewModal(productId);
      });
    },

    collection: function() {
      // Add star ratings to product cards
      const productCards = document.querySelectorAll('.product-card, .grid-product, .product-item, .product');
      
      productCards.forEach(card => {
        if (card.querySelector('.trustloop-rating')) return; // Already added
        
        const rating = document.createElement('div');
        rating.className = 'trustloop-rating';
        const randomRating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0
        const randomCount = Math.floor(Math.random() * 50) + 10; // 10-59
        
        rating.innerHTML = `
          <div class="trustloop-stars">${'★'.repeat(Math.floor(parseFloat(randomRating)))}${'☆'.repeat(5 - Math.floor(parseFloat(randomRating)))}</div>
          <span class="trustloop-count">(${randomCount})</span>
        `;
        
        // Try to insert after product title or price
        const title = card.querySelector('.product-title, .product-name, h3, h4, .h3, .h4');
        const price = card.querySelector('.price, .product-price, .money');
        
        if (title) {
          title.parentNode.insertBefore(rating, title.nextSibling);
        } else if (price) {
          price.parentNode.insertBefore(rating, price);
        } else {
          card.appendChild(rating);
        }
      });
      
      // Add CSS for collection ratings
      if (!document.querySelector('#trustloop-collection-styles')) {
        const style = document.createElement('style');
        style.id = 'trustloop-collection-styles';
        style.textContent = `
          .trustloop-rating {
            display: flex;
            align-items: center;
            gap: 4px;
            margin: 4px 0;
          }
          .trustloop-rating .trustloop-stars {
            color: #fbbf24;
            font-size: 14px;
          }
          .trustloop-rating .trustloop-count {
            color: #6b7280;
            font-size: 12px;
          }
        `;
        document.head.appendChild(style);
      }
    },

    cart: function() {
      const cartContainer = document.querySelector('.cart, #cart, .cart-form, .cart-drawer');
      if (!cartContainer || cartContainer.querySelector('.trustloop-cart-badge')) return;
      
      const trustBadge = document.createElement('div');
      trustBadge.className = 'trustloop-cart-badge';
      trustBadge.innerHTML = `
        <div class="trustloop-trust-signals">
          <div class="trustloop-signal">
            <span class="trustloop-icon">🛡️</span>
            <span>Secure Checkout</span>
          </div>
          <div class="trustloop-signal">
            <span class="trustloop-icon">⭐</span>
            <span>4.8/5 Customer Rating</span>
          </div>
          <div class="trustloop-signal">
            <span class="trustloop-icon">🚚</span>
            <span>Free Shipping Over $50</span>
          </div>
        </div>
      `;
      
      cartContainer.appendChild(trustBadge);
      
      // Add CSS
      if (!document.querySelector('#trustloop-cart-styles')) {
        const style = document.createElement('style');
        style.id = 'trustloop-cart-styles';
        style.textContent = `
          .trustloop-cart-badge {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
          }
          .trustloop-trust-signals {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 12px;
          }
          .trustloop-signal {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: #374151;
          }
          @media (max-width: 768px) {
            .trustloop-trust-signals {
              flex-direction: column;
              align-items: center;
            }
          }
        `;
        document.head.appendChild(style);
      }
    },

    homepage: function() {
      // Create a reviews carousel for homepage
      const main = document.querySelector('main, .main-content, #main, .content');
      if (!main || main.querySelector('.trustloop-homepage-carousel')) return;
      
      const carousel = document.createElement('div');
      carousel.className = 'trustloop-homepage-carousel';
      carousel.innerHTML = `
        <div class="trustloop-carousel-container">
          <h2>What Our Customers Say</h2>
          <div class="trustloop-carousel-track">
            <div class="trustloop-testimonial">
              <div class="trustloop-stars">★★★★★</div>
              <p>"Amazing products and fast shipping! Highly recommend this store to everyone."</p>
              <cite>- Sarah M.</cite>
            </div>
            <div class="trustloop-testimonial">
              <div class="trustloop-stars">★★★★★</div>
              <p>"Excellent customer service and quality. Will definitely shop here again."</p>
              <cite>- Mike R.</cite>
            </div>
            <div class="trustloop-testimonial">
              <div class="trustloop-stars">★★★★★</div>
              <p>"Best online shopping experience I've had. Products exactly as described."</p>
              <cite>- Emma L.</cite>
            </div>
          </div>
        </div>
      `;
      
      // Insert after first section or at the end
      const firstSection = main.querySelector('section, .section, .hero');
      if (firstSection && firstSection.nextSibling) {
        main.insertBefore(carousel, firstSection.nextSibling);
      } else {
        main.appendChild(carousel);
      }
      
      // Add CSS
      if (!document.querySelector('#trustloop-homepage-styles')) {
        const style = document.createElement('style');
        style.id = 'trustloop-homepage-styles';
        style.textContent = `
          .trustloop-homepage-carousel {
            background: #f9fafb;
            padding: 48px 24px;
            margin: 48px 0;
          }
          .trustloop-carousel-container {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
          }
          .trustloop-carousel-container h2 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 32px;
            color: #111827;
          }
          .trustloop-carousel-track {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
          }
          .trustloop-testimonial {
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .trustloop-testimonial .trustloop-stars {
            color: #fbbf24;
            font-size: 20px;
            margin-bottom: 12px;
          }
          .trustloop-testimonial p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 12px;
            color: #374151;
          }
          .trustloop-testimonial cite {
            font-style: normal;
            color: #6b7280;
            font-weight: 500;
          }
          @media (max-width: 768px) {
            .trustloop-carousel-container h2 {
              font-size: 24px;
            }
            .trustloop-carousel-track {
              grid-template-columns: 1fr;
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  };

  // Initialize widgets based on page type
  async function initializeWidgets() {
    const pageType = detectPageType();
    console.log('TrustLoop: Detected page type:', pageType);
    
    switch (pageType) {
      case 'product':
        const productId = getProductId();
        console.log('TrustLoop: Product ID:', productId);
        
        // Look for existing review containers
        let container = document.querySelector('#trustloop-reviews, .trustloop-reviews');
        
        if (!container) {
          // Create container and insert after product description
          container = createWidget('product');
          const description = document.querySelector('.product-description, .product-single__description, .product__description, .rte, .product-content');
          const form = document.querySelector('.product-form, .product-single__form, form[action*="/cart/add"]');
          const productInfo = document.querySelector('.product-info, .product-details, .product-single');
          
          if (description) {
            description.parentNode.insertBefore(container, description.nextSibling);
          } else if (form) {
            form.parentNode.insertBefore(container, form.nextSibling);
          } else if (productInfo) {
            productInfo.appendChild(container);
          } else {
            // Fallback: append to main content
            const main = document.querySelector('main, .main-content, .product-single, .product');
            if (main) main.appendChild(container);
          }
        }
        
        if (container) {
          await widgets.product(container, productId);
        }
        break;
        
      case 'collection':
        // Wait a bit for products to load
        setTimeout(() => widgets.collection(), 1000);
        break;
        
      case 'cart':
        widgets.cart();
        break;
        
      case 'homepage':
        widgets.homepage();
        break;
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidgets);
  } else {
    initializeWidgets();
  }

  // Handle dynamic content loading (for AJAX-based themes)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(initializeWidgets, 500); // Delay to allow content to load
    }
  }).observe(document, { subtree: true, childList: true });

  // Expose TrustLoop API
  window.TrustLoop = {
    version: TRUSTLOOP_CONFIG.version,
    init: initializeWidgets,
    detectPageType: detectPageType,
    getProductId: getProductId,
    openReviewModal: openReviewModal
  };

  console.log('TrustLoop widgets loaded successfully');
})();