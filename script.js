// Smooth scrolling para navegación
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

// Animación al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observar elementos para animación
document.querySelectorAll('.stat-card, .timeline-item, .contact-card, .skill-tag').forEach(el => {
    observer.observe(el);
});

// Efecto de parallax suave en el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Cambiar estilo de navbar al hacer scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
});

// Animación de escritura para el título (opcional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Contador animado para stats
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Activar animaciones cuando los elementos son visibles
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// Efecto hover en tarjetas de contacto
document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)';
        this.style.color = '#ffffff';
        const icon = this.querySelector('.contact-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)';
        this.style.color = '#1e293b';
        const icon = this.querySelector('.contact-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Añadir transiciones a los iconos de contacto
document.querySelectorAll('.contact-icon').forEach(icon => {
    icon.style.transition = 'transform 0.3s ease';
});

// Easter egg: doble click en el nombre
const navBrand = document.querySelector('.nav-brand');
if (navBrand) {
    navBrand.addEventListener('dblclick', () => {
        alert('¡Gracias por visitar mi portafolio! 🚀');
    });
}

// Log de bienvenida en consola
console.log('%c¡Hola! 👋', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cGracias por visitar mi portafolio', 'color: #8b5cf6; font-size: 16px;');
console.log('%c- Sofia Victoria Espinola Medina', 'color: #ec4899; font-size: 14px; font-style: italic;');
