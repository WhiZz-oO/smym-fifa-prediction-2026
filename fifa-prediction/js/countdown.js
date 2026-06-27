/* ═══════════════════════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — COUNTDOWN MODULE
   SMYM Chemmalamattom | countdown.js
═══════════════════════════════════════════════════════════════════ */

(function () {
  // ── TARGET DATE: 12 July 2026 23:59:59 IST (UTC+5:30) ──────────
  // IST = UTC + 5:30 → Target UTC = 2026-07-12T18:29:59Z
  const TARGET = new Date('2026-07-12T18:29:59Z').getTime();

  const els = {
    days:    document.getElementById('cdDays'),
    hours:   document.getElementById('cdHours'),
    minutes: document.getElementById('cdMinutes'),
    seconds: document.getElementById('cdSeconds')
  };

  let prevValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };
  let intervalId = null;

  /**
   * Pads a number to 2 digits.
   */
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  /**
   * Animates a number change with flip effect.
   */
  function updateCard(el, newVal) {
    if (!el) return;
    const padded = pad(newVal);
    if (el.textContent !== padded) {
      el.classList.remove('flip');
      void el.offsetWidth; // force reflow to restart animation
      el.classList.add('flip');
      el.textContent = padded;
    }
  }

  /**
   * Main countdown tick function.
   */
  function tick() {
    const now   = Date.now();
    const delta = TARGET - now;

    if (delta <= 0) {
      // Contest closed
      clearInterval(intervalId);
      showContestClosed();
      return;
    }

    const days    = Math.floor(delta / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((delta / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((delta / (1000 * 60)) % 60);
    const seconds = Math.floor((delta / 1000) % 60);

    if (days    !== prevValues.days)    updateCard(els.days,    days);
    if (hours   !== prevValues.hours)   updateCard(els.hours,   hours);
    if (minutes !== prevValues.minutes) updateCard(els.minutes, minutes);
    if (seconds !== prevValues.seconds) updateCard(els.seconds, seconds);

    prevValues = { days, hours, minutes, seconds };
  }

  /**
   * Shows a "contest closed" message in the countdown area.
   */
  function showContestClosed() {
    const grid = document.getElementById('countdownGrid');
    if (!grid) return;
    grid.innerHTML = `
      <div class="cd-closed">
        <i class="fas fa-lock" style="color: var(--gold); font-size: 2rem; margin-bottom: 12px;"></i>
        <div style="font-family: var(--font-heading); font-size: 2rem; letter-spacing: 3px; color: var(--gold);">PREDICTIONS CLOSED</div>
        <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 8px;">The contest entry deadline has passed.</div>
      </div>
    `;
    grid.style.flexDirection = 'column';
    grid.style.alignItems = 'center';
  }

  /**
   * Initializes the countdown timer.
   */
  function init() {
    if (!els.days) return; // Element not on page
    tick(); // Immediate first tick (no flash of 00:00:00:00)
    intervalId = setInterval(tick, 1000);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
