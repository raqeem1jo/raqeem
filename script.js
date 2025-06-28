// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    });

    // Statistics counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = target.textContent;
                animateCounter(target, finalNumber);
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Counter animation function
    function animateCounter(element, finalText) {
        const hasPlus = finalText.includes('+');
        const hasComma = finalText.includes(',');
        const numberOnly = finalText.replace(/[+,]/g, '');
        const finalNumber = parseInt(numberOnly);
        
        let currentNumber = 0;
        const increment = finalNumber / 50; // 50 steps
        const duration = 2000; // 2 seconds
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            
            let displayNumber = Math.floor(currentNumber).toString();
            
            // Add comma formatting for numbers > 999
            if (hasComma && displayNumber.length > 3) {
                displayNumber = displayNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            
            // Add plus sign if original had it
            if (hasPlus) {
                displayNumber = '+' + displayNumber;
            }
            
            element.textContent = displayNumber;
        }, stepTime);
    }

    // Form handling
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const role = formData.get('role');
        const message = formData.get('message').trim();

        // Validation
        if (!validateForm(name, email, role)) {
            return;
        }

        // Simulate form submission
        submitForm(name, email, role, message);
    });

    // Form validation
    function validateForm(name, email, role) {
        let isValid = true;

        // Clear previous error styles
        clearErrorStyles();

        // Name validation
        if (name.length < 2) {
            showError('name', 'يجب أن يكون الاسم أكثر من حرفين');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'يرجى إدخال بريد إلكتروني صحيح');
            isValid = false;
        }

        // Role validation
        if (!role) {
            showError('role', 'يرجى اختيار الدور المطلوب');
            isValid = false;
        }

        return isValid;
    }

    // Show error function
    function showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        field.style.borderColor = '#e74c3c';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    // Clear error styles
    function clearErrorStyles() {
        const inputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
        inputs.forEach(input => {
            input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        });

        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
    }

    // Submit form function
    function submitForm(name, email, role, message) {
        // Show loading state
        const submitButton = contactForm.querySelector('.form-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'جاري الإرسال...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = 'none';
            successMessage.classList.add('show');

            // Log form data (in real implementation, this would be sent to a server)
            console.log('Form submitted:', {
                name: name,
                email: email,
                role: role,
                message: message,
                timestamp: new Date().toISOString()
            });

            // Reset form after 5 seconds
            setTimeout(() => {
                contactForm.style.display = 'block';
                successMessage.classList.remove('show');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                clearErrorStyles();
            }, 5000);
        }, 1500);
    }

    // Telegram link functionality
    const telegramLink = document.getElementById('telegram-link');
    telegramLink.addEventListener('click', function(e) {
        e.preventDefault();
        // In a real implementation, this would link to the actual Telegram group
        alert('سيتم توجيهك إلى مجموعة الخريجين على تيليجرام قريباً!');
    });

    // Scroll animations for sections
    const animatedElements = document.querySelectorAll('.service-card, .partner-card, .gallery-item');
    
    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Initially hide elements and observe them
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(element);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroGraphic = document.querySelector('.hero-graphic');
        
        if (heroGraphic && scrolled < window.innerHeight) {
            const rate = scrolled * -0.5;
            heroGraphic.style.transform = `translateY(${rate}px)`;
        }
    });

    // Gallery image modal (simple lightbox effect)
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            createImageModal(this.src, this.alt);
        });
    });

    // Create image modal
    function createImageModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
        `;

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 12px;
        `;

        modal.appendChild(img);
        document.body.appendChild(modal);

        // Close modal on click
        modal.addEventListener('click', function() {
            document.body.removeChild(modal);
        });

        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        });
    }

    // Smooth reveal animation for hero content
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateX(0)';
        }
        
        if (heroImage) {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }
    }, 100);

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Performance optimization: Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Additional utility functions

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events for better performance
window.addEventListener('scroll', throttle(function() {
    // Scroll-based animations can be added here
}, 16)); // ~60fps


// Video Gallery Filtering
function initVideoGallery() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const videoCards = document.querySelectorAll('.video-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-category');

            // Filter video cards
            videoCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.display = 'block';
                    }, 10);
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => {
                        if (card.classList.contains('hidden')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

// Initialize video gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initVideoGallery();
});


// Google Form Integration
function initGoogleForm() {
    const googleFormIframe = document.querySelector('.google-form-iframe');
    const formNote = document.querySelector('.form-note');
    
    if (googleFormIframe) {
        // Handle iframe load events
        googleFormIframe.addEventListener('load', function() {
            console.log('Google Form loaded successfully');
        });
        
        // Handle iframe errors
        googleFormIframe.addEventListener('error', function() {
            console.log('Google Form failed to load');
            if (formNote) {
                formNote.innerHTML = '<p style="color: #e74c3c;">حدث خطأ في تحميل النموذج. يرجى <a href="https://docs.google.com/forms/d/e/1FAIpQLSdKxY8vZ9wX2mN4pQ7rS6tU8vW0xY1zA2bC3dE4fG5hI6jK7l/viewform" target="_blank" class="form-link">فتح النموذج في نافذة جديدة</a></p>';
            }
        });
    }
}

// Social Media Link Tracking
function initSocialMediaTracking() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.classList.contains('instagram') ? 'Instagram' :
                           this.classList.contains('linkedin') ? 'LinkedIn' :
                           this.classList.contains('facebook') ? 'Facebook' :
                           this.classList.contains('whatsapp') ? 'WhatsApp' : 'Unknown';
            
            console.log(`User clicked on ${platform} link`);
            
            // Add a small delay to ensure tracking
            setTimeout(() => {
                // Link will open normally
            }, 100);
        });
    });
}

// Enhanced Form Validation
function enhanceFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const role = formData.get('role');
            
            // Enhanced validation
            if (!name || name.trim().length < 2) {
                alert('يرجى إدخال اسم صحيح (أكثر من حرفين)');
                return;
            }
            
            if (!email || !isValidEmail(email)) {
                alert('يرجى إدخال بريد إلكتروني صحيح');
                return;
            }
            
            if (!role) {
                alert('يرجى اختيار الدور المطلوب');
                return;
            }
            
            // Simulate form submission
            const submitButton = this.querySelector('.form-submit');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'جاري الإرسال...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                // Show success message
                const successMessage = document.getElementById('success-message');
                if (successMessage) {
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Reset form
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    if (successMessage) {
                        successMessage.style.display = 'none';
                    }
                }, 5000);
                
            }, 2000);
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Program Cards Animation
function initProgramCardsAnimation() {
    const programCards = document.querySelectorAll('.program-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    programCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
}

// Social Media Hover Effects
function initSocialMediaEffects() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize all new functionality
document.addEventListener('DOMContentLoaded', function() {
    initGoogleForm();
    initSocialMediaTracking();
    enhanceFormValidation();
    initProgramCardsAnimation();
    initSocialMediaEffects();
    
    console.log('All enhanced features initialized successfully');
});

