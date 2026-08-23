export const CONCEPT = {
  land: { icon: '🌍', title: 'Land = Sorte', text: 'Wähle dein Herkunftsland.' },
  gender: { icon: '⚧️', title: 'Geschlecht = Geschmack', text: 'Bestimmt dein Geschmacksprofil.' },
  sexuality: { icon: '🌈', title: 'Sexualität = Aroma', text: 'Ergänzt dein Aromaprofil.' },
};

export const GENDER_OPTIONS = [
  { id: 'frauen', label: 'Frau', icon: '👩', desc: 'Weibliches Geschmacksprofil' },
  { id: 'maenner', label: 'Mann', icon: '👨', desc: 'Männliches Geschmacksprofil' },
  { id: 'divers', label: 'Divers', icon: '🧑', desc: 'Diverses Geschmacksprofil' },
];

export const SEXUALITY_OPTIONS = [
  { id: 'heterosexuell', label: 'Heterosexuell', aroma: 'Vanille & Honig' },
  { id: 'schwul', label: 'Schwul', aroma: 'Minze & Zitrone' },
  { id: 'lesbisch', label: 'Lesbisch', aroma: 'Bergkräuter & Thymian' },
  { id: 'bisexuell', label: 'Bisexuell', aroma: 'Karamell & Meersalz' },
  { id: 'pansexuell', label: 'Pansexuell', aroma: 'Lavendel & Pfirsich' },
  { id: 'asexuell', label: 'Asexuell', aroma: 'Reine Milchnote' },
  { id: 'demisexuell', label: 'Demisexuell', aroma: 'Gouda & Kräuter' },
  { id: 'queer', label: 'Queer', aroma: 'Stroh & Linde' },
];

const GENDER_TASTE = {
  frauen: 'Sanft & mild',
  maenner: 'Kräftig & würzig',
  divers: 'Vielseitig & leicht',
};

export const COUNTRIES = [
  { code: 'de', name: 'Deutschland', flag: '🇩🇪', sorte: 'Alpen-Milch', tagline: 'Mild, nussig, zuverlässig' },
  { code: 'at', name: 'Österreich', flag: '🇦🇹', sorte: 'Almen-Milch', tagline: 'Alpin, herb, charaktervoll' },
  { code: 'ch', name: 'Schweiz', flag: '🇨🇭', sorte: 'Edel-Milch', tagline: 'Premium, samtig, klar' },
  { code: 'it', name: 'Italien', flag: '🇮🇹', sorte: 'Espresso-Milch', tagline: 'Intensiv, sonnig, warm' },
  { code: 'fr', name: 'Frankreich', flag: '🇫🇷', sorte: 'Crème-Milch', tagline: 'Elegant, floral, fein' },
  { code: 'es', name: 'Spanien', flag: '🇪🇸', sorte: 'Sierra-Milch', tagline: 'Feurig, spritzig, lebendig' },
  { code: 'nl', name: 'Niederlande', flag: '🇳🇱', sorte: 'Käse-Milch', tagline: 'Sanft, käsig, ehrlich' },
  { code: 'pl', name: 'Polen', flag: '🇵🇱', sorte: 'Wiesen-Milch', tagline: 'Wiesig, erdig, rustikal' },
];

