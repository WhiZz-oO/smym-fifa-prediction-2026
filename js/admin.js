/* ═══════════════════════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — ADMIN JAVASCRIPT
   SMYM Chemmalamattom | admin.js
═══════════════════════════════════════════════════════════════════ */

// ── ADMIN CONFIG ─────────────────────────────────────────────────────
const ADMIN_CONFIG = {
  PASSWORD_HASH: 'smym2026admin', // Change this! In production, use server-side auth
  SESSION_KEY: 'fifa2026_admin_session',
  SESSION_DURATION: 3 * 60 * 60 * 1000 // 3 hours in ms
};

// ── STATE ─────────────────────────────────────────────────────────────
const AdminState = {
  isLoggedIn: false,
  currentPage: 'dashboard',
  allSubmissions: [],
  filteredSubmissions: [],
  currentPageNum: 1,
  itemsPerPage: 15,
  officialResults: {}
};

// ── AUTH ──────────────────────────────────────────────────────────────
function checkSession() {
  const session = sessionStorage.getItem(ADMIN_CONFIG.SESSION_KEY);
  if (session) {
    try {
      const data = JSON.parse(session);
      if (Date.now() - data.loginTime < ADMIN_CONFIG.SESSION_DURATION) {
        return true;
      }
    } catch (e) {}
  }
  return false;
}

function saveSession() {
  sessionStorage.setItem(ADMIN_CONFIG.SESSION_KEY, JSON.stringify({
    loginTime: Date.now()
  }));
}

function clearSession() {
  sessionStorage.removeItem(ADMIN_CONFIG.SESSION_KEY);
}

// ── LOGIN ─────────────────────────────────────────────────────────────
async function adminLogin() {
  const pwd = document.getElementById('adminPassword')?.value || '';
  const err = document.getElementById('loginError');

  if (!pwd) {
    if (err) { err.textContent = 'Please enter the password.'; err.classList.add('show'); }
    return;
  }

  // Simple password check (in production, use backend auth)
  if (pwd === ADMIN_CONFIG.PASSWORD_HASH) {
    saveSession();
    AdminState.isLoggedIn = true;
    showDashboard();
  } else {
    if (err) {
      err.textContent = 'Incorrect password. Please try again.';
      err.classList.add('show');
      document.getElementById('adminPassword').value = '';
      document.getElementById('adminPassword').focus();
      // Shake animation
      const card = document.querySelector('.admin-login-card');
      if (card) {
        card.style.animation = 'none';
        card.offsetWidth; // reflow
        card.style.animation = 'shake 0.4s ease';
      }
    }
  }
}

function adminLogout() {
  clearSession();
  AdminState.isLoggedIn = false;
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('dashboardLayout').style.display = 'none';
  document.getElementById('adminPassword').value = '';
}

// ── SHOW DASHBOARD ────────────────────────────────────────────────────
function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboardLayout').style.display = 'flex';
  navigateAdmin('dashboard');
  loadDashboardData();
}

// ── ADMIN SPA NAVIGATION ──────────────────────────────────────────────
function navigateAdmin(page) {
  AdminState.currentPage = page;

  // Update sidebar
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Update topbar title
  const titles = {
    dashboard: 'Dashboard',
    participants: 'Participants',
    results: 'Official Results',
    evaluate: 'Evaluate',
    leaderboard: 'Leaderboard',
    settings: 'Settings'
  };
  const topbarTitle = document.getElementById('topbarTitle');
  if (topbarTitle) topbarTitle.textContent = titles[page] || page;

  // Show/hide pages
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`adminPage-${page}`);
  if (target) target.classList.add('active');

  // Page-specific load
  switch (page) {
    case 'dashboard':    loadDashboardData(); break;
    case 'participants': loadParticipants();  break;
    case 'leaderboard':  loadAdminLeaderboard(); break;
  }
}

