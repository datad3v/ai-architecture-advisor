'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function MermaidDiagram({ code }) {
  const ref = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'default' });

    if (ref.current) {
      mermaid.render(
        'mermaid-diagram',
        code,
        (svg) => {
          ref.current.innerHTML = svg;
        }
      );
    }
  }, [code]);

  return <div ref={ref} className="overflow-x-auto" />;
}
