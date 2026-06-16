import { AmbiguousUnitError } from "../errors/AmbiguousUnitError";
import { UnknownUnitError } from "../errors/UnknownUnitError";
import type { Dimension } from "./Dimension";
import type { MeasurementSystem } from "./MeasurementSystem";
import { scaleOf } from "./scale";
import type { Unit } from "./Unit";

/** Options for {@link Quantity.parse}. */
export interface ParseOptions {
  /** Preferred measurement system, used only to break ties on shared aliases. */
  prefer?: MeasurementSystem;
}

/** A magnitude paired with a unit (e.g. `5` `kilometer`). */
export class Quantity {
  constructor(
    public magnitude: number,
    public unit: Unit,
  ) {}

  /** Return an equivalent quantity expressed in `target`. */
  to(target: Unit): Quantity {
    return new Quantity(this.in(target), target);
  }

  /** Return this quantity's raw magnitude expressed in `target`. */
  in(target: Unit): number {
    return this.unit.dimension.convert(this.magnitude, this.unit, target);
  }

  /**
   * Parse a string into a `Quantity` using a dimension's known units and aliases.
   *
   *  - `"1km"`        -> `Quantity(1, kilometer)`
   *  - `"5 hr"`       -> `Quantity(5, hour)`
   *  - `"5hr 20min"`  -> `Quantity(320, minute)`
   *
   * Compound inputs are summed in base units and returned in the *finest*
   * (smallest-scale) unit present, so `"5hr 20min"` collapses to `320 minute`.
   *
   * When a token is a shared alias (e.g. `"ton"` → short ton & long ton), pass
   * `options.prefer` to pick the candidate belonging to that measurement system.
   */
  static parse(str: string, dimension: Dimension, options: ParseOptions = {}): Quantity {
    const pattern = /(-?\d+(?:\.\d+)?)\s*([^\d\s]+)/g;

    let total = 0; // accumulated in base units
    let finest: Unit | undefined;
    let count = 0;

    for (let match = pattern.exec(str); match !== null; match = pattern.exec(str)) {
      const value = Number.parseFloat(match[1]);
      const unit = resolve(match[2], dimension, options.prefer);
      total += unit.toBase(value);
      if (!finest || scaleOf(unit) < scaleOf(finest)) {
        finest = unit;
      }
      count += 1;
    }

    if (count === 0 || !finest) {
      throw new Error(`Could not parse a quantity from "${str}"`);
    }

    return new Quantity(finest.fromBase(total), finest);
  }
}

/** Resolve a token to a single unit, disambiguating shared aliases by system. */
function resolve(token: string, dimension: Dimension, prefer?: MeasurementSystem): Unit {
  const candidates = dimension.get(token);
  if (!candidates || candidates.length === 0) {
    throw new UnknownUnitError(token, dimension);
  }
  if (candidates.length === 1) {
    return candidates[0];
  }
  if (prefer) {
    const matches = candidates.filter((unit) => prefer.has(unit));
    if (matches.length === 1) {
      return matches[0];
    }
  }
  throw new AmbiguousUnitError(token, candidates);
}
