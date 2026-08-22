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

export const COUNTRIES = [
  { code: 'de', name: 'Deutschland', flag: '🇩🇪', sorte: 'Alpen-Milch' },
  { code: 'at', name: 'Österreich', flag: '🇦🇹', sorte: 'Almen-Milch' },
  { code: 'ch', name: 'Schweiz', flag: '🇨🇭', sorte: 'Edel-Milch' },
  { code: 'it', name: 'Italien', flag: '🇮🇹', sorte: 'Espresso-Milch' },
  { code: 'fr', name: 'Frankreich', flag: '🇫🇷', sorte: 'Crème-Milch' },
  { code: 'es', name: 'Spanien', flag: '🇪🇸', sorte: 'Sierra-Milch' },
  { code: 'nl', name: 'Niederlande', flag: '🇳🇱', sorte: 'Käse-Milch' },
  { code: 'pl', name: 'Polen', flag: '🇵🇱', sorte: 'Wiesen-Milch' },
];

export const PROFILES = [
  { id: 'de-f1', country: 'de', name: 'Lea M.', age: 27, gender: 'Frau', sexuality: 'Heterosexuell', taste: 'Sanft-nussig', aroma: 'Vanille & Honig', bio: 'Berlin — milde Sorten mit warmem Abgang.' },
  { id: 'de-m1', country: 'de', name: 'Jonas K.', age: 31, gender: 'Mann', sexuality: 'Schwul', taste: 'Kräuterig-frisch', aroma: 'Minze & Zitrone', bio: 'Hamburg — klare, leichte Profile.' },
  { id: 'de-f2', country: 'de', name: 'Sam R.', age: 24, gender: 'Nicht-binär', sexuality: 'Pansexuell', taste: 'Blumig-leicht', aroma: 'Lavendel & Pfirsich', bio: 'Köln — vielseitige Nuancen.' },
  { id: 'de-m2', country: 'de', name: 'Tim W.', age: 29, gender: 'Mann', sexuality: 'Bisexuell', taste: 'Cremig-ausgewogen', aroma: 'Karamell & Meersalz', bio: 'München — ausgewogene Noten.' },
  { id: 'at-f1', country: 'at', name: 'Hannah S.', age: 26, gender: 'Frau', sexuality: 'Lesbisch', taste: 'Alpin-herb', aroma: 'Bergkräuter & Thymian', bio: 'Salzburg — Sorte mit Charakter.' },
  { id: 'at-m1', country: 'at', name: 'Felix H.', age: 33, gender: 'Mann', sexuality: 'Heterosexuell', taste: 'Würzig-tief', aroma: 'Rauch & Walnuss', bio: 'Graz — dunkle, reife Profile.' },
  { id: 'ch-f1', country: 'ch', name: 'Noemi B.', age: 30, gender: 'Frau', sexuality: 'Asexuell', taste: 'Rein & klar', aroma: 'Reine Milchnote', bio: 'Zürich — Fokus auf Klarheit.' },
  { id: 'ch-m1', country: 'ch', name: 'Marco L.', age: 35, gender: 'Mann', sexuality: 'Schwul', taste: 'Edel-samtig', aroma: 'Trüffel & Sahne', bio: 'Genf — Premium-Textur.' },
  { id: 'it-f1', country: 'it', name: 'Giulia F.', age: 28, gender: 'Frau', sexuality: 'Heterosexuell', taste: 'Intensiv-sonnig', aroma: 'Espresso & Kakao', bio: 'Mailand — mediterrane Stärke.' },
  { id: 'it-m1', country: 'it', name: 'Luca P.', age: 32, gender: 'Mann', sexuality: 'Bisexuell', taste: 'Fruchtig-warm', aroma: 'Feige & Orange', bio: 'Rom — süße Wärme.' },
  { id: 'fr-f1', country: 'fr', name: 'Camille D.', age: 29, gender: 'Frau', sexuality: 'Pansexuell', taste: 'Elegant-floral', aroma: 'Rose & Butter', bio: 'Paris — poetische Sorten.' },
  { id: 'fr-m1', country: 'fr', name: 'Antoine R.', age: 34, gender: 'Mann', sexuality: 'Schwul', taste: 'Komplex-reif', aroma: 'Brioche & Haselnuss', bio: 'Lyon — französische Eleganz.' },
  { id: 'es-f1', country: 'es', name: 'Elena V.', age: 25, gender: 'Frau', sexuality: 'Lesbisch', taste: 'Feurig-spritzig', aroma: 'Zitrus & Chili', bio: 'Barcelona — lebendige Sorten.' },
  { id: 'es-m1', country: 'es', name: 'Diego A.', age: 30, gender: 'Mann', sexuality: 'Heterosexuell', taste: 'Rauchig-süß', aroma: 'Paprika & Dattel', bio: 'Madrid — tapas-inspiriert.' },
  { id: 'nl-f1', country: 'nl', name: 'Femke J.', age: 27, gender: 'Frau', sexuality: 'Demisexuell', taste: 'Sanft-käsig', aroma: 'Gouda & Kräuter', bio: 'Amsterdam — Verbindung & Tiefe.' },
  { id: 'nl-m1', country: 'nl', name: 'Daan V.', age: 28, gender: 'Mann', sexuality: 'Queer', taste: 'Modern-klar', aroma: 'Stroh & Linde', bio: 'Rotterdam — frisch & ehrlich.' },
  { id: 'pl-f1', country: 'pl', name: 'Zofia K.', age: 26, gender: 'Frau', sexuality: 'Heterosexuell', taste: 'Wiesig-erdig', aroma: 'Heu & Brombeere', bio: 'Krakau — naturnahe Sorten.' },
  { id: 'pl-m1', country: 'pl', name: 'Kacper N.', age: 31, gender: 'Mann', sexuality: 'Schwul', taste: 'Kräftig-rustikal', aroma: 'Roggen & Honig', bio: 'Warschau — bodenständig.' },
];

const SELECTION_KEY = 'gtm-wizard-selection';

function matchGender(profile, genderKey) {
  if (genderKey === 'frauen') return profile.gender === 'Frau';
  if (genderKey === 'maenner') return profile.gender === 'Mann';
  if (genderKey === 'divers') return profile.gender !== 'Frau' && profile.gender !== 'Mann';
  return true;
}

export function getCountry(code) {
  return COUNTRIES.find((c) => c.code === code);
}

export function getGenderOption(id) {
  return GENDER_OPTIONS.find((g) => g.id === id);
}

export function getProfilesForSelection(country, genderKey) {
  return PROFILES.filter((p) => p.country === country && matchGender(p, genderKey));
}

export function getSexualityOptions(country, genderKey) {
  return getProfilesForSelection(country, genderKey);
}

export function findProfile(country, genderKey, sexuality) {
  return PROFILES.find(
    (p) => p.country === country && matchGender(p, genderKey) && p.sexuality === sexuality,
  );
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
