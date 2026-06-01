
## Project description
Noah and Gustavo want to make an HTML dashboard for the 2026 men's soccer World Cup.

The dashboard should include country names and flags.

One tab should include a calendar with all the games, along with buttons to select which team wins or if it was a draw.

Another tab should include tables with information about the group stage. The list should be updated depending on the result of each game (see the rules link below)

A third tab should contain the knockout phase bracket, which should also be updated as the games go by.

This is a useful template for how we want the dashboard to look like in terms of aesthetics: https://bracketmundial.com/

Some additional details:
- Country names should appear in English
- We want to be able to update the dashboard manually, we do not need to fetch live game results automatically

## Useful links

- Rules: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/groups-how-teams-qualify-tie-breakers
- Match list: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums
- Knockout match list: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/knockout-stage-match-schedule-bracket
- Schedule with times: https://www.espn.com/soccer/schedule/_/league/fifa.world

## Current implementation state

### File structure
```
index.html          — shell: header/nav tabs, loads all scripts
css/style.css       — all styles (dark theme, --gold/--teal/--amber palette)
js/data.js          — TEAMS, GROUPS, GROUP_MATCHES (72), KNOCKOUT_MATCHES (32), ROUND_LABELS, THIRD_PLACE_ELIGIBILITY
js/storage.js       — localStorage wrapper (groupResults, knockoutResults, bracketOverrides)
js/engine.js        — standings engine, mathematical confirmation, knockout bracket resolver
js/calendar.js      — Calendar tab renderer + all calendar event handlers
js/groups.js        — Groups tab renderer
js/bracket.js       — Bracket tab renderer + knockout score entry handlers
```

### Calendar tab
- Filter bar: All | Group A–L | (divider) | 🏆 Knockout | [Next game] [Reset All]
- "Next game" and "Reset All" are on a second row below the filter chips, left-aligned
- Within each date, matches are sorted by kickoff time first, then group letter
- Matchday 3 simultaneous games are marked with a "Simultaneous" badge
- Knockout filter shows all 32 knockout matches (R32 through Final + 3rd place) grouped by date
  - Teams only shown when mathematically confirmed to have qualified (see engine below)
  - Unresolved teams show "TBD" with no flag placeholder
  - Score inputs disabled until both teams are confirmed
  - Round badge (amber) replaces group badge
- Only country names (28px) and flags (40px emoji) are enlarged; all other text/buttons use dashboard defaults

### Groups tab
- 12 group tables (A–L) with live standings
- Tiebreakers: Pts → GD → GF → head-to-head → alphabetical
- 3rd-place rankings section (collapsible) shows best 8 advancing 3rd-place teams

### Bracket tab
- Horizontal scroll layout: R32 → R16 → QF → SF → Final (+ champion display)
- Round of 32 renders in a 2-column grid (410px wide), matches ordered left-to-right top-to-bottom (M73 M74 / M75 M76 / … / M87 M88)
- Each bracket slot shows kickoff time (without "CDT") and date in the slot header
- 3rd Place (M103) appears in the Final column below M104, with its own "3RD PLACE" header in gold
- Clicking a slot with both teams known opens an inline score-entry panel; no draws allowed

### Mathematical confirmation (engine.js)
- `isGroupPositionConfirmed(rank, group, results)`: enumerates all outcomes of remaining group matches with adversarial 20-0 scores. Returns true only when the team at that rank cannot be displaced by any scenario.
- `areAllGroupsComplete(results)`: true when all 72 group-stage matches have results (required for 3rd-place slot assignment).
- R32 slots sourced from "1X"/"2X" only show a team when `isGroupPositionConfirmed` returns true; "3rd:" slots only show when all groups are complete.
- R16 and beyond resolve automatically from R32 results as they are entered.

### Data notes
- All times stored as "H:MM AM/PM CDT" strings in data.js
- Bracket tab strips "CDT" from display; Calendar tab shows it
- R32 dates were corrected from original (M74 Jun 29, M79 Jun 30, M81–82 Jul 1, M85 Jul 2)
- QF dates: M97 Jul 9, M98 Jul 10, M99–100 Jul 11
- 3rd place playoff venue updated to Hard Rock Stadium, Miami Gardens (Jul 18)
- Hosted at https://gustavodiaz.org/wc26/ via GitHub Pages (repo: https://github.com/gustavo-diaz/wc26)
- All results persist in localStorage under key `wc2026_results` (offline mode) or Firebase Realtime Database (shared mode)

## Storage / Firebase setup

`js/storage.js` supports two modes controlled by the `FIREBASE_CONFIG` constant at the top of the file:

- **`null` (default)** — uses localStorage; results are local to each browser
- **Firebase config object** — uses Firebase Realtime Database; all devices share the same state in real time

### Activating Firebase
1. Go to console.firebase.google.com → create a project
2. Add a Web app → copy the `firebaseConfig` object shown
3. Build → Realtime Database → Create database (start in test mode)
4. Database → Rules → set `{ "rules": { ".read": true, ".write": true } }`
5. In `storage.js`, replace `const FIREBASE_CONFIG = null` with the config object

The Firebase SDK is already loaded in `index.html` via CDN (version 10.14.1 — update the version number in the two `<script>` tags if needed).

### How it works
Firebase uses a local cache (`_cache`) kept in sync by an `onValue` listener. All reads in the rest of the codebase are synchronous (from cache); writes go to Firebase and propagate to all connected clients automatically, triggering a `refreshAll()` re-render on each.
