'use client';

import { useState } from 'react';
import IntakeForm from '../components/IntakeForm';

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
        body: JSON.stringify(formData)
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

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Architecture Advisor</h1>

      <IntakeForm onSubmit={handleGenerate} />

      {loading && (
        <p className="mt-4 text-gray-500">Generating architecture recommendation…</p>
      )}

      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </main>
  );
}
