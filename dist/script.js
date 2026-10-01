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

// Parallax na imagem/vídeo principal
const portraitVideo = document.querySelector('.portrait-frame video');
window.addEventListener('scroll', () => {
  if (portraitVideo && window.innerWidth > 720) {
    const scroll = window.scrollY;
    portraitVideo.style.transform = `translateY(${scroll * 0.15}px)`;
  }
});

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
