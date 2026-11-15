// ProbashiShield AI — brand asset renderer
// Usage: node tools/render-assets.mjs
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND = join(ROOT, 'assets', 'brand');
const ICONS = join(ROOT, 'assets', 'icons');
const OG = join(ROOT, 'assets', 'og');
const FONTS = join(ROOT, 'assets', 'fonts');

for (const d of [BRAND, ICONS, OG]) mkdirSync(d, { recursive: true });

const logoSvg = readFileSync(join(BRAND, 'logo.svg'), 'utf8');
const logoDarkSvg = readFileSync(join(BRAND, 'logo-dark-bg.svg'), 'utf8');

const fontFiles = [
  join(FONTS, 'alinur-tatsama', 'Unicode', 'Li Alinur Tatsama Unicode.ttf'),
  join(FONTS, 'alinur-tatsama', 'Unicode', 'Li Alinur Tatsama Unicode Italic.ttf'),
  join(FONTS, 'Inter-400.ttf'),
  join(FONTS, 'Inter-600.ttf'),
  join(FONTS, 'Inter-800.ttf'),
];
const BENGALI_FONT = 'Li Alinur Tatsama Unicode';

function render(svg, { width, height, bg, fontFamily } = {}) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    ...(height ? { fitTo: { mode: 'original' } } : {}),
    ...(bg ? { background: bg } : {}),
    font: {
      fontFiles,
      loadSystemFonts: true,
      ...(fontFamily ? { defaultFontFamily: fontFamily } : {}),
    },
  });
  return resvg.render().asPng();
}

// Wrap the logo SVG into a fixed-size canvas with optional background + padding
function framed(innerSvg, size, { pad = 0, bg = null } = {}) {
  const inner = size - pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ''}
  <svg x="${pad}" y="${pad}" width="${inner}" height="${inner}" viewBox="0 0 512 512">${innerSvg.replace(/<svg[^>]*>|<\/svg>/g, '')}</svg>
</svg>`;
}

function save(name, buf, dir = ICONS) {
  writeFileSync(join(dir, name), buf);
  console.log('✓', join(dir, name));
}

// ---------- Favicons ----------
for (const s of [16, 32, 48]) {
  save(`favicon-${s}.png`, render(logoSvg, { width: s }));
}
copyFileSync(join(BRAND, 'logo.svg'), join(ICONS, 'favicon.svg'));

// ---------- PWA / Apple icons ----------
save('apple-touch-icon.png', render(framed(logoSvg, 180, { pad: 18, bg: '#0B3D91' }), { width: 180 }));
save('icon-192.png', render(framed(logoSvg, 192, { pad: 12 }), { width: 192 }));
save('icon-512.png', render(framed(logoSvg, 512, { pad: 32 }), { width: 512 }));
// Maskable: keep logo inside central 80% safe zone -> ~410px of 512
save('maskable-512.png', render(framed(logoSvg, 512, { pad: 64, bg: '#0B3D91' }), { width: 512 }));
save('maskable-192.png', render(framed(logoSvg, 192, { pad: 24, bg: '#0B3D91' }), { width: 192 }));

// ---------- Brand PNG exports ----------
save('logo-1024.png', render(logoSvg, { width: 1024 }), BRAND);
save('logo-dark-1024.png', render(logoDarkSvg, { width: 1024 }), BRAND);

// ---------- OG images ----------
const ogBg = `<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#0A2C6B"/><stop offset="0.55" stop-color="#0B3D91"/><stop offset="1" stop-color="#1E5FB8"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.78" cy="0.25" r="0.7">
    <stop offset="0" stop-color="#2E8BD0" stop-opacity="0.5"/><stop offset="1" stop-color="#2E8BD0" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<rect width="1200" height="630" fill="url(#glow)"/>
