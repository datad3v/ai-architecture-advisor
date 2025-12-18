'use client';

import { useState } from 'react';
import IntakeForm from '../components/IntakeForm';

export default function Home() {
  const [result, setResult] = useState(null);

  async function handleGenerate(formData) {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    setResult(data.output);
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Architecture Advisor</h1>
      <IntakeForm onSubmit={handleGenerate} />

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </main>
  );
}
