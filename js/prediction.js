/* ═══════════════════════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — PREDICTION WIZARD MODULE
   SMYM Chemmalamattom | prediction.js
═══════════════════════════════════════════════════════════════════ */

// ── DATA: 48 FIFA WORLD CUP 2026 TEAMS ──────────────────────────────
const TEAMS = [
  { name: 'Algeria',      flag: '🇩🇿', conf: 'CAF' },
  { name: 'Argentina',    flag: '🇦🇷', conf: 'CONMEBOL' },
  { name: 'Australia',    flag: '🇦🇺', conf: 'AFC' },
  { name: 'Austria',      flag: '🇦🇹', conf: 'UEFA' },
  { name: 'Belgium',      flag: '🇧🇪', conf: 'UEFA' },
  { name: 'Bosnia',       flag: '🇧🇦', conf: 'UEFA' },
  { name: 'Brazil',       flag: '🇧🇷', conf: 'CONMEBOL' },
  { name: 'Canada',       flag: '🇨🇦', conf: 'CONCACAF', host: true },
  { name: 'Cape Verde',   flag: '🇨🇻', conf: 'CAF' },
  { name: 'Colombia',     flag: '🇨🇴', conf: 'CONMEBOL' },
  { name: 'Congo',        flag: '🇨🇩', conf: 'CAF' },
  { name: 'Croatia',      flag: '🇭🇷', conf: 'UEFA' },
  { name: 'Ecuador',      flag: '🇪🇨', conf: 'CONMEBOL' },
  { name: 'Egypt',        flag: '🇪🇬', conf: 'CAF' },
  { name: 'England',      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', conf: 'UEFA' },
  { name: 'France',       flag: '🇫🇷', conf: 'UEFA' },
  { name: 'Germany',      flag: '🇩🇪', conf: 'UEFA' },
  { name: 'Ghana',        flag: '🇬🇭', conf: 'CAF' },
  { name: 'Ivory Coast',  flag: '🇨🇮', conf: 'CAF' },
  { name: 'Japan',        flag: '🇯🇵', conf: 'AFC' },
  { name: 'Mexico',       flag: '🇲🇽', conf: 'CONCACAF', host: true },
  { name: 'Morocco',      flag: '🇲🇦', conf: 'CAF' },
  { name: 'Netherlands',  flag: '🇳🇱', conf: 'UEFA' },
  { name: 'Norway',       flag: '🇳🇴', conf: 'UEFA' },
  { name: 'Paraguay',     flag: '🇵🇾', conf: 'CONMEBOL' },
  { name: 'Portugal',     flag: '🇵🇹', conf: 'UEFA' },
  { name: 'Senegal',      flag: '🇸🇳', conf: 'CAF' },
  { name: 'South Africa', flag: '🇿🇦', conf: 'CAF' },
  { name: 'Spain',        flag: '🇪🇸', conf: 'UEFA' },
  { name: 'Sweden',       flag: '🇸🇪', conf: 'UEFA' },
  { name: 'Switzerland',  flag: '🇨🇭', conf: 'UEFA' },
  { name: 'USA',          flag: '🇺🇸', conf: 'CONCACAF', host: true }
];

// ── DATA: PLAYERS (for award dropdowns) ──────────────────────────────
const PLAYERS = [
  // Argentina
  'Lionel Messi (Argentina)', 'Julián Álvarez (Argentina)', 'Lautaro Martínez (Argentina)',
  'Alejandro Garnacho (Argentina)', 'Paulo Dybala (Argentina)',
  // Australia
  'Mathew Leckie (Australia)', 'Mitchell Duke (Australia)',
  // Belgium
  'Romelu Lukaku (Belgium)', 'Kevin De Bruyne (Belgium)', 'Dodi Lukebakio (Belgium)',
  // Brazil
  'Neymar Jr (Brazil)', 'Vinicius Jr (Brazil)', 'Rodrygo (Brazil)',
  'Raphinha (Brazil)', 'Richarlison (Brazil)', 'Gabriel Martinelli (Brazil)',
  'Endrick (Brazil)',
  // Canada
  'Alphonso Davies (Canada)', 'Jonathan David (Canada)', 'Cyle Larin (Canada)',
  // Chile
  'Alexis Sánchez (Chile)', 'Ben Brereton Díaz (Chile)',
  // Colombia
  'Luis Díaz (Colombia)', 'James Rodríguez (Colombia)', 'Radamel Falcao (Colombia)',
  'Jhon Córdoba (Colombia)',
  // Croatia
  'Luka Modrić (Croatia)', 'Ivan Perišić (Croatia)', 'Andrej Kramarić (Croatia)',
  // Denmark
  'Christian Eriksen (Denmark)', 'Rasmus Højlund (Denmark)',
  // Ecuador
  'Enner Valencia (Ecuador)', 'Moisés Caicedo (Ecuador)',
  // Egypt
  'Mohamed Salah (Egypt)', 'Mostafa Mohamed (Egypt)',
  // England
  'Harry Kane (England)', 'Phil Foden (England)', 'Bukayo Saka (England)',
  'Jude Bellingham (England)', 'Marcus Rashford (England)', 'Ollie Watkins (England)',
  'Ivan Toney (England)',
  // France
  'Kylian Mbappé (France)', 'Antoine Griezmann (France)', 'Ousmane Dembélé (France)',
  'Marcus Thuram (France)',
  // Germany
  'Jamal Musiala (Germany)', 'Florian Wirtz (Germany)', 'Leroy Sané (Germany)',
  'Kai Havertz (Germany)', 'Thomas Müller (Germany)',
  // Honduras
  'Romell Quioto (Honduras)',
  // Iran
  'Sardar Azmoun (Iran)', 'Mehdi Taremi (Iran)',
  // Italy
  'Federico Chiesa (Italy)', 'Gianluca Scamacca (Italy)', 'Ciro Immobile (Italy)',
  'Lorenzo Pellegrini (Italy)',
  // Ivory Coast
  'Sébastien Haller (Ivory Coast)', 'Nicolas Pépé (Ivory Coast)',
  // Japan
  'Takumi Minamino (Japan)', 'Daichi Kamada (Japan)', 'Ritsu Doan (Japan)',
  // Jordan
  'Musa Al-Taamari (Jordan)',
  // Mexico
  'Hirving Lozano (Mexico)', 'Raúl Jiménez (Mexico)', 'Edson Álvarez (Mexico)',
  // Morocco
  'Hakim Ziyech (Morocco)', 'Youssef En-Nesyri (Morocco)', 'Achraf Hakimi (Morocco)',
  // Netherlands
  'Memphis Depay (Netherlands)', 'Cody Gakpo (Netherlands)', 'Virgil van Dijk (Netherlands)',
  'Donyell Malen (Netherlands)',
  // Nigeria
  'Victor Osimhen (Nigeria)', 'Taiwo Awoniyi (Nigeria)',
  // Norway
  'Erling Haaland (Norway)', 'Martin Ødegaard (Norway)',
  // Panama
  'Ismael Díaz (Panama)', 'Rolando Blackburn (Panama)',
  // Peru
  'Paolo Guerrero (Peru)', 'Gianluca Lapadula (Peru)',
  // Poland
  'Robert Lewandowski (Poland)',
  // Portugal
  'Cristiano Ronaldo (Portugal)', 'Bruno Fernandes (Portugal)',
  'Rafael Leão (Portugal)', 'Bernardo Silva (Portugal)', 'João Félix (Portugal)',
  // Saudi Arabia
  'Salem Al-Dawsari (Saudi Arabia)', 'Firas Al-Buraikan (Saudi Arabia)',
  // Senegal
  'Sadio Mané (Senegal)', 'Ismaila Sarr (Senegal)',
  // Serbia
  'Dušan Vlahović (Serbia)', 'Aleksandar Mitrović (Serbia)',
  // South Africa
  'Percy Tau (South Africa)',
  // South Korea
  'Son Heung-min (South Korea)', 'Hwang Hee-chan (South Korea)',
  // Spain
  'Álvaro Morata (Spain)', 'Pedri (Spain)', 'Gavi (Spain)',
  'Ferran Torres (Spain)', 'Dani Olmo (Spain)', 'Lamine Yamal (Spain)',
  // Switzerland
  'Xherdan Shaqiri (Switzerland)', 'Breel Embolo (Switzerland)',
  // Tunisia
  'Wahbi Khazri (Tunisia)',
  // Turkey
  'Hakan Çalhanoğlu (Turkey)', 'Arda Güler (Turkey)', 'Burak Yılmaz (Turkey)',
  // Ukraine
  'Andriy Yarmolenko (Ukraine)', 'Roman Yaremchuk (Ukraine)',
  // United States
  'Christian Pulisic (United States)', 'Gio Reyna (United States)',
  'Ricardo Pepi (United States)',
  // Venezuela
  'Salomón Rondón (Venezuela)',
  // Uruguay
  'Luis Suárez (Uruguay)', 'Darwin Núñez (Uruguay)', 'Federico Valverde (Uruguay)',
].sort();

// ── DATA: GOALKEEPERS (for Golden Glove) ────────────────────────────
const GOALKEEPERS = [
  'Alisson Becker (Brazil)', 'Ederson Moraes (Brazil)',
  'Emiliano Martínez (Argentina)',
  'Unai Simón (Spain)', 'David Raya (Spain)',
  'Mike Maignan (France)', 'Alphonse Areola (France)',
  'Manuel Neuer (Germany)', 'Marc-André ter Stegen (Germany)',
  'Gianluigi Donnarumma (Italy)',
  'Jordan Pickford (England)',
  'Thibaut Courtois (Belgium)',
  'Jan Oblak (Austria)',
  'Wojciech Szczęsny (Poland)',
  'Diogo Costa (Portugal)',
  'Yann Sommer (Switzerland)',
  'Yassine Bounou (Morocco)',
  'Bono (Morocco)',
  'Andriy Lunin (Ukraine)',
  'Ángel Mena (Mexico)', 'Guillermo Ochoa (Mexico)',
  'Matt Turner (United States)',
  'Alireza Beiranvand (Iran)',
  'Kim Seung-gyu (South Korea)',
].sort();

// ── STATE ────────────────────────────────────────────────────────────
const PredState = {
  currentStep: 1,
  selections: {
    semifinalists: [],   // 4 team names
    finalists:     [],   // 2 team names
    champion:      null, // 1 team name
    runnerUp:      null, // 1 team name
    thirdPlace:    null, // 1 team name
  },
  form: {
    fullName: '', age: '', houseName: '', ward: '', phone: '', email: ''
  },
  awards: {
    goldenBoot: '', goldenBall: '', goldenGlove: '',
    tbGoals: '', tbFirstScorer: '', tbFirstMinute: ''
  },
  choicesInstances: {},
  isSubmitting: false
};

// ── DEADLINE ───────────────────────────────────────────────────────────
const PREDICTION_DEADLINE = new Date('2026-07-12T18:29:59Z').getTime();

// ── INIT ─────────────────────────────────────────────────────────────
function initPrediction() {
  if (Date.now() > PREDICTION_DEADLINE) {
    showPredictionClosed();
    return;
  }
  renderTeamGrids();
  initChoicesDropdowns();
}

function showPredictionClosed() {
  const container = document.querySelector('#section-predict .container-xl');
  if (container) {
    container.innerHTML = `
      <div class="lb-locked" style="text-align:center; padding: 100px 20px; width: 100%;">
        <div style="font-size: 4rem; margin-bottom: 16px;">🔒</div>
        <div style="font-family: var(--font-heading); font-size: clamp(1.8rem,4vw,3rem); letter-spacing: 4px; color: var(--gold); margin-bottom: 8px;">
          PREDICTIONS CLOSED
        </div>
        <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 32px; max-width: 460px; margin-left: auto; margin-right: auto;">
          The entry deadline for the FIFA World Cup 2026 Prediction Contest has passed. No more entries are being accepted.
        </p>
        <button class="btn-primary-gold" onclick="navigateTo('leaderboard')">
          <i class="fas fa-chart-bar me-2"></i> View Leaderboard
        </button>
      </div>
    `;
  }
}

// ── RENDER TEAM GRIDS ────────────────────────────────────────────────
function renderTeamGrids() {
  const grids = ['SF', 'Fin', 'Champ', 'RU', 'Third'];
  const domIds = {
    SF:    'teamsGridSF',
    Fin:   'teamsGridFin',
    Champ: 'teamsGridChamp',
    RU:    'teamsGridRU',
    Third: 'teamsGridThird'
  };

  grids.forEach(type => {
    const el = document.getElementById(domIds[type]);
    if (!el) return;
    el.innerHTML = TEAMS.map(team => `
      <div class="team-card"
           data-team="${team.name}"
           data-type="${type}"
           onclick="toggleTeamSelection('${team.name}', '${type}', this)"
           role="button"
           tabindex="0"
           aria-label="${team.name}"
           title="${team.name}${team.host ? ' (Host)' : ''}">
        <span class="team-flag">${team.flag}</span>
        <span class="team-name">${team.name}${team.host ? ' ★' : ''}</span>
      </div>
    `).join('');
  });
  if (typeof updateDependentGrids === 'function') updateDependentGrids();
}

// ── TEAM SELECTION TOGGLE ────────────────────────────────────────────
function toggleTeamSelection(teamName, type, cardEl) {
  const maxMap = { SF: 4, Fin: 2, Champ: 1, RU: 1, Third: 1 };
  const selectionKey = {
    SF:    'semifinalists',
    Fin:   'finalists',
    Champ: 'champion',
    RU:    'runnerUp',
    Third: 'thirdPlace'
  }[type];

  const max = maxMap[type];
  const isSingle = max === 1;

  if (isSingle) {
    // Deselect previous
    const prevGrid = document.getElementById(`teamsGrid${type}`);
    if (prevGrid) {
      prevGrid.querySelectorAll('.team-card.selected').forEach(c => c.classList.remove('selected'));
    }
    PredState.selections[selectionKey] = teamName;
    cardEl.classList.add('selected', 'just-selected');
    setTimeout(() => cardEl.classList.remove('just-selected'), 400);
  } else {
    const arr = PredState.selections[selectionKey];
    const idx = arr.indexOf(teamName);
    if (idx > -1) {
      arr.splice(idx, 1);
      cardEl.classList.remove('selected');
    } else {
      if (arr.length >= max) {
        showMaxWarning(type, max);
        cardEl.classList.add('shake');
        setTimeout(() => cardEl.classList.remove('shake'), 400);
        return;
      }
      arr.push(teamName);
      cardEl.classList.add('selected', 'just-selected');
      setTimeout(() => cardEl.classList.remove('just-selected'), 400);
    }
    PredState.selections[selectionKey] = arr;
  }

  updateCounters();
  hideError(`${type.toLowerCase()}Err`);
  if (typeof updateDependentGrids === 'function') updateDependentGrids();
}

function showMaxWarning(type, max) {
  const labels = { SF: 'semi-finalists', Fin: 'finalists', Champ: 'champion', RU: 'runner-up', Third: 'third place' };
  Swal.fire({
    toast: true,
    position: 'top',
    icon: 'warning',
    title: `You can only pick ${max} ${labels[type] || 'team'}!`,
    showConfirmButton: false,
    timer: 2000,
    background: 'rgba(13,27,42,0.98)',
    color: '#F0F4FF',
    iconColor: '#D4AF37'
  });
}

// ── UPDATE COUNTERS ──────────────────────────────────────────────────
function updateCounters() {
  const s = PredState.selections;
  const setCount = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setCount('sfCount', s.semifinalists.length);
  setCount('finCount', s.finalists.length);
  setCount('champCount', s.champion ? 1 : 0);
  setCount('ruCount', s.runnerUp ? 1 : 0);
  setCount('thirdCount', s.thirdPlace ? 1 : 0);
}

// ── TEAM SEARCH FILTER ───────────────────────────────────────────────
function filterTeams() {
  const query = document.getElementById('teamSearch')?.value.toLowerCase().trim() || '';
  const grid  = document.getElementById('teamsGridSF');
  if (!grid) return;
  grid.querySelectorAll('.team-card').forEach(card => {
    const teamName = card.dataset.team.toLowerCase();
    card.classList.toggle('hidden', !teamName.includes(query));
  });
}

// ── CHOICES.JS INIT ──────────────────────────────────────────────────
function initChoicesDropdowns() {
  const bootEl  = document.getElementById('goldenBoot');
  const ballEl  = document.getElementById('goldenBall');
  const gloveEl = document.getElementById('goldenGlove');
  const tbEl    = document.getElementById('tbFirstScorer');

  const choicesConfig = {
    searchEnabled: true,
    searchPlaceholderValue: 'Type player name...',
    itemSelectText: '',
    shouldSort: false,
    position: 'bottom',
    classNames: { containerOuter: 'choices' }
  };

  
  if (tbEl && !PredState.choicesInstances.tbScorer) {
    populateSelect(tbEl, PLAYERS);
    PredState.choicesInstances.tbScorer = new Choices(tbEl, choicesConfig);
  }
}

function populateSelect(el, items) {
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item;
    el.appendChild(opt);
  });
}

