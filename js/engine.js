'use strict';

// ── Group Stage Engine ────────────────────────────────────────────────────────

function computeGroupStandings(groupLetter, resultsOverride) {
  const teams = GROUPS[groupLetter];
  const matches = GROUP_MATCHES.filter(m => m.group === groupLetter);
  const results = resultsOverride !== undefined ? resultsOverride : Storage.getGroupResults();

  const stats = {};
  teams.forEach(t => {
    stats[t] = { team: t, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
  });

  matches.forEach(m => {
    const r = results[m.id];
    if (r == null) return;
    const { homeGoals: hg, awayGoals: ag } = r;
    stats[m.home].P++; stats[m.away].P++;
    stats[m.home].GF += hg; stats[m.home].GA += ag;
    stats[m.away].GF += ag; stats[m.away].GA += hg;
    stats[m.home].GD = stats[m.home].GF - stats[m.home].GA;
    stats[m.away].GD = stats[m.away].GF - stats[m.away].GA;
    if (hg > ag) {
      stats[m.home].W++; stats[m.home].Pts += 3;
      stats[m.away].L++;
    } else if (hg === ag) {
      stats[m.home].D++; stats[m.home].Pts++;
      stats[m.away].D++; stats[m.away].Pts++;
    } else {
      stats[m.away].W++; stats[m.away].Pts += 3;
      stats[m.home].L++;
    }
  });

  return _sortStandings(Object.values(stats), groupLetter, results, matches);
}

function _sortStandings(rows, groupLetter, results, matches) {
  return rows.slice().sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts;
    if (b.GD  !== a.GD)  return b.GD  - a.GD;
    if (b.GF  !== a.GF)  return b.GF  - a.GF;

    // Head-to-head among teams tied on Pts + GD + GF
    const tied = rows.filter(r =>
      r.Pts === a.Pts && r.GD === a.GD && r.GF === a.GF
    ).map(r => r.team);

    if (tied.length > 1) {
      const h2h = _headToHead(tied, matches, results);
      const ha = h2h[a.team], hb = h2h[b.team];
      if (hb.Pts !== ha.Pts) return hb.Pts - ha.Pts;
      if (hb.GD  !== ha.GD)  return hb.GD  - ha.GD;
      if (hb.GF  !== ha.GF)  return hb.GF  - ha.GF;
    }

    // Final fallback: alphabetical (stable, deterministic)
    return a.team.localeCompare(b.team);
  });
}

function _headToHead(teamNames, allMatches, results) {
  const set = new Set(teamNames);
  const h2h = {};
  teamNames.forEach(t => { h2h[t] = { Pts: 0, GD: 0, GF: 0, GA: 0 }; });

  allMatches.forEach(m => {
    if (!set.has(m.home) || !set.has(m.away)) return;
    const r = results[m.id];
    if (r == null) return;
    const { homeGoals: hg, awayGoals: ag } = r;
    h2h[m.home].GF += hg; h2h[m.home].GA += ag;
    h2h[m.away].GF += ag; h2h[m.away].GA += hg;
    h2h[m.home].GD = h2h[m.home].GF - h2h[m.home].GA;
    h2h[m.away].GD = h2h[m.away].GF - h2h[m.away].GA;
    if (hg > ag) {
      h2h[m.home].Pts += 3;
    } else if (hg === ag) {
      h2h[m.home].Pts++; h2h[m.away].Pts++;
    } else {
      h2h[m.away].Pts += 3;
    }
  });
  return h2h;
}

function computeAllStandings() {
  const all = {};
  for (const g of Object.keys(GROUPS)) all[g] = computeGroupStandings(g);
  return all;
}

// ── Mathematical Confirmation ─────────────────────────────────────────────────

// Returns true if the team currently at `rank` (0=1st, 1=2nd) in `groupLetter`
// cannot be displaced from that exact position by any combination of remaining
// match results. Uses adversarial scores (20-0) to stress-test GD tiebreakers.
function isGroupPositionConfirmed(rank, groupLetter, allResults) {
  const matches = GROUP_MATCHES.filter(m => m.group === groupLetter);
  const remaining = matches.filter(m => allResults[m.id] == null);
  if (remaining.length === 0) return true;

  const current = computeGroupStandings(groupLetter, allResults);
  const targetTeam = current[rank]?.team;
  if (!targetTeam) return false;

  // Adversarial outcome set: large margins to stress-test GD tiebreakers
  const OUTCOMES = [[20, 0], [0, 0], [0, 20]];

  function check(idx, temp) {
    if (idx === remaining.length) {
      const s = computeGroupStandings(groupLetter, { ...allResults, ...temp });
      return s[rank]?.team === targetTeam;
    }
    const m = remaining[idx];
    for (const [h, a] of OUTCOMES) {
      if (!check(idx + 1, { ...temp, [m.id]: { homeGoals: h, awayGoals: a } })) return false;
    }
    return true;
  }

  return check(0, {});
}

// Returns true when every group-stage match across all 12 groups has a result,
// so the 3rd-place rankings can be determined definitively.
function areAllGroupsComplete(allResults) {
  return GROUP_MATCHES.every(m => allResults[m.id] != null);
}

// ── 3rd-Place Engine ──────────────────────────────────────────────────────────