export const PROFILES = [
  { id: 'de-f1', country: 'de', name: 'Lea M.', age: 27, gender: 'Frau', sexuality: 'Heterosexuell', taste: 'Sanft-nussig', aroma: 'Vanille & Honig', bio: 'Berlin — milde Sorten mit warmem Abgang.', vibe: 'Warm & cozy' },
  { id: 'de-m1', country: 'de', name: 'Jonas K.', age: 31, gender: 'Mann', sexuality: 'Schwul', taste: 'Kräuterig-frisch', aroma: 'Minze & Zitrone', bio: 'Hamburg — klare, leichte Profile.', vibe: 'Fresh & clean' },
  { id: 'de-f2', country: 'de', name: 'Sam R.', age: 24, gender: 'Nicht-binär', sexuality: 'Pansexuell', taste: 'Blumig-leicht', aroma: 'Lavendel & Pfirsich', bio: 'Köln — vielseitige Nuancen.', vibe: 'Playful & soft' },
  { id: 'de-m2', country: 'de', name: 'Tim W.', age: 29, gender: 'Mann', sexuality: 'Bisexuell', taste: 'Cremig-ausgewogen', aroma: 'Karamell & Meersalz', bio: 'München — ausgewogene Noten.', vibe: 'Balanced & smooth' },
  { id: 'at-f1', country: 'at', name: 'Hannah S.', age: 26, gender: 'Frau', sexuality: 'Lesbisch', taste: 'Alpin-herb', aroma: 'Bergkräuter & Thymian', bio: 'Salzburg — Sorte mit Charakter.', vibe: 'Bold & alpine' },
  { id: 'at-m1', country: 'at', name: 'Felix H.', age: 33, gender: 'Mann', sexuality: 'Heterosexuell', taste: 'Würzig-tief', aroma: 'Rauch & Walnuss', bio: 'Graz — dunkle, reife Profile.', vibe: 'Deep & smoky' },
  { id: 'ch-f1', country: 'ch', name: 'Noemi B.', age: 30, gender: 'Frau', sexuality: 'Asexuell', taste: 'Rein & klar', aroma: 'Reine Milchnote', bio: 'Zürich — Fokus auf Klarheit.', vibe: 'Pure & calm' },
  { id: 'ch-m1', country: 'ch', name: 'Marco L.', age: 35, gender: 'Mann', sexuality: 'Schwul', taste: 'Edel-samtig', aroma: 'Trüffel & Sahne', bio: 'Genf — Premium-Textur.', vibe: 'Luxury & rich' },
  { id: 'it-f1', country: 'it', name: 'Giulia F.', age: 28, gender: 'Frau', sexuality: 'Heterosexuell', taste: 'Intensiv-sonnig', aroma: 'Espresso & Kakao', bio: 'Mailand — mediterrane Stärke.', vibe: 'Sunny & intense' },
  { id: 'it-m1', country: 'it', name: 'Luca P.', age: 32, gender: 'Mann', sexuality: 'Bisexuell', taste: 'Fruchtig-warm', aroma: 'Feige & Orange', bio: 'Rom — süße Wärme.', vibe: 'Sweet & warm' },
  { id: 'fr-f1', country: 'fr', name: 'Camille D.', age: 29, gender: 'Frau', sexuality: 'Pansexuell', taste: 'Elegant-floral', aroma: 'Rose & Butter', bio: 'Paris — poetische Sorten.', vibe: 'Poetic & floral' },
  { id: 'fr-m1', country: 'fr', name: 'Antoine R.', age: 34, gender: 'Mann', sexuality: 'Schwul', taste: 'Komplex-reif', aroma: 'Brioche & Haselnuss', bio: 'Lyon — französische Eleganz.', vibe: 'Complex & refined' },
  { id: 'es-f1', country: 'es', name: 'Elena V.', age: 25, gender: 'Frau', sexuality: 'Lesbisch', taste: 'Feurig-spritzig', aroma: 'Zitrus & Chili', bio: 'Barcelona — lebendige Sorten.', vibe: 'Spicy & bright' },
  { id: 'es-m1', country: 'es', name: 'Diego A.', age: 30, gender: 'Mann', sexuality: 'Heterosexuell', taste: 'Rauchig-süß', aroma: 'Paprika & Dattel', bio: 'Madrid — tapas-inspiriert.', vibe: 'Smoky & sweet' },
  { id: 'nl-f1', country: 'nl', name: 'Femke J.', age: 27, gender: 'Frau', sexuality: 'Demisexuell', taste: 'Sanft-käsig', aroma: 'Gouda & Kräuter', bio: 'Amsterdam — Verbindung & Tiefe.', vibe: 'Cheesy & gentle' },
  { id: 'nl-m1', country: 'nl', name: 'Daan V.', age: 28, gender: 'Mann', sexuality: 'Queer', taste: 'Modern-klar', aroma: 'Stroh & Linde', bio: 'Rotterdam — frisch & ehrlich.', vibe: 'Modern & honest' },
  { id: 'pl-f1', country: 'pl', name: 'Zofia K.', age: 26, gender: 'Frau', sexuality: 'Heterosexuell', taste: 'Wiesig-erdig', aroma: 'Heu & Brombeere', bio: 'Krakau — naturnahe Sorten.', vibe: 'Earthy & wild' },
  { id: 'pl-m1', country: 'pl', name: 'Kacper N.', age: 31, gender: 'Mann', sexuality: 'Schwul', taste: 'Kräftig-rustikal', aroma: 'Roggen & Honig', bio: 'Warschau — bodenständig.', vibe: 'Rustic & strong' },
];

