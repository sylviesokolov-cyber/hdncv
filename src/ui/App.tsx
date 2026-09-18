import {useMemo,useState} from "react";
import {Simulation} from "../simulation/core/simulation";
import type {Citizen} from "../simulation/core/types";

type Category="All"|"Work"|"Family"|"Development"|"Explore"|"Command";
const categories:Category[]=["All","Work","Family","Development","Explore","Command"];

const portraitFor=(c:Citizen)=>{
  if(c.founder)return c.sex==="male"?"/portraits/king.svg":"/portraits/queen.svg";
  return c.sex==="male"?"/portraits/npc-male.svg":"/portraits/npc-female.svg";
};
const roleFor=(c:Citizen)=>c.founder?(c.sex==="male"?"King":"Queen"):(c.royalGeneticHeritage?"Royal descendant":"Citizen");

export function App(){
 const sim=useMemo(()=>new Simulation(20260918),[]);
 const [,refresh]=useState(0);
 const [selectedId,setSelectedId]=useState(sim.state.founders.kingId);
 const [category,setCategory]=useState<Category>("All");
 const selected=sim.state.citizens[selectedId]??sim.state.citizens[sim.state.founders.kingId];
 const king=sim.state.citizens[sim.state.founders.kingId],queen=sim.state.citizens[sim.state.founders.queenId];
 const advance=()=>{sim.advance(1);refresh(x=>x+1)};
 const run=(fn:()=>void)=>{try{fn();refresh(x=>x+1)}catch(e){alert(e instanceof Error?e.message:"Command failed")}};
 const giveTask=()=>{const task=window.prompt("Task instruction","Gather food");if(task)run(()=>sim.orderTask(selected,task))};
 const build=()=>run(()=>sim.orderBuild(selected,"first shelter"));
 const research=()=>run(()=>sim.orderResearch(selected,"fire and primitive tools"));
 const search=()=>run(()=>sim.orderSearch(selected,"nearby area"));
 const breedPlayer=()=>run(()=>sim.breedWith(selected,selected.sex==="male"?queen:king));
 const breedNpc=()=>{const partner=sim.livingCitizens.find(c=>c.id!==selected.id&&c.sex!==selected.sex&&sim.canReproduce(c));if(!partner){alert("No eligible opposite-sex partner is available.");return}run(()=>sim.breedWith(selected,partner))};
 const actions=[
  {cat:"Work",icon:"✦",title:"Jobs & Work",sub:"Assign a role or work focus",fn:()=>run(()=>sim.assignJob(selected,"Gatherer"))},
  {cat:"Work",icon:"☷",title:"Specific Task",sub:"Give a one-off instruction",fn:giveTask},
  {cat:"Family",icon:"♡",title:"Breed with Player",sub:selected.sex==="female"?"Conceive with the King":"Father a child with the Queen",fn:breedPlayer,disabled:!sim.canReproduce(selected)},
  {cat:"Family",icon:"∞",title:"Breed with NPC",sub:"Select an eligible partner",fn:breedNpc,disabled:!sim.canReproduce(selected)},
  {cat:"Development",icon:"⌂",title:"Build",sub:"Order construction",fn:build},
  {cat:"Development",icon:"◇",title:"Research",sub:"Study a technology",fn:research},
  {cat:"Explore",icon:"⌕",title:"Search Area",sub:"Search for resources or discoveries",fn:search},
  {cat:"Command",icon:"⚑",title:"Join Party",sub:"Join an activity or expedition",fn:()=>run(()=>sim.joinParty(selected,"gathering party"))},
  {cat:"Command",icon:"⚐",title:"Lead This",sub:"Lead a party or work group",fn:()=>run(()=>sim.lead(selected,"gathering party"))},
  {cat:"Command",icon:"→",title:"Move",sub:"Travel to a location",fn:()=>run(()=>sim.move(selected,"capital"))},
 ];
 const visible=category==="All"?actions:actions.filter(a=>a.cat===category);
 const family=selected.parentIds.map(id=>sim.state.citizens[id]?.name).filter(Boolean);
 return <main className="game">
  <header><div><p className="eyebrow">DYNASTY SIM · ERA 0</p><h1>The First Dynasty</h1><p className="muted">Choose a person. Their portrait becomes your command center.</p></div><div className="controls"><button onClick={advance}>Advance 1 year</button></div></header>
  <section className="stats"><div><span>Year</span><strong>{sim.state.tick}</strong></div><div><span>Population</span><strong>{sim.livingCitizens.length}</strong></div><div><span>Founders</span><strong>2 immortal</strong></div><div><span>Supplies</span><strong>{sim.state.resources.food} food · {sim.state.resources.water} water</strong></div></section>
  <section className="portrait-strip">{[king,queen,...sim.livingCitizens.filter(c=>!c.founder).slice(0,2)].map(c=><button className={"portrait-card "+(selected.id===c.id?"active":"")} key={c.id} onClick={()=>setSelectedId(c.id)}><img src={portraitFor(c)} /><span className="portrait-shade"/><div><b>{roleFor(c)}</b><small>{c.name} · {c.ageYears}y</small></div></button>)}</section>
  <section className="layout">
   <aside className="people panel"><div className="panel-heading"><p className="eyebrow">PEOPLE</p><span>{sim.livingCitizens.length}</span></div>{sim.livingCitizens.map(c=><button className={"person "+(selected.id===c.id?"selected":"")} key={c.id} onClick={()=>setSelectedId(c.id)}><img src={portraitFor(c)} /><span><b>{c.name}</b><small>{roleFor(c)} · Gen {c.generation} · {c.ageYears} years</small></span></button>)}</aside>
   <section className="panel detail">
    <div className="detail-top"><img className="hero-portrait" src={portraitFor(selected)}/><div><p className="eyebrow">{roleFor(selected).toUpperCase()}</p><h2>{selected.name}</h2><p>{selected.lifeStage} · Generation {selected.generation} · {selected.sex}</p><span className="status">{selected.order?.kind==="idle"?"● Idle":"● "+selected.order?.label}</span></div></div>
    <div className="meters"><label>Health <progress value={selected.health} max="100"/><b>{selected.health}%</b></label><label>Hunger <progress value={100-selected.hunger} max="100"/><b>{selected.hunger<20?"Fed":selected.hunger+"%"}</b></label><label>Thirst <progress value={100-selected.thirst} max="100"/><b>{selected.thirst<20?"Hydrated":selected.thirst+"%"}</b></label><label>Energy <progress value={100-selected.fatigue} max="100"/><b>{Math.max(0,100-selected.fatigue)}%</b></label></div>
    <div className="info-grid"><div><span>Need priority</span><strong>{selected.needPriority}</strong></div><div><span>Heritage</span><strong>{selected.royalGeneticHeritage?"Royal":"Ordinary"}</strong></div><div><span>Parents</span><strong>{family.length?family.join(" & "):"Founders"}</strong></div><div><span>Children</span><strong>{selected.childIds.length}</strong></div></div>
    <h3>Genetic heritage</h3><p>Longevity {selected.genome.longevity} · Strength {selected.genome.strength} · Learning {selected.genome.learning}</p>
    <p className="muted">{selected.genome.geneticTechIds.length?("Founder technologies: "+selected.genome.geneticTechIds.join(", ")):"No founder genetic technology."}</p>
   </section>
   <section className="panel actions-panel"><div className="panel-heading"><div><p className="eyebrow">COMMAND</p><h2>What should {selected.name} do?</h2></div><button className="priority" onClick={()=>run(()=>sim.setNeedPriority(selected,Math.min(100,selected.needPriority+10)))}>★ Priority {selected.needPriority}</button></div><div className="category-tabs">{categories.map(c=><button className={category===c?"active":""} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="action-grid">{visible.map(a=><button className="action" key={a.title} disabled={Boolean(a.disabled)} onClick={a.fn}><span className="action-icon">{a.icon}</span><span><b>{a.title}</b><small>{a.sub}</small></span></button>)}</div><div className="auto-note"><b>Automatic needs</b><span>Food, water and basic survival needs are fulfilled automatically when supplies exist. Higher-priority citizens are served first.</span></div></section>
  </section>
  <section className="bottom-grid"><div className="panel chronicle"><p className="eyebrow">CHRONICLE</p><h2>Recent history</h2>{sim.state.chronicle.slice(-8).reverse().map((e,i)=><p key={i}>{e}</p>)}</div><div className="panel supplies"><p className="eyebrow">CIVILIZATION</p><h2>Early resources</h2><div className="resource-row"><span>Food</span><strong>{sim.state.resources.food}</strong></div><div className="resource-row"><span>Water</span><strong>{sim.state.resources.water}</strong></div><div className="resource-row"><span>Wood</span><strong>{sim.state.resources.wood}</strong></div><div className="resource-row"><span>Stone</span><strong>{sim.state.resources.stone}</strong></div></div></section>
 </main>;
}
