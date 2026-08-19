/**
 * AI Civic Analysis - priority engine.
 *
 * When AI_API_KEY (a Groq API key - https://console.groq.com, free tier) is
 * present in .env, this calls a real LLM (Llama 3.1 via Groq) to read the
 * complaint description and return a genuine priority assessment.
 *
 * If AI_API_KEY is missing, the Groq call fails, or the response can't be
 * parsed, this automatically falls back to the rule-based keyword/category
 * engine below - a complaint submission should never fail just because the
 * AI call had a hiccup.
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-20b';

const KEYWORD_RULES = [
  { level: 'P1', score: 90, keywords: ['no water', 'water supply failure', 'major leak', 'collapsed', 'collapse', 'live wire', 'exposed wire', 'gas leak', 'sewage overflow', 'flooding', 'flood', 'danger', 'dangerous', 'fire hazard', 'electrocution'], reason: 'Indicates a severe public safety or essential-service risk requiring urgent municipal attention.' },
  { level: 'P2', score: 65, keywords: ['pothole', 'large pothole', 'drainage blocked', 'blocked drain', 'sewage', 'garbage accumulation', 'overflowing', 'accident', 'road damage', 'water leak', 'contaminated water'], reason: 'Potential impact on public mobility, sanitation, or essential services and requires municipal attention.' },
  { level: 'P3', score: 40, keywords: ['streetlight', 'street light', 'broken light', 'moderate', 'drainage', 'signal not working', 'traffic signal'], reason: 'Moderate inconvenience to residents; scheduled municipal action recommended.' },
  { level: 'P4', score: 15, keywords: ['minor', 'cosmetic', 'paint', 'signage', 'faded', 'garden', 'maintenance'], reason: 'Minor or cosmetic issue with limited public impact; can be addressed during routine maintenance.' },
];

const CATEGORY_BASELINE = {
  'Water Supply': { level: 'P2', score: 60, reason: 'Water supply issues affect essential services and are treated as high priority by default.' },
  'Drainage': { level: 'P2', score: 55, reason: 'Drainage issues risk flooding and public health concerns.' },
  'Road Damage': { level: 'P2', score: 55, reason: 'Road damage affects public mobility and vehicle safety.' },
  'Garbage/Waste': { level: 'P3', score: 45, reason: 'Waste accumulation affects sanitation and neighborhood cleanliness.' },
  'Sanitation': { level: 'P3', score: 45, reason: 'Sanitation issues affect public health and hygiene.' },
  'Streetlight': { level: 'P3', score: 35, reason: 'Streetlight outages affect visibility and safety at night.' },
  'Public Infrastructure': { level: 'P3', score: 40, reason: 'Infrastructure damage may pose a moderate risk to public use.' },
  'Other': { level: 'P4', score: 20, reason: 'General municipal issue; priority estimated from description only.' },
};

function ruleBasedPriority(description = '', category = 'Other') {
  const text = description.toLowerCase();
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return { level: rule.level, score: rule.score, reason: rule.reason, source: 'rule-based' };
    }
  }
  const baseline = CATEGORY_BASELINE[category] || CATEGORY_BASELINE.Other;
  return { ...baseline, source: 'rule-based' };
}

const SYSTEM_PROMPT = `You are a civic-issue triage assistant for a municipal complaint platform.
Given a complaint category and description, classify its priority.

Respond with ONLY a JSON object, no other text, in exactly this shape:
{"level":"P1","score":85,"reason":"one short sentence explaining why"}

Rules:
- level must be one of: P1 (critical), P2 (high), P3 (medium), P4 (low)
- score is 0-100, roughly matching the level (P1: 80-100, P2: 55-79, P3: 30-54, P4: 0-29)
- reason must be a single short sentence (under 20 words)`;

async function groqPriority(description, category) {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    console.log('[AI Priority] No AI_API_KEY found in .env — using rule-based engine.');
    return null;
  }

  console.log('[AI Priority] Calling Groq...');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        max_tokens: 150,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Category: ${category}\nDescription: ${description}` },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.log('[AI Priority] Groq call FAILED — status', response.status, '—', errText);
      return null;
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) {
      console.log('[AI Priority] Groq returned no content — falling back.');
      return null;
    }

    const parsed = JSON.parse(raw);
    const validLevels = ['P1', 'P2', 'P3', 'P4'];
    if (!validLevels.includes(parsed.level) || typeof parsed.score !== 'number' || !parsed.reason) {
      console.log('[AI Priority] Groq returned unexpected shape:', raw);
      return null;
    }

    console.log('[AI Priority] ✅ Groq SUCCESS —', parsed.level, parsed.reason);
    return {
      level: parsed.level,
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      reason: parsed.reason,
      source: 'ai',
    };
  } catch (err) {
    console.log('[AI Priority] Groq call threw an error:', err.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function analyzePriority(description = '', category = 'Other') {
  const aiResult = await groqPriority(description, category);
  if (aiResult) return aiResult;
  console.log('[AI Priority] Using rule-based fallback.');
  return ruleBasedPriority(description, category);
}

module.exports = { analyzePriority };