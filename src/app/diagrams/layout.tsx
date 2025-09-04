import React from 'react';

const diagrams = [
  'api-architecture',
  'component-hierarchy',
  'component-state-flow',
  'data-flow',
  'database-schema',
  'development-workflow',
  'final-system-overview',
  'implementation-roadmap',
  'mobile-responsive-breakpoints',
  'mobile-responsive',
  'page-navigation',
  'system-architecture',
  'system-metrics-dashboard',
  'user-journey-flow',
];

export default function DiagramsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Diagrams</h1>
      <div className="flex">
        <aside className="w-1/4 pr-8">
          <nav>
            <ul>
              {diagrams.map(diagram => (
                <li key={diagram} className="mb-2">
                  <a href={`/diagrams/${diagram}`} className="text-blue-500 hover:underline">
                    {diagram.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="w-3/4">
          {children}
        </main>
      </div>
    </div>
  );
}