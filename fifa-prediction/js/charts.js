/* ═══════════════════════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — CHARTS MODULE
   SMYM Chemmalamattom | charts.js
═══════════════════════════════════════════════════════════════════ */

(function () {
  let chartsInitialized = false;
  let chartInstances    = {};

  // ── CHART DEFAULTS ────────────────────────────────────────────────
  const GOLD_COLORS = [
    '#D4AF37', '#F0D060', '#B8962E', '#E8C840',
    '#9C7820', '#FFD700', '#C5A028', '#DDB830'
  ];
  const ACCENT_COLORS = [
    'rgba(212,175,55,0.8)', 'rgba(212,175,55,0.6)', 'rgba(212,175,55,0.5)',
    'rgba(212,175,55,0.4)', 'rgba(212,175,55,0.3)', 'rgba(212,175,55,0.2)',
    'rgba(212,175,55,0.15)', 'rgba(212,175,55,0.1)'
  ];

  Chart.defaults.color = 'rgba(240,244,255,0.7)';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.font.family = "'Poppins', sans-serif";

  // ── NO DATA PLACEHOLDER ───────────────────────────────────────────
  function showNoData(canvasId, message) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const parent = canvas.parentElement;
    // Hide the canvas itself
    canvas.style.display = 'none';
    // Inject placeholder if not already there
    if (parent && !parent.querySelector('.chart-no-data')) {
      const div = document.createElement('div');
      div.className = 'chart-no-data';
      div.style.cssText = `
        display:flex; flex-direction:column; align-items:center;
        justify-content:center; height:200px; gap:10px;
        color:rgba(240,244,255,0.3); font-size:0.88rem;
        font-family:var(--font-body);
      `;
      div.innerHTML = `
        <span style="font-size:2.5rem;">📊</span>
        <span>${message || 'No submissions yet. Charts will populate once participants submit.'}</span>
      `;
      parent.appendChild(div);
    }
  }

  function clearNoData(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    canvas.style.display = '';
    const parent = canvas.parentElement;
    const ph = parent?.querySelector('.chart-no-data');
    if (ph) ph.remove();
  }

  const darkPlugin = {
    id: 'darkBackground',
    beforeDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      ctx.save();
      ctx.fillStyle = 'transparent';
      ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
      ctx.restore();
    }
  };

  // ── LOAD ALL CHARTS ───────────────────────────────────────────────
  async function loadCharts() {
    if (chartsInitialized) {
      // Just refresh data
      await refreshCharts();
      return;
    }
    chartsInitialized = true;

    try {
      const result = await FIFA_API.fetchStats();
      renderAllCharts(result);
    } catch (err) {
      console.error('Charts failed to load:', err);
    }
  }

  // ── REFRESH CHARTS DATA ───────────────────────────────────────────
  async function refreshCharts() {
    try {
      const result = await FIFA_API.fetchStats();
      Object.keys(chartInstances).forEach(key => {
        if (chartInstances[key]) chartInstances[key].destroy();
      });
      chartInstances = {};
      renderAllCharts(result);
    } catch (err) {
      console.error('Charts refresh failed:', err);
    }
  }

  // ── RENDER ALL ────────────────────────────────────────────────────
  function renderAllCharts(data) {
    renderChampionChart(data.champion || []);
    renderGoldenBootChart(data.goldenBoot || []);
    renderWardChart(data.ward || []);
    renderAgeChart(data.age || []);
  }

  // ── CHART 1: MOST PREDICTED CHAMPION (Doughnut) ───────────────────
  function renderChampionChart(data) {
    const ctx = document.getElementById('chartChampion');
    if (!ctx) return;
    if (!data || data.length === 0) { showNoData('chartChampion'); return; }
    clearNoData('chartChampion');

    chartInstances.champion = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: GOLD_COLORS,
          borderColor: 'rgba(5,11,23,0.8)',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              color: 'rgba(240,244,255,0.8)',
              font: { size: 12, family: "'Poppins', sans-serif" },
              usePointStyle: true,
              pointStyleWidth: 10
            }
          },
          tooltip: {
            backgroundColor: 'rgba(5,11,23,0.95)',
            borderColor: 'rgba(212,175,55,0.3)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label(ctx) {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct   = ((ctx.raw / total) * 100).toFixed(1);
                return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
              }
            }
          }
        },
        cutout: '62%',
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1200,
          easing: 'easeInOutQuart'
        }
      },
      plugins: [darkPlugin]
    });
  }

  // ── CHART 2: GOLDEN BOOT PREDICTIONS (Horizontal Bar) ────────────
  function renderGoldenBootChart(data) {
    const ctx = document.getElementById('chartGoldenBoot');
    if (!ctx) return;
    if (!data || data.length === 0) { showNoData('chartGoldenBoot'); return; }
    clearNoData('chartGoldenBoot');

    chartInstances.goldenBoot = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          label: 'Predictions',
          data: data.map(d => d.value),
          backgroundColor: ACCENT_COLORS,
          borderColor: 'rgba(212,175,55,0.6)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(5,11,23,0.95)',
            borderColor: 'rgba(212,175,55,0.3)',
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: 'rgba(240,244,255,0.6)', font: { size: 11 } }
          },
          y: {
            grid: { display: false },
            ticks: { color: 'rgba(240,244,255,0.8)', font: { size: 12 } }
          }
        },
        animation: { duration: 1000, easing: 'easeInOutQuart' }
      }
    });
  }

  // ── CHART 3: WARD PARTICIPATION (Bar) ────────────────────────────
  function renderWardChart(data) {
    const ctx = document.getElementById('chartWard');
    if (!ctx) return;
    if (!data || data.length === 0) { showNoData('chartWard'); return; }
    clearNoData('chartWard');

    chartInstances.ward = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          label: 'Participants',
          data: data.map(d => d.value),
          backgroundColor: data.map((_, i) =>
            i % 2 === 0 ? 'rgba(212,175,55,0.7)' : 'rgba(212,175,55,0.4)'
          ),
          borderColor: 'rgba(212,175,55,0.8)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(5,11,23,0.95)',
            borderColor: 'rgba(212,175,55,0.3)',
            borderWidth: 1,
            padding: 12
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: 'rgba(240,244,255,0.6)', font: { size: 11 } },
            beginAtZero: true
          },
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(240,244,255,0.8)', font: { size: 11 } }
          }
        },
        animation: { duration: 1000 }
      }
    });
  }

  // ── CHART 4: AGE DISTRIBUTION (Pie) ──────────────────────────────
  function renderAgeChart(data) {
    const ctx = document.getElementById('chartAge');
    if (!ctx) return;
    if (!data || data.length === 0) { showNoData('chartAge'); return; }
    clearNoData('chartAge');

    const colors = [
      'rgba(212,175,55,0.9)', 'rgba(0,200,83,0.8)', 'rgba(100,200,255,0.8)',
      'rgba(255,165,0,0.8)', 'rgba(220,80,80,0.8)'
    ];

    chartInstances.age = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: colors,
          borderColor: 'rgba(5,11,23,0.8)',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 14,
              color: 'rgba(240,244,255,0.8)',
              font: { size: 12 },
              usePointStyle: true,
              pointStyleWidth: 10
            }
          },
          tooltip: {
            backgroundColor: 'rgba(5,11,23,0.95)',
            borderColor: 'rgba(212,175,55,0.3)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label(ctx) {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct   = ((ctx.raw / total) * 100).toFixed(1);
                return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
              }
            }
          }
        },
        animation: { animateScale: true, duration: 1200 }
      }
    });
  }

  // ── EXPOSE ────────────────────────────────────────────────────────
  window.loadCharts    = loadCharts;
  window.refreshCharts = refreshCharts;
})();
