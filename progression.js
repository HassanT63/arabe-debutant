
/* progression.js — Identifiant unique local + enregistrement des notes
   - Unicité vérifiée sur CET appareil (localStorage)
   - API:
      setUserId(id) -> {ok:true}|{ok:false,reason:'exists'|'empty'}
      getUserId() -> string|null
      recordQuiz(quizId, title, good, wrong, total)  // calcule note/20, date
      getReport() -> { id, items:[{quizId,title,dateISO,good,wrong,total,note20}], byQuiz:{quizId:[...]} }
*/

(function(){
  const REGISTRY_KEY = 'users_registry';   // liste d'IDs utilisés sur cet appareil
  const ACTIVE_KEY   = 'activeUser';       // ID actif
  const DATA_KEY     = 'users_data';       // { id: { history:[...] } }

  function load(k, fallback){ try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch(e){ return fallback; } }
  function save(k, v){ localStorage.setItem(k, JSON.stringify(v)); }

  const Registry = {
    get(){ return load(REGISTRY_KEY, []); },
    has(id){ return this.get().includes(id); },
    add(id){ const a=this.get(); if(!a.includes(id)){ a.push(id); save(REGISTRY_KEY, a);} }
  };

  const Session = {
    get(){ return localStorage.getItem(ACTIVE_KEY); },
    set(id){
      id = (id||'').trim();
      if(!id) return {ok:false, reason:'empty'};
      if(Registry.has(id) && id !== this.get()) return {ok:false, reason:'exists'};
      localStorage.setItem(ACTIVE_KEY, id);
      Registry.add(id);
      return {ok:true};
    },
    ensure(){
      const url = new URL(location.href);
      const qid = url.searchParams.get('id');
      if(qid){ const r=this.set(qid); return r.ok ? qid : null; }
      const cur = this.get();
      if(cur) { Registry.add(cur); return cur; }
      return null;
    }
  };

  const Store = {
    get(){
      const all = load(DATA_KEY, {});
      return all;
    },
    set(all){ save(DATA_KEY, all); },
    push(item){
      const id = Session.ensure();
      if(!id) return false;
      const all = this.get();
      if(!all[id]) all[id] = { history: [] };
      all[id].history.push(item);
      this.set(all);
      return true;
    },
    byId(id){
      const all = this.get();
      return all[id] || { history: [] };
    }
  };

  function recordQuiz(quizId, title, good, wrong, total){
    const id = Session.ensure();
    if(!id){ alert('Aucun identifiant défini.'); return; }
    const g = Number(good)||0, w = Number(wrong)||0, t = Number(total)||0;
    const note20 = t>0 ? Math.round((g/t)*20*100)/100 : 0;
    const dateISO = new Date().toISOString();
    Store.push({ quizId, title, good:g, wrong:w, total:t, note20, dateISO });
    return {ok:true, note20, dateISO};
  }

  function getReport(){
    const id = Session.ensure();
    if(!id) return {id:null, items:[], byQuiz:{}};
    const h = Store.byId(id).history || [];
    const byQuiz = {};
    h.forEach(it => { if(!byQuiz[it.quizId]) byQuiz[it.quizId]=[]; byQuiz[it.quizId].push(it); });
    return { id, items: h, byQuiz };
  }

  // Header minimal (optionnel) : gère bouton "Choisir identifiant"
  function bindHeader(){
    const btn = document.getElementById('choose-id');
    const cur = document.getElementById('current-id');
    const idNow = Session.ensure();
    if(cur && idNow) cur.textContent = idNow;
    if(btn){
      btn.addEventListener('click', ()=>{
        const current = Session.get() || '';
        const wanted = prompt('Choisis un identifiant unique (sans mot de passe) :', current);
        if(wanted === null) return;
        const res = Session.set(wanted);
        if(!res.ok && res.reason==='exists'){ alert('Identifiant déjà utilisé sur cet appareil.'); }
        else if(!res.ok){ alert('Identifiant invalide.'); }
        else {
          if(cur) cur.textContent = Session.get();
          const u = new URL(location.href);
          u.searchParams.set('id', Session.get());
          history.replaceState({}, '', u.toString());
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', bindHeader);

  // expose
  window.setUserId = (id)=> Session.set(id);
  window.getUserId = ()=> Session.ensure();
  window.recordQuiz = recordQuiz;
  window.getReport = getReport;
})();

window.openIdModal = function(){ if (typeof buildIdModal==='function') buildIdModal(); };
document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ if(!window.getUserId || !window.getUserId()) { if (typeof buildIdModal==='function') buildIdModal(); } }, 0); });
