import type {ResourceKind} from "./types";

export type EventChoiceEffect = {
  resources?: Partial<Record<ResourceKind, number>>;
  health?: number;
  hunger?: number;
  thirst?: number;
  fatigue?: number;
  chronicle: string;
};

export interface SimulationEvent {
  id: string;
  title: string;
  text: string;
  choices: { id: string; label: string; description: string; effect: EventChoiceEffect }[];
}

export const YEARLY_EVENTS: SimulationEvent[] = [
  {
    id: "stranger-at-fire",
    title: "A Stranger at the Fire",
    text: "At dusk, a lone traveler appears beyond the campfire. They carry useful knowledge, but your stores are not endless.",
    choices: [
      { id: "welcome", label: "Welcome them", description: "Share food and hear their story.", effect: { resources: { food: -6 }, chronicle: "The dynasty welcomed a traveler and traded food for stories." } },
      { id: "trade", label: "Offer a trade", description: "Exchange materials for practical knowledge.", effect: { resources: { wood: -3, stone: -2 }, chronicle: "A traveler traded practical knowledge for building materials." } },
      { id: "send-away", label: "Send them away", description: "Protect the camp's stores.", effect: { chronicle: "A stranger was turned away from the founding camp." } }
    ]
  },
  {
    id: "abundant-harvest",
    title: "A Season of Plenty",
    text: "Wild plants fruit heavily this year. The camp can invest the surplus now or simply enjoy the easy season.",
    choices: [
      { id: "gather", label: "Gather aggressively", description: "Put workers on the harvest.", effect: { resources: { food: 16 }, fatigue: 4, chronicle: "A season of plenty added a large food reserve." } },
      { id: "preserve", label: "Preserve the surplus", description: "Spend effort making stores last longer.", effect: { resources: { food: 9, wood: -2 }, chronicle: "The dynasty preserved surplus food for harder seasons." } },
      { id: "rest", label: "Let people rest", description: "Take the abundance as a chance to recover.", effect: { fatigue: -8, chronicle: "The people used an abundant season to recover their strength." } }
    ]
  },
  {
    id: "stone-vein",
    title: "Stone Beneath the Camp",
    text: "Workers uncover a vein of unusually workable stone. It could accelerate construction, but extracting it takes effort.",
    choices: [
      { id: "quarry", label: "Open a quarry", description: "Commit labor to the new source.", effect: { resources: { stone: 14 }, fatigue: 5, chronicle: "A useful stone vein was opened near the camp." } },
      { id: "stock", label: "Mark the site", description: "Save the discovery for a future settlement.", effect: { resources: { stone: 5 }, chronicle: "The dynasty marked a promising stone site for later development." } },
      { id: "ignore", label: "Ignore it", description: "Keep everyone focused on current priorities.", effect: { chronicle: "A promising stone site was left untouched." } }
    ]
  },
  {
    id: "sickness",
    title: "A Child Falls Ill",
    text: "One of the younger members of the dynasty develops a sudden fever. The camp has no formal healer.",
    choices: [
      { id: "care", label: "Care for them", description: "Have the adults stop work and provide constant care.", effect: { resources: { food: -4, water: -5 }, fatigue: 6, chronicle: "The camp rallied around a sick child and provided intensive care." } },
      { id: "rest", label: "Isolate and rest", description: "Reduce contact and let the body recover.", effect: { resources: { water: -3 }, chronicle: "A sick child was isolated while the camp waited for recovery." } },
      { id: "risk", label: "Keep working", description: "Protect the settlement's production.", effect: { health: -8, chronicle: "The camp prioritized production during a dangerous illness." } }
    ]
  },
  {
    id: "family-dispute",
    title: "A Family Dispute",
    text: "Two adults clash over who should lead an important task. Your ruling style will shape how future commands are understood.",
    choices: [
      { id: "king", label: "Back the current order", description: "Make authority clear.", effect: { chronicle: "The ruler upheld the existing chain of command during a family dispute." } },
      { id: "merit", label: "Let merit decide", description: "Choose the person with the stronger aptitude.", effect: { fatigue: 2, chronicle: "A family dispute was settled by merit rather than rank." } },
      { id: "share", label: "Split the task", description: "Make both sides responsible.", effect: { resources: { food: 2 }, chronicle: "A family dispute ended with shared responsibility." } }
    ]
  }
];

export const eventForYear=(tick:number):SimulationEvent|undefined=>{
  if(tick<2)return undefined;
  const event=YEARLY_EVENTS[(tick-2)%YEARLY_EVENTS.length];
  return event;
};
