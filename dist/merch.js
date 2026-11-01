// Catálogo visual propuesto: sin precios, disponibilidad ni compra configurados.
(() => {
  const host = document.querySelector('#merch');
  if (!host) return;
  const products = [
    {id:'odio', type:'Remeras', name:'EL ODIO', lines:'EL ODIO<br>EN FRANCÉS.', shape:'shirt', tone:'dark', graphic:1, detail:'Una estampa al frente. Todo lo que llevás adentro, también afuera.'},
    {id:'fuerza', type:'Remeras', name:'LA BRONCA ES FUERZA', lines:'LA BRONCA<br>ES FUERZA.', shape:'shirt', tone:'paper', graphic:2, detail:'La bronca se comparte. Una gráfica de la banda para llevar puesta.'},
    {id:'aguantar', type:'Accesorios', name:'NO NACÍ PARA AGUANTAR', lines:'NO NACÍ<br>PARA<br>AGUANTAR.', shape:'tote', tone:'paper', detail:'Las palabras salen a la calle. Una propuesta de estampa para tote.'},
    {id:'futuro', type:'Afiches', name:'NOS QUITAN EL FUTURO', lines:'NOS PIDEN<br>PACIENCIA.<br>NOS QUITAN<br>EL FUTURO.', shape:'poster', tone:'red', detail:'Tipografía al frente. Una de las frases del muro convertida en pieza gráfica.'},
    {id:'eco', type:'Afiches', name:'NO TE PASA SOLO A VOS', lines:'NO TE PASA<br>SOLO<br>A VOS.', shape:'poster', tone:'dark', detail:'Una frase que hace eco. La identidad del muro, fuera de la pantalla.'},
    {id:'miradas', type:'Accesorios', name:'OTRAS MIRADAS', lines:'OTRAS<br>MIRADAS.', shape:'stickers', tone:'paper', graphic:5, detail:'Ojos, trazos y señales. Los doodles originales como propuesta de stickers.'},
  ];
  let category='Todos', selected='futuro', printOnly=false;
  const filtered=()=>products.filter(p=>category==='Todos'||p.type===category);
  const item=()=>products.find(p=>p.id===selected);
  const number=p=>String(products.indexOf(p)+1).padStart(2,'0');
  function art(p,large=false){
    return `<div class="merch-object ${printOnly&&large?'print':p.shape} tone-${p.tone}"><div class="merch-print">${p.graphic?`<img src="assets/doodles/grafismo-${p.graphic}.png" alt="" aria-hidden="true" decoding="async">`:`<strong>${p.lines}</strong>`}<span>EL ODIO EN FRANCÉS</span></div></div>`;
  }
  function render(){
    const p=item(), visible=filtered(), index=visible.indexOf(p);
    host.innerHTML=`<div class="merch-heading"><div><p class="eyebrow">MERCH / EL ODIO EN FRANCÉS</p><h2>EL ODIO SE LLEVA.</h2></div><p>Lo que sentís también se lleva puesto.<br>Gráficas que salen del muro a la calle.</p></div>
      <div class="merch-filters" role="group" aria-label="Filtrar merch">${['Todos','Remeras','Afiches','Accesorios'].map(c=>`<button type="button" data-merch-filter="${c}" aria-pressed="${category===c}">${category===c?'[ ':''}${c.toUpperCase()}${category===c?' ]':''}</button>`).join('')}</div>
      <div class="merch-catalog"><div class="merch-meta"><span>EL ODIO EN FRANCÉS / COLECCIÓN</span><span id="merch-selection">${p.type.toUpperCase()} / ${p.name}</span><span>PROPUESTA VISUAL</span></div>
      <div class="merch-layout"><div class="merch-grid" role="group" aria-label="Productos de merch">${visible.map(product=>`<button type="button" class="merch-card ${selected===product.id?'is-selected':''}" data-merch-product="${product.id}" aria-pressed="${selected===product.id}" aria-label="Ver ${product.type}: ${product.name}"><span class="merch-card-meta">${number(product)} / ${product.type.toUpperCase()}</span><div class="merch-thumbnail">${art(product)}</div><strong>${product.name}</strong><small>${selected===product.id?'[ VIENDO → ]':'VER PIEZA ↗'}</small></button>`).join('')}</div>
      <div class="merch-viewer"><div class="merch-viewer-top"><span>${number(p)} / ${p.type.toUpperCase()}</span><div><button type="button" data-merch-step="-1" aria-label="Producto anterior" ${visible.length<2?'disabled':''}>←</button><button type="button" data-merch-step="1" aria-label="Producto siguiente" ${visible.length<2?'disabled':''}>→</button></div></div><div class="merch-stage" role="img" aria-label="Propuesta visual: ${p.name}"><span class="merch-stage-label">EL ODIO EN FRANCÉS / ${printOnly?'ESTAMPA':'MERCH'}</span>${art(p,true)}<span class="merch-stage-bottom">LA BRONCA SE COMPARTE.</span></div><div class="merch-caption"><span>${String(index+1).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')}</span><span>DE ADENTRO HACIA AFUERA.</span></div></div></div>
      <div class="merch-bottom"><div><strong aria-live="polite">${p.name}</strong><p>${p.detail}</p></div><button type="button" class="merch-view-toggle" data-merch-toggle aria-pressed="${printOnly}">${printOnly?'VER PIEZA':'VER ESTAMPA'} <span>↗</span></button><div class="merch-availability">PRÓXIMAMENTE<span>Precios y disponibilidad por confirmar.</span></div></div></div>
      <div class="merch-end"><span>GRÁFICAS PARA LLEVAR LO QUE SENTÍS.</span><a href="./">VOLVER AL INICIO ↑</a></div>`;
  }
  host.addEventListener('click',e=>{
    const button=e.target.closest('button');
    if(!button)return;
    if(button.dataset.merchFilter){category=button.dataset.merchFilter;if(!filtered().some(p=>p.id===selected))selected=filtered()[0].id;}
    else if(button.dataset.merchProduct)selected=button.dataset.merchProduct;
    else if(button.dataset.merchStep){const list=filtered();selected=list[(list.findIndex(p=>p.id===selected)+Number(button.dataset.merchStep)+list.length)%list.length].id;}
    else if(button.hasAttribute('data-merch-toggle'))printOnly=!printOnly;
    else return;
    const focusKey=button.dataset.merchFilter?`[data-merch-filter="${category}"]`:button.dataset.merchProduct?`[data-merch-product="${selected}"]`:button.dataset.merchStep?`[data-merch-step="${button.dataset.merchStep}"]`:'[data-merch-toggle]';
    render();host.querySelector(focusKey)?.focus({preventScroll:true});
  });
  render();
})();
