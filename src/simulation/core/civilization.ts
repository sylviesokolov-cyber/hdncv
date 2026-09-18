import type {BuildingDefinition,TechnologyDefinition} from "./types";

export const TECHNOLOGIES:TechnologyDefinition[]=[
 {id:"firemaking",name:"Firemaking",description:"Control fire reliably for warmth, light and safer food preparation.",branch:"Survival",era:0,cost:18,prerequisites:[],unlocksBuildingIds:["hearth"]},
 {id:"stoneworking",name:"Stoneworking",description:"Shape stone into dependable cutting and construction tools.",branch:"Craft",era:0,cost:20,prerequisites:[],unlocksBuildingIds:["workshop"]},
 {id:"sheltercraft",name:"Sheltercraft",description:"Turn temporary camps into durable protected dwellings.",branch:"Settlement",era:0,cost:16,prerequisites:["stoneworking"],unlocksBuildingIds:["shelter"]},
 {id:"cooking",name:"Cooking",description:"Use controlled fire to prepare food more efficiently.",branch:"Survival",era:0,cost:28,prerequisites:["firemaking"],unlocksBuildingIds:["kitchen"]},
 {id:"storage",name:"Storage",description:"Preserve gathered materials and create organized stockpiles.",branch:"Settlement",era:0,cost:30,prerequisites:["sheltercraft"],unlocksBuildingIds:["storage"]},
 {id:"waterworks",name:"Waterworks",description:"Develop simple infrastructure for dependable water collection.",branch:"Settlement",era:0,cost:34,prerequisites:["storage"],unlocksBuildingIds:["well"]},
 {id:"toolmaking",name:"Toolmaking",description:"Combine shaped stone and controlled fire into specialized tools.",branch:"Craft",era:0,cost:36,prerequisites:["stoneworking","firemaking"],unlocksBuildingIds:["toolshop"]},
 {id:"recordkeeping",name:"Recordkeeping",description:"Preserve knowledge and coordinate a growing settlement.",branch:"Knowledge",era:0,cost:42,prerequisites:["storage","toolmaking"],unlocksBuildingIds:["archive"]},
];

export const BUILDINGS:BuildingDefinition[]=[
 {id:"shelter",name:"Shelter",description:"A permanent first home that protects the dynasty.",workRequired:12,woodCost:10,stoneCost:4,requiredTechId:"sheltercraft"},
 {id:"storage",name:"Storage",description:"Keeps gathered materials organized and ready for use.",workRequired:18,woodCost:5,stoneCost:2,requiredTechId:"storage"},
 {id:"workshop",name:"Workshop",description:"A place for basic craft and future specialist work.",workRequired:24,woodCost:5,stoneCost:2,requiredTechId:"stoneworking"},
 {id:"hearth",name:"Hearth",description:"A maintained communal fire for warmth, light and cooking.",workRequired:14,woodCost:6,stoneCost:4,requiredTechId:"firemaking"},
 {id:"kitchen",name:"Kitchen",description:"A dedicated cooking space for prepared food.",workRequired:22,woodCost:8,stoneCost:5,requiredTechId:"cooking"},
 {id:"well",name:"Well",description:"A reliable water source that strengthens settlement resilience.",workRequired:30,woodCost:8,stoneCost:12,requiredTechId:"waterworks"},
 {id:"toolshop",name:"Toolshop",description:"A specialist workspace for increasingly advanced tools.",workRequired:32,woodCost:10,stoneCost:8,requiredTechId:"toolmaking"},
 {id:"archive",name:"Archive",description:"A place to preserve discoveries and accumulated knowledge.",workRequired:36,woodCost:12,stoneCost:8,requiredTechId:"recordkeeping"},
];
