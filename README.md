# Mi historia, contigo · Mis 30

Portada editorial de cumpleaños en HTML, CSS y JavaScript, sin dependencias.
Se usa **Camila** según el inicio del encargo (los ejemplos mencionaban Valentina).
Solo la portada está personalizada. `#invitacion` es el álbum compartido de cinco etapas.

## Abrir

Abrir `index.html` directamente en el navegador, o ejecutar `node preview.mjs`
y entrar a `http://127.0.0.1:4173`.

- La sección `#invitacion` y lo que sigue a la portada están cerrados hasta pulsar
  “Descubre la invitación”, que los despliega y desplaza hasta ellos.
- `?invitado=julian`: Julián, fotografía y mensaje personalizados.
- `?invitado=ana`: Ana, fotografía y mensaje personalizados.
- `?invitado=sofia`: Sofía, fotografía y mensaje personalizados.
- Sin parámetro, vacío o desconocido: retrato individual y “Mi historia, contigo”.

## Editar y ampliar

- `guests.js`: nombre de la festejada, edad y objeto de invitados. Añadir hasta los
  aproximadamente 12 invitados con el mismo formato. Las claves son los valores de la URL.
- `assets/`: reemplazar las fotografías por imágenes propias autorizadas.
- `gallery-data.js`: arreglo compartido de cinco fotografías, frases y textos alternativos;
  no depende de la URL. Sustituir las fotos de `assets/galeria/` y sus dimensiones.
- `gallery.js`: scroll-snap, botones, contador, teclado y visor nativo con cierre y Escape.
- `people-data.js`: seis recuerdos ficticios con las personas invitadas. Cada objeto tiene
  `names` (arreglo de uno o varios nombres), `phrase`, `src`, `alt`, `width`, `height` y
  `source`. Añadir objetos para ampliar a unas doce entradas; no requiere cambiar el diseño.
- `people.js`: crea el álbum de invitados y su visor accesible. Los datos son compartidos
  para todas las URLs y no representan confirmaciones de asistencia.
- `event-data.js`: objeto compartido con los textos, fecha, hora local, zona IANA,
  duración, lugar, dirección, vestimenta y URL de Maps de la celebración.
- `event.js`: presenta esos datos, calcula la cuenta regresiva y prepara la descarga `.ics`.
- `styles.css`: paleta, tipografía, composición y animación.
- `app.js`: lectura de URL, inserción segura con `textContent`, errores de imagen y desplazamiento.
- `index.html`: portada, galería de etapas y álbum de invitados. Los detalles futuros
  se pueden añadir después de `#nos-vemos-aqui`, la cuarta sección con los detalles.

## Nos vemos aquí

Se muestra como una tarjeta de cristal esmerilado sobre el fondo animado, con filete
dorado, un reflejo de luz que la cruza y el día resaltado con un brillo dorado. Los
bloques aparecen uno tras otro al llegar a la sección.

Datos provisionales: **14 de noviembre de 2026, 19:00**, `America/Monterrey`, tres horas.
Jardín Magnolia, su dirección (Av. de las Magnolias 214, Col. Jardines de Durango) y el
enlace de “Cómo llegar” son inventados. Editar `event-data.js` con el lugar real; si
`mapsUrl` queda vacío, aparece “Ubicación próximamente” desactivado y sin enlace. Los datos de esta sección son iguales para todos.

