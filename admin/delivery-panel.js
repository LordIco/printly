(()=>{
const nav=document.querySelector('#app .nav'),main=document.querySelector('#app .main');if(!nav||!main)return;
const button=document.createElement('button');button.type='button';button.textContent='Entrega de licenças';nav.append(button);
const section=document.createElement('section');section.id='deliveryPanel';section.className='section';
section.innerHTML='<div class="card"><div class="head"><h3>Envio de licenças — Eduzz e IcoLabs</h3></div><p class="muted">Envios de vendas Eduzz e licenças criadas manualmente para testers, influenciadores, parceiros e convidados. Nunca é gerada outra chave ao reenviar.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0"><button id="deliveryRefresh" class="btn" type="button">Atualizar entregas</button><button id="deliveryTest" class="btn primary" type="button">Enviar e-mail de teste (ico@terra.com.br)</button></div><div class="tablewrap"><table><thead><tr><th>Cliente / E-mail</th><th>Modalidade</th><th>Validade</th><th>Envio</th><th>Ação</th></tr></thead><tbody id="deliveryBody"></tbody></table></div><p id="deliveryInfo" class="muted"></p></div>';main.append(section);
const $=id=>document.getElementById(id);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>{if(!x)return 'Permanente';const d=new Date(x);return Number.isNaN(d.valueOf())?'—':d.toLocaleDateString('pt-BR')};
const eligible=l=>l.source==='eduzz'||(l.source==='admin_panel'&&!l.external_order_id);
async function call(body){
 const r=await sb.functions.invoke('printly-license-delivery-admin',{body});
 if(r.error){let message=r.error.message;try{const data=await r.error.context?.json();message=data?.detail||data?.error||message}catch{}throw Error(message)}
 if(r.data?.error)throw Error(r.data.detail||r.data.error);
 return r.data;
}
window.printlyEmailCreatedLicense=async licenseId=>call({action:'manual_send',license_id:licenseId,confirmation:'ENVIAR'});
async function load(){
 $('deliveryInfo').textContent='Consultando licenças e entregas...';
 try{
 const response=await api({action:'list',limit:500,search:''});
 const licenses=(response.licenses||[]).filter(eligible);
 const result=await call({action:'status',ids:licenses.map(l=>l.id)});
 const statuses=new Map((result.rows||[]).map(x=>[x.license_id,x]));
 $('deliveryBody').innerHTML=licenses.map(l=>{
 const row=statuses.get(l.id),state=row?.status||'not_sent',manual=l.source!=='eduzz';
 const statusText={sent:'Enviado',failed:'Falhou',sending:'Enviando...',pending:'Pendente',not_sent:'Não enviado'}[state]||state;
 const err=state==='failed'&&row?.last_error?'<small class="muted" style="display:block">'+esc(row.last_error)+'</small>':'';
 const allowed=l.status==='active'&&(!l.expires_at||new Date(l.expires_at).getTime()>Date.now())&&state!=='sending';
 const action=manual?(state==='sent'?'manual_resend':'manual_send'):'resend';
 const label=manual?(state==='sent'?'Reenviar licença':'Enviar licença'):'Reenviar licença';
 const info=state==='sent'&&row?.sent_at?'<small class="muted" style="display:block">'+fmt(row.sent_at)+'</small>':'';
 return '<tr><td>'+esc(l.customer_name)+'<br><span class="muted">'+esc(l.customer_email)+'</span></td><td>'+esc(manual?l.license_type+' · IcoLabs':'Comercial · Eduzz')+'</td><td>'+esc(fmt(l.expires_at))+'</td><td>'+esc(statusText)+info+err+'</td><td><button type="button" class="btn small" data-delivery="'+esc(l.id)+'" data-action="'+action+'" '+(allowed?'':'disabled')+'>'+label+'</button></td></tr>';
 }).join('')||'<tr><td colspan="5">Nenhuma licença cadastrada.</td></tr>';
 $('deliveryInfo').textContent=licenses.length+' licença(s) consultada(s). O status Enviado confirma a aceitação pelo Resend; a entrega final depende do provedor do destinatário.';
 }catch(e){$('deliveryInfo').textContent='Erro ao consultar entregas: '+e.message}
}
button.onclick=async()=>{
 nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===button));
 document.querySelectorAll('#app .section').forEach(s=>s.classList.remove('active'));
 section.classList.add('active');$('title').textContent='Entrega de licenças';
 if(typeof current!=='undefined')current='deliveries';
 await load();
};
$('deliveryRefresh').onclick=load;
$('deliveryTest').onclick=async()=>{
 if(!confirm('Enviar e-mail de teste para ico@terra.com.br? Nenhuma licença será criada.'))return;
 const btn=$('deliveryTest');btn.disabled=true;
 try{const r=await sb.functions.invoke('printly-resend-test',{body:{action:'test_email',confirmation:'TESTAR_RESEND'}});
 if(r.error){let message=r.error.message;try{const d=await r.error.context.json();message=d.detail||d.error||message}catch{}throw Error(message)}
 if(!r.data?.ok)throw Error(r.data?.detail||r.data?.error||'Falha no teste');
 alert('Resend aceitou o teste para ico@terra.com.br. Confira a caixa de entrada e spam.');
 }catch(e){alert('Erro ao enviar o teste: '+e.message)}finally{btn.disabled=false}
};
$('deliveryBody').onclick=async e=>{
 const btn=e.target.closest('[data-delivery]');if(!btn||btn.disabled)return;
 const action=btn.dataset.action,id=btn.dataset.delivery;
 const confirmation=action==='manual_send'?'ENVIAR':'REENVIAR';
 const message=action==='manual_send'?'Enviar a chave original para o e-mail cadastrado nessa licença?':'Reenviar a chave original para o e-mail cadastrado?';
 if(!confirm(message))return;
 btn.disabled=true;
 try{await call({action,license_id:id,confirmation});alert('Resend aceitou o e-mail. Confira o status de entrega.');await load()}
 catch(err){alert('Não foi possível enviar: '+err.message);await load()}finally{btn.disabled=false}
};
})();