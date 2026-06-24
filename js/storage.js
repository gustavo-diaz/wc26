'use strict';

// ── Firebase config ────────────────────────────────────────────────────────────
// 1. Go to console.firebase.google.com → create a project
// 2. Add a Web app → copy the firebaseConfig object here
// 3. In the console, go to Build → Realtime Database → Create database
// 4. In Database → Rules, set:
//      { "rules": { ".read": true, ".write": true } }
//    (fine for a private dashboard; add auth later if you want to lock it down)
//
// Leave FIREBASE_CONFIG null to run in offline/localStorage mode (for local dev).

const FIREBASE_CONFIG = {
  apiKey:            'AIzaSyAI4-8sH8etwJXia2TJ0dx_YNPytzTub9E',
  authDomain:        'wc2026-8a015.firebaseapp.com',
  databaseURL:       'https://wc2026-8a015-default-rtdb.firebaseio.com',
  projectId:         'wc2026-8a015',
  storageBucket:     'wc2026-8a015.firebasestorage.app',
  messagingSenderId: '817233646497',
  appId:             '1:817233646497:web:4a1c5de529a95126ecb1e0',
};

const Storage = (() => {
  const LS_KEY  = 'wc2026_results';
  const DB_PATH = 'wc2026';
  const VERSION = 1;

  function _defaults() {
    return { version: VERSION, groupResults: {}, knockoutResults: {}, bracketOverrides: {} };
  }

  // ── Offline / localStorage mode ────────────────────────────────────────────
  if (!FIREBASE_CONFIG) {
    function _load() {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return _defaults();
        const data = JSON.parse(raw);
        if (data.version !== VERSION) return _defaults();
        return data;
      } catch { return _defaults(); }
    }
    function _save(data) { localStorage.setItem(LS_KEY, JSON.stringify(data)); }

    return {
      getGroupResults()     { return _load().groupResults; },
      getKnockoutResults()  { return _load().knockoutResults; },
      getBracketOverrides() { return _load().bracketOverrides || {}; },

      setGroupResult(id, homeGoals, awayGoals) {
        const d = _load(); d.groupResults[id] = { homeGoals: Number(homeGoals), awayGoals: Number(awayGoals) }; _save(d);
      },
      clearGroupResult(id)  { const d = _load(); delete d.groupResults[id]; _save(d); },

      setKnockoutResult(id, homeGoals, awayGoals, winner) {
        const d = _load(); d.knockoutResults[id] = { homeGoals: Number(homeGoals), awayGoals: Number(awayGoals), winner }; _save(d);
      },
      clearKnockoutResult(id) { const d = _load(); delete d.knockoutResults[id]; _save(d); },

      setBracketOverride(matchId, pos, teamName) {
        const d = _load(); if (!d.bracketOverrides) d.bracketOverrides = {};
        d.bracketOverrides[`${matchId}_${pos}`] = teamName || null; _save(d);
      },
      reset() { _save(_defaults()); },
    };
  }

  // ── Firebase / shared mode ─────────────────────────────────────────────────
  firebase.initializeApp(FIREBASE_CONFIG);
  const _ref = firebase.database().ref(DB_PATH);

  // Local cache — kept in sync by the Firebase listener; reads are synchronous
  let _cache = _defaults();
  let _ready = false;

  firebase.auth().signInAnonymously().then(() => {
    _ref.on('value', snapshot => {
      const data = snapshot.val();
      if (!data || data.version !== VERSION) {
        _cache = _defaults();
      } else {
        _cache = {
          version:         data.version,
          groupResults:    data.groupResults    || {},
          knockoutResults: data.knockoutResults || {},
          bracketOverrides: data.bracketOverrides || {},
        };
      }
      _ready = true;
      if (typeof refreshAll === 'function') refreshAll();
    });
  }).catch(err => console.error('Firebase auth failed', err));

  function _write(updater) {
    updater(_cache);
    _ref.set(_cache);
  }

  return {
    getGroupResults()     { return _cache.groupResults; },
    getKnockoutResults()  { return _cache.knockoutResults; },
    getBracketOverrides() { return _cache.bracketOverrides; },

    setGroupResult(id, homeGoals, awayGoals) {
      _write(c => { c.groupResults[id] = { homeGoals: Number(homeGoals), awayGoals: Number(awayGoals) }; });
    },
    clearGroupResult(id)  { _write(c => { delete c.groupResults[id]; }); },

    setKnockoutResult(id, homeGoals, awayGoals, winner) {
      _write(c => { c.knockoutResults[id] = { homeGoals: Number(homeGoals), awayGoals: Number(awayGoals), winner }; });
    },
    clearKnockoutResult(id) { _write(c => { delete c.knockoutResults[id]; }); },

    setBracketOverride(matchId, pos, teamName) {
      _write(c => { c.bracketOverrides[`${matchId}_${pos}`] = teamName || null; });
    },
    reset() { _cache = _defaults(); _ref.set(_cache); },
  };
})();
