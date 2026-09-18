# AI Agent Instructions — Evolution Civilization Simulator

## Repository rule
This repository is the single source of truth for this game: https://github.com/sylviesokolov-cyber/hdncv

Do not reference, depend on, copy from, or browse other GitHub repositories for implementation guidance unless the human owner explicitly asks. Work from this repository, official package/documentation sources when needed, and the project docs.

## Product contract
Build a browser-based, highly immersive civilization evolution simulator.

The player starts with exactly two special founders: one male and one female. The founders are immortal. Their descendants are ordinary mortals who are born, grow, learn, work, reproduce, age, become elderly, and die.

The civilization should progress from primitive survival to a large, mostly unified capital/empire and gradually unlock advanced technology.

Core fantasy: watch individual humans live real simulated lives while their civilization evolves across generations.

## Non-negotiable simulation principles
1. Every citizen is a persistent entity with a stable ID.
2. Parents, children, siblings, spouses, ancestors, descendants, and households must be queryable.
3. The two founders are immortal; descendants follow normal mortality rules.
4. Simulation state, not UI code, owns game rules.
5. Important random behavior uses a seeded/random-source abstraction.
6. Expensive NPC logic must not run for every citizen every animation frame.
7. Births, deaths, careers, discoveries, disasters, achievements, and notable people can become persistent history.
8. Technology is gated by prerequisites and changes what the civilization can actually do.
9. Player orders are commands into the simulation; commands must produce real consequences.

## Preferred architecture
- TypeScript
- React
- Vite
- Canvas/WebGL only as needed for world rendering
- Web Worker for heavier simulation once justified
- IndexedDB for local persistent saves
- UI state separated from simulation state

Suggested folders:
src/app/
src/simulation/core/
src/simulation/time/
src/simulation/citizens/
src/simulation/genetics/
src/simulation/health/
src/simulation/needs/
src/simulation/relationships/
src/simulation/reproduction/
src/simulation/jobs/
src/simulation/economy/
src/simulation/technology/
src/simulation/world/
src/simulation/exploration/
src/simulation/events/
src/simulation/chronicle/
src/world/
src/ui/
src/save/
src/data/
tests/
docs/

## Simulation boundaries
Simulation owns: time, randomness, ticks, citizen state, needs, health, aging, death, births, relationships, jobs, production, technology, exploration, events, and history.

UI owns: panels, controls, camera, rendering, selection, filters, presentation, and feedback.

The UI may issue commands, but the simulation validates and applies them.

## Citizen model
Over time a citizen should support:
- identity: ID, name, sex, generation, birth/death time, founder flag
- genetics: longevity, disease resistance, strength, endurance, intelligence, fertility and related traits
- physical state: age, health, hunger, thirst, fatigue, temperature exposure, hygiene, injuries, diseases
- social state: family, friends, belonging, stress, happiness, loyalty
- work state: education, skills, occupation, experience, productivity
- relationships: parents, children, siblings, spouse/partner, household
- history: jobs, education, illness, injury, marriage, children, achievements, death cause/location

Do not implement every field at once. Add systems milestone by milestone.

## Life and genetics rules
Use explicit configurable life stages such as infant, child, adolescent, adult, mature adult, and elder.

Use a game-oriented inheritance model rather than a full biological genome simulator. Genetics should influence probabilities, not rigidly determine outcomes.

Longevity should emerge from genetics plus nutrition, health, disease, injury, environment, medicine, and age-related decline.

## Command model
Eventually support commands such as:
- assign job
- move
- train
- educate
- promote
- grant title
- retire
- construct
- research
- send expedition
- enact law
- arrest
- exile
- execute

High-impact commands should be recorded and have simulation consequences.

## Performance
Prefer fixed/timed simulation ticks, batching, cached derived values, event queues, and Web Workers where needed.

Do not optimize blindly. Measure population scale and profile expensive systems before deep optimization.

## Save-game rules
Important simulation state must be serializable. Plan for named saves, export/import, and versioned save migrations.

Never make saves depend on transient React component state.

## Testing minimum
Test aging, founder immortality, descendant death, birth/reproduction, inheritance, needs, health transitions, work/production, command validation, deterministic seeded scenarios, and save/load round trips.

Every important simulation bug should gain a regression test when practical.

## Agent workflow
Before editing:
1. Read AGENTS.md.
2. Read README.md and relevant docs.
3. Inspect actual code; do not assume the plan matches implementation.
4. Identify the smallest coherent milestone.
5. Add/adjust tests alongside behavior where practical.

While editing:
- Keep the change scoped.
- Avoid unrelated refactors.
- Do not silently change game rules.
- Update documentation when architecture or rules change.

Before finishing:
- run tests
- run typecheck
- run production build
- check for obvious runtime/console errors
- update TODO.md
- report what changed and what remains

## Definition of done
A task is complete only when implementation, appropriate tests, docs, build/typecheck, and TODO status are all aligned.

## Git discipline
Use small meaningful commits such as docs:, feat(sim):, feat(ui):, fix(sim):, test(sim):, refactor:, chore:.

Do not rewrite history unless explicitly requested.

## Avoid these anti-patterns
- building only a decorative city-builder UI
- representing citizens only as population counts
- putting game logic inside React components
- running expensive AI for every NPC every render frame
- unseeded randomness that cannot be reproduced
- coupling saves to UI state
- building all technology eras before the primitive loop is fun
- adding a backend before it is justified
- replacing simulation with canned scripted outcomes
- copying code or architecture from unrelated GitHub repositories