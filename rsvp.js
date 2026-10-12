/* Confirmación individual: prepara un mensaje, no registra asistencia. */
(() => {
  "use strict";
  const config = window.rsvpConfig;
  const { celebration, guests } = window.invitationData;
  // Sin ?invitado= se muestra el invitado de ejemplo de rsvp-data.js.
  const guest = window.getInvitationGuest()
    || (Object.hasOwn(guests, config.previewGuest) ? guests[config.previewGuest] : null);
  const hostName = String(config.hostName || "").trim() || celebration.name;
  const byId = (id) => document.getElementById(id);
  const form = byId("rsvp-form");
  const radios = [...form.querySelectorAll('[name="attendance"]')];
  const preview = byId("rsvp-preview");
  const prepared = byId("rsvp-prepared");
  const copyStatus = byId("rsvp-copy-status");
  // Zona UTC solo para dar formato a una fecha civil, sin cambiar el día por zona local.
  const deadline = new Date(`${config.deadline}T12:00:00Z`);
  if (!Number.isNaN(deadline.getTime())) {
    byId("rsvp-deadline").dateTime = config.deadline;
    byId("rsvp-deadline").textContent = new Intl.DateTimeFormat("es-MX", {
      timeZone: "UTC", day: "numeric", month: "long",
    }).format(deadline);
  }
  if (guest) {
    byId("rsvp-guest-name").textContent = guest.name;
  } else {
    byId("rsvp-greeting").textContent = "Este lugar es para ti";
  }
  // Si está vacío o mal formado se conserva la alternativa de copiar.
  const phone = String(config.phone || "").trim();
  const hasPhone = /^[1-9]\d{7,14}$/.test(phone);
  form.noValidate = true; // Mensajes propios vinculados a cada control y foco en el primer error.
  byId("rsvp-submit").disabled = false;

  const setError = (id, text, controls) => {
    byId(id).textContent = text;
    byId(id).hidden = !text;
    controls.forEach((control) => {
      if (text) control.setAttribute("aria-invalid", "true");
      else control.removeAttribute("aria-invalid");
    });
  };
  form.addEventListener("input", () => {
    // Nunca dejar un mensaje preparado que corresponda a una respuesta anterior.
    preview.hidden = true;
    prepared.value = "";
    byId("rsvp-open").removeAttribute("href");
    copyStatus.textContent = "";
    byId("rsvp-error-summary").textContent = "";
    const response = radios.find((radio) => radio.checked)?.value;
    if (response) setError("rsvp-response-error", "", radios);
    // La tarjeta y el botón cambian de tono según la respuesta.
    form.closest(".rsvp-paper").dataset.answer = response || "";
    byId("rsvp-submit-label").textContent = response === "no"
      ? "Enviar mi mensaje por WhatsApp"
      : "Confirmar por WhatsApp";
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const response = radios.find((radio) => radio.checked)?.value;
    setError("rsvp-response-error", response ? "" : "Elige si podrás acompañarme.", radios);
    if (!response) {
      byId("rsvp-error-summary").textContent = "Cuéntame primero si nos vemos.";
      radios[0].focus();
      return;
    }
    byId("rsvp-error-summary").textContent = "";
    const personalMessage = byId("rsvp-message").value.trim();
    const answer = response === "yes" ? "¡Sí asistiré a tu cumpleaños!" : "Esta vez no podré acompañarte.";
    const message = `Hola, ${hostName}. ${guest ? `Soy ${guest.name}. ` : ""}${answer}${personalMessage ? ` Mi mensaje para ti: ${personalMessage}` : ""}`;
    prepared.value = message;
    preview.hidden = false;
    copyStatus.textContent = "";
    byId("rsvp-open").hidden = !hasPhone;
    byId("rsvp-preview-note").textContent = hasPhone
      ? "Envía este mensaje en WhatsApp para completar tu confirmación. Si no se abrió, usa el enlace de abajo."
      : "El teléfono aún no está disponible. Copia el mensaje para compartirlo con la anfitriona.";
    byId("rsvp-preview-title").focus();
    if (hasPhone) {
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      byId("rsvp-open").href = url;
      // Acción directa del usuario. WhatsApp todavía requiere que pulse Enviar.
      window.open(url, "_blank", "noopener,noreferrer");
    }
  });

  byId("rsvp-copy").addEventListener("click", async () => {
    const message = prepared.value;
    copyStatus.textContent = "";
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
        copied = true;
      }
    } catch { /* Permiso denegado o contexto local sin portapapeles moderno. */ }
    if (!copied) {
      prepared.focus();
      prepared.select();
      prepared.setSelectionRange(0, prepared.value.length);
      try { copied = document.execCommand("copy"); } catch { /* Ofrecer copia manual. */ }
    }
    if (copied) {
      byId("rsvp-copy").focus();
      copyStatus.textContent = "Mensaje copiado. Compártelo con la anfitriona para completar tu confirmación.";
    } else {
      copyStatus.textContent = "No se pudo copiar automáticamente. El texto está seleccionado: usa Copiar en tu dispositivo o Ctrl+C / ⌘C.";
    }
  });
})();
