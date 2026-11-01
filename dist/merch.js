// Catálogo visual propuesto: sin precios, disponibilidad ni compra configurados.
(() => {
  const host = document.querySelector('#merch');
  if (!host) return;
  const products = [
    {id:'odio', type:'Remeras', name:'EL ODIO', lines:'EL ODIO<br>EN FRANCÉS.', shape:'shirt', tone:'dark', graphic:1, detail:'Una estampa al frente. Todo lo que llevás adentro, también afuera.'},
    {id:'fuerza', type:'Remeras', name:'LA BRONCA ES FUERZA', lines:'LA BRONCA<br>ES FUERZA.', shape:'shirt', tone:'paper', graphic:2, detail:'La bronca se comparte. Una gráfica de la banda para llevar puesta.'},
    {id:'naipes', type:'Accesorios', name:'NAIPES / EL ODIO', image:'assets/merch/naipes-y-sobre.png', width:1898, height:1261, alt:'Conjunto original de naipes intervenidos de El odio en francés junto al frente y reverso de su sobre.', detail:'El juego también se interviene. Naipes de la banda y su sobre, en una misma pieza.'},
    {id:'futuro', type:'Afiches', name:'EL ODIO EN FRANCÉS', image:'assets/merch/afiche-el-odio.png', alt:'Afiche original de El odio en francés: figura intervenida con tramas, grafismos y la frase La bronca compartida es fuerza.', detail:'Afiche original de la banda. La bronca compartida es fuerza.'},
    {id:'eco', type:'Afiches', name:'¿QUÉ ES LO QUE TE CONSUME?', image:'assets/merch/afiche-que-te-consume.png', alt:'Afiche original con un torso abierto por una franja roja e hilos y la pregunta ¿Qué es lo que te consume?', detail:'Afiche original de la banda. Dejá que brote tu oscuridad.'},
    {id:'miradas', type:'Accesorios', name:'OTRAS MIRADAS', lines:'OTRAS<br>MIRADAS.', shape:'stickers', tone:'paper', graphic:5, detail:'Ojos, trazos y señales. Los doodles originales como propuesta de stickers.'},
    {id:'cd', type:'Discos', name:'CD / EL ODIO EN FRANCÉS', image:'assets/merch/cd-el-odio.png', width:1210, height:1210, format:'disc', alt:'CD de El odio en francés con un ojo en blanco y negro y letras rojas alrededor del disco.', detail:'El sonido también tiene cuerpo. CD de la banda con su gráfica original.'},
  ];
  let category='Todos', selected='futuro', printOnly=false;
  const filtered=()=>products.filter(p=>category==='Todos'||p.type===category);
  const item=()=>products.find(p=>p.id===selected);
  const number=p=>String(products.indexOf(p)+1).padStart(2,'0');
  function art(p,large=false){
    if(p.image)return `<div class="merch-original ${p.format==='disc'?'is-disc':''}"><img src="${p.image}" alt="${large?p.alt:''}" ${large?'':'aria-hidden="true"'} decoding="async" width="${p.width||(p.id==='futuro'?1014:1013)}" height="${p.height||1434}"></div>`;
    return `<div class="merch-object ${printOnly&&large?'print':p.shape} tone-${p.tone}"><div class="merch-print">${p.graphic?`<img src="assets/doodles/grafismo-${p.graphic}.png" alt="" aria-hidden="true" decoding="async">`:`<strong>${p.lines}</strong>`}<span>EL ODIO EN FRANCÉS</span></div></div>`;
  }
  function render(){
    const p=item(), visible=filtered(), index=visible.indexOf(p);
    host.innerHTML=`<div class="merch-heading"><div><p class="eyebrow">MERCH / EL ODIO EN FRANCÉS</p><h2>EL ODIO SE LLEVA.</h2></div><p>Lo que sentís también se lleva puesto.<br>Gráficas que salen del muro a la calle.</p></div>
      <div class="merch-filters" role="group" aria-label="Filtrar merch">${['Todos','Remeras','Afiches','Accesorios','Discos'].map(c=>`<button type="button" data-merch-filter="${c}" aria-pressed="${category===c}">${category===c?'[ ':''}${c.toUpperCase()}${category===c?' ]':''}</button>`).join('')}</div>
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