// ── WIZARD NAVIGATION ────────────────────────────────────────────────
function wizardNext(currentStep) {
  if (!validateStep(currentStep)) return;
  goToStep(currentStep + 1);
}

function wizardPrev(currentStep) {
  goToStep(currentStep - 1);
}

function goToStep(targetStep) {
  const current = document.getElementById(`wizardStep${PredState.currentStep}`);
  const target  = document.getElementById(`wizardStep${targetStep}`);
  if (!target) return;

  if (current) {
    current.classList.remove('active-step');
    current.style.animation = 'fadeInDown 0.3s ease reverse forwards';
    setTimeout(() => { current.style.animation = ''; }, 300);
  }

  PredState.currentStep = targetStep;
  target.classList.add('active-step');
  target.style.animation = 'fadeInUp 0.4s ease forwards';

  updateProgressBar(targetStep);
  window.scrollTo({ top: document.getElementById('section-predict')?.offsetTop - 80 || 0, behavior: 'smooth' });

  // If going to review step, build the review
  if (targetStep === 4) buildReview();
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────
function updateProgressBar(step) {
  const pct   = Math.round(((step - 1) / 4) * 100);
  const fill  = document.getElementById('progressBarFill');
  const text  = document.getElementById('progressText');
  const labels = ['', 'Your Details', 'Tournament Predictions', 'Individual Awards', 'Review & Submit'];
  const steps  = document.querySelectorAll('.prog-step');
  const lines  = document.querySelectorAll('.prog-line');

  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = `STEP ${step} OF 4 — ${labels[step]}`;

  steps.forEach((s, i) => {
    s.classList.remove('active', 'completed');
    if (i + 1 === step)    s.classList.add('active');
    if (i + 1 < step)      s.classList.add('completed');
  });
  lines.forEach((l, i) => {
    l.classList.toggle('completed', i < step - 1);
  });
}

// ── VALIDATION ───────────────────────────────────────────────────────
function validateStep(step) {
  clearAllErrors();
  let valid = true;

  if (step === 1) {
    const name  = document.getElementById('fullName')?.value.trim()  || '';
    const age   = parseInt(document.getElementById('age')?.value)     || 0;
    const house = document.getElementById('houseName')?.value.trim()  || '';
    const ward  = document.getElementById('ward')?.value              || '';
    const phone = document.getElementById('phone')?.value.trim()      || '';

    if (!name)              { showError('fullNameErr', 'Please enter your full name.'); valid = false; }
    if (!age || age < 5 || age > 100) { showError('ageErr', 'Please enter a valid age (5–100).'); valid = false; }
    if (!house)             { showError('houseNameErr', 'Please enter your house name.'); valid = false; }
    if (!ward)              { showError('wardErr', 'Please select your ward.'); valid = false; }
    if (!phone || !/^[0-9]{10}$/.test(phone)) { showError('phoneErr', 'Please enter a valid 10-digit phone number.'); valid = false; }

    if (valid) {
      PredState.form = {
        fullName: name, age, houseName: house, ward,
        phone, email: document.getElementById('email')?.value.trim() || ''
      };
    }
  }

  if (step === 2) {
    const s = PredState.selections;
    if (s.semifinalists.length < 4) { showError('sfErr', 'Please pick exactly 4 semi-finalists.'); valid = false; }
    if (s.finalists.length < 2)     { showError('finErr', 'Please pick exactly 2 finalists.'); valid = false; }
    if (!s.champion)                 { showError('champErr', 'Please pick the champion.'); valid = false; }
    if (!s.runnerUp)                 { showError('ruErr', 'Please pick the runner-up.'); valid = false; }
    if (!s.thirdPlace)               { showError('thirdErr', 'Please pick the 3rd place team.'); valid = false; }
  }

  if (step === 3) {
    const boot  = document.getElementById('goldenBoot')?.value  || '';
    const ball  = document.getElementById('goldenBall')?.value  || '';
    const glove = document.getElementById('goldenGlove')?.value || '';
    const goals = document.getElementById('tbGoals')?.value     || '';

    if (!boot)  { showError('goldenBootErr',  'Please select the Golden Boot winner.'); valid = false; }
    if (!ball)  { showError('goldenBallErr',  'Please select the Golden Ball winner.'); valid = false; }
    if (!glove) { showError('goldenGloveErr', 'Please select the Golden Glove winner.'); valid = false; }
    if (!goals || isNaN(parseInt(goals))) { showError('tbGoalsErr', 'Please enter a number for goals (tie-breaker).'); valid = false; }

    if (valid) {
      PredState.awards = {
        goldenBoot:      boot,
        goldenBall:      ball,
        goldenGlove:     glove,
        tbGoals:         parseInt(goals),
        tbFirstScorer:   document.getElementById('tbFirstScorer')?.value    || '',
        tbFirstMinute:   document.getElementById('tbFirstMinute')?.value    || ''
      };
    }
  }

  if (!valid) {
    // Scroll to first error
    const firstErr = document.querySelector('.field-error.show');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valid;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('show'); }
}
function hideError(id) {
  const el = document.getElementById(id);
  if (el) { el.textContent = ''; el.classList.remove('show'); }
}
function clearAllErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('show');
  });
}

