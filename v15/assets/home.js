/* V1.5 — home.js : uniquement la home et Work. */
/* ---------- anneau ---------- */
const stage=$('#stage'); let target=0, rot=0, active=-1, cards=[];
P.forEach((p,i)=>{const c=document.createElement('div');c.className='card';c.dataset.i=i;
  c.innerHTML=`<img src="${src(p.imgs[0])}" alt="${p.t}" style="object-position:${p.pos}" draggable="false"><span class="n">0${i+1}</span><span class="open">${p.kase?'read the project ↓':'see the images ↗'}</span>`;
  stage.appendChild(c);cards.push(c);});
const mod=(a,n)=>((a%n)+n)%n;
function layout(){
  const W=cards[0].offsetWidth, R=W*1.5, step=Math.PI*2/N;
  cards.forEach((c,i)=>{ let d=mod(i-rot+N/2,N)-N/2; const a=d*step;
    const x=Math.sin(a)*R, z=(Math.cos(a)-1)*R, y=z*.05, depth=-z/(2*R), ad=Math.abs(d);
    c.style.transform=`translate3d(${x}px,${y}px,${z}px) rotateY(${a*.38}rad)`;
    c.style.zIndex=1000+Math.round(z);
    c.style.filter=`brightness(${1-Math.min(1,ad)*.6}) saturate(${1-Math.min(1,ad)*.5})`;
    c.style.opacity=ad<1.15?1:Math.max(0,1-(ad-1.15)*4); c.style.pointerEvents=ad<1.4?'':'none';
    c.classList.toggle('front',Math.abs(d)<.3);
  });
}
function setActive(i){ if(i===active) return; active=i; const p=P[i];
  const LG={atelier:'figma',sorare:'sorare',sportgen:'sportgen'}[p.id]; const t=$('#title'); t.innerHTML=LG?`<span class="tlg tlg-${p.id}"><img src="img/clients/${LG}.png" alt="${p.t}"></span>`:`<span>${p.t}</span>${SWOOSH}`; const wc=$('#wcount'); if(wc) wc.innerHTML=`${String(i+1).padStart(2,'0')} <i>/ ${String(P.length).padStart(2,'0')}</i>`; t.classList.remove('swap','draw'); void t.offsetWidth; t.classList.add('swap','draw');
  const d=$('#data'); d.innerHTML=[['Date',p.y],['Type',p.nat],['Role',p.role]].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join(''); d.classList.remove('swap'); void d.offsetWidth; d.classList.add('swap');
}
function go(n){ target=n; sTick(); }
function loop(){ rot+=(target-rot)*.11; if(Math.abs(target-rot)<.0005) rot=target; layout(); setActive(mod(Math.round(rot),N)); requestAnimationFrame(loop); }
const overlayOpen=()=>document.querySelector('.viewer.on,.case.on,.menu.on,.game.on')||!$('#intro').classList.contains('off')||(document.activeElement&&document.activeElement.id==='cin');

let wAcc=0,wLock=0;
addEventListener('wheel',e=>{ if(overlayOpen()||document.body.classList.contains('is-list')||document.body.classList.contains('is-canvas')||document.body.classList.contains('is-imm')) return;
  const now=performance.now(); if(now<wLock) return; wAcc+=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
  if(Math.abs(wAcc)>50){ go(Math.round(target)+Math.sign(wAcc)); wAcc=0; wLock=now+380; } },{passive:true});
let drag=null;
stage.addEventListener('pointerdown',e=>{drag={x:e.clientX,t0:target,moved:0,el:e.target.closest('.card')};stage.setPointerCapture(e.pointerId);stage.classList.add('drag')});
stage.addEventListener('pointermove',e=>{ if(!drag) return; const dx=e.clientX-drag.x; drag.moved=Math.max(drag.moved,Math.abs(dx)); if(drag.moved>6) target=drag.t0-dx/(cards[0].offsetWidth*.8); });
stage.addEventListener('pointerup',e=>{ if(!drag) return; stage.classList.remove('drag'); const d=drag; drag=null;
  if(d.moved<=6){ if(d.el){ const i=+d.el.dataset.i; if(d.el.classList.contains('front')) openProject(i,d.el); else { let diff=mod(i-Math.round(target)+N/2,N)-N/2; go(Math.round(target)+diff); } } }
  else { const r=Math.round(target); target=r; sTick(); } });
addEventListener('keydown',e=>{
  if(e.key==='Escape'){ closeTop(); return; }
  if(G.on) return;
  if(document.body.classList.contains('is-imm')&&!overlayOpen()) return;
  if(document.body.classList.contains('is-canvas')&&!$('#viewer').classList.contains('on')) return;
  if($('#viewer').classList.contains('on')){ if(e.key==='ArrowRight') vStep(1); if(e.key==='ArrowLeft') vStep(-1); return; }
  if(overlayOpen()) return;
  if(e.key==='ArrowRight') go(Math.round(target)+1);
  if(e.key==='ArrowLeft') go(Math.round(target)-1);
  if(e.key==='Enter') openProject(mod(Math.round(target),N),cards[mod(Math.round(target),N)]);
});

/* ---------- liste ---------- */
const list=$('#list'), peek=$('#peek');
P.forEach((p,i)=>{const b=document.createElement('button');b.innerHTML=`${p.t}<small>${p.y}</small>`;
  b.onmouseenter=()=>{peek.firstChild.src=src(p.imgs[0]);peek.style.opacity=1;sHover()}; b.onmouseleave=()=>peek.style.opacity=0;
  b.onclick=()=>{peek.style.opacity=0;openProject(i,null)}; list.appendChild(b);});
list.appendChild(peek); let pkSide=1; list.querySelectorAll('button').forEach((b,i)=>b.addEventListener('mouseenter',()=>{ pkSide=1; }));
addEventListener('pointermove',e=>{ if(peek.style.opacity==='1'){ const w=peek.offsetWidth, x=pkSide>0?e.clientX+18:e.clientX-w-18; peek.style.transform=`translate(${x}px,${e.clientY-peek.offsetHeight/2}px) rotate(${pkSide>0?-3:3}deg)`; } });
function setMode(m){ m=m===true?'list':(m||'ring');
  ['list','canvas'].forEach(k=>document.body.classList.toggle('is-'+k,m===k));
  $('#mList').setAttribute('aria-pressed',m==='list'); $('#mRing').setAttribute('aria-pressed',m==='ring'); $('#mCanvas').setAttribute('aria-pressed',m==='canvas');
  if(m==='canvas') CV.enter(); else CV.leave(); sTick(); }
/* ---------- transitions anneau <-> liste : les cartes se dissolvent, les noms montent un par un (et l'inverse) ---------- */
setMode=(orig=>{ let busy=0; const RM=matchMedia('(prefers-reduced-motion: reduce)'), B=document.body;
  const cur=()=>B.classList.contains('is-list')?'list':B.classList.contains('is-canvas')?'canvas':'ring';
  const vis=()=>[...document.querySelectorAll('.stage .card')].filter(c=>parseFloat(c.style.opacity||'1')>0.01);
  const items=()=>[...document.querySelectorAll('#list button')];
  const toC=c=>{ const r=c.getBoundingClientRect(); return [(innerWidth/2-(r.left+r.width/2))*.35,(innerHeight/2-(r.top+r.height/2))*.35]; };
  const fl=c=>c.style.filter||'brightness(1)', op=c=>c.style.opacity||'1';
  const EO='cubic-bezier(.16,1,.3,1)', EI='cubic-bezier(.5,0,.75,0)';
  const done=(as,ms)=>Promise.race([Promise.all(as.map(a=>a.finished.catch(()=>{}))),new Promise(r=>setTimeout(r,ms))]);
  const cardsIn=(d0)=>requestAnimationFrame(()=>requestAnimationFrame(()=>vis().forEach((c,i)=>{ const [dx,dy]=toC(c); c.animate([{opacity:0,filter:fl(c)+' blur(18px)',translate:`${dx}px ${dy}px`,scale:'.6'},{opacity:op(c),filter:fl(c)+' blur(0px)',translate:'0px 0px',scale:'1'}],{duration:1000,delay:d0+i*55,easing:EO,fill:'backwards'}); })));
  const itemsIn=d0=>items().forEach((e,i)=>e.animate([{opacity:0,filter:'blur(12px)',translate:'0 34px'},{opacity:getComputedStyle(e).opacity,filter:'blur(0px)',translate:'0 0'}],{duration:900,delay:d0+i*75,easing:EO,fill:'backwards'}));
  const hud=()=>document.querySelector('.hud');
  return function(m){ const to=m===true?'list':(m||'ring'), from=cur();
    if(RM.matches||from===to||busy) return orig(m);
    if(from==='ring'&&to==='list'){ busy=1; const cs=vis(); const snap=cs.map(c=>[fl(c),op(c)]); B.classList.add('keepstage'); orig(m);
      const outs=cs.map((c,i)=>{ const [dx,dy]=toC(c); return c.animate([{opacity:snap[i][1],filter:snap[i][0]+' blur(0px)',translate:'0px 0px',scale:'1'},{opacity:0,filter:snap[i][0]+' blur(16px)',translate:`${dx}px ${dy}px`,scale:'.7'}],{duration:650,delay:i*30,easing:EI,fill:'forwards'}); });
      const h=hud(); if(h) h.animate([{opacity:1},{opacity:0,filter:'blur(8px)'}],{duration:420,easing:EI,fill:'forwards'});
      itemsIn(cs.length*30+560); /* les noms n'arrivent qu'une fois les cartes parties */
      done(outs,1300).then(()=>{ B.classList.remove('keepstage'); cs.forEach(c=>c.getAnimations().forEach(a=>a.cancel())); const hh=hud(); if(hh) hh.getAnimations().forEach(a=>a.cancel()); busy=0; }); return; }
    if(from==='list'&&to==='ring'){ busy=1; const is=items(); B.classList.add('keeplist'); orig(m);
      const outs=is.map((e,i)=>e.animate([{filter:'blur(0px)',translate:'0 0'},{opacity:0,filter:'blur(12px)',translate:'0 -22px'}],{duration:190,delay:i*10,easing:EI,fill:'forwards'})); /* les noms partent vite */
      cardsIn(240);
      { const h=hud(); if(h) h.animate([{opacity:0,filter:'blur(8px)'},{opacity:1,filter:'blur(0px)'}],{duration:800,delay:500,easing:EO,fill:'backwards'}); }
      done(outs,600).then(()=>{ B.classList.remove('keeplist'); is.forEach(e=>e.getAnimations().forEach(a=>a.cancel())); busy=0; }); return; }
    orig(m); if(to==='list') itemsIn(0); if(to==='ring') cardsIn(0); };
})(setMode);
$('#mRing').onclick=()=>setMode('ring'); $('#mList').onclick=()=>setMode('list'); $('#mCanvas').onclick=()=>setMode('canvas');
// le canvas est désormais la seule vue (anneau et liste retirés : la liste des projets est dans la présentation, en scrollant)
const defMode=()=>window.WORKPAGE?'ring':'canvas';
$('#home').onclick=e=>{ e.preventDefault(); closeTop(); if(defMode()==='canvas'&&document.body.classList.contains('is-canvas')){ scrollTo({top:0,behavior:'smooth'}); try{ CV.home(1100); }catch(_){} } else setMode(defMode()); };

