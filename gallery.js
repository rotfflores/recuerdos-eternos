/* Galería compartida. Desplazamiento nativo táctil + scroll-snap, sin autoplay. */
(() => {
  "use strict";

  const photos = window.galleryPhotos;
  const track = document.getElementById("gallery-track");
  const previous = document.getElementById("gallery-previous");
  const next = document.getElementById("gallery-next");
  const counter = document.getElementById("gallery-counter");
  const viewer = document.getElementById("photo-viewer");
  const viewerPhoto = document.getElementById("viewer-photo");
  const viewerCaption = document.getElementById("viewer-caption");
  const unavailable = document.getElementById("viewer-unavailable");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const number = (index) => String(index + 1).padStart(2, "0");
  const cards = [];
  let activeIndex = -1;
  let opener = null;

  const showUnavailable = () => {
    viewerPhoto.hidden = true;
    unavailable.hidden = false;
  };
  viewerPhoto.addEventListener("error", showUnavailable);
  viewerPhoto.addEventListener("load", () => {
    viewerPhoto.hidden = false;
    unavailable.hidden = true;
  });

  const openPhoto = (index, button) => {
    const photo = photos[index];
    opener = button;
    viewerCaption.textContent = `${number(index)} — ${photo.caption}`;
    viewerPhoto.alt = photo.alt;
    viewerPhoto.width = photo.width;
    viewerPhoto.height = photo.height;
    viewerPhoto.hidden = false;
    unavailable.hidden = true;
    viewerPhoto.src = photo.src;
    if (viewerPhoto.complete && viewerPhoto.naturalWidth === 0) showUnavailable();
    viewer.showModal();
    document.documentElement.classList.add("photo-viewer-open");
  };

  photos.forEach((photo, index) => {
    const card = document.createElement("li");
    card.className = "gallery-card";
    card.style.setProperty("--i", index);
    const figure = document.createElement("figure");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-photo-button";
    button.setAttribute("aria-label", `Abrir fotografía ${number(index)} completa: ${photo.caption}`);
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-controls", "photo-viewer");

    const imageArea = document.createElement("span");
    imageArea.className = "gallery-image-area";
    // Relleno difuminado con la misma foto para las bandas de las fotos horizontales.
    imageArea.style.setProperty("--photo", `url("${photo.src}")`);
    const image = document.createElement("img");
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    image.loading = "lazy";
    image.decoding = "async";
    const fallback = document.createElement("span");
    fallback.className = "gallery-image-fallback";
    fallback.hidden = true;
    fallback.textContent = "Un recuerdo por volver";
    image.addEventListener("error", () => {
      image.hidden = true;
      fallback.hidden = false;
    });
    image.src = photo.src;
    imageArea.append(image, fallback);

    const expand = document.createElement("span");
    expand.className = "gallery-expand";
    expand.setAttribute("aria-hidden", "true");
    // Icono maximize-2 de Lucide (assets/iconos/), en SVG para verse igual en todos los sistemas.
    expand.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/></svg>';
    button.append(imageArea, expand);
    button.addEventListener("click", () => openPhoto(index, button));

    const caption = document.createElement("figcaption");
    const label = document.createElement("span");
    label.className = "gallery-photo-number";
    label.textContent = number(index);
    const phrase = document.createElement("span");
    phrase.className = "gallery-photo-phrase";
    phrase.textContent = photo.caption;
    caption.append(label, phrase);
    figure.append(button, caption);
    card.append(figure);
    track.append(card);
    cards.push(card);
  });

  // Distancias reales: también funcionan al cambiar el ancho o hacer zoom.
  const cardPosition = (card) => card.getBoundingClientRect().left
    - track.getBoundingClientRect().left + track.scrollLeft
    - parseFloat(getComputedStyle(track).paddingLeft);

  const updatePosition = () => {
    if (track.clientWidth === 0 || cards.length === 0) return;
    let nearest = 0;
    let distance = Infinity;
    cards.forEach((card, index) => {
      const difference = Math.abs(cardPosition(card) - track.scrollLeft);
      if (difference < distance) { distance = difference; nearest = index; }
    });
    previous.disabled = nearest === 0;
    next.disabled = nearest === cards.length - 1;
    if (nearest === activeIndex) return;
    activeIndex = nearest;
    cards.forEach((card, index) => card.classList.toggle("is-active", index === nearest));
    track.closest(".story-gallery").style.setProperty("--progress", ((nearest + 1) / cards.length).toFixed(3));
    counter.textContent = `${number(nearest)} / ${String(cards.length).padStart(2, "0")}`;
    counter.setAttribute("aria-label", `Fotografía ${nearest + 1} de ${cards.length}`);
  };

  const moveTo = (index) => {
    const target = Math.max(0, Math.min(cards.length - 1, index));
    track.scrollTo({ left: cardPosition(cards[target]), behavior: motionPreference.matches ? "instant" : "smooth" });
  };
  previous.addEventListener("click", () => moveTo(activeIndex - 1));
  next.addEventListener("click", () => moveTo(activeIndex + 1));
  track.addEventListener("keydown", (event) => {
    const destinations = { ArrowLeft: activeIndex - 1, ArrowRight: activeIndex + 1, Home: 0, End: cards.length - 1 };
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    const target = Math.max(0, Math.min(cards.length - 1, destinations[event.key]));
    if (event.target !== track) cards[target].querySelector("button").focus({ preventScroll: true });
    moveTo(target);
  });

  let scrollFrame = 0;
  track.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updatePosition(); });
  }, { passive: true });
  // El contenedor pasa de cerrado a visible cuando se abre la invitación.
  if ("ResizeObserver" in window) new ResizeObserver(updatePosition).observe(track);
  window.addEventListener("resize", updatePosition, { passive: true });
  updatePosition();

  viewer.addEventListener("close", () => {
    document.documentElement.classList.remove("photo-viewer-open");
    if (opener) opener.focus({ preventScroll: true });
  });
  // Cerrar al tocar fuera del panel; los gestos dentro de la foto no lo cierran.
  let outsideStart = false;
  const isOutside = (event) => {
    const rect = viewer.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  viewer.addEventListener("pointerdown", (event) => { outsideStart = event.target === viewer && isOutside(event); });
  viewer.addEventListener("click", (event) => {
    if (outsideStart && event.target === viewer && isOutside(event)) viewer.close();
    outsideStart = false;
  });
})();
