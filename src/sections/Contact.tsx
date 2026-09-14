import { Check, Copy, Download, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '../components/Button';
import { Annotation, HandCurve, Polaroid, vars } from '../components/Material';
import { profile } from '../data/content';
import { useReveal } from '../lib/motion';

const channels = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
  { label: 'GitHub', value: profile.githubHandle, href: profile.github, Icon: Github },
  { label: 'LinkedIn', value: profile.linkedinHandle, href: profile.linkedin, Icon: Linkedin },
  { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}`, Icon: Phone },
];

/** The sticker the references close on. Drawn, so it costs nothing and takes
    the direction's own accent instead of shipping a yellow PNG. */
function Smiley() {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className="size-24 md:size-28">
      <circle cx="50" cy="50" r="46" fill="var(--color-a1)" stroke="var(--color-ink)" strokeWidth="3" />
      <circle cx="35" cy="40" r="5.5" fill="var(--color-ink)" />
      <circle cx="65" cy="40" r="5.5" fill="var(--color-ink)" />
      <path
        d="M30 60c6 11 34 11 40 0"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
      className="type-mono-s inline-flex items-center gap-2 border border-ink bg-panel px-4 py-2.5 uppercase text-ink shadow-[var(--t-shadow)] transition-transform duration-[var(--dur-micro)] ease-[var(--ease-signal)] hover:-translate-y-px"
    >
      {copied ? <Check aria-hidden="true" className="size-4 text-a4" /> : <Copy aria-hidden="true" className="size-4" />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  );
}

/**
 * The close.
 *
 * The references end on an oversized LET'S TALK under a sticker, with the
 * actual details written on a note pinned beneath it. That is the shape here:
 * the address is the one string a visitor might read off the screen, so it
 * goes on the note in full rather than being hidden behind a button.
 */
export function Contact() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="contact" ref={root} className="defer-paint scroll-mt-28 py-20 md:py-24">
      <div aria-hidden="true" className="mb-16 w-full">
        <HandCurve className="rotate-180" />
      </div>

      <div className="shell">
        <Annotation className="text-base" tilt={-1}>
          say hello
        </Annotation>

        <div className="mt-6 grid items-center gap-10 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
          <Polaroid
            src="/me/offhours.webp"
            alt=""
            caption="still here"
            tilt={-1}
            corners={['tl']}
            className="hidden w-36 lg:block"
          />

          <div data-reveal className="flex flex-col items-center text-center">
            <span className="tilt block" style={vars({ '--tilt': 1 })}>
              <Smiley />
            </span>

            <h2 className="type-display-xl mt-4 text-[clamp(3rem,10vw,7.5rem)] uppercase">
              Let&rsquo;s talk
            </h2>

            <p className="type-hand mt-4 max-w-[38ch] text-[1.1rem] text-ink-soft">
              Got a problem worth chasing, or a team that needs someone who will stay with it? Mail
              me. I read everything.
            </p>

            {/* The note. Yellow, pinned crooked, and carrying the details in
                full - the references write the real information down rather
                than putting it behind a control. */}
            <div
              className="tilt mt-10 w-full max-w-md border border-ink bg-a1 p-6 text-left text-a1-ink shadow-[var(--t-shadow-lift)]"
              style={vars({ '--tilt': -1 })}
            >
              <p className="type-overline text-a1-ink/70">Direct</p>

              <a
                href={`mailto:${profile.email}`}
                className="type-mono-m mt-2 block break-all font-medium underline-offset-4 hover:underline"
              >
                {profile.email}
              </a>
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                className="type-mono-m mt-1 block underline-offset-4 hover:underline"
              >
                {profile.phone}
              </a>

              <div className="mt-5 flex flex-wrap gap-3">
                <CopyEmail />
                <ButtonLink
                  href={profile.resume}
                  variant="solid"
                  download
                  icon={<Download aria-hidden="true" className="size-4" />}
                >
                  Résumé
                </ButtonLink>
              </div>
            </div>

            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {channels.map(({ label, value, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                    className="type-mono-s inline-flex items-center gap-2 uppercase text-ink-soft underline-offset-4 transition-colors duration-[var(--dur-micro)] hover:text-ink hover:underline"
                  >
                    <Icon aria-hidden="true" className="size-3.5" />
                    {label}
                    <span className="sr-only">: {value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Polaroid
            src="/me/workspace.webp"
            alt=""
            caption="the desk"
            tilt={1}
            corners={['tr']}
            className="hidden w-44 lg:block"
          />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="shell">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line py-10">
        <p className="type-mono-s text-ink-faint">
          {profile.name} · {profile.location}
        </p>
        <p className="type-mono-s text-ink-faint">
          Set in Pixelify Sans, Archivo, Shantell Sans and Geist · React, Tailwind, anime.js
        </p>
      </div>
    </footer>
  );
}
