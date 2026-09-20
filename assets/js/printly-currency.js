/* Printly site: localized currency for the EN/ES demo and indicative BRL license conversions.
   This does NOT create USD/EUR checkout offers or alter the actual product price. */
(() => {
  'use strict';
  const lang = (document.documentElement.lang || '').toLowerCase().slice(0, 2);
  if (lang !== 'en' && lang !== 'es') return;
  const isEN = lang === 'en';
  const currency = isEN ? 'USD' : 'EUR';
  const locale = isEN ? 'en-US' : 'es-ES';
  const money = new Intl.NumberFormat(locale, {style:'currency', currency});
  const percent = new Intl.NumberFormat(locale, {maximumFractionDigits:1});
  const brl = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
  const defaults = isEN ? {filament:20,energy:0.18,wear:0.25,asked:5} : {filament:18,energy:0.22,wear:0.25,asked:5};
  const labels = isEN ? {
    noValue:'Enter the amount you would charge to compare.',
    invalid:'Check the fields: enter valid values within the indicated limits.',
    loss:value=>`At this price, the estimated loss is ${value} per part.`,
    below:(actual,target,difference)=>`Your estimated margin is ${actual}%, below your ${target}% target. You are ${difference} short per part.`,
    target:actual=>`This price meets your target margin. Estimated margin: ${actual}%.`,
    demo:' Sample values are illustrative, not market quotations. All inputs and results in this demo use USD.',
    pending:'Actual license reference price: {BRL} (BRL). A USD exchange-rate estimate is currently unavailable. Final price and payment currency are confirmed when ordering.',
    converted:'Indicative USD conversion at the reference rate of {DATE}; actual license reference price: {BRL} (BRL). Final price and payment currency are confirmed when ordering.'
  } : {
    noValue:'Introduce cuánto cobrarías para comparar.',
    invalid:'Revisa los campos: introduce valores válidos dentro de los límites.',
    loss:value=>`Con ese precio, la pérdida estimada es de ${value} por pieza.`,
    below:(actual,target,difference)=>`Tu margen estimado es del ${actual}%, inferior al ${target}% deseado. Faltan ${difference} por pieza.`,
    target:actual=>`Ese precio alcanza el margen deseado. Margen estimado: ${actual}%.`,
    demo:' Los valores iniciales son ejemplos, no cotizaciones de mercado. Todos los datos y resultados de este simulador están en EUR.',
    pending:'Precio de referencia de la licencia: {BRL} (BRL). La conversión estimada a EUR no está disponible. El precio final y la moneda de pago se confirman al realizar el pedido.',
    converted:'Conversión orientativa a EUR con el tipo de cambio de {DATE}; precio de referencia de la licencia: {BRL} (BRL). El precio final y la moneda de pago se confirman al realizar el pedido.'
  };

  function finite(input) {
    const n = input && input.value.trim() !== '' ? input.valueAsNumber : 0;
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  }
  function setupCalculator() {
    const form = document.getElementById('pc-form');
    if (!form || form.dataset.currencyEnhanced) return !!form;
    form.dataset.currencyEnhanced = currency;
    const units = {filament:`${currency}/kg`, energy:`${currency}/kWh`, wear:`${currency}/${isEN?'hour':'h'}`, asked:isEN?'US$':'€'};
    for (const [key, unit] of Object.entries(units)) {
      const input = form.elements.namedItem(key);
      if (!input) continue;
      const label = input.closest('label');
      const span = label && label.querySelector('span');
      if (span) span.textContent = unit;
      if (Object.hasOwn(defaults, key)) input.value = String(defaults[key]);
    }
    const disclaimer = form.querySelector('.pc-disclaimer');
    if (disclaimer && !disclaimer.dataset.currencyEnhanced) {
      disclaimer.append(document.createTextNode(labels.demo));
      disclaimer.dataset.currencyEnhanced = currency;
    }
    const outputs = Object.fromEntries([...form.querySelectorAll('[data-out]')].map(el=>[el.dataset.out,el]));
    const bars = Object.fromEntries([...form.querySelectorAll('[data-bar]')].map(el=>[el.dataset.bar,el]));
    const feedback = document.getElementById('pc-feedback');
    function render() {
      const invalid = [...form.querySelectorAll('input[required]')].some(el=>!el.value.trim()||!el.validity.valid) || (form.elements.namedItem('asked') && !form.elements.namedItem('asked').validity.valid);
      const v = Object.fromEntries(['weight','hours','filament','watts','energy','wear','failure','margin','asked'].map(key=>[key,finite(form.elements.namedItem(key))]));
      const material = v.weight / 1000 * v.filament;
      const electricity = v.watts / 1000 * v.hours * v.energy;
      const wear = v.hours * v.wear;
      const base = material + electricity + wear;
      const losses = base * v.failure / 100;
      const cost = base + losses;
      const price = cost / (1 - Math.min(v.margin,90) / 100);
      const values = {material,electricity,wear,losses,cost,price,profit:price-cost};
      for (const [key,el] of Object.entries(outputs)) el.textContent = invalid ? '—' : money.format(values[key]);
      for (const [key,el] of Object.entries(bars)) el.style.width = invalid || cost <= 0 ? '0%' : (values[key]/cost*100)+'%';
      if (!feedback) return;
      const actual = v.asked > 0 ? (v.asked-cost)/v.asked*100 : 0;
      const status = invalid ? 'invalid' : v.asked<=0 ? 'empty' : v.asked<cost-1e-7 ? 'loss' : v.asked<price-1e-7 ? 'below' : 'target';
      feedback.className='pc-feedback-'+status;
      feedback.textContent=status==='invalid' ? labels.invalid : status==='empty' ? labels.noValue : status==='loss' ? labels.loss(money.format(cost-v.asked)) : status==='below' ? labels.below(percent.format(actual),percent.format(v.margin),money.format(price-v.asked)) : labels.target(percent.format(actual));
    }
    // Original page listener runs first; this listener replaces only the currency presentation.
    form.addEventListener('input', render);
    render();
    return true;
  }

  function parseBRL(text) {
    const m = String(text||'').match(/R\$\s*([\d.,\s]+)/);
    if (!m) return null;
    let amount=m[1].trim().replace(/\s/g,'');
    const comma=amount.lastIndexOf(','), dot=amount.lastIndexOf('.');
    if (comma>dot) amount=amount.replace(/\./g,'').replace(',','.');
    else if (dot>comma) amount=amount.replace(/,/g,'');
    const number=Number(amount);
    return Number.isFinite(number) && number>=0 ? number : null;
  }

  function setupLicensePrice() {
    const nodes = [...document.querySelectorAll('[data-printly-price], [data-printly-price-split]')];
    if (!nodes.length) return;
    let basePrice = nodes.map(el=>parseBRL(el.textContent)).find(value=>value!==null) ?? null;
    let exchangeRate = null;
    let rateDate = '';
    const notes = nodes.map(el=>{
      let note = el.nextElementSibling;
      if (!note || !note.classList.contains('printly-currency-note')) {
        note=document.createElement('small');
        note.className='printly-currency-note';
        el.insertAdjacentElement('afterend',note);
      }
      return note;
    });
    let painting=false;
    function paint() {
      if (basePrice===null) return;
      painting=true;
      try {
        const converted=Number.isFinite(exchangeRate) && exchangeRate>0;
        const shown=converted ? `≈ ${money.format(basePrice*exchangeRate)}` : `${brl.format(basePrice)} (BRL)`;
        const notice=(converted ? labels.converted : labels.pending)
          .replace('{BRL}',brl.format(basePrice)).replace('{DATE}',rateDate);
        nodes.forEach((el,i)=>{
          if (el.textContent!==shown) el.textContent=shown;
          if (notes[i].textContent!==notice) notes[i].textContent=notice;
        });
      } finally { painting=false; }
    }
    nodes.forEach(node=>{
      new MutationObserver(()=>{
        if (painting) return;
        const latest=parseBRL(node.textContent);
        if (latest!==null && latest!==basePrice) { basePrice=latest; paint(); }
      }).observe(node,{subtree:true,childList:true,characterData:true});
    });
    paint();
    // Indicative FX only: actual BRL license price continues to come from the existing backend.
    fetch(`https://api.frankfurter.dev/v2/rate/brl/${currency.toLowerCase()}`)
      .then(response=>{if(!response.ok)throw new Error('exchange_rate_unavailable');return response.json();})
      .then(rate=>{
        if (String(rate.base||'').toUpperCase()!=='BRL' || String(rate.quote||'').toUpperCase()!==currency || !Number.isFinite(Number(rate.rate)) || Number(rate.rate)<=0 || !/^\d{4}-\d{2}-\d{2}$/.test(String(rate.date||''))) throw new Error('invalid_exchange_rate');
        exchangeRate=Number(rate.rate);
        rateDate=rate.date;
        paint();
      })
      .catch(()=>paint());
  }

  function init() {
    setupLicensePrice();
    if (setupCalculator()) return;
    const observer=new MutationObserver(()=>{if(setupCalculator())observer.disconnect();});
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();