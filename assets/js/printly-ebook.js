/* Printly e-books — PT / EN / ES
 * Public links are served by GitHub Pages. Contact data is stored only by the
 * Supabase Edge Function; never expose a service-role key in this file. */
(()=>{
"use strict";
const endpoint="https://uiesczevcmkzdtybxuez.supabase.co/functions/v1/printly-ebook";
const pdfs={
 pt:"/downloads/ebooks/printly_ebook_7_erros_impressao_3d_pt.pdf",
 en:"/downloads/ebooks/printly_ebook_7_mistakes_3d_printing_en.pdf",
 es:"/downloads/ebooks/printly_ebook_7_mistakes_3d_printing_es.pdf"
};
const texts={
 pt:{email:"Informe um endereço de e-mail válido.",loading:"Preparando seu download…",ready:"Seu e-book está pronto. Se não abrir automaticamente, use o link abaixo.",backup:"Baixar PDF agora",error:"Não foi possível registrar sua solicitação. Tente novamente ou utilize o download direto abaixo.",preview:"Esta é apenas uma prévia. O download estará disponível no site oficial."},
 en:{email:"Please enter a valid email address.",loading:"Preparing your download…",ready:"Your guide is ready. If it doesn't download automatically, use the link below.",backup:"Download PDF now",error:"We couldn't register your request. Please try again or use the direct download below.",preview:"This is a preview. Downloads will be available on the official website."},
 es:{email:"Introduce una dirección de correo válida.",loading:"Preparando la descarga…",ready:"Tu guía está lista. Si no se descarga automáticamente, utiliza el enlace de abajo.",backup:"Descargar PDF ahora",error:"No pudimos registrar tu solicitud. Vuelve a intentarlo o utiliza la descarga directa.",preview:"Esta es una vista previa. Las descargas estarán disponibles en el sitio oficial."}
};
function show(form,txt,url){
 const status=form.querySelector(".printly-ebook-status");
 status.replaceChildren(document.createTextNode(txt));
 if(url){
  const link=document.createElement("a");link.href=url;link.download="";link.className="printly-ebook-direct";link.textContent=texts[form.dataset.locale]?.backup||texts.pt.backup;status.append(" ",link);
 }
}
document.querySelectorAll(".printly-ebook-form").forEach(form=>{
 const locale=pdfs[form.dataset.locale]?form.dataset.locale:"pt";
 const t=texts[locale],input=form.querySelector('input[name="email"]'),button=form.querySelector('button[type="submit"]');
 form.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!input.checkValidity()){input.reportValidity();show(form,t.email);return;}
  if(window.location.hostname!=="useprintly.com.br" && window.location.hostname!=="www.useprintly.com.br"){
    show(form,t.preview);return;
  }
  const email=input.value.trim().toLowerCase();
  if(email.length>254){show(form,t.email);return;}
  button.disabled=true;show(form,t.loading);
  try{
   const controller=new AbortController();
   const timeout=setTimeout(()=>controller.abort(),12000);
   let response;
   try{response=await fetch(endpoint,{method:"POST",mode:"cors",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,locale,marketingConsent:form.querySelector('input[name="marketingConsent"]').checked,website:form.querySelector('input[name="website"]').value}),signal:controller.signal})}
   finally{clearTimeout(timeout)}
   const result=await response.json();
   if(!response.ok||!result.ok||!result.downloadUrl)throw new Error("Lead registration unavailable");
   const url=pdfs[locale];
   show(form,t.ready,url);
   const a=document.createElement("a");a.href=url;a.download=url.split("/").pop();a.hidden=true;document.body.appendChild(a);a.click();a.remove();
  }catch(error){show(form,t.error,pdfs[locale]);}
  finally{button.disabled=false;}
 });
});
})();