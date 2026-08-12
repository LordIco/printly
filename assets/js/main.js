(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, {threshold:.09});
  $$('.reveal').forEach(el => observer.observe(el));

  const menuButton = $('.menu-button');
  const mobileMenu = $('.mobile-menu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-hidden', String(!open));
    });
    $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuButton.setAttribute('aria-expanded','false');
      mobileMenu.setAttribute('aria-hidden','true');
    }));
  }

  const screens = {
    dashboard:{n:'01',title:'Painel para decidir sem trocar de contexto',text:'Precificação rápida, resumo do cálculo, produtos, fila de produção e histórico reunidos na visão inicial.',label:'Painel principal',img:'assets/img/screen-dashboard.webp'},
    quote:{n:'02',title:'Orçamento conectado à operação',text:'Cliente, prazo, prioridade, itens, custo interno, margem, total e geração de PDF no mesmo fluxo.',label:'Orçamento',img:'assets/img/screen-orcamento-edit.webp'},
    printers:{n:'03',title:'ROI da impressora dentro da gestão',text:'Valor da máquina, potência, ROI desejado, horas por dia e dias por mês ajudam a planejar o retorno do equipamento.',label:'Impressoras / ROI',img:'assets/img/screen-impressoras.webp'},
    materials:{n:'04',title:'Filamentos e resinas com estoque e custo',text:'Materiais FDM e SLA, saldo, valor em estoque, mínimo e movimentações ficam registrados em uma área dedicada.',label:'Materiais / Estoque',img:'assets/img/screen-materiais.webp'},
    production:{n:'05',title:'Produção com prioridade, prazo e status',text:'Acompanhe cliente, projeto, quantidade, entrega, impressora, material e comparação entre previsto e realizado.',label:'Produção',img:'assets/img/screen-producao.webp'},
    stl:{n:'06',title:'Do STL ao item comercial',text:'Leia dimensões, formato, triângulos e volume geométrico; depois associe material, impressora e leve o item ao orçamento.',label:'Importar STL',img:'assets/img/screen-stl.webp'},
    alerts:{n:'07',title:'Problemas importantes aparecem antes',text:'Atrasos, produção com problema, estoque baixo, orçamento sem retorno e pedidos prontos ficam centralizados.',label:'Central de Alertas',img:'assets/img/screen-alertas.webp'},
    reports:{n:'08',title:'Rentabilidade e operação em uma visão gerencial',text:'Faturamento, valor orçado, custo, lucro estimado, margem, ticket, conversão e status ganham filtros e gráficos.',label:'Relatórios / BI',img:'assets/img/screen-relatorios.webp'}
  };
  const tabs = $$('.gallery-tabs button');
  const img = $('#mainScreen'), title = $('#screenTitle'), text = $('#screenText'), label = $('#screenLabel'), number = $('.stage-number');
  let current='dashboard';
  tabs.forEach(btn => btn.addEventListener('click', () => {
    current = btn.dataset.screen;
    const s = screens[current];
    tabs.forEach(b => b.classList.toggle('active', b === btn));
    if (!s) return;
    img.style.opacity = .15;
    setTimeout(() => {
      img.src=s.img; title.textContent=s.title; text.textContent=s.text; label.textContent=s.label; number.textContent=s.n; img.style.opacity=1;
    },140);
  }));
  if (img) img.style.transition='opacity .2s ease';

  const lightbox = $('#lightbox');
  const lightImg = $('.lightbox img');
  const openLightbox = src => { lightImg.src=src; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); };
  $('#zoomCurrent')?.addEventListener('click',()=>openLightbox(screens[current].img));
  $$('.split-screen img,.hero-screen img').forEach(el => {
    el.style.cursor='zoom-in';
    el.addEventListener('click',()=>openLightbox(el.src));
  });
  $('.lightbox-close')?.addEventListener('click',()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');});
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lightbox?.classList.contains('open')){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');}});

  const glow = $('.cursor-glow');
  if (glow && matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => { glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px'; });
  }

  const canvas = $('#particles');
  if (canvas && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w,h,dpr,pts=[];
    const resize=()=>{
      dpr=Math.min(devicePixelRatio||1,2); w=innerWidth; h=innerHeight;
      canvas.width=w*dpr; canvas.height=h*dpr; canvas.style.width=w+'px'; canvas.style.height=h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count=Math.min(90,Math.max(30,Math.floor(w/18)));
      pts=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.3,v:Math.random()*.16+.04,a:Math.random()*.45+.12}));
    };
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      pts.forEach(p=>{p.y-=p.v;if(p.y<-3){p.y=h+3;p.x=Math.random()*w}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(37,190,255,${p.a})`;ctx.fill();});
      requestAnimationFrame(draw);
    };
    resize(); addEventListener('resize',resize); draw();
  }
})();