// ── BUILD REVIEW SCREEN ──────────────────────────────────────────────
function buildReview() {
  const s = PredState.selections;
  const f = PredState.form;
  const a = PredState.awards;

  const reviewData = [
    { label: '👤 Full Name',         value: f.fullName },
    { label: '🎂 Age',               value: f.age },
    { label: '🏠 House Name',        value: f.houseName },
    { label: '📍 Ward',              value: f.ward },
    { label: '📞 Phone',             value: f.phone },
    { label: '📧 Email',             value: f.email || '—' },
    { label: '🏆 Champion',          value: teamWithFlag(s.champion) },
    { label: '🥈 Runner-Up',         value: teamWithFlag(s.runnerUp) },
    { label: '🥉 3rd Place',         value: teamWithFlag(s.thirdPlace) },
    { label: '⭐ Finalists',         value: s.finalists.map(teamWithFlag).join(', ') || '—' },
    { label: '🏟️ Semi-finalists',   value: s.semifinalists.map(teamWithFlag).join(', ') || '—' },
    { label: '👟 Golden Boot',       value: a.goldenBoot   || '—' },
    { label: '⚽ Golden Ball',       value: a.goldenBall   || '—' },
    { label: '🧤 Golden Glove',      value: a.goldenGlove  || '—' },
    { label: '🔢 Goals (TB)',        value: a.tbGoals      || '—' },
    { label: '🎯 First Scorer (TB)', value: a.tbFirstScorer  || '—' },
    { label: '⏱️ First Goal Min (TB)', value: a.tbFirstMinute || '—' },
  ];

  const el = document.getElementById('reviewContent');
  if (!el) return;
  el.innerHTML = reviewData.map(item => `
    <div class="review-item">
      <div class="review-item-label">${item.label}</div>
      <div class="review-item-value">${item.value}</div>
    </div>
  `).join('');
}

