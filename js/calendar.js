'use strict';

window._calFilter = 'KNOCKOUT';

function parseTime(timeStr) {
  const m = timeStr && timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12;
  if (m[3].toUpperCase() === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

function renderCalendar(activeGroup) {
  const panel = document.getElementById('tab-calendar');
  const groups = Object.keys(GROUPS);

  const toolbar = `<div class="cal-toolbar">
    <span class="cal-toolbar-label">Filter:</span>
    <button class="filter-btn ${(!activeGroup || activeGroup === 'ALL') ? 'active' : ''}" onclick="setCalFilter('ALL')">All</button>
    ${groups.map(g => `<button class="filter-btn ${activeGroup === g ? 'active' : ''}" onclick="setCalFilter('${g}')">Group ${g}</button>`).join('')}
    <span class="cal-toolbar-divider"></span>
    <button class="filter-btn ko-filter-btn ${activeGroup === 'KNOCKOUT' ? 'active' : ''}" onclick="setCalFilter('KNOCKOUT')">🏆 Knockout</button>
    <div class="cal-toolbar-break"></div>
    <button class="next-game-btn" onclick="jumpToNextGame()">Next game</button>
    <button class="reset-btn" onclick="confirmReset()">Reset All</button>
  </div>`;

  if (activeGroup === 'KNOCKOUT') {
    panel.innerHTML = toolbar + buildKnockoutCalendarHTML();
    return;
  }

  const results = Storage.getGroupResults();
  const today = new Date().toISOString().slice(0, 10);

  const matches = activeGroup && activeGroup !== 'ALL'
    ? GROUP_MATCHES.filter(m => m.group === activeGroup)
    : GROUP_MATCHES;

  const byDate = {};
  matches.forEach(m => {
    if (!byDate[m.date]) byDate[m.date] = [];
    byDate[m.date].push(m);
  });
  Object.values(byDate).forEach(day =>
    day.sort((a, b) => parseTime(a.time) - parseTime(b.time) || a.group.localeCompare(b.group))
  );

  let body = '';

  Object.keys(byDate).sort().forEach(date => {
    const dayMatches = byDate[date];
    const hasSim = dayMatches.some(m => m.sim);
    body += `<div class="date-group">
      <div class="date-header">
        ${formatDate(date)}${hasSim ? '<span class="sim-badge">Simultaneous</span>' : ''}
      </div>
      <div class="matches-list">`;

    dayMatches.forEach(m => {
      const r = results[m.id];
      const hasResult = r != null;
      const isToday = date === today;

      let homeWinner = false, awayWinner = false;
      if (hasResult) {
        homeWinner = r.homeGoals > r.awayGoals;
        awayWinner = r.awayGoals > r.homeGoals;
      }

      const hGoals = hasResult ? r.homeGoals : '';
      const aGoals = hasResult ? r.awayGoals : '';

      const cardClass = ['match-card', hasResult ? 'has-result' : '', isToday && !hasResult ? 'today' : ''].filter(Boolean).join(' ');

      body += `<div class="${cardClass}" id="card-${m.id}">
        <div class="match-meta">
          <span class="group-badge">GRP ${m.group}</span>
          ${m.time} &middot; ${m.venue}
        </div>
        <div class="team-side home">
          ${flagHTML(m.home)}
          <span class="team-name${homeWinner ? ' winner' : ''}">${m.home}</span>
        </div>
        <div class="match-center">
          <div class="score-inputs">
            <input class="score-input" type="number" min="0" max="30" value="${hGoals}" id="h-${m.id}" placeholder="–">
            <span class="score-sep">:</span>
            <input class="score-input" type="number" min="0" max="30" value="${aGoals}" id="a-${m.id}" placeholder="–">
          </div>
          <button class="save-btn" onclick="saveGroupResult('${m.id}')">Save</button>
          ${hasResult ? `<button class="clear-btn" onclick="clearGroupResult('${m.id}')">Clear result</button>` : ''}
        </div>
        <div class="team-side away">
          ${flagHTML(m.away)}
          <span class="team-name${awayWinner ? ' winner' : ''}">${m.away}</span>
        </div>
      </div>`;
    });

    body += `</div></div>`;
  });

  panel.innerHTML = toolbar + body;
}

function buildKnockoutCalendarHTML() {
  const bracket = computeKnockoutBracket();
  const koResults = Storage.getKnockoutResults();
  const today = new Date().toISOString().slice(0, 10);

  const byDate = {};
  KNOCKOUT_MATCHES.forEach(m => {
    if (!byDate[m.date]) byDate[m.date] = [];
    byDate[m.date].push(m);
  });
  Object.values(byDate).forEach(day =>
    day.sort((a, b) => parseTime(a.time) - parseTime(b.time))
  );

  let html = '';

  Object.keys(byDate).sort().forEach(date => {
    const dayMatches = byDate[date];
    const isToday = date === today;
    html += `<div class="date-group">
      <div class="date-header">${formatDate(date)}</div>
      <div class="matches-list">`;

    dayMatches.forEach(m => {
      const resolved = bracket[m.id] || {};
      const homeName = resolved.home || null;
      const awayName = resolved.away || null;
      const homeLabel = homeName || sourceTBDLabel(m.homeSource);
      const awayLabel = awayName || sourceTBDLabel(m.awaySource);
      const bothKnown = !!(homeName && awayName);

      const r = koResults[m.id];
      const hasResult = r != null;

      let homeWinner = false, awayWinner = false;
      if (hasResult && resolved.winner) {
        homeWinner = resolved.winner === homeName;
        awayWinner = resolved.winner === awayName;
      }

      const hGoals = hasResult ? r.homeGoals : '';
      const aGoals = hasResult ? r.awayGoals : '';
      const roundLabel = ROUND_LABELS[m.round] || m.round;

      const cardClass = ['match-card', hasResult ? 'has-result' : '', isToday && !hasResult ? 'today' : ''].filter(Boolean).join(' ');

      const homeSafe = homeName ? homeName.replace(/'/g, "\\'") : '';
      const awaySafe = awayName ? awayName.replace(/'/g, "\\'") : '';

      html += `<div class="${cardClass}" id="card-${m.id}">
        <div class="match-meta">
          <span class="ko-badge">${roundLabel}</span>
          ${m.time} &middot; ${m.venue}
        </div>
        <div class="team-side home">
          ${homeName ? flagHTML(homeName) : ''}
          <span class="team-name${homeWinner ? ' winner' : ''}${!homeName ? ' ko-tbd' : ''}">${homeLabel}</span>
        </div>
        <div class="match-center">
          <div class="score-inputs">
            <input class="score-input" type="number" min="0" max="30" value="${hGoals}" id="cal-ko-h-${m.id}" placeholder="–"${!bothKnown ? ' disabled' : ''}>
            <span class="score-sep">:</span>
            <input class="score-input" type="number" min="0" max="30" value="${aGoals}" id="cal-ko-a-${m.id}" placeholder="–"${!bothKnown ? ' disabled' : ''}>
          </div>
          ${bothKnown ? `<button class="save-btn" onclick="saveKoCalResult('${m.id}','${homeSafe}','${awaySafe}')">Save</button>` : ''}
          ${hasResult ? `<button class="clear-btn" onclick="clearKoCalResult('${m.id}')">Clear result</button>` : ''}
        </div>
        <div class="team-side away">
          ${awayName ? flagHTML(awayName) : ''}
          <span class="team-name${awayWinner ? ' winner' : ''}${!awayName ? ' ko-tbd' : ''}">${awayLabel}</span>
        </div>
      </div>`;
    });

    html += `</div></div>`;
  });

  return html;
}

function formatKoSource(src) {
  if (!src) return 'TBD';
  if (/^[12][A-L]$/.test(src)) {
    return (src[0] === '1' ? '1st' : '2nd') + ' Group ' + src[1];
  }
  if (src.startsWith('3rd:')) {
    return '3rd ' + src.slice(4).split('').join('/');
  }
  if (src.startsWith('W:')) {
    const mDef = KNOCKOUT_MATCHES.find(m => m.id === src.slice(2));
    return 'Winner M' + (mDef?.matchNum ?? '?');
  }
  if (src.startsWith('L:')) {
    const mDef = KNOCKOUT_MATCHES.find(m => m.id === src.slice(2));
    return 'Loser M' + (mDef?.matchNum ?? '?');
  }
  return src;
}

function setCalFilter(group) {
  window._calFilter = group;
  renderCalendar(group);
}

function saveGroupResult(matchId) {
  const hInput = document.getElementById('h-' + matchId);
  const aInput = document.getElementById('a-' + matchId);
  const hVal = hInput.value.trim();
  const aVal = aInput.value.trim();

  if (hVal === '' || aVal === '') { hInput.focus(); return; }

  const hg = parseInt(hVal, 10);
  const ag = parseInt(aVal, 10);
  if (isNaN(hg) || isNaN(ag) || hg < 0 || ag < 0) return;

  Storage.setGroupResult(matchId, hg, ag);
  refreshAll();
}

function clearGroupResult(matchId) {
  Storage.clearGroupResult(matchId);
  refreshAll();
}

function saveKoCalResult(matchId, homeName, awayName) {
  if (!homeName || !awayName) return;
  const hInput = document.getElementById('cal-ko-h-' + matchId);
  const aInput = document.getElementById('cal-ko-a-' + matchId);
  if (!hInput || !aInput) return;

  const hg = parseInt(hInput.value, 10);
  const ag = parseInt(aInput.value, 10);
  if (isNaN(hg) || isNaN(ag) || hg < 0 || ag < 0) return;

  if (hg === ag) {
    alert('Knockout matches cannot end in a draw. Enter the final score after extra time / penalties.');
    return;
  }

  Storage.setKnockoutResult(matchId, hg, ag, hg > ag ? homeName : awayName);
  refreshAll();
}

function clearKoCalResult(matchId) {
  Storage.clearKnockoutResult(matchId);
  refreshAll();
}

function jumpToNextGame() {
  if (window._calFilter === 'KNOCKOUT') {
    const bracket = computeKnockoutBracket();
    const koResults = Storage.getKnockoutResults();
    const next = KNOCKOUT_MATCHES.find(m => {
      const r = bracket[m.id];
      return r?.home && r?.away && !koResults[m.id];
    });
    if (!next) return;
    requestAnimationFrame(() => {
      const el = document.getElementById('card-' + next.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    return;
  }

  const results = Storage.getGroupResults();
  const byDate = GROUP_MATCHES.slice().sort((a, b) => a.date.localeCompare(b.date));
  const next = byDate.find(m => results[m.id] == null);
  if (!next) return;

  if (window._calFilter && window._calFilter !== 'ALL' && window._calFilter !== next.group) {
    setCalFilter('ALL');
  }

  requestAnimationFrame(() => {
    const el = document.getElementById('card-' + next.id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function confirmReset() {
  if (confirm('Reset all match results? This cannot be undone.')) {
    Storage.reset();
    refreshAll();
  }
}
