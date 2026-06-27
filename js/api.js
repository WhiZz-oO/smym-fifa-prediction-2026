/* ═══════════════════════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — API MODULE
   SMYM Chemmalamattom | api.js
   Handles all Google Apps Script (backend) calls
═══════════════════════════════════════════════════════════════════ */

// ── CONFIGURATION ───────────────────────────────────────────────────
// IMPORTANT: Replace this URL after deploying your Google Apps Script
const API_CONFIG = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzAOeFo2WqJ8NwgaKhVruUGBPEufyqqMc5tbYI_swaJELgkiL8GkfmHqY14zXFXy1sE/exec',
  TIMEOUT_MS: 30000,
  DEMO_MODE: false  // Set to false after deploying the backend
};



// ── CORE REQUEST FUNCTION ────────────────────────────────────────────
async function apiRequest(action, payload = {}) {
  if (API_CONFIG.DEMO_MODE) {
    console.log('[API - DEMO MODE] Action:', action, 'Payload:', payload);
    return await demoResponse(action, payload);
  }

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  try {
    const url = new URL(API_CONFIG.SCRIPT_URL);
    url.searchParams.set('action', action);

    const method  = action === 'submitPrediction' ? 'POST' : 'GET';
    const options = { method, signal: controller.signal };

    if (method === 'POST') {
      options.body = JSON.stringify({ action, ...payload });
      options.headers = { 'Content-Type': 'text/plain' }; // Apps Script requires text/plain for CORS
    } else {
      Object.entries(payload).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const resp = await fetch(method === 'GET' ? url.toString() : API_CONFIG.SCRIPT_URL, options);
    const data = await resp.json();
    return data;

  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── DEMO RESPONSE SIMULATOR ──────────────────────────────────────────
async function demoResponse(action, payload) {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 400)); // Simulate latency
  switch (action) {
    case 'submitPrediction':
      const existing = localStorage.getItem('fifa2026_submitted');
      if (existing) {
        const data = JSON.parse(existing);
        if (data.phone === payload.phone) {
          return { success: false, error: 'duplicate', message: 'A prediction with this phone number already exists.' };
        }
      }
      const entryId = 'SMYM' + Date.now().toString().slice(-6);
      // Save to localStorage for demo persistence
      localStorage.setItem('fifa2026_submitted', JSON.stringify({ phone: payload.phone, entryId }));
      const submissions = JSON.parse(localStorage.getItem('fifa2026_all') || '[]');
      submissions.push({ ...payload, entryId, timestamp: new Date().toISOString() });
      localStorage.setItem('fifa2026_all', JSON.stringify(submissions));
      DEMO_DATA.stats.totalParticipants = submissions.length;
      return { success: true, entryId };

    case 'getLeaderboard':
      const lbSubs = JSON.parse(localStorage.getItem('fifa2026_all') || '[]');
      const scoredSubs = lbSubs.filter(s => s.score !== undefined).sort((a,b) => b.score - a.score);
      return {
        success: true,
        evaluated: scoredSubs.length > 0,
        data: scoredSubs.slice(0, 10).map((s, i) => ({
          rank: i + 1, name: s.fullName, ward: s.ward, score: s.score, totalPts: 20
        })),
        total: lbSubs.length
      };

    case 'getStats':
      const allSubs = JSON.parse(localStorage.getItem('fifa2026_all') || '[]');
      
      const tally = (key, limit = 6) => {
        const counts = {};
        allSubs.forEach(s => { const v = String(s[key]||'').trim(); if(v) counts[v] = (counts[v]||0)+1; });
        return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([label,value])=>({label,value}));
      };

      const ageBuckets = {'< 18':0,'18–25':0,'26–35':0,'36–50':0,'50+':0};
      allSubs.forEach(s => {
        const a = parseInt(s.age);
        if(isNaN(a)) return;
        if(a<18) ageBuckets['< 18']++;
        else if(a<=25) ageBuckets['18–25']++;
        else if(a<=35) ageBuckets['26–35']++;
        else if(a<=50) ageBuckets['36–50']++;
        else ageBuckets['50+']++;
      });
      const ageStats = Object.entries(ageBuckets).filter(([_,v])=>v>0).map(([label,value])=>({label,value}));

      return {
        success: true,
        totalParticipants: allSubs.length,
        evaluated: allSubs.some(s => s.score !== undefined),
        champion: tally('champion'),
        goldenBoot: tally('goldenBoot').map(d => ({...d, label: d.label.split('(')[0].trim()})),
        ward: tally('ward', 10),
        age: ageStats
      };

    case 'checkPhone':
      const sub = localStorage.getItem('fifa2026_submitted');
      if (sub) {
        const s = JSON.parse(sub);
        return { exists: s.phone === payload.phone };
      }
      return { exists: false };

    default:
      return { success: false, error: 'unknown_action' };
  }
}

// ── PUBLIC API FUNCTIONS ─────────────────────────────────────────────

/**
 * Submit a participant's prediction to Google Sheets.
 * @param {Object} predictionData - Full prediction object
 * @returns {Promise<{success: boolean, entryId: string}>}
 */
async function submitPrediction(predictionData) {
  return apiRequest('submitPrediction', predictionData);
}

/**
 * Fetch the leaderboard (top N entries, sorted by score).
 * @param {number} limit - Number of entries to fetch (default 10)
 * @returns {Promise<{success: boolean, evaluated: boolean, data: Array}>}
 */
async function fetchLeaderboard(limit = 10) {
  return apiRequest('getLeaderboard', { limit });
}

/**
 * Fetch aggregated statistics for charts.
 * @returns {Promise<Object>}
 */
async function fetchStats() {
  return apiRequest('getStats');
}

/**
 * Check if a phone number has already submitted.
 * @param {string} phone - Phone number to check
 * @returns {Promise<{exists: boolean}>}
 */
async function checkPhoneExists(phone) {
  return apiRequest('checkPhone', { phone });
}

/**
 * Admin: Save official results to the sheet.
 * @param {Object} results - Official results object
 * @returns {Promise<{success: boolean}>}
 */
async function saveOfficialResults(results) {
  return apiRequest('saveResults', results);
}

/**
 * Admin: Trigger the evaluation engine — compute all scores.
 * @returns {Promise<{success: boolean, processed: number}>}
 */
async function triggerEvaluation() {
  return apiRequest('evaluatePredictions');
}

/**
 * Admin: Fetch all submissions (paginated).
 * @param {number} page - Page number (1-based)
 * @param {string} search - Optional search term
 * @returns {Promise<{success: boolean, data: Array, total: number}>}
 */
async function fetchAllSubmissions(page = 1, search = '') {
  return apiRequest('getSubmissions', { page, search });
}

/**
 * Admin: Get dashboard summary stats.
 * @returns {Promise<Object>}
 */
async function fetchDashboardSummary() {
  return apiRequest('getDashboard');
}

// Export for use in other modules (if using modules — otherwise globals are fine)
window.FIFA_API = {
  submitPrediction,
  fetchLeaderboard,
  fetchStats,
  checkPhoneExists,
  saveOfficialResults,
  triggerEvaluation,
  fetchAllSubmissions,
  fetchDashboardSummary,
  DEMO_MODE: API_CONFIG.DEMO_MODE
};
