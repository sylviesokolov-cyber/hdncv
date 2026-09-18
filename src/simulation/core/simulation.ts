import type {Citizen, CitizenId, Genome, GeneticTechnology, LifeStage, SimulationState, Sex} from "./types";
import {SeededRng} from "./rng";

const stage=(age:number):LifeStage=>age<2?"infant":age<8?"child":age<15?"adolescent":age<40?"adult":age<65?"matureAdult":"elder";
const genome=(rng:SeededRng, founderOrigin?: "king"|"queen"):Genome=>({
  longevity:rng.int(40,80), diseaseResistance:rng.int(35,75), strength:rng.int(35,75),
  endurance:rng.int(35,75), intelligence:rng.int(35,75), fertility:rng.int(35,75),
  learning:rng.int(35,75), founderOrigin, geneticTechIds:[]
});

export class Simulation {
  readonly rng:SeededRng;
  state:SimulationState;
  constructor(seed=12345){
    this.rng=new SeededRng(seed);
    const king=this.makeFounder("male","King");
    const queen=this.makeFounder("female","Queen");
    this.state={version:1,seed,tick:0,founders:{kingId:king.id,queenId:queen.id},nextCitizenNumber:3,citizens:{[king.id]:king,[queen.id]:queen},chronicle:["The Dynasty begins with the immortal King and Queen."]};
  }
  private makeFounder(sex:Sex,name:string):Citizen {
    const id=sex==="male"?"c_king":"c_queen";
    return {id,name,sex,generation:0,birthTick:0,founder:true,genome:genome(this.rng,sex==="male"?"king":"queen"),lifeStage:"adult",ageYears:25,health:100,hunger:0,thirst:0,fatigue:0,parentIds:[],childIds:[],royalGeneticHeritage:true};
  }
  advance(years=1){for(let y=0;y<years;y++){this.state.tick++; for(const c of Object.values(this.state.citizens)){if(c.deathTick!==undefined)continue;if(c.founder)continue;c.ageYears++;c.lifeStage=stage(c.ageYears);c.hunger=Math.min(100,c.hunger+4);c.thirst=Math.min(100,c.thirst+5);c.fatigue=Math.min(100,c.fatigue+3);if(c.ageYears>c.genome.longevity){c.deathTick=this.state.tick;c.health=0;this.state.chronicle.push(c.name+" died at age "+c.ageYears+".");}}}}
  get livingCitizens(){return Object.values(this.state.citizens).filter(c=>c.deathTick===undefined);}

  marry(partnerA:Citizen,partnerB:Citizen):void {
    if(partnerA.id===partnerB.id)throw new Error("A citizen cannot marry themselves.");
    if(partnerA.sex===partnerB.sex)throw new Error("Marriage requires opposite-sex partners in this MVP.");
    if(partnerA.deathTick!==undefined||partnerB.deathTick!==undefined)throw new Error("A deceased citizen cannot marry.");
    if(partnerA.spouseId||partnerB.spouseId)throw new Error("A citizen who already has a spouse cannot marry.");
    partnerA.spouseId=partnerB.id;
    partnerB.spouseId=partnerA.id;
    this.state.chronicle.push(partnerA.name+" and "+partnerB.name+" married.");
  }

  getSiblings(citizen:Citizen):Citizen[] {
    const state=this.state.citizens[citizen.id];
    if(!state)return [];

    const parentIds=new Set(state.parentIds);
    return Object.values(this.state.citizens).filter(other =>
      other.id!==state.id && other.parentIds.some(parentId=>parentIds.has(parentId))
    );
  }

  getAncestors(citizen:Citizen):Citizen[] {
    const result:Citizen[]=[];
    const seen=new Set<CitizenId>();
    const visit=(id:CitizenId)=>{
      const citizen=this.state.citizens[id];
      if(!citizen)return;
      for(const parentId of citizen.parentIds){
        if(seen.has(parentId))continue;
        seen.add(parentId);
        const parent=this.state.citizens[parentId];
        if(parent)result.push(parent);
        visit(parentId);
      }
    };
    visit(citizen.id);
    return result;
  }

  getDescendants(citizen:Citizen):Citizen[] {
    const result:Citizen[]=[];
    const seen=new Set<CitizenId>();
    const visit=(id:CitizenId)=>{
      const citizen=this.state.citizens[id];
      if(!citizen)return;
      for(const childId of citizen.childIds){
        if(seen.has(childId))continue;
        seen.add(childId);
        const child=this.state.citizens[childId];
        if(child)result.push(child);
        visit(childId);
      }
    };
    visit(citizen.id);
    return result;
  }
  createChild(parentA:Citizen,parentB:Citizen):Citizen {
    const parentAState=this.state.citizens[parentA.id];
    const parentBState=this.state.citizens[parentB.id];
    if(!parentAState||!parentBState)throw new Error("Both parents must belong to this simulation.");
    parentA=parentAState;
    parentB=parentBState;
    if(parentA.sex===parentB.sex)throw new Error("Founders need opposite-sex breeding for this MVP.");
    if(parentA.deathTick!==undefined||parentB.deathTick!==undefined)throw new Error("A deceased citizen cannot reproduce.");
    const childSex:Sex=this.rng.next()<0.5?"male":"female";
    const choose=(a:number,b:number)=>Math.round((a+b)/2)+this.rng.int(-3,3);
    const founderOrigin=parentA.founder?(parentA.genome.founderOrigin):parentB.founder?(parentB.genome.founderOrigin):undefined;
    const ids=parentA.founder||parentB.founder?parentA.founder?parentA.genome.geneticTechIds:parentB.genome.geneticTechIds:[];
    const child:Citizen={id:"c_"+this.state.nextCitizenNumber++,name:childSex==="male"?"Son":"Daughter",sex:childSex,generation:Math.max(parentA.generation,parentB.generation)+1,birthTick:this.state.tick,founder:false,genome:{longevity:choose(parentA.genome.longevity,parentB.genome.longevity),diseaseResistance:choose(parentA.genome.diseaseResistance,parentB.genome.diseaseResistance),strength:choose(parentA.genome.strength,parentB.genome.strength),endurance:choose(parentA.genome.endurance,parentB.genome.endurance),intelligence:choose(parentA.genome.intelligence,parentB.genome.intelligence),fertility:choose(parentA.genome.fertility,parentB.genome.fertility),learning:choose(parentA.genome.learning,parentB.genome.learning),founderOrigin,geneticTechIds:[...ids]},lifeStage:"infant",ageYears:0,health:100,hunger:0,thirst:0,fatigue:0,parentIds:[parentA.id,parentB.id],childIds:[],royalGeneticHeritage:Boolean(parentA.founder||parentB.founder||parentA.royalGeneticHeritage||parentB.royalGeneticHeritage)};
    this.state.citizens[child.id]=child;
    this.state.citizens[parentA.id].childIds.push(child.id);
    this.state.citizens[parentB.id].childIds.push(child.id);
    this.state.chronicle.push(child.name+" was born to "+parentA.name+" and "+parentB.name+".");
    return child;
  }
  applyFounderGeneticTech(founderId:CitizenId,tech:GeneticTechnology){
    const f=this.state.citizens[founderId];
    if(!f?.founder)throw new Error("Genetic technology can only be applied to a founder.");
    if(!f.genome.geneticTechIds.includes(tech.id))f.genome.geneticTechIds.push(tech.id);
    if(tech.mode==="activeFounder")f.genome.longevity+=10;
    this.state.chronicle.push(tech.name+" was applied to "+f.name+".");
  }
}