<circle cx="1050" cy="520" r="220" fill="#0E7C4A" opacity="0.12"/>
<circle cx="1050" cy="520" r="140" fill="#0E7C4A" opacity="0.10"/>`;

const chips = ['WhatsApp-Native', 'Live Gov-DB Verification', 'Bangla Voice Reports', '24/7 SOS Guardian']
  .map((c, i) => {
    const x = 340 + (i % 2) * 400, y = 470 + Math.floor(i / 2) * 56;
    return `<rect x="${x}" y="${y}" rx="22" ry="22" width="${c.length * 11 + 36}" height="44" fill="#FFFFFF" opacity="0.10" stroke="#FFFFFF" stroke-opacity="0.35"/>
    <text x="${x + 18}" y="${y + 29}" font-family="Inter" font-size="20" font-weight="600" fill="#DCE9F7">${c}</text>`;
  }).join('\n');

const ogDefault = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
${ogBg}
${readFileSync(join(BRAND, 'logo.svg'), 'utf8').replace(/<svg[^>]*>/, `<svg x="80" y="215" width="200" height="200" viewBox="0 0 512 512">`).replace('</svg>', '</svg>')}
<text x="340" y="255" font-family="${BENGALI_FONT}" font-weight="400" font-size="50" fill="#9CC3EE">প্রবাসীশিল্ড</text>
<text x="338" y="330" font-family="Inter" font-weight="800" font-size="62" fill="#FFFFFF">ProbashiShield AI</text>
<text x="340" y="385" font-family="Inter" font-weight="400" font-size="25" fill="#CFE0F5">The 24/7 Autonomous AI Guardian for 1.2 Crore Migrant Workers</text>
${chips}
<text x="80" y="600" font-family="Inter" font-weight="600" font-size="18" fill="#8FB4DE">International AI Builders Congress 2026 · CloudCamp BD</text>
</svg>`;
save('og-default.png', render(ogDefault, { width: 1200, height: 630, fontFamily: 'Inter' }), OG);

// Square OG — WhatsApp-safe: all key content inside central ~80%
const sqLogo = readFileSync(join(BRAND, 'logo.svg'), 'utf8')
  .replace(/<svg[^>]*>/, '<svg x="380" y="120" width="320" height="320" viewBox="0 0 512 512">')
  .replace('</svg>', '</svg>');
const ogSquare = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
<defs>
  <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#0A2C6B"/><stop offset="0.55" stop-color="#0B3D91"/><stop offset="1" stop-color="#1E5FB8"/>
  </linearGradient>
  <radialGradient id="glow2" cx="0.5" cy="0.3" r="0.8">
    <stop offset="0" stop-color="#2E8BD0" stop-opacity="0.45"/><stop offset="1" stop-color="#2E8BD0" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="1080" height="1080" fill="url(#bg2)"/>
