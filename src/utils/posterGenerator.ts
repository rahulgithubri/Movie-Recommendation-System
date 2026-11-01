import { Movie, IndustryType } from '../types/movie';

// Industry color accents and emblems
const INDUSTRY_THEMES: Record<IndustryType, { bgTop: string; bgBottom: string; accent: string; label: string; symbol: string }> = {
  Hollywood: {
    bgTop: '#151922',
    bgBottom: '#080a0e',
    accent: '#E50914',
    label: 'HOLLYWOOD CINEMA',
    symbol: '🎬'
  },
  Bollywood: {
    bgTop: '#240f12',
    bgBottom: '#0a0304',
    accent: '#E50914',
    label: 'BOLLYWOOD CINEMA',
    symbol: '🎭'
  },
  Tollywood: {
    bgTop: '#22140a',
    bgBottom: '#0a0602',
    accent: '#E50914',
    label: 'TOLLYWOOD CINEMA',
    symbol: '⚡'
  },
  Marathi: {
    bgTop: '#24130a',
    bgBottom: '#0a0502',
    accent: '#E50914',
    label: 'MARATHI CINEMA',
    symbol: '🚩'
  }
};

// Word wrap helper for SVG text
function wrapText(text: string, maxCharsPerLine = 18): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.slice(0, 4); // Max 4 lines
}

