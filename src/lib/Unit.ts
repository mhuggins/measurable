import type { Dimension } from "./Dimension";
import type { Rational } from "./Rational";

/**
 * An affine transform to the base unit, `base = value * scale + offset`, with
 * both terms held as exact rationals. Covers the base unit (`1·x + 0`), plain
 * linear units (`scale·x + 0`), and offset units like Celsius (`1·x + 273.15`).
 */
export interface LinearTransform {
  scale: Rational;
  offset: Rational;
}

interface BaseUnitOptions {
  name: string;
  dimension: Dimension;
}

interface LinearConversionOptions {
  /** Exact transform for linear / affine units (the common case). */
  linear: LinearTransform;
}

interface CustomConversionOptions {
  /** Hand-written transform for non-linear units; mutually exclusive with `linear`. */
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export type UnitConversionOptions = LinearConversionOptions | CustomConversionOptions;

type UnitOptions = BaseUnitOptions & UnitConversionOptions;

/**
 * A single unit of measurement (e.g. "meter", "celsius").
 *
 * A `Unit` is a passive handle: it knows its name, its home {@link Dimension},
 * and how to transform a value to and from that dimension's canonical base
 * unit. It does NOT know about other units or store pairwise conversions — all
 * conversion math lives in {@link Dimension}, derived from this transform.
 *
 * Almost every unit relates to the base by an affine map (`value * scale +
 * offset`), so the transform is normally a {@link LinearTransform} of exact
 * rationals — a single source of truth from which {@link toBase} / {@link
 * fromBase} are derived, and which lets {@link Dimension.convert} stay exact.
 * Only genuinely non-linear units (e.g. logarithmic scales, defined via
 * `Dimension.custom`) fall back to a hand-written `toBase` / `fromBase` pair,
 * since no `scale`/`offset` can express a curve like `10^x`.
 *
 * A unit belongs to exactly one dimension, but may belong to many
 * {@link MeasurementSystem}s (metric/imperial/…); that membership lives on the
 * measurement systems, not here, so a `Unit` stays a lean descriptor.
 *
 * Names and aliases live solely in the dimension's lookup index; they are
 * declared once when the unit is defined.
 *
 * Units are normally created through a {@link Dimension}'s builder methods
 * (`base`, `unit`, `affine`, `custom`) rather than constructed directly.
 */
export class Unit {
  public readonly name: string;
  public readonly dimension: Dimension;
  private readonly conversion: UnitConversionOptions;

  constructor({ name, dimension, ...conversionOptions }: UnitOptions) {
    this.name = name;
    this.dimension = dimension;
    this.conversion = conversionOptions;
  }

  /**
   * Exact affine transform to the base unit, present for all but non-linear
   * units. When both ends of a conversion have one, {@link Dimension.convert}
   * routes through exact rational arithmetic instead of lossy float scaling.
   */
  get linear(): LinearTransform | undefined {
    return "linear" in this.conversion ? this.conversion.linear : undefined;
  }

  /** Convert a value in this unit to the dimension's base unit. */
  toBase(value: number): number {
    if ("linear" in this.conversion) {
      const linear = this.conversion.linear;
      return value * linear.scale.toNumber() + linear.offset.toNumber();
    }
    return this.conversion.toBase(value);
  }

  /** Convert a value in the dimension's base unit to this unit. */
  fromBase(value: number): number {
    if ("linear" in this.conversion) {
      const linear = this.conversion.linear;
      return (value - linear.offset.toNumber()) / linear.scale.toNumber();
    }
    return this.conversion.fromBase(value);
  }
}
