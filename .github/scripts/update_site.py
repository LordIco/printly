from pathlib import Path
import re


def replace_section(text, start_tag, new_section):
    start = text.find(start_tag)
    if start < 0:
        raise SystemExit(f'section not found: {start_tag}')
    end = text.find('</section>', start)
    if end < 0:
        raise SystemExit(f'section end not found: {start_tag}')
    end += len('</section>')
    return text[:start] + new_section + text[end:]


# PT-BR
p = Path('index.html')
t = p.read_text(encoding='utf-8')
t = t.replace('assets/css/styles.css?v=20260821-5', 'assets/css/styles.css?v=20260909-2')
t = t.replace('download-config.js?v=20260821-4', 'download-config.js?v=20260909-2')
t = t.replace('Free x Completo', 'Teste e licença')
t = t.replace('Baixar Printly Free', 'Testar Printly por 15 dias')
t = t.replace('Download gratuito', 'Teste grátis por 15 dias')
t = t.replace('PRINTLY FREE PARA WINDOWS', 'PRINTLY PARA WINDOWS · TESTE COMPLETO POR 15 DIAS')
t = t.replace('Preencha os dados abaixo para liberar o download gratuito e receber informações importantes sobre instalação e atualizações.', 'Preencha os dados abaixo para liberar o download do Printly e iniciar seu teste completo de 15 dias. Também podemos enviar informações importantes sobre instalação e atualizações.')
t = t.replace('entender o interesse na versão gratuita', 'entender o interesse no Printly e no período de avaliação')
t = re.sub(r'    "offers": \[\s*\{.*?Printly Free.*?\},\s*\{.*?Printly Completo.*?\}\s*\]', '    "offers": {\n      "@type": "Offer",\n      "name": "Printly — licença permanente",\n      "price": "67.90",\n      "priceCurrency": "BRL",\n      "availability": "https://schema.org/InStock"\n    }', t, count=1, flags=re.S)

pt_plans = '''    <section class="plans-section section" id="planos">
      <div class="container">
        <div class="section-heading centered reveal">
          <span class="section-kicker">TESTE ANTES DE DECIDIR</span>
          <h2>Use todos os recursos por 15 dias. <span>Depois, decida se o Printly faz sentido para sua operação.</span></h2>
          <p>Durante o período de avaliação, todos os recursos ficam liberados. Ao final, seus dados continuam salvos e você pode seguir com uma licença permanente por <strong data-printly-price>R$ 67,90</strong>.</p>
        </div>
        <div class="plans-grid single-plan">
          <article class="plan-card plan-complete reveal">
            <span class="plan-badge">15 DIAS · TODOS OS RECURSOS</span>
            <div class="plan-head"><h3>PRINTLY</h3><div class="plan-price"><span data-printly-price>R$ 67,90</span><small>licença permanente após o teste</small></div></div>
            <ul>
              <li>Precificação e orçamentos profissionais</li>
              <li>Clientes, produtos, materiais e estoque</li>
              <li>Projetos sob encomenda</li>
              <li>Produção, alertas, relatórios e BI</li>
              <li>Importação avançada STL e 3MF</li>
              <li>Backup, restauração e atualizações</li>
            </ul>
            <div class="plan-actions">
              <button class="btn btn-primary" type="button" data-open-download>Testar Printly por 15 dias</button>
              <a class="btn btn-ghost" data-buy target="_blank" rel="noopener" href="https://wa.me/5519988134895">Adquirir licença permanente</a>
            </div>
            <small class="plan-note">Sem mensalidade. Licença permanente para 1 computador Windows.</small>
          </article>
        </div>
        <div class="supply-callout reveal">
          <div><span class="section-kicker">PRINTLY SUPRIMENTOS</span><h3>Materiais, peças e ferramentas para sua próxima impressão.</h3><p>Explore nossa seleção de suprimentos e ofertas de lojas parceiras, organizada para quem trabalha com impressão 3D.</p></div>
          <a class="btn btn-primary" href="https://lordico.github.io/suplyprintly/" target="_blank" rel="noopener">Abrir loja de suprimentos ↗</a>
        </div>
      </div>
    </section>'''
