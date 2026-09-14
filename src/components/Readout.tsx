import { useEffect, useState } from 'react';
import { vars } from './Material';
import { github } from '../data/github';
import { projects } from '../data/content';

/**
 * The index card of measured values.
 *
 * Everything else on the page is a claim about work; this is the only block
 * that reports figures, and three of the four are computed rather than typed.
 * It moved out of the hero when that section was rebuilt to the references,
 * which end on a drawn curve and have nowhere to put a panel.
 */

/** Indore, to the same precision the rest of the card carries. */
const COORDS = '22.7196°N 75.8577°E';

function formatIST() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

function useLocalTime() {
  // Starts null so the prerendered HTML and the first client render agree; a
  // real clock in the initial render would be a guaranteed hydration mismatch,
  // since the two are produced at different instants.
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime(formatIST());
    const id = setInterval(() => setTime(formatIST()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-2.5 first:border-t-0">
      <dt className="type-overline">{label}</dt>
      <dd className="type-mono-m text-right text-ink-soft">{children}</dd>
    </div>
  );
}

export function Readout({ className = '', tilt = 1 }: { className?: string; tilt?: number }) {
  const time = useLocalTime();

  return (
    <div
      className={`tilt border border-line bg-panel text-left shadow-[var(--t-shadow)] ${className}`}
      style={vars({ '--tilt': tilt })}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line bg-canvas-2 px-4 py-2.5">
        <p className="type-overline">Readout</p>
        <p className="type-mono-s text-ink-faint">{COORDS}</p>
      </div>

      <dl>
        <Row label="Local time">
          <time>{time ?? '--:--:--'}</time> IST
        </Row>
        <Row label="Focus">Retrieval, evaluation</Row>
        <Row label="Last">Coding Specialist, Outlier</Row>
        <Row label="Shipped">
          {projects.length} projects, {github.deployed} live
        </Row>
      </dl>
    </div>
  );
}