// ── LOAD DASHBOARD ────────────────────────────────────────────────────
async function loadDashboardData() {
  try {
    // Load dashboard summary from backend
    const summary = await FIFA_API.fetchDashboardSummary();
    if (!summary || !summary.success) {
      console.warn('Could not load dashboard summary');
      return;
    }

    const total = summary.total || 0;
    const today = summary.today || 0;

    // Champion tally
    const stats = await FIFA_API.fetchStats();
    const topChamp = stats.champion?.[0] ? [stats.champion[0].label, stats.champion[0].value] : null;
    const topBoot  = stats.goldenBoot?.[0] ? [stats.goldenBoot[0].label, stats.goldenBoot[0].value] : null;

    // Update cards
    setCard('cardParticipants', total);
    setCard('cardToday', today);
    setCard('cardTopChamp', topChamp ? `${teamFlag(topChamp[0])} ${topChamp[0]}` : '—', false);
    setCard('cardTopBoot', topBoot ? topBoot[0].split('(')[0].trim() : '—', false);

    // If evaluated, load scores
    if (AdminState.officialResults.champion && summary.avgScore) {
      setCard('cardAvgScore', summary.avgScore, false);
      setCard('cardHighest', summary.highest, false);
      setCard('cardWinner', summary.winner || '—', false);
    } else {
      setCard('cardAvgScore', '—', false);
      setCard('cardHighest', '—', false);
      setCard('cardWinner', '—', false);
    }

    // Recent activity (fetch latest 5 submissions)
    const submissionsData = await FIFA_API.fetchAllSubmissions(1, '');
    if (submissionsData.success && submissionsData.data) {
      AdminState.allSubmissions = submissionsData.data; // Store for export
      renderRecentActivity(submissionsData.data.slice(-5).reverse());
    }

  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

function setCard(id, value, animate = true) {
  const el = document.getElementById(id);
  if (!el) return;
  if (animate && typeof value === 'number') {
    animateNum(el, 0, value, 800);
  } else {
    el.textContent = value;
  }
}

function animateNum(el, from, to, dur) {
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(from + (to - from) * p);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function renderRecentActivity(submissions) {
  const el = document.getElementById('recentActivity');
  if (!el) return;
  if (!submissions.length) { el.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:20px;">No submissions yet.</div>'; return; }
  el.innerHTML = submissions.map(s => `
    <div class="lb-row" style="grid-template-columns: 1fr auto; padding: 12px 16px;">
      <div>
        <div class="lb-name">${escAdm(s.fullName || s.name || 'Unknown')}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);">${escAdm(s.ward || '')} · ${s.champion ? '⚽ ' + escAdm(s.champion) : ''}</div>
      </div>
      <div style="font-size:0.75rem;color:var(--text-muted);">${formatDate(s.submittedAt)}</div>
    </div>
  `).join('');
}

// ── LOAD PARTICIPANTS TABLE ───────────────────────────────────────────
async function loadParticipants(search = '') {
  try {
    const res = await FIFA_API.fetchAllSubmissions(1, search);
    if (!res.success) {
      console.error('Failed to load submissions:', res.error);
      return;
    }
    
    // The backend uses 'Full Name' and 'Ward' instead of 'fullName' and 'ward'
    // Let's normalize it to what the frontend expects
    const normalized = (res.data || []).map(r => ({
      ...r,
      fullName: r['Full Name'],
      age: r['Age'],
      ward: r['Ward'],
      phone: r['Phone'],
      email: r['Email'],
      champion: r['Champion'],
      goldenBoot: r['Golden Boot'],
      score: r['Score'] !== '' ? r['Score'] : undefined
    }));
    
    AdminState.allSubmissions = normalized;
    AdminState.filteredSubmissions = normalized;
    renderParticipantTable(normalized);
  } catch (err) {
    console.error('Participants load error:', err);
  }
}

function renderParticipantTable(data) {
  const tbody = document.getElementById('participantTableBody');
  if (!tbody) return;

  const totalEl = document.getElementById('participantTotal');
  if (totalEl) totalEl.textContent = data.length;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:32px;">No submissions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map((s, i) => `
    <tr>
      <td style="color:var(--text-muted);">${i+1}</td>
      <td><strong>${escAdm(s.fullName || '—')}</strong></td>
      <td>${escAdm(s.age || '—')}</td>
      <td>${escAdm(s.ward || '—')}</td>
      <td>${escAdm(s.phone || '—')}</td>
      <td>${teamFlag(s.champion)} ${escAdm(s.champion || '—')}</td>
      <td>${escAdm(s.goldenBoot?.split('(')[0]?.trim() || '—')}</td>
      <td>${s.score !== undefined ? `<span class="score-badge">${s.score}</span>` : '<span style="color:var(--text-muted)">—</span>'}</td>
    </tr>
  `).join('');
}

// ── EXPORT CSV ────────────────────────────────────────────────────────
function exportCSV() {
  const data = AdminState.allSubmissions;
  if (!data.length) { alert('No data to export.'); return; }

  const headers = ['#','Name','Age','Ward','Phone','Email','Champion','Runner-Up','3rd Place','Golden Boot','Golden Ball','Golden Glove','TB Goals','Score','Submitted At'];
  const rows = data.map((s, i) => [
    i+1, s.fullName, s.age, s.ward, s.phone, s.email || '',
    s.champion, s.runnerUp, s.thirdPlace,
    s.goldenBoot, s.goldenBall, s.goldenGlove,
    s.tbGoals, s.score || '', s.submittedAt || ''
  ]);

  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `fifa2026_predictions_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── SAVE OFFICIAL RESULTS ─────────────────────────────────────────────
async function saveResults() {
  const getVal = id => document.getElementById(id)?.value || '';

  const results = {
    champion:    getVal('resChampion'),
    runnerUp:    getVal('resRunnerUp'),
    thirdPlace:  getVal('resThirdPlace'),
    finalist1:   getVal('resFin1'),
    finalist2:   getVal('resFin2'),
    semi1:       getVal('resSemi1'),
    semi2:       getVal('resSemi2'),
    semi3:       getVal('resSemi3'),
    semi4:       getVal('resSemi4'),
    goldenBoot:  getVal('resGoldenBoot'),
    goldenBall:  getVal('resGoldenBall'),
    goldenGlove: getVal('resGoldenGlove'),
    tbGoals:     parseInt(getVal('resTBGoals')) || 0,
    tbFirstScorer: getVal('resTBScorer'),
    tbFirstMinute: parseInt(getVal('resTBMinute')) || 0
  };

  if (!results.champion) {
    Swal.fire({ icon: 'warning', title: 'Missing Data', text: 'Please enter at least the Champion.' });
    return;
  }

  try {
    // Save to Google Sheets backend
    const res = await FIFA_API.saveOfficialResults(results);
    if (!res.success) {
      throw new Error(res.error || 'Failed to save results to backend.');
    }

    // Also keep a local copy for frontend reference
    localStorage.setItem('fifa2026_official_results', JSON.stringify(results));
    AdminState.officialResults = results;
    
    // Auto-fill form
    loadResults();

    Swal.fire({
      icon: 'success',
      title: 'Results Saved!',
      text: 'Official tournament results have been saved securely.',
      timer: 2000,
      showConfirmButton: false
    });
  } catch (err) {
    console.error('Error saving results:', err);
    Swal.fire({ icon: 'error', title: 'Save Failed', text: err.message });
  }
}

// ── EVALUATE PREDICTIONS ──────────────────────────────────────────────
async function evaluatePredictions() {
  const results = AdminState.officialResults ||
    JSON.parse(localStorage.getItem('fifa2026_official_results') || '{}');

  if (!results.champion) {
    Swal.fire({
      icon: 'warning',
      title: 'No Results Found',
      text: 'Please save the official results first before evaluating.'
    });
    return;
  }

  const confirmed = await Swal.fire({
    icon: 'question',
    title: 'Evaluate All Predictions?',
    html: 'This will calculate scores for all participants based on the official results. Continue?',
    showCancelButton: true,
    confirmButtonText: 'Yes, Evaluate!',
    cancelButtonText: 'Cancel'
  });

  if (!confirmed.isConfirmed) return;

  // Show progress
  Swal.fire({
    title: 'Evaluating...',
    html: 'Calculating scores for all participants...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    const res = await FIFA_API.triggerEvaluation();
    if (!res.success) throw new Error(res.error || 'Evaluation failed on backend.');

    Swal.fire({
      icon: 'success',
      title: '🏆 Evaluation Complete!',
      html: `
        <p>Successfully scored <strong>${res.processed}</strong> participants.</p>
        <p>The leaderboard is now up to date!</p>
      `
    });

    // Reload dashboard
    loadDashboardData();

  } catch (err) {
    console.error('Evaluation Error:', err);
    Swal.fire({ icon: 'error', title: 'Evaluation Failed', text: err.message || 'Check your connection' });
  }
}

// ── SCORING ENGINE ────────────────────────────────────────────────────
function calculateScore(prediction, official) {
  let score = 0;

  // Champion (5 pts)
  if (prediction.champion === official.champion) score += 5;
  // Runner-Up (3 pts)
  if (prediction.runnerUp === official.runnerUp) score += 3;
  // 3rd Place (2 pts)
  if (prediction.thirdPlace === official.thirdPlace) score += 2;

  // Finalists (1 pt each, 2 max)
  const predFinalists  = (prediction.finalists || '').split(',').map(t => t.trim());
  const offFinalists   = [official.finalist1, official.finalist2].filter(Boolean);
  predFinalists.forEach(f => { if (offFinalists.includes(f)) score += 1; });

  // Semi-finalists (1 pt each, 4 max)
  const predSemis = (prediction.semifinalists || '').split(',').map(t => t.trim());
  const offSemis  = [official.semi1, official.semi2, official.semi3, official.semi4].filter(Boolean);
  predSemis.forEach(s => { if (offSemis.includes(s)) score += 1; });

  // Awards
  if (prediction.goldenBoot  === official.goldenBoot)  score += 2;
  if (prediction.goldenBall  === official.goldenBall)  score += 1;
  if (prediction.goldenGlove === official.goldenGlove) score += 1;

  return score;
}

// ── LOAD ADMIN LEADERBOARD ────────────────────────────────────────────
async function loadAdminLeaderboard() {
  const el = document.getElementById('adminLbBody');
  if (!el) return;

  try {
    const res = await FIFA_API.fetchLeaderboard(100);
    if (!res.success) {
      el.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-danger);">Failed to load leaderboard.</td></tr>';
      return;
    }

    const scored = res.data || [];

  if (!scored.length) {
    el.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:32px;">No scored entries yet. Please evaluate first.</td></tr>';
    return;
  }

  el.innerHTML = scored.map((s, i) => `
    <tr>
      <td class="lb-rank ${i < 3 ? 'top-3' : ''}">${['🥇','🥈','🥉'][i] || '#' + (i+1)}</td>
      <td><strong>${escAdm(s.name || '—')}</strong></td>
      <td>${escAdm(s.ward || '—')}</td>
      <td>${teamFlag(s.champion)} ${escAdm(s.champion || '—')}</td>
      <td><span class="score-badge">${s.score}</span></td>
    </tr>
  `).join('');
  
  } catch (err) {
    console.error('Failed to load admin leaderboard', err);
    el.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-danger);">Error connecting to backend.</td></tr>';
  }
}

// ── UTILS ─────────────────────────────────────────────────────────────
function escAdm(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str || '')));
  return div.innerHTML;
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  } catch { return '—'; }
}

