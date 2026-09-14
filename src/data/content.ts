/**
 * Single source of truth for every fact rendered on this site.
 *
 * Everything here is drawn from one of two places: Deepanshu's CV, or the live
 * GitHub API / repository READMEs (fetched 2026-08-21). Nothing is invented.
 * Projects without a public repository are marked so, and no link is emitted
 * for a destination that does not exist.
 *
 * The CV of record is Reference/ResumeFr.pdf, which positions a single track:
 * AI engineer, generative AI and retrieval. It replaced the operations résumé
 * that this file was first written against, and the two disagree on facts
 * rather than on emphasis - the operations CV omitted the Outlier role
 * entirely and dated Ethara.ai Aug 2025 – Aug 2026 against the current
 * Nov 2025 – Feb 2026. Where they conflict the résumé wins; where the résumé
 * is silent and the old file carried something verifiable, such as a deployed
 * repository, that survives.
 *
 * Date ranges use an en dash, matching the CV. No em dashes anywhere in copy.
 */
import { github } from './github';

export const profile = {
  name: 'Deepanshu Sagore',
  firstName: 'Deepanshu',
  lastName: 'Sagore',
  /* Build track leads: the Work section directly below it is the evidence. */
  role: 'GenAI & full-stack developer',
  roleSecondary: 'Quality & process analyst',
  location: 'Indore, India',
  email: 'deepanshusagore@gmail.com',
  phone: '+91 6263364050',
  github: 'https://github.com/DeepanshuSagore',
  githubHandle: 'DeepanshuSagore',
  linkedin: 'https://www.linkedin.com/in/deepanshusagore',
  linkedinHandle: 'deepanshusagore',
  resume: '/Deepanshu-Sagore-Resume.pdf',
  /* Drawn from the CV summary rather than the GitHub bio, because this line
     has to survive a recruiter reading it cold. */
  tagline:
    'Happiest at the messy end of a problem, and I stay with it through execution instead of handing over a deck.',
  taglineSource: 'How I work',
  intro:
    'I ship GenAI and full-stack products, and I run quality and process operations: a year inside LLM post-training at Ethara.ai, a year of B2B demand generation before that. I pull the numbers, work out what is actually breaking, and then build the fix rather than describe it.',
} as const;

export type Project = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  tags: readonly string[];
  year: string;
  repo: string | null;
  live: string | null;
  /** `null` repo means the source is not public, so never render a dead link. */
  note?: string;
};

/* Ordered so the work that reads as a product with an outcome comes first;
   the deeper technical pieces sit directly behind it rather than at the end. */