export function generatePosterDataUri(movie: Partial<Movie> & { title: string; industry?: IndustryType; year?: number; director?: string; genres?: string[]; rating?: number }): string {
  const ind: IndustryType = movie.industry || 'Hollywood';
  const theme = INDUSTRY_THEMES[ind] || INDUSTRY_THEMES.Hollywood;
  const lines = wrapText(movie.title, 16);
  const year = movie.year || 2024;
  const rating = movie.rating ? movie.rating.toFixed(1) : '8.0';
  const director = movie.director || 'Cinema Studio';
  const genres = (movie.genres || ['Drama']).slice(0, 2).join(' • ').toUpperCase();

  const titleSvgLines = lines.map((line, idx) => {
    const yOffset = 420 + idx * 46 - ((lines.length - 1) * 23);
    return `<text x="300" y="${yOffset}" font-family="Inter, -apple-system, sans-serif" font-weight="900" font-size="${lines.length > 2 ? 34 : 40}" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">${escapeXml(line)}</text>`;
  }).join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${theme.bgTop}"/>
      <stop offset="50%" stop-color="#111111"/>
      <stop offset="100%" stop-color="${theme.bgBottom}"/>
    </linearGradient>
    <radialGradient id="spotlight" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <pattern id="filmStrip" width="30" height="20" patternUnits="userSpaceOnUse">
      <rect width="18" height="12" x="6" y="4" fill="#222222" rx="2"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="600" height="900" fill="url(#bgGrad)"/>
  <rect width="600" height="900" fill="url(#spotlight)"/>

  <!-- Cinema Frame Border -->
  <rect x="20" y="20" width="560" height="860" fill="none" stroke="#282828" stroke-width="2" rx="6"/>
  <rect x="28" y="28" width="544" height="844" fill="none" stroke="#1c1c1c" stroke-width="1" rx="4"/>

  <!-- Film Strip Accent Top & Bottom -->
  <rect x="30" y="32" width="540" height="18" fill="url(#filmStrip)"/>
  <rect x="30" y="850" width="540" height="18" fill="url(#filmStrip)"/>

  <!-- Industry Emblem Header -->
  <rect x="180" y="70" width="240" height="28" fill="#181818" stroke="#333333" stroke-width="1" rx="3"/>
  <text x="300" y="89" font-family="Inter, sans-serif" font-weight="800" font-size="11" fill="#E50914" text-anchor="middle" letter-spacing="2">${theme.label}</text>

  <!-- Cinema Icon Symbol -->
  <circle cx="300" cy="240" r="70" fill="#181818" stroke="#282828" stroke-width="2"/>
  <circle cx="300" cy="240" r="56" fill="#121212" stroke="${theme.accent}" stroke-width="1.5" stroke-dasharray="4 3"/>
  <text x="300" y="260" font-size="46" text-anchor="middle">${theme.symbol}</text>

  <!-- Star Rating Badge -->
  <rect x="230" y="335" width="140" height="26" fill="#181818" stroke="#333333" stroke-width="1" rx="3"/>
  <text x="300" y="352" font-family="Inter, sans-serif" font-weight="800" font-size="12" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">★ ${rating} / 10</text>

  <!-- Movie Title Lines -->
  ${titleSvgLines}

  <!-- Divider Line with Diamond -->
  <line x1="160" y1="580" x2="440" y2="580" stroke="#333333" stroke-width="1"/>
  <polygon points="300,576 304,580 300,584 296,580" fill="${theme.accent}"/>

  <!-- Year & Genres -->
  <text x="300" y="618" font-family="Inter, sans-serif" font-weight="700" font-size="13" fill="#A0A0A0" text-anchor="middle" letter-spacing="1.5">${year} • ${genres}</text>

  <!-- Billing Block / Director -->
  <text x="300" y="665" font-family="Inter, sans-serif" font-weight="700" font-size="11" fill="#808080" text-anchor="middle" letter-spacing="2">A FILM BY</text>
  <text x="300" y="690" font-family="Inter, sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${escapeXml(director.toUpperCase())}</text>

  <!-- Cinema Crest Bottom -->
  <text x="300" y="780" font-family="Inter, sans-serif" font-weight="800" font-size="10" fill="#666666" text-anchor="middle" letter-spacing="3">MOVIEFLIX ORIGINAL ARCHIVE</text>
  <text x="300" y="800" font-family="Inter, sans-serif" font-weight="600" font-size="9" fill="#444444" text-anchor="middle" letter-spacing="1.5">OFFICIAL PRODUCTION NUMBER #${movie.id || 'MFX-4000'}</text>
</svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function generateBackdropDataUri(movie: Partial<Movie> & { title: string; industry?: IndustryType; year?: number; director?: string; genres?: string[]; rating?: number; overview?: string }): string {
  const ind: IndustryType = movie.industry || 'Hollywood';
  const theme = INDUSTRY_THEMES[ind] || INDUSTRY_THEMES.Hollywood;
  const year = movie.year || 2024;
  const rating = movie.rating ? movie.rating.toFixed(1) : '8.0';
  const director = movie.director || 'Cinema Studio';
  const overview = (movie.overview || 'An epic cinematic journey exploring power, love, and destiny.').slice(0, 110) + '...';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="hBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bgTop}"/>
      <stop offset="50%" stop-color="#0c0c0c"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <radialGradient id="hSpotlight" cx="65%" cy="45%" r="60%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1280" height="720" fill="url(#hBgGrad)"/>
  <rect width="1280" height="720" fill="url(#hSpotlight)"/>

  <!-- Left Shadow for text readability -->
  <rect width="800" height="720" fill="black" opacity="0.6"/>

  <!-- Frame Lines -->
  <line x1="80" y1="80" x2="1200" y2="80" stroke="#222222" stroke-width="1.5"/>
  <line x1="80" y1="640" x2="1200" y2="640" stroke="#222222" stroke-width="1.5"/>

  <!-- Industry Tag -->
  <rect x="80" y="150" width="160" height="26" fill="#181818" stroke="#333333" rx="3"/>
  <text x="160" y="167" font-family="Inter, sans-serif" font-weight="800" font-size="10" fill="#E50914" text-anchor="middle" letter-spacing="1.5">${theme.label}</text>

  <!-- Title -->
  <text x="80" y="240" font-family="Inter, sans-serif" font-weight="900" font-size="52" fill="#FFFFFF" letter-spacing="-1">${escapeXml(movie.title)}</text>

  <!-- Metadata -->
  <text x="80" y="290" font-family="Inter, sans-serif" font-weight="700" font-size="15" fill="#808080" letter-spacing="1">
    ★ ${rating} / 10 • ${year} • DIRECTED BY ${escapeXml(director.toUpperCase())}
  </text>

  <!-- Overview snippet -->
  <text x="80" y="340" font-family="Inter, sans-serif" font-weight="400" font-size="15" fill="#CCCCCC" letter-spacing="0.2">
    ${escapeXml(overview)}
  </text>

  <!-- Decorative Cinema Stamp -->
  <circle cx="1080" cy="360" r="140" fill="#151515" stroke="#262626" stroke-width="3"/>
  <circle cx="1080" cy="360" r="115" fill="#101010" stroke="${theme.accent}" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="1080" y="380" font-size="70" text-anchor="middle">${theme.symbol}</text>
  <text x="1080" y="440" font-family="Inter, sans-serif" font-weight="800" font-size="11" fill="#808080" text-anchor="middle" letter-spacing="2">CINEMATIC PREVIEW</text>
</svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
