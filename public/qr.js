/* Générateur de QR Code local (aucune dépendance, aucun service externe). Mode octets, correction d'erreur M, versions 1–10.
   window.tmQR.svg(texte, {size}) -> chaîne SVG ; window.tmQR.matrix(texte) -> tableau de lignes booléennes. */
(() => {
  const EC = { 1: [10, [[1, 16]]], 2: [16, [[1, 28]]], 3: [26, [[1, 44]]], 4: [18, [[2, 32]]], 5: [24, [[2, 43]]], 6: [16, [[4, 27]]], 7: [18, [[4, 31]]], 8: [22, [[2, 39], [2, 40]]], 9: [22, [[3, 36], [2, 37]]], 10: [26, [[4, 43], [1, 44]]] };
  const ALIGN = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50] };
  const EXP = new Array(512), LOG = new Array(256);
  for (let i = 0, x = 1; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  const gmul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);
  const rsGen = n => { let g = [1]; for (let i = 0; i < n; i++) { const next = new Array(g.length + 1).fill(0); g.forEach((c, j) => { next[j] ^= c; next[j + 1] ^= gmul(c, EXP[i]); }); g = next; } return g; };
  const rsEnc = (data, n) => { const gen = rsGen(n), res = new Array(n).fill(0); for (const d of data) { const f = d ^ res.shift(); res.push(0); if (f) gen.slice(1).forEach((c, i) => { res[i] ^= gmul(c, f); }); } return res; };
  const bch = (value, poly, bits) => { let v = value << bits; const top = poly.toString(2).length - 1; for (let i = v.toString(2).length - 1; i >= top; i--) if ((v >> i) & 1) v ^= poly << (i - top); return v; };
  function encode(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    let version = 0; for (let v = 1; v <= 10; v++) { const data = EC[v][1].reduce((s, [n, k]) => s + n * k, 0); const cap = Math.floor((data * 8 - 4 - (v < 10 ? 8 : 16)) / 8); if (bytes.length <= cap) { version = v; break; } }
    if (!version) throw new Error("QR: texte trop long");
    const [ecLen, groups] = EC[version]; const dataLen = groups.reduce((s, [n, k]) => s + n * k, 0);
    const bits = []; const push = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };
    push(4, 4); push(bytes.length, version < 10 ? 8 : 16); bytes.forEach(b => push(b, 8));
    push(0, Math.min(4, dataLen * 8 - bits.length)); while (bits.length % 8) bits.push(0);
    const cw = []; for (let i = 0; i < bits.length; i += 8) cw.push(parseInt(bits.slice(i, i + 8).join(""), 2));
    for (let pad = 0; cw.length < dataLen; pad++) cw.push(pad % 2 ? 0x11 : 0xec);
    const blocks = []; let pos = 0; for (const [n, k] of groups) for (let i = 0; i < n; i++) { const d = cw.slice(pos, pos + k); pos += k; blocks.push({ d, e: rsEnc(d, ecLen) }); }
    const out = []; const maxD = Math.max(...blocks.map(b => b.d.length)); for (let i = 0; i < maxD; i++) blocks.forEach(b => { if (i < b.d.length) out.push(b.d[i]); }); for (let i = 0; i < ecLen; i++) blocks.forEach(b => out.push(b.e[i]));
    return { version, codewords: out };
  }
  function build(text) {
    const { version, codewords } = encode(text); const size = 17 + 4 * version;
    const base = Array.from({ length: size }, () => new Array(size).fill(null)); const fn = Array.from({ length: size }, () => new Array(size).fill(false));
    const set = (r, c, v) => { if (r >= 0 && c >= 0 && r < size && c < size) { base[r][c] = v; fn[r][c] = true; } };
    const finder = (r, c) => { for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) { const on = i >= 0 && i <= 6 && j >= 0 && j <= 6 && (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)); set(r + i, c + j, on); } };
    finder(0, 0); finder(0, size - 7); finder(size - 7, 0);
    const al = ALIGN[version]; for (const r of al) for (const c of al) { if ((r === 6 && c === 6) || (r === 6 && c === al[al.length - 1]) || (c === 6 && r === al[al.length - 1])) continue; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) set(r + i, c + j, Math.max(Math.abs(i), Math.abs(j)) !== 1); }
    for (let i = 8; i < size - 8; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    set(size - 8, 8, true);
    for (let i = 0; i < 9; i++) { if (!fn[8][i]) set(8, i, false); if (!fn[i][8]) set(i, 8, false); } for (let i = 0; i < 8; i++) { set(8, size - 1 - i, false); set(size - 1 - i, 8, false); }
    if (version >= 7) { const info = (version << 12) | bch(version, 0x1f25, 12); for (let i = 0; i < 18; i++) { const bit = (info >> i) & 1; set(Math.floor(i / 3), size - 11 + (i % 3), !!bit); set(size - 11 + (i % 3), Math.floor(i / 3), !!bit); } }
    const MASKS = [(r, c) => (r + c) % 2 === 0, r => r % 2 === 0, (r, c) => c % 3 === 0, (r, c) => (r + c) % 3 === 0, (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0, (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0, (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0, (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0];
    const place = mask => {
      const m = base.map(row => row.slice()); let bit = 0; let up = true;
      for (let c = size - 1; c > 0; c -= 2) { if (c === 6) c--; for (let k = 0; k < size; k++) { const r = up ? size - 1 - k : k; for (const cc of [c, c - 1]) { if (fn[r][cc]) continue; let v = bit < codewords.length * 8 ? ((codewords[bit >> 3] >> (7 - (bit & 7))) & 1) === 1 : false; bit++; if (MASKS[mask](r, cc)) v = !v; m[r][cc] = v; } } up = !up; }
      const fmt = ((0 << 3 | mask) << 10 | bch((0 << 3) | mask, 0x537, 10)) ^ 0x5412; // niveau M = 00
      const f = i => ((fmt >> i) & 1) === 1;
      for (let i = 0; i <= 5; i++) m[i][8] = f(i); m[7][8] = f(6); m[8][8] = f(7); m[8][7] = f(8); for (let i = 9; i < 15; i++) m[8][14 - i] = f(i);
      for (let i = 0; i < 8; i++) m[8][size - 1 - i] = f(i); for (let i = 8; i < 15; i++) m[size - 15 + i][8] = f(i); m[size - 8][8] = true;
      return m;
    };
    const penalty = m => { let p = 0; const n = m.length;
      for (let r = 0; r < n; r++) for (const get of [(a, b) => m[a][b], (a, b) => m[b][a]]) { let run = 1; for (let c = 1; c < n; c++) { if (get(r, c) === get(r, c - 1)) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (let r = 0; r < n - 1; r++) for (let c = 0; c < n - 1; c++) { const v = m[r][c]; if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) p += 3; }
      const pat = [true, false, true, true, true, false, true, false, false, false, false], pat2 = pat.slice().reverse();
      for (let r = 0; r < n; r++) for (let c = 0; c <= n - 11; c++) for (const get of [(a, b) => m[a][b], (a, b) => m[b][a]]) { if (pat.every((v, i) => get(r, c + i) === v)) p += 40; if (pat2.every((v, i) => get(r, c + i) === v)) p += 40; }
      const dark = m.flat().filter(Boolean).length; p += Math.floor(Math.abs((dark * 100) / (n * n) - 50) / 5) * 10; return p; };
    let best = null, bestP = Infinity; for (let mask = 0; mask < 8; mask++) { const m = place(mask); const p = penalty(m); if (p < bestP) { bestP = p; best = m; } }
    return best;
  }
  const svg = (text, { size = 220, margin = 4, fg = "#000", bg = "#fff" } = {}) => { const m = build(text), n = m.length; let d = ""; m.forEach((row, r) => row.forEach((v, c) => { if (v) d += `M${c + margin} ${r + margin}h1v1h-1z`; })); const t = n + margin * 2; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t} ${t}" width="${size}" height="${size}" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="${t}" height="${t}" fill="${bg}"/><path d="${d}" fill="${fg}"/></svg>`; };
  window.tmQR = { svg, matrix: build };
})();
