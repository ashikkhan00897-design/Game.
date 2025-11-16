// Animo — Anime Stream (Lite). No server; everything in localStorage.
const $ = (sel, el=document)=> el.querySelector(sel);
const $$ = (sel, el=document)=> Array.from(el.querySelectorAll(sel));

const state = { user: null, route: 'home', data: null, filtered: null, playing: null };

async function loadData(){ const res = await fetch('data/catalog.json'); state.data = await res.json(); render(); }
function getUser(){ try { return JSON.parse(localStorage.getItem('animo:user')||'null'); } catch { return null; } }
function setUser(u){ localStorage.setItem('animo:user', JSON.stringify(u)); state.user = u; updateLoginBtn(); }
function updateLoginBtn(){ const btn = $('#loginBtn'); if (state.user){ btn.textContent = state.user.name + ' ▾'; } else { btn.textContent = 'Login'; } }

function getList(){ return JSON.parse(localStorage.getItem('animo:list')||'[]'); }
function setList(arr){ localStorage.setItem('animo:list', JSON.stringify(arr)); }
function toggleList(id){ const a=getList(); const i=a.indexOf(id); if(i>=0)a.splice(i,1);else a.push(id); setList(a); render(); }
function inList(id){ return getList().includes(id); }

function keyProg(id){ return 'animo:prog:'+id; }
function setProgress(id, cur, dur){ localStorage.setItem(keyProg(id), JSON.stringify({cur,dur,at:Date.now()})); }
function getProgress(id){ try{ return JSON.parse(localStorage.getItem(keyProg(id))||'null'); }catch{return null;} }

function keyCom(id){ return 'animo:com:'+id; }
function addComment(id, user, text){ const a=JSON.parse(localStorage.getItem(keyCom(id))||'[]'); a.push({user,text,at:Date.now()}); localStorage.setItem(keyCom(id), JSON.stringify(a)); }
function getComments(id){ return JSON.parse(localStorage.getItem(keyCom(id))||'[]'); }

function setRoute(r){ state.route = r; render(); }

function elCard(t){
  const tpl = $('#cardTpl').content.cloneNode(true);
  tpl.querySelector('.card__img').style.backgroundImage='linear-gradient(135deg,#3a3a3a,#1f1f1f)';
  tpl.querySelector('.card__title').textContent = `${t.name} ${t.year?`(${t.year})`:''}`;
  tpl.querySelector('.card__meta').textContent = t.genres.join(' • ');
  const act = tpl.querySelector('.card__actions');
  const bw=document.createElement('button'); bw.className='btn'; bw.textContent='Watch'; bw.onclick=()=>openDetail(t.id);
  const bl=document.createElement('button'); bl.className='btn btn--ghost'; bl.textContent=inList(t.id)?'− Remove':'＋ My List'; bl.onclick=()=>toggleList(t.id);
  act.append(bw,bl);
  return tpl;
}

function openDetail(id){
  const t = (JSON.parse(localStorage.getItem('animo:custom')||'[]').find(x=>x.id===id)) || state.data.titles.find(x=>x.id===id);
  const v = $('#view');
  v.innerHTML = `<section class="section">
    <div class="hero"><div class="hero__inner">
      <div class="hero__title">${t.name}</div>
      <div class="hero__sub">${t.genres.join(' • ')} ${t.year?` • ${t.year}`:''}</div>
      <p class="tag">${t.description||''}</p>
      <div class="chips">${t.genres.map(g=>`<span class="chip">${g}</span>`).join('')}</div>
      <div class="chips">${t.episodes.map((ep,i)=>`<button class="chip" data-play="${ep.id}">EP${i+1}: ${ep.name}</button>`).join('')}</div>
    </div></div>
    <div class="section__title">Episodes</div>
    <div class="grid" id="eps"></div></section>`;
  const eps = $('#eps');
  t.episodes.forEach(ep=>{
    const card=document.createElement('article'); card.className='card';
    card.innerHTML=`<div class="card__img"></div>
      <div class="card__body"><div class="card__title">${ep.name}</div>
      <div class="card__meta">Duration ${ep.duration||'—'}</div>
      <div class="card__actions">
        <button class="btn" data-play="${ep.id}">Play</button>
        <button class="btn btn--ghost" data-continue="${ep.id}">Continue</button>
      </div></div>`;
    eps.append(card);
  });
  document.querySelectorAll('[data-play]').forEach(b=> b.onclick=()=>playEpisode(id,b.getAttribute('data-play')));
  document.querySelectorAll('[data-continue]').forEach(b=> b.onclick=()=>playEpisode(id,b.getAttribute('data-continue'), true));
  window.scrollTo({top:0,behavior:'smooth'});
}