“Guardar la fecha” descarga un calendario local, sin enviar invitaciones ni confirmar
asistencia. Se convierte la hora de `America/Monterrey` a un instante UTC mediante
`Intl.DateTimeFormat`: inicio `20261115T010000Z`, fin `20261115T040000Z`. El `.ics`
incluye la zona de origen en `X-WR-TIMEZONE`; el calendario del receptor puede mostrar
su equivalente en la zona local. Usa CRLF, escape de textos y plegado UTF-8 a 75 octetos
según [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545). Las reglas de la zona provienen
de la base IANA incluida en el navegador ([referencia](https://data.iana.org/time-zones/tzdb/northamerica)).

La cuenta regresiva apunta a la fecha **y hora de inicio** del objeto editable, incluso
si el visitante está en otra zona. Al alcanzar ese instante se sustituye por
“¡Hoy celebramos!”, sin valores negativos. Solo se actualiza el texto al cambiar los
minutos; el lector de pantalla anuncia el mensaje final, no cada actualización.

## Recuerdos con las personas invitadas

La tercera sección usa dos columnas en celular y tres desde 900 px. Las fotografías
conservan sus proporciones originales, como polaroids de cristal con inclinación leve,
cinta lila y esquinas doradas, sobre el fondo animado y con la paleta de la portada.
La tipografía manuscrita se reserva para dedicatorias. Las fotos "caen" sobre el álbum
una tras otra al entrar en pantalla y se enderezan al pasar el cursor; todo respeta
el movimiento reducido.
El visor muestra foto completa, nombres y dedicatoria; admite cierre visible, Escape,
foco modal y devolución del foco a la fotografía.

Las seis fotos en `assets/invitados/` son **PROVISIONALES**, con modelos distintos;
no son Valentina ni personas invitadas reales. Sustituir esos archivos y actualizar
sus textos alternativos y dimensiones en `people-data.js`. Los créditos de origen
están en el campo `source` de cada entrada. Los grupos usan varios nombres en `names`.

## Álbum compartido

“Cada etapa me trajo hasta aquí” usa la misma paleta y tipografía que la portada,
sobre el fondo animado. Cada foto va en un arco de cristal con filete dorado; la activa
queda al frente y las bandas de las fotos horizontales se rellenan con la misma foto
difuminada. Las tarjetas entran una tras otra al abrir la invitación y una barra dorada
marca el avance. En celular deja ver parte de la siguiente foto.
Se recorre con el dedo, botones o flechas del teclado (Inicio y Fin también funcionan).
El contador sigue el desplazamiento real. No hay reproducción automática.
Las imágenes tienen carga diferida y se muestran completas con `object-fit: contain`.
El visor admite Escape, el botón de cierre y tocar fuera del panel; bloquea el scroll
de fondo y devuelve el foco a la foto al cerrarse. Respeta movimiento reducido.
Las cinco fotografías son **PROVISIONALES** de personas distintas, para ilustrar
etapas de la vida; no son fotos reales de Valentina. Los enlaces de origen están
en el campo `source` de `gallery-data.js`.

Las fotos se muestran completas con `object-fit: contain` para preservar los rostros;
las proporciones diferentes dejan bandas del mismo color que el marco. Si una foto
falla, aparece una composición editorial con el número 30. Los textos siguen visibles
sin JavaScript. Las fuentes (Cormorant Garamond, Jost y Pinyon Script, licencia SIL OFL)
están en `assets/fonts/`; no hay recursos externos en tiempo de ejecución.

## Confirmación individual (quinta sección)

Se presenta como una tarjeta de cristal con una tarjeta de lugar, como las de una mesa,
donde el nombre del invitado se escribe a mano en dorado. Solo hay dos respuestas
(“Sí, ahí estaré” / “Esta vez no podré”) y un mensaje opcional. La opción elegida se
vuelve ciruela con filete dorado y dibuja una palomita; al decir que sí salen destellos.

`rsvp-data.js` contiene la fecha límite provisional (`deadline`, AAAA-MM-DD),
`hostName` (vacío = el nombre de la portada, Camila), `phone` (`526182051723`,
con código de país, solo dígitos) y `previewGuest`: el invitado que se muestra cuando
el enlace no trae `?invitado=` (por ahora `ana`).

La portada y el formulario comparten `getInvitationGuest()` de `guests.js`:
`?invitado=julian`, `ana` o `sofia` ponen ese nombre en la tarjeta y en el mensaje.
No se pide el nombre. Los radios nativos permiten Tab, flechas y Espacio, y los
datos se insertan como texto, sin interpretar HTML.

`rsvp.js` prepara la aceptación o la declinación, omite el mensaje opcional vacío
y codifica el enlace con `encodeURIComponent`. Solo abre WhatsApp al pulsar el botón
con datos válidos y un teléfono configurado; conserva un enlace manual si se bloquea
la nueva pestaña. No envía automáticamente, no guarda datos ni marca asistencia
confirmada. El usuario debe enviar el mensaje en WhatsApp. La copia tiene alternativa
para navegadores sin portapapeles moderno y permite seleccionar/copiar manualmente.
Al editar una respuesta se oculta el mensaje preparado anterior para evitar confusiones.

## Despedida y pie de página

`#despedida` aparece después de la confirmación. En `farewell-data.js` se editan
la firma (Valentina según este encargo), la ruta de la foto y su texto alternativo.
El retrato `assets/camila.jpg` se reutiliza como **PROVISIONAL**; no representa a
Valentina. Puede reemplazarse por una foto autorizada. Si falla, el óvalo muestra
un monograma. Los textos de despedida y el crédito se editan en `index.html`.

`farewell.js` usa `getInvitationGuest()` e inserta el nombre con `textContent`.
Los enlaces válidos de Julián, Ana y Sofía coinciden con portada y confirmación.
Sin invitado válido, el cierre es genérico; se conserva la configuración existente
de ejemplo de la confirmación (`rsvpConfig.previewGuest`).
El pie enlaza a Rotf Studio. “Volver al inicio” desplaza la página y devuelve el foco
al título de la portada sin cerrar la invitación ni borrar el formulario.
La entrada y el desplazamiento respetan movimiento reducido.

Diseño: sin fondo propio, sobre las ondas animadas. Separador champaña con rombo, retrato
ovalado con filete dorado y un halo lila que gira despacio, firma manuscrita con brillo
dorado que se escribe sola y la línea personal en una pieza de cristal con un corazón
que late. El pie es una franja de cristal con línea champaña.

## Iconos

Todos los iconos son de [Lucide](https://lucide.dev) (licencia ISC, en `assets/iconos/LICENSE`).
Los archivos descargados están en `assets/iconos/`. Se usan como SVG dentro de la página
(no como emoji ni símbolos de la fuente), así se ven igual en cualquier sistema y también
al abrir `index.html` sin servidor. El corazón de los adornos está en `--icon-heart`
de `styles.css`, y el de ampliar foto en `gallery.js`.

## Diseño

- Fondo: `assets/fondo-lavanda.jpg` es la imagen original. `onda-superior.webp`,
  `onda-superior-derecha.webp` y
  `onda-inferior.webp` son sus ondas recortadas, para que las ondas y el arco dorado
  se vean en cualquier pantalla sobre el lavanda base `#F4EEFB`.
- Paleta: lavanda `#F4EEFB`, lila `#E6DAF4`/`#D6C4EB`, ciruela `#6E4E83`/`#4E3561`
  y oro champán `#C9AA80`.
- Animación: las ondas entran desde las esquinas, se mecen y reaccionan al scroll y al cursor;
  un destello recorre las líneas doradas (`assets/oro-*.webp` son sus máscaras); el arco dorado se dibuja,
  la foto aparece de abajo hacia arriba, el título entra palabra por palabra y hay
  destellos dorados. Todo se reduce si el dispositivo pide menos movimiento.
La personalización por URL es visual, no un mecanismo de acceso privado.

## Fotografías PROVISIONALES

Personas de muestra; no representan a la festejada ni a los invitados reales.

- `camila.jpg`: [retrato individual de muestra](https://images.unsplash.com/photo-1544005313-94ddf0286df2).
- `julian.jpg`: [Brooke Cagle — mujer y hombre](https://unsplash.com/photos/a-man-and-a-woman-posing-for-a-picture-QjO6ZTV2EoQ).
- `ana.jpg`: [Bran Sodre — dos amigas](https://unsplash.com/photos/two-smiling-woman-standing-near-white-wall-JBHfVpoK_oI).
- `sofia.jpg`: [Omar Lopez — dos amigas](https://unsplash.com/photos/2-smiling-women-wearing-brown-knit-tops-SwDgZX29BZI).
