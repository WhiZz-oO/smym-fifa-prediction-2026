const fs=require('fs'); 
let adm=fs.readFileSync('js/admin.js','utf8'); 

adm = adm.replace(
`// ── LOAD DASHBOARD ────────────────────────────────────────────────────
function loadDashboardData() {
  try {
    // Load all submissions from local storage (demo mode)
    const allSubs = JSON.parse(localStorage.getItem('fifa2026_all') || '[]');
    AdminState.allSubmissions = allSubs;

    const total     = allSubs.length;
    const today     = allSubs.filter(s => {
      const d = new Date(s.submittedAt || s.timestamp);
      return d.toDateString() === new Date().toDateString();
    }).length;

    // Champion tally
    const champTally = {};
    allSubs.forEach(s => { champTally[s.champion] = (champTally[s.champion] || 0) + 1; });
    const topChamp = Object.entries(champTally).sort((a,b) => b[1]-a[1])[0];

    // Golden Boot tally
    const bootTally = {};
    allSubs.forEach(s => { bootTally[s.goldenBoot] = (bootTally[s.goldenBoot] || 0) + 1; });
    const topBoot = Object.entries(bootTally).sort((a,b) => b[1]-a[1])[0];`,

`// ── LOAD DASHBOARD ────────────────────────────────────────────────────
async function loadDashboardData() {
  try {
    const summary = await FIFA_API.fetchDashboardSummary();
    if (!summary || !summary.success) return;
    const total = summary.total || 0;
    const today = summary.today || 0;
    const stats = await FIFA_API.fetchStats();
    const topChamp = stats.champion?.[0] ? [stats.champion[0].label, stats.champion[0].value] : null;
    const topBoot  = stats.goldenBoot?.[0] ? [stats.goldenBoot[0].label, stats.goldenBoot[0].value] : null;`
);

adm = adm.replace(
`    // If evaluated, load scores
    if (AdminState.officialResults.champion) {
      const evaluated = allSubs.filter(s => s.score !== undefined);
      if (evaluated.length > 0) {
        const scores = evaluated.map(s => s.score);
        const avg    = (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1);
        const max    = Math.max(...scores);
        const winner = evaluated.find(s => s.score === max);
        setCard('cardAvgScore', avg, false);
        setCard('cardHighest', max);
        setCard('cardWinner', winner ? winner.fullName : '—', false);
      }
    }

    // Recent activity
    renderRecentActivity(allSubs.slice(-5).reverse());`,

`    // If evaluated, load scores
    if (AdminState.officialResults.champion && summary.avgScore) {
      setCard('cardAvgScore', summary.avgScore, false);
      setCard('cardHighest', summary.highest, false);
      setCard('cardWinner', summary.winner || '—', false);
    } else {
      setCard('cardAvgScore', '—', false);
      setCard('cardHighest', '—', false);
      setCard('cardWinner', '—', false);
    }
    const submissionsData = await FIFA_API.fetchAllSubmissions(1, '');
    if (submissionsData.success && submissionsData.data) {
      AdminState.allSubmissions = submissionsData.data;
      renderRecentActivity(submissionsData.data.slice(-5).reverse());
    }`
);

adm = adm.replace(
`// ── LOAD PARTICIPANTS TABLE ───────────────────────────────────────────
function loadParticipants(search = '') {
  const allSubs = JSON.parse(localStorage.getItem('fifa2026_all') || '[]');
  AdminState.allSubmissions = allSubs;

  let filtered = allSubs;
  if (search) {
    const q = search.toLowerCase();
    filtered = allSubs.filter(s =>
      (s.fullName || '').toLowerCase().includes(q) ||
      (s.phone || '').includes(q) ||
      (s.ward || '').toLowerCase().includes(q)
    );
  }
  AdminState.filteredSubmissions = filtered;
  renderParticipantTable(filtered);
}`,

`// ── LOAD PARTICIPANTS TABLE ───────────────────────────────────────────
async function loadParticipants(search = '') {
  try {
    const res = await FIFA_API.fetchAllSubmissions(1, search);
    if (!res.success) return;
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
  } catch (err) {}
}`
);

adm = adm.replace(
`    localStorage.setItem('fifa2026_official_results', JSON.stringify(results));
    AdminState.officialResults = results;
    
    // Auto-fill form
    loadResults();

    Swal.fire({
      icon: 'success',
      title: 'Results Saved!',
      text: 'Official results have been saved. Click Evaluate to calculate scores.',
      confirmButtonText: 'OK'
    });`,

`    const res = await FIFA_API.saveOfficialResults(results);
    if (!res.success) throw new Error(res.error);
    localStorage.setItem('fifa2026_official_results', JSON.stringify(results));
    AdminState.officialResults = results;
    loadResults();
    Swal.fire({
      icon: 'success',
      title: 'Results Saved!',
      text: 'Official tournament results have been saved securely.',
      timer: 2000,
      showConfirmButton: false
    });`
);

