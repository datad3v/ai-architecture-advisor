import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  const body = await req.json();

  const prompt = `
You are a senior cloud solutions architect.

Based on the following intake, generate:
1. High-level architecture overview
2. Core components
3. Security and data considerations
4. Scalability and cost tradeoffs

Intake:
Industry: ${body.industry}
Data Sensitivity: ${body.dataSensitivity}
Users: ${body.users}
Goal: ${body.goal}
Cloud: ${body.cloud}

Respond in clear markdown.
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }]
  });

  return Response.json({
    output: completion.choices[0].message.content
  });
}