t = replace_section(t, '    <section class="plans-section section" id="planos">', pt_plans)
t = re.sub(r'<details><summary>Existe uma versão gratuita\?</summary><p>.*?</p></details>', '<details><summary>Como funciona o teste de 15 dias?</summary><p>Você pode usar o Printly com todos os recursos liberados por 15 dias. Ao final, seus dados permanecem salvos; para continuar editando, basta ativar uma licença permanente.</p></details>', t, count=1, flags=re.S)

pt_price = '''    <section class="price-section section" id="adquirir">
      <div class="container price-layout">
        <div class="price-copy reveal">
          <span class="section-kicker">LICENÇA PERMANENTE</span>
          <h2>Teste primeiro. <span>Compre apenas se fizer sentido para sua operação.</span></h2>
          <p>Você tem 15 dias para usar os recursos do Printly na prática. Depois, pode continuar com uma licença permanente, sem mensalidade.</p>
          <div class="final-benefits">
            <div><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>15 dias com todos os recursos liberados</span></div>
            <div><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Licença permanente para 1 computador Windows</span></div>
            <div><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Sem mensalidade</span></div>
            <div><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Atualizações do produto adquirido</span></div>
          </div>
        </div>
        <div class="price-card reveal">
          <div class="price-card-top"><img src="assets/img/favicon.png" width="256" height="256" alt="Ícone Printly"><div><span>PRINTLY</span><small>3D Printing Management</small></div></div>
          <div class="price-value"><small>pagamento único</small><strong data-printly-price-split><sup>R$</sup>67<em>,90</em></strong><span>licença permanente</span></div>
          <p class="price-description">Sem mensalidade para continuar usando o software adquirido.</p>
          <a class="btn btn-primary btn-buy" data-buy target="_blank" rel="noopener" href="https://wa.me/5519988134895"><span>Quero adquirir o Printly</span><b>Continuar para compra</b></a>
          <button class="btn btn-free-card" type="button" data-open-download><span aria-hidden="true">↓</span><span><b>Testar Printly por 15 dias</b><small>Todos os recursos liberados no Windows</small></span></button>
          <a class="email-link" href="mailto:icolabsbr@gmail.com?subject=Quero%20adquirir%20o%20Printly">Prefere e-mail? icolabsbr@gmail.com</a>
        </div>
      </div>
    </section>'''
t = replace_section(t, '    <section class="price-section section" id="adquirir">', pt_price)
p.write_text(t, encoding='utf-8')

