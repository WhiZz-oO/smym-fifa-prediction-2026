// ═══════════════════════════════════════════════════════════════════
// FIFA WORLD CUP 2026 — GOOGLE APPS SCRIPT BACKEND
// SMYM Chemmalamattom | Code.gs
// Deploy as: Web App > Execute as: Me > Who has access: Anyone
// ═══════════════════════════════════════════════════════════════════

// ── CONFIGURATION ────────────────────────────────────────────────────
const CONFIG = {
  SHEET_ID:          '1b42viEHK40p6JdbutqGyG0TS6jUJeTFFMg3ar5QfnPPtA8',  // Replaced with actual Sheet ID
  SHEET_PREDICTIONS: 'Predictions',
  SHEET_RESULTS:     'OfficialResults',
  SHEET_SCORES:      'Scores',
  ALLOWED_ORIGIN:    '*',  // Set to your GitHub Pages URL for security
};

// Scoring system (must match frontend scoring engine)
const SCORE_CONFIG = {
  CHAMPION:      5,
  RUNNER_UP:     3,
  THIRD_PLACE:   2,
  FINALIST:      1, // per correct finalist (max 2)
  SEMI_FINALIST: 1, // per correct semi-finalist (max 4)
  GOLDEN_BOOT:   2,
  GOLDEN_BALL:   1,
  GOLDEN_GLOVE:  1,
  MAX_SCORE:     20
};

// ── CORS HEADERS ──────────────────────────────────────────────────────
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin':  CONFIG.ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type':                 'application/json'
  };
}

function makeResponse(data, code = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── MAIN ENTRY POINTS ─────────────────────────────────────────────────

function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
    const action = body.action || e.parameter.action;

    switch (action) {
      case 'submitPrediction': return handleSubmit(body);
      case 'saveResults':      return handleSaveResults(body);
      case 'evaluatePredictions': return handleEvaluate();
      default: return makeResponse({ success: false, error: 'unknown_action' });
    }
  } catch (err) {
    return makeResponse({ success: false, error: err.message });
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;

    switch (action) {
      case 'getLeaderboard':  return handleGetLeaderboard(e.parameter);
      case 'getStats':        return handleGetStats();
      case 'getDashboard':    return handleGetDashboard();
      case 'getSubmissions':  return handleGetSubmissions(e.parameter);
      case 'checkPhone':      return handleCheckPhone(e.parameter.phone);
      default:                return makeResponse({ success: false, error: 'unknown_action' });
    }
  } catch (err) {
    return makeResponse({ success: false, error: err.message });
  }
}

// ── SUBMISSION HANDLER ────────────────────────────────────────────────
function handleSubmit(data) {
  const ss      = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet     = ss.getSheetByName(CONFIG.SHEET_PREDICTIONS);

  // Create sheet if not exists
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_PREDICTIONS);
    const headers = [
      'Entry ID', 'Timestamp', 'Full Name', 'Age', 'House Name', 'Ward', 'Phone', 'Email',
      'Semi-Finalists', 'Finalists', 'Champion', 'Runner-Up', '3rd Place',
      'Golden Boot', 'Golden Ball', 'Golden Glove',
      'TB Goals', 'TB First Scorer', 'TB First Minute',
      'Score', 'Rank'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setBackground('#0B1F3A').setFontColor('#D4AF37').setFontWeight('bold');
  }
  // ── DEADLINE CHECK ──────────────────────────────────────────────────
  const PREDICTION_DEADLINE = new Date('2026-07-12T18:29:59Z').getTime();
  if (Date.now() > PREDICTION_DEADLINE) {
    return makeResponse({ success: false, error: 'closed', message: 'The entry deadline has passed. No more entries are allowed.' });
  }

  // Duplicate check by phone
  const phone     = String(data.phone || '').trim();
  const allData   = sheet.getDataRange().getValues();
  const phoneCol  = 6; // 0-indexed column 6 = phone
  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][phoneCol]).trim() === phone) {
      return makeResponse({ success: false, error: 'duplicate', message: 'Phone number already registered.' });
    }
  }

  // Generate entry ID
  const entryId = 'SMYM' + Date.now().toString().slice(-6);

  // Append row
  sheet.appendRow([
    entryId,
    new Date().toISOString(),
    data.fullName || '',
    data.age || '',
    data.houseName || '',
    data.ward || '',
    phone,
    data.email || '',
    data.semifinalists || '',
    data.finalists || '',
    data.champion || '',
    data.runnerUp || '',
    data.thirdPlace || '',
    data.goldenBoot || '',
    data.goldenBall || '',
    data.goldenGlove || '',
    data.tbGoals || '',
    data.tbFirstScorer || '',
    data.tbFirstMinute || '',
    '', // score — filled after evaluation
    ''  // rank — filled after evaluation
  ]);

  return makeResponse({ success: true, entryId });
}

