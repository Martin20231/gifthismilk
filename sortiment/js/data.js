export const CONCEPT = {
  land: { icon: '🌍', title: 'Land = Sorte', text: 'Das Herkunftsland bestimmt die jeweilige Sorte.' },
  gender: { icon: '⚧️', title: 'Geschlecht = Geschmacksprofil', text: 'Freiwillig angegebene Geschlechtsidentität als geschmackliche Variante.' },
  sexuality: { icon: '🌈', title: 'Sexualität = Aroma', text: 'Freiwillig angegebene Orientierung ergänzt das Aromaprofil.' },
};

export const COUNTRIES = [
  { code: 'de', name: 'Deutschland', flag: '🇩🇪', sorte: 'Alpen-Milch', region: 'Mitteleuropa' },
  { code: 'at', name: 'Österreich', flag: '🇦🇹', sorte: 'Almen-Milch', region: 'Mitteleuropa' },
  { code: 'ch', name: 'Schweiz', flag: '🇨🇭', sorte: 'Edel-Milch', region: 'Mitteleuropa' },
  { code: 'it', name: 'Italien', flag: '🇮🇹', sorte: 'Espresso-Milch', region: 'Südeuropa' },
  { code: 'fr', name: 'Frankreich', flag: '🇫🇷', sorte: 'Crème-Milch', region: 'Westeuropa' },
  { code: 'es', name: 'Spanien', flag: '🇪🇸', sorte: 'Sierra-Milch', region: 'Südeuropa' },
  { code: 'nl', name: 'Niederlande', flag: '🇳🇱', sorte: 'Käse-Milch', region: 'Westeuropa' },
  { code: 'pl', name: 'Polen', flag: '🇵🇱', sorte: 'Wiesen-Milch', region: 'Osteuropa' },
];

