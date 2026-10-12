/* Cuarto capítulo: datos compartidos, cuenta regresiva y calendario descargable. */
(() => {
  "use strict";
  const event = window.celebrationEvent;
  const byId = (id) => document.getElementById(id);
  const pad = (value) => String(value).padStart(2, "0");
  const partsFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: event.timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  });
  const zonedParts = (instant) => Object.fromEntries(
    partsFormatter.formatToParts(instant).filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)])
  );

  // Convertir la fecha y hora locales usando las reglas IANA del navegador.
  // No se usa new Date("2026-11-14T19:00") ni la zona horaria del visitante.
  const [year, month, day] = event.date.split("-").map(Number);
  const [hour, minute] = event.time.split(":").map(Number);
  const wallTime = Date.UTC(year, month - 1, day, hour, minute);
  let startMilliseconds = wallTime;
  for (let attempt = 0; attempt < 4; attempt++) {
    const parts = zonedParts(startMilliseconds);
    const correction = wallTime - Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    startMilliseconds += correction;
    if (correction === 0) break;
  }
  const actual = zonedParts(startMilliseconds);
  if (actual.year !== year || actual.month !== month || actual.day !== day || actual.hour !== hour || actual.minute !== minute) {
    throw new RangeError("Revisa la fecha y hora de event-data.js: no existen en la zona horaria indicada.");
  }
  if (!Number.isFinite(event.durationHours) || event.durationHours <= 0) throw new RangeError("durationHours debe ser mayor que cero.");
  const start = new Date(startMilliseconds);
  const end = new Date(startMilliseconds + event.durationHours * 60 * 60 * 1000);

  byId("event-title").textContent = event.title;
  byId("event-introduction").textContent = event.introduction;
  byId("event-date").dateTime = event.date;
  byId("event-weekday").textContent = new Intl.DateTimeFormat("es-MX", { timeZone: event.timeZone, weekday: "long" }).format(start).toLocaleUpperCase("es");
  byId("event-day").textContent = pad(day);
  byId("event-month-year").textContent = `${new Intl.DateTimeFormat("es-MX", { timeZone: event.timeZone, month: "long" }).format(start).toLocaleUpperCase("es")} · ${year}`;
  const clockParts = new Intl.DateTimeFormat("en-US", { timeZone: event.timeZone, hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(start);
  const clock = Object.fromEntries(clockParts.map((part) => [part.type, part.value]));
  byId("event-time").textContent = `${clock.hour}:${clock.minute} ${clock.dayPeriod === "AM" ? "a. m." : "p. m."}`;
  byId("event-time").dateTime = start.toISOString();
  document.querySelector(".event-fact-note").textContent = event.timeNote;
  byId("event-venue").textContent = event.venue;
  byId("event-address").textContent = event.address;
  byId("event-dress-code").textContent = event.dressCode;

  // Sin URL válida, el control sigue desactivado y no tiene href.
  let mapsUrl = null;
  try {
    const candidate = new URL(event.mapsUrl);
    if (candidate.protocol === "https:") mapsUrl = candidate.href;
  } catch { /* Ubicación aún por confirmar. */ }
  if (mapsUrl) {
    byId("event-map").href = mapsUrl;
    byId("event-map").hidden = false;
    byId("event-map-pending").hidden = true;
  }

  // iCalendar RFC 5545: UTC evita horas flotantes; conserva la zona de origen
  // en X-WR-TIMEZONE. 19:00 America/Monterrey = 01:00Z del día siguiente.
  const icsDate = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const icsText = (text) => String(text).replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/[,;]/g, (character) => `\\${character}`);
  // Plegar a 75 OCTETOS (no caracteres), sin partir letras acentuadas UTF-8.
  const encoder = new TextEncoder();
  const foldLine = (line) => {
    let folded = "";
    let length = 0;
    for (const character of line) {
      const size = encoder.encode(character).length;
      if (length + size > 75) { folded += "\r\n "; length = 1; }
      folded += character;
      length += size;
    }
    return folded;
  };
  const description = `${event.introduction}\n\n${event.timeNote}: ${byId("event-time").textContent}\nVestimenta: ${event.dressCode}`;
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Mi historia contigo//Invitacion//ES",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-TIMEZONE:${event.timeZone}`,
    "BEGIN:VEVENT", `UID:${icsText(event.uid)}`, `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(event.calendarTitle)}`, `LOCATION:${icsText(`${event.venue}, ${event.address}`)}`,
    `DESCRIPTION:${icsText(description)}`,
    ...(mapsUrl ? [`URL:${mapsUrl}`] : []), "END:VEVENT", "END:VCALENDAR",
  ];
  const calendar = new Blob([lines.map(foldLine).join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
  const calendarUrl = URL.createObjectURL(calendar);
  byId("event-save").href = calendarUrl;
  byId("event-save").hidden = false;
  // La URL vive mientras la página esté abierta (permite descargar otra vez).
  window.addEventListener("pagehide", (navigation) => {
    if (!navigation.persisted) URL.revokeObjectURL(calendarUrl);
  });

  let lastMinutes = null;
  const updateCountdown = () => {
    const remaining = startMilliseconds - Date.now();
    byId("event-countdown").hidden = false;
    if (remaining <= 0) {
      byId("event-countdown-label").hidden = true;
      byId("event-countdown-values").hidden = true;
      const message = byId("event-today");
      message.hidden = false;
      if (!message.textContent) message.textContent = "¡Hoy celebramos!";
      return;
    }
    byId("event-countdown-label").hidden = false;
    byId("event-countdown-values").hidden = false;
    byId("event-today").hidden = true;
    // Redondear hacia arriba evita mostrar cero minutos antes del inicio real.
    const totalMinutes = Math.ceil(remaining / 60000);
    if (totalMinutes === lastMinutes) return;
    lastMinutes = totalMinutes;
    byId("event-days").textContent = pad(Math.floor(totalMinutes / 1440));
    byId("event-hours").textContent = pad(Math.floor(totalMinutes / 60) % 24);
    byId("event-minutes").textContent = pad(totalMinutes % 60);
  };
  updateCountdown();
  // Actualizar sin animaciones ni anuncios de lector de pantalla cada segundo.
  window.setInterval(() => { if (!document.hidden) updateCountdown(); }, 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) updateCountdown(); });
})();