// ── SAVE OFFICIAL RESULTS ─────────────────────────────────────────────
function handleSaveResults(data) {
  const ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet   = ss.getSheetByName(CONFIG.SHEET_RESULTS);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_RESULTS);
    sheet.getRange(1,1,1,2).setValues([['Field','Value']]);
  }
  sheet.clearContents();
  const rows = Object.entries(data)
    .filter(([k]) => k !== 'action')
    .map(([k, v]) => [k, v]);
  sheet.getRange(1,1,1,2).setValues([['Field','Value']]);
  if (rows.length > 0) sheet.getRange(2,1,rows.length,2).setValues(rows);
  return makeResponse({ success: true });
}

// ── EVALUATE PREDICTIONS ──────────────────────────────────────────────
function handleEvaluate() {
  const ss         = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const predSheet  = ss.getSheetByName(CONFIG.SHEET_PREDICTIONS);
  const resSheet   = ss.getSheetByName(CONFIG.SHEET_RESULTS);

  if (!predSheet || !resSheet) {
    return makeResponse({ success: false, error: 'Missing sheets. Save results first.' });
  }

  // Read official results
  const resData = resSheet.getDataRange().getValues();
  const results = {};
  for (let i = 1; i < resData.length; i++) {
    results[resData[i][0]] = resData[i][1];
  }

  // Read predictions
  const predData = predSheet.getDataRange().getValues();
  const headers  = predData[0];
  const scored   = [];

  for (let i = 1; i < predData.length; i++) {
    const row = predData[i];
    const prediction = {};
    headers.forEach((h, j) => prediction[h] = row[j]);

    const score = calculateScore(prediction, results);
    scored.push({ name: prediction['Full Name'], score, row: i + 1 });

    // Update score column (column 20, index 19)
    predSheet.getRange(i + 1, 20).setValue(score);
  }

  // Sort by score and write ranks
  scored.sort((a, b) => b.score - a.score);
  scored.forEach((s, i) => {
    predSheet.getRange(s.row, 21).setValue(i + 1);
  });

  // Write to Scores sheet
  let scoreSheet = ss.getSheetByName(CONFIG.SHEET_SCORES);
  if (!scoreSheet) scoreSheet = ss.insertSheet(CONFIG.SHEET_SCORES);
  scoreSheet.clearContents();
  scoreSheet.getRange(1,1,1,4).setValues([['Rank','Name','Ward','Score']]);
  const scoresData = predSheet.getDataRange().getValues().slice(1)
    .sort((a, b) => b[19] - a[19])
    .map((row, i) => [i + 1, row[2], row[5], row[19]]);
  if (scoresData.length > 0) scoreSheet.getRange(2,1,scoresData.length,4).setValues(scoresData);

  return makeResponse({ success: true, processed: scored.length });
}

// ── SCORING ENGINE ────────────────────────────────────────────────────
function calculateScore(prediction, official) {
  let score = 0;
  const pChamp  = String(prediction['Champion']   || '').trim();
  const pRU     = String(prediction['Runner-Up']  || '').trim();
  const p3rd    = String(prediction['3rd Place']  || '').trim();
  const pFins   = String(prediction['Finalists']  || '').split(',').map(s => s.trim());
  const pSemis  = String(prediction['Semi-Finalists'] || '').split(',').map(s => s.trim());
  const pBoot   = String(prediction['Golden Boot'] || '').trim();
  const pBall   = String(prediction['Golden Ball'] || '').trim();
  const pGlove  = String(prediction['Golden Glove'] || '').trim();

  const oChamp  = String(official.champion   || '').trim();
  const oRU     = String(official.runnerUp   || '').trim();
  const o3rd    = String(official.thirdPlace || '').trim();
  const oFins   = [official.finalist1, official.finalist2].map(s => String(s||'').trim()).filter(Boolean);
  const oSemis  = [official.semi1, official.semi2, official.semi3, official.semi4].map(s => String(s||'').trim()).filter(Boolean);
  const oBoot   = String(official.goldenBoot  || '').trim();
  const oBall   = String(official.goldenBall  || '').trim();
  const oGlove  = String(official.goldenGlove || '').trim();

  if (pChamp === oChamp && oChamp)  score += SCORE_CONFIG.CHAMPION;
  if (pRU === oRU && oRU)            score += SCORE_CONFIG.RUNNER_UP;
  if (p3rd === o3rd && o3rd)         score += SCORE_CONFIG.THIRD_PLACE;
  pFins.forEach(f  => { if (f && oFins.includes(f))  score += SCORE_CONFIG.FINALIST; });
  pSemis.forEach(s => { if (s && oSemis.includes(s)) score += SCORE_CONFIG.SEMI_FINALIST; });
  if (pBoot  === oBoot  && oBoot)  score += SCORE_CONFIG.GOLDEN_BOOT;
  if (pBall  === oBall  && oBall)  score += SCORE_CONFIG.GOLDEN_BALL;
  if (pGlove === oGlove && oGlove) score += SCORE_CONFIG.GOLDEN_GLOVE;

  return Math.min(score, SCORE_CONFIG.MAX_SCORE);
}

