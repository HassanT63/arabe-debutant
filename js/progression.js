
/* progression.js — Identifiant unique local + enregistrement des notes */
(function(){
  const REGISTRY_KEY = 'users_registry';   // IDs utilisés (sur cet appareil)
  const DATA_KEY     = 'users_data';       // { id: { history:[...] } }
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
      // sinon demander un ID
      const wanted = prompt("Choisissez un identifiant unique (sans mot de passe) :") || "";
      const res = this.set(wanted);
      if(!res.ok && res.reason==='exists'){ alert('Identifiant déjà utilisé sur cet appareil.'); return this.ensure(); }
      if(!res.ok){ return null; }
      return this.get();
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

  document.dispatchEvent(new Event('progression-ready'));
})();
