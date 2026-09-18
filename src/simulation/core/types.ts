export type Sex = "male" | "female";
export type LifeStage = "infant"|"child"|"adolescent"|"adult"|"matureAdult"|"elder";
export type CitizenId = string;
export type OrderKind = "idle"|"work"|"task"|"research"|"build"|"gather"|"hunt"|"fetchWater"|"search"|"joinParty"|"lead"|"move"|"breed";
export type ResourceKind="food"|"water"|"wood"|"stone";
export interface CitizenOrder {kind:OrderKind;label:string;targetId?:CitizenId;targetName?:string;startedTick:number;}
export interface Pregnancy {motherId:CitizenId;fatherId:CitizenId;conceptionTick:number;dueTick:number;}
export interface Genome {longevity:number;diseaseResistance:number;strength:number;endurance:number;intelligence:number;fertility:number;learning:number;founderOrigin?:"king"|"queen";geneticTechIds:string[];}
export interface Citizen {id:CitizenId;name:string;sex:Sex;generation:number;birthTick:number;deathTick?:number;founder:boolean;genome:Genome;lifeStage:LifeStage;ageYears:number;health:number;hunger:number;thirst:number;fatigue:number;parentIds:CitizenId[];childIds:CitizenId[];spouseId?:CitizenId;pregnancy?:Pregnancy;royalGeneticHeritage:boolean;needPriority:number;job?:string;order?:CitizenOrder;}
export interface SimulationResources {food:number;water:number;wood:number;stone:number;}
export interface BuildingProject {id:string;name:string;description:string;workRequired:number;workDone:number;startedTick:number;completedTick?:number;workerIds:CitizenId[];}
export interface ResearchProject {id:string;name:string;description:string;researchRequired:number;researchDone:number;startedTick:number;completedTick?:number;researcherIds:CitizenId[];prerequisites:string[];}
export type TechBranch="Survival"|"Settlement"|"Craft"|"Knowledge";
export interface TechnologyDefinition {id:string;name:string;description:string;branch:TechBranch;era:number;cost:number;prerequisites:string[];unlocksBuildingIds:string[];}
export interface BuildingDefinition {id:string;name:string;description:string;workRequired:number;woodCost:number;stoneCost:number;requiredTechId:string;}
export interface ResearchDefinition {id:string;name:string;description:string;cost:number;prerequisites:string[];branch?:TechBranch;era?:number;unlocksBuildingIds?:string[];}
export interface ActiveEvent { id:string; title:string; text:string; choices:{id:string;label:string;description:string;effect:{resources?:Partial<Record<ResourceKind,number>>;health?:number;hunger?:number;thirst?:number;fatigue?:number;chronicle:string}}[]; }\nexport interface SimulationState {version:1;seed:number;tick:number;founders:{kingId:CitizenId;queenId:CitizenId};nextCitizenNumber:number;citizens:Record<CitizenId,Citizen>;resources:SimulationResources;buildings:BuildingProject[];completedResearch:string[];researchProjects:ResearchProject[];chronicle:string[];activeEvent?:ActiveEvent;}
export interface GeneticTechnology {id:string;name:string;description:string;cost:number;mode:"activeFounder"|"passiveFounder"|"breeding";prerequisiteIds:string[];}