# EN
p = Path('en/index.html')
t = p.read_text(encoding='utf-8')
t = t.replace('../assets/css/styles.css?v=20260821-5', '../assets/css/styles.css?v=20260909-2')
t = t.replace('../assets/js/download-config.js?v=20260821-4', '../assets/js/download-config.js?v=20260909-2')
t = t.replace('Free vs Complete', 'Trial & license')
t = t.replace('Download Printly Free', 'Try Printly for 15 days')
t = t.replace('Free download', '15-day trial')
t = t.replace('PRINTLY FREE FOR WINDOWS', 'PRINTLY · FULL 15-DAY TRIAL')
t = t.replace('Enter your details to access the free download and receive important installation and update information.', 'Enter your details to download Printly and start the full 15-day trial. We may also send important installation and update information.')
t = t.replace('release the free download', 'release the Printly download and start the 15-day trial')
en_plans = '''    <section class="plans-section section" id="plans"><div class="container"><div class="section-heading centered reveal"><span class="section-kicker">TRY BEFORE YOU DECIDE</span><h2>Use every Printly feature for 15 days. <span>Then decide if it fits your operation.</span></h2><p>All features are available during the trial. When it ends, your data remains saved and you can continue with a permanent license for <strong data-printly-price>R$ 67.90</strong>.</p></div><div class="plans-grid single-plan"><article class="plan-card plan-complete reveal"><span class="plan-badge">15 DAYS · ALL FEATURES</span><div class="plan-head"><h3>PRINTLY</h3><div class="plan-price"><span data-printly-price>R$ 67.90</span><small>permanent license after the trial</small></div></div><ul><li>Pricing and professional quotes</li><li>Customers, products, materials and inventory</li><li>Custom projects</li><li>Production, alerts, reports and BI</li><li>Advanced STL and 3MF import</li><li>Backup, restore and updates</li></ul><div class="plan-actions"><button class="btn btn-primary" type="button" data-open-download>Try Printly for 15 days</button><a class="btn btn-ghost" data-buy target="_blank" rel="noopener" href="https://wa.me/5519988134895">Buy permanent license</a></div><small class="plan-note">No subscription. Permanent license for 1 Windows computer.</small></article></div></div></section>'''
t = replace_section(t, '    <section class="plans-section section" id="plans">', en_plans)
t = re.sub(r'<details><summary>Is there a free version\?</summary><p>.*?</p></details>', '<details><summary>How does the 15-day trial work?</summary><p>You can use Printly with every feature unlocked for 15 days. Your data remains saved when the trial ends; to keep editing, activate a permanent license.</p></details>', t, count=1, flags=re.S)
en_price = '''    <section class="price-section"><div class="container price-layout"><div class="price-copy"><span class="section-kicker">PERMANENT LICENSE</span><h2>Try it first. <span>Buy only if it fits your operation.</span></h2><p>You have 15 days to use Printly in your real workflow. Then you can continue with a permanent license and no subscription.</p></div><div class="price-card"><div class="price-card-top"><img src="../assets/img/favicon.png" width="256" height="256" alt="Printly icon"><div><span>PRINTLY</span><small>3D Printing Management</small></div></div><div class="price-value"><small>one-time payment</small><strong data-printly-price-split><sup>R$</sup>67<em>.90</em></strong><span>permanent license</span></div><p class="price-description">No subscription required to keep using the purchased software.</p><a class="btn btn-primary btn-buy" data-buy target="_blank" rel="noopener" href="https://wa.me/5519988134895"><span>Purchase Printly</span><b>Continue to purchase</b></a><button class="btn btn-free-card" type="button" data-open-download><span>↓</span><span><b>Try Printly for 15 days</b><small>All features unlocked on Windows</small></span></button></div></div></section>'''
t = replace_section(t, '    <section class="price-section">', en_price)
p.write_text(t, encoding='utf-8')

