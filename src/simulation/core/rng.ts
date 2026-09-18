export class SeededRng {
  private state:number;
  constructor(seed:number){this.state=(seed>>>0)||1;}
  next():number {
    let x=this.state; x^=x<<13; x^=x>>>17; x^=x<<5; this.state=x>>>0;
    return this.state/4294967296;
  }
  int(min:number,max:number){return Math.floor(this.next()*(max-min+1))+min;}
  pick<T>(items:T[]):T{return items[this.int(0,items.length-1)];}
}