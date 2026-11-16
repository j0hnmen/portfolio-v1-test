/* V1.5 — page.js : comportements propres aux pages de contenu (AssetsOS, About, Contact). Chaque bloc ne s'active que si sa section existe. */
{ const els=document.querySelectorAll('.page .rv:not(.aosx *),.page .hero');
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('seen'); io.unobserve(e.target); } }),{threshold:0,rootMargin:'0px 0px -12% 0px'} /* seuil absolu : les sections très hautes (mobile) se révèlent aussi */);
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
  const MOBI=matchMedia('(max-width:760px)').matches; /* mobile : tuile en haut, les assets sortent par le bas et défilent sur toute la largeur */
  const live=[]; let lane=0; const START=MOBI?16:250, INTRO=MOBI?1900:2300, V=MOBI?.03:.036;
  const spawn=(i,x0)=>{ const [,k,n]=P[i%P.length]; const c=document.createElement('div'); c.className='cs-card cs-'+k+(x0?' ok':''); c.innerHTML=`<div class="cs-m">${mock(k)}</div><div class="cs-f"><span>${n}</span><b>✓ On brand</b></div>`; belt.appendChild(c);
    lane=(lane+2)%5; const y=MOBI?((lane%3)-1)*58+(rnd()*2-1)*12:(lane-2)*82+(rnd()*2-1)*22; live.push({el:c,x:x0||START,y,s:.88+rnd()*.2,r:(rnd()*2-1)*5,ph:rnd()*6.28,born:x0?-1e5:performance.now(),sw:(y>0?-1:1)*(90+rnd()*70)});
    if(!x0) setTimeout(()=>c.classList.add('ok'),INTRO-150); };
  /* à l'arrivée, le flux est déjà rempli, au même rythme que les envois */
  { const W=(belt.offsetWidth||1100)+160; let i=0; for(let x=W-40;x>START+V*INTRO+(MOBI?110:130);x-=(MOBI?112:138)) spawn(i++ +3,x); }
  let last=performance.now(), vis=false, raf=0;
  const ease=t=>1-Math.pow(1-t,2); /* glissé doux : la vitesse de sortie rejoint la vitesse de croisière, sans arrêt */
  const step=now=>{ raf=0; const dt=Math.min(64,now-last); last=now; const W=belt.offsetWidth+160;
    for(let j=live.length-1;j>=0;j--){ const c=live[j], age=now-c.born, fl=Math.sin(now/1100+c.ph); let x,y,rot,sc,bl=0,op;
      if(age<INTRO&&!RM){ /* swoop : la carte sort du bouton d'envoi et décrit une courbe jusqu'à sa place */
        const t=ease(age/INTRO), u=1-t, P0=MOBI?[belt.offsetWidth/2-50,-150]:[-24,118], P1=MOBI?[START+40,c.y-70]:[START*.5,c.y+c.sw*.4], P2=[START,c.y];
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
    const r=src.getBoundingClientRect(); /* l'onde part du centre de la tuile */ [0].forEach((d,n)=>{ const w=document.createElement('i'); w.className='cs-wave'+(n?' w2':''); w.style.left=(r.left+scrollX+r.width/2)+'px'; w.style.top=(r.top+scrollY+r.height/2)+'px'; w.style.setProperty('--w0',Math.round(Math.max(r.width,r.height)*1.02)+'px'); /* l'onde naît au bord de la tuile : visible tout de suite */ w.style.animationDelay=d+'ms'; wl.appendChild(w); setTimeout(()=>w.remove(),1200+d); }); };
  /* survol + clic sur la tuile : chaque clic fait sortir un nouvel asset (avec son onde) */
  if(src){ src.setAttribute('data-tip','Click to ship'); src.setAttribute('data-keeptip',''); let lastC=0;
    src.addEventListener('click',()=>{ const n=performance.now(); if(n-lastC<180) return; lastC=n; spawn(Math.floor(rnd()*P.length)); wave(); bar.classList.add('sent'); setTimeout(()=>bar.classList.remove('sent'),260); }); }
  /* boucle : écrire → envoyer (un asset sort) → effacer → suivant */
  let pi=0, on=false, timer=0; const wait=ms=>new Promise(r=>timer=setTimeout(r,ms));
  const loop=async()=>{ if(on) return; on=true; while(vis){ const txt=P[pi%P.length][0];
      for(let i=1;i<=txt.length&&vis;i++){ pt.textContent=txt.slice(0,i); await wait(38+Math.random()*40); }
      await wait(380); if(!vis) break; bar.classList.add('sent'); spawn(pi); wave(); /* l'onde et l'asset partent ensemble (l'onde naît au bord de la tuile) */ await wait(900); bar.classList.remove('sent'); /* le bouton reste bleu franc le temps de l'envoi (avant : il repassait au noir à mi-fondu → bleu sale) */
      await wait(60); for(let i=txt.length;i>=0&&vis;i--){ pt.textContent=txt.slice(0,i); await wait(14); } await wait(320); pi++; }
    on=false; };
  new IntersectionObserver(es=>{ vis=es[0].isIntersecting; if(vis){ if(!raf){ last=performance.now(); raf=requestAnimationFrame(step); } loop(); } else if(wl){ wl.querySelectorAll('.cs-wave').forEach(w=>w.remove()); } },{rootMargin:'0px'}).observe(stage);
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) vis=false; }); } }

