(function() {
  'use strict';

  // TrustLoop Homepage Reviews Carousel
  var TrustLoopCarousel = {
    config: {
      apiUrl: window.location.origin,
      shopDomain: window.location.hostname,
      theme: {
        primaryColor: '#00A96E',
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        textColor: '#374151',
        starColor: '#FFC107',
        cardShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      },
      display: {
        maxReviews: 10,
        autoPlay: true,
        autoPlayInterval: 5000,
        showPhotos: true,
        showVerifiedBadge: true,
        showProductName: true,
        cardStyle: 'modern' // 'modern', 'minimal', 'bordered'
      },
      carousel: {
        itemsPerView: 3,
        itemsPerViewMobile: 1,
        gap: 16,
        navigation: true,
        pagination: true
      }
    },

    currentSlide: 0,
    autoPlayTimer: null,
    reviews: [],

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
      // Check if carousel already exists
      if (document.querySelector('.trustloop-carousel')) return;

      // Find insertion point
      var container = this.findInsertionPoint();
      if (!container) return;

      this.fetchReviews()
        .then(function(reviews) {
          this.reviews = reviews;
          if (reviews.length > 0) {
            this.createCarousel(container);
          }
        }.bind(this))
        .catch(function(error) {
          console.warn('TrustLoop: Failed to load carousel reviews', error);
        });
    },

    findInsertionPoint: function() {
      // Look for carousel containers or create one
      var existingContainer = document.querySelector('#trustloop-carousel, [data-trustloop-carousel]');
      if (existingContainer) return existingContainer;

      // Auto-insert on homepage
      if (this.isHomepage()) {
        var candidates = [
          '.main-content',
          '.homepage-content',
          '.page-content',
          'main',
          '.container'
        ];

        for (var i = 0; i < candidates.length; i++) {
          var element = document.querySelector(candidates[i]);
          if (element) {
            var container = document.createElement('div');
            container.id = 'trustloop-carousel';
            container.style.cssText = 'margin: 40px 0; padding: 0 20px;';
            element.appendChild(container);
            return container;
          }
        }
      }

      return null;
    },

    isHomepage: function() {
      return window.location.pathname === '/' || 
             window.location.pathname === '/index' ||
             document.body.classList.contains('template-index');
    },

    fetchReviews: function() {
      return fetch(this.config.apiUrl + '/api/reviews/featured?shop=' + this.config.shopDomain + '&limit=' + this.config.display.maxReviews)
        .then(function(response) {
          if (!response.ok) throw new Error('Failed to fetch');
          return response.json();
        })
        .then(function(data) {
          return data.reviews || [];
        })
        .catch(function() {
          // Return mock data for demo
          return [
            {
              id: '1',
              text: 'Absolutely love this product! The quality exceeded my expectations and shipping was super fast.',
              rating: 5,
              customerName: 'Sarah M.',
              productName: 'Premium Wireless Headphones',
              photos: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'],
              isVerified: true,
              date: '2024-01-15'
            },
            {
              id: '2',
              text: 'Great customer service and the product works exactly as described. Highly recommend!',
              rating: 5,
              customerName: 'Mike R.',
              productName: 'Smart Fitness Tracker',
              photos: [],
              isVerified: true,
              date: '2024-01-14'
            },
            {
              id: '3',
              text: 'Beautiful design and excellent build quality. Worth every penny!',
              rating: 4,
              customerName: 'Emma L.',
              productName: 'Bluetooth Speaker',
              photos: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop'],
              isVerified: true,
              date: '2024-01-13'
            },
            {
              id: '4',
              text: 'Fast delivery and product is exactly as shown. Very satisfied with my purchase.',
              rating: 5,
              customerName: 'David P.',
              productName: 'Wireless Charger',
              photos: [],
              isVerified: false,
              date: '2024-01-12'
            },
            {
              id: '5',
              text: 'Outstanding quality and performance. This has become my favorite purchase this year!',
              rating: 5,
              customerName: 'Lisa K.',
              productName: 'Smart Watch',
              photos: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'],
              isVerified: true,
              date: '2024-01-11'
            }
          ];
        });
    },

    createCarousel: function(container) {
      var carousel = document.createElement('div');
      carousel.className = 'trustloop-carousel';
      carousel.innerHTML = this.generateCarouselHTML();
      
      container.appendChild(carousel);
      
      this.attachEventListeners();
      this.startAutoPlay();
      this.handleResize();
    },

    generateCarouselHTML: function() {
      var html = '<div style="max-width: 1200px; margin: 0 auto; position: relative;">';
      
      // Header
      html += '<div style="text-align: center; margin-bottom: 32px;">';
      html += '<h2 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: ' + this.config.theme.textColor + ';">What Our Customers Say</h2>';
      html += '<p style="margin: 0; color: #6B7280; font-size: 16px;">Real reviews from real customers</p>';
      html += '</div>';

      // Carousel container
      html += '<div class="carousel-container" style="position: relative; overflow: hidden; border-radius: 12px;">';
      
      // Carousel track
      html += '<div class="carousel-track" style="display: flex; transition: transform 0.3s ease; gap: ' + this.config.carousel.gap + 'px;">';
      
      this.reviews.forEach(function(review, index) {
        html += this.generateReviewCard(review, index);
      }.bind(this));
      
      html += '</div>';
      html += '</div>';

      // Navigation
      if (this.config.carousel.navigation) {
        html += '<button class="carousel-prev" style="position: absolute; left: -20px; top: 50%; transform: translateY(-50%); background: white; border: 1px solid ' + this.config.theme.borderColor + '; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: ' + this.config.theme.cardShadow + '; z-index: 10;">‹</button>';
        html += '<button class="carousel-next" style="position: absolute; right: -20px; top: 50%; transform: translateY(-50%); background: white; border: 1px solid ' + this.config.theme.borderColor + '; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: ' + this.config.theme.cardShadow + '; z-index: 10;">›</button>';
      }

      // Pagination
      if (this.config.carousel.pagination) {
        html += '<div class="carousel-pagination" style="display: flex; justify-content: center; gap: 8px; margin-top: 24px;">';
        var totalSlides = Math.ceil(this.reviews.length / this.getItemsPerView());
        for (var i = 0; i < totalSlides; i++) {
          html += '<button class="pagination-dot" data-slide="' + i + '" style="width: 8px; height: 8px; border-radius: 50%; border: none; background: ' + (i === 0 ? this.config.theme.primaryColor : '#D1D5DB') + '; cursor: pointer; transition: background 0.2s;"></button>';
        }
        html += '</div>';
      }

      html += '</div>';
      return html;
    },

    generateReviewCard: function(review, index) {
      var cardWidth = 'calc((100% - ' + (this.config.carousel.gap * (this.getItemsPerView() - 1)) + 'px) / ' + this.getItemsPerView() + ')';
      
      var cardStyle = 'flex: 0 0 ' + cardWidth + '; background: ' + this.config.theme.backgroundColor + '; border-radius: 12px; padding: 20px; position: relative;';
      
      if (this.config.display.cardStyle === 'bordered') {
        cardStyle += ' border: 1px solid ' + this.config.theme.borderColor + ';';
      } else if (this.config.display.cardStyle === 'modern') {
        cardStyle += ' box-shadow: ' + this.config.theme.cardShadow + ';';
      }

      var html = '<div class="review-card" style="' + cardStyle + '">';
      
      // Stars
      html += '<div style="display: flex; gap: 2px; margin-bottom: 12px;">';
      for (var i = 1; i <= 5; i++) {
        var filled = i <= review.rating;
        html += '<span style="color: ' + (filled ? this.config.theme.starColor : '#E5E7EB') + '; font-size: 16px;">★</span>';
      }
      html += '</div>';

      // Review text
      html += '<p style="margin: 0 0 16px 0; color: ' + this.config.theme.textColor + '; line-height: 1.5; font-size: 14px;">' + this.escapeHtml(review.text) + '</p>';

      // Photo
      if (this.config.display.showPhotos && review.photos && review.photos.length > 0) {
        html += '<div style="margin-bottom: 16px;">';
        html += '<img src="' + review.photos[0] + '" alt="Customer photo" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid ' + this.config.theme.borderColor + ';">';
        html += '</div>';
      }

      // Customer info
      html += '<div style="display: flex; justify-content: space-between; align-items: center;">';
      html += '<div>';
      html += '<div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">';
      html += '<span style="font-weight: 600; color: ' + this.config.theme.textColor + '; font-size: 14px;">' + this.escapeHtml(review.customerName) + '</span>';
      
      if (this.config.display.showVerifiedBadge && review.isVerified) {
        html += '<span style="background: ' + this.config.theme.primaryColor + '20; color: ' + this.config.theme.primaryColor + '; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: 500;">Verified</span>';
      }
      
      html += '</div>';
      
      if (this.config.display.showProductName && review.productName) {
        html += '<div style="color: #6B7280; font-size: 12px;">' + this.escapeHtml(review.productName) + '</div>';
      }
      
      html += '</div>';
      html += '<div style="color: #9CA3AF; font-size: 11px;">' + this.formatDate(review.date) + '</div>';
      html += '</div>';

      html += '</div>';
      return html;
    },

    attachEventListeners: function() {
      var carousel = document.querySelector('.trustloop-carousel');
      if (!carousel) return;

      // Navigation buttons
      var prevBtn = carousel.querySelector('.carousel-prev');
      var nextBtn = carousel.querySelector('.carousel-next');
      
      if (prevBtn) {
        prevBtn.addEventListener('click', this.prevSlide.bind(this));
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', this.nextSlide.bind(this));
      }

      // Pagination dots
      var dots = carousel.querySelectorAll('.pagination-dot');
      dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
          this.goToSlide(index);
        }.bind(this));
      }.bind(this));

      // Pause autoplay on hover
      var container = carousel.querySelector('.carousel-container');
      if (container) {
        container.addEventListener('mouseenter', this.pauseAutoPlay.bind(this));
        container.addEventListener('mouseleave', this.startAutoPlay.bind(this));
      }
    },

    getItemsPerView: function() {
      return window.innerWidth <= 768 ? this.config.carousel.itemsPerViewMobile : this.config.carousel.itemsPerView;
    },

    updateCarousel: function() {
      var track = document.querySelector('.carousel-track');
      if (!track) return;

      var itemsPerView = this.getItemsPerView();
      var maxSlides = Math.ceil(this.reviews.length / itemsPerView);
      
      if (this.currentSlide >= maxSlides) {
        this.currentSlide = maxSlides - 1;
      }

      var translateX = -(this.currentSlide * 100);
      track.style.transform = 'translateX(' + translateX + '%)';

      // Update pagination
      var dots = document.querySelectorAll('.pagination-dot');
      dots.forEach(function(dot, index) {
        dot.style.background = index === this.currentSlide ? this.config.theme.primaryColor : '#D1D5DB';
      }.bind(this));
    },

    nextSlide: function() {
      var itemsPerView = this.getItemsPerView();
      var maxSlides = Math.ceil(this.reviews.length / itemsPerView);
      
      this.currentSlide = (this.currentSlide + 1) % maxSlides;
      this.updateCarousel();
    },

    prevSlide: function() {
      var itemsPerView = this.getItemsPerView();
      var maxSlides = Math.ceil(this.reviews.length / itemsPerView);
      
      this.currentSlide = this.currentSlide === 0 ? maxSlides - 1 : this.currentSlide - 1;
      this.updateCarousel();
    },

    goToSlide: function(slideIndex) {
      this.currentSlide = slideIndex;
      this.updateCarousel();
    },

    startAutoPlay: function() {
      if (!this.config.display.autoPlay) return;
      
      this.pauseAutoPlay();
      this.autoPlayTimer = setInterval(this.nextSlide.bind(this), this.config.display.autoPlayInterval);
    },

    pauseAutoPlay: function() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
    },

    handleResize: function() {
      var self = this;
      window.addEventListener('resize', function() {
        self.updateCarousel();
      });
    },

    formatDate: function(dateString) {
      var date = new Date(dateString);
      var now = new Date();
      var diffMs = now - date;
      var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 30) return diffDays + ' days ago';
      return date.toLocaleDateString();
    },

    escapeHtml: function(text) {
      var div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };

  // Auto-initialize
  if (!window.TrustLoopCarousel) {
    window.TrustLoopCarousel = TrustLoopCarousel;
    TrustLoopCarousel.init();
  }

})();