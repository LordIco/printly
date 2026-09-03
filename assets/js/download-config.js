window.PRINTLY_DOWNLOAD_CONFIG = {
  SUPABASE_URL: 'https://uiesczevcmkzdtybxuez.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_imVDY4_4fWx9oECG8-KSWg_Sw8ZtM8S',
  DOWNLOAD_URL: 'https://lordico.github.io/printly/downloads/Printly_Setup_v0.2.8.4.exe',
  BUY_URL: 'https://uiesczevcmkzdtybxuez.supabase.co/functions/v1/printly-buy'
};

window.addEventListener('DOMContentLoaded', function () {
  var buyUrl = window.PRINTLY_DOWNLOAD_CONFIG.BUY_URL + '?source=site';
  document.querySelectorAll('.plan-complete .btn-plan, .price-card .btn-buy').forEach(function (link) {
    link.href = buyUrl;
  });
});
