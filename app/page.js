'use client';

import { useState } from 'react';
import IntakeForm from '../components/IntakeForm';
import MermaidDiagram from '../components/MermaidDiagram';

/**
 * Extracts a ```mermaid``` block from AI output
 */
function extractMermaid(text) {
  if (typeof text !== 'string') return null;
  const match = text.match(/```mermaid([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

/**
 * Removes the mermaid block so it doesn’t render twice
 */
function stripMermaid(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/```mermaid[\s\S]*?```/, '').trim();
}

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate(formData) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to generate architecture');
      }


      const data = await res.json();
      setResult(data.output);
    } catch (err) {
      setError(err.message);

      // Fallback demo output when AI quota is exceeded
      setResult({
        demo: true,
        title: 'Sample Architecture Output (Demo Mode)',
        summary: 'This example is shown because the AI service is currently unavailable.',
        sections: [
          {
            heading: 'Architecture Overview',
            content: [
              'Frontend: Next.js (App Router)',
              'Backend: Serverless API (Node.js)',
              'AI: OpenAI (quota-limited demo)',
              'Hosting: Vercel',
            ],
          },
          {
            heading: 'Pros',
            content: [
              'Fast to deploy',
              'Scales automatically',
              'Minimal operational overhead',
            ],
          },
          {
            heading: 'Cons',
            content: [
              'Dependent on third-party AI services',
              'Usage quotas apply',
            ],
          },
        ],
        mermaid: `
      graph TD
        User -->|Browser| Frontend[Next.js App]
        Frontend -->|API Call| Backend[Serverless API]
        Backend -->|Request| OpenAI[AI Service]
      `,
      });

    } finally {
      setLoading(false);
    }
  }

const isDemo = result?.demo === true;

const mermaidCode = isDemo
  ? result.mermaid
  : result
    ? extractMermaid(result)
    : null;

const textOutput = !isDemo && result
  ? stripMermaid(result)
  : null;


  return (
    <main className="min-h-screen flex items-start justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Header / Hero */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            AI Architecture Advisor is Live
          </h1>
          {result?.demo && (
            <div className="mb-3">
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                Demo Mode · AI credits exhausted
              </span>
            </div>
          )}
          
          <p className="text-slate-600 max-w-xl mx-auto text-base md:text-lg">
            Translate business requirements into cloud architecture recommendations
          </p>
        </header>

        {/* Intake Form */}
        <section className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 mb-12">
          <IntakeForm onSubmit={handleGenerate} />
        </section>

        {/* Status */}
        {loading && (
          <p className="text-slate-500 text-center">
            Generating architecture…
          </p>
        )}

        {error && (
          <div className="max-w-xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-amber-800 mb-2">
              AI Service Temporarily Unavailable
            </h3>
            <p className="text-amber-700 text-sm">
              {error}
            </p>
            <p className="text-amber-600 text-xs mt-2">
              This demo runs on limited free AI credits.
            </p>
          </div>
        )}
        


        {/* Results */}
        {result && (
          <section className="bg-white p-8 md:p-10 rounded-2xl shadow-md border border-slate-200">
            {result.demo && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 text-sm">
                ⚠️ AI credits exhausted — displaying demo architecture.
              </div>
            )}

            <h2 className="text-2xl font-semibold mb-2">{result.title}</h2>
            <p className="text-slate-600 mb-8">{result.summary}</p>

            {result.sections.map((section, idx) => (
              <div key={idx} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{section.heading}</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {section.content.map((item, i) => (
                  <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        {result.mermaid && (
          <div className="mt-10">
          <h3 className="text-lg font-semibold mb-3">Architecture Diagram</h3>
            <MermaidDiagram code={result.mermaid} />
          </div>
        )}
      </section>
      )}

      </div>
    </main>
  );
}
