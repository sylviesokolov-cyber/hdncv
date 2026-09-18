# Evolution Civilization Simulator — Master Plan

## Vision
Build a browser-based civilization simulator where the main story is the lives of individual humans and the generations they create.

Start with two immortal founders. Develop fire, food, water, shelter and tools. Raise children who become normal mortal adults. Expand into a permanent settlement, one dominant capital/city, and an advanced civilization. Explore the wider world for resource nodes and supply opportunities.

## Core gameplay pillars
- People: every citizen is a persistent individual.
- Families: genealogy, households, spouses, siblings, parents and descendants.
- Survival: food, water, shelter, heat, health, disease and injury.
- Work: citizens learn skills and perform actual jobs.
- Technology: prerequisites unlock real capabilities and new professions.
- Geography: one dominant capital plus an explorable support world.
- History: births, deaths, discoveries, disasters and achievements form a living chronicle.

## First principles
- The two founders are always immortal.
- Descendants age and can die.
- The player governs through commands rather than directly puppeteering every person.
- Simulation logic is independent of UI code.
- Random systems are reproducible with seeds.
- The player can inspect an individual citizen at any time.
- Major outcomes must be explainable from simulation state.

## Human simulation
Each citizen eventually contains:
- identity: stable ID, name, sex, generation, birth/death time, founder flag
- genetics: longevity, disease resistance, strength, endurance, intelligence, fertility, learning aptitude and other traits
- physical state: age, health, hunger, thirst, fatigue, temperature, hygiene, injuries, disease
- social state: family links, relationships, stress, happiness, belonging, loyalty
- work state: education, skills, occupation, experience, productivity
- history: jobs, education, illnesses, injuries, marriages, children, achievements and death

Life stages should be explicit and configurable: infant, child, adolescent, adult, mature adult, elder.

## Genetics
Use a compact game-oriented inheritance model. Do not attempt a full biological genome simulation.

Genetics influence probabilities rather than determining outcomes. Longevity should combine inherited traits with nutrition, health, disease, injury, environment, medicine and age-related decline.

## Core resource/economy flow
Prefer visible resource chains over abstract numbers.

Examples:
- farms -> grain -> storage -> households -> consumption
- mines -> ore -> smelter -> metal -> workshop -> tools
- power -> electricity -> factories -> goods -> households/city

## Early survival loop
1. Spawn founders.
2. Locate water/resources.
3. Gather food.
4. Gather wood, stone and fiber.
5. Make primitive tools.
6. Create fire.
7. Build a first shelter.
8. Stabilize food/water.
9. Raise the first child.
10. Watch later generations grow into workers.

## Technology progression
Target eras:
- Era 0: Primitive survival — fire, stone tools, gathering, hunting, water, tents.
- Era 1: Settlement — farming, storage, huts, crafting.
- Era 2: Early civilization — writing, calendar, administration, roads, pottery, early metals.
- Era 3: Classical/pre-industrial — iron, advanced construction, trade, mathematics, organized institutions.
- Era 4: Medieval/pre-modern — printing, universities, finance, advanced agriculture.
- Era 5: Industrial — steam, factories, rail, mass production.
- Era 6: Electrical/modern — electricity, sanitation, hospitals, communications, modern industry.
- Era 7: Advanced contemporary — computing, advanced medicine, automation, robotics, advanced research.

Technology must change what people can do, not only provide percentage bonuses.

## World design
The world contains the starting region, terrain, water, forests, fertile land, stone, mineral/metal nodes and special locations.

The capital remains the civilization's primary city. The outer world is mainly for exploration, resource extraction, supply and discoveries.

Do not begin by building a many-city empire management game.

## City progression
Primitive: fire pit, tents, paths, simple storage.

Village: huts, farms, wells, workshops.

Town: roads, houses, market, school, walls, civic buildings.

City: districts, hospitals, university, palace/royal district, specialized industry.

Modern: dense housing, utilities, transportation, hospitals, research districts, factories and modern infrastructure.

