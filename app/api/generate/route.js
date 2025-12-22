import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const prompt = `
You are a senior cloud solutions architect.
Based on the following requirements, provide:
- Architecture overview
- Pros & cons
- Cost considerations
- Security considerations
- A Mermaid diagram

Requirements:
${JSON.stringify(body, null, 2)}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return Response.json({
      output: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error('OpenAI error:', error);

    // Default error response
    let status = 500;
    let errorType = 'UNKNOWN_ERROR';
    let message = 'An unexpected error occurred. Please try again later.';

    // Handle known OpenAI errors
    if (error.status === 429) {
      status = 429;
      errorType = 'QUOTA_EXCEEDED';
      message =
        'AI usage limit reached. Please try again later.';
    }

    if (error.status === 401) {
      status = 401;
      errorType = 'AUTH_ERROR';
      message =
        'AI service configuration error. Please contact the site owner.';
    }

    return Response.json(
      { errorType, message },
      { status }
    );
  }
}

