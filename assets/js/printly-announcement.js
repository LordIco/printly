/* Printly: rotating educational guide announcement.
   One message per page load, language-aware, dismissible for 24 hours. */
(() => {
  const bar = document.querySelector(".printly-announcement");
  if (!bar) return;
  const locale = bar.dataset.locale || "pt";
  const sets = {
    pt: [
      "Você sabe quanto realmente lucra em cada impressão?",
      "7 erros que podem estar reduzindo seu lucro na impressão 3D",
      "Está cobrando certo pelas suas peças?",
      "Guia gratuito: aprenda a precificar melhor e proteger sua margem"
    ],
    en: [
      "Do you know how much you really earn on each 3D print?",
      "7 mistakes that may be eating into your 3D printing profits",
      "Are you charging the right price for your prints?",
      "Free guide: price smarter and protect your profit margin"
    ],
    es: [
      "¿Sabes cuánto ganas realmente con cada impresión 3D?",
      "7 errores que pueden estar reduciendo tus ganancias en impresión 3D",
      "¿Estás cobrando bien por tus piezas?",
      "Guía gratuita: calcula mejor tus precios y protege tu margen"
    ]
  };
  const phrases = sets[locale] || sets.pt;
  const storageKey = "printly-ebook-announcement-dismissed-until-v2";
  const lastKey = "printly-ebook-announcement-last-" + locale;
  let dismissedUntil = 0;
  try { dismissedUntil = Number(localStorage.getItem(storageKey) || 0); } catch {}
  if (dismissedUntil > Date.now()) { bar.remove(); return; }
  if (dismissedUntil) { try { localStorage.removeItem(storageKey); } catch {} }
  let previous = -1;
  try { previous = Number(sessionStorage.getItem(lastKey) ?? -1); } catch {}
  // Avoid showing the exact same phrase on consecutive page loads.
  const choices = phrases.map((_, i) => i).filter(i => i !== previous);
  const chosen = choices[Math.floor(Math.random() * choices.length)];
  const message = bar.querySelector(".printly-announcement-message");
  if (message) message.textContent = phrases[chosen];
  try { sessionStorage.setItem(lastKey, String(chosen)); } catch {}
  const close = bar.querySelector(".printly-announcement-close");
  if (close) close.addEventListener("click", () => {
    try { localStorage.setItem(storageKey, String(Date.now() + 86400000)); } catch {}
    bar.remove();
  });
})();
