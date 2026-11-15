/* V1.5 — page.js : comportements propres aux pages de contenu (AssetsOS, About, Contact). Chaque bloc ne s'active que si sa section existe. */
{ const els=document.querySelectorAll('.page .rv:not(.aosx *),.page .hero');
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('seen'); io.unobserve(e.target); } }),{threshold:.18});
  els.forEach(el=>io.observe(el)); }
/* accordéons (skill, FAQ) */
{ ["sk","fq"].forEach(g=>{const all=[...document.querySelectorAll("."+g)];const E="cubic-bezier(.22,.8,.24,1)";const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
function shut(d){const w=d.querySelector(".dw");if(!d.open)return;if(rm){d.open=false;return}d.classList.add("closing");const a=w.animate([{height:w.offsetHeight+"px",opacity:1},{height:"0px",opacity:0}],{duration:380,easing:E});a.onfinish=()=>{d.open=false;d.classList.remove("closing")}}
function show(d){const w=d.querySelector(".dw");d.open=true;if(rm)return;const h=w.scrollHeight;w.animate([{height:"0px",opacity:0},{height:h+"px",opacity:1}],{duration:460,easing:E});const t=w.querySelector(".dt");t&&t.animate([{transform:"translateY(-8px)"},{transform:"none"}],{duration:520,easing:E})}
all.forEach(d=>d.querySelector("summary").addEventListener("click",e=>{e.preventDefault();if(d.open&&!d.classList.contains("closing")){shut(d)}else{all.forEach(o=>{if(o!==d)shut(o)});show(d)}}))});
}
/* courbe « decay » */
(()=>{const d=document.querySelector(".decay");if(!d)return;const p=d.querySelector(".trend path");function draw(){const r=d.getBoundingClientRect();const pts=[...d.querySelectorAll(".dot")].map(e=>{const b=e.getBoundingClientRect();return[b.left+b.width/2-r.left,b.top+b.height/2-r.top]});if(pts.length<2)return;let s="M"+pts[0].join(" ");for(let i=1;i<pts.length;i++){const[a,b]=pts[i-1],[c,e]=pts[i],m=(c-a)/2;s+=` C${a+m} ${b} ${c-m} ${e} ${c} ${e}`}p.setAttribute("d",s)}draw();addEventListener("resize",draw);document.fonts&&document.fonts.ready.then(draw)})();
/* logo du hero AssetsOS */
(()=>{const l=document.querySelector(".page .logo");if(!l)return;const ok=()=>l.classList.add("sigok");if(matchMedia("(prefers-reduced-motion:reduce)").matches)ok();else setTimeout(ok,1780)})();
/* AssetsOS : « The problem » puis la tuile AssetsOS qui monte par-dessus */
(()=>{const p=document.querySelector('.stack>.band.prob'),c=document.getElementById('system');if(!p||!c)return;
const place=()=>{[p,c].forEach(el=>{const h=el.offsetHeight,v=innerHeight;el.style.setProperty('--st',Math.round(h<v-32?(v-h)/2:Math.min(16,v-h-16))+'px')})};
const f=()=>{const r=c.getBoundingClientRect(),pr=p.getBoundingClientRect();p.classList.toggle('under',r.top<pr.bottom-40)};
addEventListener('scroll',f,{passive:true});addEventListener('resize',()=>{place();f()});document.fonts&&document.fonts.ready.then(place);place();f()})();
/*aostilejs*/{ 
  /* la carte « The problem » recule et s'efface au fur et à mesure que la tuile AssetsOS monte par-dessus */
  const p=document.querySelector('.stack>.band.prob'), c=document.getElementById('system'); if(p&&c&&!matchMedia('(prefers-reduced-motion:reduce)').matches){ let tk=0; const f=()=>{ tk=0; const top=parseFloat(getComputedStyle(c).top)||0, r=c.getBoundingClientRect(), k=Math.min(1,Math.max(0,1-(r.top-top)/(innerHeight*.7))); p.style.opacity=(1-k).toFixed(3); p.style.transform=`scale(${(1-.06*k).toFixed(4)})`; p.style.filter=`blur(${(6*k).toFixed(2)}px)`; }; addEventListener('scroll',()=>{ if(!tk) tk=requestAnimationFrame(f); },{passive:true}); f(); } }
/* Contact : copier l'adresse */
{ const b=document.getElementById('ctcopy'); if(b) b.addEventListener('click',()=>{ const done=()=>{ const t=b.textContent; b.classList.add('ok'); b.textContent=document.documentElement.lang==='fr'?'Copié ✓':'Copied ✓'; setTimeout(()=>{ b.classList.remove('ok'); b.textContent=t; },1600); }; (navigator.clipboard?navigator.clipboard.writeText('hello@nabilamara.com'):Promise.reject()).then(done,()=>{ const r=document.createRange(); r.selectNodeContents(document.querySelector('.ctaddr')); getSelection().removeAllRanges(); getSelection().addRange(r); document.execCommand('copy'); done(); }); });
document.querySelectorAll('.ct .rv').forEach(el=>setTimeout(()=>el.classList.add('seen'),120)); }

