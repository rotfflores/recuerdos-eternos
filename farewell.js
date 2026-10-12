/* Cierre personalizado con la misma resolución de URL que la portada. */
(() => {
  "use strict";
  const guest = window.getInvitationGuest();
  const data = window.farewellData;
  document.getElementById("farewell-personal").textContent = guest
    ? `${guest.name}, nos vemos para escribir otro recuerdo`
    : "Nos vemos para escribir otro recuerdo";
  document.getElementById("farewell-signature").textContent = `Con cariño, ${data.signatureName}`;

  const photo = document.getElementById("farewell-photo");
  const fallback = document.getElementById("farewell-photo-fallback");
  fallback.textContent = Array.from(data.signatureName.trim())[0] || "♥";
  fallback.setAttribute("aria-label", `Monograma de ${data.signatureName}`);
  const showFallback = () => { photo.hidden = true; fallback.hidden = false; };
  const showPhoto = () => {
    if (!photo.naturalWidth) return showFallback();
    photo.hidden = false;
    fallback.hidden = true;
  };
  photo.addEventListener("load", showPhoto);
  photo.addEventListener("error", showFallback);
  photo.alt = data.photoAlt;
  photo.src = data.photo;
  if (photo.complete) showPhoto();

  document.getElementById("back-to-top").addEventListener("click", (event) => {
    event.preventDefault();
    // Devolver también el foco para que el teclado retome la lectura desde arriba.
    const heading = document.getElementById("hero-title");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  });
})();
