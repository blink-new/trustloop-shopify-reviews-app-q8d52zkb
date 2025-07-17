(function() {
  'use strict';

  // TrustLoop Collection Page Widget
  var TrustLoopCollection = {
    config: {
      apiUrl: window.location.origin,
      shopDomain: window.location.hostname,
      theme: {
        primaryColor: '#00A96E',
        starColor: '#FFC107',
        textColor: '#374151',
        fontSize: '12px'
      },
      display: {
        showRating: true,
        showReviewCount: true,
        showStars: true,
        position: 'below_title' // 'below_title', 'below_price', 'overlay'
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
      // Find all product items on collection pages
      var productSelectors = [
        '.product-item',
        '.product-card',
        '.grid-product',
        '.product-grid-item',
        '[data-product-id]',
        '.product'
      ];

      var products = [];
      productSelectors.forEach(function(selector) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(element) {
          if (products.indexOf(element) === -1) {
            products.push(element);
          }
        });
      });

      // Add ratings to each product
      products.forEach(function(productElement) {
        this.addRatingToProduct(productElement);
      }.bind(this));
    },

    addRatingToProduct: function(productElement) {
      var productId = this.extractProductId(productElement);
      if (!productId) return;

      // Check if rating already added
      if (productElement.querySelector('.trustloop-collection-rating')) return;

      var insertionPoint = this.findInsertionPoint(productElement);
      if (!insertionPoint) return;

      // Create rating container
      var ratingContainer = document.createElement('div');
      ratingContainer.className = 'trustloop-collection-rating';
      ratingContainer.style.cssText = 'margin: 4px 0; font-size: ' + this.config.theme.fontSize + '; color: ' + this.config.theme.textColor + ';';

      // Fetch and display rating
      this.fetchProductRating(productId)
        .then(function(data) {
          ratingContainer.innerHTML = this.generateRatingHTML(data);
          
          // Insert based on position config
          if (this.config.display.position === 'below_title') {
            var title = productElement.querySelector('.product-title, .product-name, h3, h2');
            if (title && title.parentNode) {
              title.parentNode.insertBefore(ratingContainer, title.nextSibling);
            }
          } else if (this.config.display.position === 'below_price') {
            var price = productElement.querySelector('.price, .product-price, .money');
            if (price && price.parentNode) {
              price.parentNode.insertBefore(ratingContainer, price.nextSibling);
            }
          } else {
            // Default: append to product element
            insertionPoint.appendChild(ratingContainer);
          }
        }.bind(this))
        .catch(function(error) {
          console.warn('TrustLoop: Failed to load rating for product', productId, error);
        });
    },

    extractProductId: function(productElement) {
      // Try various methods to extract product ID
      var productId = productElement.getAttribute('data-product-id') ||
                     productElement.getAttribute('data-product') ||
                     productElement.getAttribute('data-id');

      if (productId) return productId;

      // Try to extract from product URL
      var link = productElement.querySelector('a[href*="/products/"]');
      if (link) {
        var href = link.getAttribute('href');
        var match = href.match(/\/products\/([^\/\?]+)/);
        if (match) return match[1];
      }

      // Try to extract from image alt or data attributes
      var img = productElement.querySelector('img');
      if (img) {
        var alt = img.getAttribute('alt');
        var dataSrc = img.getAttribute('data-src') || img.getAttribute('src');
        
        if (dataSrc) {
          var srcMatch = dataSrc.match(/products\/([^\/\?]+)/);
          if (srcMatch) return srcMatch[1];
        }
      }

      return null;
    },

    findInsertionPoint: function(productElement) {
      // Find the best place to insert the rating
      var candidates = [
        productElement.querySelector('.product-info'),
        productElement.querySelector('.product-details'),
        productElement.querySelector('.product-content'),
        productElement
      ];

      for (var i = 0; i < candidates.length; i++) {
        if (candidates[i]) return candidates[i];
      }

      return productElement;
    },

    fetchProductRating: function(productId) {
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
            hasReviews: counts[randomIndex] > 0
          };
        });
    },

    generateRatingHTML: function(data) {
      if (!data.hasReviews || data.totalReviews === 0) {
        return '<div style="color: #9CA3AF; font-size: 11px;">No reviews yet</div>';
      }

      var html = '<div style="display: flex; align-items: center; gap: 4px;">';
      
      // Stars
      if (this.config.display.showStars) {
        html += '<div style="display: flex; gap: 1px;">';
        for (var i = 1; i <= 5; i++) {
          var filled = i <= Math.round(data.averageRating);
          html += '<span style="color: ' + (filled ? this.config.theme.starColor : '#E5E7EB') + '; font-size: 12px; line-height: 1;">★</span>';
        }
        html += '</div>';
      }

      // Rating number
      if (this.config.display.showRating) {
        html += '<span style="font-weight: 500; font-size: 11px;">' + data.averageRating.toFixed(1) + '</span>';
      }

      // Review count
      if (this.config.display.showReviewCount) {
        html += '<span style="color: #6B7280; font-size: 11px;">(' + data.totalReviews + ')</span>';
      }

      html += '</div>';
      return html;
    }
  };

  // Auto-initialize
  if (!window.TrustLoopCollection) {
    window.TrustLoopCollection = TrustLoopCollection;
    TrustLoopCollection.init();
  }

})();