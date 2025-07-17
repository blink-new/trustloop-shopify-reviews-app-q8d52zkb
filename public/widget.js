(function() {
  'use strict';

  // TrustLoop Widget Configuration
  var TrustLoop = {
    config: {
      apiUrl: window.location.origin,
      shopDomain: window.location.hostname,
      theme: {
        primaryColor: '#00A96E',
        secondaryColor: '#5C6AC4',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        borderRadius: '8px'
      },
      layout: {
        style: 'grid',
        reviewsPerPage: 5,
        showPhotos: true,
        showVerifiedBadge: true,
        showDate: true,
        showHelpfulness: true
      },
      display: {
        showEmptyState: true,
        showRatingDistribution: true,
        showAverageRating: true,
        enableFiltering: true,
        enableSorting: true
      }
    },

    init: function(customConfig) {
      // Merge custom configuration
      if (customConfig) {
        this.config = this.deepMerge(this.config, customConfig);
      }

      // Wait for DOM to be ready
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
      var containers = document.querySelectorAll('#trustloop-reviews, [data-trustloop-reviews]');
      
      containers.forEach(function(container) {
        var productId = container.getAttribute('data-product-id') || 
                       container.getAttribute('data-product') ||
                       this.getProductIdFromUrl();
        
        if (productId) {
          this.renderWidget(container, productId);
        }
      }.bind(this));

      // Auto-inject on product pages if no manual container found
      if (containers.length === 0 && this.isProductPage()) {
        this.autoInject();
      }
    },

    getProductIdFromUrl: function() {
      // Extract product ID from Shopify product page URL
      var path = window.location.pathname;
      var match = path.match(/\/products\/([^\/]+)/);
      return match ? match[1] : null;
    },

    isProductPage: function() {
      return window.location.pathname.includes('/products/');
    },

    autoInject: function() {
      // Try to find product description or form to inject after
      var targets = [
        '.product-description',
        '.product__description',
        '.product-single__description',
        '.product-form',
        '.product__form',
        '.product-single__form'
      ];

      var target = null;
      for (var i = 0; i < targets.length; i++) {
        target = document.querySelector(targets[i]);
        if (target) break;
      }

      if (target) {
        var container = document.createElement('div');
        container.id = 'trustloop-reviews';
        container.setAttribute('data-product-id', this.getProductIdFromUrl());
        target.parentNode.insertBefore(container, target.nextSibling);
        
        this.renderWidget(container, this.getProductIdFromUrl());
      }
    },

    renderWidget: function(container, productId) {
      // Show loading state
      container.innerHTML = this.getLoadingHTML();
      
      // Fetch reviews data
      this.fetchReviews(productId)
        .then(function(data) {
          container.innerHTML = this.getWidgetHTML(data, productId);
          this.attachEventListeners(container, productId);
        }.bind(this))
        .catch(function(error) {
          console.error('TrustLoop: Failed to load reviews', error);
          container.innerHTML = this.getErrorHTML();
        }.bind(this));
    },

    fetchReviews: function(productId) {
      return fetch(this.config.apiUrl + '/api/reviews/' + productId + '?shop=' + this.config.shopDomain)
        .then(function(response) {
          if (!response.ok) {
            throw new Error('Failed to fetch reviews');
          }
          return response.json();
        })
        .catch(function() {
          // Return mock data for demo
          return {
            reviews: [
              {
                id: '1',
                customer_name: 'Sarah M.',
                rating: 5,
                text: 'Amazing product! Exceeded my expectations. The quality is outstanding.',
                photos: [],
                is_verified: true,
                created_at: '2024-01-15T10:30:00Z',
                helpful_votes: 2
              },
              {
                id: '2',
                customer_name: 'Mike R.',
                rating: 4,
                text: 'Great value for money. Would definitely recommend to others.',
                photos: [],
                is_verified: true,
                created_at: '2024-01-14T15:45:00Z',
                helpful_votes: 1
              }
            ],
            stats: {
              total_reviews: 12,
              average_rating: 4.2,
              rating_distribution: { 5: 7, 4: 3, 3: 1, 2: 1, 1: 0 }
            }
          };
        });
    },

    getLoadingHTML: function() {
      return '<div style="text-align: center; padding: 20px; color: #666;">Loading reviews...</div>';
    },

    getErrorHTML: function() {
      return '<div style="text-align: center; padding: 20px; color: #999;">Unable to load reviews at this time.</div>';
    },

    getWidgetHTML: function(data, productId) {
      var config = this.config;
      var html = '<div class="trustloop-widget" style="font-family: ' + config.theme.fontFamily + '; font-size: ' + config.theme.fontSize + ';">';
      
      // Rating summary
      if (config.display.showAverageRating && data.stats) {
        html += '<div class="trustloop-summary" style="margin-bottom: 24px;">';
        html += '<div style="display: flex; align-items: center; margin-bottom: 8px;">';
        html += '<div style="display: flex; margin-right: 8px;">';
        
        for (var i = 1; i <= 5; i++) {
          var filled = i <= Math.round(data.stats.average_rating);
          html += '<span style="color: ' + (filled ? config.theme.primaryColor : '#e5e7eb') + '; font-size: 18px;">★</span>';
        }
        
        html += '</div>';
        html += '<span style="font-weight: 600; margin-right: 8px;">' + data.stats.average_rating.toFixed(1) + ' out of 5</span>';
        html += '<span style="color: #666;">(' + data.stats.total_reviews + ' reviews)</span>';
        html += '</div>';
        
        // Rating distribution
        if (config.display.showRatingDistribution) {
          html += '<div style="margin-top: 12px;">';
          for (var rating = 5; rating >= 1; rating--) {
            var count = data.stats.rating_distribution[rating] || 0;
            var percentage = data.stats.total_reviews > 0 ? (count / data.stats.total_reviews) * 100 : 0;
            
            html += '<div style="display: flex; align-items: center; margin-bottom: 4px; font-size: 12px;">';
            html += '<span style="width: 20px;">' + rating + '★</span>';
            html += '<div style="flex: 1; background: #e5e7eb; height: 6px; border-radius: 3px; margin: 0 8px;">';
            html += '<div style="background: ' + config.theme.primaryColor + '; height: 6px; border-radius: 3px; width: ' + percentage + '%;"></div>';
            html += '</div>';
            html += '<span style="width: 20px; color: #666;">' + count + '</span>';
            html += '</div>';
          }
          html += '</div>';
        }
        
        html += '</div>';
      }

      // Write review button
      html += '<div style="margin-bottom: 20px;">';
      html += '<button class="trustloop-write-review" style="background: ' + config.theme.primaryColor + '; color: white; border: none; padding: 10px 20px; border-radius: ' + config.theme.borderRadius + '; cursor: pointer; font-size: 14px; font-weight: 500;">Write a Review</button>';
      html += '</div>';

      // Reviews list
      if (data.reviews && data.reviews.length > 0) {
        html += '<div class="trustloop-reviews">';
        
        data.reviews.forEach(function(review) {
          html += '<div style="border: 1px solid #e5e7eb; border-radius: ' + config.theme.borderRadius + '; padding: 16px; margin-bottom: 16px;">';
          
          // Review header
          html += '<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">';
          html += '<div style="display: flex; align-items: center;">';
          
          // Stars
          html += '<div style="display: flex; margin-right: 8px;">';
          for (var i = 1; i <= 5; i++) {
            var filled = i <= review.rating;
            html += '<span style="color: ' + (filled ? config.theme.primaryColor : '#e5e7eb') + '; font-size: 14px;">★</span>';
          }
          html += '</div>';
          
          // Verified badge
          if (config.layout.showVerifiedBadge && review.is_verified) {
            html += '<span style="background: ' + config.theme.primaryColor + '20; color: ' + config.theme.primaryColor + '; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">Verified</span>';
          }
          
          html += '</div>';
          
          // Date
          if (config.layout.showDate) {
            var date = new Date(review.created_at);
            var timeAgo = this.getTimeAgo(date);
            html += '<span style="color: #666; font-size: 12px;">' + timeAgo + '</span>';
          }
          
          html += '</div>';
          
          // Review text
          html += '<p style="color: #374151; margin: 8px 0; line-height: 1.5;">' + this.escapeHtml(review.text) + '</p>';
          
          // Customer name and helpfulness
          html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">';
          html += '<span style="font-weight: 500; font-size: 14px;">' + this.escapeHtml(review.customer_name) + '</span>';
          
          if (config.layout.showHelpfulness) {
            html += '<div style="display: flex; align-items: center; color: #666; font-size: 12px;">';
            html += '<button class="trustloop-helpful" data-review-id="' + review.id + '" style="background: none; border: none; cursor: pointer; margin-right: 8px;">👍 ' + (review.helpful_votes || 0) + '</button>';
            html += '</div>';
          }
          
          html += '</div>';
          html += '</div>';
        }.bind(this));
        
        html += '</div>';
      } else if (config.display.showEmptyState) {
        html += '<div style="text-align: center; padding: 40px; color: #666;">';
        html += '<p>No reviews yet. Be the first to review this product!</p>';
        html += '</div>';
      }

      html += '</div>';
      return html;
    },

    attachEventListeners: function(container, productId) {
      // Write review button
      var writeButton = container.querySelector('.trustloop-write-review');
      if (writeButton) {
        writeButton.addEventListener('click', function() {
          this.openReviewForm(productId);
        }.bind(this));
      }

      // Helpful buttons
      var helpfulButtons = container.querySelectorAll('.trustloop-helpful');
      helpfulButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          var reviewId = button.getAttribute('data-review-id');
          this.markHelpful(reviewId);
        }.bind(this));
      }.bind(this));
    },

    openReviewForm: function(productId) {
      // Simple alert for now - in production this would open a modal
      alert('Review form would open here for product: ' + productId);
    },

    markHelpful: function(reviewId) {
      // Simple feedback for now
      console.log('Marked review ' + reviewId + ' as helpful');
    },

    getTimeAgo: function(date) {
      var now = new Date();
      var diffMs = now - date;
      var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 30) return diffDays + ' days ago';
      if (diffDays < 365) return Math.floor(diffDays / 30) + ' months ago';
      return Math.floor(diffDays / 365) + ' years ago';
    },

    escapeHtml: function(text) {
      var div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };

  // Auto-initialize if not already done
  if (!window.TrustLoop) {
    window.TrustLoop = TrustLoop;
    TrustLoop.init();
  }

})();