function teamWithFlag(teamName) {
  if (!teamName) return '—';
  const team = TEAMS.find(t => t.name === teamName);
  return team ? `${team.flag} ${team.name}` : teamName;
}

// ── SUBMIT PREDICTION ────────────────────────────────────────────────
async function submitPrediction() {
  if (PredState.isSubmitting) return;

  if (Date.now() > PREDICTION_DEADLINE) {
    Swal.fire({
      icon: 'error',
      title: 'Contest Closed',
      text: 'The entry deadline has passed. No more predictions can be submitted.',
      confirmButtonText: 'OK'
    });
    showPredictionClosed();
    return;
  }

  // Validate declaration
  const declared = document.getElementById('declarationCheck')?.checked;
  if (!declared) {
    showError('declarationErr', 'Please confirm the declaration to proceed.');
    return;
  }

  PredState.isSubmitting = true;
  const btn = document.getElementById('submitBtn');
  if (btn) btn.classList.add('loading');

  const payload = {
    ...PredState.form,
    ...PredState.selections,
    ...PredState.awards,
    semifinalists: PredState.selections.semifinalists.join(', '),
    finalists:     PredState.selections.finalists.join(', '),
    submittedAt:   new Date().toISOString(),
    timezone:      Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  try {
    const result = await FIFA_API.submitPrediction(payload);

    if (result.success) {
      showSuccessScreen(result.entryId);
    } else if (result.error === 'duplicate') {
      Swal.fire({
        icon: 'error',
        title: 'Already Submitted!',
        html: 'A prediction with this phone number already exists.<br>Only one entry per participant is allowed.',
        confirmButtonText: 'OK',
      });
    } else {
      throw new Error(result.message || 'Submission failed. Please try again.');
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      html: `<p>${err.message || 'Unable to connect. Please check your connection and try again.'}</p>`,
      confirmButtonText: 'Try Again',
    });
  } finally {
    PredState.isSubmitting = false;
    if (btn) btn.classList.remove('loading');
  }
}

