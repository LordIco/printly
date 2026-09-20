/* EN/ES feature parity with PT: additive components, original signup and purchase flows stay untouched. */
(() => {
  'use strict';
  const lang = (document.documentElement.lang || '').toLowerCase().slice(0,2);
  if (lang !== 'en' && lang !== 'es') return;
  const assetBase = new URL('../', document.currentScript.src);
  const image = filename => new URL('img/' + filename + '.webp', assetBase).href;
  const translations = {
    en: {
      free:'FREE 3D PRINTING CALCULATOR', title:'How much does your print cost?', hint:'Use your own numbers. Results update instantly.',
      print:'01 · Print details', weight:'Part weight', grams:'g', hours:'Print time', hourUnit:'hours',
      operating:'02 · Operating costs', filament:'Filament', kg:'BRL/kg', watts:'Printer power', wattUnit:'W', energy:'Electricity', kwh:'BRL/kWh', wear:'Printer wear', perHour:'BRL/hour',
      pricing:'03 · Pricing', failure:'Loss allowance', margin:'Target margin', onSale:'% of selling price',
      composition:'COST BREAKDOWN', distribution:'Cost distribution', material:'Material', electricity:'Electricity', wearLabel:'Wear', losses:'Losses', cost:'Total cost', profit:'Estimated profit', suggested:'SUGGESTED PRICE',
      asking:'What would you charge for this print?', currency:'R$', try:'Try the full Printly app for 15 days',
      disclaimer:'Simplified filament (FDM) estimate. Losses are a percentage allowance; the app includes additional cost components and calculation options.',
      invalid:'Check the fields and enter valid values within the indicated limits.', empty:'Enter what you would charge to compare.',
      loss:amount=>`At that price, the estimated loss is ${amount} per part.`,
      below:(actual,target,diff)=>`Your estimated margin is ${actual}%, below your ${target}% target. You are ${diff} short per part.`,
      target:actual=>`That price meets your target margin. Estimated margin: ${actual}%.`,
      trustLabel:'Printly product information',trust:[['✓','No subscription','Permanent license'],['▣','Your data stays local','Backup and restore'],['◎','Three languages','Português · English · Español'],['↧','PDF manuals','User guide and installation']],
      mobileLabel:'Printly free trial',mobileStrong:'15 days free',mobileSmall:'Full Windows app',mobileButton:'Try Printly',
      galleryKicker:'EXPLORE PRINTLY',galleryTitle:'See the actual app in action.',galleryIntro:'Eight real screens showing how costs, quotes and production connect.',galleryLabel:'Printly app screenshots',galleryBenefits:'Highlights of the selected screen',zoom:'Enlarge screen ↗',
      screens: {
        dashboard:['Dashboard','Pricing, production and history together','Quick pricing, a cost summary, your products, production queue and history in one view.',['Cost, suggested price and profit','Production queue in view','History at your fingertips'],'Main dashboard'],
        quote:['Quotes','Quotes connected to your workflow','Manage customer, deadline, priority, line items, internal cost and margin, then generate a PDF.',['Catalog and custom items','Deadline, priority and status','Client-ready PDF'],'Quote editor'],
        printers:['Printer ROI','Plan each printer’s payback','Set equipment value, power, target ROI, operating hours and days to plan a return.',['Return per printer','Operating hours and days','Power and investment'],'Printers and ROI'],
        materials:['Materials','Filament and resin inventory','Keep material costs, current quantities, minimum stock and inventory movements together.',['FDM filament and SLA resin','Minimum stock and balance','Recorded stock movements'],'Materials and inventory'],
        production:['Production','Production by priority, deadline and status','Track customer, project, quantity, delivery date, printer, material and actual versus planned use.',['Priority and deadlines','Assigned printer and material','Planned vs. actual'],'Production queue'],
        stl:['Import STL','Turn an STL into a quote item','Review dimensions, shape, triangle count and geometric volume before choosing a material and printer.',['Dimensions and geometric volume','Linked material and printer','Item ready for a quote'],'STL import'],
        alerts:['Alerts','Spot issues that need attention','Keep overdue orders, production issues, low stock and quotes awaiting follow-up in view.',['Deadlines and production alerts','Stock below minimum','Quotes awaiting follow-up'],'Alert center'],
        reports:['Reports / BI','See profitability alongside operations','Review revenue, quoted value, estimated costs, profit, margin, ticket and conversion using charts and filters.',['Estimated cost and profit','Margin and conversion','Metrics by period'],'Reports and BI']
      }
    },
    es: {
      free:'CALCULADORA GRATUITA · IMPRESIÓN 3D',title:'¿Cuánto cuesta tu pieza?',hint:'Introduce tus propios datos. El resultado cambia al instante.',
      print:'01 · Datos de impresión',weight:'Peso de la pieza',grams:'g',hours:'Tiempo de impresión',hourUnit:'horas',
      operating:'02 · Costes operativos',filament:'Filamento',kg:'R$/kg',watts:'Potencia de la impresora',wattUnit:'W',energy:'Electricidad',kwh:'R$/kWh',wear:'Desgaste de la impresora',perHour:'R$/h',
      pricing:'03 · Formación del precio',failure:'Provisión para pérdidas',margin:'Margen deseado',onSale:'% del precio de venta',
      composition:'DESGLOSE DEL COSTE',distribution:'Distribución de costes',material:'Material',electricity:'Electricidad',wearLabel:'Desgaste',losses:'Pérdidas',cost:'Coste total',profit:'Beneficio estimado',suggested:'PRECIO SUGERIDO',
      asking:'¿Cuánto cobrarías por esta pieza?',currency:'R$',try:'Prueba Printly completo durante 15 días',
      disclaimer:'Simulación simplificada de filamento (FDM). Las pérdidas son una provisión porcentual; la aplicación incluye otros componentes y opciones de cálculo.',
      invalid:'Revisa los campos e introduce valores válidos dentro de los límites.',empty:'Introduce cuánto cobrarías para comparar.',
      loss:amount=>`Con ese precio, la pérdida estimada es de ${amount} por pieza.`,
      below:(actual,target,diff)=>`Tu margen estimado es del ${actual}%, inferior al ${target}% deseado. Faltan ${diff} por pieza.`,
      target:actual=>`Ese precio alcanza el margen deseado. Margen estimado: ${actual}%.`,
      trustLabel:'Información sobre Printly',trust:[['✓','Sin mensualidades','Licencia permanente'],['▣','Tus datos en tu equipo','Copia de seguridad y restauración'],['◎','Tres idiomas','Português · English · Español'],['↧','Manuales en PDF','Uso e instalación']],
      mobileLabel:'Prueba gratuita de Printly',mobileStrong:'15 días gratis',mobileSmall:'Todas las funciones en Windows',mobileButton:'Probar Printly',
      galleryKicker:'DESCUBRE PRINTLY',galleryTitle:'Conoce la aplicación de verdad.',galleryIntro:'Ocho pantallas reales que conectan costes, presupuestos y producción.',galleryLabel:'Capturas de Printly',galleryBenefits:'Ventajas de la pantalla seleccionada',zoom:'Ampliar pantalla ↗',
      screens: {
        dashboard:['Panel','Precios, producción e historial en una pantalla','Cálculo rápido, resumen de costes, productos, cola de producción e historial en una sola vista.',['Coste, precio sugerido y beneficio','Cola de producción visible','Historial a mano'],'Panel principal'],
        quote:['Presupuestos','Presupuestos conectados con la operación','Gestiona cliente, plazo, prioridad, artículos, coste interno y margen y genera un PDF.',['Catálogo y encargos','Plazo, prioridad y estado','PDF para el cliente'],'Editor de presupuestos'],
        printers:['ROI','Planifica el retorno de cada impresora','Registra valor del equipo, potencia, ROI deseado, horas y días de uso para planificar el retorno.',['Retorno por impresora','Horas y días de trabajo','Potencia e inversión'],'Impresoras y ROI'],
        materials:['Materiales','Filamentos y resinas bajo control','Consulta costes, existencias, stock mínimo y movimientos de materiales en un solo lugar.',['Filamentos FDM y resinas SLA','Stock mínimo y existencias','Movimientos registrados'],'Materiales e inventario'],
        production:['Producción','Producción por prioridad, plazo y estado','Controla cliente, proyecto, cantidad, entrega, impresora, material y consumo real frente al previsto.',['Prioridad y plazos','Impresora y material asignados','Previsto frente a real'],'Cola de producción'],
        stl:['Importar STL','Del STL al artículo del presupuesto','Consulta dimensiones, forma, triángulos y volumen geométrico antes de elegir material e impresora.',['Dimensiones y volumen geométrico','Material e impresora asociados','Artículo listo para presupuestar'],'Importación STL'],
        alerts:['Alertas','Detecta problemas que requieren atención','Reúne retrasos, incidencias de producción, stock bajo y presupuestos pendientes de seguimiento.',['Plazos y problemas de producción','Stock por debajo del mínimo','Presupuestos pendientes'],'Central de alertas'],
        reports:['Informes / BI','Rentabilidad y operación en conjunto','Consulta facturación, importes presupuestados, costes, beneficio estimado, margen y conversión con filtros y gráficos.',['Coste y beneficio estimados','Margen y conversión','Indicadores por período'],'Informes y BI']
      }
    }
  };
  const t = translations[lang];
  const money = new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'pt-BR',{style:'currency',currency:'BRL'});
  const pct = new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-ES',{maximumFractionDigits:1});
  const defaults={weight:85,hours:6,filament:110,watts:150,energy:0.95,wear:1.2,failure:8,margin:40,asked:25};
  const limits={weight:100000,hours:10000,filament:100000,watts:100000,energy:1000,wear:100000,failure:100,margin:90,asked:100000000};
  function field(key,label,unit) {
    return `<label>${label} <span>${unit}</span><input name="${key}" type="number" min="0" max="${limits[key]}" step="any" inputmode="decimal" value="${defaults[key]}" required></label>`;
  }
  function initCalculator() {
    const slot=document.querySelector('main .hero .hero-visual');
    if(!slot || document.getElementById('printly-public-calculator'))return;
    slot.classList.add('hero-calculator-slot');
    slot.innerHTML=`<section class="pc-calc" id="printly-public-calculator" aria-labelledby="pc-title"><header class="pc-calc-head"><span class="pc-calc-kicker">${t.free}</span><h2 id="pc-title">${t.title}</h2><p>${t.hint}</p></header>
      <form id="pc-form" novalidate><fieldset class="pc-fieldset"><legend>${t.print}</legend><div class="pc-fields">${field('weight',t.weight,t.grams)}${field('hours',t.hours,t.hourUnit)}</div></fieldset>
      <fieldset class="pc-fieldset"><legend>${t.operating}</legend><div class="pc-fields">${field('filament',t.filament,t.kg)}${field('watts',t.watts,t.wattUnit)}${field('energy',t.energy,t.kwh)}${field('wear',t.wear,t.perHour)}</div></fieldset>
      <fieldset class="pc-fieldset"><legend>${t.pricing}</legend><div class="pc-fields">${field('failure',t.failure,'%')}${field('margin',t.margin,t.onSale)}</div></fieldset>
      <div class="pc-result" aria-label="${t.composition}"><div class="pc-result-label">${t.composition}</div><div class="pc-stack" role="img" aria-label="${t.distribution}"><span data-bar="material"></span><span data-bar="electricity"></span><span data-bar="wear"></span><span data-bar="losses"></span></div>
      <div class="pc-legend"><span>${t.material} <b data-out="material"></b></span><span>${t.electricity} <b data-out="electricity"></b></span><span>${t.wearLabel} <b data-out="wear"></b></span><span>${t.losses} <b data-out="losses"></b></span></div>
      <div class="pc-totals"><div>${t.cost} <strong data-out="cost"></strong></div><div>${t.profit} <strong data-out="profit"></strong></div></div><div class="pc-price"><span>${t.suggested}</span><strong data-out="price" aria-live="polite" aria-atomic="true"></strong></div></div>
      <div class="pc-compare"><label for="pc-asked">${t.asking} <span>${t.currency}</span></label><input id="pc-asked" name="asked" type="number" min="0" max="${limits.asked}" step="any" inputmode="decimal" value="25"><p id="pc-feedback" role="status" aria-live="polite" aria-atomic="true"></p></div>
      <button class="pc-cta" id="pc-cta" type="button">${t.try} <span aria-hidden="true">↗</span></button><p class="pc-disclaimer">${t.disclaimer}</p></form></section>`;
    const form=slot.querySelector('#pc-form');
    const outputs=Object.fromEntries([...slot.querySelectorAll('[data-out]')].map(el=>[el.dataset.out,el]));
    const bars=Object.fromEntries([...slot.querySelectorAll('[data-bar]')].map(el=>[el.dataset.bar,el]));
    const feedback=slot.querySelector('#pc-feedback');
    function render(){
      const invalid=[...form.querySelectorAll('input[required]')].some(el=>!el.value.trim()||!el.validity.valid);
      const v={};for(const key of Object.keys(defaults)){
        const el=form.elements.namedItem(key);const n=el.value.trim()===''?0:el.valueAsNumber;
        v[key]=Number.isFinite(n)?Math.max(0,Math.min(n,limits[key])):0;
      }
      const material=v.weight/1000*v.filament;
      const electricity=v.watts/1000*v.hours*v.energy;
      const wear=v.hours*v.wear;
      const base=material+electricity+wear;
      const losses=base*v.failure/100;
      const cost=base+losses;
      const price=cost/(1-v.margin/100);
      const result={material,electricity,wear,losses,cost,price,profit:price-cost};
      for(const key of Object.keys(outputs))outputs[key].textContent=invalid?'—':money.format(result[key]);
      for(const key of Object.keys(bars))bars[key].style.width=invalid||cost===0?'0%':(result[key]/cost*100)+'%';
      const actual=v.asked>0?(v.asked-cost)/v.asked*100:null;
      const status=v.asked<=0?'empty':v.asked<cost-1e-7?'loss':v.asked<price-1e-7?'below':'target';
      feedback.className=invalid?'pc-feedback-invalid':'pc-feedback-'+status;
      if(invalid)feedback.textContent=t.invalid;
      else if(status==='empty')feedback.textContent=t.empty;
      else if(status==='loss')feedback.textContent=t.loss(money.format(cost-v.asked));
      else if(status==='below')feedback.textContent=t.below(pct.format(actual),pct.format(v.margin),money.format(price-v.asked));
      else feedback.textContent=t.target(pct.format(actual));
    }
    form.addEventListener('input',render);
    form.addEventListener('submit',event=>event.preventDefault());
    slot.querySelector('#pc-cta').addEventListener('click',()=>{
      const trigger=document.querySelector('.hero-actions [data-open-download]')||document.querySelector('[data-open-download]');
      if(trigger)trigger.click();
    });
    render();
  }
  function initTrust(){
    const hero=document.querySelector('main .hero');
    if(!hero||document.getElementById('printly-trust-strip'))return;
    const strip=document.createElement('section');strip.id='printly-trust-strip';strip.className='printly-trust-strip';strip.setAttribute('aria-label',t.trustLabel);
    const wrap=document.createElement('div');wrap.className='container printly-trust-grid';
    const manualLinks=[...document.querySelectorAll('.hero .manual-card a')];
    t.trust.forEach(([symbol,title,detail],index)=>{
      const item=document.createElement('div');item.className='printly-trust-item';
      const mark=document.createElement('span');mark.className='printly-trust-symbol';mark.textContent=symbol;mark.setAttribute('aria-hidden','true');
      const copy=document.createElement('div');const heading=document.createElement('strong');heading.textContent=title;
      const sub=document.createElement('span');sub.textContent=detail;copy.append(heading,sub);
      if(index===3&&manualLinks.length){const links=document.createElement('div');links.className='printly-trust-links';manualLinks.forEach(a=>links.appendChild(a.cloneNode(true)));copy.appendChild(links);}
      item.append(mark,copy);wrap.appendChild(item);
    });
    strip.appendChild(wrap);hero.insertAdjacentElement('afterend',strip);
  }
  function initMobile(){
    if(document.getElementById('printly-mobile-cta'))return;
    const trial=document.querySelector('.hero-actions [data-open-download]')||document.querySelector('header [data-open-download]');
    if(!trial)return;
    const bar=document.createElement('aside');bar.className='printly-mobile-cta';bar.id='printly-mobile-cta';bar.setAttribute('aria-label',t.mobileLabel);
    const copy=document.createElement('div');copy.className='printly-mobile-cta-copy';
    const strong=document.createElement('strong');strong.textContent=t.mobileStrong;const small=document.createElement('small');small.textContent=t.mobileSmall;copy.append(strong,small);
    const button=document.createElement('button');button.type='button';button.className='btn btn-primary printly-mobile-cta-button';button.textContent=t.mobileButton;
    button.addEventListener('click',()=>trial.click());bar.append(copy,button);document.body.appendChild(bar);
  }
  function initGallery(){
    if(document.getElementById('printly-i18n-gallery'))return;
    const main=document.querySelector('main');const plans=main&&main.querySelector('.plans-section');if(!plans)return;
    const keys=Object.keys(t.screens);const first=t.screens[keys[0]];
    const section=document.createElement('section');section.id='printly-i18n-gallery';section.className='printly-i18n-gallery section';
    section.innerHTML=`<div class="container"><div class="i18n-heading"><span class="section-kicker">${t.galleryKicker}</span><h2>${t.galleryTitle}</h2><p>${t.galleryIntro}</p></div><div class="i18n-gallery-tabs" role="tablist" aria-label="${t.galleryLabel}"></div><div class="i18n-gallery-stage" id="printly-i18n-panel" role="tabpanel" tabindex="0"><div class="i18n-gallery-copy"><span class="i18n-gallery-number">01</span><h3></h3><p></p><ul class="printly-gallery-benefits" aria-label="${t.galleryBenefits}"></ul><button class="i18n-gallery-zoom" type="button">${t.zoom}</button></div><div class="i18n-gallery-media"><div class="app-window large"><div class="app-window-bar"><span></span><span></span><span></span><em></em></div><img width="1800" height="963" loading="lazy" alt=""></div></div></div></div>`;
    plans.insertAdjacentElement('beforebegin',section);
    const list=section.querySelector('.i18n-gallery-tabs');const stage=section.querySelector('.i18n-gallery-stage');
    const screenImg=section.querySelector('.i18n-gallery-media img');
    const buttons=keys.map((key,i)=>{
      const button=document.createElement('button');button.type='button';button.id='printly-i18n-tab-'+key;button.setAttribute('role','tab');button.setAttribute('aria-controls',stage.id);button.textContent=t.screens[key][0];
      button.addEventListener('click',()=>select(i));button.addEventListener('keydown',event=>{
        let next=null;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(i+1)%keys.length;
        if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(i+keys.length-1)%keys.length;
        if(event.key==='Home')next=0;if(event.key==='End')next=keys.length-1;
        if(next!==null){event.preventDefault();buttons[next].focus();select(next);}
      });list.appendChild(button);return button;
    });
    let current=keys[0];
    function select(i){
      const key=keys[i],entry=t.screens[key];current=key;
      buttons.forEach((button,j)=>{button.setAttribute('aria-selected',String(i===j));button.tabIndex=i===j?0:-1;});
      stage.setAttribute('aria-labelledby',buttons[i].id);
      section.querySelector('.i18n-gallery-number').textContent=String(i+1).padStart(2,'0');
      section.querySelector('.i18n-gallery-copy h3').textContent=entry[1];
      section.querySelector('.i18n-gallery-copy p').textContent=entry[2];
      section.querySelector('.app-window-bar em').textContent=entry[4];
      const benefits=section.querySelector('.printly-gallery-benefits');benefits.replaceChildren();entry[3].forEach(text=>{const li=document.createElement('li');li.textContent=text;benefits.appendChild(li);});
      screenImg.src=image(({dashboard:'screen-dashboard',quote:'screen-orcamento-edit',printers:'screen-impressoras',materials:'screen-materiais',production:'screen-producao',stl:'screen-stl',alerts:'screen-alertas',reports:'screen-relatorios'})[key]);
      screenImg.alt=entry[4];
    }
    section.querySelector('.i18n-gallery-zoom').addEventListener('click',()=>{
      const modal=document.querySelector('#lightbox');const img=modal&&modal.querySelector('img');if(!img)return;
      img.src=screenImg.src;img.alt=screenImg.alt;modal.classList.add('open');modal.setAttribute('aria-hidden','false');
      modal.querySelector('.lightbox-close')?.focus();
    });
    select(0);
  }
  function init(){initCalculator();initTrust();initMobile();initGallery();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
