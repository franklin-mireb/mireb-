/* =========================================================
   PAGEMINGO DESIGN - JAVASCRIPT FUNCTIONALITY
   ========================================================= */

// Configuration globale
const PageMingoDesign = {
    // Initialisation
    init: function() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupContactForm();
        this.setupNavigationEffects();
        this.setupStatsCounter();
        console.log('PageMingo Design initialized successfully');
    },

    // Menu mobile
    setupMobileMenu: function() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
                
                // Animation du bouton burger
                const icon = this.querySelector('i');
                if (mobileMenu.classList.contains('hidden')) {
                    icon.className = 'fas fa-bars text-xl';
                } else {
                    icon.className = 'fas fa-times text-xl';
                }
            });

            // Fermer le menu quand on clique sur un lien
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuButton.querySelector('i');
                    icon.className = 'fas fa-bars text-xl';
                });
            });
        }
    },

    // Défilement fluide
    setupSmoothScrolling: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('nav').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    // Animations au scroll
    setupScrollAnimations: function() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observer les éléments avec animation
        document.querySelectorAll('.hover-lift, .scroll-animate').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    },

    // Gestion du formulaire de contact
    setupContactForm: function() {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validation basique
                const requiredFields = this.querySelectorAll('input[required], select[required], textarea[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('border-red-500');
                        field.addEventListener('input', function() {
                            this.classList.remove('border-red-500');
                        });
                    }
                });

                if (!isValid) {
                    PageMingoDesign.showNotification('Veuillez remplir tous les champs requis', 'error');
                    return;
                }

                // Animation de chargement
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...';
                submitButton.disabled = true;

                // Simuler l'envoi (remplacer par votre logique d'envoi)
                setTimeout(() => {
                    PageMingoDesign.showNotification('Message envoyé avec succès !', 'success');
                    this.reset();
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 2000);
            });
        }
    },

    // Effets de navigation
    setupNavigationEffects: function() {
        const nav = document.querySelector('nav');
        if (nav) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled', 'bg-white/95', 'backdrop-blur-sm', 'shadow-lg');
                } else {
                    nav.classList.remove('scrolled', 'bg-white/95', 'backdrop-blur-sm', 'shadow-lg');
                }
            });
        }

        // Highlight du lien actif
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('text-purple-600', 'font-semibold');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('text-purple-600', 'font-semibold');
                }
            });
        });
    },

    // Compteur de statistiques
    setupStatsCounter: function() {
        const stats = document.querySelectorAll('.stats-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.textContent);
                    this.animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));
    },

    // Animation du compteur
    animateCounter: function(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '') + 
                                   (element.textContent.includes('★') ? '★' : '') +
                                   (element.textContent.includes('/7') ? '/7' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + 
                                   (element.textContent.includes('★') ? '★' : '') +
                                   (element.textContent.includes('/7') ? '/7' : '');
            }
        }, 50);
    },

    // Affichage des notifications
    showNotification: function(message, type = 'success') {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
                ${message}
                <button class="ml-4 text-white/80 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Suppression automatique après 5 secondes
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    },

    // Utilitaires
    utils: {
        // Scroll vers un élément
        scrollToElement: function(elementId, offset = 0) {
            const element = document.getElementById(elementId);
            if (element) {
                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = element.offsetTop - headerHeight - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        },

        // Validation email
        validateEmail: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        // Formatage de numéro de téléphone
        formatPhone: function(phone) {
            return phone.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ');
        },

        // Debounce pour optimiser les performances
        debounce: function(func, wait, immediate) {
            let timeout;
            return function executedFunction() {
                const context = this;
                const args = arguments;
                const later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
    }
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    PageMingoDesign.init();
});

// Gestion du redimensionnement de fenêtre
window.addEventListener('resize', PageMingoDesign.utils.debounce(function() {
    // Réajuster les animations si nécessaire
    console.log('Window resized, adjusting layout...');
}, 250));

// Export pour utilisation externe si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageMingoDesign;
}

// Fonctions globales pour compatibilité
window.PageMingoDesign = PageMingoDesign;
