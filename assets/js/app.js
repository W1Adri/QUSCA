/* =========================================================================
 * app.js — Application controller: auth, onboarding, routing and views.
 * ========================================================================= */
import { Auth, Store, uid, today } from './store.js';
import * as H from './health.js';
import { el, $, clear, toast, modal, confirmDialog, lineChart, ring, fmtDate } from './ui.js';

const root = () => document.getElementById('app');
let DATA = null;        // current user's data (loaded after login)

/* security questions offered at signup */
const SEC_QUESTIONS = [
  'What was the name of your first pet?',
  'In what city were you born?',
  'What was your childhood nickname?',
  'What is your favorite food?',
  "What was your first school's name?",
];

const LUCID_TECHNIQUES = [
  ['Reality checks', 'Check reality 10+ times a day (push finger through palm, read text twice).'],
  ['Dream journal', 'Write every dream immediately on waking to boost recall.'],
  ['MILD', 'Mnemonic Induction: on waking repeat "next time I dream, I will know I am dreaming".'],
  ['WBTB', 'Wake Back To Bed: wake after ~5h, stay up 20-40 min, return to sleep.'],
  ['WILD', 'Wake Initiated: stay conscious while the body falls asleep.'],
  ['Dream signs', 'Identify recurring dream themes that signal you are dreaming.'],
];

/* ============================ BOOT ============================ */
function boot() {
  const user = Auth.current();
  if (!user) return renderAuth();
  DATA = Store.load(user);
  applyTheme();
  if (!DATA.profile) return renderOnboarding();
  renderApp();
}

function applyTheme() {
  const t = DATA?.settings?.theme || 'dark';
  document.documentElement.dataset.theme = t;
}

/* ============================ AUTH ============================ */
function renderAuth(tab = 'login') {
  document.documentElement.dataset.theme = 'dark';
  const host = clear(root());
  const fields = {};

  const tabBtn = (id, label) => el('button', {
    class: `seg ${tab === id ? 'active' : ''}`,
    onclick: () => renderAuth(id),
  }, label);

  const input = (name, attrs = {}) => {
    const i = el('input', Object.assign({ class: 'input', name }, attrs));
    fields[name] = i;
    return el('label.field', {}, [el('span.field-label', {}, attrs.placeholder || name), i]);
  };

  let form;
  if (tab === 'login') {
    form = el('form.auth-form', { onsubmit: async (e) => {
      e.preventDefault();
      try {
        const u = await Auth.login({ username: fields.username.value, password: fields.password.value });
        toast(`Welcome back, ${u}!`, 'success');
        boot();
      } catch (err) { toast(err.message, 'error'); }
    }}, [
      input('username', { placeholder: 'Username', autocomplete: 'username', required: true }),
      input('password', { placeholder: 'Password', type: 'password', autocomplete: 'current-password', required: true }),
      el('button.btn.btn-primary.btn-block', { type: 'submit' }, 'Log in'),
      el('button.link', { type: 'button', onclick: () => renderAuth('forgot') }, 'Forgot password?'),
    ]);
  } else if (tab === 'register') {
    const secSelect = el('select.input', { name: 'sq' },
      SEC_QUESTIONS.map((q) => el('option', { value: q }, q)));
    fields.sq = secSelect;
    form = el('form.auth-form', { onsubmit: async (e) => {
      e.preventDefault();
      if (fields.password.value !== fields.password2.value) return toast('Passwords do not match.', 'error');
      try {
        const u = await Auth.register({
          username: fields.username.value, email: fields.email.value,
          password: fields.password.value,
          securityQuestion: fields.sq.value, securityAnswer: fields.sa.value,
        });
        toast(`Account created. Welcome, ${u}!`, 'success');
        boot();
      } catch (err) { toast(err.message, 'error'); }
    }}, [
      input('username', { placeholder: 'Username', required: true, minlength: 3 }),
      input('email', { placeholder: 'Email (for your records / future recovery)', type: 'email' }),
      input('password', { placeholder: 'Password (min 6 chars)', type: 'password', required: true, minlength: 6 }),
      input('password2', { placeholder: 'Repeat password', type: 'password', required: true }),
      el('label.field', {}, [el('span.field-label', {}, 'Security question (for password recovery)'), secSelect]),
      input('sa', { placeholder: 'Your answer', required: true }),
      el('button.btn.btn-primary.btn-block', { type: 'submit' }, 'Create account'),
    ]);
  } else { // forgot
    form = el('form.auth-form', { onsubmit: (e) => e.preventDefault() }, [
      input('username', { placeholder: 'Your username', required: true }),
      el('button.btn.btn-ghost.btn-block', { type: 'button', onclick: () => {
        const q = Auth.getSecurityQuestion(fields.username.value);
        if (!q) return toast('Account not found, or no security question set.', 'error');
        $('#sq-display').textContent = q;
        $('#reset-stage').style.display = 'block';
      }}, 'Find my security question'),
      el('div#reset-stage', { style: 'display:none' }, [
        el('p.sq-q', { id: 'sq-display' }, ''),
        input('sa', { placeholder: 'Your answer' }),
        input('newpass', { placeholder: 'New password (min 6 chars)', type: 'password' }),
        el('button.btn.btn-primary.btn-block', { type: 'button', onclick: async () => {
          try {
            await Auth.resetPassword({
              username: fields.username.value, securityAnswer: fields.sa.value, newPassword: fields.newpass.value,
            });
            toast('Password reset! You can now log in.', 'success');
            renderAuth('login');
          } catch (err) { toast(err.message, 'error'); }
        }}, 'Reset password'),
      ]),
      el('button.link', { type: 'button', onclick: () => renderAuth('login') }, '← Back to login'),
    ]);
  }

  host.append(el('div.auth-wrap', {}, [
    el('div.auth-bg'),
    el('div.auth-card', {}, [
      el('div.brand', {}, [el('span.brand-logo', {}, '⟁'), el('span.brand-name', {}, 'ApexFit')]),
      el('p.brand-tag', {}, 'Train. Eat. Recover. Evolve.'),
      tab !== 'forgot' ? el('div.segmented', {}, [tabBtn('login', 'Log in'), tabBtn('register', 'Sign up')]) : null,
      tab === 'forgot' ? el('h2.auth-h', {}, 'Recover password') : null,
      form,
      el('p.auth-note', {}, 'Your data is stored privately in this browser. Nothing is sent to any server.'),
    ]),
  ]));
}

