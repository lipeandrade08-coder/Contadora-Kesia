const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.querySelector('#year').textContent = new Date().getFullYear();

// Animações no Scroll (Reveal)
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Para de observar depois que já animou uma vez
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Seleciona todos os elementos com a classe reveal
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
  observer.observe(el);
});

// Slideshow com efeito Crossfade (Fader) suave e delicado no Hero
const heroSlides = document.querySelectorAll('.portrait-slide');
const heroDots = document.querySelectorAll('.portrait-dot');

if (heroSlides.length > 1) {
  let currentSlide = 0;
  let slideTimer = null;
  let leaveTimeout = null;

  const showSlide = (index) => {
    const nextSlide = (index + heroSlides.length) % heroSlides.length;
    if (nextSlide === currentSlide) return;

    const prevSlide = currentSlide;
    currentSlide = nextSlide;

    heroSlides.forEach((slide, i) => {
      if (i !== prevSlide && i !== currentSlide) {
        slide.classList.remove('is-active', 'is-leaving');
      }
    });

    // Mantém a foto anterior visível por baixo enquanto a nova surge suavemente por cima
    heroSlides[prevSlide].classList.remove('is-active');
    heroSlides[prevSlide].classList.add('is-leaving');

    heroSlides[currentSlide].classList.remove('is-leaving');
    heroSlides[currentSlide].classList.add('is-active');

    if (heroDots[prevSlide]) heroDots[prevSlide].classList.remove('is-active');
    if (heroDots[currentSlide]) heroDots[currentSlide].classList.add('is-active');

    if (leaveTimeout) clearTimeout(leaveTimeout);
    leaveTimeout = setTimeout(() => {
      heroSlides[prevSlide].classList.remove('is-leaving');
    }, 2250);
  };

  const startSlideshow = () => {
    stopSlideshow();
    slideTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5600);
  };

  const stopSlideshow = () => {
    if (slideTimer) clearInterval(slideTimer);
  };

  heroDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startSlideshow();
    });
  });

  startSlideshow();
}

// Intercepta cliques no WhatsApp para abrir o modal
const waLinks = document.querySelectorAll('a[href^="https://wa.me"]');
const waModal = document.getElementById('wa-modal');
const waForm = document.getElementById('wa-form');
const waServiceSelect = document.getElementById('wa-service');

waLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    // Pre-seleciona a opção baseada no link clicado
    const textParam = new URL(link.href).searchParams.get('text') || '';
    const lowerText = textParam.toLowerCase();
    if(lowerText.includes('abertura')) waServiceSelect.value = 'Abertura de Empresa';
    else if(lowerText.includes('regularizar')) waServiceSelect.value = 'Regularização / Pendências';
    else if(lowerText.includes('mensal')) waServiceSelect.value = 'Trocar de Contador / Contabilidade Mensal';
    else if(lowerText.includes('baixa')) waServiceSelect.value = 'Baixa de Empresa';
    else waServiceSelect.value = 'Outra dúvida';
    
    waModal.setAttribute('aria-hidden', 'false');
  });
});

document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    waModal.setAttribute('aria-hidden', 'true');
  });
});

waForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('wa-name').value;
  const cnpj = document.getElementById('wa-cnpj').value;
  const service = document.getElementById('wa-service').value;
  const details = document.getElementById('wa-details').value;

  const msg = `Olá, Kesia!\n\n*Nome:* ${name}\n*Situação do CNPJ:* ${cnpj}\n*Preciso de:* ${service}\n\n*Resumo da empresa/situação:* ${details}`;
  const encodedMsg = encodeURIComponent(msg);
  
  window.open(`https://wa.me/5512997462143?text=${encodedMsg}`, '_blank');
  waModal.setAttribute('aria-hidden', 'true');
  waForm.reset();
});
