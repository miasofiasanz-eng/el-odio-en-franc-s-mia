// Las imágenes son originales; agenda y enlaces de venta aún por confirmar.
(() => {
  const host=document.querySelector('#entradas');
  if(!host)return;
  const tickets=[1,2,3,4].map(number=>({number,src:`assets/entradas/entrada-${number}.jpg`}));
  host.innerHTML=`<div class="tickets-heading"><div><p class="eyebrow">EL ODIO EN FRANCÉS / EN VIVO</p><h2>CONSEGUÍ<br>TUS ENTRADAS.</h2></div><p>La bronca también nos encuentra<br>del mismo lado del escenario.</p></div>
    <div class="tickets-grid">${tickets.map(ticket=>`<article class="ticket-card"><div class="ticket-top"><span>EL ODIO EN FRANCÉS</span><span>ENTRADA ${String(ticket.number).padStart(2,'0')}</span></div><button class="ticket-art" type="button" data-ticket="${ticket.number}" aria-label="Ver entrada ${ticket.number} en tamaño completo"><img src="${ticket.src}" alt="Diseño original de la entrada ${ticket.number} de El odio en francés" loading="lazy" decoding="async"><span>VER ENTRADA ↗</span></button><div class="ticket-bottom"><span>FECHA Y LUGAR<br>POR CONFIRMAR</span><span class="ticket-sale">VENTA PRÓXIMAMENTE</span></div></article>`).join('')}</div>
    <div class="tickets-note"><span>EL ENCUENTRO ES AFUERA.</span><p>La agenda y los enlaces de compra van a estar disponibles acá.</p></div>
    <dialog class="ticket-dialog" aria-labelledby="ticket-title"><div class="ticket-dialog-top"><h3 id="ticket-title">ENTRADA 01</h3><button type="button" data-ticket-close aria-label="Cerrar entrada">×</button></div><img class="ticket-expanded" src="assets/entradas/entrada-1.jpg" alt=""><div class="ticket-dialog-bottom"><button type="button" data-ticket-step="-1" aria-label="Entrada anterior">←</button><span id="ticket-position">01 / 04</span><button type="button" data-ticket-step="1" aria-label="Entrada siguiente">→</button></div></dialog>`;
  const dialog=host.querySelector('dialog');let current=0,opener=null;
  function show(index){current=(index+tickets.length)%tickets.length;const ticket=tickets[current];host.querySelector('#ticket-title').textContent=`ENTRADA ${String(ticket.number).padStart(2,'0')} / EL ODIO EN FRANCÉS`;const img=host.querySelector('.ticket-expanded');img.src=ticket.src;img.alt=`Diseño original de la entrada ${ticket.number}, completo y sin recortes`;host.querySelector('#ticket-position').textContent=`${String(ticket.number).padStart(2,'0')} / 04`;}
  host.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;if(button.dataset.ticket){opener=button;show(Number(button.dataset.ticket)-1);dialog.showModal();}else if(button.hasAttribute('data-ticket-close'))dialog.close();else if(button.dataset.ticketStep)show(current+Number(button.dataset.ticketStep));});
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}});
  dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
})();
