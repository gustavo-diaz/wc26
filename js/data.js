'use strict';

const TEAMS = {
  'Mexico':                 { flag: '🇲🇽', code: 'mx' },
  'South Africa':           { flag: '🇿🇦', code: 'za' },
  'South Korea':            { flag: '🇰🇷', code: 'kr' },
  'Czechia':                { flag: '🇨🇿', code: 'cz' },
  'Canada':                 { flag: '🇨🇦', code: 'ca' },
  'Bosnia and Herzegovina': { flag: '🇧🇦', code: 'ba' },
  'Qatar':                  { flag: '🇶🇦', code: 'qa' },
  'Switzerland':            { flag: '🇨🇭', code: 'ch' },
  'Brazil':                 { flag: '🇧🇷', code: 'br' },
  'Morocco':                { flag: '🇲🇦', code: 'ma' },
  'Haiti':                  { flag: '🇭🇹', code: 'ht' },
  'Scotland':               { flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', code: 'gb-sct' },
  'United States':          { flag: '🇺🇸', code: 'us' },
  'Paraguay':               { flag: '🇵🇾', code: 'py' },
  'Australia':              { flag: '🇦🇺', code: 'au' },
  'Türkiye':                { flag: '🇹🇷', code: 'tr' },
  'Germany':                { flag: '🇩🇪', code: 'de' },
  'Curaçao':                { flag: '🇨🇼', code: 'cw' },
  'Ivory Coast':            { flag: '🇨🇮', code: 'ci' },
  'Ecuador':                { flag: '🇪🇨', code: 'ec' },
  'Netherlands':            { flag: '🇳🇱', code: 'nl' },
  'Japan':                  { flag: '🇯🇵', code: 'jp' },
  'Sweden':                 { flag: '🇸🇪', code: 'se' },
  'Tunisia':                { flag: '🇹🇳', code: 'tn' },
  'Belgium':                { flag: '🇧🇪', code: 'be' },
  'Egypt':                  { flag: '🇪🇬', code: 'eg' },
  'Iran':                   { flag: '🇮🇷', code: 'ir' },
  'New Zealand':            { flag: '🇳🇿', code: 'nz' },
  'Spain':                  { flag: '🇪🇸', code: 'es' },
  'Cape Verde':             { flag: '🇨🇻', code: 'cv' },
  'Saudi Arabia':           { flag: '🇸🇦', code: 'sa' },
  'Uruguay':                { flag: '🇺🇾', code: 'uy' },
  'France':                 { flag: '🇫🇷', code: 'fr' },
  'Senegal':                { flag: '🇸🇳', code: 'sn' },
  'Iraq':                   { flag: '🇮🇶', code: 'iq' },
  'Norway':                 { flag: '🇳🇴', code: 'no' },
  'Argentina':              { flag: '🇦🇷', code: 'ar' },
  'Algeria':                { flag: '🇩🇿', code: 'dz' },
  'Austria':                { flag: '🇦🇹', code: 'at' },
  'Jordan':                 { flag: '🇯🇴', code: 'jo' },
  'Portugal':               { flag: '🇵🇹', code: 'pt' },
  'Congo DR':               { flag: '🇨🇩', code: 'cd' },
  'Uzbekistan':             { flag: '🇺🇿', code: 'uz' },
  'Colombia':               { flag: '🇨🇴', code: 'co' },
  'England':                { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'gb-eng' },
  'Croatia':                { flag: '🇭🇷', code: 'hr' },
  'Ghana':                  { flag: '🇬🇭', code: 'gh' },
  'Panama':                 { flag: '🇵🇦', code: 'pa' },
};

const GROUPS = {
  A: ['Mexico', 'South Africa', 'South Korea', 'Czechia'],
  B: ['Canada', 'Bosnia and Herzegovina', 'Qatar', 'Switzerland'],
  C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  D: ['United States', 'Paraguay', 'Australia', 'Türkiye'],
  E: ['Germany', 'Curaçao', 'Ivory Coast', 'Ecuador'],
  F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
  I: ['France', 'Senegal', 'Iraq', 'Norway'],
  J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  K: ['Portugal', 'Congo DR', 'Uzbekistan', 'Colombia'],
  L: ['England', 'Croatia', 'Ghana', 'Panama'],
};

// 72 group stage matches — all times in US Central (CDT, UTC-5)
// matchday 3 pairs are always simultaneous (marked sim: true)
const GROUP_MATCHES = [
  // --- Group A ---
  { id: 'gs_A1', group: 'A', md: 1, date: '2026-06-11', time: '2:00 PM CDT',  home: 'Mexico',       away: 'South Africa', venue: 'Estadio Azteca, Mexico City' },
  { id: 'gs_A2', group: 'A', md: 1, date: '2026-06-11', time: '9:00 PM CDT',  home: 'South Korea',  away: 'Czechia',      venue: 'Estadio Akron, Zapopan' },
  { id: 'gs_A3', group: 'A', md: 2, date: '2026-06-18', time: '8:00 PM CDT',  home: 'Mexico',       away: 'South Korea',  venue: 'Estadio Akron, Zapopan' },
  { id: 'gs_A4', group: 'A', md: 2, date: '2026-06-18', time: '11:00 AM CDT', home: 'Czechia',      away: 'South Africa', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 'gs_A5', group: 'A', md: 3, date: '2026-06-24', time: '8:00 PM CDT',  home: 'Czechia',      away: 'Mexico',       venue: 'Estadio Azteca, Mexico City',         sim: true },
  { id: 'gs_A6', group: 'A', md: 3, date: '2026-06-24', time: '8:00 PM CDT',  home: 'South Africa', away: 'South Korea',  venue: 'Estadio BBVA, Guadalupe',             sim: true },

  // --- Group B ---
  { id: 'gs_B1', group: 'B', md: 1, date: '2026-06-12', time: '2:00 PM CDT',  home: 'Canada',                  away: 'Bosnia and Herzegovina', venue: 'BMO Field, Toronto' },
  { id: 'gs_B2', group: 'B', md: 1, date: '2026-06-13', time: '2:00 PM CDT',  home: 'Qatar',                   away: 'Switzerland',            venue: "Levi's Stadium, Santa Clara" },
  { id: 'gs_B3', group: 'B', md: 2, date: '2026-06-18', time: '5:00 PM CDT',  home: 'Canada',                  away: 'Qatar',                  venue: 'BC Place, Vancouver' },
  { id: 'gs_B4', group: 'B', md: 2, date: '2026-06-18', time: '2:00 PM CDT',  home: 'Switzerland',             away: 'Bosnia and Herzegovina', venue: 'SoFi Stadium, Inglewood' },
  { id: 'gs_B5', group: 'B', md: 3, date: '2026-06-24', time: '2:00 PM CDT',  home: 'Switzerland',             away: 'Canada',                 venue: 'BC Place, Vancouver',          sim: true },
  { id: 'gs_B6', group: 'B', md: 3, date: '2026-06-24', time: '2:00 PM CDT',  home: 'Bosnia and Herzegovina', away: 'Qatar',                  venue: 'Lumen Field, Seattle',         sim: true },

  // --- Group C ---
  { id: 'gs_C1', group: 'C', md: 1, date: '2026-06-13', time: '5:00 PM CDT',  home: 'Brazil',   away: 'Morocco',  venue: 'MetLife Stadium, East Rutherford' },
  { id: 'gs_C2', group: 'C', md: 1, date: '2026-06-13', time: '8:00 PM CDT',  home: 'Haiti',    away: 'Scotland', venue: 'Gillette Stadium, Foxborough' },
  { id: 'gs_C3', group: 'C', md: 2, date: '2026-06-19', time: '5:00 PM CDT',  home: 'Scotland', away: 'Morocco',  venue: 'Gillette Stadium, Foxborough' },
  { id: 'gs_C4', group: 'C', md: 2, date: '2026-06-19', time: '7:30 PM CDT',  home: 'Brazil',   away: 'Haiti',    venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 'gs_C5', group: 'C', md: 3, date: '2026-06-24', time: '5:00 PM CDT',  home: 'Scotland', away: 'Brazil',   venue: 'Hard Rock Stadium, Miami Gardens',    sim: true },
  { id: 'gs_C6', group: 'C', md: 3, date: '2026-06-24', time: '5:00 PM CDT',  home: 'Morocco',  away: 'Haiti',    venue: 'Mercedes-Benz Stadium, Atlanta',      sim: true },

  // --- Group D ---
  { id: 'gs_D1', group: 'D', md: 1, date: '2026-06-12', time: '8:00 PM CDT',  home: 'United States', away: 'Paraguay',      venue: 'SoFi Stadium, Inglewood' },
  { id: 'gs_D2', group: 'D', md: 1, date: '2026-06-13', time: '11:00 PM CDT', home: 'Australia',     away: 'Türkiye',       venue: 'BC Place, Vancouver' },
  { id: 'gs_D3', group: 'D', md: 2, date: '2026-06-19', time: '2:00 PM CDT',  home: 'United States', away: 'Australia',     venue: 'Lumen Field, Seattle' },
  { id: 'gs_D4', group: 'D', md: 2, date: '2026-06-19', time: '10:00 PM CDT', home: 'Türkiye',       away: 'Paraguay',      venue: "Levi's Stadium, Santa Clara" },
  { id: 'gs_D5', group: 'D', md: 3, date: '2026-06-25', time: '9:00 PM CDT',  home: 'Türkiye',       away: 'United States', venue: 'SoFi Stadium, Inglewood',          sim: true },
  { id: 'gs_D6', group: 'D', md: 3, date: '2026-06-25', time: '9:00 PM CDT',  home: 'Paraguay',      away: 'Australia',     venue: "Levi's Stadium, Santa Clara",      sim: true },

  // --- Group E ---
  { id: 'gs_E1', group: 'E', md: 1, date: '2026-06-14', time: '12:00 PM CDT', home: 'Germany',     away: 'Curaçao',     venue: 'NRG Stadium, Houston' },
  { id: 'gs_E2', group: 'E', md: 1, date: '2026-06-14', time: '6:00 PM CDT',  home: 'Ivory Coast', away: 'Ecuador',     venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 'gs_E3', group: 'E', md: 2, date: '2026-06-20', time: '3:00 PM CDT',  home: 'Germany',     away: 'Ivory Coast', venue: 'BMO Field, Toronto' },
  { id: 'gs_E4', group: 'E', md: 2, date: '2026-06-20', time: '7:00 PM CDT',  home: 'Ecuador',     away: 'Curaçao',     venue: 'Arrowhead Stadium, Kansas City' },
  { id: 'gs_E5', group: 'E', md: 3, date: '2026-06-25', time: '3:00 PM CDT',  home: 'Ecuador',     away: 'Germany',     venue: 'MetLife Stadium, East Rutherford',    sim: true },
  { id: 'gs_E6', group: 'E', md: 3, date: '2026-06-25', time: '3:00 PM CDT',  home: 'Curaçao',     away: 'Ivory Coast', venue: 'Lincoln Financial Field, Philadelphia', sim: true },

  // --- Group F ---
  { id: 'gs_F1', group: 'F', md: 1, date: '2026-06-14', time: '3:00 PM CDT',  home: 'Netherlands', away: 'Japan',       venue: 'AT&T Stadium, Arlington' },
  { id: 'gs_F2', group: 'F', md: 1, date: '2026-06-14', time: '9:00 PM CDT',  home: 'Sweden',      away: 'Tunisia',     venue: 'Estadio BBVA, Guadalupe' },
  { id: 'gs_F3', group: 'F', md: 2, date: '2026-06-20', time: '12:00 PM CDT', home: 'Netherlands', away: 'Sweden',      venue: 'NRG Stadium, Houston' },
  { id: 'gs_F4', group: 'F', md: 2, date: '2026-06-20', time: '11:00 PM CDT', home: 'Tunisia',     away: 'Japan',       venue: 'Estadio BBVA, Guadalupe' },
  { id: 'gs_F5', group: 'F', md: 3, date: '2026-06-25', time: '6:00 PM CDT',  home: 'Japan',       away: 'Sweden',      venue: 'AT&T Stadium, Arlington',             sim: true },
  { id: 'gs_F6', group: 'F', md: 3, date: '2026-06-25', time: '6:00 PM CDT',  home: 'Tunisia',     away: 'Netherlands', venue: 'Arrowhead Stadium, Kansas City',      sim: true },

  // --- Group G ---
  { id: 'gs_G1', group: 'G', md: 1, date: '2026-06-15', time: '2:00 PM CDT',  home: 'Belgium',     away: 'Egypt',       venue: 'Lumen Field, Seattle' },
  { id: 'gs_G2', group: 'G', md: 1, date: '2026-06-15', time: '8:00 PM CDT',  home: 'Iran',        away: 'New Zealand', venue: 'SoFi Stadium, Inglewood' },
  { id: 'gs_G3', group: 'G', md: 2, date: '2026-06-21', time: '2:00 PM CDT',  home: 'Belgium',     away: 'Iran',        venue: 'SoFi Stadium, Inglewood' },
  { id: 'gs_G4', group: 'G', md: 2, date: '2026-06-21', time: '8:00 PM CDT',  home: 'New Zealand', away: 'Egypt',       venue: 'BC Place, Vancouver' },
  { id: 'gs_G5', group: 'G', md: 3, date: '2026-06-26', time: '10:00 PM CDT', home: 'Egypt',       away: 'Iran',        venue: 'Lumen Field, Seattle',               sim: true },
  { id: 'gs_G6', group: 'G', md: 3, date: '2026-06-26', time: '10:00 PM CDT', home: 'New Zealand', away: 'Belgium',     venue: 'BC Place, Vancouver',                sim: true },

  // --- Group H ---
  { id: 'gs_H1', group: 'H', md: 1, date: '2026-06-15', time: '11:00 AM CDT', home: 'Spain',        away: 'Cape Verde',   venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 'gs_H2', group: 'H', md: 1, date: '2026-06-15', time: '5:00 PM CDT',  home: 'Saudi Arabia', away: 'Uruguay',      venue: 'Hard Rock Stadium, Miami Gardens' },
  { id: 'gs_H3', group: 'H', md: 2, date: '2026-06-21', time: '11:00 AM CDT', home: 'Spain',        away: 'Saudi Arabia', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 'gs_H4', group: 'H', md: 2, date: '2026-06-21', time: '5:00 PM CDT',  home: 'Uruguay',      away: 'Cape Verde',   venue: 'Hard Rock Stadium, Miami Gardens' },
  { id: 'gs_H5', group: 'H', md: 3, date: '2026-06-26', time: '7:00 PM CDT',  home: 'Cape Verde',   away: 'Saudi Arabia', venue: 'NRG Stadium, Houston',               sim: true },
  { id: 'gs_H6', group: 'H', md: 3, date: '2026-06-26', time: '7:00 PM CDT',  home: 'Uruguay',      away: 'Spain',        venue: 'Estadio Akron, Zapopan',             sim: true },

  // --- Group I ---
  { id: 'gs_I1', group: 'I', md: 1, date: '2026-06-16', time: '2:00 PM CDT',  home: 'France',  away: 'Senegal', venue: 'MetLife Stadium, East Rutherford' },
  { id: 'gs_I2', group: 'I', md: 1, date: '2026-06-16', time: '5:00 PM CDT',  home: 'Iraq',    away: 'Norway',  venue: 'Gillette Stadium, Foxborough' },
  { id: 'gs_I3', group: 'I', md: 2, date: '2026-06-22', time: '4:00 PM CDT',  home: 'France',  away: 'Iraq',    venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 'gs_I4', group: 'I', md: 2, date: '2026-06-22', time: '7:00 PM CDT',  home: 'Norway',  away: 'Senegal', venue: 'MetLife Stadium, East Rutherford' },
  { id: 'gs_I5', group: 'I', md: 3, date: '2026-06-26', time: '2:00 PM CDT',  home: 'Norway',  away: 'France',  venue: 'Gillette Stadium, Foxborough',          sim: true },
  { id: 'gs_I6', group: 'I', md: 3, date: '2026-06-26', time: '2:00 PM CDT',  home: 'Senegal', away: 'Iraq',    venue: 'BMO Field, Toronto',                    sim: true },

  // --- Group J ---
  { id: 'gs_J1', group: 'J', md: 1, date: '2026-06-16', time: '8:00 PM CDT',  home: 'Argentina', away: 'Algeria',   venue: 'Arrowhead Stadium, Kansas City' },
  { id: 'gs_J2', group: 'J', md: 1, date: '2026-06-16', time: '11:00 PM CDT', home: 'Austria',   away: 'Jordan',    venue: "Levi's Stadium, Santa Clara" },
  { id: 'gs_J3', group: 'J', md: 2, date: '2026-06-22', time: '12:00 PM CDT', home: 'Argentina', away: 'Austria',   venue: 'AT&T Stadium, Arlington' },
  { id: 'gs_J4', group: 'J', md: 2, date: '2026-06-22', time: '10:00 PM CDT', home: 'Jordan',    away: 'Algeria',   venue: "Levi's Stadium, Santa Clara" },
  { id: 'gs_J5', group: 'J', md: 3, date: '2026-06-27', time: '9:00 PM CDT',  home: 'Algeria',   away: 'Austria',   venue: 'Arrowhead Stadium, Kansas City',       sim: true },
  { id: 'gs_J6', group: 'J', md: 3, date: '2026-06-27', time: '9:00 PM CDT',  home: 'Jordan',    away: 'Argentina', venue: 'AT&T Stadium, Arlington',              sim: true },

  // --- Group K ---
  { id: 'gs_K1', group: 'K', md: 1, date: '2026-06-17', time: '12:00 PM CDT', home: 'Portugal',   away: 'Congo DR',   venue: 'NRG Stadium, Houston' },
  { id: 'gs_K2', group: 'K', md: 1, date: '2026-06-17', time: '9:00 PM CDT',  home: 'Uzbekistan', away: 'Colombia',   venue: 'Estadio Azteca, Mexico City' },
  { id: 'gs_K3', group: 'K', md: 2, date: '2026-06-23', time: '12:00 PM CDT', home: 'Portugal',   away: 'Uzbekistan', venue: 'NRG Stadium, Houston' },
  { id: 'gs_K4', group: 'K', md: 2, date: '2026-06-23', time: '9:00 PM CDT',  home: 'Colombia',   away: 'Congo DR',   venue: 'Estadio Akron, Zapopan' },
  { id: 'gs_K5', group: 'K', md: 3, date: '2026-06-27', time: '6:30 PM CDT',  home: 'Colombia',   away: 'Portugal',   venue: 'Hard Rock Stadium, Miami Gardens',   sim: true },
  { id: 'gs_K6', group: 'K', md: 3, date: '2026-06-27', time: '6:30 PM CDT',  home: 'Congo DR',   away: 'Uzbekistan', venue: 'Mercedes-Benz Stadium, Atlanta',     sim: true },

  // --- Group L ---
  { id: 'gs_L1', group: 'L', md: 1, date: '2026-06-17', time: '3:00 PM CDT',  home: 'England', away: 'Croatia', venue: 'AT&T Stadium, Arlington' },
  { id: 'gs_L2', group: 'L', md: 1, date: '2026-06-17', time: '6:00 PM CDT',  home: 'Ghana',   away: 'Panama',  venue: 'BMO Field, Toronto' },
  { id: 'gs_L3', group: 'L', md: 2, date: '2026-06-23', time: '3:00 PM CDT',  home: 'England', away: 'Ghana',   venue: 'Gillette Stadium, Foxborough' },
  { id: 'gs_L4', group: 'L', md: 2, date: '2026-06-23', time: '6:00 PM CDT',  home: 'Panama',  away: 'Croatia', venue: 'BMO Field, Toronto' },
  { id: 'gs_L5', group: 'L', md: 3, date: '2026-06-27', time: '4:00 PM CDT',  home: 'Panama',  away: 'England', venue: 'MetLife Stadium, East Rutherford',       sim: true },
  { id: 'gs_L6', group: 'L', md: 3, date: '2026-06-27', time: '4:00 PM CDT',  home: 'Croatia', away: 'Ghana',   venue: 'Lincoln Financial Field, Philadelphia',  sim: true },
];

// Knockout stage structure.
// homeSource / awaySource values:
//   "1A"       = 1st place Group A
//   "2A"       = 2nd place Group A
//   "3rd:ABCDF"= best qualifying 3rd-place from groups {A,B,C,D,F}
//   "W:r32_m73"= winner of match r32_m73
//   "L:sf_m101"= loser of sf match 101
// feedsMatch/feedsPos: where winner of this match goes next
// All times in US Central Daylight Time (CDT, UTC-5)
const KNOCKOUT_MATCHES = [
  // ── Round of 32 ────────────────────────────────────────────────────────
  { id: 'r32_m73', round: 'r32', matchNum: 73, date: '2026-06-28', time: '2:00 PM CDT',  homeSource: '2A',       awaySource: '2B',          feedsMatch: 'r16_m89', feedsPos: 'home', venue: 'SoFi Stadium, Inglewood' },
  { id: 'r32_m74', round: 'r32', matchNum: 74, date: '2026-06-29', time: '3:30 PM CDT',  homeSource: '1E',       awaySource: '3rd:ABCDF',   feedsMatch: 'r16_m90', feedsPos: 'away', venue: 'Gillette Stadium, Foxborough' },
  { id: 'r32_m75', round: 'r32', matchNum: 75, date: '2026-06-29', time: '8:00 PM CDT',  homeSource: '1F',       awaySource: '2C',          feedsMatch: 'r16_m89', feedsPos: 'away', venue: 'Estadio BBVA, Guadalupe' },
  { id: 'r32_m76', round: 'r32', matchNum: 76, date: '2026-06-29', time: '12:00 PM CDT', homeSource: '1C',       awaySource: '2F',          feedsMatch: 'r16_m91', feedsPos: 'home', venue: 'NRG Stadium, Houston' },
  { id: 'r32_m77', round: 'r32', matchNum: 77, date: '2026-06-30', time: '4:00 PM CDT',  homeSource: '1I',       awaySource: '3rd:CDFGH',   feedsMatch: 'r16_m90', feedsPos: 'home', venue: 'MetLife Stadium, East Rutherford' },
  { id: 'r32_m78', round: 'r32', matchNum: 78, date: '2026-06-30', time: '12:00 PM CDT', homeSource: '2E',       awaySource: '2I',          feedsMatch: 'r16_m91', feedsPos: 'away', venue: 'AT&T Stadium, Arlington' },
  { id: 'r32_m79', round: 'r32', matchNum: 79, date: '2026-06-30', time: '8:00 PM CDT',  homeSource: '1A',       awaySource: '3rd:CEFHI',   feedsMatch: 'r16_m92', feedsPos: 'home', venue: 'Estadio Azteca, Mexico City' },
  { id: 'r32_m80', round: 'r32', matchNum: 80, date: '2026-07-01', time: '11:00 AM CDT', homeSource: '1L',       awaySource: '3rd:EHIJK',   feedsMatch: 'r16_m92', feedsPos: 'away', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 'r32_m81', round: 'r32', matchNum: 81, date: '2026-07-01', time: '7:00 PM CDT',  homeSource: '1D',       awaySource: '3rd:BEFIJ',   feedsMatch: 'r16_m94', feedsPos: 'home', venue: "Levi's Stadium, Santa Clara" },
  { id: 'r32_m82', round: 'r32', matchNum: 82, date: '2026-07-01', time: '3:00 PM CDT',  homeSource: '1G',       awaySource: '3rd:AEHIJ',   feedsMatch: 'r16_m94', feedsPos: 'away', venue: 'Lumen Field, Seattle' },
  { id: 'r32_m83', round: 'r32', matchNum: 83, date: '2026-07-02', time: '6:00 PM CDT',  homeSource: '2K',       awaySource: '2L',          feedsMatch: 'r16_m93', feedsPos: 'home', venue: 'BMO Field, Toronto' },
  { id: 'r32_m84', round: 'r32', matchNum: 84, date: '2026-07-02', time: '2:00 PM CDT',  homeSource: '1H',       awaySource: '2J',          feedsMatch: 'r16_m93', feedsPos: 'away', venue: 'SoFi Stadium, Inglewood' },
  { id: 'r32_m85', round: 'r32', matchNum: 85, date: '2026-07-02', time: '10:00 PM CDT', homeSource: '1B',       awaySource: '3rd:EFGIJ',   feedsMatch: 'r16_m96', feedsPos: 'home', venue: 'BC Place, Vancouver' },
  { id: 'r32_m86', round: 'r32', matchNum: 86, date: '2026-07-03', time: '5:00 PM CDT',  homeSource: '1J',       awaySource: '2H',          feedsMatch: 'r16_m95', feedsPos: 'home', venue: 'Hard Rock Stadium, Miami Gardens' },
  { id: 'r32_m87', round: 'r32', matchNum: 87, date: '2026-07-03', time: '8:30 PM CDT',  homeSource: '1K',       awaySource: '3rd:DEIJL',   feedsMatch: 'r16_m96', feedsPos: 'away', venue: 'Arrowhead Stadium, Kansas City' },
  { id: 'r32_m88', round: 'r32', matchNum: 88, date: '2026-07-03', time: '1:00 PM CDT',  homeSource: '2D',       awaySource: '2G',          feedsMatch: 'r16_m95', feedsPos: 'away', venue: 'AT&T Stadium, Arlington' },

  // ── Round of 16 ───────────────────────────────────────────────────────
  { id: 'r16_m89', round: 'r16', matchNum: 89, date: '2026-07-04', time: '12:00 PM CDT', homeSource: 'W:r32_m73', awaySource: 'W:r32_m75', feedsMatch: 'qf_m97',  feedsPos: 'home', venue: 'NRG Stadium, Houston' },
  { id: 'r16_m90', round: 'r16', matchNum: 90, date: '2026-07-04', time: '4:00 PM CDT',  homeSource: 'W:r32_m77', awaySource: 'W:r32_m74', feedsMatch: 'qf_m97',  feedsPos: 'away', venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 'r16_m91', round: 'r16', matchNum: 91, date: '2026-07-05', time: '3:00 PM CDT',  homeSource: 'W:r32_m76', awaySource: 'W:r32_m78', feedsMatch: 'qf_m99',  feedsPos: 'home', venue: 'MetLife Stadium, East Rutherford' },
  { id: 'r16_m92', round: 'r16', matchNum: 92, date: '2026-07-05', time: '7:00 PM CDT',  homeSource: 'W:r32_m79', awaySource: 'W:r32_m80', feedsMatch: 'qf_m99',  feedsPos: 'away', venue: 'Estadio Azteca, Mexico City' },
  { id: 'r16_m93', round: 'r16', matchNum: 93, date: '2026-07-06', time: '2:00 PM CDT',  homeSource: 'W:r32_m83', awaySource: 'W:r32_m84', feedsMatch: 'qf_m98',  feedsPos: 'home', venue: 'AT&T Stadium, Arlington' },
  { id: 'r16_m94', round: 'r16', matchNum: 94, date: '2026-07-06', time: '7:00 PM CDT',  homeSource: 'W:r32_m81', awaySource: 'W:r32_m82', feedsMatch: 'qf_m98',  feedsPos: 'away', venue: 'Lumen Field, Seattle' },
  { id: 'r16_m95', round: 'r16', matchNum: 95, date: '2026-07-07', time: '11:00 AM CDT', homeSource: 'W:r32_m86', awaySource: 'W:r32_m88', feedsMatch: 'qf_m100', feedsPos: 'home', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 'r16_m96', round: 'r16', matchNum: 96, date: '2026-07-07', time: '3:00 PM CDT',  homeSource: 'W:r32_m85', awaySource: 'W:r32_m87', feedsMatch: 'qf_m100', feedsPos: 'away', venue: 'BC Place, Vancouver' },

  // ── Quarterfinals ─────────────────────────────────────────────────────
  { id: 'qf_m97',  round: 'qf', matchNum: 97,  date: '2026-07-09', time: '3:00 PM CDT',  homeSource: 'W:r16_m89', awaySource: 'W:r16_m90', feedsMatch: 'sf_m101', feedsPos: 'home', venue: 'Gillette Stadium, Foxborough' },
  { id: 'qf_m98',  round: 'qf', matchNum: 98,  date: '2026-07-10', time: '2:00 PM CDT',  homeSource: 'W:r16_m93', awaySource: 'W:r16_m94', feedsMatch: 'sf_m101', feedsPos: 'away', venue: 'SoFi Stadium, Inglewood' },
  { id: 'qf_m99',  round: 'qf', matchNum: 99,  date: '2026-07-11', time: '4:00 PM CDT',  homeSource: 'W:r16_m91', awaySource: 'W:r16_m92', feedsMatch: 'sf_m102', feedsPos: 'home', venue: 'Hard Rock Stadium, Miami Gardens' },
  { id: 'qf_m100', round: 'qf', matchNum: 100, date: '2026-07-11', time: '8:00 PM CDT',  homeSource: 'W:r16_m95', awaySource: 'W:r16_m96', feedsMatch: 'sf_m102', feedsPos: 'away', venue: 'Arrowhead Stadium, Kansas City' },

  // ── Semifinals ────────────────────────────────────────────────────────
  { id: 'sf_m101', round: 'sf', matchNum: 101, date: '2026-07-14', time: '2:00 PM CDT',  homeSource: 'W:qf_m97',  awaySource: 'W:qf_m98',  feedsMatch: 'final_m104', feedsPos: 'home', feedsLMatch: 'tp_m103', feedsLPos: 'home', venue: 'AT&T Stadium, Arlington' },
  { id: 'sf_m102', round: 'sf', matchNum: 102, date: '2026-07-15', time: '2:00 PM CDT',  homeSource: 'W:qf_m99',  awaySource: 'W:qf_m100', feedsMatch: 'final_m104', feedsPos: 'away', feedsLMatch: 'tp_m103', feedsLPos: 'away', venue: 'Mercedes-Benz Stadium, Atlanta' },

  // ── Third Place Playoff ───────────────────────────────────────────────
  { id: 'tp_m103',    round: 'tp',    matchNum: 103, date: '2026-07-18', time: '4:00 PM CDT',  homeSource: 'L:sf_m101', awaySource: 'L:sf_m102', feedsMatch: null, venue: 'Hard Rock Stadium, Miami Gardens' },

  // ── Final ─────────────────────────────────────────────────────────────
  { id: 'final_m104', round: 'final', matchNum: 104, date: '2026-07-19', time: '2:00 PM CDT',  homeSource: 'W:sf_m101', awaySource: 'W:sf_m102', feedsMatch: null, venue: 'MetLife Stadium, East Rutherford' },
];

// Eligible source groups for each 3rd-place slot in the R32.
// The greedy slot-assignment algorithm uses this (most-constrained slots first).
const THIRD_PLACE_ELIGIBILITY = {
  'r32_m74': ['A', 'B', 'C', 'D', 'F'],
  'r32_m77': ['C', 'D', 'F', 'G', 'H'],
  'r32_m79': ['C', 'E', 'F', 'H', 'I'],
  'r32_m80': ['E', 'H', 'I', 'J', 'K'],
  'r32_m81': ['B', 'E', 'F', 'I', 'J'],
  'r32_m82': ['A', 'E', 'H', 'I', 'J'],
  'r32_m85': ['E', 'F', 'G', 'I', 'J'],
  'r32_m87': ['D', 'E', 'I', 'J', 'L'],
};

const ROUND_LABELS = {
  r32:   'Round of 32',
  r16:   'Round of 16',
  qf:    'Quarterfinals',
  sf:    'Semifinals',
  tp:    '3rd Place',
  final: 'Final',
};
