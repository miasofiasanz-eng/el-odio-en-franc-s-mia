// Frente y dorso confirmados por la persona usuaria: 1+3 y 2+4.
(() => {
  const host=document.querySelector('#entradas');
  if(!host)return;
  const tickets=[{number:1,front:1,back:3},{number:2,front:2,back:4}];
  const sides=['front','front'];
  const source=(ticket,side)=>`assets/entradas/entrada-${ticket[side]}.jpg`;
  const sideName=side=>side==='front'?'FRENTE':'DORSO';
  host.innerHTML=`<div class="tickets-heading"><div><p class="eyebrow">EL ODIO EN FRANCÉS / EN VIVO</p><h2>CONSEGUÍ<br>TUS ENTRADAS.</h2></div><p>La bronca también nos encuentra<br>del mismo lado del escenario.</p></div>
    <div class="tickets-grid">${tickets.map((ticket,index)=>`<article class="ticket-card" data-ticket-card="${index}"><div class="ticket-top"><span>EL ODIO EN FRANCÉS</span><span>ENTRADA ${String(ticket.number).padStart(2,'0')}</span></div><button class="ticket-art" type="button" data-ticket="${index}" aria-label="Ver entrada ${ticket.number} en tamaño completo"><img src="${source(ticket,'front')}" alt="Frente de la entrada ${ticket.number} de El odio en francés" loading="lazy" decoding="async"><span>VER ENTRADA ↗</span></button><div class="ticket-face-controls"><span data-ticket-face>FRENTE / 01</span><button type="button" data-ticket-flip="${index}" aria-pressed="false" aria-label="Ver dorso de la entrada ${ticket.number}">VER DORSO ↻</button></div><div class="ticket-bottom"><span>FECHA Y LUGAR<br>POR CONFIRMAR</span><span class="ticket-sale">VENTA PRÓXIMAMENTE</span></div></article>`).join('')}</div>
    <div class="tickets-note"><span>EL ENCUENTRO ES AFUERA.</span><p>La agenda y los enlaces de compra van a estar disponibles acá.</p></div>
    <dialog class="ticket-dialog" aria-labelledby="ticket-title"><div class="ticket-dialog-top"><h3 id="ticket-title">ENTRADA 01</h3><button type="button" data-ticket-close aria-label="Cerrar entrada">×</button></div><img class="ticket-expanded" src="assets/entradas/entrada-1.jpg" alt=""><div class="ticket-dialog-bottom"><button type="button" data-ticket-step="-1" aria-label="Entrada anterior">←</button><button type="button" data-ticket-dialog-flip aria-pressed="false">VER DORSO ↻</button><span id="ticket-position">01 / 02</span><button type="button" data-ticket-step="1" aria-label="Entrada siguiente">→</button></div></dialog>`;
  const dialog=host.querySelector('dialog');let current=0,opener=null;
  function updateCard(index){
    const ticket=tickets[index],side=sides[index],card=host.querySelector(`[data-ticket-card="${index}"]`),img=card.querySelector('img'),button=card.querySelector('[data-ticket-flip]');
    img.src=source(ticket,side);img.alt=`${sideName(side)} de la entrada ${ticket.number} de El odio en francés`;
    card.querySelector('[data-ticket-face]').textContent=`${sideName(side)} / ${side==='front'?'01':'02'}`;
    button.textContent=side==='front'?'VER DORSO ↻':'VER FRENTE ↻';button.setAttribute('aria-pressed',String(side==='back'));button.setAttribute('aria-label',`Ver ${side==='front'?'dorso':'frente'} de la entrada ${ticket.number}`);
  }
  function show(index){
    current=(index+tickets.length)%tickets.length;const ticket=tickets[current],side=sides[current];
    host.querySelector('#ticket-title').textContent=`ENTRADA ${String(ticket.number).padStart(2,'0')} / ${sideName(side)}`;
    const img=host.querySelector('.ticket-expanded');img.src=source(ticket,side);img.alt=`${sideName(side)} original de la entrada ${ticket.number}, completo y sin recortes`;
    host.querySelector('#ticket-position').textContent=`${String(ticket.number).padStart(2,'0')} / 02`;
    const flip=host.querySelector('[data-ticket-dialog-flip]');flip.textContent=side==='front'?'VER DORSO ↻':'VER FRENTE ↻';flip.setAttribute('aria-pressed',String(side==='back'));
  }
  function flip(index){sides[index]=sides[index]==='front'?'back':'front';updateCard(index);if(dialog.open)show(index);}
  host.addEventListener('click',e=>{
    const button=e.target.closest('button');if(!button)return;
    if(button.dataset.ticket!==undefined){opener=button;show(Number(button.dataset.ticket));dialog.showModal();}
    else if(button.dataset.ticketFlip!==undefined)flip(Number(button.dataset.ticketFlip));
    else if(button.hasAttribute('data-ticket-dialog-flip'))flip(current);
    else if(button.hasAttribute('data-ticket-close'))dialog.close();
    else if(button.dataset.ticketStep)show(current+Number(button.dataset.ticketStep));
  });
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}});
  dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
})();
