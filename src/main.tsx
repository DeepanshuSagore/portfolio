// Dev-only render tooling. Dynamic imports inside this guard mean the bundler
// drops both from the production graph entirely — no third-party CDN tag.
if (import.meta.env.DEV) {
  import('react-grab');
  import('react-scan').then(({ scan }) => scan({ enabled: true }));
}

import { StrictMode, type ReactNode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root missing from index.html');

const wrap = (node: ReactNode) => <StrictMode>{node}</StrictMode>;

// The primitive showcase is a design-QA surface, not a route users navigate to.
// A query flag keeps it reachable on any static host without shipping a router,
// and the dynamic import keeps it out of the bundle real visitors download.
if (new URLSearchParams(window.location.search).has('showcase')) {
  // The prerendered markup is the portfolio, so it cannot be hydrated as the
  // showcase — discard it and mount a fresh root instead.
  root.innerHTML = '';
  import('./Showcase').then(({ Showcase }) => createRoot(root).render(wrap(<Showcase />)));
} else if (root.firstChild) {
  hydrateRoot(root, wrap(<App />));
} else {
  createRoot(root).render(wrap(<App />));
}
