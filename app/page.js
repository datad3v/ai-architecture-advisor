'use client';

import { useState } from 'react';
import IntakeForm from '../components/IntakeForm';
import MermaidDiagram from '../components/MermaidDiagram';

/**
 * Extracts a ```mermaid``` code block from AI output
 */
function extractMermaid(text) {
  const match = text.match(/```mermaid([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

/**
 * Removes the mermaid block from the text so it doesn't render twice
 */
function stripMermaid(text) {
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
        throw new Error('Failed to generate architecture');
      }

      const data = await res.json();
      setResult(data.output);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const mermaidCode = result ? extractMermaid(result) : null;
  const textOutput = result ? stripMermaid(result) : null;

  return (
    <main className="p-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            AI Architecture Advisor
          </h1>
          <p className="text-slate-600">
            Translate business requirements into cloud architecture recommendations
          </p>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <IntakeForm onSubmit={handleGenerate} />
        </section>

        {loading && (
          <p className="text-slate-500">Generating architecture…</p>
        )}

        {error && (
          <p className="text-red-600">{error}</p>
        )}

        {result && (
          <section className="bg-white p-6 rounded-lg shadow-sm border mt-6">
            {mermaidCode && (
              <div className="mb-6">
                <h2 className="font-semibold mb-2">
                  Architecture Diagram
                </h2>
                <MermaidDiagram code={mermaidCode} />
              </div>
            )}

            <div className="whitespace-pre-wrap text-sm text-slate-800">
              {textOutput}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

