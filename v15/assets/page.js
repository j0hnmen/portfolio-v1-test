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