# ES
p = Path('es/index.html')
t = p.read_text(encoding='utf-8')
t = t.replace('../assets/css/styles.css?v=20260821-5', '../assets/css/styles.css?v=20260909-2')
t = t.replace('../assets/js/download-config.js?v=20260821-4', '../assets/js/download-config.js?v=20260909-2')
t = t.replace('Free vs Completo', 'Prueba y licencia')
t = t.replace('Descargar Printly Free', 'Probar Printly 15 días')
t = t.replace('Descarga gratuita', 'Prueba de 15 días')
t = t.replace('PRINTLY FREE PARA WINDOWS', 'PRINTLY · PRUEBA COMPLETA 15 DÍAS')
t = t.replace('Introduce tus datos para acceder a la descarga gratuita y recibir información importante de instalación y actualizaciones.', 'Introduce tus datos para descargar Printly e iniciar la prueba completa de 15 días. También podemos enviarte información importante de instalación y actualizaciones.')
t = t.replace('liberar la descarga gratuita', 'liberar la descarga de Printly e iniciar la prueba de 15 días')
es_plans = '''    <section class="plans-section section" id="planes"><div class="container"><div class="section-heading centered reveal"><span class="section-kicker">PRUEBA ANTES DE DECIDIR</span><h2>Usa todos los recursos de Printly durante 15 días. <span>Después decide si encaja en tu operación.</span></h2><p>Durante la prueba, todas las funciones están disponibles. Al terminar, tus datos permanecen guardados y puedes continuar con una licencia permanente por <strong data-printly-price>R$ 67,90</strong>.</p></div><div class="plans-grid single-plan"><article class="plan-card plan-complete reveal"><span class="plan-badge">15 DÍAS · TODOS LOS RECURSOS</span><div class="plan-head"><h3>PRINTLY</h3><div class="plan-price"><span data-printly-price>R$ 67,90</span><small>licencia permanente después de la prueba</small></div></div><ul><li>Precios y presupuestos profesionales</li><li>Clientes, productos, materiales e inventario</li><li>Proyectos por encargo</li><li>Producción, alertas, informes y BI</li><li>Importación avanzada STL y 3MF</li><li>Backup, restauración y actualizaciones</li></ul><div class="plan-actions"><button class="btn btn-primary" type="button" data-open-download>Probar Printly 15 días</button><a class="btn btn-ghost" data-buy target="_blank" rel="noopener" href="https://wa.me/5519988134895">Comprar licencia permanente</a></div><small class="plan-note">Sin mensualidad. Licencia permanente para 1 computadora Windows.</small></article></div></div></section>'''
t = replace_section(t, '    <section class="plans-section section" id="planes">', es_plans)
t = re.sub(r'<details><summary>¿Existe una versión gratuita\?</summary><p>.*?</p></details>', '<details><summary>¿Cómo funciona la prueba de 15 días?</summary><p>Puedes usar Printly con todas las funciones liberadas durante 15 días. Tus datos permanecen guardados al terminar; para seguir editando, activa una licencia permanente.</p></details>', t, count=1, flags=re.S)
es_price = '''    <section class="price-section"><div class="container price-layout"><div class="price-copy"><span class="section-kicker">LICENCIA PERMANENTE</span><h2>Pruébalo primero. <span>Compra solo si encaja en tu operación.</span></h2><p>Tienes 15 días para usar Printly en tu rutina real. Después puedes continuar con una licencia permanente, sin mensualidad.</p></div><div class="price-card"><div class="price-card-top"><img src="../assets/img/favicon.png" width="256" height="256" alt="Icono Printly"><div><span>PRINTLY</span><small>3D Printing Management</small></div></div><div class="price-value"><small>pago único</small><strong data-printly-price-split><sup>R$</sup>67<em>,90</em></strong><span>licencia permanente</span></div><p class="price-description">Sin mensualidad para seguir usando el software adquirido.</p><a class="btn btn-primary btn-buy" data-buy target="_blank" rel="noopener" href="https://wa.me/5519988134895"><span>Comprar Printly</span><b>Continuar a la compra</b></a><button class="btn btn-free-card" type="button" data-open-download><span>↓</span><span><b>Probar Printly 15 días</b><small>Todos los recursos liberados en Windows</small></span></button></div></div></section>'''
t = replace_section(t, '    <section class="price-section">', es_price)
p.write_text(t, encoding='utf-8')

# Legal + access
p = Path('termos.html')
t = p.read_text(encoding='utf-8')
t = t.replace('assets/css/styles.css?v=20260821-3', 'assets/css/styles.css?v=20260909-2')
t = t.replace('Última atualização: 21 de agosto de 2026.', 'Última atualização: 9 de setembro de 2026.')
t = t.replace('O Printly é um software de gestão para negócios de impressão 3D, desenvolvido pela IcoLabs. O site apresenta uma versão gratuita com limites operacionais e uma versão Completa com recursos ampliados.', 'O Printly é um software de gestão para negócios de impressão 3D, desenvolvido pela IcoLabs. O site disponibiliza o aplicativo para um período de avaliação de 15 dias, com os recursos liberados para teste.')
t = t.replace('<h2>2. Versão gratuita e versão Completa</h2>\n      <p>A versão gratuita pode ser disponibilizada após cadastro e destina-se à avaliação e ao uso dentro dos limites exibidos no site. Recursos, requisitos e limites podem evoluir. A contratação da versão Completa é realizada pelos canais comerciais informados e segue as condições apresentadas no momento da compra.</p>', '<h2>2. Avaliação de 15 dias e licença permanente</h2>\n      <p>O período de avaliação é destinado ao teste do Printly por 15 dias. Após esse período, os dados permanecem preservados, mas a continuidade das funções de edição depende da ativação de uma licença válida. A licença comercial é permanente para o computador ativado, conforme as condições apresentadas no momento da compra. Reinstalar o aplicativo no mesmo equipamento não cria um novo período de avaliação.</p>')
p.write_text(t, encoding='utf-8')