// ── SUCCESS SCREEN ───────────────────────────────────────────────────
function showSuccessScreen(entryId) {
  // Hide all wizard steps
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active-step'));

  // Show success
  const success = document.getElementById('wizardSuccess');
  if (success) {
    success.classList.add('active-step');
    success.style.animation = 'zoomIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards';
  }

  // Show entry ID
  const idEl = document.getElementById('successId');
  if (idEl && entryId) idEl.textContent = `Entry ID: ${entryId}`;

  // Trigger confetti
  launchConfetti();

  // Animate success icon
  const icon = document.querySelector('.success-icon');
  if (icon) {
    setTimeout(() => icon.classList.add('animate'), 300);
  }

  // Scroll to top of section
  const section = document.getElementById('section-predict');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function launchConfetti() {
  if (typeof confetti !== 'undefined') {
    // Gold confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#F0D060', '#A88B1E', '#ffffff', '#FFD700']
    });
    setTimeout(() => confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#D4AF37', '#F0D060', '#ffffff']
    }), 300);
    setTimeout(() => confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#D4AF37', '#F0D060', '#ffffff']
    }), 600);
  }
}

// ── EXPOSE ───────────────────────────────────────────────────────────
window.toggleTeamSelection = toggleTeamSelection;
window.filterTeams         = filterTeams;
window.wizardNext          = wizardNext;
window.wizardPrev          = wizardPrev;
window.submitPrediction    = submitPrediction;
window.TEAMS               = TEAMS;
window.PLAYERS             = PLAYERS;
window.GOALKEEPERS         = GOALKEEPERS;
window.PredState           = PredState;

