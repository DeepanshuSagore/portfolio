/**
 * GENERATED FILE - do not edit by hand.
 * Regenerate with `npm run data:github`. See scripts/github.mjs for why this
 * is a committed artefact rather than a runtime or build-time fetch.
 */

export const github = {
  handle: "DeepanshuSagore",
  url: "https://github.com/DeepanshuSagore",
  /** Everything GitHub counts as public, forks included. */
  publicRepos: 23,
  /** Public repos this account actually wrote. */
  authoredRepos: 21,
  /** Authored repos that contain code, i.e. excluding reserved empty names. */
  repos: 17,
  /** Repos carrying a homepage URL, which for this account means a deployment. */
  deployed: 12,
  firstCommit: "2024-10-20",
  lastPush: "2026-08-24",
  measuredOn: "2026-08-28",
  /** Share of bytes written across every authored repo, largest first. */
  languages: [
    {
      "name": "TypeScript",
      "share": 43.4
    },
    {
      "name": "Python",
      "share": 26.6
    },
    {
      "name": "JavaScript",
      "share": 22.3
    },
    {
      "name": "CSS",
      "share": 6.5
    },
    {
      "name": "Other",
      "share": 1.2
    }
  ],
} as const;

export type Language = (typeof github.languages)[number];