export const PROFILES = [
  {
    id: 'de-f1',
    country: 'de',
    name: 'Lea M.',
    age: 27,
    gender: 'Frau',
    sexuality: 'Heterosexuell',
    taste: 'Sanft-nussig',
    aroma: 'Vanille & Honig',
    bio: 'Berlin, Kaffee-Liebhaberin. Mag milde Sorten mit warmem Abgang.',
  },
  {
    id: 'de-m1',
    country: 'de',
    name: 'Jonas K.',
    age: 31,
    gender: 'Mann',
    sexuality: 'Schwul',
    taste: 'Kräuterig-frisch',
    aroma: 'Minze & Zitrone',
    bio: 'Hamburg, Outdoor-Fan. Bevorzugt klare, leichte Profile.',
  },
  {
    id: 'de-f2',
    country: 'de',
    name: 'Sam R.',
    age: 24,
    gender: 'Nicht-binär',
    sexuality: 'Pansexuell',
    taste: 'Blumig-leicht',
    aroma: 'Lavendel & Pfirsich',
    bio: 'Köln, Kreativschaffende*r. Mixt gerne verschiedene Nuancen.',
  },
  {
    id: 'de-m2',
    country: 'de',
    name: 'Tim W.',
    age: 29,
    gender: 'Mann',
    sexuality: 'Bisexuell',
    taste: 'Cremig-ausgewogen',
    aroma: 'Karamell & Meersalz',
    bio: 'München, Food-Blogger. Liebt vielseitige Geschmacksnoten.',
  },
  {
    id: 'at-f1',
    country: 'at',
    name: 'Hannah S.',
    age: 26,
    gender: 'Frau',
    sexuality: 'Lesbisch',
    taste: 'Alpin-herb',
    aroma: 'Bergkräuter & Thymian',
    bio: 'Salzburg, Bergwandern ist Pflicht. Sorte mit Charakter.',
  },
  {
    id: 'at-m1',
    country: 'at',
    name: 'Felix H.',
    age: 33,
    gender: 'Mann',
    sexuality: 'Heterosexuell',
    taste: 'Würzig-tief',
    aroma: 'Rauch & Walnuss',
    bio: 'Graz, Musiker. Dunklere Profile mit langer Note.',
  },
  {
    id: 'ch-f1',
    country: 'ch',
    name: 'Noemi B.',
    age: 30,
    gender: 'Frau',
    sexuality: 'Asexuell',
    taste: 'Rein & minimalistisch',
    aroma: 'Reine Milchnote',
    bio: 'Zürich, Minimalistin. Weniger ist mehr — Fokus auf Klarheit.',
  },
  {
    id: 'ch-m1',
    country: 'ch',
    name: 'Marco L.',
    age: 35,
    gender: 'Mann',
    sexuality: 'Schwul',
    taste: 'Edel-samtig',
    aroma: 'Trüffel & Sahne',
    bio: 'Genf, Sommelier. Premium-Sorten mit feiner Textur.',
  },
  {
    id: 'it-f1',
    country: 'it',
    name: 'Giulia F.',
    age: 28,
    gender: 'Frau',
    sexuality: 'Heterosexuell',
    taste: 'Intensiv-sonnig',
    aroma: 'Espresso & Kakao',
    bio: 'Mailand, Barista. Starke, mediterrane Profile.',
  },
  {
    id: 'it-m1',
    country: 'it',
    name: 'Luca P.',
    age: 32,
    gender: 'Mann',
    sexuality: 'Bisexuell',
    taste: 'Fruchtig-warm',
    aroma: 'Feige & Orange',
    bio: 'Rom, Designer. Süße Wärme mit italienischem Flair.',
  },
  {
    id: 'fr-f1',
    country: 'fr',
    name: 'Camille D.',
    age: 29,
    gender: 'Frau',
    sexuality: 'Pansexuell',
    taste: 'Elegant-floral',
    aroma: 'Rose & Butter',
    bio: 'Paris, Autorin. Poetische Sorten mit weichem Finish.',
  },
  {
    id: 'fr-m1',
    country: 'fr',
    name: 'Antoine R.',
    age: 34,
    gender: 'Mann',
    sexuality: 'Schwul',
    taste: 'Komplex-reif',
    aroma: 'Brioche & Haselnuss',
    bio: 'Lyon, Bäcker. Reife Profile mit französischer Eleganz.',
  },
  {
    id: 'es-f1',
    country: 'es',
    name: 'Elena V.',
    age: 25,
    gender: 'Frau',
    sexuality: 'Lesbisch',
    taste: 'Feurig-spritzig',
    aroma: 'Zitrus & Chili',
    bio: 'Barcelona, Tänzerin. Lebendige Sorten mit Kick.',
  },
  {
    id: 'es-m1',
    country: 'es',
    name: 'Diego A.',
    age: 30,
    gender: 'Mann',
    sexuality: 'Heterosexuell',
    taste: 'Rauchig-süß',
    aroma: 'Paprika & Dattel',
    bio: 'Madrid, Koch. Tapas-inspirierte Aromen.',
  },
  {
    id: 'nl-f1',
    country: 'nl',
    name: 'Femke J.',
    age: 27,
    gender: 'Frau',
    sexuality: 'Demisexuell',
    taste: 'Sanft-käsig',
    aroma: 'Gouda & Kräuter',
    bio: 'Amsterdam, Illustratorin. Verbindet Nähe mit Tiefe.',
  },
  {
    id: 'nl-m1',
    country: 'nl',
    name: 'Daan V.',
    age: 28,
    gender: 'Mann',
    sexuality: 'Queer',
    taste: 'Modern-klar',
    aroma: 'Stroh & Linde',
    bio: 'Rotterdam, Urban Farmer. Frische, ehrliche Profile.',
  },
  {
    id: 'pl-f1',
    country: 'pl',
    name: 'Zofia K.',
    age: 26,
    gender: 'Frau',
    sexuality: 'Heterosexuell',
    taste: 'Wiesig-erdig',
    aroma: 'Heu & Brombeere',
    bio: 'Krakau, Botanikerin. Naturnahe Sorten aus dem Osten.',
  },
  {
    id: 'pl-m1',
    country: 'pl',
    name: 'Kacper N.',
    age: 31,
    gender: 'Mann',
    sexuality: 'Schwul',
    taste: 'Kräftig-rustikal',
    aroma: 'Roggen & Honig',
    bio: 'Warschau, Architekt. Bodenständig mit Tiefgang.',
  },
];

export function getCountry(code) {
  return COUNTRIES.find((c) => c.code === code);
}

export function getProfilesByCountry(code, genderFilter = 'all') {
  return PROFILES.filter((p) => {
    if (p.country !== code) return false;
    if (genderFilter === 'all') return true;
    if (genderFilter === 'frauen') return p.gender === 'Frau';
    if (genderFilter === 'maenner') return p.gender === 'Mann';
    if (genderFilter === 'divers') return p.gender !== 'Frau' && p.gender !== 'Mann';
    return true;
  });
}

export function getProfile(id) {
  return PROFILES.find((p) => p.id === id);
}

export function buildMilkProduct(profile) {
  const country = getCountry(profile.country);
  return {
    id: profile.id,
    label: `${profile.name} Milch™`,
    sorte: country.sorte,
    land: `${country.flag} ${country.name}`,
    geschmack: profile.taste,
    aroma: profile.aroma,
    createdAt: Date.now(),
  };
}

const STORAGE_KEY = 'gif-this-milk-sammlung';

export function saveToCollection(profileId) {
  const profile = getProfile(profileId);
  if (!profile) return null;
  const product = buildMilkProduct(profile);
  const list = getCollection().filter((p) => p.id !== profileId);
  list.unshift(product);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
  return product;
}

export function getCollection() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
