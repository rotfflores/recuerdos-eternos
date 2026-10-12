/* DATOS EDITABLES — separados del diseño y de la lógica.
 * Todas las fotografías son PROVISIONALES, de Unsplash; las personas retratadas
 * no son Camila ni sus invitados. Reemplazar assets/*.jpg por fotos autorizadas.
 * Se usa Camila según el encabezado del encargo. Para usar Valentina, cambiar
 * únicamente celebration.name y los textos alternativos de las fotografías.
 * Créditos y enlaces de origen: README.md.
 */
window.invitationData = {
  celebration: {
    name: "Camila",
    age: 30,
  },
  defaultCover: {
    title: "Mi historia, contigo",
    photo: "assets/camila.jpg", // PROVISIONAL: retrato individual.
    photoAlt: "Fotografía provisional: retrato individual para la portada de Camila",
    caption: "Un nuevo capítulo, la misma esencia.",
  },
  guests: {
    julian: {
      name: "Julián",
      title: "Julián, mi historia también tiene un pedacito de ti.",
      photo: "assets/julian.jpg", // PROVISIONAL: mujer y hombre juntos.
      photoAlt: "Fotografía provisional de una mujer y un hombre para representar a Camila y Julián",
    },
    ana: {
      name: "Ana",
      title: "Ana, hay recuerdos que no serían los mismos sin ti",
      photo: "assets/ana.jpg", // PROVISIONAL: dos amigas juntas.
      photoAlt: "Fotografía provisional de dos amigas para representar a Camila y Ana",
    },
    sofia: {
      name: "Sofía",
      title: "Sofía, qué bonito seguir sumando momentos contigo",
      photo: "assets/sofia.jpg", // PROVISIONAL: dos amigas juntas.
      photoAlt: "Fotografía provisional de dos amigas para representar a Camila y Sofía",
    },
  },
};

// Una sola resolución del invitado, compartida por la portada y la confirmación.
window.getInvitationGuest = () => {
  const key = new URLSearchParams(window.location.search).get("invitado");
  return Object.hasOwn(window.invitationData.guests, key) ? window.invitationData.guests[key] : null;
};