/*mani*/ /* Impact · Clarity · Value : les lignes se tracent, les mots montent ; le mot le plus proche du centre de l'écran passe en dégradé bleu */
{ const m=document.querySelector('.page .mani'); if(m){ const rows=[...m.querySelectorAll('.mrow')]; m.classList.add('manifx'); rows.forEach((r,i)=>r.style.setProperty('--i',i));
  let tk=0; const f=()=>{ tk=0; const c=innerHeight*.5; let best=null,bd=1e9; rows.forEach(r=>{ const b=r.getBoundingClientRect(); const d=Math.abs(b.top+b.height/2-c); if(d<bd&&b.bottom>0&&b.top<innerHeight){bd=d;best=r;} }); rows.forEach(r=>r.classList.toggle('on',r===best)); };
  addEventListener('scroll',()=>{ if(!tk) tk=requestAnimationFrame(f); },{passive:true}); f();
  rows.forEach(r=>r.addEventListener('pointerenter',()=>{ rows.forEach(x=>x.classList.toggle('on',x===r)); })); } }

/*cstream*/ /* Case study : tout sort du même système, livré propre. Le flux avance tout seul, et plus vite quand on scrolle. */
{ const belt=document.getElementById('csbelt'); if(belt){ const stage=belt.parentElement, RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const T=[['Landing page','land'],['Social post','post'],['Story','story'],['Email','mail'],['Ad banner','ad'],['Carousel','caro'],['LinkedIn post','post'],['Event badge','badge']];
  const mock=k=>({land:'<i class="b w"></i><i class="l"></i><i class="l s"></i><i class="btn"></i>',post:'<i class="sq"></i><i class="l"></i>',story:'<i class="tall"></i><i class="l s"></i>',mail:'<i class="l"></i><i class="l s"></i><i class="b"></i><i class="l s"></i>',ad:'<i class="b w"></i><i class="btn"></i>',caro:'<i class="sq h"></i><i class="sq h"></i><i class="sq h"></i>',badge:'<i class="circ"></i><i class="l s"></i>'})[k];
  const N=10, cards=[]; let seed=7; const rnd=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };
  for(let i=0;i<N;i++){ const [n,k]=T[i%T.length]; const c=document.createElement('div'); c.className='cs-card cs-'+k; c.innerHTML=`<div class="cs-m">${mock(k)}</div><div class="cs-f"><span>${n}</span><b>✓ On brand</b></div>`; belt.appendChild(c);
    cards.push({el:c,y:(((i*3)%5)-2)*82+(rnd()*2-1)*24,j:rnd(),s:.84+rnd()*.24,r:(rnd()*2-1)*5}); }
  let off=0, last=performance.now(), lastY=scrollY, vis=false, raf=0;
  const step=now=>{ raf=0; const dt=Math.min(64,now-last); last=now; const dy=scrollY-lastY; lastY=scrollY;
    off+= (RM?0:dt*.045) + Math.max(0,dy)*.9;
    const W=belt.offsetWidth, L=W*1.3, sp=L/N;
    cards.forEach((c,i)=>{ let x=((off+i*sp+c.j*sp*.35)%L+L)%L; const t=Math.min(1,x/180); const yy=c.y*Math.min(1,.25+.75*t);
      c.el.style.transform=`translate3d(${x.toFixed(1)}px,${yy.toFixed(1)}px,0) rotate(${(c.r*t).toFixed(2)}deg) scale(${((.5+.5*t)*c.s).toFixed(3)})`; c.el.style.opacity=(t*Math.min(1,(L-x)/140)).toFixed(3); });
    if(vis) raf=requestAnimationFrame(step); };
  new IntersectionObserver(es=>{ vis=es[0].isIntersecting; if(vis&&!raf){ last=performance.now(); lastY=scrollY; raf=requestAnimationFrame(step); } },{rootMargin:'200px 0px'}).observe(stage);
  document.addEventListener('visibilitychange',()=>{ if(document.hidden){ vis=false; } }); } }

/*pricinglink*/ /* « See pricing » : saut immédiat (pas de défilement animé) sur le titre Pricing */
document.addEventListener('click',e=>{ const a=e.target.closest('a[href="#pricing"]'); if(!a) return; const t=document.getElementById('pricing-title'); if(!t) return; e.preventDefault();
  const y=t.getBoundingClientRect().top+scrollY-Math.round(innerHeight*.14); const H=document.documentElement, sb=H.style.scrollBehavior; H.style.scrollBehavior='auto'; scrollTo(0,y); H.style.scrollBehavior=sb; history.replaceState(null,'','#pricing'); });

/*ysol*/ /* page AssetsOS : la tuile répond à « The problem » */
{ const card=document.querySelector('#system .aoscard'), l=card&&card.querySelector('.aosl'); if(l&&!l.querySelector('.ysol')){ const e=document.createElement('div'); e.className='eb ysol'; e.innerHTML='<span data-i="ysol">Your solution</span>'; l.insertBefore(e,l.firstChild);} }
