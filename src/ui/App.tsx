import {useEffect,useMemo,useState} from "react";
import {Simulation} from "../simulation/core/simulation";
import type {Citizen} from "../simulation/core/types";
import {BUILDINGS,TECHNOLOGIES} from "../simulation/core/civilization";

type Category="Overview"|"Work"|"Family"|"Develop"|"Explore"|"Command";
type MainTab="Camp"|"People"|"Resources"|"Building"|"Research";
type Action={id:string;category:Exclude<Category,"Overview">;icon:string;title:string;subtitle:string;disabled?:boolean;run:()=>void};

const base=import.meta.env.BASE_URL;
const portraitFor=(c:Citizen)=>{
  if(c.founder)return `${base}portraits/${c.sex==="male"?"king":"queen"}.svg`;
  return `${base}portraits/${c.sex==="male"?"npc-male":"npc-female"}.svg`;
};
const roleFor=(c:Citizen)=>c.founder?(c.sex==="male"?"King":"Queen"):(c.royalGeneticHeritage?"Royal descendant":"Citizen");
const formatCommand=(c:Citizen)=>c.order?.kind==="idle"?"Awaiting orders":c.order?.label??"Awaiting orders";

export function App(){
 const sim=useMemo(()=>new Simulation(20260918),[]);
 const [selectedId,setSelectedId]=useState(sim.state.founders.kingId);
 const [category,setCategory]=useState<Category>("Overview");
 const [detailOpen,setDetailOpen]=useState(false);
 const [commandNote,setCommandNote]=useState<string>();
 const [mainTab,setMainTab]=useState<MainTab>("Camp");
 const [booting,setBooting]=useState(true);
 useEffect(()=>{const timer=window.setTimeout(()=>setBooting(false),850);return()=>window.clearTimeout(timer)},[]);
 const researchDef={id:"fire-tools",name:"Fire & Primitive Tools",description:"Controlled fire, stone tools and the first reliable craft techniques.",cost:24,prerequisites:[] as string[]};
 const buildingDefs=[
  {id:"shelter",name:"Shelter",description:"A permanent first home that protects the dynasty.",work:12},
  {id:"storage",name:"Storage",description:"Keeps gathered materials organized and ready for use.",work:18},
  {id:"workshop",name:"Workshop",description:"A place for tools, craft and future specialist work.",work:24},
 ];
 const [,refresh]=useState(0);
 const selected=sim.state.citizens[selectedId]??sim.state.citizens[sim.state.founders.kingId];

 const rerender=()=>refresh(v=>v+1);
 const advance=()=>{sim.advance(1);rerender()};
 const execute=(fn:()=>void)=>{
   try{fn();setCommandNote("Order issued successfully.");rerender()}
   catch(e){setCommandNote(e instanceof Error?e.message:"Command failed")}
 };
 const giveTask=()=>{
   const task=window.prompt("Task instruction","Gather food");
   if(task)execute(()=>sim.orderTask(selected,task));
 };
 const research=()=>execute(()=>sim.startResearch(selected,researchDef));
 const search=()=>execute(()=>sim.orderSearch(selected,"nearby area"));
 const breedPlayer=()=>execute(()=>sim.breedWith(selected,selected.sex==="male"?sim.state.citizens[sim.state.founders.queenId]:sim.state.citizens[sim.state.founders.kingId]));
 const breedNpc=()=>{const partner=sim.livingCitizens.find(c=>c.id!==selected.id&&c.sex!==selected.sex&&sim.canReproduce(c));if(!partner){setCommandNote("No eligible opposite-sex NPC is available.");return}execute(()=>sim.breedWith(selected,partner))};

 const actions:Action[]=[
  {id:"gatherer",category:"Work",icon:"✦",title:"Gatherer",subtitle:"Produce food from the surrounding land",run:()=>execute(()=>sim.assignJob(selected,"Gatherer"))},
  {id:"water-carrier",category:"Work",icon:"◉",title:"Water carrier",subtitle:"Keep the settlement supplied with water",run:()=>execute(()=>sim.assignJob(selected,"Water Carrier"))},
  {id:"lumberjack",category:"Work",icon:"◇",title:"Lumberjack",subtitle:"Gather wood for buildings and fire",run:()=>execute(()=>sim.assignJob(selected,"Lumberjack"))},
  {id:"quarry-worker",category:"Work",icon:"◆",title:"Quarry worker",subtitle:"Gather stone for construction",run:()=>execute(()=>sim.assignJob(selected,"Quarry Worker"))},
  {id:"worker",category:"Work",icon:"⚒",title:"General worker",subtitle:"Let the simulation rotate basic gathering",run:()=>execute(()=>sim.assignJob(selected,"Worker"))},
  {id:"task",category:"Work",icon:"☷",title:"Give a task",subtitle:"Issue a specific one-time instruction",run:giveTask},
  {id:"breed-player",category:"Family",icon:"♡",title:"With the ruler",subtitle:selected.sex==="female"?"Conceive with the King":"Father a child with the Queen",disabled:!sim.canReproduce(selected),run:breedPlayer},
  {id:"breed-npc",category:"Family",icon:"∞",title:"With another citizen",subtitle:"Find an eligible opposite-sex partner",disabled:!sim.canReproduce(selected),run:breedNpc},
  {id:"search",category:"Explore",icon:"⌕",title:"Search an area",subtitle:"Look for food, materials or discoveries",run:search},
  {id:"party",category:"Command",icon:"⚑",title:"Join a party",subtitle:"Take part in an expedition or group",run:()=>execute(()=>sim.joinParty(selected,"gathering party"))},
  {id:"lead",category:"Command",icon:"⚐",title:"Lead a group",subtitle:"Put this citizen in charge",run:()=>execute(()=>sim.lead(selected,"gathering party"))},
  {id:"move",category:"Command",icon:"→",title:"Move",subtitle:"Travel to a destination",run:()=>execute(()=>sim.move(selected,"capital"))},
 ];
 const visibleActions=category==="Overview"?actions:actions.filter(a=>a.category===category);
 const select=(id:string)=>{setSelectedId(id);setCommandNote(undefined);setDetailOpen(true)};
 const maxGen=Math.max(...sim.livingCitizens.map(c=>c.generation));\n const activeEvent=sim.state.activeEvent;
 return <main className="app-shell">
  <header className="topbar">
    <div className="brand"><div className="brand-mark">DS</div><div><span>DYNASTY SIM</span><strong>The First Dynasty</strong></div></div>
    <div className="era-chip"><span>ERA 0 · FOUNDING AGE</span><b>Year {sim.state.tick} · {sim.livingCitizens.length} people</b></div>
    <div className="top-actions"><div className="resource-chip"><span>◈</span><b>{sim.state.resources.food}</b><em>Food</em></div><div className="resource-chip"><span>◉</span><b>{sim.state.resources.water}</b><em>Water</em></div><button className="advance-btn" onClick={advance}>Advance year <span>→</span></button></div>
  </header>

  <section className="command-strip">
    <div><span className="label">YEAR</span><strong>{sim.state.tick}</strong></div>
    <div><span className="label">POPULATION</span><strong>{sim.livingCitizens.length}</strong></div>
    <div><span className="label">GENERATION</span><strong>{maxGen}</strong></div>
    <div className="needs-legend"><span className="dot good"/><span>Supplies automatic</span><span className="dot gold"/><span>Priority {selected.needPriority}</span></div>
  </section>

  {activeEvent&&<div className="event-backdrop"><section className="event-card"><div className="event-kicker">A YEAR IN THE DYNASTY · YEAR {sim.state.tick}</div><h2>{activeEvent.title}</h2><p>{activeEvent.text}</p><div className="event-choices">{activeEvent.choices.map(choice=><button key={choice.id} onClick={()=>execute(()=>sim.resolveEvent(choice.id))}><b>{choice.label}</b><small>{choice.description}</small></button>)}</div></section></div>}

  {mainTab==="Camp"&&<section className="stage">
    <div className="scene">
      <div className="scene-copy">
        <span className="label">FOUNDING CAMP</span>
        <strong className="scene-location">First settlement</strong>
        <div className="scene-status"><span className="pulse"/>Live <b>Year {sim.state.tick} · Gen {maxGen}</b></div>
      </div>
      <div className="scene-marker scene-marker-water"><span>◉</span> Water</div>
      <div className="scene-marker scene-marker-camp"><span>✦</span> Camp</div>
      <div className="scene-marker scene-marker-wood"><span>◇</span> Woodland</div>
      <div className="scene-hint"><span className="label">COMMAND CENTER</span><strong>Tap a person to issue an order</strong></div>
      <div className="scene-sun"/>
      <div className="mountain mountain-a"/><div className="mountain mountain-b"/><div className="campfire"/><div className="tent tent-a"/><div className="tent tent-b"/>
    </div>

    <aside className="roster panel">
      <div className="roster-mobile-label"><span className="label">PEOPLE</span><strong>Select a citizen</strong></div>
      <div className="panel-head"><div><span className="label">PEOPLE</span><h2>Your people</h2></div><b>{sim.livingCitizens.length}</b></div>
      <div className="roster-list">{sim.livingCitizens.map(c=><button className={"roster-item "+(selected.id===c.id?"selected":"")} key={c.id} onClick={()=>select(c.id)}><img src={portraitFor(c)}/><span><b>{c.name}</b><small>{roleFor(c)} · {c.ageYears} years</small><em>{formatCommand(c)}</em></span><i>›</i></button>)}</div>
      <div className="auto-box"><span className="auto-icon">✧</span><div><b>Needs are autonomous</b><small>Food, water and basic necessities are handled automatically when supplies exist.</small></div></div>
    </aside>
  </section>}

  {mainTab==="Resources"&&<section className="main-panel panel"><div className="main-panel-head"><span className="label">STOCKPILE</span><h1>Resources</h1><p>Unassigned adults automatically become workers.</p></div><div className="resource-cards">{(["food","water","wood","stone"] as const).map(resource=><div className="resource-big" key={resource}><span>{resource}</span><strong>{sim.state.resources[resource]}</strong><small>{resource==="food"?"Gathering & hunting":resource==="water"?"Fetching water":"Gathering "+resource}</small></div>)}</div><div className="production-box"><div><span className="label">WORKFORCE</span><h2>Automatic gathering</h2></div><strong>{sim.getAvailableWorkers().length} free workers</strong><p>Citizens with no specific order rotate through food, water, wood and stone. Starting a project automatically pulls from this free workforce.</p></div></section>}

  {mainTab==="Building"&&<section className="main-panel panel"><div className="main-panel-head"><span className="label">SETTLEMENT</span><h1>Building</h1><p>Technology determines what your civilization can build. Tap Build and the first free worker is assigned automatically.</p></div><div className="building-section"><div className="section-kicker"><span className="label">UNDER CONSTRUCTION</span><strong>{sim.state.buildings.filter(p=>p.completedTick===undefined).length}</strong></div>{sim.state.buildings.filter(p=>p.completedTick===undefined).length===0&&<div className="empty-project">Nothing is being built yet. Research a technology to unlock structures.</div>}{sim.state.buildings.filter(p=>p.completedTick===undefined).map(project=><div className="building-project" key={project.id}><div className="building-project-head"><div><b>{project.name}</b><small>{project.workerIds.length} worker{project.workerIds.length===1?"":"s"} assigned automatically</small></div><span>{Math.round(project.workDone/project.workRequired*100)}%</span></div><div className="project-progress"><span style={{width:Math.min(100,project.workDone/project.workRequired*100)+"%"}}/></div><div className="building-meta"><span>{project.workDone} / {project.workRequired} work</span><span>{sim.estimateBuildYears(project.workRequired-project.workDone,Math.max(1,project.workerIds.length))}y remaining</span></div></div>)}</div><div className="building-section"><div className="section-kicker"><span className="label">UNLOCKED STRUCTURES</span><strong>{BUILDINGS.filter(def=>sim.isTechnologyComplete(def.requiredTechId)).length}</strong></div><div className="building-catalog">{BUILDINGS.filter(def=>sim.isTechnologyComplete(def.requiredTechId)).map(def=>{const active=sim.state.buildings.some(p=>p.id===def.id&&p.completedTick===undefined);const completed=sim.state.buildings.some(p=>p.id===def.id&&p.completedTick!==undefined);return <div className={"building-card "+(active?"active":"")} key={def.id}><div className="building-icon">⌂</div><div className="building-copy"><b>{def.name}</b><p>{def.description}</p><small>{def.workRequired} work · {def.woodCost} wood · {def.stoneCost} stone</small></div><button disabled={active||completed} onClick={()=>execute(()=>sim.startBuildingForAvailableWorker(def.id,def.name,def.description,def.workRequired))}>{completed?"Built":active?"Building":"Build"}</button></div>})}</div></div></section>}

  {mainTab==="Research"&&<section className="main-panel panel"><div className="main-panel-head"><span className="label">CIVILIZATION TREE</span><h1>Research</h1><p>Choose a branch. Prerequisites determine what becomes available, and completed technologies unlock new buildings and future discoveries.</p></div><div className="tech-branches">{(["Survival","Settlement","Craft","Knowledge"] as const).map(branch=><div className="tech-branch" key={branch}><div className="tech-branch-head"><span>{branch}</span><small>{TECHNOLOGIES.filter(t=>t.branch===branch).length} technologies</small></div>{TECHNOLOGIES.filter(t=>t.branch===branch).map(tech=>{const done=sim.isTechnologyComplete(tech.id);const active=sim.state.researchProjects.some(p=>p.id===tech.id&&p.completedTick===undefined);const available=sim.isTechnologyAvailable(tech.id);const req=tech.prerequisites.map(id=>TECHNOLOGIES.find(t=>t.id===id)?.name??id).join(" + ");const unlocks=tech.unlocksBuildingIds.map(id=>BUILDINGS.find(b=>b.id===id)?.name??id).join(", ");return <div className={"tech-node "+(done?"done ":"")+(active?"active ":"")+(available?"available":"locked")} key={tech.id}><div className="tech-node-top"><span className="tech-era">ERA {tech.era}</span><b>{tech.name}</b><strong>{done?"✓":active?"Researching":available?"Available":"Locked"}</strong></div><p>{tech.description}</p><div className="tech-prereq">{req?"Requires "+req:"No prerequisites"}{unlocks?" · Unlocks "+unlocks:""}</div>{active&&<div className="tech-progress"><span style={{width:Math.min(100,(sim.state.researchProjects.find(p=>p.id===tech.id)?.researchDone??0)/tech.cost*100)+"%"}}/></div>}<button disabled={!available||active} onClick={()=>execute(()=>sim.startResearchForAvailableWorker(tech.id))}>{done?"Researched":active?"In progress":"Research"}</button></div>})}</div>)}</div></section>}

  {mainTab==="People"&&<section className="main-panel panel"><div className="main-panel-head"><span className="label">PEOPLE</span><h1>Citizens</h1><p>Specific orders override automatic worker duty.</p></div><div className="people-grid">{sim.livingCitizens.map(c=><button className="people-tile" key={c.id} onClick={()=>{select(c.id);setMainTab("Camp")}}><img src={portraitFor(c)}/><span><b>{c.name}</b><small>{roleFor(c)} · {formatCommand(c)}</small></span></button>)}</div></section>}

  {detailOpen&&<div className="sheet-backdrop" onClick={()=>setDetailOpen(false)}>
    <section className="character-sheet" onClick={e=>e.stopPropagation()}>
      <button className="sheet-close" onClick={()=>setDetailOpen(false)}>×</button>
      <div className="sheet-top">
        <div className="portrait-frame"><img src={portraitFor(selected)}/><span>{selected.founder?"FOUNDER":"CITIZEN"}</span></div>
        <div className="identity"><span className="label">{roleFor(selected).toUpperCase()}</span><h2>{selected.name}</h2><p>{selected.lifeStage} · {selected.ageYears} years · Generation {selected.generation}</p><div className="command-badge"><span className="pulse"/>{formatCommand(selected)}</div></div>
        <div className="priority-control"><span>NEED PRIORITY</span><strong>{selected.needPriority}</strong><button onClick={()=>execute(()=>sim.setNeedPriority(selected,Math.min(100,selected.needPriority+10)))}>Raise</button></div>
      </div>

      <div className="need-row"><div><span>Health</span><strong>{selected.health}%</strong><progress value={selected.health} max="100"/></div><div><span>Hunger</span><strong>{selected.hunger<20?"Fed":selected.hunger+"%"}</strong><progress value={100-selected.hunger} max="100"/></div><div><span>Thirst</span><strong>{selected.thirst<20?"Hydrated":selected.thirst+"%"}</strong><progress value={100-selected.thirst} max="100"/></div><div><span>Energy</span><strong>{Math.max(0,100-selected.fatigue)}%</strong><progress value={100-selected.fatigue} max="100"/></div></div>

      <div className="category-row">{(["Overview","Work","Family","Develop","Explore","Command"] as Category[]).map(c=><button className={category===c?"active":""} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div>

      <div className="actions-area">
        <div className="actions-title"><div><span className="label">ORDERS</span><h3>Direct {selected.name}</h3></div><span className="muted">Commands become simulation state.</span></div>
        <div className="action-grid">{visibleActions.map(a=><button disabled={a.disabled} className="action-card" key={a.id} onClick={a.run}><span className="action-icon">{a.icon}</span><span><b>{a.title}</b><small>{a.subtitle}</small></span><i>›</i></button>)}</div>
        {commandNote&&<div className="command-note"><span>✦</span>{commandNote}</div>}
      </div>

      <div className="sheet-foot"><div><span>Heritage</span><strong>{selected.royalGeneticHeritage?"Royal bloodline":"Ordinary lineage"}</strong></div><div><span>Parents</span><strong>{selected.parentIds.length?selected.parentIds.map(id=>sim.state.citizens[id]?.name).filter(Boolean).join(" & "):"Founders"}</strong></div><div><span>Children</span><strong>{selected.childIds.length}</strong></div><div><span>Genetic tech</span><strong>{selected.genome.geneticTechIds.length||"—"}</strong></div></div>
    </section>
  </div>}

  <div className="floating-advance"><button onClick={advance}>Advance 1 year <b>→</b></button></div><nav className="mobile-nav">{([["Camp","◫"],["People","♙"],["Resources","◈"],["Building","⌂"],["Research","◇"]] as [MainTab,string][]).map(([tab,icon])=><button className={mainTab===tab?"active":""} key={tab} onClick={()=>{setMainTab(tab);setDetailOpen(false)}}>{icon}<span>{tab}</span></button>)}</nav>
 {booting&&<div className="boot-screen"><div className="boot-mark">DS</div><span className="label">DYNASTY SIM</span><h1>The First Dynasty</h1><p>Preparing the founding camp…</p><div className="boot-bar"><span/></div></div>}
 </main>;
}
