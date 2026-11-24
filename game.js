// Pure game logic, shared by index.html and test.mjs.

// "The Cancún!" and "cancun" count as the same answer.
export const norm = s => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
  .replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim().replace(/^(the|a|an) /, '');

// Only you said it = 3, two people = 2, three or more = 1.
export const points = n => n === 1 ? 3 : n === 2 ? 2 : 1;

// Date in the family's timezone as YYYY-MM-DD.
export const dayKey = (tz, d = new Date()) => d.toLocaleDateString('en-CA', { timeZone: tz });

// Day 1 is the start date.
export const dayNumber = (start, key) => Math.round((Date.parse(key) - Date.parse(start)) / 864e5) + 1;

// A prompts/<world>.txt line is "English | Español". Falls back to English when there's no translation.
export function promptText(line, lang) {
  const [en, es] = line.split('|').map(s => s.trim());
  return lang === 'es' && es ? es : en;
}

// Day 1 gets prompts 1–7, day 2 gets 8–14, and so on. Starts over when the list runs out.
export function pickPrompts(lines, n) {
  const sets = Math.floor(lines.length / 7);
  const i = (((n - 1) % sets) + sets) % sets;
  return lines.slice(i * 7, i * 7 + 7);
}

// rows: [{ idx, prompt, answer, name }] for one day.
// Returns prompts[idx] = { text, groups: [{ label, who: [names] }] } (most common first) and totals { name: points }.
export function score(rows) {
  const prompts = [], totals = {};
  for (const r of rows) {
    const p = prompts[r.idx] ??= { text: r.prompt, groups: {} };
    (p.groups[norm(r.answer)] ??= { label: r.answer, who: [] }).who.push(r.name);
  }
  for (const p of prompts) {
    if (!p) continue;
    p.groups = Object.values(p.groups).sort((a, b) => b.who.length - a.who.length);
    for (const g of p.groups) for (const w of g.who) totals[w] = (totals[w] ?? 0) + points(g.who.length);
  }
  return { prompts, totals };
}