p = Path('privacidade.html')
t = p.read_text(encoding='utf-8')
t = t.replace('assets/css/styles.css?v=20260821-3', 'assets/css/styles.css?v=20260909-2')
t = t.replace('Última atualização: 21 de agosto de 2026.', 'Última atualização: 9 de setembro de 2026.')
t = t.replace('Liberar ou enviar o acesso à versão gratuita do Printly.', 'Liberar o download do Printly e viabilizar o período de avaliação de 15 dias.')
p.write_text(t, encoding='utf-8')

p = Path('acesso/index.html')
t = p.read_text(encoding='utf-8')
t = t.replace('<title>Acesso Printly Completo</title>', '<title>Acesso à licença Printly</title>')
t = t.replace('<div><b>Printly Completo</b><small>Acesso à licença</small></div>', '<div><b>Printly</b><small>Acesso à licença</small></div>')
t = t.replace('uma licença ativa para o Printly Completo.', 'uma licença ativa para o Printly.')
p.write_text(t, encoding='utf-8')

# CSS
p = Path('assets/css/styles.css')
t = p.read_text(encoding='utf-8')
if '.plans-grid.single-plan' not in t:
    t += '\n/* Modelo comercial: teste completo + licença única */\n.plans-grid.single-plan{grid-template-columns:minmax(0,1fr);max-width:820px}\n.single-plan .plan-card ul{min-height:auto;grid-template-columns:repeat(2,minmax(0,1fr))}\n.plan-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px}.plan-actions .btn{width:100%}\n@media(max-width:620px){.single-plan .plan-card ul,.plan-actions{grid-template-columns:1fr}}\n'
p.write_text(t, encoding='utf-8')

# JS links + remote price + tracking
js = '''window.PRINTLY_DOWNLOAD_CONFIG = {
  SUPABASE_URL: 'https://uiesczevcmkzdtybxuez.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_imVDY4_4fWx9oECG8-KSWg_Sw8ZtM8S',
  DOWNLOAD_URL: 'https://uiesczevcmkzdtybxuez.supabase.co/functions/v1/printly-link?key=download_url&source=site',
  BUY_URL: 'https://uiesczevcmkzdtybxuez.supabase.co/functions/v1/printly-buy'
};

(function () {
  var pendingEmail = '';

  function formatPrice(raw, lang) {
    var normalized = String(raw || '').trim().replace(',', '.');
    if (!/^\\d+(?:\\.\\d{1,2})?$/.test(normalized)) return null;
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
'''
Path('assets/js/download-config.js').write_text(js, encoding='utf-8')

# Validation
files = ['index.html','en/index.html','es/index.html','termos.html','privacidade.html','acesso/index.html']
forbidden = ['Printly Free','PRINTLY FREE','Printly Completo','PRINTLY COMPLETO','Free x Completo','Free vs Complete','R$ 69,90','R$ 69.90','69<em>,90','69<em>.90']
for f in files:
    text = Path(f).read_text(encoding='utf-8')
    bad = [x for x in forbidden if x in text]
    if bad:
        raise SystemExit(f'{f}: termos antigos ainda presentes: {bad}')
pt = Path('index.html').read_text(encoding='utf-8')
assert '15 DIAS · TODOS OS RECURSOS' in pt
assert 'data-printly-price' in pt
assert 'R$ 67,90' in pt
assert 'Teste e licença' in pt
print('Validação comercial OK')
