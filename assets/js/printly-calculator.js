/* Printly · simulador público independente · não utiliza banco de dados do aplicativo. */
(function (root) {
  'use strict';

  const defaults = Object.freeze({weight:85,hours:6,filament:110,watts:150,energy:0.95,wear:1.2,failure:8,margin:40,asked:25});
  const limits = Object.freeze({weight:100000,hours:10000,filament:100000,watts:100000,energy:1000,wear:100000,failure:100,margin:90,asked:100000000});
  const money = new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'});
  const pct = new Intl.NumberFormat('pt-BR', {maximumFractionDigits:1});

  function parseNumber(value, max) {
    if (typeof value === 'string') {
      value = value.trim().replace(/\s/g, '');
      // Supports decimal comma (e.g. 0,95) and conventional 0.95.
      if (value.includes(',')) value = value.replace(/\./g,'').replace(',','.');
    }
    const n = Number(value);
    return Number.isFinite(n) ? Math.min(Math.max(n,0),max) : 0;
  }
  function calculate(input) {
    const v = {};
    for (const key of Object.keys(defaults)) v[key] = parseNumber(input[key] ?? defaults[key],limits[key]);
    const material = v.weight/1000*v.filament;
    const electricity = v.watts/1000*v.hours*v.energy;
    const wear = v.hours*v.wear;
    const base = material + electricity + wear;
    // Simple percentage provision, NOT a stochastic expectation of repeated failed prints.
    const losses = base*v.failure/100;
    const cost = base+losses;
    const price = cost/(1-v.margin/100);
    const profit = price-cost;
    const actualMargin = v.asked > 0 ? (v.asked-cost)/v.asked*100 : null;
    let status = 'empty';
    if (v.asked > 0 && v.asked < cost-0.0000001) status='loss';
    else if (v.asked > 0 && v.asked < price-0.0000001) status='below';
    else if (v.asked > 0) status='target';
    return {inputs:v, material,electricity,wear,losses,cost,price,profit,actualMargin,status};
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = {calculate,parseNumber,defaults};
  if (!root.document) return;
  const doc = root.document;
  const hero = doc.querySelector('.hero');
  const slot = hero && hero.querySelector('.hero-visual');
  if (!slot || doc.getElementById('printly-public-calculator')) return;
  // Preserve page structure, gallery, licensing and original CTA; modify only hero visual.
  slot.classList.add('hero-calculator-slot');
  slot.innerHTML = `
  <section class="pc-calc" id="printly-public-calculator" aria-labelledby="pc-title">
    <header class="pc-calc-head">
      <span class="pc-calc-kicker">SIMULADOR GRATUITO · IMPRESSÃO 3D</span>
      <h2 id="pc-title">Quanto custa sua peça?</h2>
      <p>Experimente com seus números. O resultado muda na hora.</p>
    </header>
    <form id="pc-form" novalidate>
      <fieldset class="pc-fieldset">
        <legend>01 · Dados da impressão</legend>
        <div class="pc-fields">
          <label>Peso da peça <span>g</span><input name="weight" type="number" min="0" max="100000" step="any" inputmode="decimal" value="85" required></label>
          <label>Tempo de impressão <span>horas</span><input name="hours" type="number" min="0" max="10000" step="any" inputmode="decimal" value="6" required></label>
        </div>
      </fieldset>
      <fieldset class="pc-fieldset">
        <legend>02 · Custos operacionais</legend>
        <div class="pc-fields">
          <label>Filamento <span>R$/kg</span><input name="filament" type="number" min="0" max="100000" step="any" inputmode="decimal" value="110" required></label>
          <label>Potência da máquina <span>W</span><input name="watts" type="number" min="0" max="100000" step="any" inputmode="decimal" value="150" required></label>
          <label>Energia <span>R$/kWh</span><input name="energy" type="number" min="0" max="1000" step="any" inputmode="decimal" value="0.95" required></label>
          <label>Desgaste da máquina <span>R$/h</span><input name="wear" type="number" min="0" max="100000" step="any" inputmode="decimal" value="1.2" required></label>
        </div>
      </fieldset>
      <fieldset class="pc-fieldset">
        <legend>03 · Formação do preço</legend>
        <div class="pc-fields">
          <label>Provisão de perdas <span>%</span><input name="failure" type="number" min="0" max="100" step="any" inputmode="decimal" value="8" required></label>
          <label>Margem desejada <span>% sobre venda</span><input name="margin" type="number" min="0" max="90" step="any" inputmode="decimal" value="40" required></label>
        </div>
      </fieldset>
      <div class="pc-result" aria-label="Resultado da simulação">
        <div class="pc-result-label">COMPOSIÇÃO DO CUSTO</div>
        <div class="pc-stack" role="img" aria-label="Distribuição de custos"><span data-bar="material"></span><span data-bar="electricity"></span><span data-bar="wear"></span><span data-bar="losses"></span></div>
        <div class="pc-legend"><span>Material <b data-out="material"></b></span><span>Energia <b data-out="electricity"></b></span><span>Desgaste <b data-out="wear"></b></span><span>Perdas <b data-out="losses"></b></span></div>
        <div class="pc-totals"><div>Custo total <strong data-out="cost"></strong></div><div>Lucro estimado <strong data-out="profit"></strong></div></div>
        <div class="pc-price"><span>PREÇO SUGERIDO</span><strong data-out="price" aria-live="polite" aria-atomic="true"></strong></div>
      </div>
      <div class="pc-compare">
        <label for="pc-asked">E você, quanto cobraria por esta peça? <span>R$</span></label>
        <input id="pc-asked" name="asked" type="number" min="0" max="100000000" step="any" inputmode="decimal" value="25">
        <p id="pc-feedback" role="status" aria-live="polite" aria-atomic="true"></p>
      </div>
      <button class="pc-cta" id="pc-cta" type="button">Experimente o Printly completo por 15 dias <span aria-hidden="true">↗</span></button>
      <p class="pc-disclaimer">Simulação simplificada de filamento (FDM). As perdas são uma provisão percentual; o aplicativo inclui outros componentes e opções de cálculo.</p>
    </form>
  </section>`;
  const form = doc.getElementById('pc-form');
  const outputs = Object.fromEntries([...slot.querySelectorAll('[data-out]')].map(el => [el.dataset.out,el]));
  const bars = Object.fromEntries([...slot.querySelectorAll('[data-bar]')].map(el => [el.dataset.bar,el]));
  const feedback = doc.getElementById('pc-feedback');

  function render() {
    const raw = Object.fromEntries(new FormData(form));
    const result = calculate(raw);
    const invalid = [...form.querySelectorAll('input[required]')].some(el => !el.value.trim() || !el.validity.valid);
    for (const key of Object.keys(outputs)) outputs[key].textContent = invalid ? '—' : money.format(result[key]);
    for (const key of Object.keys(bars)) bars[key].style.width = invalid || result.cost===0 ? '0%' : (result[key]/result.cost*100)+'%';
    feedback.className = invalid ? 'pc-feedback-invalid' : 'pc-feedback-'+result.status;
    if (invalid) feedback.textContent = 'Revise os campos: informe valores válidos dentro dos limites apresentados.';
    else if (result.status==='empty') feedback.textContent='Informe o valor que cobraria para comparar.';
    else if (result.status==='loss') feedback.textContent='Nesse preço, o prejuízo estimado é de '+money.format(result.cost-result.inputs.asked)+' por peça.';
    else if (result.status==='below') feedback.textContent='Sua margem estimada é de '+pct.format(result.actualMargin)+'%, abaixo dos '+pct.format(result.inputs.margin)+'% desejados. Faltam '+money.format(result.price-result.inputs.asked)+' por peça.';
    else feedback.textContent='Esse preço alcança a margem desejada. Margem estimada: '+pct.format(result.actualMargin)+'%.';
  }
  form.addEventListener('input',render);
  form.addEventListener('submit',event=>event.preventDefault());
  doc.getElementById('pc-cta').addEventListener('click',()=>{
    const original = doc.querySelector('.hero-actions [data-open-download]') || doc.querySelector('[data-open-download]');
    if (original) original.click();
  });
  render();
})(typeof window === 'undefined' ? {} : window);
