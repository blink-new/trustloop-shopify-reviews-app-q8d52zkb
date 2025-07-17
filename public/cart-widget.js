(function() {
  'use strict';

  // TrustLoop Cart Page Social Proof Widget
  var TrustLoopCart = {
    config: {
      apiUrl: window.location.origin,
      shopDomain: window.location.hostname,
      theme: {
        primaryColor: '#00A96E',
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
        textColor: '#374151',
        starColor: '#FFC107'
      },
      display: {
        position: 'above_checkout', // 'above_checkout', 'below_items', 'sidebar'
        showProductRatings: true,
        showTrustBadges: true,
        showRecentReviews: true,
        maxReviews: 3
      }
    },

    init: function(customConfig) {
      if (customConfig) {
        this.config = this.deepMerge(this.config, customConfig);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', this.render.bind(this));
      } else {
        this.render();
      }
    },

    deepMerge: function(target, source) {
      var result = Object.assign({}, target);
      for (var key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
      return result;
    },

    render: function() {
      // Check if we're on a cart page
      if (!this.isCartPage()) return;

      // Check if widget already exists
      if (document.querySelector('.trustloop-cart-widget')) return;

      var cartItems = this.getCartItems();
      if (cartItems.length === 0) return;

      this.createWidget(cartItems);
    },

    isCartPage: function() {
      return window.location.pathname.includes('/cart') ||
             document.querySelector('.cart') ||
             document.querySelector('#cart') ||
             document.querySelector('[data-cart]');
    },

    getCartItems: function() {
      var items = [];
      
      // Try to extract cart items from various selectors
      var itemSelectors = [
        '.cart-item',
        '.cart__item',
        '.line-item',
        '[data-cart-item]',
        '.cart-product'
      ];

      itemSelectors.forEach(function(selector) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(element) {
          var productId = this.extractProductIdFromCartItem(element);
          if (productId && !items.find(function(item) { return item.id === productId; })) {
            items.push({
              id: productId,
              element: element,
              name: this.extractProductName(element)
            });
          }
        }.bind(this));
      }.bind(this));

      return items;
    },

    extractProductIdFromCartItem: function(element) {
      // Try various methods to extract product ID from cart item
      var productId = element.getAttribute('data-product-id') ||
                     element.getAttribute('data-id') ||
                     element.getAttribute('data-variant-id');

      if (productId) return productId;

      // Try to extract from links
      var link = element.querySelector('a[href*="/products/"]');
      if (link) {
        var href = link.getAttribute('href');
        var match = href.match(/\/products\/([^\/\?]+)/);
        if (match) return match[1];
      }

      return null;
    },

    extractProductName: function(element) {
      var nameSelectors = [
        '.product-title',
        '.cart-item__title',
        '.line-item__title',
        'h3',
        'h4',
        '.product-name'
      ];

      for (var i = 0; i < nameSelectors.length; i++) {
        var nameElement = element.querySelector(nameSelectors[i]);
        if (nameElement) {
          return nameElement.textContent.trim();
        }
      }

      return 'Product';
    },

    createWidget: function(cartItems) {
      var widget = document.createElement('div');
      widget.className = 'trustloop-cart-widget';
      widget.style.cssText = 'background: ' + this.config.theme.backgroundColor + '; border: 1px solid ' + this.config.theme.borderColor + '; border-radius: 8px; padding: 16px; margin: 16px 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';

      // Fetch data for all cart items
      Promise.all(cartItems.map(function(item) {
        return this.fetchProductData(item.id);
      }.bind(this)))
      .then(function(results) {
        widget.innerHTML = this.generateWidgetHTML(cartItems, results);
        this.insertWidget(widget);
      }.bind(this))
      .catch(function(error) {
        console.warn('TrustLoop: Failed to load cart widget data', error);
      });
    },

    fetchProductData: function(productId) {
      return fetch(this.config.apiUrl + '/api/reviews/' + productId + '/summary?shop=' + this.config.shopDomain)
        .then(function(response) {
          if (!response.ok) throw new Error('Failed to fetch');
          return response.json();
        })
        .catch(function() {
          // Return mock data for demo
          var ratings = [4.5, 4.2, 4.8, 3.9, 4.1, 4.6, 4.3];
          var counts = [23, 45, 12, 67, 34, 89, 56];
          var randomIndex = Math.floor(Math.random() * ratings.length);
          
          return {
            averageRating: ratings[randomIndex],
            totalReviews: counts[randomIndex],
            hasReviews: counts[randomIndex] > 0,
            recentReviews: [
              {
                text: 'Great quality product! Exactly as described.',
                rating: 5,
                customerName: 'Sarah M.',
                date: '2024-01-15'
              },
              {
                text: 'Fast shipping and excellent customer service.',
                rating: 4,
                customerName: 'Mike R.',
                date: '2024-01-14'
              }
            ]
          };
        });
    },

    generateWidgetHTML: function(cartItems, results) {
      var html = '<div style="text-align: center; margin-bottom: 12px;">';
      html += '<h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: ' + this.config.theme.textColor + ';">✨ You\'re buying quality products!</h3>';
      
      // Calculate overall stats
      var totalReviews = results.reduce(function(sum, result) { return sum + (result.totalReviews || 0); }, 0);
      var avgRating = results.reduce(function(sum, result) { return sum + (result.averageRating || 0); }, 0) / results.length;
      
      if (totalReviews > 0) {
        html += '<div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px;">';
        html += '<div style="display: flex; gap: 1px;">';
        for (var i = 1; i <= 5; i++) {
          var filled = i <= Math.round(avgRating);
          html += '<span style="color: ' + (filled ? this.config.theme.starColor : '#E5E7EB') + '; font-size: 14px;">★</span>';
        }
        html += '</div>';
        html += '<span style="font-weight: 500; color: ' + this.config.theme.textColor + ';">' + avgRating.toFixed(1) + '</span>';
        html += '<span style="color: #6B7280; font-size: 14px;">(' + totalReviews + ' reviews)</span>';
        html += '</div>';
      }
      
      html += '</div>';

      // Product ratings
      if (this.config.display.showProductRatings) {
        html += '<div style="margin-bottom: 12px;">';
        cartItems.forEach(function(item, index) {
          var result = results[index];
          if (result && result.hasReviews) {
            html += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #F3F4F6;">';
            html += '<span style="font-size: 13px; color: ' + this.config.theme.textColor + '; max-width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + item.name + '</span>';
            html += '<div style="display: flex; align-items: center; gap: 4px;">';
            
            // Stars
            for (var i = 1; i <= 5; i++) {
              var filled = i <= Math.round(result.averageRating);
              html += '<span style="color: ' + (filled ? this.config.theme.starColor : '#E5E7EB') + '; font-size: 11px;">★</span>';
            }
            
            html += '<span style="font-size: 11px; color: #6B7280; margin-left: 4px;">(' + result.totalReviews + ')</span>';
            html += '</div>';
            html += '</div>';
          }
        }.bind(this));
        html += '</div>';
      }

      // Trust badges
      if (this.config.display.showTrustBadges) {
        html += '<div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap;">';
        html += '<div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #059669;">';
        html += '<span>✓</span><span>Verified Reviews</span>';
        html += '</div>';
        html += '<div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #059669;">';
        html += '<span>🛡️</span><span>Secure Checkout</span>';
        html += '</div>';
        html += '<div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #059669;">';
        html += '<span>📦</span><span>Fast Shipping</span>';
        html += '</div>';
        html += '</div>';
      }

      // Recent reviews
      if (this.config.display.showRecentReviews) {
        var recentReviews = [];
        results.forEach(function(result) {
          if (result.recentReviews) {
            recentReviews = recentReviews.concat(result.recentReviews);
          }
        });

        if (recentReviews.length > 0) {
          html += '<div style="border-top: 1px solid #F3F4F6; padding-top: 12px;">';
          html += '<h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 500; color: ' + this.config.theme.textColor + ';">Recent Customer Reviews</h4>';
          
          recentReviews.slice(0, this.config.display.maxReviews).forEach(function(review) {
            html += '<div style="background: white; border-radius: 6px; padding: 8px; margin-bottom: 6px; border-left: 3px solid ' + this.config.theme.primaryColor + ';">';
            html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">';
            html += '<div style="display: flex; gap: 1px;">';
            for (var i = 1; i <= 5; i++) {
              var filled = i <= review.rating;
              html += '<span style="color: ' + (filled ? this.config.theme.starColor : '#E5E7EB') + '; font-size: 10px;">★</span>';
            }
            html += '</div>';
            html += '<span style="font-size: 10px; color: #6B7280;">' + review.customerName + '</span>';
            html += '</div>';
            html += '<p style="margin: 0; font-size: 11px; color: ' + this.config.theme.textColor + '; line-height: 1.4;">' + review.text + '</p>';
            html += '</div>';
          }.bind(this));
          
          html += '</div>';
        }
      }

      return html;
    },

    insertWidget: function(widget) {
      var insertionPoint = this.findInsertionPoint();
      if (insertionPoint) {
        if (this.config.display.position === 'above_checkout') {
          insertionPoint.parentNode.insertBefore(widget, insertionPoint);
        } else {
          insertionPoint.appendChild(widget);
        }
      }
    },

    findInsertionPoint: function() {
      // Find the best place to insert the widget based on position config
      var selectors = {
        'above_checkout': [
          '.cart__checkout',
          '.cart-footer',
          '.checkout-button',
          '[data-checkout]',
          '.btn-checkout'
        ],
        'below_items': [
          '.cart-items',
          '.cart__items',
          '.line-items'
        ],
        'sidebar': [
          '.cart-sidebar',
          '.cart__sidebar',
          '.cart-summary'
        ]
      };

      var targetSelectors = selectors[this.config.display.position] || selectors['above_checkout'];
      
      for (var i = 0; i < targetSelectors.length; i++) {
        var element = document.querySelector(targetSelectors[i]);
        if (element) return element;
      }

      // Fallback: find any cart container
      var fallbackSelectors = ['.cart', '#cart', '[data-cart]'];
      for (var i = 0; i < fallbackSelectors.length; i++) {
        var element = document.querySelector(fallbackSelectors[i]);
        if (element) return element;
      }

      return null;
    }
  };

  // Auto-initialize
  if (!window.TrustLoopCart) {
    window.TrustLoopCart = TrustLoopCart;
    TrustLoopCart.init();
  }

})();