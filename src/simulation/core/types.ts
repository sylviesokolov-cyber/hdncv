export type Sex = "male" | "female";
export type LifeStage = "infant"|"child"|"adolescent"|"adult"|"matureAdult"|"elder";
export type CitizenId = string;

export type OrderKind =
  | "idle" | "work" | "task" | "research" | "build" | "search"
  | "joinParty" | "lead" | "move" | "breed";

export interface CitizenOrder {
  kind:OrderKind;
  label:string;
  targetId?:CitizenId;
  targetName?:string;
  startedTick:number;
}

export interface Pregnancy {
  motherId:CitizenId;
  fatherId:CitizenId;
  conceptionTick:number;
  dueTick:number;
}

export interface Genome {
  longevity:number; diseaseResistance:number; strength:number; endurance:number;
  intelligence:number; fertility:number; learning:number;
  founderOrigin?:"king"|"queen";
  geneticTechIds:string[];
}

export interface Citizen {
  id:CitizenId; name:string; sex:Sex; generation:number;
  birthTick:number; deathTick?:number; founder:boolean;
  genome:Genome; lifeStage:LifeStage; ageYears:number;
  health:number; hunger:number; thirst:number; fatigue:number;
  parentIds:CitizenId[]; childIds:CitizenId[]; spouseId?:CitizenId;
  pregnancy?:Pregnancy;
  royalGeneticHeritage:boolean;
  needPriority:number;
  job?:string;
  order?:CitizenOrder;
}

export interface SimulationResources {
  food:number;
  water:number;
  wood:number;
  stone:number;
}

export interface SimulationState {
  version:1; seed:number; tick:number;
  founders:{kingId:CitizenId;queenId:CitizenId};
  nextCitizenNumber:number;
  citizens:Record<CitizenId,Citizen>;
  resources:SimulationResources;
  chronicle:string[];
}

export interface GeneticTechnology {
  id:string; name:string; description:string; cost:number;
  mode:"activeFounder"|"passiveFounder"|"breeding";
  prerequisiteIds:string[];
}
