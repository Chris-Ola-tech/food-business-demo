const menu = document.getElementById("menu");
const menuBar = document.getElementById("menu-bar");

// Toggle menu on click
menuBar.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent immediate closing
  menu.classList.toggle("hidden");
  menu.classList.toggle("flex");
});

// Close menu if clicked outside
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !menuBar.contains(e.target)) {
    menu.classList.add("hidden");
    menu.classList.remove("flex");
  }
});

// Header drop animation
window.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("main-header");

  setTimeout(() => {
    header.classList.add("drop");
  }, 100);
});






   let cart = JSON.parse(localStorage.getItem("cart")) || []; // load saved cart

const cartDropdown = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartMenuBtn = document.getElementById("cart-menu-btn"); // your "Cart" menu link
const closeCartBtn = document.getElementById("close-cart");
const clearCartBtn = document.getElementById("clear-cart");

// Add to cart
document.querySelectorAll(".order-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    // check if item exists in cart
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    // save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // show & update cart when order is hit
    updateCart(true);
  });
});

// Update cart UI
function updateCart(show = false) {
  if (show) cartDropdown.classList.remove("hidden"); // show cart only when triggered

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const li = document.createElement("li");
    li.className = "flex justify-between items-center text-sm mb-1";

    li.innerHTML = `
      <div>
        ${item.qty} × ${item.name} <span class="font-bold">$${item.price * item.qty}</span>
      </div>
      <button class="remove-btn text-red-600 ml-4" data-index="${index}">❌</button>
    `;

    cartItems.appendChild(li);
  });

  cartTotal.textContent = "Total: $" + total;

  // Build WhatsApp message
  let message = "Hello, I want to order:%0A";
  cart.forEach(item => {
    message += `- ${item.qty} × ${item.name} ($${item.price} each)%0A`;
  });
  message += `%0ATotal = $${total}`;

  // 👉 Put your WhatsApp number here
  checkoutBtn.href = `https://wa.me/2348134260378?text=${message}`;

  // keep localStorage updated
  localStorage.setItem("cart", JSON.stringify(cart));

  // Attach remove button events
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cart.splice(index, 1); // remove the item
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart(true); // refresh cart
    });
  });
}



// Close cart when X is clicked
closeCartBtn.addEventListener("click", () => {
  cartDropdown.classList.add("hidden");
});

// Clear cart items
clearCartBtn.addEventListener("click", () => {
  cart = []; // empty the array
  localStorage.removeItem("cart"); // clear localStorage
  updateCart(); // refresh cart UI
  cartDropdown.classList.add("hidden"); // hide after clearing
});

// Load existing cart from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  if (cart.length > 0) {
    updateCart(false);
  }
});




document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('testimonial-container');
  const testimonialList = document.getElementById('testimonial-list');
  const dots = Array.from(document.querySelectorAll('.dot'));
  if (!container || !testimonialList || dots.length === 0) return;

  // compute slide width (recompute on resize)
  let slideWidth = container.clientWidth;
  const updateSlideWidth = () => {
    // use container width (visible viewport width for one slide)
    slideWidth = container.clientWidth || (testimonialList.children[0] && testimonialList.children[0].getBoundingClientRect().width) || 0;
  };
  window.addEventListener('resize', updateSlideWidth);
  updateSlideWidth();

  // set active dot UI
  function setActiveDot(index) {
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.remove('bg-gray-400');
        dot.classList.add('bg-[#C8102E]');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('bg-[#C8102E]');
        dot.classList.add('bg-gray-400');
        dot.removeAttribute('aria-current');
      }
    });
  }

  // click on dots -> scroll to slide
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlideWidth();
      container.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
      setActiveDot(index);
    });
  });

  // on manual scroll, update active dot (debounced)
  let scrollTimeout = null;
  container.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateSlideWidth();
      const index = Math.round(container.scrollLeft / (slideWidth || 1));
      setActiveDot(Math.min(Math.max(index, 0), dots.length - 1));
    }, 50);
  });

  // initialize
  setActiveDot(0);
});

  document.getElementById("sendBtn").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent empty submission

    // Get input values
    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    // Check if all fields are filled
    if (!name || !phone || !email || !message) {
      alert("Please fill out all fields before sending.");
      return; // Stop if any field is empty
    }

    // Build WhatsApp message
    let whatsappMessage = `Hello, my name is ${name}.
Phone: ${phone}
Email: ${email}
Message: ${message}`;

    // Encode message for URL
    let encodedMessage = encodeURIComponent(whatsappMessage);

    // Your WhatsApp number (no + or leading 0)
    let phoneNumber = "2348134260378";

    // Redirect to WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  });





  var showText = document.querySelector('.show-text')
var orderText = document.querySelector('.order-text')

showText.addEventListener('click', () => {
  if (orderText.style.display === 'block') {
    // Hide text
    orderText.style.display = 'none'
    showText.textContent = 'Read More'
  } else {
    // Show text
    orderText.style.display = 'block'
    showText.textContent = 'See Less'
  }
})





 document.addEventListener("DOMContentLoaded", () => {
    const captions = document.querySelectorAll(".food-caption");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.3 } // triggers when 30% of item is visible
    );

    captions.forEach((caption) => observer.observe(caption));
  });