function teamFlag(name) {
  if (!name) return '';
      const flags = {
      'Algeria': '🇩🇿', 'Argentina': '🇦🇷', 'Australia': '🇦🇺', 'Austria': '🇦🇹',
      'Belgium': '🇧🇪', 'Bosnia and Herzegovina': '🇧🇦', 'Brazil': '🇧🇷', 'Canada': '🇨🇦',
      'Cape Verde': '🇨🇻', 'Colombia': '🇨🇴', 'DR Congo': '🇨🇩', 'Croatia': '🇭🇷',
      'Ecuador': '🇪🇨', 'Egypt': '🇪🇬', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'France': '🇫🇷',
      'Germany': '🇩🇪', 'Ghana': '🇬🇭', 'Ivory Coast': '🇨🇮', 'Japan': '🇯🇵',
      'Mexico': '🇲🇽', 'Morocco': '🇲🇦', 'Netherlands': '🇳🇱', 'Norway': '🇳🇴',
      'Paraguay': '🇵🇾', 'Portugal': '🇵🇹', 'Senegal': '🇸🇳', 'South Africa': '🇿🇦',
      'Spain': '🇪🇸', 'Sweden': '🇸🇪', 'Switzerland': '🇨🇭', 'United States': '🇺🇸'
    };
  return flags[name] || '';
}

