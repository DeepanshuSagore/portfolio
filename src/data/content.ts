/**
 * Single source of truth for every fact rendered on this site.
 *
 * Everything here is drawn from one of two places: Deepanshu's CV, or the live
 * GitHub API / repository READMEs (fetched 2026-08-21). Nothing is invented —
 * projects without a public repository are marked so, and no link is emitted
 * for a destination that does not exist.
 */

export const profile = {
  name: 'Deepanshu Sagore',
  firstName: 'Deepanshu',
  lastName: 'Sagore',
  role: 'GenAI & Full-Stack Engineer',
  location: 'Indore, India',
  email: 'deepanshusagore@gmail.com',
  phone: '+91 6263364050',
  github: 'https://github.com/DeepanshuSagore',
  githubHandle: 'DeepanshuSagore',
  linkedin: 'https://www.linkedin.com/in/deepanshusagore',
  linkedinHandle: 'deepanshusagore',
  resume: '/Deepanshu-Sagore-Resume.pdf',
  /* Verbatim from the GitHub profile bio. */
  tagline: 'enslaved by narcissism and logical thinking.',
  intro:
    'I build retrieval-grounded GenAI systems and the full-stack products around them — LangChain pipelines that stay honest about what they know, and React front-ends that make the answer legible.',
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
  /** `null` repo means the source is not public — never render a dead link. */
  note?: string;
};

export const projects: readonly Project[] = [
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
    id: 'aligna',
    title: 'Aligna',
    summary: 'AI talent scouting that turns a job description into a ranked shortlist.',
    detail:
      'Parses job descriptions, scores candidates through a weighted matching model, and runs AI-simulated engagement to qualify them — collapsing the top of the hiring funnel into a data-backed automated workflow.',
    tags: ['Next.js 15', 'Tailwind v4', 'JD Parsing', 'Matching'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/Aligna',
    live: 'https://alignafr.vercel.app',
  },
  {
    id: 'fintrack',
    title: 'FinTrack AI',
    summary: 'Personal finance tracker that reads your receipts for you.',
    detail:
      'Account and transaction management with AI receipt scanning, budget monitoring, and automated email insights — the whole loop from photographing a receipt to getting a spending summary in your inbox.',
    tags: ['Next.js', 'AI Vision', 'Budgeting', 'Automation'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/ai_fintrack',
    live: 'https://fintrack-finai.vercel.app',
  },
  {
    id: 'driveflow',
    title: 'DriveFlow',
    summary: 'Real-time lead CRM built to replace a dealership spreadsheet.',
    detail:
      'Live-syncing lead management for the HSR Motors team: automated lead scoring, a drag-and-drop pipeline, and a dashboard of KPI cards, volume trends, source mix and team performance — every figure computed from live data rather than a static export.',
    tags: ['TypeScript', 'Real-time', 'CRM', 'Dashboards'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/Drive',
    live: 'https://drive-dusky-omega.vercel.app',
  },
  {
    id: 'eventshub',
    title: 'EventsHub',
    summary: 'College events and registrations, from listing to admin approval.',
    detail:
      'Event creation, cross-department listing and one-click student registration, with Firebase Authentication for secure login and an admin dashboard for approving what actually goes live.',
    tags: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Firebase'],
    year: '2025',
    repo: 'https://github.com/DeepanshuSagore/EventsHub',
    live: 'https://eventshub-tan.vercel.app/',
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
    id: 'ticket-classifier',
    title: 'Support Ticket Classifier',
    summary: 'AI ticket triage, built live in about twenty minutes.',
    detail:
      'The take-home set during the Ethara interview: an AI-powered support ticket classifier, implemented on the spot in roughly twenty minutes.',
    tags: ['TypeScript', 'LLM', 'Classification'],
    year: '2026',
    repo: 'https://github.com/DeepanshuSagore/ethara-interview-assignment',
    live: null,
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
] as const;

export type Experience = {
  role: string;
  company: string;
  period: string;
  points: readonly string[];
};

export const experience: readonly Experience[] = [
  {
    role: 'LLM Post Trainer',
    company: 'Ethara.ai',
    period: 'Nov 2025 — Feb 2026',
    points: [
      'Trained and refined large language model outputs by reviewing, correcting and optimising AI-generated responses.',
      'Annotated datasets and provided structured feedback to improve model alignment and performance.',
      'Wrote and evaluated high-quality prompts to test reasoning, creativity and factual correctness.',
    ],
  },
  {
    role: 'SMM & Graphic Designer',
    company: 'Maica Plastiwood',
    period: 'Apr 2023 — Apr 2024',
    points: [
      'Ran the Instagram presence, engaging directly with creators and potential investors.',
      'Wrote product content that reshaped how the brand read to its market.',
      'Produced the graphic posts and reels featuring their product line.',
    ],
  },
] as const;

export const stack = [
  {
    label: 'GenAI',
    items: ['LangChain', 'LangGraph', 'HuggingFace', 'Prompt Engineering', 'LLM Evaluation'],
  },
  { label: 'Languages', items: ['Python', 'JavaScript', 'C++', 'HTML', 'CSS'] },
  { label: 'Frameworks', items: ['React.js', 'Tailwind CSS', 'Node.js', 'Express.js'] },
  { label: 'Databases', items: ['ChromaDB', 'MongoDB', 'MySQL', 'Supabase'] },
  { label: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'OpenCode', 'Vibe-Coding'] },
] as const;

export const education = [
  {
    period: '2022 — 26',
    title: "Bachelor's Degree",
    org: 'Acropolis Institute of Technology and Research',
    meta: 'GPA 6.7 / 10.0',
  },
  { period: '2021 — 22', title: 'Class 12th', org: 'CBSE', meta: '81%' },
  { period: '2019 — 20', title: 'Class 10th', org: 'CBSE', meta: '93%' },
] as const;

export const certificates = [
  { org: 'Microsoft SAP', title: 'MERN Stack — 60 day workshop' },
  { org: 'Deloitte', title: 'Data Visualisation' },
  { org: 'Udemy', title: 'React.js Crash Course' },
] as const;

export const achievements = [
  'Winner — Google AI Hackathon (AIPL)',
  'Content writer and social media manager for multiple creators',
  'Lead Member, Debate Club — Entrepreneurship Development Cell, since 2022',
] as const;

export const interests = [
  'Philosophical & psychological literature',
  'Public speaking and communication',
  'Human psychology',
  'Artificial intelligence',
] as const;

/** Counters in the About section. Each is derived from the data above. */
export const stats = [
  { value: 22, suffix: '', label: 'Public repositories' },
  { value: 10, suffix: '', label: 'Shipped projects' },
  { value: 1, suffix: '', label: 'Hackathon won' },
  { value: 2, suffix: '', label: 'Years building' },
] as const;

export const navLinks = [
  { href: '#work', label: 'Work' },
  { href: '#stack', label: 'Stack' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
] as const;