function rankThirdPlace(allStandings) {
  return Object.entries(allStandings)
    .map(([group, rows]) => ({ group, ...rows[2] }))
    .filter(r => r.team)
    .sort((a, b) => {
      if (b.Pts !== a.Pts) return b.Pts - a.Pts;
      if (b.GD  !== a.GD)  return b.GD  - a.GD;
      if (b.GF  !== a.GF)  return b.GF  - a.GF;
      const fpA = FAIR_PLAY_SCORES[a.team] ?? 0;
      const fpB = FAIR_PLAY_SCORES[b.team] ?? 0;
      if (fpA !== fpB) return fpA - fpB;               // lower = fewer cards = better
      const rankA = FIFA_WORLD_RANKINGS[a.team] ?? 999;
      const rankB = FIFA_WORLD_RANKINGS[b.team] ?? 999;
      if (rankA !== rankB) return rankA - rankB;        // lower number = better
      return a.team.localeCompare(b.team);
    });
}

function assignThirdPlaceTeams(ranked3rd) {
  const qualifying8 = ranked3rd.slice(0, 8);
  const qualifyingGroups = qualifying8.map(r => r.group);
  const qualifyingSet = new Set(qualifyingGroups);
  const teamByGroup = {};
  qualifying8.forEach(r => { teamByGroup[r.group] = r.team; });

  // Sort slots most-constrained-first for efficient backtracking
  const slots = Object.entries(THIRD_PLACE_ELIGIBILITY)
    .map(([slotId, eligible]) => ({
      slotId,
      eligible: eligible.filter(g => qualifyingSet.has(g)),
    }))
    .sort((a, b) => a.eligible.length - b.eligible.length);

  const assignments = {};

  function backtrack(idx, used) {
    if (idx === slots.length) return true;
    const { slotId, eligible } = slots[idx];
    for (const group of eligible) {
      if (used.has(group)) continue;
      assignments[slotId] = teamByGroup[group];
      used.add(group);
      if (backtrack(idx + 1, used)) return true;
      delete assignments[slotId];
      used.delete(group);
    }
    return false; // no valid assignment found for this slot
  }

  backtrack(0, new Set());
  return assignments;
}

// ── Knockout Bracket Engine ───────────────────────────────────────────────────

function computeKnockoutBracket() {
  const groupResults = Storage.getGroupResults();
  const standings = computeAllStandings();
  const ranked3rd  = rankThirdPlace(standings);
  const thirdAssign = assignThirdPlaceTeams(ranked3rd);
  const koResults  = Storage.getKnockoutResults();
  const overrides  = Storage.getBracketOverrides();

  // Map: matchId → { home, away, homeGoals, awayGoals, winner }
  const resolved = {};

  function resolveSource(src, matchId, pos) {
    // Check manual override first
    const key = `${matchId}_${pos}`;
    if (overrides[key] != null) return overrides[key];

    if (src.startsWith('1')) {
      const g = src[1];
      if (!isGroupPositionConfirmed(0, g, groupResults)) return null;
      return standings[g]?.[0]?.team || null;
    }
    if (src.startsWith('2')) {
      const g = src[1];
      if (!isGroupPositionConfirmed(1, g, groupResults)) return null;
      return standings[g]?.[1]?.team || null;
    }
    if (src.startsWith('3rd:')) {
      if (!areAllGroupsComplete(groupResults)) return null;
      return thirdAssign[matchId] || null;
    }
    if (src.startsWith('W:')) {
      return resolved[src.slice(2)]?.winner || null;
    }
    if (src.startsWith('L:')) {
      const r = resolved[src.slice(2)];
      if (!r || !r.winner) return null;
      return r.winner === r.home ? r.away : r.home;
    }
    return null;
  }

  KNOCKOUT_MATCHES.forEach(m => {
    const home = resolveSource(m.homeSource, m.id, 'home');
    const away = resolveSource(m.awaySource, m.id, 'away');
    const r = koResults[m.id];
    resolved[m.id] = {
      ...m,
      home,
      away,
      homeGoals: r?.homeGoals ?? null,
      awayGoals: r?.awayGoals ?? null,
      winner: r?.winner || null,
    };
  });

  return resolved;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sourceTBDLabel(src) {
  if (!src) return 'TBD';
  if (/^[12][A-L]$/.test(src)) return src;          // "1A" → "1A", "2B" → "2B"
  if (src.startsWith('3rd:')) return '3' + src[4];   // "3rd:D" → "3D"
  const num = src.match(/_m(\d+)/);
  if (src.startsWith('W:')) return num ? 'W' + num[1] : 'W?';  // "W:r32_m73" → "W73"
  if (src.startsWith('L:')) return num ? 'L' + num[1] : 'L?';  // "L:sf_m101" → "L101"
  return 'TBD';
}

function flagHTML(teamName) {
  if (!teamName || teamName === 'TBD') return '<span class="flag-tbd">?</span>';
  const t = TEAMS[teamName];
  if (!t) return '';
  return `<span class="flag-wrap">` +
    `<span class="flag-emoji">${t.flag}</span>` +
    `<img class="flag-img" src="https://flagcdn.com/24x18/${t.code}.png" alt="" loading="lazy" onerror="this.style.display='none'">` +
    `</span>`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
