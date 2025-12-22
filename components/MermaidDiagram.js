'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

export default function MermaidDiagram({ code }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ref.current || !code) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });

    try {
      mermaid.render(
        'mermaid-diagram',
        code,
        (svg) => {
          ref.current.innerHTML = svg;
        }
      );
    } catch (err) {
      console.error('Mermaid render error:', err);
    }
  }, [mounted, code]);

  if (!mounted) return null;

  return (
    <div
      ref={ref}
      className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4"
    />
  );
}

