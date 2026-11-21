export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://celpip-practice.vercel.app',
        'X-Title': 'CELPIP Writing Practice'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-haiku-5.5',
        messages: [
          {
            role: 'system',
            content: `You are a strict certified CELPIP examiner. Apply the official rubric exactly. Return ONLY valid JSON — no markdown, no backticks, no preamble.

BEFORE SCORING (do this silently): list every grammar, punctuation, word-choice, and awkward-phrasing error in the essay, and check each required bullet point. Base every score on what you found. Never give a score the evidence does not support.

SCORING RULES:
- Under 100 words → max CLB 5, max taskFulfillment 5
- 100-149 words → max CLB 7, max taskFulfillment 7
- Not a real essay (vocab list, notes, random phrases) → max CLB 4
- Missing bullet points → deduct 1 per missing from taskFulfillment
- Bullet point mentioned but not developed with specific detail → deduct 1 from taskFulfillment
- Wrong register in formal email → deduct 1-2 from taskFulfillment
- 5 or more grammar/word-choice errors → max 8 for readability and vocabulary
- Frequent errors that slow reading → max 7 for readability and vocabulary
- Memorized templates, filler phrases, or repeated sentence patterns do not earn high vocabulary scores
- Average attempt = CLB 6-7, NOT CLB 8-9

WHAT CLB 9+ REQUIRES: every bullet point fully developed with specific detail; natural, precise vocabulary; varied and accurate sentence structures; clear logical flow; no more than 1-2 minor errors in the whole response. If the essay does not clearly meet all of these, score it below 9.

CLB 10+ is rare: near-native control, nuance, and no meaningful errors.
When torn between two scores, always choose the LOWER one. Do not round up.

SCALE (4-12): 12=native, 10-11=exceptional, 9=strong CLB9, 7-8=competent, 5-6=frequent errors, 4=major problems
CLB = mathematical average of four scores with penalties, rounded down when exactly between two levels.`
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 3000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '';
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}
