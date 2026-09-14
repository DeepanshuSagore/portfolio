import { CommandPalette } from './components/CommandPalette';
import { About } from './sections/About';
import { Contact, Footer } from './sections/Contact';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Nav } from './sections/Nav';
import { Stack } from './sections/Stack';
import { Work } from './sections/Work';

export default function App() {
  return (
    <div className="grain sheet">
      <a
        href="#work"
        className="type-mono-s sr-only uppercase focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-signal-2 focus:bg-ink-1 focus:px-4 focus:py-3 focus:text-text-1"
      >
        Skip to content
      </a>

      <Nav />

      <main>
        <Hero />
        <About />
        <Work />
        <Stack />
        <Experience />
        <Contact />
      </main>

      <Footer />

      {/* Root-level so its hotkey works from anywhere, and so the overlay is
          never trapped inside a section's stacking context. */}
      <CommandPalette />
    </div>
  );
}
