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

  const downloadModal = $('#downloadModal');
  const downloadForm = $('#downloadForm');
  const downloadStatus = $('#downloadStatus');
  const downloadClose = $('.download-close');
  const emailInput = downloadForm?.elements.email;
  const phoneInput = downloadForm?.elements.whatsapp;
  let downloadTrigger = null;

  const locale = document.documentElement.lang?.toLowerCase().startsWith('en')
    ? 'en'
    : document.documentElement.lang?.toLowerCase().startsWith('es') ? 'es' : 'pt';
  const messages = {
    pt: {
      invalidEmail: 'Informe um e-mail válido, como voce@exemplo.com.br.',
      invalidPhone: 'Informe um celular brasileiro válido, com DDD e nove dígitos.',
      setupPending: 'A captura ainda está em configuração. Solicite o acesso pelo <a href="https://wa.me/5519988134895" target="_blank" rel="noopener">WhatsApp</a>.',
      submitting: 'Registrando...',
      downloadReady: url => `Cadastro concluído. Seu download começou; se necessário, <a href="${url}">clique aqui</a>.`,
      installerPending: 'Cadastro recebido. O instalador gratuito está sendo preparado e o link será enviado para o seu e-mail assim que estiver disponível.',
      submitError: 'Não foi possível registrar seus dados agora. Tente novamente ou solicite o acesso pelo <a href="https://wa.me/5519988134895" target="_blank" rel="noopener">WhatsApp</a>.'
    },
    en: {
      invalidEmail: 'Enter a valid email address, such as you@example.com.',
      invalidPhone: 'Enter a valid Brazilian mobile number, including the area code and nine digits.',
      setupPending: 'Lead capture is still being configured. Request access through <a href="https://wa.me/5519988134895" target="_blank" rel="noopener">WhatsApp</a>.',
      submitting: 'Submitting...',
      downloadReady: url => `Registration complete. Your download has started; if needed, <a href="${url}">click here</a>.`,
      installerPending: 'Registration received. The free installer is being prepared, and the link will be emailed to you as soon as it is available.',
      submitError: 'We could not register your details right now. Try again or request access through <a href="https://wa.me/5519988134895" target="_blank" rel="noopener">WhatsApp</a>.'
    },
    es: {
      invalidEmail: 'Introduce un correo electrónico válido, como tu@ejemplo.com.',
      invalidPhone: 'Introduce un número móvil brasileño válido, con código de área y nueve dígitos.',
      setupPending: 'La captura de datos aún se está configurando. Solicita acceso por <a href="https://wa.me/5519988134895" target="_blank" rel="noopener">WhatsApp</a>.',
      submitting: 'Registrando...',
      downloadReady: url => `Registro completado. La descarga ha comenzado; si es necesario, <a href="${url}">haz clic aquí</a>.`,
      installerPending: 'Registro recibido. El instalador gratuito se está preparando y enviaremos el enlace a tu correo en cuanto esté disponible.',
      submitError: 'No pudimos registrar tus datos ahora. Inténtalo de nuevo o solicita acceso por <a href="https://wa.me/5519988134895" target="_blank" rel="noopener">WhatsApp</a>.'
    }
  }[locale];

  const validBrazilianAreaCodes = new Set([
    '11','12','13','14','15','16','17','18','19','21','22','24','27','28',
    '31','32','33','34','35','37','38','41','42','43','44','45','46','47','48','49',
    '51','53','54','55','61','62','63','64','65','66','67','68','69','71','73','74',
    '75','77','79','81','82','83','84','85','86','87','88','89','91','92','93','94',
    '95','96','97','98','99'
  ]);
  const onlyDigits = value => String(value || '').replace(/\D/g,'');
  const formatMobile = value => {
    const digits = onlyDigits(value).slice(0,11);
    if (digits.length <= 2) return digits ? `(${digits}` : '';
    if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  };
  const isValidMobile = digits => digits.length === 11 && validBrazilianAreaCodes.has(digits.slice(0,2)) && digits[2] === '9';
  const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value) && !value.includes('..');

  phoneInput?.addEventListener('input', () => {
    phoneInput.value = formatMobile(phoneInput.value);
    phoneInput.setCustomValidity('');
  });
  emailInput?.addEventListener('input', () => emailInput.setCustomValidity(''));

  const setDownloadStatus = (type, message) => {
    if (!downloadStatus) return;
    downloadStatus.className = `download-status ${type}`;
    downloadStatus.innerHTML = message;
  };
  const closeDownload = () => {
    if (!downloadModal) return;
    downloadModal.classList.remove('open');
    downloadModal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    downloadTrigger?.focus();
  };
  const openDownload = trigger => {
    if (!downloadModal) return;
    downloadTrigger = trigger;
    downloadModal.classList.add('open');
    downloadModal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    mobileMenu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded','false');
    mobileMenu?.setAttribute('aria-hidden','true');
    setTimeout(() => downloadForm?.elements.name?.focus(), 50);
  };

  $$('[data-open-download]').forEach(button => button.addEventListener('click', () => openDownload(button)));
  downloadClose?.addEventListener('click', closeDownload);
  downloadModal?.addEventListener('click', event => { if (event.target === downloadModal) closeDownload(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && downloadModal?.classList.contains('open')) closeDownload();
  });

  downloadForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = $('.download-submit', downloadForm);
    const originalText = submit.textContent;
    const config = window.PRINTLY_DOWNLOAD_CONFIG || {};
    const email = String(emailInput.value || '').trim().toLowerCase();
    const phoneDigits = onlyDigits(phoneInput.value);

    emailInput.setCustomValidity(isValidEmail(email) ? '' : messages.invalidEmail);
    phoneInput.setCustomValidity(isValidMobile(phoneDigits) ? '' : messages.invalidPhone);
    if (!downloadForm.reportValidity()) return;

    emailInput.value = email;
    phoneInput.value = formatMobile(phoneDigits);
    const data = new FormData(downloadForm);

    if (!config.SUPABASE_URL || !config.SUPABASE_PUBLISHABLE_KEY) {
      setDownloadStatus('error', messages.setupPending);
      return;
    }

    submit.disabled = true;
    submit.textContent = messages.submitting;
    setDownloadStatus('', '');

    try {
      const response = await fetch(`${config.SUPABASE_URL}/rest/v1/download_leads`, {
        method: 'POST',
        headers: {
          apikey: config.SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${config.SUPABASE_PUBLISHABLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          name: String(data.get('name') || '').trim(),
          email,
          whatsapp: phoneDigits,
          consent: data.get('consent') === 'on',
          source: 'printly-site',
          referrer: document.referrer || null,
          page_url: location.href,
          user_agent: navigator.userAgent
        })
      });
      if (!response.ok) throw new Error(`Lead API: ${response.status}`);

      downloadForm.reset();
      if (config.DOWNLOAD_URL) {
        setDownloadStatus('success', messages.downloadReady(config.DOWNLOAD_URL));
        const link = document.createElement('a');
        link.href = config.DOWNLOAD_URL;
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setDownloadStatus('success', messages.installerPending);
      }
      window.dispatchEvent(new CustomEvent('printly:download-lead'));
    } catch (error) {
      console.error(error);
      setDownloadStatus('error', messages.submitError);
    } finally {
      submit.disabled = false;
      submit.textContent = originalText;
    }
  });
})();