/*pricinglink*/ /* « See pricing » : saut immédiat (pas de défilement animé) sur le titre Pricing */
/*smoothanchor*/ /* ancres internes (See pricing…) : défilement fluide, avec une courbe douce ; la cible est remesurée à chaque image (les sections qui apparaissent peuvent décaler la page) ; la molette ou le doigt reprennent la main */
{ const RMq=matchMedia('(prefers-reduced-motion:reduce)'); let stop=null;
  /* « Pricing » arrive pile à hauteur de la barre du haut : son centre aligné sur le centre de « Book a call » */
  const barMid=()=>{ const b=document.querySelector('.top .ntr'); if(!b) return 44; const r=b.getBoundingClientRect(); return r.height?r.top+r.height/2:44; };
  const dest=(id)=>{ const t=id==='pricing'?(document.getElementById('pricing-title')||document.getElementById('pricing')):document.getElementById(id); if(!t) return null; const r=t.getBoundingClientRect();
    const off=id==='pricing'?barMid()-r.height/2:Math.round(innerHeight*.08);
    return Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight, Math.round(r.top+scrollY-off))); };
  const go=(id)=>{ if(stop) stop(); const y0=scrollY, d0=dest(id); if(d0==null) return false; const H=document.documentElement, sb=H.style.scrollBehavior; H.style.scrollBehavior='auto';
    if(RMq.matches){ scrollTo(0,d0); H.style.scrollBehavior=sb; return true; }
    const dur=Math.min(1300,Math.max(650,Math.abs(d0-y0)*.45)), t0=performance.now(), ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; let raf=0;
    const end=()=>{ cancelAnimationFrame(raf); H.style.scrollBehavior=sb; ['wheel','touchstart','keydown'].forEach(ev=>removeEventListener(ev,end)); stop=null; };
    ['wheel','touchstart','keydown'].forEach(ev=>addEventListener(ev,end,{passive:true})); stop=end;
    const step=now=>{ const k=Math.min(1,(now-t0)/dur), d=dest(id); scrollTo(0,y0+(d-y0)*ease(k)); if(k<1) raf=requestAnimationFrame(step); else end(); }; raf=requestAnimationFrame(step); return true; };
  document.addEventListener('click',e=>{ const a=e.target.closest('a[href*="#"]'); if(!a||e.defaultPrevented||a.pathname!==location.pathname) return; const id=decodeURIComponent(a.hash.slice(1)); if(!id) return;
    if(go(id)){ e.preventDefault(); history.replaceState(null,'','#'+id); } }); }

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

