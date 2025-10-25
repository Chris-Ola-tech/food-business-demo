let cart = [];

    // DOM Elements
    const menuBar = document.getElementById('menu-bar');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const closeMenu = document.getElementById('close-menu');
    const cartBtn = document.getElementById('cart-btn');
    const cartDropdown = document.getElementById('cart');
    const closeCart = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const mainHeader = document.getElementById('main-header');

    // Header drop animation
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        mainHeader.classList.remove('header-hidden');
        mainHeader.classList.add('header-visible');
      }, 100);
    });

    // Mobile menu toggle
    menuBar.addEventListener('click', () => {
      mobileMenu.classList.remove('-translate-x-full');
      menuBackdrop.classList.remove('hidden');
    });

    closeMenu.addEventListener('click', closeMobileMenu);
    menuBackdrop.addEventListener('click', closeMobileMenu);

    function closeMobileMenu() {
      mobileMenu.classList.add('-translate-x-full');
      menuBackdrop.classList.add('hidden');
    }

    // Close mobile menu when clicking nav links
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Cart toggle
    cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cartDropdown.classList.toggle('hidden');
    });

    closeCart.addEventListener('click', () => {
      cartDropdown.classList.add('hidden');
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
      if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
        cartDropdown.classList.add('hidden');
      }
    });

    // Add to cart
    document.querySelectorAll('.order-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);

        const existing = cart.find(item => item.name === name);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ name, price, qty: 1 });
        }

        updateCart();
        cartDropdown.classList.remove('hidden');
        
        // Pulse animation on cart badge
        cartCount.classList.add('cart-badge-pulse');
        setTimeout(() => cartCount.classList.remove('cart-badge-pulse'), 300);
      });
    });

    // Update cart UI
    function updateCart() {
      cartItems.innerHTML = '';
      let total = 0;
      let itemCount = 0;

      if (cart.length === 0) {
        emptyCartMsg.classList.remove('hidden');
        cartTotal.parentElement.classList.add('hidden');
        checkoutBtn.classList.add('hidden');
        clearCartBtn.classList.add('hidden');
      } else {
        emptyCartMsg.classList.add('hidden');
        cartTotal.parentElement.classList.remove('hidden');
        checkoutBtn.classList.remove('hidden');
        clearCartBtn.classList.remove('hidden');

        cart.forEach((item, index) => {
          total += item.price * item.qty;
          itemCount += item.qty;

          const li = document.createElement('li');
          li.className = 'flex justify-between items-start bg-gray-50 p-4 rounded-lg smooth-transition hover:bg-gray-100';

          li.innerHTML = `
            <div class="flex-1">
              <p class="font-semibold text-gray-800">${item.name}</p>
              <div class="flex items-center gap-3 mt-2">
                <div class="flex items-center gap-2 bg-white rounded-lg px-2 py-1 border">
                  <button class="qty-decrease text-gray-600 hover:text-[#5C3B1E] font-bold" data-index="${index}">−</button>
                  <span class="font-semibold text-sm w-6 text-center">${item.qty}</span>
                  <button class="qty-increase text-gray-600 hover:text-[#5C3B1E] font-bold" data-index="${index}">+</button>
                </div>
                <span class="text-[#5C3B1E] font-bold">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            </div>
            <button class="remove-btn text-red-500 hover:text-red-700 ml-4 smooth-transition" data-index="${index}">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          `;

          cartItems.appendChild(li);
        });
      }

      cartTotal.textContent = `${total.toFixed(2)}`;
      cartCount.textContent = itemCount;

      // Update WhatsApp checkout link
      updateCheckoutLink();

      // Attach event listeners to quantity buttons
      attachQuantityListeners();
    }

    // Attach quantity change listeners
    function attachQuantityListeners() {
      document.querySelectorAll('.qty-increase').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          cart[index].qty += 1;
          updateCart();
        });
      });
     
           // Save cart to localStorage
  localStorage.setItem('foodCart', JSON.stringify(cart));

      document.querySelectorAll('.qty-decrease').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          if (cart[index].qty > 1) {
            cart[index].qty -= 1;
          } else {
            cart.splice(index, 1);
          }
          updateCart();
        });
      });

      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          cart.splice(index, 1);
          updateCart();
        });
      });
    }

    // Update WhatsApp checkout link
    function updateCheckoutLink() {
      let message = 'Hello! I would like to order:\n\n';
      let total = 0;

      cart.forEach(item => {
        message += `${item.qty}x ${item.name} - ${(item.price * item.qty).toFixed(2)}\n`;
        total += item.price * item.qty;
      });

      message += `\nTotal: ${total.toFixed(2)}`;

      const phone = '2348134260378'; // Replace with your WhatsApp number
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      checkoutBtn.href = whatsappUrl;
    }

    clearCartBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    localStorage.removeItem('foodCart');
    updateCart();
  }
});

    // Load cart from localStorage
const savedCart = localStorage.getItem('foodCart');
if (savedCart) {
  cart = JSON.parse(savedCart);
}