/* ========================= ONBOARDING ========================= */
function renderOnboarding() {
  const host = clear(root());
  const f = {};
  const num = (name, label, attrs = {}) => {
    const i = el('input.input', Object.assign({ name, type: 'number', required: true }, attrs));
    f[name] = i;
    return el('label.field', {}, [el('span.field-label', {}, label), i]);
  };
  const sexSel = el('select.input', {}, [el('option', { value: 'male' }, 'Male'), el('option', { value: 'female' }, 'Female')]);
  const actSel = el('select.input', {}, Object.entries(H.ACTIVITY).map(([k, v]) => el('option', { value: k }, `${v.label} — ${v.desc}`)));
  actSel.value = 'moderate';
  const goalSel = el('select.input', {}, Object.entries(H.GOALS).map(([k, v]) => el('option', { value: k }, v.label)));
  goalSel.value = 'leanbulk';
  const progSel = el('select.input', {}, Object.entries(H.PROGRAMS).map(([k, v]) => el('option', { value: k }, v.name)));
  progSel.value = 'upperLower';

  const form = el('form.onb-form', { onsubmit: (e) => {
    e.preventDefault();
    const profile = {
      weightKg: +f.weightKg.value, heightCm: +f.heightCm.value, age: +f.age.value,
      sex: sexSel.value, activity: actSel.value, goal: goalSel.value, program: progSel.value,
      targetWeight: +f.targetWeight.value || null,
    };
    if (!profile.weightKg || !profile.heightCm || !profile.age) return toast('Please fill all fields.', 'error');
    DATA.profile = profile;
    DATA.weightLog.push({ date: today(), kg: profile.weightKg });
    Store.save(DATA);
    toast('Profile saved — let\'s build your plan!', 'success');
    renderApp();
  }}, [
    el('div.onb-grid', {}, [
      num('weightKg', 'Weight (kg)', { step: '0.1', min: 30, max: 350 }),
      num('heightCm', 'Height (cm)', { step: '0.1', min: 120, max: 250 }),
      num('age', 'Age', { min: 12, max: 100 }),
      el('label.field', {}, [el('span.field-label', {}, 'Sex'), sexSel]),
      el('label.field.span2', {}, [el('span.field-label', {}, 'Activity level'), actSel]),
      el('label.field.span2', {}, [el('span.field-label', {}, 'Primary goal'), goalSel]),
      num('targetWeight', 'Target weight (kg, optional)', { step: '0.1', required: false, min: 30, max: 350 }),
      el('label.field', {}, [el('span.field-label', {}, 'Training program'), progSel]),
    ]),
    el('button.btn.btn-primary.btn-block', { type: 'submit' }, 'Generate my plan →'),
  ]);

  host.append(el('div.onb-wrap', {}, [
    el('div.onb-card', {}, [
      el('h1.onb-title', {}, 'Let\'s set you up'),
      el('p.onb-sub', {}, 'We use the Mifflin-St Jeor equation and ISSN nutrition guidelines to build accurate, personalized targets.'),
      form,
    ]),
  ]));
}

/* ============================ APP SHELL ============================ */
const NAV = [
  ['dashboard', 'Dashboard', '◎'],
  ['training', 'Training', '🏋'],
  ['nutrition', 'Nutrition', '🍽'],
  ['water', 'Water', '💧'],
  ['sleep', 'Sleep & Dreams', '🌙'],
  ['progress', 'Progress', '📈'],
  ['profile', 'Profile', '⚙'],
];

