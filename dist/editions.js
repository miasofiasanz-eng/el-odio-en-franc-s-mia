// Los PNG originales permanecen intactos. Las composiciones y ediciones son locales.
(() => {
  const host=document.querySelector('#ediciones');
  if(!host)return;
  const templates=[
    [1,'AGUANTÁ'],[2,'ORDEN'],[3,'TOCAR'],[4,'ESPERÁ'],[5,'SIEMPRE'],[6,'NO'],[7,'NUNCA'],[8,'HASTA ACÁ'],[9,'MUERTO'],[10,'NORMAL'],[11,'¿POR QUÉ?'],[12,'MATEN'],[13,'FALSO'],[16,'FLECHA'],[17,'APROBADO'],[18,'CANDADO'],[19,'TELEVISIÓN'],[20,'EXCLAMACIÓN'],[21,'OJO ABIERTO'],[22,'OJO CERRADO']
  ].map(([id,name])=>({id,name,category:id<16?'Palabras':'Símbolos',src:`assets/stencils/stencil-${id}.png`}));
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone=value=>JSON.parse(JSON.stringify(value));
  const key='eof-ediciones-v1',draftKey='eof-edicion-borrador-v1';
  let category='Todos',page=0,layers=[],selection=null,name='Mi edición',editionId=null,undo=[],redo=[],drag=null,returnFocus=null,loading=null,exporting=false;
  const assets=new Map();
  const template=id=>templates.find(t=>t.id===Number(id));
  const selected=()=>layers.find(l=>l.uid===selection);
  const uuid=()=>crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
  function readSaved(){try{const list=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(list)?list.filter(e=>e&&typeof e.id==='string'&&typeof e.name==='string'&&Array.isArray(e.layers)).slice(-8):[]}catch{return[]}}
  function validLayers(input){return Array.isArray(input)?input.slice(0,12).filter(l=>l&&template(l.template)&&['x','y','w','angle'].every(k=>Number.isFinite(l[k]))).map(l=>({uid:uuid(),template:Number(l.template),x:l.x,y:l.y,w:Math.max(20,Math.min(180,l.w)),angle:Math.max(-180,Math.min(180,l.angle))})):[]}
  function catalog(){
    const list=templates.filter(t=>category==='Todos'||t.category===category),pages=Math.ceil(list.length/9);
    page=Math.min(page,pages-1);
    host.innerHTML=`<div class="editions-heading"><div><p class="eyebrow">04 / DE LA PANTALLA A LA CALLE</p><h2>Tus ediciones.</h2></div><p>Elegí una plantilla. Cruzá palabras y grafismos.<br>Imprimí tu edición y llevala al evento.</p></div>
      <div class="edition-path"><span><b>01</b> ELEGÍ</span><span><b>02</b> COMBINÁ</span><span><b>03</b> IMPRIMÍ E INTERVENÍ</span></div>
      <div class="editions-catalog"><aside class="edition-sidebar"><h3>Stencils</h3><div class="edition-filter-list" role="group" aria-label="Filtrar stencils">${['Todos','Palabras','Símbolos'].map(c=>`<button type="button" data-ed-filter="${c}" aria-pressed="${category===c}">${c.toUpperCase()}</button>`).join('')}</div><button class="edition-start" type="button" data-ed-new>+ CREAR DESDE CERO ↗</button><button class="edition-start" type="button" data-ed-resume>CONTINUAR BORRADOR ↗</button></aside>
      <div class="edition-template-grid">${list.slice(page*9,page*9+9).map(t=>`<button type="button" class="edition-template" data-ed-apply="${t.id}" aria-label="Aplicar stencil ${esc(t.name)}"><small>${String(t.id).padStart(2,'0')}</small><img src="${t.src}" alt="" loading="lazy" decoding="async"><strong>${esc(t.name)}</strong><span>APLICAR ↗</span></button>`).join('')}</div></div>
      <div class="editions-catalog-foot"><span>SELECCIONÁ UNA PIEZA PARA INTERVENIRLA / ${templates.length} STENCILS</span><div class="editions-pagination"><button type="button" data-ed-page="-1" aria-label="Stencils anteriores" ${page===0?'disabled':''}>←</button><span>${String(page+1).padStart(2,'0')} / ${String(pages).padStart(2,'0')}</span><button type="button" data-ed-page="1" aria-label="Stencils siguientes" ${page===pages-1?'disabled':''}>→</button></div></div>
      <div class="edition-saved-heading"><h3>Tus ediciones guardadas</h3><p>En este navegador · hasta 8 ediciones</p></div><div class="edition-saved-grid">${readSaved().reverse().map(e=>`<button type="button" class="edition-saved-card" data-ed-open="${esc(e.id)}">${typeof e.preview==='string'&&e.preview.startsWith('data:image/png;base64,')?`<img src="${e.preview}" alt="Vista previa de ${esc(e.name)}">`:''}<strong>${esc(e.name)}</strong><span>SEGUIR EDITANDO ↗</span></button>`).join('')||'<p class="edition-empty">Lo que hagas también deja una marca. Guardá tu primera edición.</p>'}</div>`;
  }
  const dialog=document.createElement('dialog');
  dialog.className='editions-editor';dialog.id='editions-editor';dialog.setAttribute('aria-labelledby','edition-editor-title');
  dialog.innerHTML=`<header class="edition-editor-header"><div><h2 id="edition-editor-title">Tu edición, tu marca.</h2><p>EL ODIO EN FRANCÉS / TALLER DE STENCILS</p></div><button type="button" data-edit="close" aria-label="Cerrar editor">×</button></header>
    <div class="edition-workspace"><aside class="edition-library"><h3>SUMÁ UNA PLANTILLA +</h3><div class="edition-library-grid">${templates.map(t=>`<button type="button" data-edit-add="${t.id}" aria-label="Sumar ${esc(t.name)}"><img src="${t.src}" alt="" decoding="async"><span>${esc(t.name)}</span></button>`).join('')}</div></aside>
    <div class="edition-board-wrap"><div class="edition-board-meta"><span>HOJA A4 / 210 × 297 MM</span><span id="edition-count">0 / 12 PIEZAS</span></div><div class="edition-board" id="edition-board" role="group" aria-label="Composición A4. Seleccioná y arrastrá las piezas."></div><p class="edition-board-help">ARRASTRÁ PARA MOVER · FLECHAS PARA AJUSTAR<br>La línea punteada marca el margen de impresión.</p><div class="edition-history"><button type="button" data-edit="undo">↶ DESHACER</button><button type="button" data-edit="redo">REHACER ↷</button></div></div>
    <aside class="edition-controls"><h3 id="edition-selected-label">SELECCIONÁ UNA PIEZA</h3>${[['w','TAMAÑO','20','180','mm'],['angle','GIRO','-180','180','°'],['x','HORIZONTAL','10','200','mm'],['y','VERTICAL','10','287','mm']].map(([id,label,min,max,unit])=>`<div class="edition-control"><label for="edition-${id}">${label}<output id="edition-${id}-value"></output></label><input id="edition-${id}" data-edit-prop="${id}" type="range" min="${min}" max="${max}" step="1" aria-label="${label}" data-unit="${unit}"></div>`).join('')}
    <div class="edition-control-buttons"><button type="button" data-edit="duplicate">DUPLICAR +</button><button type="button" data-edit="center">CENTRAR ↔</button><button type="button" data-edit="front">TRAER ADELANTE</button><button type="button" data-edit="back">LLEVAR ATRÁS</button><button type="button" data-edit="remove">QUITAR PIEZA ×</button></div><h3>PIEZAS DE TU EDICIÓN</h3><div class="edition-layer-list" id="edition-layer-list"></div></aside></div>
    <footer class="edition-editor-footer"><label for="edition-name">NOMBRE DE TU EDICIÓN<input id="edition-name" type="text" maxlength="60" value="Mi edición"></label><div class="edition-export-actions"><button type="button" data-edit="save">GUARDAR EDICIÓN</button><button type="button" data-edit="png">PNG ↓</button><button type="button" class="edition-primary" data-edit="pdf">DESCARGAR PDF A4 ↓</button></div></footer><p class="edition-status" id="edition-status" role="status" aria-live="polite"></p><p class="edition-print-note">Imprimí el PDF en A4 al 100%, sin ajustar a página. Negro sobre blanco, con 10 mm de margen. Prepará el recorte de tu plantilla y llevala al evento.</p>`;
  document.body.append(dialog);
  const board=dialog.querySelector('#edition-board'),status=dialog.querySelector('#edition-status');
  function say(message){status.textContent=message}
  async function loadAssets(){
    if(loading)return loading;
    loading=Promise.all(templates.map(t=>new Promise((resolve,reject)=>{
      const img=new Image();img.onload=()=>{
        const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
        const data=ctx.getImageData(0,0,c.width,c.height).data;let left=c.width,top=c.height,right=0,bottom=0;
        for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(data[(y*c.width+x)*4+3]>12){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}
        if(right<left){reject(new Error(t.name));return}
        const trimmed=document.createElement('canvas');trimmed.width=right-left+1;trimmed.height=bottom-top+1;const ink=trimmed.getContext('2d');ink.drawImage(img,left,top,trimmed.width,trimmed.height,0,0,trimmed.width,trimmed.height);ink.globalCompositeOperation='source-in';ink.fillStyle='#000';ink.fillRect(0,0,trimmed.width,trimmed.height);
        assets.set(t.id,{canvas:trimmed,url:trimmed.toDataURL('image/png'),ratio:trimmed.height/trimmed.width});resolve();
      };img.onerror=()=>reject(new Error(t.name));img.src=t.src;
    }))).catch(error=>{loading=null;throw error});return loading;
  }
  function fit(layer){
    const ratio=assets.get(layer.template)?.ratio||1,rad=layer.angle*Math.PI/180;
    let bw=layer.w*(Math.abs(Math.cos(rad))+ratio*Math.abs(Math.sin(rad))),bh=layer.w*(Math.abs(Math.sin(rad))+ratio*Math.abs(Math.cos(rad)));
    const factor=Math.min(1,190/bw,277/bh);layer.w*=factor;bw*=factor;bh*=factor;
    layer.x=Math.max(10+bw/2,Math.min(200-bw/2,layer.x));layer.y=Math.max(10+bh/2,Math.min(287-bh/2,layer.y));return layer;
  }
  const snapshot=()=>clone(layers);
  function remember(){undo.push(snapshot());if(undo.length>40)undo.shift();redo=[]}
  function persist(){try{localStorage.setItem(draftKey,JSON.stringify({layers,name,editionId}))}catch{say('El navegador no pudo guardar el borrador. Podés descargar tu edición.')}}
  function render(){
    layers.forEach(fit);
    board.innerHTML=layers.length?layers.map(l=>`<button type="button" class="edition-layer ${selection===l.uid?'is-selected':''}" data-ed-layer="${l.uid}" aria-label="Mover ${esc(template(l.template).name)}" aria-pressed="${selection===l.uid}" style="left:${l.x/210*100}%;top:${l.y/297*100}%;width:${l.w/210*100}%;height:${l.w*(assets.get(l.template)?.ratio||1)/297*100}%;--angle:${l.angle}deg"><img src="${assets.get(l.template)?.url||template(l.template).src}" alt=""></button>`).join(''):'<div class="edition-board-empty">TU MARCA EMPIEZA ACÁ.<br>Sumá una plantilla del catálogo.</div>';
    dialog.querySelector('#edition-count').textContent=`${layers.length} / 12 PIEZAS`;
    dialog.querySelector('#edition-layer-list').innerHTML=layers.slice().reverse().map(l=>`<button type="button" data-ed-select="${l.uid}" aria-pressed="${selection===l.uid}">${esc(template(l.template).name)} ↗</button>`).join('');
    const layer=selected();dialog.querySelector('#edition-selected-label').textContent=layer?template(layer.template).name:'SELECCIONÁ UNA PIEZA';
    dialog.querySelectorAll('[data-edit-prop]').forEach(input=>{input.disabled=!layer;input.value=layer?Math.round(layer[input.dataset.editProp]):input.min;dialog.querySelector(`#${input.id}-value`).textContent=layer?`${Math.round(layer[input.dataset.editProp])}${input.dataset.unit}`:'—'});
    dialog.querySelectorAll('.edition-control-buttons button').forEach(b=>b.disabled=!layer);
    dialog.querySelector('[data-edit="duplicate"]').disabled=!layer||layers.length>=12;
    dialog.querySelector('[data-edit="undo"]').disabled=!undo.length;dialog.querySelector('[data-edit="redo"]').disabled=!redo.length;
    dialog.querySelectorAll('[data-edit="save"],[data-edit="pdf"],[data-edit="png"]').forEach(b=>b.disabled=!layers.length||exporting);
  }
  async function open(startId=null,saved=null,resume=false){
    returnFocus=document.activeElement;status.textContent='Cargando las plantillas…';dialog.showModal();document.body.style.overflow='hidden';dialog.querySelector('[data-edit="close"]').focus();
    layers=[];selection=null;editionId=null;name='Mi edición';undo=[];redo=[];render();
    try{await loadAssets();if(!dialog.open)return;dialog.querySelectorAll('[data-edit-add]').forEach(b=>b.disabled=false);
      if(resume){try{saved=JSON.parse(localStorage.getItem(draftKey)||'null')}catch{saved=null}}
      if(saved){layers=validLayers(saved.layers);name=String(saved.name||'Mi edición').slice(0,60);editionId=typeof saved.id==='string'?saved.id:typeof saved.editionId==='string'?saved.editionId:null;selection=layers.at(-1)?.uid||null}
      dialog.querySelector('#edition-name').value=name;
      if(startId)add(startId);else render();say(resume&&!layers.length?'Todavía no hay borrador. Sumá una plantilla para empezar.':'Combiná hasta 12 piezas. Tu borrador se guarda en este navegador.');
    }catch{say('No se pudieron cargar todas las plantillas. Cerrá el editor e intentá de nuevo.');dialog.querySelectorAll('[data-edit-add]').forEach(b=>b.disabled=true)}
  }
  function add(id){if(layers.length>=12){say('Tu hoja admite hasta 12 piezas. Quitá una para sumar otra.');return}if(!assets.has(Number(id)))return;remember();const l=fit({uid:uuid(),template:Number(id),x:105,y:148.5,w:Number(id)<16?135:65,angle:0});layers.push(l);selection=l.uid;render();persist();say(`${template(id).name} se sumó a tu edición.`)}
  function output(width=2480,height=3508){const c=document.createElement('canvas');c.width=width;c.height=height;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);ctx.scale(width/210,height/297);for(const l of layers){const a=assets.get(l.template);ctx.save();ctx.translate(l.x,l.y);ctx.rotate(l.angle*Math.PI/180);ctx.drawImage(a.canvas,-l.w/2,-l.w*a.ratio/2,l.w,l.w*a.ratio);ctx.restore()}return c}
  function download(blob,extension){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`el-odio-${(name||'mi-edicion').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,60)}.${extension}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}
  // PDF A4 autocontenido: una página, sin controles ni marcas de selección.
  function pdf(canvas){
    const jpeg=Uint8Array.from(atob(canvas.toDataURL('image/jpeg',1).split(',')[1]),c=>c.charCodeAt(0)),encode=s=>new TextEncoder().encode(s),chunks=[],offsets=[0];let length=0;
    const push=chunk=>{const bytes=typeof chunk==='string'?encode(chunk):chunk;chunks.push(bytes);length+=bytes.length};
    const obj=(id,body)=>{offsets[id]=length;push(`${id} 0 obj\n${body}\nendobj\n`)};
    push('%PDF-1.4\n');obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.2756 841.8898] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
    offsets[4]=length;push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);push(jpeg);push('\nendstream\nendobj\n');
    const stream='q\n595.2756 0 0 841.8898 0 0 cm\n/Im0 Do\nQ\n';obj(5,`<< /Length ${encode(stream).length} >>\nstream\n${stream}endstream`);const xref=length;push('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)push(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);return new Blob(chunks,{type:'application/pdf'});
  }
  async function exportFile(type){if(!layers.length||exporting)return;exporting=true;render();say('Preparando tu edición…');try{await loadAssets();const canvas=output();if(type==='pdf')download(pdf(canvas),'pdf');else{const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error();download(blob,'png')}say(type==='pdf'?'PDF A4 descargado. Imprimí al 100%, sin ajustar a página.':'PNG descargado: 2480 × 3508 px, negro sobre blanco.')}catch{say('No se pudo exportar. Tu edición sigue acá; intentá nuevamente.')}finally{exporting=false;render()}}
  function save(){if(!layers.length)return;const saved=readSaved(),existing=saved.findIndex(e=>e.id===editionId);if(existing<0&&saved.length>=8){say('Ya tenés 8 ediciones. Abrí una guardada para reemplazarla, o descargá esta.');return}const record={id:editionId||uuid(),name:name.trim()||'Mi edición',layers:snapshot(),preview:output(210,297).toDataURL('image/png'),updatedAt:new Date().toISOString()};if(existing<0)saved.push(record);else saved[existing]=record;try{localStorage.setItem(key,JSON.stringify(saved));editionId=record.id;persist();catalog();say('Edición guardada en este navegador. La podés retomar desde Tus ediciones.')}catch{say('No se pudo guardar. Descargá el PDF o PNG para conservar tu edición.')}}
  host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.edFilter){category=b.dataset.edFilter;page=0;catalog();host.querySelector(`[data-ed-filter="${category}"]`)?.focus({preventScroll:true})}else if(b.dataset.edPage){page+=Number(b.dataset.edPage);catalog()}else if(b.dataset.edApply)open(Number(b.dataset.edApply));else if(b.hasAttribute('data-ed-new'))open();else if(b.hasAttribute('data-ed-resume'))open(null,null,true);else if(b.dataset.edOpen){const saved=readSaved().find(v=>v.id===b.dataset.edOpen);if(saved)open(null,saved)}});
  dialog.addEventListener('close',()=>{drag=null;document.body.style.overflow='';returnFocus?.focus({preventScroll:true})});
  dialog.addEventListener('click',e=>{
    if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();return}
    const b=e.target.closest('button');if(!b)return;if(b.dataset.editAdd){add(Number(b.dataset.editAdd));return}if(b.dataset.edSelect){selection=b.dataset.edSelect;render();return}if(b.dataset.edLayer){selection=b.dataset.edLayer;render();return}
    const l=selected(),action=b.dataset.edit;if(action==='close'){dialog.close();return}if(action==='save'){save();return}if(action==='png'||action==='pdf'){exportFile(action);return}
    if(action==='undo'||action==='redo'){const from=action==='undo'?undo:redo,to=action==='undo'?redo:undo;if(!from.length)return;to.push(snapshot());layers=from.pop();selection=layers.at(-1)?.uid||null;render();persist();return}
    if(!l)return;remember();if(action==='duplicate'&&layers.length<12){const copy=fit({...l,uid:uuid(),x:l.x+7,y:l.y+7});layers.push(copy);selection=copy.uid}else if(action==='remove'){layers=layers.filter(v=>v.uid!==l.uid);selection=layers.at(-1)?.uid||null}else if(action==='center'){l.x=105;l.y=148.5}else if(action==='front'){layers=layers.filter(v=>v.uid!==l.uid);layers.push(l)}else if(action==='back'){layers=layers.filter(v=>v.uid!==l.uid);layers.unshift(l)}render();persist();
  });
  dialog.querySelectorAll('[data-edit-prop]').forEach(input=>{let started=false;const begin=()=>{if(!started&&selected()){remember();started=true}};input.addEventListener('pointerdown',begin);input.addEventListener('keydown',begin);input.addEventListener('input',()=>{const l=selected();if(!l)return;begin();l[input.dataset.editProp]=Number(input.value);fit(l);render();persist()});input.addEventListener('change',()=>started=false);input.addEventListener('blur',()=>started=false)});
  dialog.querySelector('#edition-name').addEventListener('input',e=>{name=e.target.value;persist()});
  board.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-ed-layer]');if(!b||e.button!==0||!e.isPrimary)return;selection=b.dataset.edLayer;render();const l=selected();remember();drag={id:e.pointerId,x:e.clientX,y:e.clientY,fromX:l.x,fromY:l.y};board.setPointerCapture(e.pointerId);e.preventDefault()});
  board.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const l=selected();if(!l)return;const r=board.getBoundingClientRect();l.x=drag.fromX+(e.clientX-drag.x)/r.width*210;l.y=drag.fromY+(e.clientY-drag.y)/r.height*297;fit(l);const b=board.querySelector(`[data-ed-layer="${l.uid}"]`);if(b){b.style.left=l.x/210*100+'%';b.style.top=l.y/297*100+'%'}});
  const endDrag=()=>{if(!drag)return;drag=null;render();persist()};board.addEventListener('pointerup',endDrag);board.addEventListener('pointercancel',endDrag);board.addEventListener('lostpointercapture',endDrag);
  dialog.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();dialog.querySelector(`[data-edit="${e.shiftKey?'redo':'undo'}"]`).click();return}const l=selected();if(!l)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();remember();const step=e.shiftKey?5:1;if(e.key==='ArrowLeft')l.x-=step;if(e.key==='ArrowRight')l.x+=step;if(e.key==='ArrowUp')l.y-=step;if(e.key==='ArrowDown')l.y+=step;render();persist();board.querySelector(`[data-ed-layer="${l.uid}"]`)?.focus({preventScroll:true})}});
  catalog();
})();
