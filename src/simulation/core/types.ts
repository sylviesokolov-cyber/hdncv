export type Sex = "male" | "female";
export type LifeStage = "infant"|"child"|"adolescent"|"adult"|"matureAdult"|"elder";
export type CitizenId = string;
export type ResourceType = "food"|"water"|"wood"|"stone";
export interface Resources { food:number; water:number; wood:number; stone:number; }
export interface Settlement { shelterLevel:number; fireLit:boolean; }
export interface Pregnancy { motherId:CitizenId; fatherId:CitizenId; conceptionTick:number; dueTick:number; }
export interface Genome { longevity:number; diseaseResistance:number; strength:number; endurance:number; intelligence:number; fertility:number; learning:number; founderOrigin?:"king"|"queen"; geneticTechIds:string[]; }
export interface Citizen { id:CitizenId; name:string; sex:Sex; generation:number; birthTick:number; deathTick?:number; founder:boolean; genome:Genome; lifeStage:LifeStage; ageYears:number; health:number; hunger:number; thirst:number; fatigue:number; parentIds:CitizenId[]; childIds:CitizenId[]; spouseId?:CitizenId; pregnancy?:Pregnancy; royalGeneticHeritage:boolean; }
export interface SimulationState { version:1; seed:number; tick:number; founders:{kingId:CitizenId; queenId:CitizenId}; nextCitizenNumber:number; citizens:Record<CitizenId,Citizen>; chronicle:string[]; resources:Resources; settlement:Settlement; }
export interface GeneticTechnology { id:string; name:string; description:string; cost:number; mode:"activeFounder"|"passiveFounder"|"breeding"; prerequisiteIds:string[]; }
export type SimulationCommand = {type:"advance";years:number}|{type:"marry";partnerAId:CitizenId;partnerBId:CitizenId}|{type:"conceive";motherId:CitizenId;fatherId:CitizenId}|{type:"createChild";parentAId:CitizenId;parentBId:CitizenId}|{type:"gather";citizenId:CitizenId;resource:ResourceType}|{type:"buildShelter";citizenId:CitizenId}|{type:"lightFire";citizenId:CitizenId};
export interface SimulationEvent { type:"TickAdvanced"|"CitizenMarried"|"PregnancyStarted"|"CitizenBorn"|"CitizenDied"|"FounderGeneticTechApplied"|"ResourceGathered"|"ShelterBuilt"|"FireLit"|"SurvivalWarning"; tick:number; message:string; citizenIds?:CitizenId[]; }
export interface SimulationSnapshot { state:SimulationState; rngState:number; }
