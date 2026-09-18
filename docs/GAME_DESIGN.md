# Core Game Design

## Player role
The player is the ruling authority of a civilization founded by two immortal humans. The player governs, prioritizes, assigns, builds, researches, explores, and intervenes.

## Founders
There are exactly two starting founders: one male and one female. Both are immortal. The player can choose the primary ruler's gender/role presentation. Founders are permanent anchors of civilization history and genealogy.

## Descendants
All descendants are mortal. They are born, grow through life stages, learn, work, form relationships, reproduce, age, become elderly, and die.

## Population philosophy
Every citizen is meaningful and inspectable: life, family, genetics, job, skills, needs, health and historical events.

## Civilization philosophy
One main capital/urban center is the heart of the civilization. The wider world is primarily for exploration, resource nodes, supply/extraction opportunities, hazards and discoveries.

## Early survival fantasy
The opening requires water, food, shelter, fire, tools and safe storage. The first major achievement is surviving long enough for the first generation of children to appear.

## Generational fantasy
The founders remember the beginning while later generations inherit a civilization they did not build. A late-generation citizen may have never seen the primitive camp their ancestors lived in.

## Supreme Founder Genetics System

Genetics has a deliberate asymmetry. Ordinary NPCs do not independently invent, research, or add new genetic improvements.

### Founder-only genetic progression
The civilization has a dedicated Genetic Technology Tree. Genetic technologies are researched/unlocked by the civilization, but their biological application is restricted to the immortal King/Queen founders unless a future design explicitly introduces another mechanism.

A genetic technology can be:
- an active founder modification chosen by the player
- a passive founder modifier that becomes active after unlock
- a prerequisite node leading to stronger genetic technologies
- a founder breeding enhancement that affects descendants

Example future nodes include Enhanced Longevity, Superior Disease Resistance, Enhanced Strength, Enhanced Endurance, Accelerated Learning, Improved Fertility, Regenerative Health, Environmental Resistance and Advanced Genetic Optimization. These are design examples, not final balance.

### Inheritance rule
When a founder breeds, descendants may inherit the founder's unlocked/applied genetic traits according to the inheritance rules. Founder genetic state is distinct from ordinary NPC genetics.

A founder child must carry founder-derived genetic potential in a traceable way. Expression can depend on the other parent's genetics and the trait's inheritance mode, but founder-origin improvements remain identifiable.

### No ordinary NPC genetic advancement
Normal NPC breeding does not unlock genetic technologies and does not create deliberate genetic improvements.

Normal NPCs can inherit traits, pass inherited traits to children, experience normal genetic variation allowed by the simulation, and express different combinations of existing traits.

They cannot create a new civilization-level genetic upgrade by breeding.

**Natural inheritance is not genetic research.**

### Founder supremacy
Direct founder offspring are intended to have superior biological potential compared with descendants produced solely by ordinary NPC-to-NPC breeding under comparable conditions.

This should be represented explicitly, not as an unexplained arbitrary stat bonus.

Founder offspring may receive a `FounderBloodline` / `RoyalGeneticHeritage` classification and can access founder-derived genetic potential.

The player should be able to inspect:
- which founder contributed a trait
- which genetic technologies affected the parent
- which inherited founder traits the child carries
- which traits came from the non-founder parent
- which traits are expressed
- which traits remain latent

### Breeding hierarchy
1. Founder × Founder — highest access to founder genetic modifications and royal lineage.
2. Founder × NPC — direct royal offspring with founder-derived genetic potential.
3. Royal descendant × NPC — can inherit founder-derived traits carried by the royal descendant, subject to inheritance rules.
4. NPC × NPC — ordinary inherited genetics only; no deliberate genetic improvement.

This hierarchy is a game mechanic and should not be presented as a claim about real human biology.

### Implementation rule
Do not implement royal superiority as a hidden arbitrary +50 stat.

Represent:
- genetic origin
- inherited alleles/trait values
- founder modification records
- genetic technology IDs
- expression/latent state
- inheritance provenance

This makes the system inspectable and allows the player to understand why a royal descendant differs from an ordinary citizen.

## Technology philosophy
Technology should change what is possible: unlock buildings/jobs, reduce constraints, improve production, reduce mortality, improve travel, unlock education/research, and alter the visual city. Avoid technology being only percentage bonuses.

## Historical record
The civilization maintains a chronicle generated from simulation facts. Record major founding events, births, deaths, discoveries, buildings, disasters, expeditions, notable people, royal commands and population milestones.

## Player commands
Eventually support work assignment, training, education, promotion, titles, movement, expeditions, construction, research, laws, arrest, exile and execution. High-impact commands have consequences.

## Visual direction
Prioritize readable silhouettes, clear resource/building feedback, strong day/season/time cues, visible settlement evolution, recognizable districts and detailed citizen inspection UI.

## Late-game payoff
The player can look back over centuries and understand population growth, important families, technological discoveries, disasters, capital transformation and each citizen's distance from the founders.

The civilization itself is the story.