/* ---------- mode immersif : chapitres qui s'ouvrent en plein écran, le précédent s'assombrit ---------- */

/* ---------- canvas infini : frames, formes, crayon ---------- */
const GLY={"N":[[["N",47.0,426.5,688.0,47.0,688.0,"M184.7 0V206.3C184.7 248 172.2 348.8 147.3 508.1H155.4C175.1 420.3 196.7 345 220.2 281.1L322.4 0H473.5V688H335.8V495.1C335.8 438 348.3 332.5 373.3 178H365.6C349.8 252.4 333 313.8 316.2 361.8L199.6 688H47V0Z"],["A",527.3,472.6,688.0,6.7,688.0,"M479.3 0 333.9 688H157.4L6.7 0H158.3L183.8 163.1H301.8L327.2 0ZM245.6 550.3C250 514.8 254.8 477.4 260.5 438L288.8 279.2H197.7L225 438C231.3 477.4 236.1 514.8 239.9 550.3Z"],["B",1053.6,399.2,688.0,47.0,688.0,"M348.8 367.5C404.5 398.7 432.3 449.6 432.3 519.6C432.3 631.9 363.2 688 225 688H47V0H220.2C370.9 0 446.2 65.7 446.2 196.7C446.2 279.2 413.6 335.4 348.8 365.6ZM216.4 563.3C271.6 563.3 293.6 541.7 293.6 490.3C294.1 440.4 268.2 415.5 216.4 415.5H186.6V563.3H216.4ZM186.6 128.6V296.5H218.3C278.3 296.5 305.6 269.6 305.6 212.1C305.6 154.5 278.3 128.6 218.3 128.6Z"],["I",1523.8,147.8,688.0,47.0,688.0,"M194.8 0V688H47V0Z"],["L",1765.1,342.1,688.0,47.0,688.0,"M389.1 0V130.5H194.8V688H47V0Z"]],[["A",6.7,472.6,688.0,6.7,688.0,"M479.3 0 333.9 688H157.4L6.7 0H158.3L183.8 163.1H301.8L327.2 0ZM245.6 550.3C250 514.8 254.8 477.4 260.5 438L288.8 279.2H197.7L225 438C231.3 477.4 236.1 514.8 239.9 550.3Z"],["M",504.7,635.7,688.0,18.7,688.0,"M167 0 184.7 230.8C186.2 246.6 186.6 270.1 186.6 300.8C186.6 346.4 183.8 397.3 178 452.9H185.7C198.6 370.4 210.1 306.1 220.2 260.5L274 0H398.7L454.8 259.6C463.5 298.4 474.5 363.2 488.4 452.9H496.1C490.3 380.9 487.5 326.7 487.5 289.8C487.5 276.8 487.9 257.2 489.4 230.8L506.2 0H654.4L596.4 688H436.1L361.8 321.5C352.6 275.9 345.4 220.7 340.2 156.4H333.9C330.6 220.2 324.3 274.9 314.3 321.5L238 688H77.7L18.7 0Z"],["A",1165.4,472.6,688.0,6.7,688.0,"M479.3 0 333.9 688H157.4L6.7 0H158.3L183.8 163.1H301.8L327.2 0ZM245.6 550.3C250 514.8 254.8 477.4 260.5 438L288.8 279.2H197.7L225 438C231.3 477.4 236.1 514.8 239.9 550.3Z"],["R",1691.7,425.6,688.0,47.0,688.0,"M472.6 0 365.6 266.3C434.2 302.3 468.7 371.3 468.7 472.6C468.7 616 389.6 688 230.8 688H47V0H194.8V237H227.9L314.3 0ZM319.5 459.6C319.5 386.2 292.2 357.4 226.9 357.4H191.4V558.9H226C292.7 558.9 319.5 530.6 319.5 459.6Z"],["A",2144.6,472.6,688.0,6.7,688.0,"M479.3 0 333.9 688H157.4L6.7 0H158.3L183.8 163.1H301.8L327.2 0ZM245.6 550.3C250 514.8 254.8 477.4 260.5 438L288.8 279.2H197.7L225 438C231.3 477.4 236.1 514.8 239.9 550.3Z"]]],"W":[2122.5,2623.9],"S":["M462 0 311.4 688H165L11 0H134.8L166 176.1H304.7L336.8 0ZM238 571.9C243.2 529.2 249.5 488.9 256.7 450L291.7 272H179.9L214 450C221.2 488.9 227.4 529.2 232.7 571.9Z M980.4 0V688H859.5V0Z M2100 -8.6C2162.4 -8.6 2214.7 8.2 2257.4 42.2L2220.9 137.7C2188.3 112.7 2153.8 100.3 2117.8 100.3C2078.9 100.3 2052 118.5 2037.2 154.5C2022.3 190.5 2014.6 253.8 2014.6 345C2014.6 436.1 2021.8 499.4 2036.7 535C2051.6 570 2078 587.7 2115.9 587.7C2144.6 587.2 2173.4 577.7 2202.2 558.9L2244.4 652.5C2208.9 681.8 2161 696.6 2101 696.6C2028.5 696.6 1975.3 668.8 1941.7 612.7C1907.6 556.5 1890.8 466.8 1890.8 343C1890.8 219.3 1907.6 129.5 1940.7 74.4C1973.8 19.2 2026.6 -8.6 2100 -8.6Z M2950.4 274.9C3023.8 308 3060.2 376.1 3060.2 479.3C3060.2 618.4 2984.4 688 2833.3 688H2663.5V0H2784.4V253.3H2832.3H2835.2L2934.5 0H3064.1ZM2936.5 469.7C2936.5 388.6 2905.7 353.6 2829.5 353.6H2783.4V582.4H2828.5C2904.8 582.4 2936.5 549.8 2936.5 469.7Z M3598.2 301.8H3786.8V403H3598.2V581.5H3796.4V688H3478.3V0H3800.2V106H3598.2Z M4623.2 0 4472.6 688H4326.2L4172.2 0H4296L4327.2 176.1H4465.8L4498 0ZM4399.2 571.9C4404.4 529.2 4410.7 488.9 4417.9 450L4452.9 272H4341.1L4375.2 450C4382.4 488.9 4388.6 529.2 4393.9 571.9Z M4935.2 688V581.5H5069.6V0H5190.5V581.5H5325.3V688Z M5848.4 0V688H5727.5V0Z M6535.6 0 6695.9 688H6568.8L6493.4 268.2C6486.7 229.3 6480.5 179.9 6474.7 119.9H6467.5C6463.2 183.3 6457.4 232.7 6450.2 268.2L6373.5 688H6245.9L6402.8 0Z M7213.3 301.8H7401.8V403H7213.3V581.5H7411.4V688H7093.3V0H7415.3V106H7213.3Z M8476.9 0C8567.5 0 8630.9 25.4 8666.9 76.8C8702.8 128.1 8720.6 217.8 8720.6 345.9C8720.6 473.5 8702.8 562.3 8667.3 612.7C8631.4 663.1 8568.5 688 8477.8 688H8320V0ZM8438.5 581.5H8476.9C8522.9 581.5 8554.6 564.7 8571.4 530.6C8588.2 496.6 8596.8 433.7 8596.8 342.1C8596.8 250.9 8588.7 189 8571.9 155.9C8555.1 122.8 8523.4 106 8477.8 106H8438.5Z M9262.9 301.8H9451.5V403H9262.9V581.5H9461.1V688H9143V0H9464.9V106H9262.9Z M10167.5 48.5C10203.5 86.8 10221.7 138.2 10221.7 202.5C10221.7 246.1 10210.2 285 10186.7 319.1C10163.2 352.6 10125.2 385.3 10073.4 416.4C10039.4 437.6 10016.3 455.8 10003.4 471.6C9990.4 487.5 9984.2 505.7 9984.2 526.8C9984.2 567.1 10009.1 591.6 10053.8 591.6C10089.7 591.6 10127.6 578.6 10167 553.2L10208.3 647.7C10154 680.8 10099.3 697.6 10044.2 697.6C9990 697.6 9945.8 681.8 9912.7 650.6C9879.1 619.4 9862.3 577.7 9862.3 525.8C9862.3 481.2 9872.9 442.8 9894 410.7C9915.1 378.5 9950.1 348.3 9998.6 319.5C10037.9 296.5 10064.3 275.9 10078.2 257.6C10092.1 238.9 10098.9 216.9 10098.9 190.5C10098.9 134.3 10066.7 97.4 10014.4 97.4C9967.4 96.9 9921.8 114.2 9878.2 149.2L9844.6 46.1C9900.2 9.1 9958.8 -9.6 10020.7 -9.6C10082.1 -9.6 10131 9.6 10167.5 48.5Z M10751.1 0V688H10630.1V0Z M11369.2 304.7H11461.8V241.8C11461.8 146.3 11435.4 98.4 11382.1 98.4C11350 98.4 11327.9 117.1 11315 154C11302 191 11295.8 254.3 11295.8 344C11295.8 434.2 11303.5 497.5 11318.3 534.5C11333.2 571.4 11359.6 589.6 11397 589.6C11431.6 589.2 11467.5 579.6 11505 559.9L11548.1 652.5C11503.5 682.7 11452.7 697.6 11395.1 697.6C11316.4 697.6 11259.8 669.8 11225.2 614.6C11190.2 559.4 11173 469.2 11173 344C11173 219.7 11189.3 129.5 11222.4 73.9C11255 18.2 11307.8 -9.6 11380.2 -9.6C11508.3 -9.6 11572.6 80.6 11572.6 260.5V401.1H11369.2Z M12103.4 0V284C12103.4 319.1 12093.8 405.4 12074.1 543.6H12080.9C12098.6 465.4 12117.8 399.2 12138 344L12260.8 0H12391.3V688H12278.5V409.7C12278.5 356 12288.1 266.8 12307.8 141.5H12301.1C12283.3 215.9 12267 274 12252.1 315.2L12120.2 688H11989.7V0Z M12953.3 301.8H13141.8V403H12953.3V581.5H13151.4V688H12833.3V0H13155.3V106H12953.3Z M13858.3 274.9C13931.7 308 13968.2 376.1 13968.2 479.3C13968.2 618.4 13892.4 688 13741.2 688H13571.4V0H13692.3V253.3H13740.3H13743.2L13842.5 0H13972ZM13844.4 469.7C13844.4 388.6 13813.7 353.6 13737.4 353.6H13691.3V582.4H13736.4C13812.7 582.4 13844.4 549.8 13844.4 469.7Z",11.0,697.6,13961.0,707.2]};
const CV=(function(){
  const cv=$('#cv'), world=$('#world'); let NAMEL=[],SUBN=null,px=0,py=0,z=1,tool='select',sel=null,nodes=[],inited=false,space=false,act=null,pinch=null,lastN=null,lastT=0,ci=0;
  const ptrs=new Map(), PAL=['#564FFF','#3BE9CE','#FFF186','#202020'], isOn=()=>document.body.classList.contains('is-canvas');
  let sk=1; // dézoom lié au scroll
  // limites : dézoom jusqu'à ~40 % de l'écran, et le contenu ne quitte jamais l'écran (jamais de vide)
  function bounds(){ let a=1e9,b=1e9,c=-1e9,d=-1e9; nodes.forEach(n=>{ a=Math.min(a,n.x); b=Math.min(b,n.y); c=Math.max(c,n.x+n.w); d=Math.max(d,n.y+n.h); }); return nodes.length?{a,b,c,d}:null; }
  function clampView(){ const B=bounds(); if(!B) return; const W=innerWidth, H=innerHeight, pad=Math.min(80,W*.06);
    const zMin=.45*Math.min(W*.92/(B.c-B.a),H*.92/(B.d-B.b)); if(z<zMin) z=zMin; // on peut dézoomer un peu au-delà du fit all, sans que tout devienne minuscule
    const L=B.a*z, R=B.c*z, T=B.b*z, Bo=B.d*z;
    // déplacement libre tant que le contenu occupe encore au moins la moitié de l'écran (ou tout le contenu s'il est plus petit)
    const nx=Math.min(W*.5,(R-L)*.7), ny=Math.min(H*.5,(Bo-T)*.7); // zoomé ou dézoomé, les éléments peuvent sortir sur les côtés, jamais plus de la moitié
    px=Math.min(Math.max(px,nx-R),W-nx-L); py=Math.min(Math.max(py,Math.max(ny-Bo,H*.68-Bo)),H-ny-T); } // vers le bas on s'arrête plus tôt : la page arrive vite
  const apply=()=>{ clampView(); const cx=innerWidth/2, cy=innerHeight/2, Z=z*sk, X=cx-(cx-px)*sk, Y=cy-(cy-py)*sk;
    world.style.transform=`translate(${X}px,${Y}px) scale(${Z})`; world.style.setProperty('--iz',1/Z); cv.style.backgroundSize=`${28*Z}px ${28*Z}px`; cv.style.backgroundPosition=`${X}px ${Y}px`; $('#zl').textContent=Math.round(z*100)+'%'; };
  const toW=e=>{ const cx=innerWidth/2, cy=innerHeight/2, Z=z*sk, X=cx-(cx-px)*sk, Y=cy-(cy-py)*sk; return {x:(e.clientX-X)/Z,y:(e.clientY-Y)/Z}; }, auto=n=>n.type==='frame'||n.type==='note'||n.type==='text';
  function place(n){ if(SRC) codeOf(n); const st=n.el.style; st.left=n.x+'px'; st.top=n.y+'px'; st.width=n.w+'px'; if(n.type==='text') st.fontSize=(n.w*n.k)+'px'; if(!auto(n)) st.height=n.h+'px'; else n.h=n.el.offsetHeight; st.transform=`rotate(${n.r}deg)`; const f=v=>String(Math.round(v*100)/100); n.el.querySelector('.dim').textContent=f(n.w)+' × '+f(n.h); if(n.type==='frame') fitLive(n); }
  function add(n){ const el=document.createElement('div'); el.className='node '+n.type+(n.cls?' '+n.cls:''); n.el=el; el._n=n;
    el.innerHTML=(n.name?`<div class="nm">${n.name}</div>`:'')+(n.html||'')+'<i class="hd nw" data-h="nw"></i><i class="hd ne" data-h="ne"></i><i class="hd sw" data-h="sw"></i><i class="hd se" data-h="se"></i><i class="rz nw" data-rz></i><i class="rz ne" data-rz></i><i class="rz sw" data-rz></i><i class="rz se" data-rz></i><i class="rot"></i><span class="dim"></span>';
    if(n.fill) el.style.background=n.fill; world.appendChild(el); nodes.push(n); place(n); return n; }
  let zTop=10;
  function select(n){ if(sel) sel.el.classList.remove('on'); sel=n; if(n){ n.el.classList.add('on'); n.el.style.zIndex=++zTop; } }
  function setTool(t){ tool=t; document.querySelectorAll('.tools [data-t]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===t)); cv.style.cursor=t==='hand'?'grab':t==='select'?'default':'crosshair'; }
  function zoomAt(cx,cy,f){ const nz=Math.max(.02,Math.min(4,z*f)); px=cx-(cx-px)*nz/z; py=cy-(cy-py)*nz/z; z=nz; apply(); }
  function fit(only){ let a=1e9,b=1e9,c=-1e9,d=-1e9; nodes.filter(n=>!only||n.type===only).forEach(n=>{a=Math.min(a,n.x);b=Math.min(b,n.y);c=Math.max(c,n.x+n.w);d=Math.max(d,n.y+n.h)}); z=Math.min(innerWidth*.86/(c-a),innerHeight*.7/(d-b),1.2); px=innerWidth/2-(a+c)/2*z; py=innerHeight/2-(b+d)/2*z-innerHeight*.02; apply(); }
  const pathD=p=>p.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ');
  // simplification (Ramer-Douglas-Peucker) puis courbes de Bézier lissées (Catmull-Rom) : un vrai tracé vectoriel
  function simplify(p,eps){ if(p.length<3) return p; let dm=0,id=0; const [a,b]=[p[0],p[p.length-1]], L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;
    for(let i=1;i<p.length-1;i++){ const d=Math.abs((b[0]-a[0])*(a[1]-p[i][1])-(a[0]-p[i][0])*(b[1]-a[1]))/L; if(d>dm){dm=d;id=i;} }
    return dm>eps?[...simplify(p.slice(0,id+1),eps).slice(0,-1),...simplify(p.slice(id),eps)]:[a,b]; }
  function smoothD(p,closed){ const n=p.length, g=i=>closed?p[(i+n)%n]:p[Math.max(0,Math.min(n-1,i))], f=v=>v.toFixed(1);
    let d=`M${f(p[0][0])} ${f(p[0][1])}`; const last=closed?n:n-1;
    for(let i=0;i<last;i++){ const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);
      d+=` C${f(p1[0]+(p2[0]-p0[0])/6)} ${f(p1[1]+(p2[1]-p0[1])/6)} ${f(p2[0]-(p3[0]-p1[0])/6)} ${f(p2[1]-(p3[1]-p1[1])/6)} ${f(p2[0])} ${f(p2[1])}`; }
    return d+(closed?'Z':''); }
  function vecHTML(pts,w,h,closed){ return `<svg viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}" preserveAspectRatio="none"><path d="${smoothD(pts,closed)}" fill="none" stroke="#564FFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`
      +pts.map(q=>`<i class="anc" style="left:${(q[0]/w*100).toFixed(2)}%;top:${(q[1]/h*100).toFixed(2)}%"></i>`).join(''); }
  // frames live : le vrai site dans la frame, chargé seulement à la demande
  // (l'aperçu Claude bloque les iframes d'autres sites : bouton affiché seulement une fois hébergé)
  function liveOn(n){ const p=P[n.pi]; if(!p||!p.link||n.el.querySelector('.lv')) return;
    const fb=n.el.querySelector('.clb')||n.el.querySelector('.fb'), w=document.createElement('div'); w.className='lv';
    w.innerHTML=`<iframe src="${p.link[1]}" title="${p.t} — live" allow="autoplay; fullscreen"></iframe>`;
    fb.appendChild(w); n.el.classList.add('islive'); fitLive(n);
    const show=()=>setTimeout(()=>w.classList.add('ready'),450); w.querySelector('iframe').addEventListener('load',show,{once:true}); setTimeout(()=>w.classList.add('ready'),6000);
    n.el.addEventListener('mouseleave',()=>n.el.classList.remove('using'));
  }
  function liveUse(n){ document.querySelectorAll('.node.using').forEach(x=>x.classList.remove('using')); if(n.el.querySelector('.lv')) n.el.classList.add('using'); }
  function fitLive(n){ const w=n.el.querySelector('.lv'); if(!w) return; const img=n.el.querySelector('.fb img'); const W=img.offsetWidth||n.w;
    w.style.height=img.offsetHeight+'px'; w.querySelector('iframe').style.transform=`scale(${W/1440})`; }
  function init(){ inited=true;
    const pos=MOB?[[-660,-820,-4],[-220,-1260,3],[220,-800,-2],[-660,330,2],[-200,620,-5],[240,320,4]]:[[-1030,-680,-4],[-220,-880,3],[590,-680,-2],[-1050,250,2],[-220,430,-5],[610,270,4]]; // Figma en haut à gauche, Sorare en haut au milieu // plus d'air autour du nom
    // le nom et le sous-titre sont des vecteurs (lettres vectorisées depuis Mozer), chaque lettre du nom est un calque
    const K=.3, CAP=688*K, LG=100*K, top=-(CAP*2+LG+46+28)/2; const NAME=NAMEL;
    GLY.N.forEach((line,li)=>{ const x0=-GLY.W[li]*K/2, y0=top+li*(CAP+LG);
      line.forEach(([ch,x,w,h,bx,by,d])=>{ NAME.push(add({type:'path',cls:'vec glyph',name:ch,x:x0+x*K,y:y0+(688-by)*K,w:w*K,h:h*K,r:0,
        html:`<svg viewBox="${bx} ${-by} ${w} ${h}" preserveAspectRatio="none"><path transform="scale(1 -1)" d="${d}" fill="#202020"/></svg>`})); }); });
    { const [d,bx,by,w,h]=GLY.S, k=28/h, W=w*k; NAME.push(SUBN=add({type:'path',cls:'vec glyph sub',name:'AI Creative Designer',x:-W/2,y:top+CAP*2+LG+60,w:W,h:46,r:0,
        html:`<span class="subtxt">AI Creative Designer</span>`})); } /* sous-titre en style en-tête (Akke, casse normale) */
    P.forEach((p,i)=>{ const n=add({type:'frame',name:p.t,pi:i,x:pos[i][0],y:pos[i][1],w:440,h:0,r:pos[i][2],
      html:p.link?`<div class="fb cl"><div class="livetag" aria-hidden="true"><i></i>Live</div><div class="clh"><svg viewBox="0 0 24 24" class="ib"><path d="M8 4c-2 0-2.5 1-2.5 3v2.2c0 1.3-.6 2.3-2 2.8 1.4.5 2 1.5 2 2.8V17c0 2 .5 3 2.5 3M16 4c2 0 2.5 1 2.5 3v2.2c0 1.3.6 2.3 2 2.8-1.4.5-2 1.5-2 2.8V17c0 2-.5 3-2.5 3"/></svg><span>${p.t}</span><span class="clic"><button data-cl="case" title="Case study"><svg viewBox="0 0 24 24"><path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z"/></svg></button><a data-cl="open" href="${p.link[1]}" target="_blank" rel="noopener" title="Open ${p.link[0]}"><svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"/></svg></a>${LIVE?'<button data-cl="play" title="Use the site">':`<a data-cl="play" href="${p.link[1]}" target="_blank" rel="noopener" title="Open ${p.link[0]}">`}<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg>${LIVE?'</button>':'</a>'}</span></div><div class="clb"><img src="${src(p.imgs[0])}" alt="${p.t}" style="object-position:${p.pos}" draggable="false"></div></div>`
        :`<div class="fb"><img src="${src(p.imgs[0])}" alt="${p.t}" style="object-position:${p.pos}" draggable="false"><div class="ft"><div class="fe"><span class="fc">${p.nat}</span><span class="fy">${p.y}</span></div>${({atelier:"figma",sorare:"sorare",sportgen:"sportgen"})[p.id]?`<h3 class="hlg hlg-${p.id}"><img src="img/clients/${({atelier:"figma",sorare:"sorare",sportgen:"sportgen"})[p.id]}.png" alt="${p.t}"></h3>`:`<h3>${p.t}</h3>`}<p>${p.sub}</p></div></div>`}); });
    // sites intégrés : interface façon calque de code Figma ({ } nom, puis commentaire / agrandir / lancer)
    nodes.forEach(n=>n.el.querySelectorAll('[data-cl]').forEach(b=>b.addEventListener('pointerdown',e=>{ e.stopPropagation(); const k=b.dataset.cl; if(k==='open'||(k==='play'&&!LIVE)) return; e.preventDefault(); select(n); if(k==='play') liveUse(n); })));
    // sites intégrés : le vrai site s'affiche directement dans la frame, sans texte, une fois l'arrivée terminée
    if(LIVE&&!MOB) setTimeout(()=>nodes.forEach(n=>{ if(n.type==='frame'&&P[n.pi]&&P[n.pi].link) liveOn(n); }),2600);
    add({type:'note',name:'Note',x:1130,y:-560,w:250,h:0,r:5,html:'<div class="fb">Everything moves, rotates, stretches. Add shapes, scribble. Click a project to open it.</div>'});
    // post-it : le Konami code, à taper sur la page
    add({type:'note',cls:'postit',name:'Post-it',x:-1370,y:330,w:250,h:0,r:-6,html:'<div class="fb"><b>Konami code</b><span class="kc">↑ ↑ ↓ ↓ ← → ← →<br>B A ⏎</span></div>'});
    add({type:'shape',cls:'ell',name:'Ellipse',x:1160,y:-190,w:170,h:170,r:0,fill:'#564FFF'});
    add({type:'shape',cls:'rect',name:'Rectangle',x:1130,y:120,w:210,h:130,r:-12,fill:'#3BE9CE'});
    // gribouillis au feutre : entourés, soulignés, flèches, petites notes — ils se dessinent après l'arrivée
    const IB='#564FFF', IK='#202020', IG='#12BFA2'; let di=0; // vert de la DA, un cran plus soutenu pour se lire sur le papier
    const ink=(name,x,y,w,h,r,d,c=IB,sw=6,txt='')=>{ const dl=(6.2+(di++)*.28).toFixed(2);
      add({type:'path',cls:'ink',name,x,y,w,h,r,html:`<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" style="--d:${dl}s;overflow:visible">${d?`<path d="${d}" pathLength="1" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`:''}${txt}</svg>`}); };
    const note=(t,x,y,size=46,c=IB)=>`<text x="${x}" y="${y}" font-family="Caveat,cursive" font-weight="600" font-size="${size}" fill="${c}">${t}</text>`;
    // le sous-titre entouré
    ink('Scribble',-385,198,770,112,-1.5,'M70,22 C200,6 380,4 520,10 C660,16 712,38 700,66 C688,98 470,106 300,102 C130,98 10,86 14,60 C18,40 40,30 96,20');
    // « hello! » au-dessus du nom
    ink('Note',-760,-160,240,90,-8,'M14,74 C70,62 150,62 214,70','#564FFF',5,note('hello!',18,52,46));
    // flèche vers L'Atelier Figma
    ink('Arrow',236,-1010,270,150,0,'M92,60 C62,70 40,98 28,138 M28,138 L18,112 M28,138 L50,120',IK,5,note('latest',100,56,46,IK));
    // le post-it Konami entouré + « try it! »
    ink('Scribble',-1402,302,316,210,-4,'M30,40 C120,8 250,6 296,40 C330,70 312,170 270,192 C200,214 80,212 30,186 C2,160 0,70 24,48 C40,30 70,24 100,22',IG,5);
    ink('Note',-1390,190,240,130,-6,'M156,34 C196,44 212,74 206,116 M206,116 L192,92 M206,116 L222,96',IG,5,note('try it!',6,56,46,IG));
    // calque de code : « click me » avec flèche
    ink('Arrow',1065,410,230,150,0,'M206,40 C150,14 70,26 24,84 M24,84 L32,52 M24,84 L56,84',IB,5,note('click me',70,138,46));
    // double soulignement sous la note
    ink('Scribble',1130,-406,260,30,5,'M6,10 C80,4 180,6 254,12 M30,24 C100,18 170,20 236,26',IG,5);
    if(MOB){ for(const n of [...nodes]){ const keep=n.type==='frame'||NAMEL.includes(n)||(n.el.classList.contains('ink')&&['Scribble','Note','Arrow'].includes(n.name)&&(n.y===198||n.name==='Note'&&n.x===-760||n.name==='Arrow'&&n.x===236));
        if(!keep){ n.el.remove(); nodes.splice(nodes.indexOf(n),1); } }
      for(const n of nodes){ if(n.name==='Note'&&n.el.classList.contains('ink')){ n.x=-470; n.y=-420; place(n); } if(n.name==='Arrow'){ n.x=230; n.y=-1390; place(n); } } }
    center(); }
  // vue d'ouverture : le logo au centre, les projets autour
  function center(){ z=MOB?Math.min(innerWidth*.94/1320,innerHeight*.9/2450):innerWidth<=760?Math.min(innerWidth*.92/900,1):Math.min(innerWidth*.86/2400*1.3,innerHeight*.86/1680*1.3,1.2); px=innerWidth/2; py=innerHeight/2; apply(); }
  // retour à la vue d'ouverture (nom au centre), en glissant
  let homeRaf=0; function home(ms=900){ cancelAnimationFrame(homeRaf); const z0=z,x0=px,y0=py, z1=MOB?Math.min(innerWidth*.94/1320,innerHeight*.9/2450):innerWidth<=760?Math.min(innerWidth*.92/900,1):Math.min(innerWidth*.86/2400*1.3,innerHeight*.86/1680*1.3,1.2), x1=innerWidth/2, y1=innerHeight/2, t0=performance.now();
    const st=t=>{ const k=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-k,3); z=z0+(z1-z0)*e; px=x0+(x1-x0)*e; py=y0+(y1-y0)*e; apply(); if(k<1) homeRaf=requestAnimationFrame(st); }; homeRaf=requestAnimationFrame(st); }
  // revenu en haut après être descendu dans la page : le canvas se recentre sur le nom
  { let down=false; addEventListener('scroll',()=>{ if(scrollY>innerHeight*.6) down=true; else if(down&&scrollY<innerHeight*.35){ down=false; home(1100); } },{passive:true}); }
  // arrivée : chaque élément passe de x3 à x1 et de 0 à 100 % d'opacité, un par un, en 3 s
  // entrée en plusieurs temps : le canvas arrive d'abord en bloc (zoom arrière + flou), puis les lettres du nom
  // une à une avec un léger décalage irrégulier, puis le sous-titre, puis l'interface
  function arrive(){ document.documentElement.classList.add('cornin'); if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const E1='cubic-bezier(.16,1,.3,1)';
    // zoom arrière autour du centre de l'écran (= centre du bloc nom + sous-titre, point 0,0 du canvas) :
    // chaque élément part de sa position agrandie depuis ce centre, pas de son propre centre
    const zoomIn=(n,G,o)=>{ const cx=n.x+n.w/2, cy=n.y+n.h/2;
      n.el.animate([{translate:`${(G-1)*cx}px ${(G-1)*cy}px`,scale:G,opacity:0,filter:`blur(${o.blur}px)`},{translate:'0px 0px',scale:1,opacity:1,filter:'blur(0px)'}],
        {duration:o.dur,delay:o.delay,easing:E1,fill:'backwards'}); };
    // 1. le nom d'abord, lettre par lettre avec de petits décalages irréguliers
    const jit=[0,90,30,140,60,110,20,160,45,95];
    NAMEL.filter(n=>n!==SUBN).forEach((n,i)=>zoomIn(n,2.2,{dur:2000,delay:300+i*120,blur:10})); /* lettres dans l'ordre de lecture */
    if(SUBN) zoomIn(SUBN,1.6,{dur:1400,delay:1500,blur:6});
    // 2. puis les projets et le reste du canvas, un par un
    const rest=nodes.filter(n=>!NAMEL.includes(n)), ord=[...rest.filter(n=>n.type==='frame'),...rest.filter(n=>n.type!=='frame'&&!n.el.classList.contains('ink')),...rest.filter(n=>n.el.classList.contains('ink'))];
    ord.forEach((n,i)=>{ const dl=2100+i*160; zoomIn(n,1.45,{dur:1700,delay:dl,blur:14});
      const sv=n.el.classList.contains('ink')&&n.el.querySelector('svg'); if(sv) sv.style.setProperty('--d',((dl+350)/1000).toFixed(2)+'s'); }); // les traits se dessinent dans la foulée, sans attente
    // 3. enfin l'interface
    // NA + space invader glissent depuis la gauche, opaques ; burger + chatbot depuis la droite, partant de 10 % d'opacité
    [['#home',1700,'-180px 0',1],['#invader',1800,'-180px 0',1],['#menuBtn',1700,'180px 0',0],['.top .ntr',1700,'180px 0',0],['#chat',1900,'0 140px',1]].forEach(([q,d,t,o])=>{ const el=$(q); if(el&&location.hash!=='#work') el.animate([{translate:t,opacity:o},{translate:'0 0',opacity:1}],{duration:1500,delay:d,easing:E1,fill:'backwards'}); }); }
  let tmp=null;
  if(MOB) cv.addEventListener('click',e=>{ const f=e.target.closest&&e.target.closest('.node.frame'); if(f&&f._n&&!f.querySelector('.cl')) openProject(f._n.pi,null); });
  cv.addEventListener('pointerdown',e=>{ if(MOB) return; document.querySelectorAll('.node.using').forEach(x=>{ if(!x.contains(e.target)) x.classList.remove('using'); }); cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptrs.size===2){ act=null; const [a,b]=[...ptrs.values()]; pinch={d:Math.hypot(a.x-b.x,a.y-b.y)||1,cx:(a.x+b.x)/2,cy:(a.y+b.y)/2}; return; }
    const w=toW(e), t=e.target, nel=t.closest&&t.closest('.node'), n=nel&&nel._n, pan=()=>{ act={k:'pan',sx:e.clientX,sy:e.clientY,px,py}; cv.style.cursor='grabbing'; };
    if(tool==='hand'||space||e.button===1) return pan();
    if(tool==='rect'||tool==='ell'){ const m=add({type:'shape',cls:tool,name:tool==='rect'?'Rectangle':'Ellipse',x:w.x,y:w.y,w:1,h:1,r:0,fill:PAL[(ci++)%PAL.length]}); act={k:'draw',n:m,ox:w.x,oy:w.y}; select(m); return; }
    if(tool==='pen'){ tmp=document.createElementNS('http://www.w3.org/2000/svg','svg'); tmp.setAttribute('style','position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible'); tmp.innerHTML='<path fill="none" stroke="#564FFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'; world.appendChild(tmp); act={k:'pen',pts:[[w.x,w.y]]}; return; }
    if(n&&(t.classList.contains('rot')||t.hasAttribute('data-rz'))){ act={k:'rot',n,a0:Math.atan2(w.y-(n.y+n.h/2),w.x-(n.x+n.w/2))*180/Math.PI-n.r}; return; }
    if(n&&t.dataset.h){ const h=t.dataset.h, sx=h.includes('e')?1:-1, sy=h[0]==='s'?1:-1, a=n.r*Math.PI/180, c=Math.cos(a), si=Math.sin(a), lx=-sx*n.w/2, ly=-sy*n.h/2;
      act={k:'size',n,sx,sy,c,si,ax:n.x+n.w/2+lx*c-ly*si,ay:n.y+n.h/2+lx*si+ly*c}; return; }
    if(n&&n===sel&&n.el.querySelector('.lv.ready')&&t.closest('.clb')){ liveUse(n); return; } // 2e clic sur un calque sélectionné = on utilise le site
    if(n){ const now=performance.now(); if(n.type==='frame'&&lastN===n&&now-lastT<380&&!n.el.querySelector('.cl')){ lastN=null; openProject(n.pi,null); return; } lastN=n; lastT=now; select(n); act={k:'move',n,ox:w.x-n.x,oy:w.y-n.y,sx:e.clientX,sy:e.clientY,t:now}; return; }
    select(null); pan(); });
  cv.addEventListener('pointermove',e=>{ if(!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pinch&&ptrs.size===2){ const [a,b]=[...ptrs.values()], d=Math.hypot(a.x-b.x,a.y-b.y)||1, cx=(a.x+b.x)/2, cy=(a.y+b.y)/2; px+=cx-pinch.cx; py+=cy-pinch.cy; zoomAt(cx,cy,d/pinch.d); pinch={d,cx,cy}; return; }
    if(!act) return; const w=toW(e), n=act.n;
    if(act.k==='pan'){ px=act.px+e.clientX-act.sx; py=act.py+e.clientY-act.sy; apply(); }
    else if(act.k==='move'){ n.x=w.x-act.ox; n.y=w.y-act.oy; n.moved=true; place(n); }
    else if(act.k==='draw'){ let dw=w.x-act.ox, dh=w.y-act.oy; if(e.shiftKey){ const m=Math.max(Math.abs(dw),Math.abs(dh)); dw=Math.sign(dw||1)*m; dh=Math.sign(dh||1)*m; } n.x=Math.min(act.ox,act.ox+dw); n.y=Math.min(act.oy,act.oy+dh); n.w=Math.max(1,Math.abs(dw)); n.h=Math.max(1,Math.abs(dh)); place(n); }
    else if(act.k==='pen'){ const l=act.pts[act.pts.length-1]; if(Math.hypot(w.x-l[0],w.y-l[1])>2/z){ act.pts.push([w.x,w.y]); tmp.firstChild.setAttribute('d',pathD(act.pts)); } }
    else if(act.k==='rot'){ let a=Math.atan2(w.y-(n.y+n.h/2),w.x-(n.x+n.w/2))*180/Math.PI-act.a0; if(e.shiftKey) a=Math.round(a/15)*15; n.r=a; n.moved=true; place(n); }
    else if(act.k==='size'){ const vx=w.x-act.ax, vy=w.y-act.ay, lx=vx*act.c+vy*act.si, ly=-vx*act.si+vy*act.c; let nw=Math.max(24,lx*act.sx), nh=Math.max(24,ly*act.sy);
      if(auto(n)){ nw=Math.max(n.type==='text'?60:180,nw); n.el.style.width=nw+'px'; if(n.type==='text') n.el.style.fontSize=(nw*n.k)+'px'; nh=n.el.offsetHeight; } const ox=act.sx*nw/2, oy=act.sy*nh/2, cx=act.ax+ox*act.c-oy*act.si, cy=act.ay+ox*act.si+oy*act.c;
      n.w=nw; n.h=nh; n.x=cx-nw/2; n.y=cy-nh/2; n.moved=true; place(n); } });
  const up=e=>{ ptrs.delete(e.pointerId); if(ptrs.size<2) pinch=null; if(!act) return; const a=act; act=null; hintOff();
    if(a.k==='move'&&a.n.type==='frame'&&!a.n.el.querySelector('.cl')&&Math.hypot(e.clientX-a.sx,e.clientY-a.sy)<5&&performance.now()-a.t<320){ lastN=null; openProject(a.n.pi,null); return; }
    if(a.k==='draw'){ if(a.n.w<6&&a.n.h<6){ a.n.w=a.n.h=140; a.n.x-=70; a.n.y-=70; place(a.n); } setTool('select'); sTick(); }
    if(a.k==='pen'){ tmp.remove(); tmp=null; const xs=a.pts.map(q=>q[0]), ys=a.pts.map(q=>q[1]), x0=Math.min(...xs), y0=Math.min(...ys), w=Math.max(4,Math.max(...xs)-x0), h=Math.max(4,Math.max(...ys)-y0);
      if(a.pts.length>2){ const sp=simplify(a.pts.map(q=>[q[0]-x0,q[1]-y0]),3/z); const m=add({type:'path',name:'Vector',x:x0,y:y0,w,h,r:0,html:vecHTML(sp,w,h,false)}); select(m); sTick(); } }
    setTool(tool); };
  cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
  // molette : pincer / Ctrl = zoom, glisser horizontal = déplacer, vertical = la page défile (le canvas dézoome)
  // pincer au pad n'importe où sur la vue canvas (barre d'outils, prompt, frames…) zoome le canvas, jamais la page entière
  const wPinch=e=>{ if(!(e.ctrlKey||e.metaKey)||!isOn()||overlayOpen()||cv.contains(e.target)) return; e.preventDefault(); zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*.01)); };
  const wCv=e=>{ if(e.ctrlKey||e.metaKey){ e.preventDefault(); zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*.01)); } };
  // les écouteurs « non passifs » (nécessaires au pincement) ne sont branchés qu'en haut, sur le canvas : partout ailleurs le scroll reste 100 % fluide
  let wOn=false; const syncW=()=>{ const want=isOn()&&scrollY<innerHeight*.5&&!overlayOpen(); if(want===wOn) return; wOn=want;
    if(want){ addEventListener('wheel',wPinch,{passive:false,capture:true}); cv.addEventListener('wheel',wCv,{passive:false}); }
    else { removeEventListener('wheel',wPinch,{capture:true}); cv.removeEventListener('wheel',wCv); } };
  addEventListener('scroll',syncW,{passive:true}); setInterval(syncW,500); syncW();
  /* Safari (Mac) : le pincement du pad n'envoie pas de molette + ctrl, mais des « gesture » : on zoome avec eux */
  { let gs=1; const ok=()=>isOn()&&!overlayOpen()&&scrollY<=innerHeight*.5;
    addEventListener('gesturestart',e=>{ if(!ok()) return; e.preventDefault(); gs=e.scale||1; },{passive:false});
    addEventListener('gesturechange',e=>{ if(!ok()) return; e.preventDefault(); const s=e.scale||1; const f=s/gs; gs=s; if(f>0&&isFinite(f)) zoomAt(e.clientX||innerWidth/2,e.clientY||innerHeight/2,f); },{passive:false});
    addEventListener('gestureend',e=>{ if(ok()) e.preventDefault(); gs=1; },{passive:false}); }
  // molette / deux doigts : scroll normal de la page. Seul le pincement zoome ; on se déplace en glissant ou en maintenant Espace

  // jamais coincé entre deux : à l'arrêt, on revient au canvas ou on se pose sur la bannière + About
  let push=0, snapT=0, chain=0, lastW=0; const snapTop=()=>{ const c=document.getElementById('about'); return c?Math.max(innerHeight*.6,c.getBoundingClientRect().top+scrollY-innerHeight*.16):innerHeight*.94; };
  function setPg(){ const sh=$('#scrollHint'); if(sh) sh.style.setProperty('--pg',Math.min(1,Math.max(push/240*.3, scrollY>0?.3+.7*scrollY/snapTop():0)).toFixed(3)); }
  let pgRaf=0; addEventListener('scroll',()=>{ if(!pgRaf) pgRaf=requestAnimationFrame(()=>{ pgRaf=0; if(scrollY<innerHeight*1.5) setPg(); }); },{passive:true});
  function armSnap(){ return; clearTimeout(snapT); snapT=setTimeout(()=>{ if(!isOn()||overlayOpen()) return; const y=scrollY, T=snapTop(); if(y>0&&y<T-2){ if(y<T*.08) scrollTo({top:0,behavior:'smooth'}); else if(y>T*.55) scrollTo({top:T,behavior:'smooth'}); } },420); } // une fois lancé, on termine la descente : jamais figé à mi-fondu

  let lastP=-1, sRaf=0; function onScroll(){ if(sRaf) return; sRaf=requestAnimationFrame(()=>{ sRaf=0; onScrollNow(); }); }
  function onScrollNow(){ if(!isOn()) return; const p=Math.min(1,Math.max(0,scrollY/innerHeight)); if(p===lastP) return; lastP=p; if(p>.01&&!window.__arrDone){ window.__arrDone=1; document.querySelectorAll('#cv .node').forEach(el=>el.getAnimations().forEach(an=>{ try{an.finish()}catch(e){} })); } /* on scrolle pendant l'intro : on termine l'arrivée tout de suite pour que le fondu au scroll s'applique */
    // comme une intro de jeu : le décor (projets, formes, grille) s'efface vite, le nom reste plus longtemps
    sk=1-.55*p; apply(); cv.style.setProperty('--po',Math.max(0,1-p*2.3).toFixed(3)); const sh=$('#scrollHint'); if(sh){ sh.style.setProperty('--sh',Math.max(0,Math.min(1,1-(p-.75)*4)).toFixed(3)); sh.style.visibility=p>=.99?'hidden':''; sh.classList.toggle('shgo',!!(p>0.003||sh._push)); sh.style.pointerEvents=p>.8?'none':''; } cv.style.setProperty('--no',Math.max(0,Math.min(1,1-(p-.36)*3.2)).toFixed(3)); /* le nom part après le décor (décalé) */ cv.style.visibility=p>=.99?'hidden':''; cv.style.pointerEvents=p>.5?'none':'';
    ['#cvhint'].forEach(q=>{ const el=$(q); el.style.opacity=p?String(Math.max(0,1-p*2.2)):''; el.style.pointerEvents=p>.3?'none':''; }); }
  addEventListener('scroll',onScroll,{passive:true});
  // bannière clients liée au scroll : le bord droit de la bande suit le scroll, la liste se répète à l'infini
  { const CL=[['sorare','Sorare'],['figma','Figma'],['sportgen','Sport [Gen]'],['smartgemini','Smart Gemini']], one=()=>CL.map(([f,n])=>`<img class="${f}" src="img/clients/${f}.png" alt="${n}">`).join(''), tr=$('#ctrack'); let setW=0;
    const fill=()=>{ if(!tr) return; tr.innerHTML=one(); setW=tr.scrollWidth||1; tr.innerHTML=Array(Math.ceil(innerWidth/setW)+2).fill(one()).join(''); };
    // la bande est déjà pleine : elle défile toute seule doucement vers la droite, et un peu plus quand on scrolle
    let t0=performance.now(), on=false, raf=0;
    const move=()=>{ if(!tr||!setW) return; const pos=(performance.now()-t0)*.028+scrollY*.18; tr.style.transform=`translate3d(${(pos%setW-setW).toFixed(1)}px,0,0)`; };
    const loop=()=>{ move(); raf=on&&!document.hidden?requestAnimationFrame(loop):0; };
    if(tr&&'IntersectionObserver' in window) new IntersectionObserver(es=>{ on=es[0].isIntersecting; if(on&&!raf) raf=requestAnimationFrame(loop); }).observe(tr.parentNode);
    document.addEventListener('visibilitychange',()=>{ if(!document.hidden&&on&&!raf) raf=requestAnimationFrame(loop); });
    addEventListener('resize',()=>{ fill(); move(); });
    const ready=()=>{ if(!tr) return; fill(); Promise.all([...tr.querySelectorAll('img')].slice(0,CL.length).map(im=>im.decode?im.decode().catch(()=>{}):0)).then(()=>{ fill(); move(); }); };
    (document.fonts?document.fonts.ready:Promise.resolve()).then(ready); }
  addEventListener('keydown',e=>{ if(!isOn()||overlayOpen()) return; const k=e.key.toLowerCase(), T={v:'select',h:'hand',r:'rect',o:'ell',p:'pen'};
    if(T[k]&&!e.metaKey&&!e.ctrlKey) return setTool(T[k]);
    if(k===' '){ if(scrollY>innerHeight*.3||(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))) return; e.preventDefault(); if(!space){ space=true; cv.style.cursor='grab'; document.documentElement.classList.add('cvgrab'); } return; }
    if(k==='1') return fit();
    if((k==='delete'||k==='backspace')&&sel&&sel.type!=='frame'&&!NAMEL.includes(sel)){ e.preventDefault(); sel.el.remove(); nodes=nodes.filter(n=>n!==sel); sel=null; return sClose(); }
    const D={arrowleft:[-1,0],arrowright:[1,0],arrowup:[0,-1],arrowdown:[0,1]}[k]; if(D&&sel){ e.preventDefault(); const st=(e.shiftKey?10:1)*10; sel.x+=D[0]*st; sel.y+=D[1]*st; place(sel); } });
  addEventListener('keyup',e=>{ if(e.key===' '&&space){ space=false; setTool(tool); document.documentElement.classList.remove('cvgrab'); } });
  $('#tools').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; if(b.dataset.t) setTool(b.dataset.t); if(b.id==='zIn') zoomAt(innerWidth/2,innerHeight/2,1.25); if(b.id==='zOut') zoomAt(innerWidth/2,innerHeight/2,.8); if(b.id==='zFit') fit(); sTick(); });
  const hint=$('#cvhint'); let hT=0; function hintOff(){ hint.classList.remove('on'); clearTimeout(hT); }
  // ----- mode source : chaque calque affiche le code qui le dessine, mis à jour en direct
  let SRC=false;
  const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const T=t=>`<span class="t">${t}</span>`, A=(a,v)=>` <span class="a">${a}</span>=<span class="v">"${esc(v)}"</span>`, C=t=>`<span class="c">${esc(t)}</span>`, r1=v=>Math.round(v*10)/10;
  const geo=n=>A('style',`left:${r1(n.x)}px; top:${r1(n.y)}px; width:${r1(n.w)}px; height:${r1(n.h)}px; rotate:${r1(n.r)}deg`);
  function codeOf(n){ let c=n.el.querySelector('.code'); if(!c){ c=document.createElement('pre'); c.className='code'; n.el.appendChild(c); }
    let h;
    if(n.type==='frame'&&(P[n.pi]||{}).link){ const p=P[n.pi]; h=`${C('// code layer — '+esc(p.t))}\n${T('&lt;code-layer')}${A('name',p.t)}${A('id',p.id||'')}\n ${geo(n)}${T('&gt;')}\n  ${T('&lt;iframe')}${A('src',p.link[1])}\n   ${A('width','1440')}${A('height','900')}${A('loading','lazy')}${T('&gt;&lt;/iframe&gt;')}\n  ${T('&lt;img')}${A('slot','poster')}${A('src','img/'+p.imgs[0]+'.jpg')}${T('&gt;')}\n${T('&lt;/code-layer&gt;')}\n${C('// 💬 → openProject('+n.pi+')   ⤢ ▷ → '+esc(p.link[0]))}`; }
    else if(n.type==='frame'){ const p=P[n.pi]||{}; h=`${T('&lt;article')}${A('class','frame')}${A('id',p.id||'')}\n ${geo(n)}${T('&gt;')}\n  ${T('&lt;img')}${A('src','img/'+(p.imgs?p.imgs[0]:'')+'.jpg')}${T('&gt;')}\n  ${T('&lt;h3&gt;')}${esc(p.t||n.name)}${T('&lt;/h3&gt;')}\n  ${T('&lt;p&gt;')}${esc((p.nat||'')+' — '+(p.y||''))}${T('&lt;/p&gt;')}\n  ${T('&lt;p&gt;')}${esc(p.sub||'')}${T('&lt;/p&gt;')}\n${T('&lt;/article&gt;')}\n${C('// click → openProject('+n.pi+')')}`; }
    else if(n.el.classList.contains('glyph')){ const d=(n.el.querySelector('path')||{getAttribute:()=>''}).getAttribute('d')||''; h=`${T('&lt;path')}${A('d',d.slice(0,260)+'…')}${T('/&gt;')}`; }
    else if(n.type==='path'){ const d=(n.el.querySelector('path')||{getAttribute:()=>''}).getAttribute('d')||''; h=`${T('&lt;svg')}${geo(n)}${T('&gt;')}\n  ${T('&lt;path')}${A('d',d)}${A('stroke','#564FFF')}${T('/&gt;')}\n${T('&lt;/svg&gt;')}`; }
    else if(n.type==='note'){ h=`${T('&lt;p')}${A('class','note')}${geo(n)}${T('&gt;')}\n  ${esc(n.el.querySelector('.fb')?.textContent||'')}\n${T('&lt;/p&gt;')}`; }
    else { h=`${T('&lt;div')}${A('class',(n.cls||'shape'))}\n ${geo(n)}${A('fill',n.fill||'#564FFF')}${T('&gt;&lt;/div&gt;')}`; }
    c.innerHTML=h; }
  function srcMode(on){ SRC=on; if(on) nodes.forEach(codeOf); }
  return { src:srcMode, home, enter(){ document.documentElement.classList.add('cvs');
      if(!inited){ init(); arrive(); setTimeout(()=>{ if(!scrollY){ hint.classList.add('on'); hT=setTimeout(hintOff,9000); } },3600); } else apply(); lastP=-1; onScrollNow(); },
    leave(){ document.documentElement.classList.remove('cvs'); scrollTo(0,0); sk=1; cv.style.transform=cv.style.opacity=cv.style.pointerEvents=cv.style.visibility=''; cv.style.removeProperty('--po'); cv.style.removeProperty('--no'); ['#tools','#cvhint'].forEach(q=>{ $(q).style.opacity=$(q).style.pointerEvents=''; }); } };
})();

