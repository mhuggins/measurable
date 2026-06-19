import { DimensionMismatchError } from "../errors/DimensionMismatchError";
import { DuplicateUnitError } from "../errors/DuplicateUnitError";
import { Rational } from "./Rational";
import { type LinearTransform, Unit, UnitConversionOptions } from "./Unit";

/** The rational `0`. */
const zero = new Rational(0n);

/** The rational `1`. */
const one = new Rational(1n);

/** A linear unit with an additive offset (e.g. temperature scales). */
export interface AffineSpec {
  /**
   * Multiplier applied when converting a value to the base unit. Pass a
   * {@link Rational} (e.g. `new Rational(5, 9)`) for ratios that a decimal
   * cannot represent exactly.
   */
  scale: number | Rational;
  /** Constant added (in base units) after scaling. */
  offset: number | Rational;
}

/** A fully custom transform pair for non-linear units. */
export interface CustomSpec {
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

/** Optional descriptors for a unit: its symbol, plural, and extra parse aliases. */
export interface UnitDef {
  /** Canonical symbol, e.g. `"g"`, `"km"`, `"°C"`. Also registered for parsing. */
  symbol?: string;
  /** Plural name, e.g. `"grams"`. Also registered for parsing. */
  plural?: string;
  /** Additional names this unit parses from (beyond name, symbol, and plural). */
  aliases?: string[];
}

/**
 * A dimension is a single *kind* of measurable quantity (length, volume, mass,
 * temperature, …). It owns one canonical **base unit** that every other unit in
 * the dimension is defined relative to, and it is the single place where all
 * conversion math happens.
 *
 * Converting `A → B` routes through the base unit — conceptually
 * `B.fromBase(A.toBase(value))`. This gives transitive conversions for free
 * (any unit ↔ any unit) and means each unit only ever stores its relationship
 * to the base — never a redundant, drift-prone pair of factors. Linear and
 * affine units carry that relationship as an exact {@link Rational} transform,
 * so their conversions are done in rational arithmetic and collapsed to a float
 * once at the end, avoiding the binary rounding of routing through the base.
 * Only non-linear units (defined via {@link custom}) fall back to float.
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
  base(name: string, def: UnitDef = {}): Unit {
    const unit = this.defineLinear(name, { scale: one, offset: zero }, def);
    this.baseUnit = unit;
    return unit;
  }

  /**
   * Define a linear unit. `scale` is how many base units make up one of this
   * unit (e.g. a kilometer is `1000` meters). Pass a {@link Rational} for a
   * scale a decimal cannot represent exactly.
   */
  unit(name: string, scale: number | Rational, def: UnitDef = {}): Unit {
    return this.defineLinear(name, { scale: Rational.from(scale), offset: zero }, def);
  }

  /** Define an affine unit (scale plus additive offset, e.g. °C against K). */
  affine(name: string, { scale, offset }: AffineSpec, def: UnitDef = {}): Unit {
    return this.defineLinear(
      name,
      { scale: Rational.from(scale), offset: Rational.from(offset) },
      def,
    );
  }

  /**
   * Define a non-linear unit from an arbitrary, hand-written inverse transform
   * pair. Reserve this for units that genuinely cannot be expressed as `value *
   * scale + offset` — e.g. logarithmic scales (decibels, octaves). Linear and
   * affine units should use {@link unit} / {@link affine} so conversions stay
   * exact.
   */
  custom(name: string, { toBase, fromBase }: CustomSpec, def: UnitDef = {}): Unit {
    return this.define(name, def, { toBase, fromBase });
  }

  /** Convert a `number` value between two units of this dimension. */
  convert(value: number, from: Unit, to: Unit): number {
    return this.convertRational(Rational.from(value), from, to).toNumber();
  }

  /**
   * Convert an exact {@link Rational} value between two units, routed through
   * the base. Linear / affine units stay exact end-to-end (the result is never
   * collapsed to a float here), which is what lets {@link Quantity} chain
   * conversions without drift. A conversion touching a non-linear `custom` unit
   * falls back to float math and recaptures the result as a rational.
   */
  convertRational(value: Rational, from: Unit, to: Unit): Rational {
    if (!this.units.has(from) || !this.units.has(to)) {
      throw new DimensionMismatchError(from, to);
    }
    if (from === to) {
      return value;
    }
    if (from.linear && to.linear) {
      // base = from.scale * value + from.offset; result = (base - to.offset) / to.scale
      const base = from.linear.scale.times(value).plus(from.linear.offset);
      return base.minus(to.linear.offset).dividedBy(to.linear.scale);
    }
    return Rational.from(to.fromBase(from.toBase(value.toNumber())));
  }

  /** Resolve a name or alias to its candidate unit(s) (used by parsing). */
  get(token: string): Unit[] | undefined {
    return this.index.get(token);
  }

  has(unit: Unit): boolean {
    return this.units.has(unit);
  }

  /** Define a linear / affine unit from its exact rational transform. */
  private defineLinear(name: string, linear: LinearTransform, def: UnitDef): Unit {
    return this.define(name, def, { linear });
  }

  private define(
    name: string,
    { symbol, plural, aliases = [] }: UnitDef,
    transform: UnitConversionOptions,
  ): Unit {
    for (const existing of this.units) {
      if (existing.name === name) {
        throw new DuplicateUnitError(name, this);
      }
    }
    const unit = new Unit({ name, dimension: this, symbol, plural, ...transform });
    this.units.add(unit);
    // Register every label this unit can be parsed from, de-duplicated so a unit
    // never appears twice among a token's candidates (e.g. if symbol === name).
    const tokens = new Set([name, symbol, plural, ...aliases].filter((t): t is string => !!t));
    for (const token of tokens) {
      this.register(token, unit);
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
