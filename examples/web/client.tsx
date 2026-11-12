import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Missing application root');
}
if (root.hasChildNodes()) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
