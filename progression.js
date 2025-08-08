
(function(){
  const REGISTRY_KEY = 'users_registry';
  const DATA_KEY     = 'users_data';
  const ACTIVE_KEY   = 'activeUser';

  function load(k, f){ try{ return JSON.parse(localStorage.getItem(k)) ?? f; } catch(e){ return f; } }
  function save(k, v){ localStorage.setItem(k, JSON.stringify(v)); }

  const Registry = {
    get(){ return load(REGISTRY_KEY, []); },
    has(id){ return this.get().includes(id); },
    add(id){ const a=this.get(); if(!a.includes(id)){ a.push(id); save(REGISTRY_KEY,a);} }
  };

  const Session = {
    get(){ return localStorage.getItem(ACTIVE_KEY); },
    set(id){
      id=(id||'').trim();
      if(!id) return {ok:false, reason:'empty'};
      if(Registry.has(id) && id!==this.get()) return {ok:false, reason:'exists'};
      localStorage.setItem(ACTIVE_KEY, id);
      Registry.add(id);
      return {ok:true};
    },
    ensure(){
      const url = new URL(location.href);
      const qid = url.searchParams.get('id');
      if(qid){ const r=this.set(qid); return r.ok ? qid : null; }
      const cur = this.get();
      if(cur){ Registry.add(cur); return cur; }
      return null;
    }
  };

  const Store = {
    all(){ return load(DATA_KEY, {}); },
    setAll(v){ save(DATA_KEY, v); },
    push(item){
      const id = Session.ensure(); if(!id) return false;
      const all = this.all(); if(!all[id]) all[id] = { history: [] };
      all[id].history.push(item);
      this.setAll(all);
      return true;
    },
    byId(id){ const all=this.all(); return all[id] || { history: [] }; }
  };

  window.setUserId = (id)=> Session.set(id);
  window.getUserId = ()=> Session.ensure();

  window.recordQuiz = function(quizId, title, bonnes, fautes, total){
    const id = Session.ensure(); if(!id) return;
    const t = Number(total)||0, g=Number(bonnes)||0;
    const note20 = t>0 ? Math.round((g/t)*20*100)/100 : 0;
    const dateISO = new Date().toISOString();
    Store.push({ quizId, title, good:g, wrong: Number(fautes)||0, total:t, note20, dateISO });
  };

  window.getReport = function(){
    const id = Session.get();
    if(!id) return { id:null, items:[] };
    return { id, items: Store.byId(id).history || [] };
  };
})();

// === Modal Identifiant (UI) ===
function buildIdModal(){
  if (document.getElementById('id-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'id-modal';
  Object.assign(modal.style, {
    position:'fixed', inset:'0', background:'rgba(0,0,0,.4)',
    display:'flex', alignItems:'center', justifyContent:'center', zIndex:'9999'
  });
  const box = document.createElement('div');
  Object.assign(box.style, {
    background:'#fff', padding:'20px', borderRadius:'10px',
    maxWidth:'420px', width:'90%', boxShadow:'0 10px 30px rgba(0,0,0,.15)'
  });
  box.innerHTML = `
    <h3 style="margin-top:0">Choisir un identifiant</h3>
    <p>Un identifiant unique sur cet appareil (sans mot de passe) pour suivre vos progrès.</p>
    <input id="id-input" type="text" placeholder="ex: ali93" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:8px">
    <p id="id-error" style="color:#b00020;min-height:1.2em;margin:.5rem 0 0"></p>
    <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:10px">
      <button id="id-cancel" style="padding:8px 12px;border-radius:8px;border:1px solid #ccc;background:#f7f7f7">Annuler</button>
      <button id="id-ok" style="padding:8px 12px;border-radius:8px;border:1px solid #2b6cb0;background:#2b6cb0;color:#fff">Valider</button>
    </div>`;
  modal.appendChild(box);
  document.body.appendChild(modal);
  function close(){ modal.remove(); }
  document.getElementById('id-cancel').onclick = close;
  document.getElementById('id-ok').onclick = function(){
    const val = (document.getElementById('id-input').value || '').trim();
    if(!val){ document.getElementById('id-error').textContent = "Identifiant requis."; return; }
    const res = window.setUserId(val);
    if(!res.ok && res.reason==='exists'){ document.getElementById('id-error').textContent = "Identifiant déjà utilisé sur cet appareil."; return; }
    if(!res.ok){ document.getElementById('id-error').textContent = "Identifiant invalide."; return; }
    close();
    const cur = document.getElementById('current-id'); if(cur) cur.textContent = val;
  };
}
window.openIdModal = function(){ buildIdModal(); };
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    var id = window.getUserId && window.getUserId();
    if(!id){ buildIdModal(); }
  }, 0);
});
