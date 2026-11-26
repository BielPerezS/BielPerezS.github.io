/*
  script.js — Interactividad y animaciones de movimiento de la página (JavaScript).
  Controla el año del footer, el menú móvil, la barra activa al hacer scroll,
  la entrada escalonada de elementos y el movimiento sutil de los anillos de fondo.
*/

// 1. Referencias a elementos del HTML
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const yearEl = document.getElementById('year');
const yorhaBgSvg = document.getElementById('yorha-bg-svg');
const yorhaRings = document.getElementById('yorha-rings');
const yorhaRingsBottom = document.getElementById('yorha-rings-bottom');

// 2. Inserta automáticamente el año actual en el pie de página
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// 3. Controla el estado del navbar y resalta la sección visible al hacer scroll
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const updateOnScroll = () => {
  if (window.scrollY > 12) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Detecta qué sección está en pantalla para marcar su enlace en el menú
  let currentId = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 130;
    if (window.scrollY >= top) {
      currentId = section.getAttribute('id');
    }
  });

  navAnchors.forEach((anchor) => {
    anchor.classList.toggle('active', anchor.getAttribute('href') === `#${currentId}`);
  });
};

window.addEventListener('scroll', updateOnScroll, { passive: true });
updateOnScroll();

// 4. Abre y cierra el menú de navegación en versión móvil
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// 5. Aparición escalonada de tarjetas y barras al entrar en pantalla
const revealElements = document.querySelectorAll('.reveal');

// Asigna un pequeño retardo progresivo a tarjetas hermanas (proyectos, formación, experiencia)
document.querySelectorAll('.projects-grid, .edu-list, .timeline').forEach((group) => {
  group.querySelectorAll('.reveal').forEach((item, index) => {
    item.style.setProperty('--delay', `${index * 90}ms`);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((el) => observer.observe(el));

// 6. Movimiento sutil (parallax) de la geometría de fondo siguiendo el ratón
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ((yorhaBgSvg || yorhaRings || yorhaRingsBottom) && !prefersReducedMotion) {
  window.addEventListener(
    'mousemove',
    (event) => {
      const offsetX = (event.clientX / window.innerWidth - 0.5) * 14;
      const offsetY = (event.clientY / window.innerHeight - 0.5) * 14;
      if (yorhaBgSvg) {
        yorhaBgSvg.style.transform = `translate(${offsetX * 0.6}px, ${offsetY * 0.6}px)`;
      }
      if (yorhaRings) {
        yorhaRings.style.transform = `translate(${offsetX * 1.2}px, ${offsetY * 1.2}px)`;
      }
      if (yorhaRingsBottom) {
        yorhaRingsBottom.style.transform = `translate(${-offsetX * 0.9}px, ${-offsetY * 0.9}px)`;
      }
    },
    { passive: true }
  );
}

// 7. Efecto glitch aleatorio: cada 5 segundos tiene un 30% de probabilidad de activarse
if (!prefersReducedMotion) {
  setInterval(() => {
    if (Math.random() < 0.5) {
      document.body.classList.add('glitch-active');
      setTimeout(() => {
        document.body.classList.remove('glitch-active');
      }, 280);
    }
  }, 5000);
}

// 8. Efecto máquina de escribir en el nombre: escribe, espera 6s, borra, espera y vuelve a escribir
const typedNameEl = document.getElementById('typed-name');

if (typedNameEl && !prefersReducedMotion) {
  const fullName = 'Biel Pérez Silvestre';
  let charIndex = 0;
  let isDeleting = false;
  typedNameEl.textContent = '';

  const runTypewriter = () => {
    if (!isDeleting) {
      charIndex += 1;
      typedNameEl.textContent = fullName.slice(0, charIndex);

      if (charIndex === fullName.length) {
        isDeleting = true;
        setTimeout(runTypewriter, 6000); // Mantiene el nombre completo visible 6 segundos
        return;
      }
      setTimeout(runTypewriter, 75);
    } else {
      charIndex -= 1;
      typedNameEl.textContent = fullName.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        setTimeout(runTypewriter, 650); // Pausa breve vacío antes de volver a escribir
        return;
      }
      setTimeout(runTypewriter, 45);
    }
  };

  setTimeout(runTypewriter, 350);
}
