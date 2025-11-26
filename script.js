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

// ----------------------
// Chatbot asistente (Gemini Flash) - JS puro con fetch
// ----------------------

(() => {
    const toggle = document.getElementById('chatbot-toggle');
    const panel = document.getElementById('chatbot-panel');
    const closeBtn = document.getElementById('chatbot-close');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const messagesEl = document.getElementById('chatbot-messages');

    if (!toggle || !panel || !form || !input || !messagesEl) return;

    const root = document.getElementById('chatbot-root');

    function openPanel() {
        if (!root.classList.contains('open')) {
            root.classList.add('open');
            panel.removeAttribute('hidden');
            toggle.setAttribute('aria-expanded', 'true');
            input.focus();
        }
    }

    function closePanel() {
        if (root.classList.contains('open')) {
            root.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            // hide after transition for better a11y
            setTimeout(() => panel.setAttribute('hidden', 'true'), 240);
        }
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (root.classList.contains('open')) closePanel(); else openPanel();
    });
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closePanel(); });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!root.classList.contains('open')) return;
        if (!root.contains(e.target)) closePanel();
    });

    // Evitar cerrar cuando se hace click dentro del panel
    panel.addEventListener('click', (e) => e.stopPropagation());

    function appendMessage(text, role = 'assistant') {
        const div = document.createElement('div');
        div.className = `chatbot-message ${role}`;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function appendLoading() {
        const div = document.createElement('div');
        div.className = 'chatbot-message assistant';
        div.id = 'chatbot-loading';
        div.textContent = 'Escribiendo...';
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeLoading() {
        const el = document.getElementById('chatbot-loading');
        if (el) el.remove();
    }

    // Obtener/guardar API key y endpoint en sessionStorage (temporal, no seguro para producción)
    function ensureApiSettings() {
        // Soporte de dos modos: "proxy" recomendado (llama a /api/generate local), o "direct" (usa la key en el navegador)
        let mode = sessionStorage.getItem('CHAT_MODE');
        if (!mode) {
            mode = prompt('Elige modo: "proxy" (recomendado) o "direct" (pegar API key en el navegador, no seguro). Escribe proxy o direct:', 'proxy') || 'proxy';
            mode = mode.toLowerCase() === 'direct' ? 'direct' : 'proxy';
            sessionStorage.setItem('CHAT_MODE', mode);
        }

        if (mode === 'proxy') {
            // Proxy local: no pedimos key al navegador. Asumimos que el usuario ejecuta el proxy en este repo.
            const url = '/api/generate';
            sessionStorage.setItem('GEMINI_API_URL', url);
            return { mode, key: null, url };
        } else {
            let key = sessionStorage.getItem('GEMINI_API_KEY');
            let url = sessionStorage.getItem('GEMINI_API_URL');
            if (!key) {
                key = prompt('Introduce tu API key para Gemini (se guardará temporalmente en esta sesión):');
                if (key) sessionStorage.setItem('GEMINI_API_KEY', key.trim());
            }
            if (!url) {
                url = prompt('Introduce la URL del endpoint para Gemini Flash (ej: https://api.yourprovider/v1):', 'https://YOUR_GEMINI_ENDPOINT') || 'https://YOUR_GEMINI_ENDPOINT';
                if (url) sessionStorage.setItem('GEMINI_API_URL', url.trim());
            }
            return { mode, key: sessionStorage.getItem('GEMINI_API_KEY'), url: sessionStorage.getItem('GEMINI_API_URL') };
        }
    }

    async function sendToGemini(message) {
        const settings = ensureApiSettings();
        if (!settings.url) throw new Error('Falta URL del endpoint.');

        // Payload genérico: el proxy o endpoint debería aceptar { prompt, model, max_tokens }
        const payload = {
            prompt: message,
            model: 'gemini-flash-1',
            max_tokens: 512
        };

        const headers = { 'Content-Type': 'application/json' };
        // Si el usuario eligió modo directo, incluimos la clave en Authorization
        if (settings.mode === 'direct' && settings.key) headers['Authorization'] = `Bearer ${settings.key}`;

        const res = await fetch(settings.url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        try {
            const json = JSON.parse(text);
            // Varios formatos posibles; intentamos algunos campos comunes
            if (json.output && typeof json.output === 'string') return json.output;
            if (json.output && json.output[0] && json.output[0].content) return json.output[0].content;
            if (json.candidates && json.candidates[0] && json.candidates[0].content) return json.candidates[0].content;
            if (json.choices && json.choices[0] && json.choices[0].message) return json.choices[0].message.content || JSON.stringify(json.choices[0].message);
            // Si llega como texto simple dentro de alguna propiedad
            const flat = JSON.stringify(json);
            return flat;
        } catch (e) {
            // No JSON, devolver texto plano
            return text;
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) return;
        appendMessage(val, 'user');
        input.value = '';
        appendLoading();
        try {
            const reply = await sendToGemini(val);
            removeLoading();
            appendMessage(reply, 'assistant');
        } catch (err) {
            removeLoading();
            appendMessage('Hubo un error al conectar con el asistente. Revisa la API key y el endpoint.', 'assistant');
            console.error('Chatbot error:', err);
        }
    });

    // Toggle with Enter when toggle has focus
    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle.click();
        }
    });

    // Atajos
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePanel();
    });

    // Mensaje de bienvenida
    appendMessage('Hola — soy tu asistente. Escribe una pregunta y pulsa Enviar.', 'assistant');

})();
