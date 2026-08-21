import { ArrowUpRight, Check, Copy, Download, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '../components/Button';
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

export function Contact() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="contact" ref={root} className="defer-paint shell scroll-mt-24 py-24 md:py-32">
      <div className="border-t border-rule pt-5">
        <p className="type-overline">Contact</p>
      </div>

      <h2 data-reveal className="type-display-l mt-8 max-w-[14ch]">
        Let us build something worth shipping.
      </h2>

      <p data-reveal className="type-body-l mt-6 max-w-[52ch] text-text-3">
        Open to GenAI and full-stack roles, and to interesting problems generally. The fastest way
        to reach me is email.
      </p>

      <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
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

      <dl className="mt-16 border-b border-rule">
        {channels.map(({ label, value, href, Icon }) => (
          <div
            key={label}
            data-reveal
            className="group grid grid-cols-[1fr_auto] items-center gap-4 border-t border-rule px-2 py-5 transition-[background-color,border-color] duration-[var(--dur-standard)] ease-[var(--ease-signal)] hover:border-signal-2 hover:bg-signal-feint has-[a:focus-visible]:border-signal-2"
          >
            <dt className="type-overline">{label}</dt>
            <dd className="justify-self-end">
              <a
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                className="type-mono-m inline-flex items-center gap-2.5 text-text-2 transition-colors duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:text-text-1"
              >
                <Icon aria-hidden="true" className="size-3.5 text-text-4 transition-colors group-hover:text-signal-2" />
                {value}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 text-text-4 transition-[translate,color] duration-[var(--dur-standard)] ease-[var(--ease-signal)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal-2"
                />
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="shell border-t border-rule py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="type-mono-s text-text-3">
          {profile.name} — {profile.location}
        </p>
        <p className="type-mono-s text-text-3">
          Built with React, Tailwind and anime.js
        </p>
      </div>
    </footer>
  );
}
