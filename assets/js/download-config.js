window.PRINTLY_DOWNLOAD_CONFIG = {
  SUPABASE_URL: 'https://uiesczevcmkzdtybxuez.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_imVDY4_4fWx9oECG8-KSWg_Sw8ZtM8S',
  DOWNLOAD_URL: 'https://uiesczevcmkzdtybxuez.supabase.co/functions/v1/printly-link?key=download_url&source=site',
  BUY_URL: 'https://uiesczevcmkzdtybxuez.supabase.co/functions/v1/printly-buy'
};

(function () {
  var pendingEmail = '';

  window.addEventListener('DOMContentLoaded', function () {
    var cfg = window.PRINTLY_DOWNLOAD_CONFIG;
    var lang = (document.documentElement.lang || 'pt-BR').toLowerCase();
    var source = lang.indexOf('en') === 0 ? 'site-en' : (lang.indexOf('es') === 0 ? 'site-es' : 'site');
    var buyUrl = cfg.BUY_URL + '?source=' + encodeURIComponent(source);
    document.querySelectorAll('.plan-complete .btn-plan, .price-card .btn-buy').forEach(function (link) {
      link.href = buyUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      var detail = link.querySelector('b');
      if (detail) detail.textContent = lang.indexOf('en') === 0 ? 'Secure checkout' : 'Checkout seguro';
    });

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
      body: JSON.stringify({
        email: pendingEmail,
        source: 'printly-site',
        event_type: 'download_started',
        file_url: cfg.DOWNLOAD_URL
      })
    }).catch(function () {});
    pendingEmail = '';
  });
})();
