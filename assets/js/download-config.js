window.PRINTLY_DOWNLOAD_CONFIG = {
  SUPABASE_URL: 'https://uiesczevcmkzdtybxuez.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_imVDY4_4fWx9oECG8-KSWg_Sw8ZtM8S',
  DOWNLOAD_URL: 'https://uiesczevcmkzdtybxuez.supabase.co/functions/v1/printly-link?key=download_url&source=site',
  BUY_URL: 'https://uiesczevcmkzdtybxuez.supabase.co/functions/v1/printly-buy'
};

(function () {
  var pendingEmail = '';

  function copyFor(lang) {
    if (lang.indexOf('en') === 0) {
      return {
        navPlan: '15-day trial',
        navDownload: 'Free 15-day trial',
        heroDownload: 'Try Printly free for 15 days',
        kicker: 'FULL ACCESS FOR 15 DAYS',
        title: 'Use the full Printly for 15 days. <span>Then decide.</span>',
        intro: 'No limited Free edition: all features are available during the trial so you can evaluate Printly in your real workflow.',
        badge: '15-DAY FULL TRIAL',
        product: 'PRINTLY',
        price: 'R$ 67,90',
        priceNote: 'one-time payment after the trial',
        items: ['Pricing and professional quotes','Customers, products and materials','Custom projects','Production and inventory','Advanced STL and 3MF import','Backup, restore, reports and BI'],
        trialBtn: 'Download and try for 15 days',
        buyBtn: 'Buy permanent license',
        planNote: 'All features unlocked during the trial. Permanent license for 1 Windows computer.',
        faqQ: 'How does the 15-day trial work?',
        faqA: 'You can use Printly with all features unlocked for 15 days. There is no limited Free edition. After the trial, you can continue with a permanent license for R$ 67,90.',
        priceKicker: 'AFTER YOUR 15-DAY TRIAL',
        priceProduct: 'PRINTLY',
        priceDescription: 'Permanent license for the purchased software, with no monthly fee.',
        trialCard: 'Try Printly free for 15 days',
        trialCardSmall: 'Full trial for Windows',
        modalKicker: 'FULL 15-DAY TRIAL · WINDOWS',
        modalTitle: 'Where should we release your download?',
        modalText: 'Fill in the details below to release the download and receive important installation and update information.'
      };
    }
    if (lang.indexOf('es') === 0) {
      return {
        navPlan: 'Prueba de 15 días',
        navDownload: 'Prueba gratis 15 días',
        heroDownload: 'Probar Printly gratis por 15 días',
        kicker: 'ACCESO COMPLETO DURANTE 15 DÍAS',
        title: 'Usa Printly completo durante 15 días. <span>Después decides.</span>',
        intro: 'Sin edición Free limitada: todas las funciones quedan disponibles durante la prueba para que evalúes Printly en tu operación real.',
        badge: 'PRUEBA COMPLETA · 15 DÍAS',
        product: 'PRINTLY',
        price: 'R$ 67,90',
        priceNote: 'pago único después de la prueba',
        items: ['Precios y presupuestos profesionales','Clientes, productos y materiales','Proyectos por encargo','Producción e inventario','Importación avanzada STL y 3MF','Backup, restauración, informes y BI'],
        trialBtn: 'Descargar y probar 15 días',
        buyBtn: 'Comprar licencia permanente',
        planNote: 'Todos los recursos liberados durante la prueba. Licencia permanente para 1 computadora Windows.',
        faqQ: '¿Cómo funciona la prueba de 15 días?',
        faqA: 'Puedes usar Printly con todas las funciones liberadas durante 15 días. Ya no existe una edición Free limitada. Después de la prueba, puedes continuar con una licencia permanente por R$ 67,90.',
        priceKicker: 'DESPUÉS DE PROBARLO 15 DÍAS',
        priceProduct: 'PRINTLY',
        priceDescription: 'Licencia permanente para el software adquirido, sin mensualidad.',
        trialCard: 'Probar Printly gratis durante 15 días',
        trialCardSmall: 'Prueba completa para Windows',
        modalKicker: 'PRUEBA COMPLETA 15 DÍAS · WINDOWS',
        modalTitle: '¿Dónde liberamos tu descarga?',
        modalText: 'Completa los datos para liberar la descarga y recibir información importante sobre instalación y actualizaciones.'
      };
    }
    return {
      navPlan: 'Teste de 15 dias',
      navDownload: 'Teste grátis 15 dias',
      heroDownload: 'Testar Printly grátis por 15 dias',
      kicker: 'ACESSO COMPLETO POR 15 DIAS',
      title: 'Use o Printly completo por 15 dias. <span>Depois você decide.</span>',
      intro: 'Sem versão Free limitada: todos os recursos ficam liberados durante o teste para você avaliar o Printly na rotina real da sua operação.',
      badge: 'TESTE COMPLETO · 15 DIAS',
      product: 'PRINTLY',
      price: 'R$ 67,90',
      priceNote: 'pagamento único após o teste',
      items: ['Precificação e orçamentos profissionais','Clientes, produtos e materiais','Projetos sob encomenda','Produção e estoque','Importação avançada STL e 3MF','Backup, restauração, relatórios e BI'],
      trialBtn: 'Baixar e testar por 15 dias',
      buyBtn: 'Comprar licença permanente',
      planNote: 'Todos os recursos liberados durante o teste. Licença permanente para 1 computador Windows.',
      faqQ: 'Como funciona o teste de 15 dias?',
      faqA: 'Você pode usar o Printly com todos os recursos liberados por 15 dias. Não existe mais uma versão Free limitada. Depois do teste, pode continuar com uma licença permanente por R$ 67,90.',
      priceKicker: 'DEPOIS DE TESTAR POR 15 DIAS',
      priceProduct: 'PRINTLY',
      priceDescription: 'Licença permanente para continuar usando o software adquirido, sem mensalidade.',
      trialCard: 'Testar Printly grátis por 15 dias',
      trialCardSmall: 'Teste completo para Windows',
      modalKicker: 'TESTE COMPLETO POR 15 DIAS · WINDOWS',
      modalTitle: 'Para onde liberamos seu download?',
      modalText: 'Preencha os dados abaixo para liberar o download e receber informações importantes sobre instalação e atualizações.'
    };
  }

  function migrateCommercialCopy(lang, buyUrl) {
    var c = copyFor(lang);

    document.querySelectorAll('a[href="#planos"]').forEach(function (el) { el.textContent = c.navPlan; });
    document.querySelectorAll('[data-open-download]').forEach(function (el) {
      var txt = (el.textContent || '').toLowerCase();
      if (txt.indexOf('free') >= 0 || txt.indexOf('grat') >= 0 || txt.indexOf('download') >= 0 || txt.indexOf('baixar') >= 0 || txt.indexOf('probar') >= 0 || txt.indexOf('try') >= 0) {
        el.innerHTML = '<span aria-hidden="true">↓</span> ' + (el.classList.contains('btn-xl') ? c.heroDownload : c.navDownload);
      }
    });

    var plans = document.querySelector('#planos');
    if (plans) {
      var heading = plans.querySelector('.section-heading');
      if (heading) {
        var kicker = heading.querySelector('.section-kicker');
        var h2 = heading.querySelector('h2');
        var p = heading.querySelector('p');
        if (kicker) kicker.textContent = c.kicker;
        if (h2) h2.innerHTML = c.title;
        if (p) p.textContent = c.intro;
      }
      var grid = plans.querySelector('.plans-grid');
      if (grid) {
        grid.style.gridTemplateColumns = 'minmax(0, 860px)';
        grid.style.justifyContent = 'center';
        grid.innerHTML = '<article class="plan-card plan-complete" style="width:100%;max-width:860px;margin:0 auto;opacity:1;transform:none">' +
          '<div class="plan-badge">' + c.badge + '</div>' +
          '<div class="plan-head"><span>' + c.product + '</span><strong>' + c.price + '</strong><small>' + c.priceNote + '</small></div>' +
          '<ul>' + c.items.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul>' +
          '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:20px">' +
          '<button class="btn btn-primary btn-plan" style="flex:1;min-width:240px" type="button" data-open-download>' + c.trialBtn + '</button>' +
          '<a class="btn btn-ghost btn-plan plan-buy" style="flex:1;min-width:240px" target="_blank" rel="noopener" href="' + buyUrl + '">' + c.buyBtn + '</a>' +
          '</div><small class="plan-note">' + c.planNote + '</small></article>';
      }
    }

    var faq = document.querySelector('.faq-grid');
    if (faq) {
      var details = faq.querySelectorAll('details');
      if (details.length) {
        var summary = details[0].querySelector('summary');
        var para = details[0].querySelector('p');
        if (summary) summary.textContent = c.faqQ;
        if (para) para.textContent = c.faqA;
      }
      details.forEach(function (d) {
        var p = d.querySelector('p');
        if (!p) return;
        p.textContent = p.textContent
          .replace(/versão gratuita/gi, 'teste de 15 dias')
          .replace(/free version/gi, '15-day trial')
          .replace(/versión gratuita/gi, 'prueba de 15 días');
      });
    }

    var price = document.querySelector('.price-section');
    if (price) {
      var pk = price.querySelector('.section-kicker');
      if (pk) pk.textContent = c.priceKicker;
      var product = price.querySelector('.price-card-top span');
      if (product) product.textContent = c.priceProduct;
      var strong = price.querySelector('.price-value strong');
      if (strong) strong.innerHTML = '<sup>R$</sup>67<em>,90</em>';
      var desc = price.querySelector('.price-description');
      if (desc) desc.textContent = c.priceDescription;
      var trial = price.querySelector('.btn-free-card');
      if (trial) trial.innerHTML = '<span aria-hidden="true">↓</span><span><b>' + c.trialCard + '</b><small>' + c.trialCardSmall + '</small></span>';
    }

    var modal = document.querySelector('#downloadModal');
    if (modal) {
      var mk = modal.querySelector('.section-kicker');
      var mt = modal.querySelector('#downloadTitle');
      var mp = modal.querySelector('.download-dialog > p');
      if (mk) mk.textContent = c.modalKicker;
      if (mt) mt.textContent = c.modalTitle;
      if (mp) mp.textContent = c.modalText;
    }

    document.querySelectorAll('.price-card .btn-buy, .plan-buy').forEach(function (link) {
      link.href = buyUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      var detail = link.querySelector('b');
      if (detail) detail.textContent = lang.indexOf('en') === 0 ? 'Secure checkout' : 'Checkout seguro';
    });

    document.querySelectorAll('script[type="application/ld+json"]').forEach(function (node) {
      try {
        var data = JSON.parse(node.textContent);
        if (data && data['@type'] === 'SoftwareApplication' && data.name === 'Printly') {
          data.offers = [{
            '@type': 'Offer',
            name: 'Printly',
            price: '67.90',
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock'
          }];
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

    migrateCommercialCopy(lang, buyUrl);

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