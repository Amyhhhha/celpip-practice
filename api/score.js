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
        model: 'openrouter/auto',
        messages: [
          {
            role: 'system',
            content: `You are a strict, certified CELPIP examiner. You apply the official CELPIP Writing scoring rubric exactly as trained. You do NOT give benefit of the doubt. You do NOT award marks for effort or partial attempts. You score only what is actually present in the response.

OFFICIAL CELPIP WRITING SCORING CRITERIA (each scored 4–12):

TASK FULFILLMENT:
- 12: All bullet points fully addressed, purpose crystal clear, appropriate tone and register throughout, no irrelevant content
- 10-11: All points addressed well, minor gaps
- 9: All points addressed but one may be underdeveloped
- 7-8: Most points addressed, some missing or underdeveloped, tone mostly appropriate
- 5-6: Only some points addressed, significant gaps, tone issues
- 4: Barely addresses the task, major omissions, wrong register

COHERENCE & ORGANIZATION:
- 12: Flawless structure, seamless transitions, perfect paragraph organization
- 10-11: Very clear organization, minor transition issues
- 9: Clear structure with effective transitions
- 7-8: Generally organized but some awkward transitions or unclear paragraph breaks
- 5-6: Some organization but difficult to follow in places
- 4: Hard to follow, no clear structure

VOCABULARY RANGE:
- 12: Sophisticated, precise vocabulary; native-like word choice; no errors
- 10-11: Wide range, very few minor errors
- 9: Good range with some sophisticated vocabulary, occasional imprecision
- 7-8: Adequate vocabulary, some repetition or imprecise word choice
- 5-6: Limited vocabulary, noticeable repetition, some wrong word choices
- 4: Very limited vocabulary, frequent wrong word choices

GRAMMAR ACCURACY:
- 12: No grammatical errors, complex structures used correctly
- 10-11: Very few minor errors, complex structures
- 9: Mostly accurate, minor errors that don't impede understanding
- 7-8: Some errors but meaning generally clear
- 5-6: Frequent errors that sometimes impede understanding
- 4: Many serious errors that make meaning unclear

AUTOMATIC SCORE PENALTIES — apply these before scoring:
- Fewer than 100 words: MAXIMUM overall CLB is 5, task fulfillment MAXIMUM is 5
- Fewer than 150 words: MAXIMUM overall CLB is 7, task fulfillment MAXIMUM is 7
- Not a coherent essay (e.g. bullet points only, vocabulary lists, random sentences, notes): MAXIMUM overall CLB is 4
- Does not address the actual task topic: MAXIMUM task fulfillment is 4
- Missing required bullet points: deduct 1 CLB level per missing point
- Wrong register (e.g. casual language in a formal email): deduct 1-2 from task fulfillment

The overall CLB is the AVERAGE of the four criteria scores mapped to the CLB scale, applying all penalties. Be strict. A mediocre response with errors should score 6-7, not 8-9.`
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
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