export const projects: readonly Project[] = [
  {
    id: 'ethara',
    title: 'Ethara',
    summary: 'Seat allocation and project mapping for roughly 5,000 employees.',
    detail:
      'A full-stack platform covering Employee, HR, Admin and Project-team workflows: directory and lifecycle management, project membership, seat allocation and release, analytics dashboards, and a natural-language assistant that answers questions against the live dataset.',
    tags: ['Next.js', 'Python', 'AI Assistant', 'Analytics'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/Ethara',
    live: 'https://ethara-snowy.vercel.app',
  },
  {
    id: 'fintrack',
    title: 'FinTrack AI',
    summary: 'Budget and spend tracker that flags drift before the month closes.',
    detail:
      'Categorises transactions across accounts and tracks them against monthly budgets, so overspend surfaces while it can still be corrected. Receipt scanning removes the manual entry that usually kills this kind of tracking, and automated email summaries push the numbers to the user instead of waiting for them to open a dashboard.',
    tags: ['Next.js', 'PostgreSQL', 'AI Vision', 'Budgeting', 'Automation'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/ai_fintrack',
    live: 'https://fintrack-finai.vercel.app',
  },
  {
    id: 'neuronest',
    title: 'NeuroNest',
    summary: 'RAG engine that keeps a language model honest about what it has actually read.',
    detail:
      'Document parsing, chunking and embedding feed a LangChain retrieval pipeline, so every answer is grounded in retrieved source passages rather than model memory. Cut hallucinations by refusing to answer outside the retrieved context, and shipped a chat surface for question answering and summarisation over uploaded PDFs.',
    tags: ['LangChain', 'RAG', 'ChromaDB', 'Python', 'LLM APIs'],
    year: '2026',
    repo: null,
    live: null,
    note: 'Source not public',
  },
  {
    id: 'aipl',
    title: 'AIPL',
    summary: 'Conversations with cricket personalities, in character, driven by a language model.',
    detail:
      'A fan-interaction surface rather than a chatbot demo: pick a voice, ask it about the game, and get an answer that stays in character. Shares the AIPL brief with the Google AI Hackathon entry, but this is a separate build carried further.',
    tags: ['Next.js', 'TypeScript', 'LLM', 'Conversational AI'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/Cric-OS',
    live: 'https://cric-os.vercel.app',
  },
  {
    id: 'ipl-cohost',
    title: 'IPL Co-Host AI',
    summary: 'A live companion that watches the match with you.',
    detail:
      'Real-time insight, prediction and match intelligence delivered while an IPL game is still running, so context arrives when a viewer can use it instead of in a post-match write-up.',
    tags: ['Next.js', 'TypeScript', 'Real-time', 'LLM'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/ipl-cohost',
    live: 'https://ipl-cohost.vercel.app',
  },
  {
    id: 'aligna',
    title: 'Aligna',
    summary: 'AI talent scouting that turns a job description into a ranked shortlist.',
    detail:
      'Parses job descriptions, scores candidates through a weighted matching model, and runs AI-simulated engagement to qualify them, collapsing the top of the hiring funnel into a data-backed automated workflow.',
    tags: ['Next.js 15', 'Tailwind v4', 'JD Parsing', 'Matching'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/Aligna',
    live: 'https://alignafr.vercel.app',
  },
  {
    id: 'driveflow',
    title: 'DriveFlow',
    summary: 'Real-time lead CRM built to replace a dealership spreadsheet.',
    detail:
      'Live-syncing lead management for the HSR Motors team: automated lead scoring, a drag-and-drop pipeline, and a dashboard of KPI cards, volume trends, source mix and team performance. Every figure is computed from live data rather than a static export.',
    tags: ['TypeScript', 'Real-time', 'CRM', 'Dashboards'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/Drive',
    live: 'https://drive-dusky-omega.vercel.app',
  },
  {
    id: 'eventshub',
    title: 'EventsHub',
    summary: 'Two-sided campus marketplace, with a moderation queue behind it.',
    detail:
      'Departments list events on one side; students discover and register on the other, filtered by department. An admin moderation queue gates what goes live, so a single listing standard holds across every department, and role-aware dashboards give students, event heads and admins only the actions that belong to them.',
    tags: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Firebase'],
    year: '2025',
    repo: 'https://github.com/DeepanshuSagore/EventsHub',
    live: 'https://eventshub-tan.vercel.app/',
  },
  {
    id: 'stickyyt',
    title: 'StickyYT',
    summary: 'YouTube tracked on purpose, instead of by accident.',
    detail:
      'Full-stack tracker for what you actually watch: Next.js route handlers over MongoDB and Mongoose, Google sign-in through Firebase, and a Three.js background that stays out of the way. Built to make the watching deliberate rather than to add another feed.',
    tags: ['Next.js', 'MongoDB', 'Firebase Auth', 'Three.js'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/Sticky-YT',
    live: null,
    note: 'Repo only',
  },
  {
    id: 'ticket-classifier',
    title: 'Support Ticket Classifier',
    summary: 'Support triage that sorts, prioritises and recommends the next action.',
    detail:
      'Sorts incoming support requests into six categories, assigns a priority and recommends what to do next. Built live in roughly twenty minutes as an interview assignment, with a fallback path for when the AI service is down, so the queue keeps moving either way.',
    tags: ['TypeScript', 'LLM', 'Triage', 'Prioritisation'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/ethara-interview-assignment',
    live: null,
  },
  {
    id: 'hackfinder',
    title: 'HackFinder',
    summary: 'Team matching for hackathons, by skill and by requirement.',
    detail:
      'Solves the pre-hackathon scramble: find a team or fill the gaps in your own, matched on the skills each side actually needs rather than on who posted most recently.',
    tags: ['React.js', 'JavaScript', 'Matching'],
    year: '2025',
    repo: 'https://github.com/DeepanshuSagore/HackFinder',
    live: 'https://hack-finder-omega.vercel.app/',
  },
  {
    id: 'frites',
    title: 'Frites',
    summary: 'A brand site carried entirely by type, motion and art direction.',
    detail:
      'Not an app, and it is here on purpose: product engineering and art direction are different muscles, and this is the evidence for the second one. A single-purpose site for a food brand, with the whole argument made by layout and pacing.',
    tags: ['Next.js', 'TypeScript', 'Art direction', 'Marketing site'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/Frites',
    live: 'https://fritesfr.vercel.app',
  },
  {
    id: 'vaultic',
    title: 'Vaultic',
    summary: 'Every tab you keep meaning to come back to, filed by category.',
    detail:
      'A single home for the sites and tabs you actually reuse, organised under categories instead of buried in a bookmark tree.',
    tags: ['TypeScript', 'React'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/Vaultic',
    live: 'https://vaulticfr.vercel.app',
  },
  {
    id: 'devroad',
    title: 'DevRoad',
    summary: 'Roadmap tracker for developers who keep losing the thread.',
    detail:
      'Track progress through a learning roadmap, so the path you picked in January is still legible in June.',
    tags: ['JavaScript', 'React'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/DevRoad',
    live: 'https://dev-road-beta.vercel.app',
  },
  {
    id: 'portfolio',
    title: 'This site',
    summary: 'The page you are reading, and the way it is built.',
    detail:
      'React 19 and Vite, prerendered to static HTML so first paint needs no JavaScript at all. anime.js is loaded lazily and is never fetched under reduced motion. Three self-hosted variable fonts, with the display face subset by hand from 131KB to 56KB. The design system was written down before the first component was.',
    tags: ['React 19', 'Vite', 'anime.js', 'Tailwind v4'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/portfolio',
    live: 'https://deepanshupotfolio.vercel.app',
  },
] as const;

export type Experience = {
  role: string;
  company: string;
  period: string;
  /** Framing for the annotation layer. States nothing the points do not. */
  note: string;
  tags: readonly string[];
  points: readonly string[];
};

export const experience: readonly Experience[] = [
  {
    role: 'Coding Specialist',
    company: 'Outlier',
    period: 'Feb 2026 – Aug 2026',
    note: 'Six months spent finding where good models fail.',
    tags: ['LLM evaluation', 'Multimodal SWE', 'Multi-Bench', 'Rubrics'],
    points: [
      'Worked across Multimodal SWE and Multi-Bench, two AI training and evaluation projects.',
      'Reviewed and tested AI-generated code across single-turn and multi-turn tasks, judged on correctness, reasoning, instruction following and engineering quality.',
      'Wrote hard coding tasks and edge cases designed to expose failure modes in advanced models.',
      'Scored outputs against detailed rubrics and wrote the structured feedback that went back into training.',
    ],
  },
  {
    role: 'LLM Post Trainer',
    company: 'Ethara.ai',
    period: 'Nov 2025 – Feb 2026',
    note: 'The part of the work that happens after pre-training.',
    tags: ['Post-training', 'Prompt design', 'Dataset annotation', 'Alignment'],
    points: [
      'Reviewed, corrected and optimised model responses to improve what the next version learned from.',
      'Annotated datasets and wrote structured feedback against alignment and performance goals.',
      'Wrote and evaluated prompts that test reasoning, creativity and factual correctness.',
    ],
  },
  {
    role: 'SMM and Graphic Designer',
    company: 'Maica Plastiwood',
    period: 'Apr 2023 – Apr 2024',
    note: 'Before the AI work: a year of design and demand.',
    tags: ['Instagram', 'Copywriting', 'Graphic design', 'Reels'],
    points: [
      'Ran the Instagram account, dealing directly with creators and prospective investors.',
      'Wrote the product copy that carried the brand day to day.',
      'Designed the posts and reels the products appeared in.',
    ],
  },
] as const;

/* Order mirrors profile.role: build track first, analyst track second. */
export const stack = [
  {
    label: 'Building',
    items: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'TypeScript', 'Tailwind CSS', 'Git'],
  },
  { label: 'GenAI', items: ['LangChain', 'LangGraph', 'Prompt design', 'LLM evaluation', 'RAG'] },
  { label: 'Data', items: ['MongoDB', 'PostgreSQL', 'MySQL', 'Supabase', 'ChromaDB'] },
  {
    label: 'Analytics',
    items: ['SQL', 'Advanced Excel', 'Google Sheets', 'Pivots & lookups', 'Dashboards', 'Python', 'Tableau'],
  },
  {
    label: 'Operations',
    items: [
      'Process improvement',
      'Quality rubrics',
      'Reviewer calibration',
      'Category improvement',
      'Stakeholder management',
    ],
  },
  {
    label: 'Business',
    items: ['Demand generation', 'Market research', 'Content & copy', 'Community'],
  },
] as const;

export const education = [
  {
    period: '2022 – 26',
    title: "Bachelor's Degree",
    org: 'Acropolis Institute of Technology and Research',
    meta: '',
  },
  { period: '2021 – 22', title: 'Class 12th', org: 'CBSE', meta: '81%' },
  { period: '2019 – 20', title: 'Class 10th', org: 'CBSE', meta: '93%' },
] as const;

export const certificates = [
  { org: 'Deloitte', title: 'Data Visualisation' },
  { org: 'Microsoft SAP', title: 'MERN Stack (60-day workshop)' },
  { org: 'Udemy', title: 'React.js Crash Course' },
] as const;

export const achievements = [
  'Winner, Google AI Hackathon (AIPL): scoped, built and pitched a working solution against a fixed deadline',
  'Lead Member, Debate Club at the Entrepreneurship Development Cell, since 2022',
  'Ran freelance content and social media for several creators alongside full-time work',
] as const;

export const interests = [
  'Consumer behaviour and market strategy',
  'Public speaking',
  'Human psychology',
  'Philosophical literature',
] as const;

/**
 * Counters in the About section.
 *
 * Nothing here is typed by hand any more. Two of the four are read straight
 * off the generated GitHub artefact and the third is the length of the list
 * above, so a stat cannot drift away from the thing it counts - which is
 * exactly how the old "10 shipped projects" survived past the point where
 * there were fifteen.
 */
export const stats = [
  { value: 2, suffix: '', label: 'Years of work experience' },
  { value: projects.length, suffix: '', label: 'Projects on this page' },
  { value: github.deployed, suffix: '', label: 'Live deployments' },
  { value: github.publicRepos, suffix: '', label: 'Public repositories' },
] as const;

export const navLinks = [
  { href: '#work', label: 'Work' },
  { href: '#stack', label: 'Stack' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
] as const;