function render(){
  updateLoginBtn();
  const v = $('#view');
  if(!state.data){ v.innerHTML='<div class="empty">Loading...</div>'; return; }
  if(state.route==='mylist'){
    const ids = getList(); const my = [...state.data.titles, ...(JSON.parse(localStorage.getItem('animo:custom')||'[]'))].filter(t=>ids.includes(t.id));
    if(!my.length){ v.innerHTML='<div class="empty">Your list is empty.</div>'; return; }
    v.innerHTML='<section class="section"><div class="section__title">My List</div><div class="grid" id="grid"></div></section>';
    const g=$('#grid'); my.forEach(t=> g.append(elCard(t))); return;
  }
  if(state.route==='admin'){
    v.innerHTML=`<section class="section admin">
      <div class="section__title">Add Custom Stream (local only)</div>
      <form id="adminForm">
        <input name="title" placeholder="Title" required />
        <input name="episode" placeholder="Episode name" required />
        <input name="url" placeholder="Video URL (.m3u8 or .mp4)" required />
        <select name="type"><option value="hls">HLS (.m3u8)</option><option value="mp4">MP4</option></select>
        <input name="genres" placeholder="Genres (comma separated)" />
        <button class="btn" type="submit">Add</button>
      </form>
      <p class="tag">This saves to your browser only. Use URLs you have permission to stream.</p>
    </section>`;
    $('#adminForm').onsubmit=(e)=>{
      e.preventDefault();
      const fd=new FormData(e.target);
      const cust=JSON.parse(localStorage.getItem('animo:custom')||'[]');
      const id='c-'+Math.random().toString(36).slice(2,8);
      cust.push({ id, name:fd.get('title'), year:new Date().getFullYear(), genres:(fd.get('genres')||'User').split(',').map(s=>s.trim()).filter(Boolean), description:'User added stream', episodes:[{ id:id+'-ep1', name:fd.get('episode'), duration:'—', sources:[{type:fd.get('type'), url:fd.get('url')}], subtitles:[] }] });
      localStorage.setItem('animo:custom', JSON.stringify(cust));
      alert('Added! Check Home/My List after refresh.');
    };
    return;
  }
  v.innerHTML=`<section class="section">
    <div class="hero"><div class="hero__inner">
      <div class="hero__title">Watch anime you have rights to stream.</div>
      <div class="hero__sub">Demo app — free sample videos only.</div>
    </div></div>
    <div class="section__title">Trending</div>
    <div class="grid" id="grid"></div></section>`;
  const g=$('#grid'); const all=[...state.data.titles, ...(JSON.parse(localStorage.getItem('animo:custom')||'[]'))];
  all.forEach(t=> g.append(elCard(t)));
}