function renderApp() {
  applyTheme();
  const host = clear(root());
  const content = el('main.content', { id: 'view' });

  const navLinks = NAV.map(([id, label, icon]) =>
    el('a.nav-link', { href: `#${id}`, dataset: { route: id } }, [el('span.nav-ico', {}, icon), el('span', {}, label)]));

  const sidebar = el('aside.sidebar', {}, [
    el('div.brand.brand-sm', {}, [el('span.brand-logo', {}, '⟁'), el('span.brand-name', {}, 'ApexFit')]),
    el('nav.nav', {}, navLinks),
    el('div.side-foot', {}, [
      el('div.side-user', {}, [el('span.avatar', {}, Auth.current()[0].toUpperCase()), el('span', {}, Auth.current())]),
      el('button.btn.btn-ghost.btn-sm', { onclick: () => { Auth.logout(); boot(); } }, 'Log out'),
    ]),
  ]);

  host.append(el('div.shell', {}, [sidebar, content]));

  window.onhashchange = route;
  if (!location.hash) location.hash = '#dashboard';
  route();
}

function route() {
  const id = (location.hash.slice(1) || 'dashboard');
  document.querySelectorAll('.nav-link').forEach((a) => a.classList.toggle('active', a.dataset.route === id));
  const view = $('#view');
  if (!view) return;
  clear(view);
  ({
    dashboard: viewDashboard, training: viewTraining, nutrition: viewNutrition,
    water: viewWater, sleep: viewSleep, progress: viewProgress, profile: viewProfile,
  }[id] || viewDashboard)(view);
  view.scrollTop = 0;
}

/* ---------- shared small helpers ---------- */
const card = (title, ...children) => el('section.card', {}, [title ? el('h3.card-h', {}, title) : null, ...children]);
const stat = (label, value, sub) => el('div.stat', {}, [el('div.stat-val', {}, value), el('div.stat-lbl', {}, label), sub ? el('div.stat-sub', {}, sub) : null]);
const sumBy = (arr, fn) => arr.reduce((t, x) => t + (fn(x) || 0), 0);
const byDate = (arr, d) => arr.filter((x) => x.date === d);
const last7 = () => [...Array(7)].map((_, i) => { const dt = new Date(); dt.setDate(dt.getDate() - (6 - i)); return dt.toISOString().slice(0, 10); });
const pageHead = (title, subtitle, action) => el('header.page-head', {}, [el('div', {}, [el('h1.page-title', {}, title), subtitle ? el('p.page-sub', {}, subtitle) : null]), action]);

/* ============================ DASHBOARD ============================ */
function viewDashboard(view) {
  const p = DATA.profile;
  const m = H.macros(p);
  const tc = H.targetCalories(p);
  const d = today();

  const foodToday = byDate(DATA.foods, d);
  const kcalToday = Math.round(sumBy(foodToday, (x) => x.kcal));
  const pToday = Math.round(sumBy(foodToday, (x) => x.p));
  const waterGoal = H.waterGoalMl(p, 1);
  const waterToday = Math.round(sumBy(byDate(DATA.water, d), (x) => x.ml));
  const workedOutToday = byDate(DATA.workouts, d).length > 0;
  const lastSleep = DATA.sleep[DATA.sleep.length - 1];

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  view.append(pageHead(`${greet}, ${Auth.current()} 👋`, new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })));

  view.append(el('div.grid.grid-rings', {}, [
    card('Calories today',
      ring(kcalToday / tc.target, { label: `${kcalToday}`, sub: `/ ${tc.target}`, color: '#5b8cff' }),
      el('p.muted.center', {}, `${Math.max(0, tc.target - kcalToday)} kcal remaining`)),
    card('Protein today',
      ring(pToday / m.protein.g, { label: `${pToday}g`, sub: `/ ${m.protein.g}g`, color: '#ff6b9d' }),
      el('p.muted.center', {}, 'Key driver of muscle growth')),
    card('Water today',
      ring(waterToday / waterGoal, { label: `${(waterToday / 1000).toFixed(1)}L`, sub: `/ ${(waterGoal / 1000).toFixed(1)}L`, color: '#33c4ff' }),
      el('p.muted.center', {}, `${Math.max(0, waterGoal - waterToday)} ml to goal`)),
  ]));

  view.append(el('div.grid.grid-4', {}, [
    card('', stat('Maintenance', `${tc.maintenance}`, 'kcal / TDEE')),
    card('', stat('Daily target', `${tc.target}`, H.GOALS[p.goal].label)),
    card('', stat('Training today', workedOutToday ? '✅ Done' : '— Pending', DATA.workouts.length + ' total sessions')),
    card('', stat('Last sleep', lastSleep ? `${lastSleep.hours}h` : '—', lastSleep ? (lastSleep.lucid ? '🌀 Lucid!' : `Quality ${lastSleep.quality}/5`) : 'No log yet')),
  ]));

  const wl = DATA.weightLog.map((w) => ({ label: fmtDate(w.date), value: w.kg }));
  view.append(card('Weight trend', lineChart(wl, { color: '#37d39b', goal: p.targetWeight })));

  view.append(card('Quick actions', el('div.quick-row', {}, [
    el('a.btn.btn-primary', { href: '#nutrition' }, '+ Log food'),
    el('a.btn.btn-ghost', { href: '#training' }, '+ Log workout'),
    el('a.btn.btn-ghost', { href: '#water' }, '+ Add water'),
    el('a.btn.btn-ghost', { href: '#sleep' }, '+ Log sleep'),
  ])));
}

