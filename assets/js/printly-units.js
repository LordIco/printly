/* Printly public calculator: display-unit adapters over canonical grams, currency per kg, and watts. */
(() => {
  'use strict';
  const lang = (document.documentElement.lang || 'pt-BR').toLowerCase().slice(0, 2);
  const words = {
    pt: {mass:'Peso da peça',massUnit:'Unidade do peso',filament:'Preço do filamento',filamentUnit:'Unidade do preço do filamento',power:'Potência da máquina',powerUnit:'Unidade da potência',hint:'As unidades são convertidas automaticamente; W, kWh e horas são os mesmos em todos os idiomas.'},
    en: {mass:'Part weight',massUnit:'Weight unit',filament:'Filament price',filamentUnit:'Filament price unit',power:'Printer power',powerUnit:'Power unit',hint:'Units are converted automatically. W, kWh and hours work the same across languages.'},
    es: {mass:'Peso de la pieza',massUnit:'Unidad de peso',filament:'Precio del filamento',filamentUnit:'Unidad del precio del filamento',power:'Potencia de la impresora',powerUnit:'Unidad de potencia',hint:'Las unidades se convierten automáticamente. W, kWh y horas se mantienen iguales en todos los idiomas.'}
  };
  const t = words[lang] || words.pt;
  // Exact international avoirdupois units: 1 oz = 28.349523125 g; 1 lb = 453.59237 g.
  const grams = Object.freeze({g:1,kg:1000,oz:28.349523125,lb:453.59237});
  const originalMax = Object.freeze({weight:100000,filament:100000,watts:100000});
  const specs = [
    {key:'weight',units:['g','kg','oz','lb'],initial:'g',name:t.mass,unitName:t.massUnit,factor:unit=>grams[unit]},
    {key:'filament',units:['kg','lb'],initial:'kg',name:t.filament,unitName:t.filamentUnit,factor:unit=>1000/grams[unit]},
    {key:'watts',units:['W','kW'],initial:'W',name:t.power,unitName:t.powerUnit,factor:unit=>unit==='kW'?1000:1}
  ];
  function present(number) {
    if(!Number.isFinite(number)) return '';
    // Enough precision for unit round trips while avoiding long repeating decimal strings.
    return Number(number.toPrecision(12)).toString();
  }
  function init(form) {
    if(form.dataset.printlyUnitsReady) return;
    if(lang!=='pt' && form.dataset.currencyEnhanced !== (lang==='en'?'USD':'EUR')) return;
    const fields=[];
    for(const spec of specs) {
      const original=form.elements.namedItem(spec.key);
      const label=original && original.closest('label');
      if(!original || !label || !label.parentElement) return;
      fields.push({spec,original,label});
    }
    for(const {spec,original,label} of fields) {
      const unitLabel=document.createElement('label');
      unitLabel.className='pc-unit-field';
      const heading=document.createElement('span');
      heading.className='pc-unit-heading';
      heading.textContent=spec.name;
      const controls=document.createElement('span');
      controls.className='pc-unit-controls';
      const value=document.createElement('input');
      value.type='number';value.step='any';value.min='0';value.inputMode='decimal';
      value.className='pc-unit-value';value.setAttribute('aria-label',spec.name);
      const choice=document.createElement('select');
      choice.className='pc-unit-select';choice.setAttribute('aria-label',spec.unitName);
      for(const unit of spec.units){const option=document.createElement('option');option.value=unit;option.textContent=spec.key==='filament'?'/'+unit:unit;choice.appendChild(option);}
      choice.value=spec.initial;
      const setLimit=()=>{value.max=present(originalMax[spec.key]/spec.factor(choice.value));};
      const fromCanonical=()=>{
        const n=original.valueAsNumber;
        value.value=Number.isFinite(n)?present(n/spec.factor(choice.value)):'';
      };
      value.addEventListener('input',()=>{
        const n=value.valueAsNumber;
        const canonical=n*spec.factor(choice.value);
        // Keep original's constraint validation and the existing PT/EN/ES price engines authoritative.
        original.value=value.value.trim()!=='' && value.validity.valid && Number.isFinite(canonical)
          && canonical>=0 && canonical<=originalMax[spec.key]?present(canonical):'';
        original.dispatchEvent(new Event('input',{bubbles:true}));
      });
      choice.addEventListener('change',()=>{setLimit();fromCanonical();});
      controls.append(value,choice);unitLabel.append(heading,controls);
      label.insertAdjacentElement('afterend',unitLabel);
      label.hidden=true;
      setLimit();fromCanonical();
    }
    const note=document.createElement('p');
    note.className='pc-units-note';note.textContent=t.hint;
    const operating=form.querySelectorAll('.pc-fieldset')[1];
    if(operating)operating.insertAdjacentElement('afterend',note);
    form.dataset.printlyUnitsReady='true';
  }
  function boot(){
    const form=document.getElementById('pc-form');
    if(form && (lang==='pt' || form.dataset.currencyEnhanced === (lang==='en'?'USD':'EUR'))){init(form);return true;}
    return false;
  }
  function start(){
    if(boot())return;
    const observer=new MutationObserver(()=>{if(boot())observer.disconnect();});
    observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-currency-enhanced']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();