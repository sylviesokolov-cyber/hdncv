import type {Citizen,CitizenId,Genome,GeneticTechnology,LifeStage,Pregnancy,SimulationState,Sex,CitizenOrder,OrderKind} from "./types";
import {SeededRng} from "./rng";

const stage=(age:number):LifeStage=>age<2?"infant":age<8?"child":age<15?"adolescent":age<40?"adult":age<65?"matureAdult":"elder";
const GESTATION_YEARS=1;
const MIN_REPRODUCTIVE_AGE=15;
const MAX_REPRODUCTIVE_AGE=45;

const genome=(rng:SeededRng,founderOrigin?:"king"|"queen"):Genome=>({
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
    this.state={
      version:1,seed,tick:0,
      founders:{kingId:king.id,queenId:queen.id},
      nextCitizenNumber:3,
      citizens:{[king.id]:king,[queen.id]:queen},
      resources:{food:100,water:100,wood:30,stone:20},
      chronicle:["The Dynasty begins with the immortal King and Queen."]
    };
  }

  private makeFounder(sex:Sex,name:string):Citizen {
    const id=sex==="male"?"c_king":"c_queen";
    return {
      id,name,sex,generation:0,birthTick:0,founder:true,
      genome:genome(this.rng,sex==="male"?"king":"queen"),
      lifeStage:"adult",ageYears:25,health:100,hunger:0,thirst:0,fatigue:0,
      parentIds:[],childIds:[],royalGeneticHeritage:true,needPriority:100,
      order:{kind:"idle",label:"Idle",startedTick:0}
    };
  }

  advance(years=1){
    for(let y=0;y<years;y++){
      this.state.tick++;
      for(const c of Object.values(this.state.citizens)){
        if(c.deathTick!==undefined)continue;
        if(!c.founder){
          c.ageYears++;
          c.lifeStage=stage(c.ageYears);
          c.hunger=Math.min(100,c.hunger+4);
          c.thirst=Math.min(100,c.thirst+5);
          c.fatigue=Math.min(100,c.fatigue+3);
          if(c.ageYears>c.genome.longevity){
            c.deathTick=this.state.tick;c.health=0;
            c.order={kind:"idle",label:"Dead",startedTick:this.state.tick};
            this.state.chronicle.push(c.name+" died at age "+c.ageYears+".");
          }
        }
      }
      this.fulfillBasicNeeds();
      this.processPregnancies();
    }
  }

  private fulfillBasicNeeds():void {
    const living=[...this.livingCitizens].sort((a,b)=>b.needPriority-a.needPriority||a.id.localeCompare(b.id));
    for(const c of living){
      if(this.state.resources.food>0 && c.hunger>=20){
        const amount=Math.min(20,c.hunger);
        c.hunger=Math.max(0,c.hunger-amount);
        this.state.resources.food=Math.max(0,this.state.resources.food-1);
      }
      if(this.state.resources.water>0 && c.thirst>=20){
        const amount=Math.min(25,c.thirst);
        c.thirst=Math.max(0,c.thirst-amount);
        this.state.resources.water=Math.max(0,this.state.resources.water-1);
      }
    }
  }

  private processPregnancies():void {
    const due=Object.values(this.state.citizens).filter(c=>c.pregnancy?.dueTick===this.state.tick);
    for(const mother of due){
      const pregnancy=mother.pregnancy;if(!pregnancy)continue;
      const father=this.state.citizens[pregnancy.fatherId];
      if(mother.deathTick!==undefined||!father||father.deathTick!==undefined){delete mother.pregnancy;continue;}
      this.birth(mother,father);
    }
  }

  private birth(mother:Citizen,father:Citizen):Citizen {
    const childSex:Sex=this.rng.next()<0.5?"male":"female";
    const choose=(a:number,b:number)=>Math.round((a+b)/2)+this.rng.int(-3,3);
    const founderParent=mother.founder?mother:father.founder?father:undefined;
    const founderOrigin=founderParent?.genome.founderOrigin;
    const geneticTechIds=founderParent?[...founderParent.genome.geneticTechIds]:[];
    const child:Citizen={
      id:"c_"+this.state.nextCitizenNumber++,name:childSex==="male"?"Son":"Daughter",sex:childSex,
      generation:Math.max(mother.generation,father.generation)+1,birthTick:this.state.tick,founder:false,
      genome:{
        longevity:choose(mother.genome.longevity,father.genome.longevity),
        diseaseResistance:choose(mother.genome.diseaseResistance,father.genome.diseaseResistance),
        strength:choose(mother.genome.strength,father.genome.strength),
        endurance:choose(mother.genome.endurance,father.genome.endurance),
        intelligence:choose(mother.genome.intelligence,father.genome.intelligence),
        fertility:choose(mother.genome.fertility,father.genome.fertility),
        learning:choose(mother.genome.learning,father.genome.learning),
        founderOrigin,geneticTechIds
      },
      lifeStage:"infant",ageYears:0,health:100,hunger:0,thirst:0,fatigue:0,
      parentIds:[mother.id,father.id],childIds:[],
      royalGeneticHeritage:Boolean(mother.founder||father.founder||mother.royalGeneticHeritage||father.royalGeneticHeritage),
      needPriority:70,order:{kind:"idle",label:"Infant care",startedTick:this.state.tick}
    };
    this.state.citizens[child.id]=child;
    this.state.citizens[mother.id].childIds.push(child.id);
    this.state.citizens[father.id].childIds.push(child.id);
    delete mother.pregnancy;
    this.state.chronicle.push(child.name+" was born to "+mother.name+" and "+father.name+".");
    return child;
  }

  get livingCitizens(){return Object.values(this.state.citizens).filter(c=>c.deathTick===undefined);}

  getNeedPriority(citizen:Citizen|CitizenId):number {
    const c=this.state.citizens[typeof citizen==="string"?citizen:citizen.id];
    return c?.needPriority??0;
  }

  setNeedPriority(citizen:Citizen|CitizenId,priority:number):void {
    const c=this.state.citizens[typeof citizen==="string"?citizen:citizen.id];
    if(!c)throw new Error("Citizen not found.");
    c.needPriority=Math.max(0,Math.min(100,Math.round(priority)));
  }

  private setOrder(citizen:Citizen,kind:OrderKind,label:string,target?:Citizen):CitizenOrder {
    const c=this.state.citizens[citizen.id];
    if(!c||c.deathTick!==undefined)throw new Error("Only a living citizen can receive an order.");
    const order:CitizenOrder={kind,label,startedTick:this.state.tick,...target?{targetId:target.id,targetName:target.name}:{}};
    c.order=order;
    this.state.chronicle.push(c.name+" was ordered to "+label+".");
    return order;
  }

  assignJob(citizen:Citizen,job:string):CitizenOrder { return this.setOrder(citizen,"work",job); }
  orderTask(citizen:Citizen,task:string):CitizenOrder { return this.setOrder(citizen,"task",task); }
  orderResearch(citizen:Citizen,subject:string):CitizenOrder { return this.setOrder(citizen,"research","research "+subject); }
  orderBuild(citizen:Citizen,structure:string):CitizenOrder { return this.setOrder(citizen,"build","build "+structure); }
  orderSearch(citizen:Citizen,area:string):CitizenOrder { return this.setOrder(citizen,"search","search "+area); }
  joinParty(citizen:Citizen,party:string):CitizenOrder { return this.setOrder(citizen,"joinParty","join "+party); }
  lead(citizen:Citizen,group:string):CitizenOrder { return this.setOrder(citizen,"lead","lead "+group); }
  move(citizen:Citizen,location:string):CitizenOrder { return this.setOrder(citizen,"move","move to "+location); }

  marry(partnerA:Citizen,partnerB:Citizen):void {
    if(partnerA.id===partnerB.id)throw new Error("A citizen cannot marry themselves.");
    if(partnerA.sex===partnerB.sex)throw new Error("Marriage requires opposite-sex partners in this MVP.");
    if(partnerA.deathTick!==undefined||partnerB.deathTick!==undefined)throw new Error("A deceased citizen cannot marry.");
    if(partnerA.spouseId||partnerB.spouseId)throw new Error("A citizen who already has a spouse cannot marry.");
    partnerA.spouseId=partnerB.id;partnerB.spouseId=partnerA.id;
    this.state.chronicle.push(partnerA.name+" and "+partnerB.name+" married.");
  }

  getSiblings(citizen:Citizen|CitizenId):Citizen[] {
    const id=typeof citizen==="string"?citizen:citizen.id;const state=this.state.citizens[id];if(!state)return [];
    const parentIds=new Set(state.parentIds);
    return Object.values(this.state.citizens).filter(other=>other.id!==state.id&&other.parentIds.some(parentId=>parentIds.has(parentId)));
  }

  getAncestors(citizen:Citizen|CitizenId):Citizen[] {
    const result:Citizen[]=[];const seen=new Set<CitizenId>();
    const visit=(id:CitizenId)=>{const c=this.state.citizens[id];if(!c)return;for(const parentId of c.parentIds){if(seen.has(parentId))continue;seen.add(parentId);const p=this.state.citizens[parentId];if(p)result.push(p);visit(parentId);}};
    visit(typeof citizen==="string"?citizen:citizen.id);return result;
  }

  getDescendants(citizen:Citizen|CitizenId):Citizen[] {
    const result:Citizen[]=[];const seen=new Set<CitizenId>();
    const visit=(id:CitizenId)=>{const c=this.state.citizens[id];if(!c)return;for(const childId of c.childIds){if(seen.has(childId))continue;seen.add(childId);const child=this.state.citizens[childId];if(child)result.push(child);visit(childId);}};
    visit(typeof citizen==="string"?citizen:citizen.id);return result;
  }

  createChild(parentA:Citizen,parentB:Citizen):Citizen {
    const a=this.state.citizens[parentA.id],b=this.state.citizens[parentB.id];
    if(!a||!b)throw new Error("Both parents must belong to this simulation.");
    if(a.sex===b.sex)throw new Error("Founders need opposite-sex breeding for this MVP.");
    if(a.deathTick!==undefined||b.deathTick!==undefined)throw new Error("A deceased citizen cannot reproduce.");
    const childSex:Sex=this.rng.next()<0.5?"male":"female";
    const choose=(x:number,y:number)=>Math.round((x+y)/2)+this.rng.int(-3,3);
    const founderParent=a.founder?a:b.founder?b:undefined;
    const founderOrigin=founderParent?.genome.founderOrigin;
    const ids=founderParent?[...founderParent.genome.geneticTechIds]:[];
    const child:Citizen={
      id:"c_"+this.state.nextCitizenNumber++,name:childSex==="male"?"Son":"Daughter",sex:childSex,
      generation:Math.max(a.generation,b.generation)+1,birthTick:this.state.tick,founder:false,
      genome:{longevity:choose(a.genome.longevity,b.genome.longevity),diseaseResistance:choose(a.genome.diseaseResistance,b.genome.diseaseResistance),strength:choose(a.genome.strength,b.genome.strength),endurance:choose(a.genome.endurance,b.genome.endurance),intelligence:choose(a.genome.intelligence,b.genome.intelligence),fertility:choose(a.genome.fertility,b.genome.fertility),learning:choose(a.genome.learning,b.genome.learning),founderOrigin,geneticTechIds:ids},
      lifeStage:"infant",ageYears:0,health:100,hunger:0,thirst:0,fatigue:0,parentIds:[a.id,b.id],childIds:[],
      royalGeneticHeritage:Boolean(a.founder||b.founder||a.royalGeneticHeritage||b.royalGeneticHeritage),
      needPriority:70,order:{kind:"idle",label:"Infant care",startedTick:this.state.tick}
    };
    this.state.citizens[child.id]=child;a.childIds.push(child.id);b.childIds.push(child.id);
    this.state.chronicle.push(child.name+" was born to "+a.name+" and "+b.name+".");
    return child;
  }

  canReproduce(citizen:Citizen):boolean {
    return citizen.deathTick===undefined&&citizen.ageYears>=MIN_REPRODUCTIVE_AGE&&citizen.ageYears<=MAX_REPRODUCTIVE_AGE&&(citizen.lifeStage==="adult"||citizen.lifeStage==="matureAdult");
  }

  conceive(mother:Citizen,father:Citizen):Pregnancy {
    const m=this.state.citizens[mother.id],f=this.state.citizens[father.id];
    if(!m||!f)throw new Error("Both parents must belong to this simulation.");
    if(m.sex!=="female"||f.sex!=="male")throw new Error("Pregnancy requires a female mother and male father.");
    if(!this.canReproduce(m)||!this.canReproduce(f))throw new Error("Both parents must be of reproductive age.");
    if(m.pregnancy)throw new Error("A pregnant citizen cannot conceive again.");
    const pregnancy={motherId:m.id,fatherId:f.id,conceptionTick:this.state.tick,dueTick:this.state.tick+GESTATION_YEARS};
    m.pregnancy=pregnancy;this.setOrder(m,"breed","conceive with "+f.name,f);
    this.state.chronicle.push(m.name+" conceived a child with "+f.name+".");
    return pregnancy;
  }

  breedWith(actor:Citizen,partner:Citizen):Pregnancy {
    const a=this.state.citizens[actor.id],p=this.state.citizens[partner.id];
    if(!a||!p)throw new Error("Both citizens must belong to this simulation.");
    if(a.sex==="female"&&p.sex==="male")return this.conceive(a,p);
    if(a.sex==="male"&&p.sex==="female")return this.conceive(p,a);
    throw new Error("Breeding requires opposite-sex partners in this MVP.");
  }

  applyFounderGeneticTech(founderId:CitizenId,tech:GeneticTechnology){
    const f=this.state.citizens[founderId];
    if(!f?.founder)throw new Error("Genetic technology can only be applied to a founder.");
    if(!f.genome.geneticTechIds.includes(tech.id))f.genome.geneticTechIds.push(tech.id);
    if(tech.mode==="activeFounder")f.genome.longevity+=10;
    this.state.chronicle.push(tech.name+" was applied to "+f.name+".");
  }
}