// Cascade visibility logic
function deselectTeam(teamName, type) {
  const selectionKey = {
    SF:    'semifinalists',
    Fin:   'finalists',
    Champ: 'champion',
    RU:    'runnerUp',
    Third: 'thirdPlace'
  }[type];
  
  const isSingle = (type === 'Champ' || type === 'RU' || type === 'Third');
  
  if (isSingle) {
    if (PredState.selections[selectionKey] === teamName) {
      PredState.selections[selectionKey] = null;
    }
  } else {
    const arr = PredState.selections[selectionKey];
    if (arr) {
      const idx = arr.indexOf(teamName);
      if (idx > -1) arr.splice(idx, 1);
    }
  }
  
  const card = document.querySelector('#teamsGrid' + type + ' .team-card[data-team="' + teamName + '"]');
  if (card) card.classList.remove('selected');
  updateCounters();
}

function updateDependentGrids() {
  const s = PredState.selections;

  document.querySelectorAll('#teamsGridFin .team-card, #teamsGridThird .team-card').forEach(card => {
    const team = card.getAttribute('data-team');
    if (s.semifinalists.includes(team)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
      if (card.classList.contains('selected')) {
        const type = card.getAttribute('data-type');
        deselectTeam(team, type);
      }
    }
  });

  document.querySelectorAll('#teamsGridChamp .team-card, #teamsGridRU .team-card').forEach(card => {
    const team = card.getAttribute('data-team');
    if (s.finalists.includes(team)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
      if (card.classList.contains('selected')) {
        const type = card.getAttribute('data-type');
        deselectTeam(team, type);
      }
    }
  });
}
