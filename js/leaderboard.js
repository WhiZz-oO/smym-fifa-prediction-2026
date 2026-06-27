/* ═══════════════════════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — LEADERBOARD MODULE
   SMYM Chemmalamattom | leaderboard.js
═══════════════════════════════════════════════════════════════════ */

(function () {
  let leaderboardData = [];
  let isEvaluated     = false;

  // ── UNLOCK DATE: 20 July 2026, 4:00 AM IST (UTC+5:30) ────────────
  // IST 4:00 AM = UTC 22:30 previous day → 2026-07-19T22:30:00Z
  const UNLOCK_TIME = new Date('2026-07-19T22:30:00Z').getTime();

  /** Returns true if the leaderboard is still locked */
  function isLocked() {
    return Date.now() < UNLOCK_TIME;
  }

  /** Renders a live countdown inside the leaderboard section */
  function renderLockedState(podium, tableBody, statusText) {
    if (statusText) statusText.textContent = '🔒 Rankings are locked until 20 July 2026, 4:00 AM IST';

    if (tableBody) tableBody.innerHTML = '';

    if (!podium) return;
    podium.innerHTML = `
      <div class="lb-locked" style="text-align:center; padding: 60px 20px; width: 100%;">
        <div style="font-size: 4rem; margin-bottom: 16px; animation: trophyFloat 3s ease-in-out infinite;">🔒</div>
        <div style="font-family: var(--font-heading); font-size: clamp(1.8rem,4vw,3rem); letter-spacing: 4px; color: var(--gold); margin-bottom: 8px;">
          LEADERBOARD LOCKED
        </div>
        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 32px; max-width: 460px; margin-left: auto; margin-right: auto;">
          Rankings will be revealed on <strong style="color:var(--gold)">20 July 2026 at 4:00 AM IST</strong> after official results are evaluated.
        </p>
        <div class="countdown-grid" id="lbCountdownGrid" style="justify-content:center; gap: 12px;">
          <div class="cd-card" style="min-width:80px;">
            <div class="cd-number" id="lbCdDays">--</div>
            <div class="cd-unit">Days</div>
          </div>
          <div class="cd-sep">:</div>
          <div class="cd-card" style="min-width:80px;">
            <div class="cd-number" id="lbCdHours">--</div>
            <div class="cd-unit">Hours</div>
          </div>
          <div class="cd-sep">:</div>
          <div class="cd-card" style="min-width:80px;">
            <div class="cd-number" id="lbCdMinutes">--</div>
            <div class="cd-unit">Minutes</div>
          </div>
          <div class="cd-sep">:</div>
          <div class="cd-card" style="min-width:80px;">
            <div class="cd-number" id="lbCdSeconds">--</div>
            <div class="cd-unit">Seconds</div>
          </div>
        </div>
        <div style="margin-top:28px;">
          <div style="font-size:0.75rem; font-weight:600; letter-spacing:3px; text-transform:uppercase; color:var(--text-muted);">
            Submit your prediction before <span style="color:var(--gold)">12 July 2026</span>
          </div>
        </div>
      </div>
    `;
    startLockCountdown();
  }

  let lockTimerId = null;

  function startLockCountdown() {
    if (lockTimerId) clearInterval(lockTimerId);

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      const delta = UNLOCK_TIME - Date.now();
      if (delta <= 0) {
        clearInterval(lockTimerId);
        // Auto-unlock: reload the leaderboard data
        loadLeaderboard();
        return;
      }
      const days    = Math.floor(delta / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((delta / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((delta / (1000 * 60)) % 60);
      const seconds = Math.floor((delta / 1000) % 60);

      const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el && el.textContent !== pad(val)) {
          el.classList.remove('flip');
          void el.offsetWidth;
          el.classList.add('flip');
          el.textContent = pad(val);
        }
      };
      setEl('lbCdDays',    days);
      setEl('lbCdHours',   hours);
      setEl('lbCdMinutes', minutes);
      setEl('lbCdSeconds', seconds);
    }

    tick();
    lockTimerId = setInterval(tick, 1000);
  }

  // ── LOAD LEADERBOARD ──────────────────────────────────────────────
  async function loadLeaderboard() {
    const podium     = document.getElementById('podiumSection');
    const tableBody  = document.getElementById('leaderboardTableBody');
    const statusText = document.getElementById('leaderboardStatus');
    const refreshBtn = document.getElementById('lbRefreshBtn');

    if (!podium) return;

    // ── LOCK CHECK ────────────────────────────────────────────────────
    if (isLocked()) {
      renderLockedState(podium, tableBody, statusText);
      if (refreshBtn) refreshBtn.style.display = 'none';
      return;
    }
    if (refreshBtn) refreshBtn.style.display = '';
    // ─────────────────────────────────────────────────────────────────
    podium.innerHTML = `
      <div class="podium-loading">
        <div class="loading-dots"><div></div><div></div><div></div></div>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Loading rankings...</p>
      </div>
    `;
    if (tableBody) tableBody.innerHTML = buildSkeletonRows(5);

    try {
      const result = await FIFA_API.fetchLeaderboard(10);

      if (!result.success) throw new Error('Failed to load leaderboard.');

      leaderboardData = result.data || [];
      isEvaluated     = result.evaluated || false;

      if (statusText) {
        statusText.textContent = isEvaluated
          ? `🏆 Official rankings — ${leaderboardData.length} participants scored`
          : '⏳ Predictions are being collected. Results will appear after the World Cup.';
      }

      if (!isEvaluated && leaderboardData.length === 0) {
        renderNotEvaluated(podium, tableBody);
        return;
      }

      renderPodium(podium, leaderboardData.slice(0, 3));
      renderTable(tableBody, leaderboardData);

    } catch (err) {
      podium.innerHTML = `
        <div class="podium-loading">
          <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: var(--danger); margin-bottom: 12px;"></i>
          <p style="color: var(--text-secondary);">Failed to load leaderboard. <br><a href="#" onclick="loadLeaderboard()" style="color: var(--gold);">Try again</a></p>
        </div>
      `;
      if (tableBody) tableBody.innerHTML = '';
    }
  }

  // ── RENDER NOT EVALUATED STATE ────────────────────────────────────
  function renderNotEvaluated(podium, tableBody) {
    podium.innerHTML = `
      <div class="podium-loading" style="padding: 60px 20px; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 16px;">🏟️</div>
        <div style="font-family: var(--font-heading); font-size: 2rem; letter-spacing: 2px; color: var(--gold); margin-bottom: 12px;">
          PREDICTIONS OPEN
        </div>
        <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto;">
          Rankings will be revealed after the FIFA World Cup 2026 concludes and official results are entered.
        </p>
      </div>
    `;
    if (tableBody) tableBody.innerHTML = '';
  }

  // ── RENDER PODIUM (TOP 3) ─────────────────────────────────────────
  function renderPodium(el, top3) {
    if (!top3 || top3.length === 0) { el.innerHTML = ''; return; }

    const medals  = ['🥇', '🥈', '🥉'];
    const classes = ['podium-1', 'podium-2', 'podium-3'];
    const order   = [1, 0, 2]; // Display order: 2nd, 1st, 3rd (podium visual)

    const items = order.map(i => {
      const p = top3[i];
      if (!p) return '';
      const initials = p.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      return `
        <div class="podium-item ${classes[i]}" data-aos="zoom-in" data-aos-delay="${i * 100}">
          <div class="podium-rank">${medals[i]}</div>
          <div class="podium-avatar">${initials}</div>
          <div class="podium-name">${escapeHtml(p.name)}</div>
          <div class="podium-score">${p.score}</div>
          <div class="podium-pts">/ ${p.totalPts || 20} pts</div>
          <div class="podium-block"></div>
        </div>
      `;
    });

    el.innerHTML = items.join('');
    if (typeof AOS !== 'undefined') AOS.refresh();
  }

  // ── RENDER TABLE ──────────────────────────────────────────────────
  function renderTable(el, data) {
    if (!el) return;
    if (!data || data.length === 0) { el.innerHTML = '<div class="lb-row"><div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding: 32px;">No rankings yet.</div></div>'; return; }

    el.innerHTML = data.map((p, i) => `
      <div class="lb-row">
        <div class="lb-rank ${i < 3 ? 'top-3' : ''}">${getRankDisplay(i + 1)}</div>
        <div>
          <div class="lb-name">${escapeHtml(p.name)}</div>
        </div>
        <div class="lb-ward">${escapeHtml(p.ward || '—')}</div>
        <div class="lb-score">
          ${p.score}
          <div class="lb-pts-label">pts</div>
        </div>
      </div>
    `).join('');
  }

  // ── RANK DISPLAY ──────────────────────────────────────────────────
  function getRankDisplay(rank) {
    const icons = { 1: '🥇', 2: '🥈', 3: '🥉' };
    return icons[rank] || `#${rank}`;
  }

  // ── SKELETON ROWS ─────────────────────────────────────────────────
  function buildSkeletonRows(n) {
    return Array(n).fill(0).map(() => `
      <div class="lb-row">
        <div class="skeleton" style="width: 30px; height: 20px; border-radius: 4px;"></div>
        <div class="skeleton" style="width: 60%; height: 18px; border-radius: 4px;"></div>
        <div class="skeleton" style="width: 50px; height: 18px; border-radius: 4px;"></div>
        <div class="skeleton" style="width: 30px; height: 22px; border-radius: 4px; margin-left: auto;"></div>
      </div>
    `).join('');
  }

  // ── ESCAPE HTML ───────────────────────────────────────────────────
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str || '')));
    return div.innerHTML;
  }

  // ── EXPOSE ────────────────────────────────────────────────────────
  window.loadLeaderboard = loadLeaderboard;

})();
