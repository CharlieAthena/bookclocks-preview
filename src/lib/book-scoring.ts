/**
 * Book Clock Scoring System
 *
 * Ranks books by how good they'd be as book clocks based on:
 * - Publisher (artistic hardback publishers score highest)
 * - Edition keywords (illustrated, collector's, clothbound, etc.)
 * - Page count (thicker books = better for clock mechanisms)
 * - Title/subject (art, photography, classics = better covers)
 */

/* ------------------------------------------------------------------ */
/*  Publishers known for beautiful hardback covers                     */
/* ------------------------------------------------------------------ */

/** Tier 1: Premium art/collector publishers — stunning covers guaranteed */
const TIER1_PUBLISHERS = [
  'taschen',
  'folio society',
  'assouline',
  'phaidon',
  'rizzoli',
  'thames & hudson',
  'thames and hudson',
  'dk publishing',
  'dorling kindersley',
  'national geographic',
  'abrams',
  'prestel',
  'gestalten',
  'laurence king',
  'white lion publishing',
];

/** Tier 2: Beautiful hardback edition lines */
const TIER2_PUBLISHERS = [
  'penguin clothbound',
  'penguin classics',
  'puffin in bloom',
  "everyman's library",
  'everyman library',
  "barnes & noble",
  'barnes and noble',
  'wordsworth collector',
  'macmillan collector',
  'vintage classics',
  'oxford world',
  'penguin english library',
  'penguin deluxe',
  'minalima',
  'coralie bickford',
  'collector\'s library',
  'canterbury classics',
  'knickerbocker classics',
  'leather-bound',
  'leatherbound',
  'gilt-edged',
  'easton press',
  'franklin library',
  'limited editions club',
  'calla editions',
  'chiltern publishing',
  'alma classics',
];

/** Tier 3: Major publishers with good hardback lines */
const TIER3_PUBLISHERS = [
  'penguin',
  'bloomsbury',
  'harpercollins',
  'harper collins',
  'simon & schuster',
  'simon and schuster',
  'random house',
  'macmillan',
  'faber & faber',
  'faber and faber',
  'jonathan cape',
  'hamish hamilton',
  'sceptre',
  'fourth estate',
  'picador',
  'canongate',
  'atlantic books',
  'vintage',
  'particular books',
  'little brown',
  'hodder',
  'michael joseph',
  'doubleday',
  'hutchinson',
  'viking',
  'allen lane',
  'chatto & windus',
  'john murray',
  'orion',
  'weidenfeld',
  'scholastic',
];

/* ------------------------------------------------------------------ */
/*  Edition keywords that suggest beautiful/collectible editions       */
/* ------------------------------------------------------------------ */

const EDITION_KEYWORDS_HIGH = [
  'illustrated',
  'collector',
  'deluxe',
  'clothbound',
  'leather',
  'gilt',
  'special edition',
  'limited edition',
  'anniversary edition',
  'hardcover',
  'hardback',
  'slip case',
  'slipcased',
  'folio',
  'minalima',
  'annotated',
  'complete works',
  'complete collection',
  'compendium',
  'omnibus',
];

const EDITION_KEYWORDS_MEDIUM = [
  'classic',
  'penguin',
  'vintage',
  'oxford',
  'everyman',
  'beautiful',
  'stunning',
  'art of',
  'paintings',
  'photography',
  'visual',
  'atlas',
  'encyclopedia',
  'encyclopaedia',
];

/* ------------------------------------------------------------------ */
/*  Subject keywords that suggest good clock covers                    */
/* ------------------------------------------------------------------ */

const ART_SUBJECTS = [
  'art', 'painting', 'photography', 'illustration', 'design',
  'architecture', 'fashion', 'cinema', 'film', 'music',
  'nature', 'botanical', 'wildlife', 'travel', 'maps',
  'astronomy', 'space', 'ocean', 'garden',
];

/* ------------------------------------------------------------------ */
/*  Scoring function                                                   */
/* ------------------------------------------------------------------ */