const SELECTION_KEY = 'gtm-wizard-selection';
const MATCHES_KEY = 'gtm-matches';
const SWIPED_KEY = 'gtm-swiped';

function matchGender(profile, genderKey) {
  if (genderKey === 'frauen') return profile.gender === 'Frau';
  if (genderKey === 'maenner') return profile.gender === 'Mann';
  if (genderKey === 'divers') return profile.gender !== 'Frau' && profile.gender !== 'Mann';
  return true;
}

export function profileGenderKey(profile) {
  if (profile.gender === 'Frau') return 'frauen';
  if (profile.gender === 'Mann') return 'maenner';
  return 'divers';
}

export function profileToSelection(profile) {
  return {
    country: profile.country,
    gender: profileGenderKey(profile),
    sexuality: profile.sexuality,
    profileId: profile.id,
  };
}

export function getCountry(code) {
  return COUNTRIES.find((c) => c.code === code);
}

export function getGenderOption(id) {
  return GENDER_OPTIONS.find((g) => g.id === id);
}

export function getProfileById(id) {
  return PROFILES.find((p) => p.id === id);
}

export function getProfilesByCountry(code) {
  return PROFILES.filter((p) => p.country === code);
}

export function getProfilesForSelection(country, genderKey) {
  return PROFILES.filter((p) => p.country === country && matchGender(p, genderKey));
}

export function getSexualityOptions() {
  return SEXUALITY_OPTIONS;
}

export function findProfile(country, genderKey, sexuality) {
  return PROFILES.find(
    (p) => p.country === country && matchGender(p, genderKey) && p.sexuality === sexuality,
  );
}

function getTasteFor(country, genderKey) {
  const peers = getProfilesForSelection(country, genderKey);
  if (peers.length) return peers[0].taste;
  return GENDER_TASTE[genderKey] ?? 'Ausgewogen';
}

function getAromaForSexuality(sexuality) {
  const option = SEXUALITY_OPTIONS.find((o) => o.label === sexuality);
  return option?.aroma ?? 'Reine Milchnote';
}

export function resolveMilkProfile(country, genderKey, sexuality) {
  const existing = findProfile(country, genderKey, sexuality);
  if (existing) return existing;

  const countryData = getCountry(country);
  const genderData = getGenderOption(genderKey);
  return {
    id: `${country}-${genderKey}-${sexuality}`,
    country,
    gender: genderData?.label ?? genderKey,
    sexuality,
    taste: getTasteFor(country, genderKey),
    aroma: getAromaForSexuality(sexuality),
    sorte: countryData?.sorte ?? 'Milch',
  };
}

export function saveSelection(data) {
  localStorage.setItem(SELECTION_KEY, JSON.stringify(data));
}

export function getSelection() {
  try {
    return JSON.parse(localStorage.getItem(SELECTION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function clearSelection() {
  localStorage.removeItem(SELECTION_KEY);
}

export function getMatches() {
  try {
    return JSON.parse(localStorage.getItem(MATCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveMatch(profileId) {
  const matches = getMatches();
  if (!matches.includes(profileId)) {
    matches.push(profileId);
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  }
}

export function getSwipedIds() {
  try {
    return JSON.parse(localStorage.getItem(SWIPED_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveSwiped(profileId) {
  const swiped = getSwipedIds();
  if (!swiped.includes(profileId)) {
    swiped.push(profileId);
    localStorage.setItem(SWIPED_KEY, JSON.stringify(swiped));
  }
}

export function getUnswipedProfiles() {
  const swiped = new Set(getSwipedIds());
  return PROFILES.filter((p) => !swiped.has(p.id));
}

export function getStreamState() {
  try {
    return JSON.parse(localStorage.getItem('gtm-stream-state') || '{"fill":0,"likes":0,"drunk":0}');
  } catch {
    return { fill: 0, likes: 0, drunk: 0 };
  }
}

export function saveStreamState(state) {
  localStorage.setItem('gtm-stream-state', JSON.stringify(state));
}

export function resetStreamState() {
  saveStreamState({ fill: 0, likes: 0, drunk: 0 });
}
