# Evolution Civilization Simulator — TODO

Legend: [ ] not started · [~] in progress · [x] complete

## M0 — Repository foundation
- [x] Vite + React + TypeScript app
- [x] Source directory structure
- [x] Test framework
- [x] Typecheck script
- [x] Production build script
- [ ] Lint/format setup
- [x] Initial game shell
- [x] Simulation/UI boundary docs
- [x] Versioned save schema placeholder
- [ ] GitHub Pages deployment path verified

## M1 — Deterministic simulation kernel

> Vertical-slice kernel is implemented; command/event primitives, snapshot/restore, scheduler, and debug inspector remain.
- [x] Simulation clock
- [ ] Configurable time scale
- [x] Seeded RNG
- [x] Stable entity IDs
- [ ] Tick scheduler
- [ ] Command/event primitives
- [x] World state root
- [ ] Snapshot/restore interfaces
- [x] Deterministic replay test
- [ ] Simulation debug inspector

## M2 — Founders and human life cycle
- [x] Citizen schema
- [x] Exactly two founders
- [x] Founder immortality
- [x] Normal aging
- [x] Life stages
- [x] Hunger
- [x] Thirst
- [x] Energy/fatigue
- [x] Baseline health
- [ ] Injury state
- [x] Descendant death
- [ ] Death causes
- [ ] Selected-citizen UI
- [x] Birth/death tests

## M3 — Families and genetics
- [x] Parent references
- [x] Child queries
- [x] Sibling relationships
- [x] Spouse/partner relationship
- [ ] Household model
- [x] Compact genome
- [x] Trait inheritance
- [x] Trait variation
- [ ] Fertility
- [ ] Pregnancy/birth flow
- [x] Genealogy queries
- [ ] Family-tree UI
- [x] Genetics UI
- [x] Inheritance tests

## M4 — Primitive survival
- [ ] Resource types
- [ ] Food
- [ ] Water
- [ ] Wood
- [ ] Stone
- [ ] Gathering
- [ ] Hunting
- [ ] Carrying/storage
- [ ] Fire system
- [ ] Fire maintenance
- [ ] First shelter
- [ ] Early-world map
- [ ] Survival alerts
- [ ] Playable 2-founder survival loop

## M5 — Work and production
- [ ] Job system
- [ ] Gatherer
- [ ] Hunter
- [ ] Builder
- [ ] Firekeeper/cook
- [ ] Toolmaker
- [ ] Skill levels
- [ ] Work productivity
- [ ] Inventory/storage
- [ ] Household consumption
- [ ] Work-assignment commands
- [ ] Job UI
- [ ] Production diagnostics

## M6 — Settlement growth
- [ ] Hut/house
- [ ] Storage building
- [ ] Workshop
- [ ] Farm
- [ ] Well/water infrastructure
- [ ] Building costs
- [ ] Construction jobs
- [ ] Roads/paths
- [ ] Population dashboard
- [ ] Camp/village visual progression
- [ ] Village milestone
- [ ] Long-running population test

## M7 — Technology and education
- [ ] Technology schema
- [ ] Prerequisites
- [ ] Research project schema
- [ ] Fire/tools technology
- [ ] Agriculture
- [ ] Pottery/storage
- [ ] Writing/calendar
- [ ] Metalworking
- [ ] Education levels
- [ ] School building
- [ ] Apprenticeships
- [ ] Advanced professions
- [ ] Technology UI
- [ ] Research queue

## M8 — Exploration and resource nodes
- [ ] World regions
- [ ] Resource nodes
- [ ] Exploration command
- [ ] Expedition entity
- [ ] Expedition supplies
- [ ] Expedition members
- [ ] Travel time
- [ ] Discovery results
- [ ] Expedition injury/disease risk
- [ ] Return/supply behavior
- [ ] Exploration UI
- [ ] Regional resource overview

## M9 — Health depth and living history
- [ ] Disease model
- [ ] Disease transmission hooks
- [ ] Chronic conditions
- [ ] Age-related decline
- [ ] Sanitation modifier
- [ ] Medical care hooks
- [ ] Healthcare professions
- [ ] Chronicle schema
- [ ] Event-to-chronicle translation
- [ ] Notable-citizen detection
- [ ] Citizen life-history view
- [ ] Civilization timeline

## M10 — Kingdom/city systems
- [ ] Royal authority layer
- [ ] Titles
- [ ] Laws
- [ ] Command audit/history
- [ ] Military/security foundations
- [ ] Larger civic buildings
- [ ] City districts
- [ ] Capital administration
- [ ] Population specialization
- [ ] Major-city overview
- [ ] Consequences for high-impact commands

## M11 — Industrial/modern transformation
- [ ] Steam/industrial prerequisites
- [ ] Factories
- [ ] Coal/oil/advanced resources
- [ ] Electricity
- [ ] Power infrastructure
- [ ] Transport abstraction
- [ ] Modern sanitation
- [ ] Hospitals/advanced medicine
- [ ] Advanced education
- [ ] Computing/modern technology
- [ ] Modern city visual layer
- [ ] Late-game research

## M12 — Scale, balance, polish
- [ ] Population performance tiers
- [ ] Simulation CPU profiling
- [ ] Rendering profiling
- [ ] Expensive-query optimization
- [ ] Web Worker simulation if needed
- [ ] Simulation LOD/importance rules if needed
- [ ] Save compression/versioning if needed
- [ ] Accessibility pass
- [ ] Responsive UI
- [ ] Onboarding/tutorial
- [ ] Balance pass
- [ ] Long-session soak tests
- [ ] Crash/error recovery
- [ ] Final deployment workflow

## Always-on quality
- [ ] No game rule only exists inside UI components
- [ ] Important randomness uses seeded RNG
- [ ] Simulation rules have tests
- [ ] Saves survive schema evolution
- [ ] Large loops are profiled
- [ ] New dependencies are justified
- [ ] Architecture changes are documented
- [ ] TODO reflects actual repository state

## Definition of done for each milestone
- [ ] Implementation works
- [ ] Relevant automated tests pass
- [ ] Typecheck passes
- [ ] Production build passes
- [ ] Visual/runtime checks pass for UI work
- [ ] Documentation updated where needed
- [ ] TODO status updated
## Genetics-specific acceptance checklist
- [x] Create separate Genetic Technology Tree data model
- [x] Distinguish genetic technology unlock from genetic trait inheritance
- [x] Add founder-only genetic modification state
- [x] Support active founder genetic upgrades
- [ ] Support passive founder genetic upgrades
- [x] Track genetic technology provenance on founder traits
- [x] Implement founder × founder inheritance
- [ ] Implement founder × NPC royal offspring inheritance
- [ ] Implement royal descendant × NPC inheritance
- [ ] Implement NPC × NPC ordinary inheritance with no genetic-tech advancement
- [ ] Prevent NPC breeding from unlocking genetic technologies
- [x] Add Royal/Founder genetic heritage classification
- [ ] Expose trait provenance in citizen genetics UI
- [ ] Add automated tests proving NPCs cannot create genetic improvements
- [x] Add automated tests proving founder upgrades can propagate through descendants
- [x] Add automated tests proving founders remain immortal
