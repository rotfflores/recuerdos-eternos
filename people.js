/* Tercer capítulo. Funciona también desde file:// y no utiliza el parámetro invitado. */
(() => {
  "use strict";

  const album = document.getElementById("people-memories");
  const viewer = document.getElementById("people-viewer");
  const viewerImage = document.getElementById("people-viewer-image");
  const viewerNames = document.getElementById("people-viewer-names");
  const viewerPhrase = document.getElementById("people-viewer-phrase");
  const unavailable = document.getElementById("people-viewer-unavailable");
  const namesFormatter = new Intl.ListFormat("es", { style: "long", type: "conjunction" });
  let opener = null;

  const showUnavailable = () => {
    viewerImage.hidden = true;
    unavailable.hidden = false;
  };
  viewerImage.addEventListener("error", showUnavailable);
  viewerImage.addEventListener("load", () => {
    viewerImage.hidden = false;
    unavailable.hidden = true;
  });

  const openMemory = (memory, names, button) => {
    opener = button;
    viewerNames.textContent = names;
    viewerPhrase.textContent = memory.phrase;
    viewerImage.alt = memory.alt;
    viewerImage.width = memory.width;
    viewerImage.height = memory.height;
    viewerImage.hidden = false;
    unavailable.hidden = true;
    viewerImage.src = memory.src;
    if (viewerImage.complete && viewerImage.naturalWidth === 0) showUnavailable();
    viewer.showModal(); // Foco modal y Escape nativos, sin atrapar teclas manualmente.
    document.documentElement.classList.add("photo-viewer-open");
  };

  window.peopleMemories.forEach((memory, index) => {
    const names = namesFormatter.format(memory.names);
    const card = document.createElement("li");
    // app.js observa estas tarjetas después de crearlas y las revela al entrar en pantalla.
    card.className = "people-card reveal";
    card.style.setProperty("--i", index); // escalona la entrada dentro de cada fila
    const figure = document.createElement("figure");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "people-photo-button";
    button.setAttribute("aria-label", `Ver fotografía completa con ${names}: ${memory.phrase}`);
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-controls", "people-viewer");

    const image = document.createElement("img");
    image.alt = memory.alt;
    image.width = memory.width;
    image.height = memory.height;
    image.loading = "lazy";
    image.decoding = "async";
    const fallback = document.createElement("span");
    fallback.className = "people-photo-fallback";
    fallback.style.aspectRatio = `${memory.width} / ${memory.height}`;
    fallback.textContent = "Un recuerdo por volver";
    fallback.hidden = true;
    image.addEventListener("error", () => { image.hidden = true; fallback.hidden = false; });
    image.src = memory.src;
    button.append(image, fallback);
    button.addEventListener("click", () => openMemory(memory, names, button));

    const caption = document.createElement("figcaption");
    const heading = document.createElement("h3");
    heading.textContent = names;
    const dedication = document.createElement("p");
    dedication.textContent = memory.phrase;
    caption.append(heading, dedication);
    figure.append(button, caption);
    card.append(figure);
    album.append(card);
  });

  viewer.addEventListener("close", () => {
    document.documentElement.classList.toggle("photo-viewer-open", Boolean(document.querySelector("dialog[open]")));
    opener?.focus({ preventScroll: true });
  });

  // Cerrar con un toque fuera del panel, sin confundir un arrastre desde la foto.
  const outside = (event) => {
    const rect = viewer.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  let startedOutside = false;
  viewer.addEventListener("pointerdown", (event) => { startedOutside = event.target === viewer && outside(event); });
  viewer.addEventListener("click", (event) => {
    if (startedOutside && event.target === viewer && outside(event)) viewer.close();
    startedOutside = false;
  });
})();
