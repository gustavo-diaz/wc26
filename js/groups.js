'use strict';

function renderGroups() {
  const panel = document.getElementById('tab-groups');
  const allStandings = computeAllStandings();
  const ranked3rd = rankThirdPlace(allStandings);

  let html = '<div class="groups-grid">';

  for (const [letter, rows] of Object.entries(allStandings)) {
    html += `<div class="group-card">
      <div class="group-title">Group ${letter}</div>
      <table class="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th title="Played">P</th>
            <th title="Wins">W</th>
            <th title="Draws">D</th>
            <th title="Losses">L</th>
            <th title="Goals For">GF</th>
            <th title="Goals Against">GA</th>
            <th title="Goal Difference">GD</th>
            <th title="Points">Pts</th>
          </tr>
        </thead>
        <tbody>`;

    rows.forEach((row, i) => {
      let rowClass = '';
      if (i < 2) rowClass = 'row-qualify';
      else if (i === 2) rowClass = 'row-maybe';
      else rowClass = 'row-out';

      html += `<tr class="${rowClass}">
        <td class="pos">${i + 1}</td>
        <td><div class="team-side"><span>${flagHTML(row.team)}</span><span class="team-name">${row.team}</span></div></td>
        <td>${row.P}</td>
        <td>${row.W}</td>
        <td>${row.D}</td>
        <td>${row.L}</td>
        <td>${row.GF}</td>
        <td>${row.GA}</td>
        <td>${row.GD > 0 ? '+' : ''}${row.GD}</td>
        <td class="pts">${row.Pts}</td>
      </tr>`;
    });

    html += `</tbody></table></div>`;
  }

  html += '</div>';

  // Third-place rankings section
  const top8Groups = new Set(ranked3rd.slice(0, 8).map(r => r.group));

  html += `<div class="third-place-section">
    <div class="third-place-header" onclick="toggleThirdPlace()">
      <h3>3rd Place Rankings &mdash; Best 8 advance to Round of 32</h3>
      <span class="toggle-icon" id="tp-icon">▼</span>
    </div>
    <div class="third-place-body" id="tp-body">
      <table class="third-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Grp</th>
            <th>Team</th>
            <th title="Played">P</th>
            <th title="Points">Pts</th>
            <th title="Goal Difference">GD</th>
            <th title="Goals For">GF</th>
          </tr>
        </thead>
        <tbody>`;

  ranked3rd.forEach((row, i) => {
    const advances = top8Groups.has(row.group);
    const rowClass = advances ? 'third-row-qualify' : '';
    html += `<tr class="${rowClass}">
      <td>${i + 1}</td>
      <td>${row.group}</td>
      <td>
        <span style="display:flex;align-items:center;gap:6px">
          ${flagHTML(row.team)}
          <span>${row.team || '—'}</span>
          ${advances ? '<span class="advance-badge">Advances</span>' : ''}
        </span>
      </td>
      <td>${row.P}</td>
      <td style="color:var(--gold);font-weight:700">${row.Pts}</td>
      <td>${row.GD != null ? (row.GD > 0 ? '+' : '') + row.GD : '—'}</td>
      <td>${row.GF != null ? row.GF : '—'}</td>
    </tr>`;
  });

  // Pad with empty rows if fewer than 12 groups have results
  for (let i = ranked3rd.length; i < 12; i++) {
    html += `<tr><td>${i + 1}</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>`;
  }

  html += `</tbody></table></div></div>`;

  panel.innerHTML = html;
}

function toggleThirdPlace() {
  const body = document.getElementById('tp-body');
  const icon = document.getElementById('tp-icon');
  if (body.classList.toggle('open')) {
    icon.textContent = '▲';
  } else {
    icon.textContent = '▼';
  }
}
