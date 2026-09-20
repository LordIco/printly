/* EN/USD and ES/EUR demo; license conversions are indicative only, not checkout offers. */
(() => {
  'use strict';
  const lang=(document.documentElement.lang||'').toLowerCase().slice(0,2);
  if(lang!=='en'&&lang!=='es')return;
  const english=lang==='en',currency=english?'USD':'EUR',locale=english?'en-US':'es-ES';
  const money=new Intl.NumberFormat(locale,{style:'currency',currency});
  const pct=new Intl.NumberFormat(locale,{maximumFractionDigits:1});
  const brl=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
  const examples=english?{filament:20,energy:0.18,wear:0.25,asked:5}:{filament:18,energy:0.22,wear:0.25,asked:5};
  const t=english?{
    empty:'Enter the amount you would charge to compare.',invalid:'Check the fields: enter valid values within the indicated limits.',
    loss:n=>`At this price, the estimated loss is ${n} per part.`,
    below:(a,b,c)=>`Your estimated margin is ${a}%, below your ${b}% target. You are ${c} short per part.`,
    target:n=>`This price meets your target margin. Estimated margin: ${n}%.`,
    example:' Sample values are illustrative, not market quotations. The entire simulator uses USD.',
    pending:'License reference price: {BRL} (BRL). The indicative USD conversion is unavailable. Final price and payment currency are confirmed when ordering.',
    converted:'Indicative USD conversion using the rate dated {DATE}; license reference price: {BRL} (BRL). Final price and payment currency are confirmed when ordering.'
  }:{
    empty:'Introduce cuánto cobrarías para comparar.',invalid:'Revisa los campos: introduce valores válidos dentro de los límites.',
    loss:n=>`Con ese precio, la pérdida estimada es de ${n} por pieza.`,
    below:(a,b,c)=>`Tu margen estimado es del ${a}%, inferior al ${b}% deseado. Faltan ${c} por pieza.`,
    target:n=>`Ese precio alcanza el margen deseado. Margen estimado: ${n}%.`,
    example:' Los valores iniciales son ejemplos, no cotizaciones de mercado. Todo el simulador utiliza EUR.',
    pending:'Precio de referencia de la licencia: {BRL} (BRL). La conversión orientativa a EUR no está disponible. El precio final y la moneda de pago se confirman al realizar el pedido.',
    converted:'Conversión orientativa a EUR con el tipo de cambio de {DATE}; precio de referencia: {BRL} (BRL). El precio final y la moneda de pago se confirman al realizar el pedido.'
  };
  function amount(input){const n=input&&input.value.trim()!==''?input.valueAsNumber:0;return Number.isFinite(n)?Math.max(0,n):0;}
  function enhanceCalculator(){
    const form=document.getElementById('pc-form');
    if(!form||form.dataset.currencyEnhanced)return!!form;
    form.dataset.currencyEnhanced=currency;
    const units={filament:`${currency}/kg`,energy:`${currency}/kWh`,wear:`${currency}/${english?'hour':'h'}`,asked:english?'US$':'€'};
    Object.entries(units).forEach(([key,unit])=>{
      const input=form.elements.namedItem(key);
      if(!input)return;
      const span=input.closest('label')?.querySelector('span');
      if(span)span.textContent=unit;
      if(Object.hasOwn(examples,key))input.value=String(examples[key]);
    });
    const disclaimer=form.querySelector('.pc-disclaimer');
    if(disclaimer&&!disclaimer.dataset.currencyEnhanced){disclaimer.append(document.createTextNode(t.example));disclaimer.dataset.currencyEnhanced=currency;}
    const outputs=Object.fromEntries([...form.querySelectorAll('[data-out]')].map(el=>[el.dataset.out,el]));
    const bars=Object.fromEntries([...form.querySelectorAll('[data-bar]')].map(el=>[el.dataset.bar,el]));
    const feedback=form.querySelector('#pc-feedback');
    function render(){
      const invalid=[...form.querySelectorAll('input[required]')].some(el=>!el.value.trim()||!el.validity.valid)||!form.elements.namedItem('asked').validity.valid;
      const v=Object.fromEntries(['weight','hours','filament','watts','energy','wear','failure','margin','asked'].map(key=>[key,amount(form.elements.namedItem(key))]));
      const material=v.weight/1000*v.filament,electricity=v.watts/1000*v.hours*v.energy,wear=v.hours*v.wear;
      const base=material+electricity+wear,losses=base*v.failure/100,cost=base+losses,price=cost/(1-Math.min(v.margin,90)/100);
      const result={material,electricity,wear,losses,cost,price,profit:price-cost};
      Object.entries(outputs).forEach(([key,el])=>{el.textContent=invalid?'—':money.format(result[key]);});
      Object.entries(bars).forEach(([key,el])=>{el.style.width=invalid||cost<=0?'0%':(result[key]/cost*100)+'%';});
      if(!feedback)return;
      const actual=v.asked>0?(v.asked-cost)/v.asked*100:0;
      const status=invalid?'invalid':v.asked<=0?'empty':v.asked<cost-1e-7?'loss':v.asked<price-1e-7?'below':'target';
      feedback.className='pc-feedback-'+status;
      feedback.textContent=status==='invalid'?t.invalid:status==='empty'?t.empty:status==='loss'?t.loss(money.format(cost-v.asked)):status==='below'?t.below(pct.format(actual),pct.format(v.margin),money.format(price-v.asked)):t.target(pct.format(actual));
    }
    form.addEventListener('input',render);
    render();
    return true;
  }
  function parseBRL(text){
    const match=String(text||'').match(/R\$\s*([\d.,\s]+)/);
    if(!match)return null;
    let raw=match[1].trim().replace(/\s/g,'');
    const comma=raw.lastIndexOf(','),dot=raw.lastIndexOf('.');
    if(comma>dot)raw=raw.replace(/\./g,'').replace(',','.');
    else if(dot>comma)raw=raw.replace(/,/g,'');
    const result=Number(raw);
    return Number.isFinite(result)&&result>=0?result:null;
  }
  function enhanceLicense(){
    const nodes=[...document.querySelectorAll('[data-printly-price],[data-printly-price-split]')];
    if(!nodes.length)return;
    let priceBRL=nodes.map(node=>parseBRL(node.textContent)).find(n=>n!==null)??null;
    let fx=null,fxDate='';
    const notes=nodes.map(node=>{
      let note=node.nextElementSibling;
      if(!note||!note.classList.contains('printly-currency-note')){
        note=document.createElement('small');note.className='printly-currency-note';node.insertAdjacentElement('afterend',note);
      }
      return note;
    });
    function paint(){
      if(priceBRL===null)return;
      const converted=Number.isFinite(fx)&&fx>0;
      const shown=converted?`≈ ${money.format(priceBRL*fx)}`:`${brl.format(priceBRL)} (BRL)`;
      const notice=(converted?t.converted:t.pending).replace('{BRL}',brl.format(priceBRL)).replace('{DATE}',fxDate);
      nodes.forEach((node,i)=>{
        if(node.textContent!==shown)node.textContent=shown;
        if(notes[i].textContent!==notice)notes[i].textContent=notice;
      });
    }
    nodes.forEach(node=>{
      new MutationObserver(()=>{
        const newPrice=parseBRL(node.textContent);
        // The pricing backend can rewrite the same BRL price AFTER FX arrives.
        if(newPrice!==null){priceBRL=newPrice;paint();}
      }).observe(node,{subtree:true,childList:true,characterData:true});
    });
    paint();
    fetch(`https://api.frankfurter.dev/v2/rate/brl/${currency.toLowerCase()}`)
      .then(response=>{if(!response.ok)throw new Error('fx_unavailable');return response.json();})
      .then(data=>{
        if(String(data.base||'').toUpperCase()!=='BRL'||String(data.quote||'').toUpperCase()!==currency||!Number.isFinite(Number(data.rate))||Number(data.rate)<=0||!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date||'')))throw new Error('invalid_fx');
        fx=Number(data.rate);fxDate=data.date;paint();
      })
      .catch(()=>paint());
  }
  function init(){
    enhanceLicense();
    if(enhanceCalculator())return;
    const observer=new MutationObserver(()=>{if(enhanceCalculator())observer.disconnect();});
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();