adm = adm.replace(
`  try {
    const allSubs = JSON.parse(localStorage.getItem('fifa2026_all') || '[]');
    const scored  = allSubs.map(s => ({
      ...s,
      score: calculateScore(s, results),
      evaluated: true
    }));

    // Sort by score (descending)
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tie-break 1: goals by golden boot winner
      const aDiff = Math.abs((a.tbGoals || 0) - (results.tbGoals || 0));
      const bDiff = Math.abs((b.tbGoals || 0) - (results.tbGoals || 0));
      if (aDiff !== bDiff) return aDiff - bDiff;
      // Tie-break 2: first scorer
      const aScorer = (a.tbFirstScorer || '') === (results.tbFirstScorer || '') ? -1 : 0;
      const bScorer = (b.tbFirstScorer || '') === (results.tbFirstScorer || '') ? -1 : 0;
      return aScorer - bScorer;
    });

    localStorage.setItem('fifa2026_all', JSON.stringify(scored));

    Swal.fire({
      icon: 'success',
      title: '🏆 Evaluation Complete!',
      html: \`
        <p>Scored <strong>\${scored.length}</strong> participants.</p>
        \${scored.length > 0 ? \`<p>🥇 Winner: <strong>\${escAdm(scored[0].fullName)}</strong> with <strong>\${scored[0].score} points</strong></p>\` : ''}
      \`
    });

    // Reload dashboard
    loadDashboardData();

  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Evaluation Failed', text: err.message });
  }
}`,

`  try {
    const res = await FIFA_API.triggerEvaluation();
    if (!res.success) throw new Error(res.error);
    Swal.fire({
      icon: 'success',
      title: '🏆 Evaluation Complete!',
      html: \`<p>Successfully scored <strong>\${res.processed}</strong> participants.</p>\`
    });
    loadDashboardData();
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Evaluation Failed', text: err.message });
  }
}`
);

adm = adm.replace(
`// ── LOAD ADMIN LEADERBOARD ────────────────────────────────────────────
function loadAdminLeaderboard() {
  const allSubs = JSON.parse(localStorage.getItem('fifa2026_all') || '[]');
  const scored  = allSubs.filter(s => s.score !== undefined).sort((a,b) => b.score - a.score);
  const el      = document.getElementById('adminLbBody');
  if (!el) return;

  if (!scored.length) {
    el.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:32px;">No scored entries yet. Please evaluate first.</td></tr>';
    return;
  }

  el.innerHTML = scored.map((s, i) => \`
    <tr>
      <td class="lb-rank \${i < 3 ? 'top-3' : ''}">\${['🥇','🥈','🥉'][i] || '#' + (i+1)}</td>
      <td><strong>\${escAdm(s.fullName || '—')}</strong></td>
      <td>\${escAdm(s.ward || '—')}</td>
      <td>\${teamFlag(s.champion)} \${escAdm(s.champion || '—')}</td>
      <td><span class="score-badge">\${s.score}</span> <span style="font-size:0.8rem;color:var(--text-muted);">/ \${s.totalPts}</span></td>
      <td>
        <button class="admin-btn secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="viewSubmission('\${s.phone}')">View</button>
      </td>
    </tr>
  \`).join('');
}`,

`// ── LOAD ADMIN LEADERBOARD ────────────────────────────────────────────
async function loadAdminLeaderboard() {
  const el = document.getElementById('adminLbBody');
  if (!el) return;
  try {
    const res = await FIFA_API.fetchLeaderboard(100);
    if (!res.success) return;
    const scored = res.data || [];
    if (!scored.length) {
      el.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:32px;">No scored entries yet. Please evaluate first.</td></tr>';
      return;
    }
    el.innerHTML = scored.map((s, i) => \`
      <tr>
        <td class="lb-rank \${i < 3 ? 'top-3' : ''}">\${['🥇','🥈','🥉'][i] || '#' + (i+1)}</td>
        <td><strong>\${escAdm(s.name || '—')}</strong></td>
        <td>\${escAdm(s.ward || '—')}</td>
        <td>\${teamFlag(s.champion)} \${escAdm(s.champion || '—')}</td>
        <td><span class="score-badge">\${s.score}</span></td>
        <td>
          <button class="admin-btn secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="alert('Viewing backend data not supported via phone yet. Please check Google Sheet.')">View</button>
        </td>
      </tr>
    \`).join('');
  } catch (err) {}
}`
);

fs.writeFileSync('js/admin.js', adm);
console.log("Admin fix done!");