/* ---------- viewer : la carte elle-même s'agrandit, le fond ne bouge pas ---------- */
const viewer=$('#viewer'), vImg=$('#vImg'); let vSet=[], vIdx=0, vIdx0=0, vTitle='', vFrom=null; const AR={};
const nat=n=>new Promise(r=>{ if(AR[n]) return r(AR[n]); const i=new Image(); i.onload=()=>r(AR[n]=i.naturalWidth/i.naturalHeight); i.onerror=()=>r(1.5); i.src=src(n); });
function fitRect(ar){ const mw=innerWidth*.84, mh=innerHeight*.78; let w=mw,h=w/ar; if(h>mh){h=mh;w=h*ar} return {left:(innerWidth-w)/2,top:(innerHeight-h)/2,width:w,height:h}; }
function setRect(r,anim){ if(!anim) vImg.style.transition='none'; Object.assign(vImg.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'}); if(!anim){ void vImg.offsetWidth; vImg.style.transition=''; } }
function vMeta(){ $('#vCap').innerHTML=`${vTitle}<small>${vIdx+1} / ${vSet.length}</small>`;
  $('#vCode').innerHTML=codeHL(`<figure class="viewer" data-index="${vIdx+1}/${vSet.length}"><img src="img/${vSet[vIdx]}.jpg" alt="${vTitle}"><figcaption>${vTitle} — ${vIdx+1} / ${vSet.length}</figcaption></figure>`);
  $('#vThumbs').innerHTML=vSet.length>1?vSet.map((n,k)=>`<button data-k="${k}" aria-current="${k===vIdx}"><img src="${src(n)}" alt=""></button>`).join(''):'';
  viewer.querySelectorAll('.nav').forEach(b=>b.style.display=vSet.length>1?'':'none'); }
async function vGo(k){ if(k===vIdx) return; vIdx=mod(k,vSet.length); sTick(); vMeta(); vImg.style.opacity=0; const ar=await nat(vSet[vIdx]);
  setTimeout(()=>{ vImg.style.backgroundImage=`url(${src(vSet[vIdx])})`; vImg.style.backgroundPosition='center'; setRect(fitRect(ar),true); vImg.style.opacity=1; },200); }
const vStep=d=>vGo(vIdx+d);
/* ---------- mode console : les sous-pages affichées comme leur code ---------- */
function codeHL(html){
  const toks=html.replace(/\s+/g,' ').split(/(<[^>]+>)/).filter(t=>t.trim()); const VOID=/^<(img|br|i|input|meta|link|hr)\b/i; let d=0, out=[];
  const ind=()=>'  '.repeat(Math.max(0,d));
  const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const tag=t=>esc(t).replace(/([a-z-]+)=("[^"]*")/gi,'<span class="a">$1</span>=<span class="v">$2</span>').replace(/^(&lt;\/?)([a-z0-9-]+)/i,'$1<span class="t">$2</span>');
  toks.forEach(t=>{ if(t.startsWith('</')){ d--; out.push(ind()+tag(t)); } else if(t.startsWith('<')){ out.push(ind()+tag(t)); if(!VOID.test(t)&&!t.endsWith('/>')) d++; } else out.push(ind()+esc(t.trim())); });
  return out.join('\n'); }
async function openViewer(set,idx,title,fromEl){ vSet=set; vIdx=vIdx0=idx; vTitle=title; vFrom=fromEl||null; const n=set[idx];
  vImg.style.backgroundImage=`url(${src(n)})`; const im=fromEl&&fromEl.querySelector('img'); vImg.style.backgroundPosition=im?getComputedStyle(im).objectPosition:'center';
  const arP=nat(n);
  if(fromEl){ setRect(fromEl.getBoundingClientRect(),false); vImg.style.opacity=1; fromEl.style.visibility='hidden'; }
  else { const r=fitRect(await arP); setRect({left:r.left,top:r.top+40,width:r.width,height:r.height},false); vImg.style.opacity=0; }
  vMeta(); viewer.classList.add('on'); sOpen(); const ar=await arP;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ vImg.style.opacity=1; setRect(fitRect(ar),true); }));
}
function closeViewer(){ const back=vFrom&&vIdx===vIdx0&&document.contains(vFrom)&&vFrom.getClientRects().length;
  const f=vFrom; viewer.classList.remove('on'); sClose();
  if(back){ f.style.visibility='hidden'; const r=f.getBoundingClientRect(); const im=f.querySelector('img'); vImg.style.backgroundPosition=im?getComputedStyle(im).objectPosition:'center'; setRect(r,true); setTimeout(()=>{ f.style.visibility=''; vImg.style.opacity=0; },660); }
  else { vImg.style.opacity=0; if(f) f.style.visibility=''; }
  vFrom=null; }
