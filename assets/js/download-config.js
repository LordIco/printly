window.PRINTLY_DOWNLOAD_CONFIG = {
  SUPABASE_URL: 'https://uiesczevcmkzdtybxuez.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_imVDY4_4fWx9oECG8-KSWg_Sw8ZtM8S',
  DOWNLOAD_URL: 'https://uiesczevcmkzdtybxuez.supabase.co/functions/v1/printly-link?key=download_url&source=site',
  BUY_URL: 'https://uiesczevcmkzdtybxuez.supabase.co/functions/v1/printly-buy'
};

(function () {
  var pendingEmail = '';

  function formatPrice(raw, lang) {
    var normalized = String(raw || '').trim().replace(',', '.');
    if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
    var value = Number(normalized);
    if (!Number.isFinite(value)) return null;
    var parts = value.toFixed(2).split('.');
    var sep = lang.indexOf('en') === 0 ? '.' : ',';
    return { full: 'R$ ' + parts[0] + sep + parts[1], major: parts[0], minor: sep + parts[1], raw: parts.join('.') };
  }

  function applyPrice(price) {
    if (!price) return;
    document.querySelectorAll('[data-printly-price]').forEach(function (el) { el.textContent = price.full; });
    document.querySelectorAll('[data-printly-price-split]').forEach(function (el) {
      el.innerHTML = '<sup>R$</sup>' + price.major + '<em>' + price.minor + '</em>';
    });
    document.querySelectorAll('script[type="application/ld+json"]').forEach(function (node) {
      try {
        var data = JSON.parse(node.textContent);
        if (data && data['@type'] === 'SoftwareApplication' && data.name === 'Printly') {
          data.offers = { '@type': 'Offer', name: 'Printly — licença permanente', price: price.raw, priceCurrency: 'BRL', availability: 'https://schema.org/InStock' };
          node.textContent = JSON.stringify(data);
        }
      } catch (e) {}
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    var cfg = window.PRINTLY_DOWNLOAD_CONFIG;
    var lang = (document.documentElement.lang || 'pt-BR').toLowerCase();
    var source = lang.indexOf('en') === 0 ? 'site-en' : (lang.indexOf('es') === 0 ? 'site-es' : 'site');
    var buyUrl = cfg.BUY_URL + '?source=' + encodeURIComponent(source);

    document.querySelectorAll('[data-buy], .price-card .btn-buy').forEach(function (link) {
      link.href = buyUrl;
      link.target = '_blank';
      link.rel = 'noopener';
    });

    fetch(cfg.SUPABASE_URL + '/functions/v1/printly-public-config', { headers: { 'apikey': cfg.SUPABASE_PUBLISHABLE_KEY } })
      .then(function (res) { if (!res.ok) throw new Error('config'); return res.json(); })
      .then(function (data) { applyPrice(formatPrice(data && data.config && data.config.product_price_brl, lang)); })
      .catch(function () {});

    var form = document.getElementById('downloadForm');
    if (form) {
      form.addEventListener('submit', function () {
        pendingEmail = String(form.elements.email && form.elements.email.value || '').trim().toLowerCase();
      }, true);
    }
  });

  window.addEventListener('printly:download-lead', function () {
    var cfg = window.PRINTLY_DOWNLOAD_CONFIG;
    if (!pendingEmail || !cfg.SUPABASE_URL || !cfg.DOWNLOAD_URL) return;
    fetch(cfg.SUPABASE_URL + '/functions/v1/printly-download-track', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email: pendingEmail, source: 'printly-site', event_type: 'download_started', file_url: cfg.DOWNLOAD_URL })
    }).catch(function () {});
    pendingEmail = '';
  });
})();
