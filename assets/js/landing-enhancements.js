/* Printly PT landing enhancements: additive UI only; preserve existing pricing and download flows. */
(() => {
  'use strict';
  if ((document.documentElement.lang || '').toLowerCase() !== 'pt-br') return;

  function init() {
    const hero = document.querySelector('main .hero');
    if (!hero || document.getElementById('printly-trust-strip')) return;

    // Trust points use statements already supported by the site's product copy.
    const strip = document.createElement('section');
    strip.id = 'printly-trust-strip';
    strip.className = 'printly-trust-strip';
    strip.setAttribute('aria-label', 'Informações sobre o Printly');
    const wrap = document.createElement('div');
    wrap.className = 'container printly-trust-grid';
    const points = [
      {symbol:'✓',title:'Sem mensalidade',detail:'Licença permanente'},
      {symbol:'▣',title:'Dados no seu computador',detail:'Backup e restauração'},
      {symbol:'◎',title:'Três idiomas',detail:'Português · English · Español'},
      {symbol:'↧',title:'Manuais em PDF',detail:'Uso e instalação',links:true}
    ];
    points.forEach(point => {
      const item = document.createElement('div');
      item.className = 'printly-trust-item';
      const symbol = document.createElement('span');
      symbol.className = 'printly-trust-symbol';
      symbol.setAttribute('aria-hidden','true');
      symbol.textContent = point.symbol;
      const copy = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = point.title;
      const detail = document.createElement('span');
      detail.textContent = point.detail;
      copy.append(name,detail);
      if (point.links) {
        const links = document.createElement('div');
        links.className = 'printly-trust-links';
        [['Manual de uso','downloads/Printly_Manual_Oficial_v0.2.8.3_REV6_PT-BR.pdf'],['Instalação','downloads/Manual_Instalacao_Printly_Windows_PT-BR.pdf']].forEach(([label,href]) => {
          const a = document.createElement('a');
          a.href = href;
          a.textContent = label;
          links.appendChild(a);
        });
        copy.appendChild(links);
      }
      item.append(symbol,copy);
      wrap.appendChild(item);
    });
    strip.appendChild(wrap);
    hero.insertAdjacentElement('afterend',strip);

    // CTA calls an existing wired trigger: do not create a second lead form.
    const trial = document.querySelector('.hero-actions [data-open-download]') || document.querySelector('header [data-open-download]');
    if (trial) {
      const bar = document.createElement('aside');
      bar.className = 'printly-mobile-cta';
      bar.id = 'printly-mobile-cta';
      bar.setAttribute('aria-label','Teste gratuito do Printly');
      const copy = document.createElement('div');
      copy.className = 'printly-mobile-cta-copy';
      const strong = document.createElement('strong');
      strong.textContent = '15 dias grátis';
      const small = document.createElement('small');
      small.textContent = 'Todos os recursos no Windows';
      copy.append(strong,small);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-primary printly-mobile-cta-button';
      button.textContent = 'Testar Printly';
      button.addEventListener('click', () => trial.click());
      bar.append(copy,button);
      document.body.appendChild(bar);
    }

    // Add concise benefit chips to the existing eight-tab gallery without replacing it.
    const benefits = {
      dashboard:['Custo, preço e lucro','Fila de produção à vista','Histórico para consulta'],
      quote:['Itens próprios e sob encomenda','Prazo, prioridade e status','PDF para apresentar ao cliente'],
      printers:['Retorno por equipamento','Horas e dias de operação','Potência e investimento'],
      materials:['Filamentos e resinas','Estoque mínimo e saldo','Movimentações registradas'],
      production:['Prioridade e prazo','Impressora e material','Previsto x realizado'],
      stl:['Dimensões e volume geométrico','Material e impressora associados','Item pronto para orçamento'],
      alerts:['Prazo e produção em atenção','Estoque abaixo do mínimo','Orçamentos aguardando retorno'],
      reports:['Custo e lucro estimado','Margem e conversão','Indicadores por período']
    };
    const tablist = document.querySelector('.gallery-tabs');
    const stage = document.querySelector('.gallery-stage');
    const description = document.querySelector('.stage-copy p');
    if (tablist && stage && description && !document.getElementById('printly-gallery-benefits')) {
      const list = document.createElement('ul');
      list.id = 'printly-gallery-benefits';
      list.className = 'printly-gallery-benefits';
      list.setAttribute('aria-label','Benefícios da tela selecionada');
      description.insertAdjacentElement('afterend',list);
      const tabs = Array.from(tablist.querySelectorAll('button[data-screen]'));
      stage.id = stage.id || 'printly-gallery-panel';
      stage.setAttribute('role','tabpanel');
      stage.setAttribute('tabindex','0');
      function select(key) {
        const active = tabs.find(tab => tab.dataset.screen === key);
        if (!active) return;
        tabs.forEach(tab => {
          const selected = tab === active;
          tab.setAttribute('aria-selected',String(selected));
          tab.tabIndex = selected ? 0 : -1;
        });
        stage.setAttribute('aria-labelledby',active.id);
        list.replaceChildren();
        (benefits[key] || []).forEach(benefit => {
          const li = document.createElement('li');
          li.textContent = benefit;
          list.appendChild(li);
        });
      }
      tabs.forEach((tab,index) => {
        tab.id = tab.id || 'printly-gallery-tab-'+tab.dataset.screen;
        tab.setAttribute('role','tab');
        tab.setAttribute('aria-controls',stage.id);
        tab.addEventListener('click', () => select(tab.dataset.screen));
        tab.addEventListener('keydown', event => {
          let next = null;
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next=(index+1)%tabs.length;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next=(index-1+tabs.length)%tabs.length;
          if (event.key === 'Home') next=0;
          if (event.key === 'End') next=tabs.length-1;
          if (next !== null) {
            event.preventDefault();
            tabs[next].focus();
            tabs[next].click();
          }
        });
      });
      select(tabs.find(tab => tab.classList.contains('active'))?.dataset.screen || 'dashboard');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();