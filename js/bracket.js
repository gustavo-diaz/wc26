'use strict';

let _activeKoEntry = null; // matchId of currently open entry panel

function renderBracket() {
  const panel = document.getElementById('tab-bracket');
  const bracket = computeKnockoutBracket();

  const rounds = [
    { key: 'r32',   label: 'Round of 32',   ids: ['r32_m74','r32_m77','r32_m73','r32_m75','r32_m83','r32_m84','r32_m81','r32_m82','r32_m76','r32_m78','r32_m79','r32_m80','r32_m86','r32_m88','r32_m85','r32_m87'] },
    { key: 'r16',   label: 'Round of 16',   ids: ['r16_m90','r16_m89','r16_m93','r16_m94','r16_m91','r16_m92','r16_m95','r16_m96'] },
    { key: 'qf',    label: 'Quarterfinals', ids: ['qf_m97','qf_m98','qf_m99','qf_m100'] },
    { key: 'sf',    label: 'Semifinals',    ids: ['sf_m101','sf_m102'] },
  ];

  let html = '<div class="bracket-scroll"><div class="bracket-container">';

  rounds.forEach(({ key, label, ids }) => {
    html += `<div class="bracket-round round-${key}">
      <div class="round-header">${label}</div>
      <div class="bracket-slots">`;

    ids.forEach(id => {
      const m = bracket[id];
      if (!m) return;
      html += renderSlot(m, bracket);
    });

    html += `</div></div>`;
  });

  // Final + 3rd Place combined column
  const finalMatch = bracket['final_m104'];
  const tpMatch    = bracket['tp_m103'];
  html += `<div class="bracket-round round-final">
    <div class="round-header">Final</div>
    <div class="bracket-slots">${finalMatch ? renderSlot(finalMatch, bracket) : ''}</div>
    <div class="round-header round-header-tp">3rd Place</div>
    <div class="bracket-slots">${tpMatch ? renderSlot(tpMatch, bracket) : ''}</div>
  </div>`;

  // Champion column
  const champion = finalMatch?.winner || null;
  html += `<div class="champion-col">
    <div class="champion-trophy">🏆</div>
    <div class="champion-label">Champion</div>
    <div class="champion-team">${champion ? `${flagHTML(champion)} ${champion}` : '—'}</div>
  </div>`;

  html += '</div></div>';
  panel.innerHTML = html;
}

function renderSlot(m, bracket) {
  const isEntryOpen = _activeKoEntry === m.id;
  const homeName = m.home || null;
  const awayName = m.away || null;
  const bothKnown = homeName && awayName;
  const hasResult = m.winner != null;
  const isKnockout = m.round !== undefined; // always true here

  const slotClass = ['bracket-slot',
    hasResult ? 'has-result' : '',
    bothKnown && !hasResult ? 'clickable' : '',
  ].filter(Boolean).join(' ');

  const clickAttr = (bothKnown && !hasResult && !isEntryOpen)
    ? `onclick="openKoEntry('${m.id}')"`
    : '';

  const hScore = m.homeGoals != null ? m.homeGoals : '';
  const aScore = m.awayGoals != null ? m.awayGoals : '';

  const homeClass = ['slot-team', !homeName ? 'tbd' : '', m.winner === homeName ? 'winner' : ''].filter(Boolean).join(' ');
  const awayClass = ['slot-team', !awayName ? 'tbd' : '', m.winner === awayName ? 'winner' : ''].filter(Boolean).join(' ');

  let html = `<div class="bracket-pair">
    <div class="${slotClass}" ${clickAttr}>
      <div class="slot-meta">
        <span class="match-num">M${m.matchNum}</span>
        <span>${m.time ? m.time.replace(' CDT', '') + ' · ' : ''}${formatDate(m.date)}</span>
      </div>
      <div class="${homeClass}">
        ${homeName ? flagHTML(homeName) : ''}
        <span>${homeName || sourceTBDLabel(m.homeSource)}</span>
        ${hScore !== '' ? `<span class="slot-score">${hScore}</span>` : ''}
      </div>
      <div class="${awayClass}">
        ${awayName ? flagHTML(awayName) : ''}
        <span>${awayName || sourceTBDLabel(m.awaySource)}</span>
        ${aScore !== '' ? `<span class="slot-score">${aScore}</span>` : ''}
      </div>
      ${m.homePens != null ? `<div class="slot-pens">(${m.homePens}–${m.awayPens} pens)</div>` : ''}
    </div>`;

  if (isEntryOpen) {
    html += renderKoEntryPanel(m);
  } else if (hasResult) {
    html += `<div style="text-align:center;margin:2px 8px">
      <button class="clear-btn" onclick="clearKoResult('${m.id}')">Clear result</button>
    </div>`;
  }

  html += `</div>`;
  return html;
}