/*abtl*/ /* À propos : frise verticale — la ligne se remplit au scroll, la bille suit, l'année géante change */
(()=>{ const L=document.querySelector('.vlist'); if(!L) return; const its=[...L.querySelectorAll('.vti')], yr=document.querySelector('.vyr'), line=L.querySelector('.vline'); let cur=-1, raf=0;
  const set=i=>{ if(i===cur||!yr) return; cur=i; const it=its[i], y=it.dataset.y, now=it.classList.contains('vnow');
    if(yr.textContent===y&&yr.classList.contains('now')===now) return; /* même année : rien ne bouge */ yr.classList.add('flip'); clearTimeout(yr._t); yr._t=setTimeout(()=>{ yr.textContent=y; yr.classList.toggle('now',now); yr.classList.remove('flip'); },180); };
  const upd=()=>{ raf=0; const lr=line.getBoundingClientRect(), mid=innerHeight*.5;
    const p=Math.max(0,Math.min(1,(mid-lr.top)/lr.height)); L.style.setProperty('--vp',p.toFixed(4));
    let on=0; its.forEach((it,i)=>{ const d=it.querySelector('.vdot').getBoundingClientRect(); const past=d.top+8<=mid; it.classList.toggle('past',past); if(past) on=i; });
    its.forEach((it,i)=>it.classList.toggle('on',i===on&&its[i].classList.contains('past'))); set(on); };
  addEventListener('scroll',()=>{ if(!raf) raf=requestAnimationFrame(upd); },{passive:true}); addEventListener('resize',upd); upd(); })();

