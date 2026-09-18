import {useMemo,useState} from "react";
import {Simulation} from "../simulation/core/simulation";
import type {Citizen} from "../simulation/core/types";

export function App(){
 const sim=useMemo(()=>new Simulation(20260918),[]);
 const [,refresh]=useState(0); const [selected,setSelected]=useState<Citizen>(sim.state.citizens[sim.state.founders.kingId]);
 const king=sim.state.citizens[sim.state.founders.kingId], queen=sim.state.citizens[sim.state.founders.queenId];
 const advance=()=>{sim.advance(1);refresh(x=>x+1);setSelected(sim.state.citizens[selected.id]??selected)};
 const child=()=>{try{const c=sim.createChild(king,queen);setSelected(c);refresh(x=>x+1)}catch(e){alert(e instanceof Error?e.message:"Command failed")}};
 return <main className="game"><header><div><p className="eyebrow">DYNASTY SIM · ERA 0</p><h1>The First Dynasty</h1><p className="muted">A civilization begins with two immortal founders.</p></div><div className="controls"><button onClick={advance}>Advance 1 year</button><button onClick={child}>Royal birth</button></div></header>
 <section className="stats"><div><span>Year</span><strong>{sim.state.tick}</strong></div><div><span>Population</span><strong>{sim.livingCitizens.length}</strong></div><div><span>Founders</span><strong>2 immortal</strong></div><div><span>Generation</span><strong>{Math.max(...sim.livingCitizens.map(c=>c.generation))}</strong></div></section>
 <section className="layout"><div className="people panel"><h2>People</h2>{sim.livingCitizens.map(c=><button className={"person "+(selected.id===c.id?"selected":"")} key={c.id} onClick={()=>setSelected(c)}><span className="avatar">{c.sex==="male"?"K":"Q"}</span><span><b>{c.name}</b><small>Gen {c.generation} · {c.ageYears} years · {c.founder?"Founder":"Royal descendant"}</small></span></button>)}</div>
 <div className="panel detail"><p className="eyebrow">CITIZEN</p><h2>{selected.name}</h2><p>{selected.founder?"Immortal founder":"Mortal descendant"} · {selected.lifeStage}</p><div className="meters"><label>Health <progress value={selected.health} max="100"/></label><label>Hunger <progress value={selected.hunger} max="100"/></label><label>Thirst <progress value={selected.thirst} max="100"/></label></div><h3>Genetic heritage</h3><p>Longevity {selected.genome.longevity} · Strength {selected.genome.strength} · Learning {selected.genome.learning}</p><p className="muted">{selected.genome.geneticTechIds.length?("Founder technologies: "+selected.genome.geneticTechIds.join(", ")):"No founder genetic technology."}</p></div>
 <div className="panel chronicle"><p className="eyebrow">CHRONICLE</p><h2>History</h2>{sim.state.chronicle.slice(-8).reverse().map((e,i)=><p key={i}>{e}</p>)}</div></section></main>;
}