function renderKoEntryPanel(m) {
  const round = ROUND_LABELS[m.round] || m.round;
  const hasTiedResult = m.homePens != null;
  const pensDisplay = hasTiedResult ? '' : 'none';
  const hPensVal = hasTiedResult ? m.homePens : 0;
  const aPensVal = hasTiedResult ? m.awayPens : 0;
  const hVal = m.homeGoals != null ? m.homeGoals : 0;
  const aVal = m.awayGoals != null ? m.awayGoals : 0;
  return `<div class="ko-entry-panel">
    <div class="ko-entry-title">Enter result — ${round} M${m.matchNum}</div>
    <div class="ko-entry-row">
      <div class="ko-team-label">${flagHTML(m.home)} ${m.home}</div>
      <input class="ko-score-input" type="number" min="0" max="30" id="ko-h-${m.id}" value="${hVal}" oninput="checkKoTie('${m.id}')">
    </div>
    <div class="ko-entry-row">
      <div class="ko-team-label">${flagHTML(m.away)} ${m.away}</div>
      <input class="ko-score-input" type="number" min="0" max="30" id="ko-a-${m.id}" value="${aVal}" oninput="checkKoTie('${m.id}')">
    </div>
    <div id="ko-pens-${m.id}" class="ko-pens-section" style="display:${pensDisplay}">
      <div class="ko-pens-label">Penalty shootout</div>
      <div class="ko-entry-row">
        <div class="ko-team-label">${flagHTML(m.home)} ${m.home}</div>
        <input class="ko-score-input" type="number" min="0" max="30" id="ko-hp-${m.id}" value="${hPensVal}">
      </div>
      <div class="ko-entry-row">
        <div class="ko-team-label">${flagHTML(m.away)} ${m.away}</div>
        <input class="ko-score-input" type="number" min="0" max="30" id="ko-ap-${m.id}" value="${aPensVal}">
      </div>
    </div>
    <button class="ko-save-btn" onclick="saveKoResult('${m.id}', '${m.home}', '${m.away}')">Save Result</button>
    <button class="ko-cancel-btn" onclick="cancelKoEntry()">Cancel</button>
  </div>`;
}

function checkKoTie(matchId) {
  const hg = parseInt(document.getElementById('ko-h-' + matchId)?.value, 10);
  const ag = parseInt(document.getElementById('ko-a-' + matchId)?.value, 10);
  const sec = document.getElementById('ko-pens-' + matchId);
  if (sec) sec.style.display = (!isNaN(hg) && !isNaN(ag) && hg === ag) ? '' : 'none';
}

function openKoEntry(matchId) {
  _activeKoEntry = matchId;
  renderBracket();
  // Scroll the panel into view and focus first input
  requestAnimationFrame(() => {
    const input = document.getElementById('ko-h-' + matchId);
    if (input) input.focus();
  });
}

function cancelKoEntry() {
  _activeKoEntry = null;
  renderBracket();
}

function saveKoResult(matchId, homeName, awayName) {
  const hInput = document.getElementById('ko-h-' + matchId);
  const aInput = document.getElementById('ko-a-' + matchId);
  if (!hInput || !aInput) return;

  const hg = parseInt(hInput.value, 10);
  const ag = parseInt(aInput.value, 10);

  if (isNaN(hg) || isNaN(ag) || hg < 0 || ag < 0) return;

  let winner, homePens, awayPens;
  if (hg === ag) {
    const hpInput = document.getElementById('ko-hp-' + matchId);
    const apInput = document.getElementById('ko-ap-' + matchId);
    if (!hpInput || !apInput) return;
    homePens = parseInt(hpInput.value, 10);
    awayPens = parseInt(apInput.value, 10);
    if (isNaN(homePens) || isNaN(awayPens) || homePens < 0 || awayPens < 0) return;
    if (homePens === awayPens) {
      alert('Penalty shootout cannot end in a tie. Please re-enter the penalty scores.');
      return;
    }
    winner = homePens > awayPens ? homeName : awayName;
  } else {
    winner = hg > ag ? homeName : awayName;
  }

  Storage.setKnockoutResult(matchId, hg, ag, winner, homePens, awayPens);
  _activeKoEntry = null;
  refreshAll();
}

function clearKoResult(matchId) {
  Storage.clearKnockoutResult(matchId);
  renderBracket();
}
