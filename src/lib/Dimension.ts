import { InvalidConversionError } from "../errors/InvalidConversionError";
import { Unit } from "./Unit";

/** A linear unit with an additive offset (e.g. temperature scales). */
export interface AffineSpec {
  /** Multiplier applied when converting a value to the base unit. */
  scale: number;
  /** Constant added (in base units) after scaling. */
  offset: number;
}

/** A fully custom transform pair for non-linear units. */
export interface CustomSpec {
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

/**
 * A dimension is a single *kind* of measurable quantity (length, volume, mass,
 * temperature, …). It owns one canonical **base unit** that every other unit in
 * the dimension is defined relative to, and it is the single place where all
 * conversion math happens.
 *
 * Converting `A → B` is always `B.fromBase(A.toBase(value))`: route through the
 * base unit. This gives transitive conversions for free (any unit ↔ any unit)
 * and means each unit only ever stores its relationship to the base — never a
 * redundant, drift-prone pair of factors.
 *
 * A dimension is distinct from a {@link MeasurementSystem} (metric/imperial/…):
 * the dimension decides what *can convert*, while a measurement system is a tag
 * that never participates in conversion.
 */
export class Dimension {
  readonly units = new Set<Unit>();
  /**
   * Lookup from every name/alias to its candidate units, used by parsing. A
   * token can map to more than one unit (e.g. "ton" → short ton & long ton);
   * the caller disambiguates with a preferred measurement system.
   */
  private readonly index = new Map<string, Unit[]>();
  /** The canonical unit all others convert through. Set by {@link base}. */
  baseUnit?: Unit;

  constructor(public readonly name: string) {}

  /** Define the canonical base unit (identity transform). */
  base(name: string, aliases: string[] = []): Unit {
    const unit = this.define(
      name,
      (x) => x,
      (x) => x,
      aliases,
    );
    this.baseUnit = unit;
    return unit;
  }

  /**
   * Define a linear unit. `scale` is how many base units make up one of this
   * unit (e.g. a kilometer is `1000` meters).
   */
  unit(name: string, scale: number, aliases: string[] = []): Unit {
    return this.define(
      name,
      (x) => x * scale,
      (x) => x / scale,
      aliases,
    );
  }

  /** Define an affine unit (scale plus additive offset, e.g. °C against K). */
  affine(name: string, { scale, offset }: AffineSpec, aliases: string[] = []): Unit {
    return this.define(
      name,
      (x) => x * scale + offset,
      (x) => (x - offset) / scale,
      aliases,
    );
  }

  /** Define a unit with an arbitrary, hand-written inverse transform pair. */
  custom(name: string, { toBase, fromBase }: CustomSpec, aliases: string[] = []): Unit {
    return this.define(name, toBase, fromBase, aliases);
  }

  /** Convert a value between two units of this dimension, routed through the base. */
  convert(value: number, from: Unit, to: Unit): number {
    if (!this.units.has(from) || !this.units.has(to)) {
      throw new InvalidConversionError(from, to);
    }
    if (from === to) {
      return value;
    }
    return to.fromBase(from.toBase(value));
  }

  /** Resolve a name or alias to its candidate unit(s) (used by parsing). */
  get(token: string): Unit[] | undefined {
    return this.index.get(token);
  }

  has(unit: Unit): boolean {
    return this.units.has(unit);
  }

  private define(
    name: string,
    toBase: (value: number) => number,
    fromBase: (value: number) => number,
    aliases: string[],
  ): Unit {
    for (const existing of this.units) {
      if (existing.name === name) {
        throw new Error(`Duplicate unit name "${name}" in dimension "${this.name}"`);
      }
    }
    const unit = new Unit({ name, dimension: this, toBase, fromBase });
    this.units.add(unit);
    this.register(name, unit);
    for (const alias of aliases) {
      this.register(alias, unit);
    }
    return unit;
  }

  /** Append a name/alias → unit mapping; shared aliases accumulate candidates. */
  private register(token: string, unit: Unit): void {
    const candidates = this.index.get(token);
    if (candidates) {
      candidates.push(unit);
    } else {
      this.index.set(token, [unit]);
    }
  }
}
