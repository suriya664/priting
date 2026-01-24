// Main JavaScript file for 3D Print Pro Website

// Dark Mode Toggle
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateDarkModeIcon(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
        updateDarkModeIcon('dark');
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateDarkModeIcon(newTheme);
        });
    }
}

function updateDarkModeIcon(theme) {
    const icon = document.querySelector('#darkModeToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun text-yellow-500' : 'fas fa-moon text-gray-600';
    }
}

// RTL Toggle
function initRTL() {
    const rtlToggle = document.getElementById('rtlToggle');
    const html = document.documentElement;
    
    // Check for saved RTL preference
    const savedRTL = localStorage.getItem('rtl');
    if (savedRTL === 'true') {
        html.setAttribute('dir', 'rtl');
        updateRTLIcon(true);
    }
    
    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const currentRTL = html.getAttribute('dir') === 'rtl';
            const newRTL = !currentRTL;
            
            html.setAttribute('dir', newRTL ? 'rtl' : 'ltr');
            localStorage.setItem('rtl', newRTL);
            updateRTLIcon(newRTL);
        });
    }
}

function updateRTLIcon(isRTL) {
    const icon = document.querySelector('#rtlToggle i');
    if (icon) {
        icon.className = isRTL ? 'fas fa-align-left text-gray-600' : 'fas fa-language text-gray-600';
    }
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = mobileMenu.classList.contains('hidden') ? 'fas fa-bars text-gray-600' : 'fas fa-times text-gray-600';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars text-gray-600';
                }
            }
        });
    }
}

// Sidebar Toggle for Dashboard
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = sidebar.classList.contains('active') ? 'fas fa-times text-gray-600' : 'fas fa-bars text-gray-600';
            }
        });
    }
}

// Smooth Scrolling
function initSmoothScroll() {
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
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Form Validation Helper
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else {
            clearError(input);
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showError(input, message) {
    clearError(input);
    
    input.classList.add('border-red-500');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'text-red-500 text-sm mt-1';
    errorElement.textContent = message;
    errorElement.id = input.id + '-error';
    
    input.parentNode.appendChild(errorElement);
}

function clearError(input) {
    input.classList.remove('border-red-500');
    
    const errorElement = document.getElementById(input.id + '-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-slide-right ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                'fa-info-circle'
            } mr-3"></i>
            <span>${message}</span>
            <button class="ml-auto pl-3" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Loading State
function setLoading(button, loading = true) {
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

// File Upload Helper
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

function isAllowedFileType(filename) {
    const allowedTypes = ['stl', 'obj', 'step', 'stp', '3mf'];
    const extension = getFileExtension(filename).toLowerCase();
    return allowedTypes.includes(extension);
}

// Local Storage Helper
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function getLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error('Error removing from localStorage:', e);
    }
}

// Debounce Function
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

// Throttle Function
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
    };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initRTL();
    initMobileMenu();
    initSidebar();
    initSmoothScroll();
    initScrollAnimations();
    
    // Add loading animation to page
    document.body.classList.add('animate-slide-up');
    
    // Initialize tooltips if needed
    initTooltips();
    
    // Initialize modals if needed
    initModals();
});

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg';
            tooltip.textContent = e.target.getAttribute('data-tooltip');
            tooltip.id = 'tooltip';
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Initialize modals
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.modal');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(targetId);
            
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    modals.forEach(modal => {
        const closeButtons = modal.querySelectorAll('[data-modal-close]');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// Export functions for use in other files
window.showNotification = showNotification;
window.setLoading = setLoading;
window.validateForm = validateForm;
window.formatFileSize = formatFileSize;
window.getFileExtension = getFileExtension;
window.isAllowedFileType = isAllowedFileType;
window.setLocalStorage = setLocalStorage;
window.getLocalStorage = getLocalStorage;
window.removeLocalStorage = removeLocalStorage;
window.debounce = debounce;
window.throttle = throttle;