The city should feel like the same settlement evolving over centuries.

## Commands
Eventually the sovereign can issue:
- assign job
- move
- train
- educate
- promote
- grant title
- retire
- construct
- prioritize resource
- research
- send expedition
- enact law
- arrest
- exile
- execute

Player commands must be validated by the simulation and produce consequences in people, economy and history.

## Command/event separation
Keep player intent separate from simulation facts.

Example:
AssignJobCommand -> CitizenJobChangedEvent -> production/economy changes -> ChronicleEntryCreatedEvent

This will make debugging, testing and future replay support easier.

## Historical chronicle
Record major founding events, births, deaths, discoveries, buildings, disasters, expeditions, technology unlocks, notable citizens, major population milestones and significant royal commands.

Chronicle entries should be structured facts rendered into readable history.

## UX priorities
The interface should quickly answer:
1. What is happening now?
2. What does the civilization need?
3. What should I do next?
4. What happened to my people?

Core views: world/capital, resources, population, selected citizen, family tree, jobs, technology/research, exploration, chronicle, alerts, save/load.

## Architecture
Preferred stack: TypeScript + React + Vite. Use Canvas/WebGL for the world as needed, Web Worker for heavier simulation, and IndexedDB for local saves.

Suggested source areas:
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

## Performance architecture
Use simulation ticks rather than per-frame NPC thinking. Batch low-frequency systems, cache derived values, and profile real population sizes before optimizing.

Move simulation to a Web Worker when complexity or population scale requires it.

## Save design
Support versioned serializable simulation state. Plan for named slots, export/import and migrations.

## MVP
The first playable version is complete when a player can start with the two founders, gather food/water/materials, create fire, build shelter, have a child, watch descendants age, assign work, see needs change, experience basic illness/injury, observe descendant death, inspect family links, and save/reload.

Not MVP: multiplayer, accounts, diplomacy, huge maps, all technology eras, massive combat, procedural 3D, or a large backend.

## Milestone sequence
- M0: Repository foundation and toolchain.
- M1: Deterministic simulation kernel.
- M2: Founders, aging, life stages, needs, health, mortality.
- M3: Families, reproduction, genetics, genealogy.
- M4: Primitive survival: food, water, materials, fire, shelter.
- M5: Jobs, skills, storage, production and households.
- M6: Settlement growth and capital rendering.
- M7: Technology, research, education and advanced jobs.
- M8: Exploration, resource nodes and expeditions.
- M9: Deeper health, chronicle and notable citizens.
- M10: Kingdom/city systems, titles, laws, administration, security.
- M11: Industrial/modern transformation.
- M12: Scale, performance, balance, accessibility and polish.

## Success criteria
Prioritize simulation correctness, meaningful generational progression, understandable cause/effect, save integrity, long-session stability, population-scale performance, visual clarity, and attachment to individual citizens.

Do not measure progress only by lines of code or number of screens.

## Scope guardrails
Defer multiplayer, server economies, complex diplomacy, giant combat systems, fully autonomous social AI and advanced 3D rendering until the core life/civilization loop is stable and enjoyable.
## Founder genetic technology branch

Genetic progression is a separate technology branch. Civilization research can unlock genetic technologies, but deliberate genetic improvements are applied only to the immortal King/Queen founders. Ordinary NPCs cannot independently create genetic improvements through breeding or research.

Founder genetic upgrades can be active player-selected modifications or passive founder effects. Founder-applied traits can propagate through descendants according to explicit inheritance rules and must retain provenance. Direct founder offspring are a distinct royal genetic tier; ordinary NPC × NPC offspring receive only ordinary inherited genetics. Royal descendants can pass founder-derived traits they carry, subject to inheritance rules.

The simulation must distinguish genetic inheritance from genetic advancement. Natural variation may exist, but it must not unlock new genetic technology.

The player should be able to inspect the provenance of inherited traits and the genetic technologies responsible for founder modifications.
