'use client';

import { useState } from 'react';
import IntakeForm from '../components/IntakeForm';
import MermaidDiagram from '../components/MermaidDiagram';

/**
 * Extracts a ```mermaid``` block from AI output
 */
function extractMermaid(text) {
  const match = text.match(/```mermaid([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

/**
 * Removes the mermaid block so it doesn’t render twice
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
    <main className="min-h-screen flex items-start justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Header / Hero */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            AI Architecture Advisor is Live
          </h1>
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
          <p className="text-red-600 text-center">
            {error}
          </p>
        )}

        {/* Results */}
        {result && (
          <section className="bg-white p-8 md:p-10 rounded-2xl shadow-md border border-slate-200 transition-all">
            {mermaidCode && (
              <div className="mb-10 border-b border-slate-200 pb-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                  Architecture Diagram
                </h2>
                <MermaidDiagram code={mermaidCode} />
              </div>
            )}

            <div className="whitespace-pre-wrap text-sm md:text-base text-slate-800 leading-relaxed">
              {textOutput}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