/* ============================ TRAINING ============================ */
function viewTraining(view) {
  const p = DATA.profile;
  const program = H.PROGRAMS[p.program] || H.PROGRAMS.upperLower;

  view.append(pageHead('Training', 'Log sessions, track strength, and follow your program.',
    el('button.btn.btn-primary', { onclick: () => openWorkoutLogger() }, '+ Log workout')));

  // Program card
  const dayChips = el('div.day-tabs');
  const dayBody = el('div.day-body');
  program.days.forEach((day, i) => {
    dayChips.append(el('button', { class: `chip ${i === 0 ? 'active' : ''}`, onclick: (e) => {
      [...dayChips.children].forEach((c) => c.classList.remove('active'));
      e.target.classList.add('active');
      renderDay(day);
    }}, day.day));
  });
  function renderDay(day) {
    clear(dayBody).append(el('table.tbl', {}, [
      el('thead', {}, el('tr', {}, [el('th', {}, 'Exercise'), el('th', {}, 'Sets x Reps'), el('th', {}, '')])),
      el('tbody', {}, day.exercises.map(([name, sr]) => el('tr', {}, [
        el('td', {}, name), el('td', {}, sr),
        el('td', {}, el('button.link', { onclick: () => openWorkoutLogger(day.day, day.exercises) }, 'Log this')),
      ]))),
    ]));
  }
  renderDay(program.days[0]);
  view.append(card(program.name, el('p.muted', {}, program.desc), dayChips, dayBody));

  // Strength progress per exercise
  const exNames = [...new Set(DATA.workouts.flatMap((w) => w.exercises.map((e) => e.name)))];
  if (exNames.length) {
    const sel = el('select.input.input-inline', {}, exNames.map((n) => el('option', { value: n }, n)));
    const chartHost = el('div');
    const draw = () => {
      const series = [];
      DATA.workouts.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach((w) => {
        w.exercises.filter((e) => e.name === sel.value).forEach((e) => {
          const best = Math.max(0, ...e.sets.map((s) => H.oneRepMax(+s.weight, +s.reps)));
          if (best > 0) series.push({ label: fmtDate(w.date), value: best });
        });
      });
      clear(chartHost).append(lineChart(series, { color: '#ffb648' }));
    };
    sel.addEventListener('change', draw); draw();
    view.append(card('Strength progress (estimated 1RM)', el('div.row-between', {}, [el('span.muted', {}, 'Exercise:'), sel]), chartHost));
  }

  // History
  const hist = DATA.workouts.slice().reverse();
  view.append(card('History', hist.length ? el('div.log-list', {}, hist.map((w) => {
    const vol = H.volume(w.exercises.flatMap((e) => e.sets));
    return el('div.log-item', {}, [
      el('div', {}, [el('div.log-title', {}, `${w.name} · ${fmtDate(w.date)}`),
        el('div.muted.small', {}, `${w.exercises.length} exercises · ${Math.round(vol)} kg total volume`)]),
      el('button.icon-btn', { title: 'Delete', onclick: () => confirmDialog('Delete this workout?', () => {
        DATA.workouts = DATA.workouts.filter((x) => x.id !== w.id); Store.save(DATA); route();
      })}, '🗑'),
    ]);
  })) : el('p.muted', {}, 'No workouts logged yet. Hit "+ Log workout" to start.')));
}

