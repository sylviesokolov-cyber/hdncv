import {useEffect,useMemo,useState} from "react";
import {Simulation} from "../simulation/core/simulation";
import type {Citizen} from "../simulation/core/types";

export function App(){
 const sim=useMemo(()=>new Simulation(20260918),[]);
 const [,refresh]=useState(0); const [selected,setSelected]=useState<Citizen>(sim.state.citizens.c_king);
 const [running,setRunning]=useState(false); const [speed,setSpeed]=useState(1);
 const king=sim.state.citizens.c_king,queen=sim.state.citizens.c_queen;
 useEffect(()=>{if(!running)return;const id=window.setInterval(()=>{sim.advance(1);refresh(x=>x+1);setSelected(c=>sim.state.citizens[c.id]??c)},Math.max(150,1000/speed));return()=>window.clearInterval(id)},[running,speed,sim]);
 const act=(fn:()=>void)=>{try{fn();refresh(x=>x+1);setSelected(c=>sim.state.citizens[c.id]??c)}catch(e){window.alert(e instanceof Error?e.message:"Command failed")}};
 const gather=(resource:"food"|"water"|"wood"|"stone")=>act(()=>sim.gather(selected,resource));
 const maxGen=Math.max(...Object.values(sim.state.citizens).map(c=>c.generation));
 return <main className="game">
 <header><div><p className="eyebrow">DYNASTY SIM · ERA 0 · PLAYABLE DEMO</p><h1>The First Dynasty</h1><p className="muted">Guide two immortal founders from a camp toward civilization.</p></div>
 <div className="controls"><button onClick={()=>setRunning(!running)}>{running?"Pause":"Run simulation"}</button><button onClick={()=>act(()=>sim.advance(1))}>+1 year</button><select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option><option value={8}>8×</option></select></div></header>
 <section className="stats"><div><span>Year</span><strong>{sim.state.tick}</strong></div><div><span>Population</span><strong>{sim.livingCitizens.length}</strong></div><div><span>Generation</span><strong>{maxGen}</strong></div><div><span>Settlement</span><strong>{sim.state.settlement.shelterLevel?"Shelter":"Camp"}</strong></div></section>
 <section className="resources panel"><div><span>Food</span><strong>{sim.state.resources.food}</strong></div><div><span>Water</span><strong>{sim.state.resources.water}</strong></div><div><span>Wood</span><strong>{sim.state.resources.wood}</strong></div><div><span>Stone</span><strong>{sim.state.resources.stone}</strong></div><div><span>Fire</span><strong>{sim.state.settlement.fireLit?"Lit":"Out"}</strong></div></section>
 <section className="layout">
 <div className="people panel"><h2>People</h2>{sim.livingCitizens.map(c=><button className={"person "+(selected.id===c.id?"selected":"")} key={c.id} onClick={()=>setSelected(c)}><span className="avatar">{c.sex==="male"?"K":"Q"}</span><span><b>{c.name}</b><small>Gen {c.generation} · {c.ageYears} years · {c.founder?"Founder":"Royal descendant"}</small></span></button>)}</div>
 <div className="panel detail"><p className="eyebrow">CITIZEN</p><h2>{selected.name}</h2><p>{selected.founder?"Immortal founder":"Mortal descendant"} · {selected.lifeStage}</p><div className="meters"><label>Health <progress value={selected.health} max="100"/></label><label>Hunger <progress value={selected.hunger} max="100"/></label><label>Thirst <progress value={selected.thirst} max="100"/></label></div><h3>Act</h3><div className="action-grid"><button onClick={()=>gather("food")}>Gather food</button><button onClick={()=>gather("water")}>Gather water</button><button onClick={()=>gather("wood")}>Gather wood</button><button onClick={()=>gather("stone")}>Gather stone</button><button onClick={()=>act(()=>sim.lightFire(selected))}>Light fire</button><button onClick={()=>act(()=>sim.buildShelter(selected))}>Build shelter</button><button onClick={()=>act(()=>sim.marry(king,queen))}>Marry founders</button><button onClick={()=>act(()=>sim.conceive(queen,king))}>Conceive child</button></div><h3>Genetic heritage</h3><p>Longevity {selected.genome.longevity} · Strength {selected.genome.strength} · Learning {selected.genome.learning}</p><p className="muted">{selected.genome.geneticTechIds.length?("Founder technologies: "+selected.genome.geneticTechIds.join(", ")):"No founder genetic technology."}</p></div>
 <div className="panel chronicle"><p className="eyebrow">CHRONICLE</p><h2>History</h2>{sim.state.chronicle.slice(-12).reverse().map((e,i)=><p key={i}>{e}</p>)}</div>
 </section></main>;
}