// Initialize cart
updateCart();






    

  // Typing Effect
  const phrases = [
    "Bringing Flavor Home",
    "Authentic Nigerian Dishes",
    "Fast & Fresh Delivery",
    "Taste the Tradition"
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.getElementById('typing-text');
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 2000;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 500;
    }

    setTimeout(typeEffect, speed);
  }

  // Start typing effect on load
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 1000);
  });

  // Smooth scroll for Learn More button
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Parallax effect on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const heroImg = document.querySelector('.hero-bg img');
    
    if (heroImg) {
      heroImg.style.transform = `translateY(${currentScroll * 0.5}px) scale(1.1)`;
    }
    
    lastScroll = currentScroll;
  });





   // Intersection Observer for scroll animations
  const observerOptionss = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observers = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptionss);

  document.querySelectorAll('.animate-on-scroll').forEach((element) => {
    observers.observe(element);
  });

  // Read More functionality
  function toggleReadMore() {
    const expandedText = document.getElementById('expandedText');
    const buttonText = document.getElementById('buttonText');
    const buttonIcon = document.getElementById('buttonIcon');
    
    if (expandedText.classList.contains('show')) {
      expandedText.classList.remove('show');
      buttonText.textContent = 'Read More';
      buttonIcon.style.transform = 'rotate(0deg)';
    } else {
      expandedText.classList.add('show');
      buttonText.textContent = 'Read Less';
      buttonIcon.style.transform = 'rotate(180deg)';
    }
  }





   // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-view').forEach(el => {
      observer.observe(el);
    });






    const container = document.getElementById('testimonial-list');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let currentIndex = 0;
  const totalSlides = 5;

  function updateSlider(index) {
    currentIndex = index;
    const offset = -100 * currentIndex;
    container.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active', 'bg-[#C8102E]');
        dot.classList.remove('bg-gray-300');
      } else {
        dot.classList.remove('active', 'bg-[#C8102E]');
        dot.classList.add('bg-gray-300');
      }
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlider(index);
    });
  });

  // Previous button
  prevBtn.addEventListener('click', () => {
    const newIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    updateSlider(newIndex);
  });

  // Next button
  nextBtn.addEventListener('click', () => {
    const newIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
    updateSlider(newIndex);
  });

  // Auto-play (optional)
  let autoplayInterval = setInterval(() => {
    const newIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
    updateSlider(newIndex);
  }, 5000);

  // Pause autoplay on hover
  const sliderContainer = document.getElementById('testimonial-container');
  sliderContainer.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
  });

  sliderContainer.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => {
      const newIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
      updateSlider(newIndex);
    }, 5000);
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  sliderContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left
      const newIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
      updateSlider(newIndex);
    }
    if (touchEndX > touchStartX + 50) {
      // Swipe right
      const newIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
      updateSlider(newIndex);
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      const newIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
      updateSlider(newIndex);
    } else if (e.key === 'ArrowRight') {
      const newIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
      updateSlider(newIndex);
    }
  });










  function toggleFaq(index) {
    const content = document.getElementById(`faq-content-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    
    // Close all other FAQs
    for (let i = 1; i <= 6; i++) {
      if (i !== index) {
        const otherContent = document.getElementById(`faq-content-${i}`);
        const otherIcon = document.getElementById(`faq-icon-${i}`);
        if (otherContent.classList.contains('active')) {
          otherContent.classList.remove('active');
          otherIcon.classList.remove('active');
        }
      }
    }
    
    // Toggle current FAQ
    content.classList.toggle('active');
    icon.classList.toggle('active');
  }

  // Optional: Open first FAQ by default
  // toggleFaq(1);











  const contactFormMain = document.getElementById('contact-form-main');
    const contactSendBtn = document.getElementById('contact-send-btn');
    const contactSuccessMsg = document.getElementById('contact-success-msg');

    contactFormMain.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form values
      const contactNameValue = document.getElementById('contact-name-field').value;
      const contactPhoneValue = document.getElementById('contact-phone-field').value;
      const contactEmailValue = document.getElementById('contact-email-field').value;
      const contactMessageValue = document.getElementById('contact-message-field').value;

      // Create WhatsApp message
      const whatsappContactMessage = `*New Order/Inquiry*%0A%0A` +
                             `*Name:* ${encodeURIComponent(contactNameValue)}%0A` +
                             `*Phone:* ${encodeURIComponent(contactPhoneValue)}%0A` +
                             `*Email:* ${encodeURIComponent(contactEmailValue)}%0A%0A` +
                             `*Message:*%0A${encodeURIComponent(contactMessageValue)}`;

      // WhatsApp number (replace with your actual number)
      const whatsappContactNumber = '2348134260378';
      const whatsappContactUrl = `https://wa.me/${whatsappContactNumber}?text=${whatsappContactMessage}`;

      // Show success message
      contactSuccessMsg.classList.remove('hidden');

      // Change button text temporarily
      const originalContactBtnText = contactSendBtn.innerHTML;
      contactSendBtn.innerHTML = `
        <svg class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Opening WhatsApp...
      `;
      contactSendBtn.disabled = true;

      // Open WhatsApp after a short delay
      setTimeout(() => {
        window.open(whatsappContactUrl, '_blank');
        
        // Reset form
        contactFormMain.reset();
        
        // Reset button
        contactSendBtn.innerHTML = originalContactBtnText;
        contactSendBtn.disabled = false;

        // Hide success message after 5 seconds
        setTimeout(() => {
          contactSuccessMsg.classList.add('hidden');
        }, 5000);
      }, 1000);
    });

    // Add input validation feedback
    const contactInputs = document.querySelectorAll('.contact-form-input');
    contactInputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
          this.style.borderColor = '#10B981'; // Green border for valid input
        }
      });

      input.addEventListener('focus', function() {
        this.style.borderColor = '#F4C542'; // Gold border on focus
      });
    });








    function handleNewsletterSubmit(e) {
      e.preventDefault();
      const emailInput = document.getElementById('footer-newsletter-email');
      const email = emailInput.value;
      
      // Create WhatsApp message
      const message = `Hi! I'd like to subscribe to your newsletter with this email: ${email}`;
      const whatsappUrl = `https://wa.me/2348134260378?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Show success message (you can customize this)
      alert('Thank you for subscribing! We\'ll contact you via WhatsApp.');
      
      // Reset form
      emailInput.value = '';
    }