export function scoreBookForClock(
  title: string,
  publisher: string | null,
  pages: number | null,
  subjects: string[] = [],
): { score: number; badge: string | null } {
  let score = 30; // base score — every book has some potential
  const reasons: string[] = [];

  const titleLower = title.toLowerCase();
  const pubLower = (publisher || '').toLowerCase();
  const allText = `${titleLower} ${pubLower}`.toLowerCase();

  // --- Publisher scoring ---
  if (TIER1_PUBLISHERS.some((p) => pubLower.includes(p))) {
    score += 35;
    reasons.push('premium');
  } else if (TIER2_PUBLISHERS.some((p) => pubLower.includes(p) || titleLower.includes(p))) {
    score += 25;
    reasons.push('collector');
  } else if (TIER3_PUBLISHERS.some((p) => pubLower.includes(p))) {
    score += 10;
    reasons.push('quality');
  }

  // --- Edition keyword scoring ---
  if (EDITION_KEYWORDS_HIGH.some((kw) => allText.includes(kw))) {
    score += 20;
    reasons.push('edition');
  } else if (EDITION_KEYWORDS_MEDIUM.some((kw) => allText.includes(kw))) {
    score += 10;
  }

  // --- Page count scoring (thicker = better for clock mechanism) ---
  if (pages) {
    if (pages >= 300) {
      score += 10; // thick hardback — perfect
    } else if (pages >= 150) {
      score += 5; // decent thickness
    } else if (pages < 50) {
      score -= 10; // too thin for a clock mechanism
    }
  }

  // --- Subject/title scoring ---
  if (ART_SUBJECTS.some((s) => titleLower.includes(s))) {
    score += 15;
    reasons.push('art');
  }

  // --- Classic literature bonus (likely has beautiful editions available) ---
  const classicAuthors = [
    'shakespeare', 'austen', 'dickens', 'brontë', 'bronte', 'tolkien',
    'wilde', 'shelley', 'stoker', 'homer', 'tolstoy', 'dostoevsky',
    'cervantes', 'hugo', 'dumas', 'poe', 'carroll', 'twain',
    'hardy', 'eliot', 'woolf', 'orwell', 'fitzgerald', 'hemingway',
    'steinbeck', 'verne', 'wells', 'conan doyle', 'agatha christie',
  ];
  if (classicAuthors.some((a) => allText.includes(a))) {
    score += 8;
  }

  // --- Children's classics bonus (iconic covers) ---
  const childrenClassics = [
    'peter rabbit', 'peter pan', 'alice', 'wonderland', 'narnia',
    'winnie', 'pooh', 'gruffalo', 'wild things', 'hungry caterpillar',
    'charlie and the chocolate', 'matilda', 'bfg', 'roald dahl',
    'harry potter', 'paddington', 'wind in the willows',
    'velveteen rabbit', 'little prince', 'secret garden',
  ];
  if (childrenClassics.some((c) => titleLower.includes(c))) {
    score += 12;
    reasons.push('iconic');
  }

  // Cap at 100
  score = Math.min(100, Math.max(0, score));

  // Determine badge
  let badge: string | null = null;
  if (score >= 80) {
    badge = 'Perfect Fit';
  } else if (score >= 65) {
    badge = reasons.includes('collector') || reasons.includes('premium')
      ? "Collector's Edition"
      : reasons.includes('art')
      ? 'Great Cover'
      : reasons.includes('iconic')
      ? 'Iconic Classic'
      : 'Great Choice';
  } else if (score >= 50) {
    badge = 'Good Fit';
  }

  return { score, badge };
}

/* ------------------------------------------------------------------ */
/*  Sort books by clock score (highest first)                          */
/* ------------------------------------------------------------------ */

export function sortByClockScore<T extends { clockScore: number }>(books: T[]): T[] {
  return [...books].sort((a, b) => b.clockScore - a.clockScore);
}