function openWorkoutLogger(prefName = '', prefExercises = null) {
  const nameInput = el('input.input', { value: prefName, placeholder: 'Session name (e.g. Upper A)' });
  const exHost = el('div.ex-host');
  const addExercise = (name = '') => {
    const datalistId = 'exlist';
    const exName = el('input.input', { value: name, placeholder: 'Exercise', list: datalistId });
    const setsHost = el('div.sets-host');
    const addSet = (w = '', r = '') => {
      const wi = el('input.input.input-xs', { type: 'number', value: w, placeholder: 'kg', step: '0.5' });
      const ri = el('input.input.input-xs', { type: 'number', value: r, placeholder: 'reps' });
      const rowEl = el('div.set-row', {}, [wi, el('span.x', {}, '×'), ri,
        el('button.icon-btn', { type: 'button', onclick: () => rowEl.remove() }, '✕')]);
      rowEl._get = () => ({ weight: wi.value, reps: ri.value });
      setsHost.append(rowEl);
    };
    addSet();
    const block = el('div.ex-block', {}, [
      el('div.row-between', {}, [exName, el('button.icon-btn', { type: 'button', onclick: () => block.remove() }, '🗑')]),
      setsHost,
      el('button.btn.btn-ghost.btn-xs', { type: 'button', onclick: () => addSet() }, '+ set'),
    ]);
    block._get = () => ({ name: exName.value.trim(), sets: [...setsHost.children].map((s) => s._get()).filter((s) => s.weight && s.reps) });
    exHost.append(block);
  };
  if (prefExercises) prefExercises.forEach(([n]) => addExercise(n));
  else addExercise();

  const datalist = el('datalist', { id: 'exlist' }, H.COMMON_EXERCISES.map((n) => el('option', { value: n })));

  modal({
    title: 'Log workout',
    body: el('div', {}, [
      datalist, nameInput, exHost,
      el('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: () => addExercise() }, '+ exercise'),
    ]),
    actions: [
      { label: 'Cancel', variant: 'btn-ghost' },
      { label: 'Save workout', variant: 'btn-primary', onClick: () => {
        const exercises = [...exHost.children].map((b) => b._get()).filter((e) => e.name && e.sets.length);
        if (!exercises.length) { toast('Add at least one exercise with a set.', 'error'); return false; }
        DATA.workouts.push({ id: uid(), date: today(), name: nameInput.value.trim() || 'Workout', exercises, notes: '' });
        Store.save(DATA);
        toast('Workout saved 💪', 'success');
        route();
      }},
    ],
  });
}

/* ============================ NUTRITION ============================ */
function viewNutrition(view) {
  const p = DATA.profile;
  const m = H.macros(p);
  const d = today();
  const foodToday = byDate(DATA.foods, d);
  const tot = { kcal: sumBy(foodToday, (x) => x.kcal), p: sumBy(foodToday, (x) => x.p), c: sumBy(foodToday, (x) => x.c), f: sumBy(foodToday, (x) => x.f) };

  view.append(pageHead('Nutrition', 'Science-based targets and meal logging.',
    el('button.btn.btn-primary', { onclick: () => openFoodLogger() }, '+ Log food')));

  // Targets + macro bars
  const bar = (label, val, goal, color) => el('div.macro', {}, [
    el('div.row-between', {}, [el('span', {}, label), el('span.muted', {}, `${Math.round(val)} / ${goal} ${label === 'Calories' ? 'kcal' : 'g'}`)]),
    el('div.bar', {}, el('div.bar-fill', { style: `width:${Math.min(100, (val / goal) * 100)}%;background:${color}` })),
  ]);
  view.append(card('Today vs target',
    bar('Calories', tot.kcal, m.calories, '#5b8cff'),
    bar('Protein', tot.p, m.protein.g, '#ff6b9d'),
    bar('Carbs', tot.c, m.carbs.g, '#ffb648'),
    bar('Fat', tot.f, m.fat.g, '#37d39b'),
  ));

  // Meal plan suggestion
  const splits = [['Breakfast', 0.25], ['Lunch', 0.35], ['Snack', 0.15], ['Dinner', 0.25]];
  view.append(card('Suggested meal plan',
    el('p.muted', {}, `Distribute your ${m.calories} kcal across the day. Aim to hit your ${m.protein.g}g protein target.`),
    el('div.meal-grid', {}, splits.map(([meal, frac]) => el('div.meal-card', {}, [
      el('div.meal-title', {}, meal),
      el('div.meal-kcal', {}, `${Math.round(m.calories * frac)} kcal`),
      el('div.muted.small', {}, `~${Math.round(m.protein.g * frac)}g protein · ${Math.round(m.carbs.g * frac)}g carbs · ${Math.round(m.fat.g * frac)}g fat`),
    ])))));

  // Today's log grouped by meal
  const meals = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
  view.append(card("Today's log", foodToday.length ? el('div', {}, meals.filter((meal) => foodToday.some((x) => x.meal === meal)).map((meal) => {
    const items = foodToday.filter((x) => x.meal === meal);
    return el('div.meal-group', {}, [
      el('div.meal-group-h', {}, [el('span', {}, meal), el('span.muted', {}, `${Math.round(sumBy(items, (x) => x.kcal))} kcal`)]),
      ...items.map((x) => el('div.food-row', {}, [
        el('span', {}, `${x.name} · ${x.grams}g`),
        el('span.muted.small', {}, `${Math.round(x.kcal)} kcal · ${Math.round(x.p)}P ${Math.round(x.c)}C ${Math.round(x.f)}F`),
        el('button.icon-btn', { onclick: () => { DATA.foods = DATA.foods.filter((y) => y.id !== x.id); Store.save(DATA); route(); } }, '✕'),
      ])),
    ]);
  })) : el('p.muted', {}, 'Nothing logged today.')));
}

function openFoodLogger() {
  const mealSel = el('select.input', {}, ['Breakfast', 'Lunch', 'Snack', 'Dinner'].map((x) => el('option', { value: x }, x)));
  const search = el('input.input', { placeholder: 'Search food (e.g. chicken)…', list: 'foodlist' });
  const datalist = el('datalist', { id: 'foodlist' }, H.FOODS.map((f) => el('option', { value: f.name })));
  const grams = el('input.input', { type: 'number', value: 100, placeholder: 'grams', step: '1', min: 1 });
  const preview = el('div.food-preview.muted', {}, 'Pick a food and amount to see macros.');
  const custom = { kcal: el('input.input.input-xs', { type: 'number', placeholder: 'kcal/100g' }), p: el('input.input.input-xs', { type: 'number', placeholder: 'P' }), c: el('input.input.input-xs', { type: 'number', placeholder: 'C' }), f: el('input.input.input-xs', { type: 'number', placeholder: 'F' }) };

  const findFood = () => H.FOODS.find((f) => f.name.toLowerCase() === search.value.trim().toLowerCase());
  const per100 = () => {
    const f = findFood();
    if (f) return f;
    if (custom.kcal.value) return { kcal: +custom.kcal.value, p: +custom.p.value || 0, c: +custom.c.value || 0, f: +custom.f.value || 0 };
    return null;
  };
  const update = () => {
    const base = per100(); const g = +grams.value || 0;
    if (!base || !g) { preview.textContent = 'Pick a food and amount to see macros.'; return; }
    const r = g / 100;
    preview.innerHTML = `<strong>${Math.round(base.kcal * r)} kcal</strong> · ${Math.round(base.p * r)}g protein · ${Math.round(base.c * r)}g carbs · ${Math.round(base.f * r)}g fat`;
  };
  [search, grams, ...Object.values(custom)].forEach((i) => i.addEventListener('input', update));

  modal({
    title: 'Log food',
    body: el('div.stack', {}, [
      datalist, mealSel, search, grams,
      el('details.custom', {}, [el('summary', {}, 'Not in list? Add custom (per 100g)'),
        el('div.row', {}, Object.values(custom))]),
      preview,
    ]),
    actions: [
      { label: 'Cancel', variant: 'btn-ghost' },
      { label: 'Add', variant: 'btn-primary', onClick: () => {
        const base = per100(); const g = +grams.value || 0;
        if (!base || !g) { toast('Choose a food and grams.', 'error'); return false; }
        const r = g / 100;
        const name = findFood()?.name || (search.value.trim() || 'Custom food');
        DATA.foods.push({ id: uid(), date: today(), meal: mealSel.value, name, grams: g, kcal: base.kcal * r, p: base.p * r, c: base.c * r, f: base.f * r });
        Store.save(DATA); toast('Food logged 🍽', 'success'); route();
      }},
    ],
  });
}

/* ============================ WATER ============================ */
function viewWater(view) {
  const p = DATA.profile;
  const goal = H.waterGoalMl(p, 1);
  const d = today();
  const totToday = Math.round(sumBy(byDate(DATA.water, d), (x) => x.ml));

  view.append(pageHead('Water', `Goal: ~${(goal / 1000).toFixed(1)} L/day (35 ml/kg + training).`));

  view.append(el('div.grid.grid-2', {}, [
    card('Today', ring(totToday / goal, { size: 160, label: `${(totToday / 1000).toFixed(2)}L`, sub: `/ ${(goal / 1000).toFixed(1)}L`, color: '#33c4ff' })),
    card('Add water', el('div.water-btns', {}, [
      ...[200, 250, 330, 500].map((ml) => el('button.btn.btn-ghost', { onclick: () => addWater(ml) }, `+${ml} ml`)),
      el('button.btn.btn-primary', { onclick: () => {
        const v = prompt('Custom amount (ml):'); if (v && +v > 0) addWater(+v);
      }}, 'Custom…'),
    ])),
  ]));

  const data = last7().map((dt) => ({ label: fmtDate(dt), value: Math.round(sumBy(byDate(DATA.water, dt), (x) => x.ml)) }));
  view.append(card('Last 7 days (ml)', lineChart(data, { color: '#33c4ff', goal })));

  function addWater(ml) {
    DATA.water.push({ date: today(), ml }); Store.save(DATA);
    toast(`+${ml} ml logged`, 'success'); route();
  }
}

/* ============================ SLEEP ============================ */
function viewSleep(view) {
  view.append(pageHead('Sleep & Dreams', 'Track rest, log dreams, and train lucid dreaming.',
    el('button.btn.btn-primary', { onclick: () => openSleepLogger() }, '+ Log sleep')));

  const last7d = DATA.sleep.slice(-7);
  const avg = last7d.length ? (sumBy(last7d, (x) => x.hours) / last7d.length).toFixed(1) : '—';
  const lucidCount = DATA.sleep.filter((x) => x.lucid).length;

  view.append(el('div.grid.grid-3', {}, [
    card('', stat('Avg sleep (7d)', `${avg}h`, 'Aim for 7-9h')),
    card('', stat('Lucid dreams', `${lucidCount}`, 'total logged')),
    card('', stat('Logs', `${DATA.sleep.length}`, 'nights recorded')),
  ]));

  const chart = DATA.sleep.slice(-14).map((s) => ({ label: fmtDate(s.date), value: s.hours }));
  view.append(card('Sleep duration', lineChart(chart, { color: '#9b8cff', goal: 8 })));

  view.append(card('Lucid dreaming toolkit', el('div.tip-grid', {}, LUCID_TECHNIQUES.map(([t, d]) =>
    el('div.tip', {}, [el('div.tip-t', {}, t), el('div.muted.small', {}, d)])))));

  const journal = DATA.sleep.slice().reverse();
  view.append(card('Dream journal', journal.length ? el('div.journal', {}, journal.map((s) => el('div.journal-item', {}, [
    el('div.row-between', {}, [
      el('div.log-title', {}, `${fmtDate(s.date)} · ${s.hours}h · quality ${s.quality}/5 ${s.lucid ? '🌀 lucid' : ''}`),
      el('button.icon-btn', { onclick: () => confirmDialog('Delete this entry?', () => { DATA.sleep = DATA.sleep.filter((x) => x.id !== s.id); Store.save(DATA); route(); }) }, '🗑'),
    ]),
    s.dream ? el('p.dream', {}, `“${s.dream}”`) : null,
    s.techniques?.length ? el('div.tags', {}, s.techniques.map((t) => el('span.tag', {}, t))) : null,
    s.notes ? el('p.muted.small', {}, `Notes: ${s.notes}`) : null,
  ]))) : el('p.muted', {}, 'No sleep logged yet.')));
}

function openSleepLogger() {
  const dateI = el('input.input', { type: 'date', value: today() });
  const hours = el('input.input', { type: 'number', step: '0.5', value: 8, placeholder: 'hours' });
  const quality = el('input', { type: 'range', min: 1, max: 5, value: 3, class: 'range' });
  const qLabel = el('span.q-val', {}, '3/5');
  quality.addEventListener('input', () => qLabel.textContent = `${quality.value}/5`);
  const lucid = el('input', { type: 'checkbox' });
  const dream = el('textarea.input.area', { placeholder: 'Describe your dream while it\'s fresh…', rows: 4 });
  const notes = el('textarea.input.area', { placeholder: 'Notes, mood, improvements…', rows: 2 });
  const techWrap = el('div.tech-pick', {}, LUCID_TECHNIQUES.map(([t]) => {
    const cb = el('input', { type: 'checkbox', value: t });
    return el('label.tech-opt', {}, [cb, el('span', {}, t)]);
  }));

  modal({
    title: 'Log sleep & dream',
    body: el('div.stack', {}, [
      el('div.row', {}, [el('label.field', {}, [el('span.field-label', {}, 'Date'), dateI]), el('label.field', {}, [el('span.field-label', {}, 'Hours slept'), hours])]),
      el('label.field', {}, [el('span.field-label', {}, ['Sleep quality ', qLabel]), quality]),
      el('label.check', {}, [lucid, el('span', {}, 'I had a lucid dream 🌀')]),
      el('div.field-label', {}, 'Dream journal'), dream,
      el('div.field-label', {}, 'Techniques practiced'), techWrap,
      el('div.field-label', {}, 'Notes / improvements'), notes,
    ]),
    actions: [
      { label: 'Cancel', variant: 'btn-ghost' },
      { label: 'Save', variant: 'btn-primary', onClick: () => {
        const techniques = [...techWrap.querySelectorAll('input:checked')].map((c) => c.value);
        DATA.sleep.push({ id: uid(), date: dateI.value, hours: +hours.value || 0, quality: +quality.value, lucid: lucid.checked, dream: dream.value.trim(), notes: notes.value.trim(), techniques });
        DATA.sleep.sort((a, b) => a.date.localeCompare(b.date));
        Store.save(DATA); toast('Sleep logged 🌙', 'success'); route();
      }},
    ],
  });
}

/* ============================ PROGRESS ============================ */
function viewProgress(view) {
  const p = DATA.profile;
  view.append(pageHead('Progress', 'Body metrics and long-term trends.',
    el('button.btn.btn-primary', { onclick: () => openWeightLogger() }, '+ Log weight')));

  const bmi = H.bmi(p);
  const bf = H.bodyFat(p);
  const range = H.healthyWeightRange(p.heightCm);
  view.append(el('div.grid.grid-4', {}, [
    card('', stat('Current weight', `${p.weightKg} kg`, p.targetWeight ? `Target ${p.targetWeight} kg` : '')),
    card('', stat('BMI', `${bmi.value}`, bmi.category)),
    card('', stat('Body fat (est.)', `${bf}%`, 'Deurenberg estimate')),
    card('', stat('Healthy range', `${range.min}-${range.max}`, 'kg for your height')),
  ]));

  const wl = DATA.weightLog.map((w) => ({ label: fmtDate(w.date), value: w.kg }));
  view.append(card('Body weight', lineChart(wl, { color: '#37d39b', goal: p.targetWeight })));

  // weekly training volume
  const volByDate = {};
  DATA.workouts.forEach((w) => { volByDate[w.date] = (volByDate[w.date] || 0) + H.volume(w.exercises.flatMap((e) => e.sets)); });
  const volData = Object.keys(volByDate).sort().slice(-14).map((dt) => ({ label: fmtDate(dt), value: Math.round(volByDate[dt]) }));
  view.append(card('Training volume per session (kg)', lineChart(volData, { color: '#ffb648' })));

  const wlist = DATA.weightLog.slice().reverse();
  view.append(card('Weight history', el('div.log-list', {}, wlist.map((w) => el('div.log-item', {}, [
    el('span', {}, `${fmtDate(w.date)} — ${w.kg} kg`),
    el('button.icon-btn', { onclick: () => { DATA.weightLog = DATA.weightLog.filter((x) => x !== w); Store.save(DATA); route(); } }, '🗑'),
  ])))));
}

function openWeightLogger() {
  const kg = el('input.input', { type: 'number', step: '0.1', value: DATA.profile.weightKg, placeholder: 'kg' });
  const dateI = el('input.input', { type: 'date', value: today() });
  modal({
    title: 'Log body weight',
    body: el('div.row', {}, [el('label.field', {}, [el('span.field-label', {}, 'Date'), dateI]), el('label.field', {}, [el('span.field-label', {}, 'Weight (kg)'), kg])]),
    actions: [
      { label: 'Cancel', variant: 'btn-ghost' },
      { label: 'Save', variant: 'btn-primary', onClick: () => {
        const v = +kg.value; if (!v) { toast('Enter a weight.', 'error'); return false; }
        DATA.weightLog = DATA.weightLog.filter((w) => w.date !== dateI.value);
        DATA.weightLog.push({ date: dateI.value, kg: v });
        DATA.weightLog.sort((a, b) => a.date.localeCompare(b.date));
        DATA.profile.weightKg = DATA.weightLog[DATA.weightLog.length - 1].kg;
        Store.save(DATA); toast('Weight logged', 'success'); route();
      }},
    ],
  });
}

/* ============================ PROFILE ============================ */
function viewProfile(view) {
  const p = DATA.profile;
  view.append(pageHead('Profile & settings', `Logged in as ${Auth.current()}${Auth.getEmail(Auth.current()) ? ' · ' + Auth.getEmail(Auth.current()) : ''}`));

  const f = {};
  const num = (name, label, val, attrs = {}) => { const i = el('input.input', Object.assign({ type: 'number', value: val }, attrs)); f[name] = i; return el('label.field', {}, [el('span.field-label', {}, label), i]); };
  const sexSel = el('select.input', {}, [el('option', { value: 'male' }, 'Male'), el('option', { value: 'female' }, 'Female')]); sexSel.value = p.sex;
  const actSel = el('select.input', {}, Object.entries(H.ACTIVITY).map(([k, v]) => el('option', { value: k }, v.label))); actSel.value = p.activity;
  const goalSel = el('select.input', {}, Object.entries(H.GOALS).map(([k, v]) => el('option', { value: k }, v.label))); goalSel.value = p.goal;
  const progSel = el('select.input', {}, Object.entries(H.PROGRAMS).map(([k, v]) => el('option', { value: k }, v.name))); progSel.value = p.program;

  view.append(card('Your metrics', el('div.onb-grid', {}, [
    num('weightKg', 'Weight (kg)', p.weightKg, { step: '0.1' }),
    num('heightCm', 'Height (cm)', p.heightCm, { step: '0.1' }),
    num('age', 'Age', p.age),
    el('label.field', {}, [el('span.field-label', {}, 'Sex'), sexSel]),
    el('label.field.span2', {}, [el('span.field-label', {}, 'Activity'), actSel]),
    el('label.field.span2', {}, [el('span.field-label', {}, 'Goal'), goalSel]),
    num('targetWeight', 'Target weight (kg)', p.targetWeight || '', { step: '0.1' }),
    el('label.field', {}, [el('span.field-label', {}, 'Program'), progSel]),
  ]), el('button.btn.btn-primary', { onclick: () => {
    Object.assign(p, { weightKg: +f.weightKg.value, heightCm: +f.heightCm.value, age: +f.age.value, sex: sexSel.value, activity: actSel.value, goal: goalSel.value, program: progSel.value, targetWeight: +f.targetWeight.value || null });
    Store.save(DATA); toast('Profile updated — targets recalculated.', 'success'); route();
  }}, 'Save changes')));

  // Theme
  const themeSel = el('select.input.input-inline', {}, [el('option', { value: 'dark' }, 'Dark'), el('option', { value: 'light' }, 'Light')]);
  themeSel.value = DATA.settings.theme || 'dark';
  themeSel.addEventListener('change', () => { DATA.settings.theme = themeSel.value; Store.save(DATA); applyTheme(); });
  view.append(card('Appearance', el('div.row-between', {}, [el('span', {}, 'Theme'), themeSel])));

  // Data management
  view.append(card('Your data',
    el('p.muted', {}, 'All data is stored locally in this browser. Export a backup, or import it on another device/browser.'),
    el('div.quick-row', {}, [
      el('button.btn.btn-ghost', { onclick: () => {
        const blob = new Blob([Store.export()], { type: 'application/json' });
        const a = el('a', { href: URL.createObjectURL(blob), download: `apexfit-${Auth.current()}-${today()}.json` });
        a.click(); URL.revokeObjectURL(a.href);
      }}, '⬇ Export backup'),
      el('label.btn.btn-ghost', {}, ['⬆ Import backup', el('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: (e) => {
        const file = e.target.files[0]; if (!file) return;
        const r = new FileReader(); r.onload = () => { try { Store.import(r.result); DATA = Store.load(); toast('Backup imported.', 'success'); boot(); } catch { toast('Invalid file.', 'error'); } }; r.readAsText(file);
      }})]),
      el('button.btn.btn-danger', { onclick: () => confirmDialog('Erase ALL your logged data (keeps account)? This cannot be undone.', () => {
        const keepProfile = DATA.profile; DATA = Store.load(); Object.assign(DATA, { weightLog: [], workouts: [], foods: [], water: [], sleep: [] }); DATA.profile = keepProfile; Store.save(DATA); toast('Data cleared.', 'success'); route();
      })}, '🗑 Clear logs'),
    ])));
}

/* ---------------------------------------------------------------- */
boot();
