# Evolution Civilization Simulator

A browser-based civilization evolution simulator centered on individual human lives, genetics, families, survival, technology, exploration, and multi-generational history.

## Start here
- `AGENTS.md` — required instructions for AI agents and contributors.
- `PROJECT_PLAN.md` — product architecture, simulation principles, milestones, and scope.
- `TODO.md` — implementation checklist.

## Project rule
Work in this repository only. Do not reference, depend on, copy from, or browse other GitHub repositories unless the human owner explicitly requests it.

## Current state
The repository is at the documentation/bootstrap stage. The next implementation milestone is M0/M1: establish the Vite + React + TypeScript application and a deterministic simulation kernel before expanding the UI.

## Deployment
`.github/workflows/deploy-pages.yml` builds the production bundle with Vite and publishes it to GitHub Pages on every push to `main`. In the repository's Settings → Pages, the source must be set to "GitHub Actions" (not "Deploy from a branch") for this workflow to take effect.

## Core fantasy
Start with two immortal founders. Build a civilization from primitive survival to a large, mostly unified capital, while every descendant lives a simulated life with needs, work, relationships, genetics, aging, and mortality.