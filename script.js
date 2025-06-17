// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);

// Update theme icon based on current theme
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    updateNavBackground(); // Update nav background on theme change
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70; // Height of the fixed nav
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu .nav-link'); // More specific selector

function highlightActiveSection() {
    const scrollPos = window.scrollY + 100; // Adjusted offset for better accuracy

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 70; // Account for fixed nav
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingNavLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active');
            }
        } else {
            if (correspondingNavLink) {
                correspondingNavLink.classList.remove('active');
            }
        }
    });

    // Highlight home if at the top
    if (window.scrollY < sections[0].offsetTop - 70) {
        navLinks.forEach(link => link.classList.remove('active'));
        const homeLink = document.querySelector('.nav-menu a[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
    }
}

window.addEventListener('scroll', highlightActiveSection);
window.addEventListener('load', highlightActiveSection); // Highlight on load


// Navbar background on scroll
const nav = document.querySelector('.nav');

function updateNavBackground() {
    if (window.scrollY > 50) {
        nav.style.background = body.getAttribute('data-theme') === 'dark' 
            ? 'rgba(15, 23, 42, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = body.getAttribute('data-theme') === 'dark' 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = 'none';
    }
}

window.addEventListener('scroll', updateNavBackground);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => { // Renamed to avoid conflict
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            animationObserver.unobserve(entry.target); // Unobserve after animation
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.project-card, .skill-group, .stat, .skill-category, .design-card'); // Added .design-card
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animationObserver.observe(el); // Use the renamed observer
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');

if (contactForm) { // Check if form exists
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = contactForm.querySelector('input[type="text"]');
        const emailInput = contactForm.querySelector('input[type="email"]');
        const subjectInput = contactForm.querySelectorAll('input[type="text"]')[1];
        const messageInput = contactForm.querySelector('textarea');

        const name = nameInput ? nameInput.value : '';
        const email = emailInput ? emailInput.value : '';
        const subject = subjectInput ? subjectInput.value : '';
        const message = messageInput ? messageInput.value : '';
        
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}


// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInNotification 0.3s ease; /* Renamed animation */
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    if (type === 'success') {
        notification.style.background = '#10b981'; // Green
    } else if (type === 'error') {
        notification.style.background = '#ef4444'; // Red
    } else { // Info
        notification.style.background = '#6366f1'; // Primary color
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.3s ease forwards'; // Renamed animation
        setTimeout(() => {
            if (document.body.contains(notification)) { // Check if still exists
                 document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add animation keyframes for notification
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInNotification { /* Renamed animation */
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutNotification { /* Renamed animation */
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-menu .nav-link.active { /* More specific selector */
        color: var(--primary-color);
        font-weight: 600; /* Make active link bolder */
    }
    
    .nav-menu .nav-link.active::after { /* More specific selector */
        width: 100%;
    }
`;
document.head.appendChild(notificationStyle);


// Typing effect for hero title (Optional - can be intensive)
/*
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = ''; // Clear existing content before typing
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML.replace(/<span class="gradient-text">|<\/span>/g, ''); // Get text content without span
        const nameSpan = heroTitle.querySelector('.gradient-text').outerHTML; // Keep the span
        const textToType = originalText.replace("Daniel Ituah", "") + nameSpan;

        // To avoid re-typing, check if it has already been typed
        if (!heroTitle.dataset.typed) {
             typeWriter(heroTitle, textToType, 50);
             heroTitle.dataset.typed = "true";
        }
    }
});
*/

// Parallax effect for hero profile card (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const profileCard = document.querySelector('.hero-image .profile-card');
    
    if (profileCard && window.innerWidth > 768) { // Apply only on larger screens
        const rate = scrolled * -0.1; // Reduced rate for subtlety
        profileCard.style.transform = `translateY(${rate}px)`;
    } else if (profileCard) {
        profileCard.style.transform = `translateY(0px)`; // Reset on smaller screens
    }
});


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateNavBackground();
    highlightActiveSection();
    
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});