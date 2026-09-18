import type {SimulationCommand,SimulationEvent} from "./types";
export interface CommandContext{dispatch(command:SimulationCommand):SimulationEvent[];}
export function isValidAdvance(command:SimulationCommand):boolean{return command.type==="advance"&&Number.isInteger(command.years)&&command.years>0;}