/*evolve*/ /* Templates dynamiques : 3 use cases ; chaque demande à Claude fait évoluer le template ; à la fin, « Ship it » envoie l'asset */
(()=>{ const post=document.getElementById('evpost'); if(!post) return;
  const stage=post.parentNode, bar=stage.querySelector('.ev-prompt'), ship=stage.querySelector('.ev-ship'), tEl0=null, pEl=document.getElementById('evp'), ver=document.getElementById('evv'), verBox=ver.parentNode, vlab=verBox.querySelector('.ev-vl');
  const fr=()=>document.documentElement.lang==='fr', L=()=>fr()?'fr':'en';
  const t=(en,frr)=>`<span class="evt" data-en="${en}" data-fr="${frr}">${en}</span>`;
  const CASES=[
   { blocks:{logo:'<i></i>Nova', eye:'<span>'+t('Product launch','Lancement produit')+'</span>', title:'', img:'<i class="o1"></i><i class="o2"></i><i class="o3"></i>',
       quote:t('“Our brand, finally consistent everywhere.”','« Notre marque, enfin cohérente partout. »')+'<small>'+t('Founder, Nova','Fondatrice, Nova')+'</small>',
       badge:t('May 12','12 mai'), cta:t('Join the beta','Rejoindre la bêta')+' →'},
     cls:{logo:'ev-logo',eye:'ev-eye',title:'ev-title',img:'ev-img',quote:'ev-quote',badge:'ev-badge',cta:'ev-cta'},
     kind:{en:'Launch post',fr:'Post de lancement'}, title:{en:'Launch week is here',fr:'La semaine du lancement'},
     req:{en:['Add a quote from our founder','Add the launch date','Switch to our dark theme'],
          fr:['Ajoute une citation de notre fondatrice','Ajoute la date du lancement','Passe en thème sombre']},
     fmt:['4/5','4/5','4/5','4/5'], theme:[0,0,0,'dark'],
     S:[{logo:[7,6,30,6],eye:[7,15,34,6],title:[7,24,86,24],img:[7,51,86,43]},
        {logo:[7,6,30,6],eye:[7,15,34,6],title:[7,24,86,24],img:[52,51,41,43],quote:[7,51,42,43]},
        {logo:[7,6,30,6],eye:[7,15,34,6],title:[7,24,86,24],img:[52,51,41,43],quote:[7,51,42,43],badge:[70,3,24,0]},
        {logo:[7,4,30,3.4],eye:[7,9.5,34,3.4],title:[7,15,86,14],img:[7,32,86,30],quote:[7,64.5,86,19],badge:[70,2,24,0]},
        {logo:[7,4,30,3.4],eye:[7,9.5,34,3.4],title:[7,15,86,14],img:[7,32,86,26],quote:[7,60.5,86,18],badge:[70,2,24,0],cta:[7,85,86,7]}]},
   { blocks:{logo:'<i></i>Forma Summit', eye:'<span>'+t('Speaker','Speaker')+'</span>', title:'', photo:'',
       talk:'<small>'+t('Talk','Talk')+'</small>'+t('Design systems that scale','Des design systems qui passent à l’échelle'),
       date:t('June 3 · Main stage','3 juin · Grande scène'), partners:'<i></i><i></i><i></i>'},
     cls:{logo:'ev-logo',eye:'ev-eye',title:'ev-title',photo:'ev-photo',talk:'ev-talk',date:'ev-date',partners:'ev-partners'},
     kind:{en:'Speaker card',fr:'Carte speaker'}, title:{en:'Nina Moreau',fr:'Nina Moreau'},
     req:{en:['Add her talk title','Add the date and the stage','Use the yellow edition colors'],
          fr:['Ajoute le titre de son talk','Ajoute la date et la scène','Passe aux couleurs de l’édition jaune']},
     fmt:['1/1','1/1','1/1','1/1'], theme:[0,0,0,'yellow'],
     S:[{logo:[7,7,50,5],eye:[7,15,24,6],title:[7,25,48,26],photo:[58,15,35,70]},
        {logo:[7,7,50,5],eye:[7,15,24,6],title:[7,25,48,26],photo:[58,15,35,70],talk:[7,56,48,29]},
        {logo:[7,7,50,5],eye:[7,15,24,6],title:[7,25,48,26],photo:[58,15,35,70],talk:[7,52,48,27],date:[7,85,48,7]},
        {logo:[5,8,40,7],eye:[5,19,15,9],title:[5,31,50,24],photo:[60,9,35,82],talk:[5,58,50,22],date:[5,84,40,9]},
        {logo:[5,8,40,7],eye:[5,19,15,9],title:[5,31,50,24],photo:[60,9,35,66],talk:[5,58,50,22],date:[5,84,40,9],partners:[60,79,35,12]}]},
   { blocks:{ann:t('New: AI reports are live →','Nouveau : les rapports IA sont en ligne →'), nav:'<b><i></i>Orbit</b><span></span><span></span><span></span><em>'+t('Log in','Connexion')+'</em>', title:'',
       sub:'<i></i><i></i>', cta:t('Start free','Essai gratuit')+' →', shot:'<span class="ev-wd"><i></i><i></i><i></i></span><span class="ev-wc"><i></i><i></i><i></i></span>',
       quote:t('“We shipped our new site in a week.”','« Notre nouveau site, en ligne en une semaine. »')+'<small>'+t('Head of growth, Orbit','Head of growth, Orbit')+'</small>',
       logos:'<small>'+t('Trusted by','Ils nous font confiance')+'</small><i></i><i></i><i></i><i></i>'},
     cls:{ann:'ev-ann',nav:'ev-nav',title:'ev-title',sub:'ev-subl',cta:'ev-cta',shot:'ev-shot',quote:'ev-quote',logos:'ev-logos'},
     kind:{en:'Header',fr:'Header'}, title:{en:'Ship faster with Orbit',fr:'Livrez plus vite avec Orbit'},
     req:{en:['Add a row of customer logos','Add a testimonial','Switch to the spring campaign colors'],
          fr:['Ajoute une rangée de logos clients','Ajoute un témoignage','Passe aux couleurs de la campagne de printemps']},
     fmt:['16/10','16/10','16/10','16/10'], theme:[0,0,0,'mint'],
     S:[{nav:[4,5,92,8],title:[4,22,46,28],sub:[4,53,38,9],cta:[4,67,20,8],shot:[54,20,42,64]},
        {nav:[4,5,92,8],title:[4,20,46,26],sub:[4,48,38,9],cta:[4,61,20,8],shot:[54,19,42,58],logos:[4,85,92,8]},
        {nav:[4,5,92,8],title:[4,18,46,22],sub:[4,42,38,8],cta:[4,53,20,7.5],quote:[4,64,46,16],shot:[54,18,42,60],logos:[4,85,92,8]},
        {nav:[6,3,88,4],title:[6,10,88,14],sub:[6,25,80,5],cta:[6,32,40,4.5],shot:[6,40,88,26],quote:[6,69,88,13],logos:[6,85,88,5]},
        {ann:[0,0,100,3.8],nav:[6,6,88,4],title:[6,12.5,88,13],sub:[6,26.5,80,5],cta:[6,33.5,40,4.5],shot:[6,41,88,24],quote:[6,68,88,13],logos:[6,85,88,5]}]}];
  let C=0, B={}, tEl=null, txtLang=null;
  const build=()=>{ const c=CASES[C]; post.innerHTML=''; B={};
    for(const n in c.blocks){ const e=document.createElement('div'); e.className='ev-b '+c.cls[n]+' off'; e.dataset.b=n;
      e.innerHTML=n==='title'?'<span class="evtt"></span><i class="ev-caret"></i>':c.blocks[n]; post.appendChild(e); B[n]=e; }
    tEl=post.querySelector('.evtt'); };
  const lang=(lg)=>{ txtLang=lg; post.querySelectorAll('.evt').forEach(e=>e.textContent=e.dataset[lg]); };
  const apply=(k,born)=>{ const c=CASES[C], st=c.S[Math.min(k,2)]; /* v4 = même mise en page que v3, seul le thème change */
    post.style.aspectRatio=c.fmt[k]; post.classList.toggle('wide',c.fmt[k]==='16/9'||c.fmt[k]==='16/10'); post.classList.remove('dark','yellow','mint'); if(c.theme[k]) post.classList.add(c.theme[k]);
    for(const n in B){ const p=st[n], e=B[n];
      if(!p){ e.classList.add('off'); continue; }
      const wasOff=e.classList.contains('off'); e.classList.remove('off');
      e.style.left=p[0]+'%'; e.style.top=p[1]+'%'; e.style.width=p[2]+'%';
      if(n==='badge'){ e.style.height='auto'; e.style.aspectRatio='1'; } else e.style.height=p[3]+'%';
      if(wasOff&&born){ e.classList.remove('pop'); void e.offsetWidth; e.classList.add('pop'); } }
    if(c.flip===k){ const to=txtLang==='en'?'fr':'en'; post.querySelectorAll('.ev-b').forEach(e=>e.classList.add('swap'));
      setTimeout(()=>{ lang(to); typeTitle(c.title[to]); post.querySelectorAll('.ev-b').forEach(e=>e.classList.remove('swap')); },260); } };
  const wait=ms=>new Promise(r=>setTimeout(r,ms)); let run=0, vis=false;
  const type=async(el,txt,sp,id)=>{ el.textContent=''; for(const ch of txt){ if(id!==run) return false; el.textContent+=ch; await wait(sp); } return true; };
  const typeTitle=txt=>{ if(tEl) tEl.textContent=txt; };
  const bump=v=>{ ver.textContent='v'+v; verBox.classList.add('bump'); setTimeout(()=>verBox.classList.remove('bump'),450); };
  const loop=async()=>{ const id=++run, c=CASES[C]; bar.classList.remove('ship','sent'); ship.tabIndex=-1;
    build(); lang(L()); vlab.textContent=(fr()?'Template dynamique — ':'Active Template — ')+c.kind[L()]; ver.textContent='v1'; apply(0,false); pEl.textContent='';
    await wait(250); if(!await type(tEl,c.title[L()],42,id)) return;
    for(let k=0;k<c.req.en.length;k++){ /* 3 demandes : v1 → v4 */ if(id!==run) return; await wait(k?650:200); /* le prompt démarre presque tout de suite */
      if(!await type(pEl,c.req[L()][k],26,id)) return; await wait(320);
      bar.classList.add('sent'); apply(k+1,true); bump(k+2);
      await wait(500); bar.classList.remove('sent'); pEl.textContent=''; }
    if(id!==run) return; await wait(700); bar.classList.add('ship'); ship.tabIndex=0; };
  ship.addEventListener('click',async()=>{ if(!bar.classList.contains('ship')) return; bar.classList.remove('ship'); ship.tabIndex=-1; run++;
    post.classList.add('fly'); await wait(720);
    C=(C+1)%CASES.length; post.classList.add('enter'); post.classList.remove('fly'); build(); lang(L()); apply(0,false); void post.offsetWidth;
    post.classList.remove('enter'); await wait(500); if(vis) loop(); });
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){ build(); lang(L()); apply(3,false); typeTitle(CASES[0].title[L()]); ver.textContent='v4'; return; }
  build(); apply(0,false);
  new IntersectionObserver(es=>es.forEach(en=>{ const was=vis; vis=en.isIntersecting; if(vis&&!was&&!bar.classList.contains('ship')) loop(); else if(!vis) run++; }),{threshold:.25}).observe(post);
  new MutationObserver(()=>{ if(vis) loop(); }).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();

/*vlmask*/ /* frise À propos : logos en masque CSS (Safari recolorait mal les filtres → Sephora rose) */
{ document.querySelectorAll('.vlist img.vlogo:not(.vabc)').forEach(im=>{ const go=()=>{ const h=im.offsetHeight, nw=im.naturalWidth, nh=im.naturalHeight; if(!h||!nw) return;
    const m=document.createElement('span'); m.className=im.className+' vlm'; m.setAttribute('role','img'); m.setAttribute('aria-label',im.alt||'');
    const u=im.currentSrc||im.src; m.style.cssText=`display:block;height:${h}px;aspect-ratio:${nw}/${nh};max-width:100%;-webkit-mask:url("${u}") left center/contain no-repeat;mask:url("${u}") left center/contain no-repeat;`; im.replaceWith(m); };
  if(im.complete&&im.naturalWidth) go(); else im.addEventListener('load',go,{once:true}); }); }

/*plansin*/ /* Pricing : les deux cartes glissent légèrement depuis la gauche et la droite, puis se posent */
{ const pl=document.querySelector('#pricing .plans'); if(pl&&'IntersectionObserver' in window){ pl.classList.add('plpre');
  new IntersectionObserver((es,o)=>{ if(es[0].isIntersecting){ o.disconnect(); requestAnimationFrame(()=>pl.classList.add('plin')); } },{threshold:.18}).observe(pl); } }
/*skok*/ document.querySelectorAll('#skill details.sk').forEach(d=>{ const on=()=>{ d.classList.remove('skon'); if(d.open){ void d.offsetWidth; d.classList.add('skon'); } };
  d.addEventListener('toggle',on);
  if(d.open){ const io=new IntersectionObserver(es=>{ if(es[0].isIntersecting){ on(); io.disconnect(); } },{threshold:.6}); io.observe(d); } });
/*decaylabel*/ document.querySelectorAll('.decay').forEach(d=>{ const sp=d.querySelector('.ax span'), dot=d.querySelector('.dot'); if(!sp||!dot) return; const ax=sp.parentNode; const pos=()=>{ const a=ax.getBoundingClientRect(), b=dot.getBoundingClientRect(); sp.style.left=Math.round(b.left+b.width/2-a.left+18)+'px'; }; pos(); addEventListener('resize',pos); addEventListener('load',pos); new ResizeObserver(pos).observe(d); });