let video, playerEl;
function setupPlayer(){
  video = $('#video'); playerEl=$('#player');
  $('#btnClose').onclick=closePlayer;
  $('#btnSub').onclick=()=>{
    const i=document.createElement('input'); i.type='file'; i.accept='.vtt,text/vtt';
    i.onchange=()=>{ const f=i.files[0]; if(!f) return; const url=URL.createObjectURL(f); addTrack(url,f.name.replace(/\..+$/,'')); };
    i.click();
  };
  $('#btnAddList').onclick=()=>{ if(!state.playing) return; toggleList(state.playing.titleId); };
  video.addEventListener('timeupdate', ()=>{
    if(!state.playing) return;
    $('#progressText').textContent = formatTime(video.currentTime)+' / '+formatTime(video.duration||0);
    setProgress(state.playing.epId, Math.floor(video.currentTime), Math.floor(video.duration||0));
  });
  $('#commentForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!state.playing) return;
    const val=$('#commentInput').value.trim(); if(!val) return;
    const user=state.user?.name||'Guest'; addComment(state.playing.epId,user,val); $('#commentInput').value=''; renderComments(state.playing.epId);
  });
}
function addTrack(src,label){ $$('#video track').forEach(t=>t.remove()); const t=document.createElement('track'); t.kind='subtitles'; t.label=label||'Sub'; t.srclang='en'; t.src=src; t.default=true; video.appendChild(t); }
function renderComments(id){
  const box=$('#commentList'); box.innerHTML=''; const list=getComments(id);
  if(!list.length){ box.innerHTML='<div class="empty">No comments yet.</div>'; return; }
  for(const c of list){ const el=document.createElement('div'); el.className='comment'; el.textContent = `${c.user}: ${c.text}  — ${new Date(c.at).toLocaleString()}`; box.append(el); }
}
function formatTime(t){ if(!isFinite(t)) return '00:00'; const m=Math.floor(t/60), s=Math.floor(t%60); return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
function closePlayer(){ playerEl.classList.add('hidden'); playerEl.setAttribute('aria-hidden','true'); if(video){ video.pause(); video.src=''; } state.playing=null; history.replaceState({},'',location.pathname); }
function playEpisode(titleId, epId, resume=false){
  const t = (JSON.parse(localStorage.getItem('animo:custom')||'[]').find(x=>x.id===titleId)) || state.data.titles.find(x=>x.id===titleId);
  const ep = t.episodes.find(e=>e.id===epId);
  state.playing={titleId,epId};
  $('#playerTitle').textContent=t.name; $('#epLabel').textContent=ep.name; $('#btnAddList').textContent=inList(titleId)?'− My List':'＋ My List';
  const v=$('#video'); $$('#video track').forEach(t=>t.remove());
  if(ep.subtitles&&ep.subtitles.length){ for(const s of ep.subtitles){ const tr=document.createElement('track'); tr.kind='subtitles'; tr.label=s.label; tr.srclang=s.srclang; tr.src=s.src; v.appendChild(tr);} }
  let src=ep.sources.find(s=>s.type==='hls')||ep.sources[0];
  if(src.type==='hls' && window.Hls && window.Hls.isSupported()){ const hls=new Hls({maxBufferLength:30}); hls.loadSource(src.url); hls.attachMedia(v); } else { v.src=src.url; }
  const prog= resume && getProgress(ep.id); v.currentTime = prog?.cur || 0; v.play().catch(()=>{});
  renderComments(ep.id); $('#progressText').textContent='00:00 / 00:00';
  $('#player').classList.remove('hidden'); $('#player').setAttribute('aria-hidden','false');
  location.hash = `#watch=${titleId}:${epId}`;
}

$('#search').addEventListener('input',(e)=>{
  const q=e.target.value.toLowerCase().trim(); if(!state.data){render();return;}
  if(!q){ render(); return; }
  const out=state.data.titles.filter(t=> t.name.toLowerCase().includes(q) || t.episodes.some(ep=>ep.name.toLowerCase().includes(q)));
  const v=$('#view'); v.innerHTML='<section class="section"><div class="section__title">Search results</div><div class="grid" id="grid"></div></section>';
  const g=$('#grid'); out.forEach(t=> g.append(elCard(t)));
});

document.querySelectorAll('.nav .link').forEach(b=> b.addEventListener('click', ()=>{
  document.querySelectorAll('.nav .link').forEach(x=>x.classList.remove('active')); b.classList.add('active');
  setRoute(b.getAttribute('data-route')||'home');
}));

$('#loginBtn').addEventListener('click', ()=>{
  if(state.user){ if(confirm('Log out?')) setUser(null); return; }
  const name=prompt('Enter a profile name:'); if(name) setUser({name});
});

if('serviceWorker' in navigator){ window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); }); }

window.addEventListener('DOMContentLoaded', ()=>{
  state.user = getUser(); updateLoginBtn(); setupPlayer(); loadData();
  if(location.hash.startsWith('#watch=')){ const [t,e]=location.hash.slice(7).split(':'); loadData().then(()=> playEpisode(t,e)); }
});