<rect width="1080" height="1080" fill="url(#glow2)"/>
${sqLogo}
<text x="540" y="540" text-anchor="middle" font-family="${BENGALI_FONT}" font-weight="400" font-size="62" fill="#9CC3EE">প্রবাসীশিল্ড</text>
<text x="540" y="625" text-anchor="middle" font-family="Inter" font-weight="800" font-size="84" fill="#FFFFFF">ProbashiShield AI</text>
<text x="540" y="690" text-anchor="middle" font-family="Inter" font-weight="400" font-size="32" fill="#CFE0F5">24/7 AI Guardian for Migrant Workers</text>
<rect x="330" y="740" rx="30" ry="30" width="420" height="64" fill="#0E7C4A"/>
<text x="540" y="782" text-anchor="middle" font-family="Inter" font-weight="600" font-size="30" fill="#FFFFFF">Contract Fraud Detection + SOS Rescue</text>
<text x="540" y="1010" text-anchor="middle" font-family="Inter" font-weight="600" font-size="22" fill="#8FB4DE">International AI Builders Congress 2026 · CloudCamp BD</text>
</svg>`;
save('og-square-1080.png', render(ogSquare, { width: 1080, fontFamily: 'Inter' }), OG);

// Story / vertical OG 1080x1920
const storyLogo = readFileSync(join(BRAND, 'logo.svg'), 'utf8')
  .replace(/<svg[^>]*>/, '<svg x="340" y="300" width="400" height="400" viewBox="0 0 512 512">')
  .replace('</svg>', '</svg>');
const ogStory = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
<defs>
  <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0A2C6B"/><stop offset="0.5" stop-color="#0B3D91"/><stop offset="1" stop-color="#123B8F"/>
  </linearGradient>
  <radialGradient id="glow3" cx="0.5" cy="0.35" r="0.9">
    <stop offset="0" stop-color="#2E8BD0" stop-opacity="0.45"/><stop offset="1" stop-color="#2E8BD0" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="1080" height="1920" fill="url(#bg3)"/>
<rect width="1080" height="1920" fill="url(#glow3)"/>
${storyLogo}
<text x="540" y="830" text-anchor="middle" font-family="${BENGALI_FONT}" font-weight="400" font-size="70" fill="#9CC3EE">প্রবাসীশিল্ড</text>
<text x="540" y="940" text-anchor="middle" font-family="Inter" font-weight="800" font-size="96" fill="#FFFFFF">ProbashiShield</text>
<text x="540" y="1010" text-anchor="middle" font-family="Inter" font-weight="800" font-size="96" fill="#7FD4A8">AI</text>
<text x="540" y="1120" text-anchor="middle" font-family="Inter" font-weight="400" font-size="38" fill="#CFE0F5">The 24/7 Autonomous AI Guardian</text>
<text x="540" y="1175" text-anchor="middle" font-family="Inter" font-weight="400" font-size="38" fill="#CFE0F5">for 1.2 Crore Migrant Workers</text>
<rect x="190" y="1280" rx="36" ry="36" width="700" height="110" fill="#FFFFFF" opacity="0.10" stroke="#FFFFFF" stroke-opacity="0.4"/>
<text x="540" y="1348" text-anchor="middle" font-family="Inter" font-weight="600" font-size="36" fill="#FFFFFF">Arabic Contract → Bangla Audit in 3 Seconds</text>
<rect x="190" y="1420" rx="36" ry="36" width="700" height="110" fill="#0E7C4A"/>
<text x="540" y="1488" text-anchor="middle" font-family="Inter" font-weight="600" font-size="36" fill="#FFFFFF">SOS → Embassy Rescue Dossier</text>
<text x="540" y="1780" text-anchor="middle" font-family="Inter" font-weight="600" font-size="28" fill="#8FB4DE">International AI Builders Congress 2026 · CloudCamp BD</text>
<text x="540" y="1860" text-anchor="middle" font-family="Inter" font-weight="600" font-size="26" fill="#6E97C4">equisaas-bd.com</text>
</svg>`;
save('og-story-1080x1920.png', render(ogStory, { width: 1080, fontFamily: 'Inter' }), OG);

// ---------- Wordmark (logo + Bangla/English name lockup) ----------
// Bangla name as ONE clean word; English carries the "AI" — no duplicated "এআই"
const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="400" viewBox="0 0 1400 400">
${readFileSync(join(BRAND, 'logo.svg'), 'utf8').replace(/<svg[^>]*>/, '<svg x="30" y="50" width="300" height="300" viewBox="0 0 512 512">').replace('</svg>', '</svg>')}
<text x="390" y="185" font-family="${BENGALI_FONT}" font-weight="400" font-size="110" fill="#0B3D91">প্রবাসীশিল্ড</text>
<text x="392" y="280" font-family="Inter" font-weight="800" font-size="62" fill="#111827">ProbashiShield <tspan fill="#1E5FB8">AI</tspan></text>
<text x="392" y="345" font-family="Inter" font-weight="400" font-size="30" fill="#6B7280">The 24/7 AI Guardian for 1.2 Crore Migrant Workers</text>
</svg>`;
save('wordmark.svg', wordmark, BRAND);
save('wordmark-1400.png', render(wordmark, { width: 1400, fontFamily: 'Inter' }), BRAND);

// Horizontal compact wordmark (for headers)
const wordmarkCompact = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="170" viewBox="0 0 1000 170">
${readFileSync(join(BRAND, 'logo.svg'), 'utf8').replace(/<svg[^>]*>/, '<svg x="14" y="15" width="140" height="140" viewBox="0 0 512 512">').replace('</svg>', '</svg>')}
<text x="190" y="80" font-family="${BENGALI_FONT}" font-weight="400" font-size="52" fill="#0B3D91">প্রবাসীশিল্ড</text>
<text x="192" y="135" font-family="Inter" font-weight="800" font-size="44" fill="#111827">ProbashiShield <tspan fill="#1E5FB8">AI</tspan></text>
</svg>`;
save('wordmark-compact.svg', wordmarkCompact, BRAND);
save('wordmark-compact-900.png', render(wordmarkCompact, { width: 900, fontFamily: 'Inter' }), BRAND);

console.log('\nDone. All assets generated under assets/');