// ── GET LEADERBOARD ───────────────────────────────────────────────────
function handleGetLeaderboard(params) {
  const ss        = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const scoreSheet = ss.getSheetByName(CONFIG.SHEET_SCORES);
  const predSheet  = ss.getSheetByName(CONFIG.SHEET_PREDICTIONS);
  const limit      = parseInt(params.limit) || 10;

  // Check if evaluated
  const evaluated = !!scoreSheet;

  if (!evaluated || !predSheet) {
    return makeResponse({ success: true, evaluated: false, data: [], total: 0 });
  }

  const data    = predSheet.getDataRange().getValues();
  const headers = data[0];

  const rows = data.slice(1)
    .map(row => {
      const o = {};
      headers.forEach((h, j) => o[h] = row[j]);
      return o;
    })
    .filter(r => r['Score'] !== '' && r['Score'] !== undefined)
    .sort((a, b) => Number(b['Score']) - Number(a['Score']))
    .slice(0, limit)
    .map((r, i) => ({
      rank:     i + 1,
      name:     r['Full Name'],
      ward:     r['Ward'],
      score:    Number(r['Score']),
      totalPts: SCORE_CONFIG.MAX_SCORE
    }));

  return makeResponse({ success: true, evaluated: true, data: rows, total: data.length - 1 });
}

// ── GET STATS ─────────────────────────────────────────────────────────
function handleGetStats() {
  const ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_PREDICTIONS);
  if (!sheet) return makeResponse({ success: true, totalParticipants: 0, champion: [], goldenBoot: [], ward: [], age: [] });

  const data    = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows    = data.slice(1).map(row => { const o={}; headers.forEach((h,j)=>o[h]=row[j]); return o; });

  // Tally helpers
  function tally(key, n = 6) {
    const counts = {};
    rows.forEach(r => { const v = String(r[key]||'').trim(); if(v) counts[v] = (counts[v]||0)+1; });
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,n).map(([label,value])=>({label,value}));
  }

  // Age buckets
  const ageBuckets = {'< 18':0,'18–25':0,'26–35':0,'36–50':0,'50+':0};
  rows.forEach(r => {
    const a = parseInt(r['Age']);
    if(isNaN(a)) return;
    if(a<18) ageBuckets['< 18']++;
    else if(a<=25) ageBuckets['18–25']++;
    else if(a<=35) ageBuckets['26–35']++;
    else if(a<=50) ageBuckets['36–50']++;
    else ageBuckets['50+']++;
  });
  const age = Object.entries(ageBuckets).map(([label,value])=>({label,value}));

  return makeResponse({
    success: true,
    totalParticipants: rows.length,
    evaluated: rows.some(r => r['Score'] !== ''),
    champion:    tally('Champion'),
    goldenBoot:  tally('Golden Boot').map(d => ({...d, label: d.label.split('(')[0].trim()})),
    ward:        tally('Ward', 8),
    age
  });
}

// ── GET DASHBOARD SUMMARY ─────────────────────────────────────────────
function handleGetDashboard() {
  const ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_PREDICTIONS);
  if (!sheet) return makeResponse({ success: true, total: 0 });

  const data    = sheet.getDataRange().getValues();
  const rows    = data.slice(1);
  const today   = new Date().toDateString();
  const todaySubs = rows.filter(r => new Date(String(r[1])).toDateString() === today).length;
  const scored  = rows.filter(r => r[19] !== '');
  const scores  = scored.map(r => Number(r[19]));
  const max     = scores.length ? Math.max(...scores) : 0;
  const avg     = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) : 0;
  const winner  = scored.find(r => Number(r[19]) === max);

  return makeResponse({
    success: true,
    total: rows.length,
    today: todaySubs,
    avgScore: avg,
    highest: max,
    winner: winner ? winner[2] : null
  });
}

// ── GET SUBMISSIONS ───────────────────────────────────────────────────
function handleGetSubmissions(params) {
  const ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_PREDICTIONS);
  if (!sheet) return makeResponse({ success: true, data: [], total: 0 });

  const data    = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows    = data.slice(1);
  const page    = parseInt(params.page)  || 1;
  const limit   = 1000;
  const search  = String(params.search  || '').toLowerCase();

  let filtered = rows;
  if (search) {
    filtered = rows.filter(r =>
      String(r[2]).toLowerCase().includes(search) ||
      String(r[6]).includes(search) ||
      String(r[5]).toLowerCase().includes(search)
    );
  }

  const paged = filtered.slice((page-1)*limit, page*limit)
    .map(row => { const o={}; headers.forEach((h,j)=>o[h]=row[j]); return o; });

  return makeResponse({ success: true, data: paged, total: filtered.length });
}

// ── CHECK PHONE ───────────────────────────────────────────────────────
function handleCheckPhone(phone) {
  const ss    = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_PREDICTIONS);
  if (!sheet) return makeResponse({ exists: false });

  const data  = sheet.getDataRange().getValues();
  const phone_ = String(phone||'').trim();
  const exists = data.slice(1).some(row => String(row[6]).trim() === phone_);
  return makeResponse({ exists });
}
