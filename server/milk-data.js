const GENDER_OPTIONS = [
  { id: 'frauen', label: 'Frau', taste: 'Sanft & mild' },
  { id: 'maenner', label: 'Mann', taste: 'Kräftig & würzig' },
  { id: 'divers', label: 'Divers', taste: 'Vielseitig & leicht' },
];

const SEXUALITY_OPTIONS = [
  { id: 'heterosexuell', label: 'Heterosexuell', aroma: 'Vanille & Honig' },
  { id: 'schwul', label: 'Schwul', aroma: 'Minze & Zitrone' },
  { id: 'lesbisch', label: 'Lesbisch', aroma: 'Bergkräuter & Thymian' },
  { id: 'bisexuell', label: 'Bisexuell', aroma: 'Karamell & Meersalz' },
  { id: 'pansexuell', label: 'Pansexuell', aroma: 'Lavendel & Pfirsich' },
  { id: 'asexuell', label: 'Asexuell', aroma: 'Reine Milchnote' },
  { id: 'demisexuell', label: 'Demisexuell', aroma: 'Gouda & Kräuter' },
  { id: 'queer', label: 'Queer', aroma: 'Stroh & Linde' },
];

const COUNTRIES = [
  { code: 'de', name: 'deutschland', flag: '🇩🇪', sorte: 'Alpen-Milch', aliases: ['de', 'deutschland', 'germany'] },
  { code: 'at', name: 'österreich', flag: '🇦🇹', sorte: 'Almen-Milch', aliases: ['at', 'österreich', 'austria'] },
  { code: 'ch', name: 'schweiz', flag: '🇨🇭', sorte: 'Edel-Milch', aliases: ['ch', 'schweiz', 'swiss'] },
  { code: 'it', name: 'italien', flag: '🇮🇹', sorte: 'Espresso-Milch', aliases: ['it', 'italien', 'italy'] },
  { code: 'fr', name: 'frankreich', flag: '🇫🇷', sorte: 'Crème-Milch', aliases: ['fr', 'frankreich', 'france'] },
  { code: 'es', name: 'spanien', flag: '🇪🇸', sorte: 'Sierra-Milch', aliases: ['es', 'spanien', 'spain'] },
  { code: 'nl', name: 'niederlande', flag: '🇳🇱', sorte: 'Käse-Milch', aliases: ['nl', 'niederlande', 'holland'] },
  { code: 'pl', name: 'polen', flag: '🇵🇱', sorte: 'Wiesen-Milch', aliases: ['pl', 'polen', 'poland'] },
];

const GENDER_ALIASES = {
  frau: 'frauen', frauen: 'frauen', f: 'frauen', w: 'frauen', weiblich: 'frauen',
  mann: 'maenner', maenner: 'maenner', m: 'maenner', männlich: 'maenner', mannlich: 'maenner',
  divers: 'divers', nonbinary: 'divers', 'non-binär': 'divers', nb: 'divers',
};

function matchCountry(input) {
  const q = input.trim().toLowerCase();
  return COUNTRIES.find((c) => c.aliases.some((a) => a === q || q.includes(a)));
}

function matchGender(input) {
  const q = input.trim().toLowerCase();
  const id = GENDER_ALIASES[q];
  return GENDER_OPTIONS.find((g) => g.id === id);
}

function matchSexuality(input) {
  const q = input.trim().toLowerCase();
  return SEXUALITY_OPTIONS.find(
    (s) => s.id === q || s.label.toLowerCase() === q || s.label.toLowerCase().startsWith(q),
  );
}

function resolveProfile(countryCode, genderId, sexualityLabel) {
  const country = COUNTRIES.find((c) => c.code === countryCode);
  const gender = GENDER_OPTIONS.find((g) => g.id === genderId);
  const sexuality = SEXUALITY_OPTIONS.find((s) => s.label === sexualityLabel);
  if (!country || !gender || !sexuality) return null;
  return {
    country: country.code,
    flag: country.flag,
    sorte: country.sorte,
    countryName: country.name,
    gender: gender.label,
    genderId: gender.id,
    taste: gender.taste,
    sexuality: sexuality.label,
    aroma: sexuality.aroma,
  };
}

module.exports = {
  COUNTRIES,
  GENDER_OPTIONS,
  SEXUALITY_OPTIONS,
  matchCountry,
  matchGender,
  matchSexuality,
  resolveProfile,
};
