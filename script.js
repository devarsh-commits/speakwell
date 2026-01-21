// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// Replace with your business WhatsApp number (with country code, no + or spaces)
// Example: For +91 9876543210, use: 919876543210
const BUSINESS_WHATSAPP_NUMBER = "919323222335";

// ============================================
// POPUP MODAL FUNCTIONS
// ============================================

// Show popup when page loads
window.addEventListener('load', function () {
    setTimeout(function () {
        openModal();
    }, 1500); // Show popup after 1.5 seconds
    setTimeout(function () {
        animateNumber('rating', 4.8, 2000, true);
        animateNumber('satisfaction', 98, 2000, false);
    }, 200);
    setupSlider();
    // Run on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupSlider, 250);
});
});

function animateValue(element, start, end, duration, isDecimal = false) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        if (isDecimal) {
            const value = (progress * (end - start) + start).toFixed(1);
            element.textContent = value;
        } else {
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
//function for slider
function setupSlider() {
    const slider = document.getElementById('logoSlider');

    // Only apply slider on mobile
    if (window.innerWidth <= 768) {
        // Check if already converted to slider
        if (!slider.querySelector('.slider-track')) {
            // Get all boxes
            const boxes = Array.from(slider.querySelectorAll('.box'));

            // Create slider track
            const track = document.createElement('div');
            track.className = 'slider-track';

            // Add original boxes
            boxes.forEach(box => {
                track.appendChild(box.cloneNode(true));
            });

            // Duplicate boxes for seamless loop
            boxes.forEach(box => {
                track.appendChild(box.cloneNode(true));
            });

            // Clear slider and add track
            slider.innerHTML = '';
            slider.appendChild(track);
        }
    } else {
        // Desktop: restore grid layout
        if (slider.querySelector('.slider-track')) {
            const track = slider.querySelector('.slider-track');
            const boxes = Array.from(track.querySelectorAll('.box')).slice(0, 4);

            slider.innerHTML = '';
            boxes.forEach(box => slider.appendChild(box));
        }
    }
}
// Function to reset and animate
function animateStats() {
    const ratingElement = document.getElementById('rating');
    const satisfactionElement = document.getElementById('satisfaction');

    // Reset to 0
    ratingElement.textContent = '0.0';
    satisfactionElement.textContent = '0';

    // Animate
    animateValue(ratingElement, 0, 4.8, 2000, true);
    animateValue(satisfactionElement, 0, 98, 2000, false);
}

// Intersection Observer setup
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
        }
    });
}, observerOptions);

// Start observing
const statsSection = document.querySelector('.mainbox2');
if (statsSection) {
    observer.observe(statsSection);
}

// Open modal
function openModal() {
    document.getElementById('enquiryModal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('enquiryModal').classList.remove('show');
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('enquiryModal');
    if (event.target == modal) {
        closeModal();
    }
}
//javascript for hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ============================================
// FORM SUBMISSION WITH WHATSAPP INTEGRATION
// ============================================

document.getElementById('enquiryForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const course = document.getElementById('course').value;

    // Validate form
    if (!name || !phone || !course) {
        alert('Please fill in all fields');
        return;
    }

    // Validate phone number (10 digits)
    if (phone.length !== 10 || isNaN(phone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    // Disable submit button to prevent multiple submissions
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Send to WhatsApp
    sendToWhatsApp(name, phone, course);

    // Reset form and close modal
    setTimeout(function () {
        document.getElementById('enquiryForm').reset();
        closeModal();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Enquiry';

        // Show success message
        alert(`Thank you ${name}! Your enquiry has been sent via WhatsApp. We'll contact you soon!`);
    }, 1000);
});

// ============================================
// WHATSAPP INTEGRATION
// ============================================

function sendToWhatsApp(name, phone, course) {
    // Create formatted message
    const message = `
 *New Enquiry - SpeakWell Academy*

*Name:* ${name}
*Phone:* ${phone}
*Course Interested:* ${course}

*Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

---
Please contact this lead as soon as possible!
    `.trim();

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');

    // Also log to console for debugging
    console.log('Enquiry Details:', { name, phone, course });
}

// ============================================
// SMOOTH SCROLLING FOR NAVIGATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close modal if open when navigating
            closeModal();
        }
    });
});

// ============================================
// ADDITIONAL FEATURES (Optional)
// ============================================

// Track form interactions (optional - for analytics)
document.getElementById('name').addEventListener('focus', function () {
    console.log('User started filling the form');
});

// Prevent closing modal on ESC key (optional - remove if you want ESC to close)
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});
function animateNumber(elementId, finalValue, duration, hasDecimal) {
    var element = document.getElementById(elementId);
    if (!element) return;

    var startValue = 0;
    var startTime = null;

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        var progress = (currentTime - startTime) / duration;

        if (progress < 1) {
            var currentValue = startValue + (finalValue - startValue) * progress;
            if (hasDecimal) {
                element.textContent = currentValue.toFixed(1);
            } else {
                element.textContent = Math.floor(currentValue);
            }
            requestAnimationFrame(animate);
        } else {
            if (hasDecimal) {
                element.textContent = finalValue.toFixed(1);
            } else {
                element.textContent = finalValue;
            }
        }
    }

    requestAnimationFrame(animate);
}

// Start animation when page loads
window.addEventListener('load', function () {

});

