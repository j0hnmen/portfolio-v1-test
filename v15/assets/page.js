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

/*cstream*/ /* Case study : un prompt s'écrit dans la tuile AssetsOS, s'envoie, l'asset correspondant sort du système, le texte s'efface, prompt suivant… Vitesse constante. */
{ const belt=document.getElementById('csbelt'); if(belt){ const stage=belt.parentElement, src=stage.querySelector('.cs-src'), RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const mock=k=>({land:'<i class="b w"></i><i class="l"></i><i class="l s"></i><i class="btn"></i>',post:'<i class="sq"></i><i class="l"></i>',story:'<i class="tall"></i><i class="l s"></i>',mail:'<i class="l"></i><i class="l s"></i><i class="b"></i><i class="l s"></i>',ad:'<i class="b w"></i><i class="btn"></i>',caro:'<i class="sq h"></i><i class="sq h"></i><i class="sq h"></i>',badge:'<i class="circ"></i><i class="l s"></i>'})[k];
  const P=[['Announce the launch on LinkedIn','post','LinkedIn post'],['A story for Friday’s event','story','Story'],['Landing page for the webinar','land','Landing page'],['The March newsletter','mail','Email'],['3 ad banners for the sale','ad','Ad banner'],['Turn this article into a carousel','caro','Carousel'],['Badges for the summit','badge','Event badge'],['A post for the new hire','post','Social post']];
  /* la barre de prompt dans la tuile */
  const bar=document.createElement('div'); bar.className='cs-prompt'; bar.innerHTML='<span class="cs-pt"></span><i class="cs-caret"></i><b class="cs-send" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg></b>'; if(src) src.appendChild(bar);
  const pt=bar.querySelector('.cs-pt');
  let seed=11; const rnd=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };
  const live=[]; let lane=0; const START=250, INTRO=2300, V=.036;
  const spawn=(i,x0)=>{ const [,k,n]=P[i%P.length]; const c=document.createElement('div'); c.className='cs-card cs-'+k+(x0?' ok':''); c.innerHTML=`<div class="cs-m">${mock(k)}</div><div class="cs-f"><span>${n}</span><b>✓ On brand</b></div>`; belt.appendChild(c);
    lane=(lane+2)%5; const y=(lane-2)*82+(rnd()*2-1)*22; live.push({el:c,x:x0||START,y,s:.88+rnd()*.2,r:(rnd()*2-1)*5,ph:rnd()*6.28,born:x0?-1e5:performance.now(),sw:(y>0?-1:1)*(90+rnd()*70)});
    if(!x0) setTimeout(()=>c.classList.add('ok'),INTRO-150); };
  /* à l'arrivée, le flux est déjà rempli, au même rythme que les envois */
  { const W=(belt.offsetWidth||1100)+160; let i=0; for(let x=W-40;x>START+V*INTRO+130;x-=138) spawn(i++ +3,x); }
  let last=performance.now(), vis=false, raf=0;
  const ease=t=>1-Math.pow(1-t,2); /* glissé doux : la vitesse de sortie rejoint la vitesse de croisière, sans arrêt */
  const step=now=>{ raf=0; const dt=Math.min(64,now-last); last=now; const W=belt.offsetWidth+160;
    for(let j=live.length-1;j>=0;j--){ const c=live[j], age=now-c.born, fl=Math.sin(now/1100+c.ph); let x,y,rot,sc,bl=0,op;
      if(age<INTRO&&!RM){ /* swoop : la carte sort du bouton d'envoi et décrit une courbe jusqu'à sa place */
        const t=ease(age/INTRO), u=1-t, P0=[-24,118], P1=[START*.5,c.y+c.sw*.4], P2=[START,c.y];
        x=u*u*P0[0]+2*u*t*P1[0]+t*t*P2[0]+V*age; y=u*u*P0[1]+2*u*t*P1[1]+t*t*P2[1]; c.x=x;
        const dx=2*u*(P1[0]-P0[0])+2*t*(P2[0]-P1[0]), dy=2*u*(P1[1]-P0[1])+2*t*(P2[1]-P1[1]);
        rot=Math.atan2(dy,dx)*57.3*.35*u+c.r*t; sc=c.s*(.7+.3*t); bl=4*u; op=Math.min(1,age/220); }
      else { if(!RM) c.x+=V*dt; x=c.x; y=c.y+fl*5; rot=c.r+fl*1.2; sc=c.s; op=Math.min(1,(W-x)/140); }
      c.el.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`; c.el.style.opacity=Math.max(0,op).toFixed(3); c.el.style.filter=bl>.2?`blur(${bl.toFixed(1)}px)`:'';
      if(x>W){ c.el.remove(); live.splice(j,1); } }
    if(vis) raf=requestAnimationFrame(step); };
  /* à chaque envoi : une grande onde bleue part de la tuile et traverse l'écran, derrière le contenu */
  let wl=null; const wave=()=>{ if(RM||!src||document.hidden) return; { const s=stage.getBoundingClientRect(); if(s.bottom<innerHeight*.35||s.top>innerHeight*.65) return; } /* pas d'onde si la section n'est pas vraiment à l'écran */
    /* l'onde est accrochée à la page (pas à l'écran) : elle suit la tuile quand on scrolle */
    if(!wl){ wl=document.createElement('div'); wl.className='cs-wavelayer'; wl.setAttribute('aria-hidden','true'); document.body.appendChild(wl); }
    wl.style.height=document.documentElement.scrollHeight+'px';
    const r=src.getBoundingClientRect(); /* l'onde part du centre de la tuile */ [0].forEach((d,n)=>{ const w=document.createElement('i'); w.className='cs-wave'+(n?' w2':''); w.style.left=(r.left+scrollX+r.width/2)+'px'; w.style.top=(r.top+scrollY+r.height/2)+'px'; w.style.animationDelay=d+'ms'; wl.appendChild(w); setTimeout(()=>w.remove(),1200+d); }); };
  /* survol + clic sur la tuile : chaque clic fait sortir un nouvel asset (avec son onde) */
  if(src){ src.setAttribute('data-tip','Click to ship'); src.setAttribute('data-keeptip',''); let lastC=0;
    src.addEventListener('click',()=>{ const n=performance.now(); if(n-lastC<180) return; lastC=n; spawn(Math.floor(rnd()*P.length)); wave(); bar.classList.add('sent'); setTimeout(()=>bar.classList.remove('sent'),260); }); }
  /* boucle : écrire → envoyer (un asset sort) → effacer → suivant */
  let pi=0, on=false, timer=0; const wait=ms=>new Promise(r=>timer=setTimeout(r,ms));
  const loop=async()=>{ if(on) return; on=true; while(vis){ const txt=P[pi%P.length][0];
      for(let i=1;i<=txt.length&&vis;i++){ pt.textContent=txt.slice(0,i); await wait(38+Math.random()*40); }
      await wait(380); if(!vis) break; bar.classList.add('sent'); spawn(pi); wave(); src&&src.classList.add('emit'); await wait(260); bar.classList.remove('sent'); src&&src.classList.remove('emit');
      await wait(700); for(let i=txt.length;i>=0&&vis;i--){ pt.textContent=txt.slice(0,i); await wait(14); } await wait(320); pi++; }
    on=false; };
  new IntersectionObserver(es=>{ vis=es[0].isIntersecting; if(vis){ if(!raf){ last=performance.now(); raf=requestAnimationFrame(step); } loop(); } else if(wl){ wl.querySelectorAll('.cs-wave').forEach(w=>w.remove()); } },{rootMargin:'0px'}).observe(stage);
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) vis=false; }); } }

/*pricinglink*/ /* « See pricing » : saut immédiat (pas de défilement animé) sur le titre Pricing */
document.addEventListener('click',e=>{ const a=e.target.closest('a[href="#pricing"]'); if(!a) return; const t=document.getElementById('pricing-title'); if(!t) return; e.preventDefault();
  const y=t.getBoundingClientRect().top+scrollY-Math.round(innerHeight*.14); const H=document.documentElement, sb=H.style.scrollBehavior; H.style.scrollBehavior='auto'; scrollTo(0,y); H.style.scrollBehavior=sb; history.replaceState(null,'','#pricing'); });

/*ysol*/ /* page AssetsOS : la tuile répond à « The problem » */
{ const card=document.querySelector('#system .aoscard'), l=card&&card.querySelector('.aosl'); if(l&&!l.querySelector('.ysol')){ const e=document.createElement('div'); e.className='eb ysol'; e.innerHTML='<span data-i="ysol">Your solution</span>'; l.insertBefore(e,l.firstChild);} }

/*darkprob*/ /* « The problem » : un fond noir arrive doucement avec la section, puis repart quand la tuile AssetsOS monte */
{ const sec=document.querySelector('.page .stack>.band.prob'), H=document.documentElement; if(sec){ const bg=document.createElement('div'); bg.className='darkbg'; bg.setAttribute('aria-hidden','true'); document.body.prepend(bg);
  const sys=document.getElementById('system'); let tk=0;
  const f=()=>{ tk=0; if(H.classList.contains('src')){ bg.style.opacity=0; H.classList.remove('darkon'); return; }
    const v=innerHeight, r=sec.getBoundingClientRect(); const pin=Math.min(1,Math.max(0,(v*.5-r.top)/(v*.22))); /* arrive tard, se cale vite */
    let pout=1; if(sys){ const s=sys.getBoundingClientRect(); pout=Math.min(1,Math.max(0,(s.top-v*.12)/(v*.22))); }
    const p=Math.min(pin,pout); bg.style.opacity=p.toFixed(3); H.classList.toggle('darkon',p>.5); };
  addEventListener('scroll',()=>{ if(!tk) tk=requestAnimationFrame(f); },{passive:true}); addEventListener('resize',f); f(); } }