// ── INIT ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  if (checkSession()) {
    AdminState.isLoggedIn = true;
    showDashboard();
  }

  // Load saved results
  const savedResults = localStorage.getItem('fifa2026_official_results');
  if (savedResults) {
    AdminState.officialResults = JSON.parse(savedResults);
    // Pre-fill the form
    const r = AdminState.officialResults;
    const fill = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
    fill('resChampion', r.champion); fill('resRunnerUp', r.runnerUp);
    fill('resThirdPlace', r.thirdPlace); fill('resFin1', r.finalist1);
    fill('resFin2', r.finalist2); fill('resSemi1', r.semi1);
    fill('resSemi2', r.semi2); fill('resSemi3', r.semi3); fill('resSemi4', r.semi4);
    fill('resGoldenBoot', r.goldenBoot); fill('resGoldenBall', r.goldenBall);
    fill('resGoldenGlove', r.goldenGlove); fill('resTBGoals', r.tbGoals);
    fill('resTBScorer', r.tbFirstScorer); fill('resTBMinute', r.tbFirstMinute);
  }

  // Participant search
  const searchInput = document.getElementById('participantSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => loadParticipants(searchInput.value));
  }

  // Password enter key
  const pwdInput = document.getElementById('adminPassword');
  if (pwdInput) {
    pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') adminLogin(); });
  }
});

window.adminLogin        = adminLogin;
window.adminLogout       = adminLogout;
window.navigateAdmin     = navigateAdmin;
window.saveResults       = saveResults;
window.evaluatePredictions = evaluatePredictions;
window.exportCSV         = exportCSV;
window.loadParticipants  = loadParticipants;
