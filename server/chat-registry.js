const {
  matchCountry,
  matchGender,
  matchSexuality,
  resolveProfile,
} = require('./milk-data');

const MAX_REGISTRATIONS = 40;
const pending = new Map();
const registrations = [];

let broadcastFn = () => {};

function setBroadcaster(fn) {
  broadcastFn = fn;
}

function emit(event) {
  broadcastFn({
    registrations: [...registrations],
    pendingCount: pending.size,
    lastEvent: event,
  });
}

function getSnapshot() {
  return {
    registrations: [...registrations],
    pendingCount: pending.size,
    lastEvent: null,
  };
}

function getPending(user) {
  if (!pending.has(user)) {
    pending.set(user, { country: null, gender: null, sexuality: null });
  }
  return pending.get(user);
}

function fieldLabel(field) {
  return { country: 'land', gender: 'geschlecht', sexuality: 'sexualität' }[field] || field;
}

function missingFields(sel) {
  const missing = [];
  if (!sel.country) missing.push('land');
  if (!sel.gender) missing.push('geschlecht');
  if (!sel.sexuality) missing.push('sexualität');
  return missing;
}

function registerUser(user, sel) {
  const profile = resolveProfile(sel.country, sel.gender, sel.sexuality);
  if (!profile) return null;

  const entry = {
    user,
    profile,
    registeredAt: Date.now(),
  };

  const existing = registrations.findIndex((r) => r.user === user);
  if (existing >= 0) registrations.splice(existing, 1);
  registrations.unshift(entry);
  if (registrations.length > MAX_REGISTRATIONS) registrations.pop();

  pending.delete(user);
  return entry;
}

function parseSelectionCommand(comment) {
  const raw = (comment || '').trim();
  const lower = raw.toLowerCase().replace(/^!/, '');

  if (/^(land|country)\s+(.+)/i.test(lower)) {
    const val = lower.replace(/^(land|country)\s+/, '');
    const country = matchCountry(val);
    if (country) return { field: 'country', value: country.code, label: country.sorte, flag: country.flag };
    return { error: `Land „${val}" nicht gefunden` };
  }

  if (/^(geschlecht|gender|geschmack)\s+(.+)/i.test(lower)) {
    const val = lower.replace(/^(geschlecht|gender|geschmack)\s+/, '');
    const gender = matchGender(val);
    if (gender) return { field: 'gender', value: gender.id, label: gender.label };
    return { error: `Geschlecht „${val}" nicht gefunden` };
  }

  if (/^(sexualität|sexualitat|aroma)\s+(.+)/i.test(lower)) {
    const val = lower.replace(/^(sexualität|sexualitat|aroma)\s+/, '');
    const sexuality = matchSexuality(val);
    if (sexuality) return { field: 'sexuality', value: sexuality.label, label: sexuality.label, aroma: sexuality.aroma };
    return { error: `Sexualität „${val}" nicht gefunden` };
  }

  return null;
}

function handleChat(user, comment) {
  const parsed = parseSelectionCommand(comment);
  if (!parsed) return null;

  if (parsed.error) {
    const event = { type: 'hint', user, message: parsed.error };
    emit(event);
    return event;
  }

  const sel = getPending(user);
  sel[parsed.field] = parsed.value;

  const missing = missingFields(sel);
  if (missing.length > 0) {
    const event = {
      type: 'partial',
      user,
      field: parsed.field,
      label: parsed.label,
      missing,
      message: `@${user}: ${fieldLabel(parsed.field)} ✓ — noch: ${missing.join(', ')}`,
    };
    emit(event);
    return event;
  }

  const entry = registerUser(user, sel);
  const event = {
    type: 'registered',
    user,
    profile: entry.profile,
    message: `@${user} registriert für ${entry.profile.flag} ${entry.profile.sorte} · ${entry.profile.gender} · ${entry.profile.sexuality}`,
  };
  emit(event);
  return event;
}

function registerFromApp(user, country, gender, sexuality) {
  const entry = registerUser(user, { country, gender, sexuality });
  if (!entry) return null;
  const event = {
    type: 'registered',
    user,
    profile: entry.profile,
    message: `@${user} registriert für ${entry.profile.flag} ${entry.profile.sorte} · ${entry.profile.gender} · ${entry.profile.sexuality}`,
  };
  emit(event);
  return event;
}

module.exports = {
  setBroadcaster,
  getSnapshot,
  handleChat,
  registerFromApp,
  parseSelectionCommand,
};