viewer.querySelector('.prev').onclick=()=>vStep(-1); viewer.querySelector('.next').onclick=()=>vStep(1);
vImg.onclick=()=>vSet.length>1?vStep(1):closeTop();
$('#vThumbs').onclick=e=>{const b=e.target.closest('button'); if(b) vGo(+b.dataset.k);};
viewer.onclick=e=>{ if(e.target===viewer) closeTop(); };

/* ---------- case : la carte monte, la feuille se déplie dessous ---------- */
const kase=$('#case'); let kCard=null;
function heroFlip(hero,card,toCard){ const c=card.getBoundingClientRect(), h=hero.getBoundingClientRect(); const base=hero.style.transform; hero.style.transform='none'; const h0=hero.getBoundingClientRect(); hero.style.transform=base;
  return `translate(${c.left-h0.left}px,${c.top-h0.top}px) scale(${c.width/h0.width},${c.height/h0.height})`; }
function openCase(i,el){ const p=P[i]; kCard=el||null; kase.classList.remove('closing');
  $('#caseCol').innerHTML=`
   <div class="hero" data-k="0"><img src="${src(p.imgs[0])}" alt="${p.t}" style="object-position:${p.pos}"></div>
   <article class="sheet draw">
     <div class="eyebrow">0${i+1} — ${p.nat} — ${p.y}</div>
     <h2>${p.t}${LOOP}</h2>
     <p class="sub">${p.sub}</p>
     <dl class="info">${p.info.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
     <p>${p.txt[0]}</p><p>${p.txt[1]}</p>
     <div class="grid">${p.imgs.slice(1).map((n,k)=>`<button data-k="${k+1}"><img src="${src(n)}" alt="${p.t} — image ${k+2}" loading="lazy"></button>`).join('')}</div>
     <p style="margin-top:70px">${p.txt[2]}</p>
     ${p.link?`<a class="go" href="${p.link[1]}" target="_blank" rel="noopener">${p.link[0]} ↗</a>`:''}
   </article>`;
  $('#caseCol').querySelectorAll('img').forEach(im=>{ const pre=document.createElement('pre'); pre.className='icode'; pre.innerHTML=codeHL(`<img src="${im.getAttribute('src')}" alt="${im.alt}"${im.getAttribute('style')?` style="${im.getAttribute('style')}"`:''}>`); im.parentNode.appendChild(pre); });
  const hero=$('#caseCol .hero'); kase.scrollTop=0;
  if(kCard){ const c=kCard.getBoundingClientRect(); hero.style.height=(hero.offsetWidth*c.height/c.width)+'px';
    hero.style.transition='none'; hero.style.borderRadius='16px'; hero.style.transform=heroFlip(hero,kCard); kCard.style.visibility='hidden'; void hero.offsetWidth;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ hero.style.transition=''; hero.style.transform=''; hero.style.borderRadius=''; })); }
  kase.classList.add('on'); sOpen();
  $('#caseCol').onclick=e=>{ const el=e.target.closest('[data-k]'); if(el) openViewer(p.imgs,+el.dataset.k,p.t,el); };
}
function closeCase(){ const hero=$('#caseCol .hero'), c=kCard; kase.classList.add('closing'); kase.classList.remove('on'); sClose();
  if(c&&hero&&kase.scrollTop<innerHeight*.6&&c.getClientRects().length){ c.style.visibility='hidden'; hero.style.borderRadius='16px'; hero.style.transform=heroFlip(hero,c);
    setTimeout(()=>{ c.style.visibility=''; $('#caseCol').innerHTML=''; },660); }
  else { if(hero){hero.style.transition='opacity .25s';hero.style.opacity=0;} if(c) c.style.visibility=''; setTimeout(()=>{$('#caseCol').innerHTML='';},660); }
  kCard=null; }
