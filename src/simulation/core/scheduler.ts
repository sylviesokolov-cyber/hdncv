export type ScheduledSystem=(tick:number)=>void;
export class TickScheduler{
 private systems:ScheduledSystem[]=[];
 add(system:ScheduledSystem):()=>void{this.systems.push(system);return()=>{this.systems=this.systems.filter(s=>s!==system);};}
 run(tick:number):void{for(const system of [...this.systems])system(tick);}
 get size():number{return this.systems.length;}
}