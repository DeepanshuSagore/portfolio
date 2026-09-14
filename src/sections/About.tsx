import { Annotation, Boxed, Polaroid } from '../components/Material';
import { aboutIntro } from '../data/content';
import { useReveal } from '../lib/motion';

/**
 * About, and only about.
 *
 * This section used to carry a long version, a pull quote, four counters, four
 * credential cards and an instrument readout. All of it pushed the one thing
 * the section is for - who this is - into a header above a wall of other
 * material. Education and certificates moved to Experience, where a timeline
 * already exists to hold them; the rest is gone.
 */
export function About() {
  const root = useReveal<HTMLElement>();

  return (
    <section id="about" ref={root} className="defer-paint scroll-mt-28 py-20 md:py-24">
      <div className="shell">
        <Annotation className="text-base" tilt={-1}>
          about me!
        </Annotation>

        <div className="mt-8 flex flex-col items-center">
          <span data-reveal>
            <Boxed className="text-[0.8rem]">What&rsquo;s up</Boxed>
          </span>

          {/* The prints sit either side of the handwriting and at different
              heights, which is what stops three items in a row from reading as
              a three-column grid. */}
          <div
            data-reveal
            className="mt-10 grid w-full items-start justify-items-center gap-10 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8"
          >
            <Polaroid
              src="/me/portrait.webp"
              alt="Deepanshu Sagore."
              caption="off the clock"
              tilt={-1}
              corners={['tl', 'tr']}
              className="w-40 lg:mt-8"
            />

            <p className="type-hand max-w-[42ch] text-center text-[1.15rem] leading-[1.85] text-ink">
              {aboutIntro}
            </p>

            <Polaroid
              src="/me/workspace.webp"
              alt="A language model fine-tune reporting evaluation loss beside a notebook building a retrieval pipeline."
              caption="my workstation"
              tilt={1}
              corners={['tl', 'tr']}
              className="w-52 lg:-mt-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