kase.onclick=e=>{ if(e.target===kase||e.target.id==='caseCol') closeTop(); };
function openProject(i,el){ target=Math.round(target)+(mod(i-Math.round(target)+N/2,N)-N/2); const p=P[i]; p.kase?openCase(i,el):openViewer(p.imgs,0,p.t,el); }

// pas d'écran d'intro : on arrive directement sur le site (son coupé, activable avec le bouton son)
setSound(false); rot=window.WORKPAGE?target:target-1.6; setMode(defMode());
addEventListener('resize',layout);
loop();

{ const b=document.getElementById('backCv'); if(b){ const ES=document.querySelector('.aosend'); const up=()=>b.classList.toggle('on',ES?ES.getBoundingClientRect().top<innerHeight*.6:scrollY>innerHeight*1.05); /* « Back to the canvas » seulement à partir de « Let's build your system » */ addEventListener('scroll',up,{passive:true}); up(); b.addEventListener('click',()=>{ scrollTo({top:0,behavior:'smooth'}); try{ CV.home(1100); }catch(e){} }); } }
document.getElementById('scrollHint').addEventListener('click',()=>{ const pr=document.querySelector('.pres'); scrollTo({top:pr?pr.getBoundingClientRect().top+scrollY:innerHeight,behavior:'smooth'}); });
{ if(!matchMedia('(max-width:760px)').matches){ const t=document.getElementById('tools'), f=document.getElementById('cform'); if(t&&f){ t.querySelectorAll('button').forEach(b=>b.type='button'); f.insertBefore(t,f.firstChild); } } }
{ const H=()=>{ const h=location.hash; if(h==='#work'||h==='#about') history.replaceState(null,'',location.pathname+location.search); if(h==='#work'){ closeTop(); setMode('ring'); } else if(h==='#about'){ closeTop(); goAbout(); } };
 addEventListener('load',()=>setTimeout(H,60)); addEventListener('hashchange',H);
 document.querySelectorAll('a[href="#about"]').forEach(a=>a.addEventListener('click',e=>{ e.preventDefault(); closeTop(); goAbout(); })); }
{ const A=()=>document.documentElement.classList.add('cornin'); if(location.hash==='#work'||matchMedia('(max-width:760px)').matches) A(); setTimeout(A,2600); }
{ const a=document.getElementById('about'), H=document.documentElement; if(a){ const sec=a.querySelector('section')||a; let tk=0;
  /* le fond bleu monte progressivement pendant que la section About arrive (lié au scroll), le texte passe en blanc à mi-chemin */
  const f=()=>{ tk=0; const bg=document.querySelector('.bluebg'); if(!bg) return; if(!H.classList.contains('cvs')||H.classList.contains('src')){ bg.style.opacity=''; H.classList.remove('blueon'); return; }
    if(H.classList.contains('endblue')){ bg.style.opacity=''; return; }
    const r=sec.getBoundingClientRect(), v=innerHeight; const pin=Math.min(1,Math.max(0,(v*.95-r.top)/(v*.75))), pout=Math.min(1,Math.max(0,(r.bottom-v*.05)/(v*.6))); const p=Math.min(pin,pout);
    bg.style.opacity=p.toFixed(3); H.classList.toggle('blueon',p>.55); };
  addEventListener('scroll',()=>{ if(!tk) tk=requestAnimationFrame(f); },{passive:true}); addEventListener('resize',f); setTimeout(f,300); } }
/*notch*/ /* barre du bas (home, en haut de page) : les outils et la prompt box séparés par une encoche douce et arrondie */
{ const f=document.getElementById('cform'), t=document.getElementById('tools'); if(f&&t){ let tk=0;
  const upd=()=>{ tk=0; const tr=t.getBoundingClientRect(), fr=f.getBoundingClientRect(); const on=t.parentElement===f&&tr.width>40&&getComputedStyle(t).opacity!=='0'&&getComputedStyle(t).display!=='none';
    f.classList.toggle('notched',on); if(on){ const sp=t.querySelectorAll('.sep')[1]; const x=sp?sp.getBoundingClientRect().left+sp.offsetWidth/2:tr.right; f.style.setProperty('--nx',(x-fr.left).toFixed(1)+'px'); } };
  const q=()=>{ if(!tk) tk=requestAnimationFrame(upd); }; addEventListener('scroll',q,{passive:true}); addEventListener('resize',q); if('ResizeObserver' in window) new ResizeObserver(q).observe(f); setTimeout(upd,400); setInterval(upd,1200); } }
