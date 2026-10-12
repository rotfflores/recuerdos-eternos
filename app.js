/* Portada personalizada. Galerías y detalles del evento son compartidos. */
(() => {
  "use strict";

  const { celebration, defaultCover } = window.invitationData;
  const guest = window.getInvitationGuest();
  const cover = guest || defaultCover;

  document.getElementById("birthday-label").textContent = `MIS ${celebration.age} · ${celebration.name.toLocaleUpperCase("es")}`;
  document.getElementById("hero-title").textContent = cover.title;
  document.getElementById("host-signature").textContent = celebration.name;
  document.getElementById("photo-caption").textContent = guest
    ? `${celebration.name} + ${guest.name} · un recuerdo de tantos.`
    : defaultCover.caption;
  document.title = `Mis ${celebration.age} · ${celebration.name} — Mi historia, contigo`;

  const photo = document.getElementById("hero-photo");
  const fallback = document.getElementById("photo-fallback");
  const showFallback = () => {
    photo.hidden = true;
    fallback.hidden = false;
  };
  const showPhoto = () => {
    if (photo.naturalWidth === 0) return showFallback();
    photo.hidden = false;
    fallback.hidden = true;
  };

  // Registrar antes de asignar src cubre errores y cargas desde caché.
  photo.addEventListener("load", showPhoto);
  photo.addEventListener("error", showFallback);
  photo.alt = cover.photoAlt;
  photo.src = cover.photo;
  if (photo.complete) showPhoto();

  // Título palabra por palabra: el texto completo queda en aria-label para lectores de pantalla.
  const title = document.getElementById("hero-title");
  const words = title.textContent.trim().split(/\s+/);
  title.setAttribute("aria-label", title.textContent);
  title.textContent = "";
  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "word";
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--i", index);
    span.textContent = word;
    title.append(span, index < words.length - 1 ? " " : "");
  });
  title.classList.add("split");

  // Las secciones aparecen suavemente al llegar a ellas.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Fondo vivo: las ondas se desplazan con el scroll y, en computadora, siguen al cursor.
  const backdrop = document.querySelector(".backdrop");
  if (backdrop && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let frame = 0;
    let pointer = { x: 0, y: 0 };
    const paint = () => {
      frame = 0;
      backdrop.style.setProperty("--sy", Math.min(window.scrollY, 1200).toFixed(1));
      backdrop.style.setProperty("--px", pointer.x.toFixed(3));
      backdrop.style.setProperty("--py", pointer.y.toFixed(3));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX / window.innerWidth * 2 - 1, y: event.clientY / window.innerHeight * 2 - 1 };
      schedule();
    }, { passive: true });
  }

  // El contenido después de la portada permanece cerrado hasta pulsar el botón.
  const content = document.getElementById("invitation-content");
  const button = document.getElementById("discover-button");
  const openInvitation = () => {
    content.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    const nextSection = document.getElementById("invitacion");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Esperar un cuadro para que el contenido recién abierto tenga altura antes de desplazarse.
    requestAnimationFrame(() => {
      nextSection.focus({ preventScroll: true });
      nextSection.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "start" });
    });
  };

  button.addEventListener("click", (event) => {
    event.preventDefault();
    openInvitation();
  });
  if (window.location.hash === "#invitacion") openInvitation();
})();
