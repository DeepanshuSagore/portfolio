import { Check, Copy, Download, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '../components/Button';
import { RegisterRow } from '../components/RegisterRow';
import { profile } from '../data/content';
import { useReveal } from '../lib/motion';

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
  { label: 'GitHub', value: profile.githubHandle, href: profile.github, Icon: Github },
  { label: 'LinkedIn', value: profile.linkedinHandle, href: profile.linkedin, Icon: Linkedin },
  { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}`, Icon: Phone },
];

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard is permission-gated; the mailto link beside this is the fallback.
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="type-mono-s inline-flex items-center gap-2 border border-rule px-4 py-3 uppercase text-text-2 transition-[color,border-color] duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:border-signal-2 hover:text-text-1"
    >
      {copied ? <Check aria-hidden="true" className="size-4 text-live" /> : <Copy aria-hidden="true" className="size-4" />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  );
}

/**
 * Contact.
 *
 * The heading here used to be a declarative sentence that restated the tagline
 * already sitting in About. The address itself is the more useful thing to set
 * large: it is the single action this section exists to produce, it is real
 * information rather than a claim, and it is the one string a visitor might
 * actually want to read off the screen.
 *
 * The channel list is the RegisterRow primitive DESIGN.md Section 5 specifies
 * and which, until now, nothing on the shipped page actually used.
 */
export function Contact() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="contact" ref={root} className="defer-paint shell scroll-mt-24 py-24 md:py-32">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 border-t border-rule pt-5 md:gap-x-10">
        <p aria-hidden="true" className="chapter-numeral">
          05
        </p>

        <div className="min-w-0">
          <p className="type-overline">Contact</p>

          <h2 data-reveal className="mt-4 font-display leading-[0.95] font-semibold tracking-[-0.04em]">
            <a
              href={`mailto:${profile.email}`}
              className="link-wipe inline-block max-w-full text-[clamp(1.5rem,5.1vw,3.75rem)] break-words text-text-1 transition-colors duration-[var(--dur-standard)] ease-[var(--ease-signal)] hover:text-signal-1"
            >
              {profile.email}
            </a>
          </h2>

          <p data-reveal className="type-body-l mt-7 max-w-[54ch] text-text-3">
            Open to engineering roles in full-stack and GenAI, and to analyst, quality and
            operations roles. I have done both, and the overlap is where I am most useful.
          </p>

          <div data-reveal className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={`mailto:${profile.email}`}
              variant="signal"
              icon={<Mail aria-hidden="true" className="size-4" />}
            >
              Email me
            </ButtonLink>
            <CopyEmail />
            <ButtonLink
              href={profile.resume}
              variant="ghost"
              download
              icon={<Download aria-hidden="true" className="size-4" />}
            >
              Résumé
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mt-16 border-b border-rule">
        {channels.map(({ label, value, href, Icon }, i) => (
          <div data-reveal key={label}>
            <RegisterRow
              index={String(i + 1).padStart(2, '0')}
              label={label}
              href={href}
              meta={
                <span className="inline-flex items-center gap-2.5">
                  <Icon aria-hidden="true" className="size-3.5 shrink-0 text-text-4" />
                  {value}
                </span>
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="shell">
      {/* The rule belongs to the content column, not to the shell's padding
          box - on the shell itself it overshot every other hairline on the
          page by a full gutter at each end. */}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-rule py-10">
        <p className="type-mono-s text-text-3">
          {profile.name} · {profile.location}
        </p>
        <p className="type-mono-s text-text-3">
          Set in Bricolage Grotesque and Geist · React, Tailwind, anime.js
        </p>
      </div>
    </footer>
  );
}
