/* =========================================================================
 * store.js — Local persistence + authentication
 *
 * GitHub Pages is static: there is no server or database. Everything lives
 * in the browser's localStorage. Passwords are never stored in plain text —
 * they are hashed with PBKDF2-SHA256 (150k iterations) + a random salt via
 * the Web Crypto API. This is reasonable for a local-only app, but note:
 * data is tied to THIS browser/device and is readable by anyone with access
 * to it. For true cross-device sync or email reset you'd need a backend.
 * ========================================================================= */

const USERS_KEY = 'fittrack_users';
const SESSION_KEY = 'fittrack_session';
const dataKey = (u) => `fittrack_data_${u}`;

/* ---------------------- crypto helpers ---------------------- */
const enc = new TextEncoder();

function buf2hex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
function randomSalt(bytes = 16) {
  return buf2hex(crypto.getRandomValues(new Uint8Array(bytes)));
}

async function hash(password, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 150000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return buf2hex(bits);
}

/* ---------------------- raw storage ------------------------- */
function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
  catch { return {}; }
}
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* ---------------------- auth API ---------------------------- */
export const Auth = {
  async register({ username, email, password, securityQuestion, securityAnswer }) {
    username = String(username || '').trim();
    if (!username) throw new Error('Username is required.');
    if (username.length < 3) throw new Error('Username must be at least 3 characters.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');

    const users = readUsers();
    if (users[username.toLowerCase()]) throw new Error('That username is already taken.');

    const salt = randomSalt();
    const passHash = await hash(password, salt);

    let secSalt = '', secHash = '';
    if (securityAnswer) {
      secSalt = randomSalt();
      secHash = await hash(securityAnswer.trim().toLowerCase(), secSalt);
    }

    users[username.toLowerCase()] = {
      username, email: String(email || '').trim(),
      salt, passHash,
      securityQuestion: securityQuestion || '', secSalt, secHash,
      createdAt: Date.now(),
    };
    writeUsers(users);
    return this.login({ username, password });
  },

  async login({ username, password }) {
    const users = readUsers();
    const u = users[String(username).trim().toLowerCase()];
    if (!u) throw new Error('No account with that username.');
    const h = await hash(password, u.salt);
    if (h !== u.passHash) throw new Error('Incorrect password.');
    localStorage.setItem(SESSION_KEY, u.username);
    return u.username;
  },

  /** Verify security answer and set a new password. */
  async resetPassword({ username, securityAnswer, newPassword }) {
    const users = readUsers();
    const key = String(username).trim().toLowerCase();
    const u = users[key];
    if (!u) throw new Error('No account with that username.');
    if (!u.secHash) throw new Error('This account has no security question set, so it cannot be recovered.');
    const h = await hash(String(securityAnswer).trim().toLowerCase(), u.secSalt);
    if (h !== u.secHash) throw new Error('Security answer is incorrect.');
    if (!newPassword || newPassword.length < 6) throw new Error('New password must be at least 6 characters.');
    u.salt = randomSalt();
    u.passHash = await hash(newPassword, u.salt);
    users[key] = u;
    writeUsers(users);
    return true;
  },

  getSecurityQuestion(username) {
    const u = readUsers()[String(username).trim().toLowerCase()];
    return u ? u.securityQuestion : null;
  },

  current() { return localStorage.getItem(SESSION_KEY); },
  logout() { localStorage.removeItem(SESSION_KEY); },
  getEmail(username) {
    const u = readUsers()[String(username).trim().toLowerCase()];
    return u ? u.email : '';
  },
};

/* ---------------------- per-user data ----------------------- */
const EMPTY_DATA = () => ({
  profile: null,          // {weightKg,heightCm,age,sex,activity,goal,targetWeight,program}
  weightLog: [],          // [{date, kg}]
  workouts: [],           // [{id,date,name,exercises:[{name,sets:[{weight,reps}]}],notes}]
  foods: [],              // [{id,date,meal,name,grams,kcal,p,c,f}]
  water: [],              // [{date, ml}]  (one row per add)
  sleep: [],              // [{id,date,hours,quality,lucid,dream,notes,techniques:[]}]
  settings: { theme: 'dark' },
});

export const Store = {
  load(username = Auth.current()) {
    if (!username) return null;
    try {
      const raw = JSON.parse(localStorage.getItem(dataKey(username)));
      return Object.assign(EMPTY_DATA(), raw || {});
    } catch { return EMPTY_DATA(); }
  },
  save(data, username = Auth.current()) {
    if (!username) return;
    localStorage.setItem(dataKey(username), JSON.stringify(data));
  },
  /** Convenience: mutate via callback then persist. */
  update(fn, username = Auth.current()) {
    const data = this.load(username);
    fn(data);
    this.save(data, username);
    return data;
  },
  export(username = Auth.current()) {
    return JSON.stringify(this.load(username), null, 2);
  },
  import(json, username = Auth.current()) {
    const parsed = JSON.parse(json);
    this.save(Object.assign(EMPTY_DATA(), parsed), username);
  },
};

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const today = () => new Date().toISOString().slice(0, 10);
