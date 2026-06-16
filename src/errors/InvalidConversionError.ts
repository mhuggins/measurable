import type { Unit } from "../lib/Unit";

export class InvalidConversionError extends Error {
  constructor(from: Unit, to: Unit) {
    super(`Invalid conversion: ${from.name} to ${to.name}`);
  }
}
