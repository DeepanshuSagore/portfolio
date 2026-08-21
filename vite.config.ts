import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Two measured decisions worth not re-litigating, both counter to the usual
 * advice, both verified with Lighthouse medians against the production build:
 *
 *  - The stylesheet stays a LINKED file. Inlining it is the standard fix for a
 *    render-blocking request, and it did help (+1 mobile) while the app still
 *    rendered client-side. Once the page became prerendered, the document
 *    already carried ~68KB of markup, and folding 34KB of CSS into it made the
 *    single critical resource slower to parse on a throttled CPU than fetching
 *    the CSS in parallel: mobile 98 -> 97, FCP 1.7s -> 2.0s. Left linked.
 *  - The display font is NOT preloaded. At 56KB it contends with the document
 *    and JS for bandwidth, while `font-display: swap` already paints headings
 *    in the fallback face. Preloading measured 1 point worse on mobile.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
});
