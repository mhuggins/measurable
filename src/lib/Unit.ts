import type { Dimension } from "./Dimension";

interface UnitOptions {
  name: string;
  dimension: Dimension;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

/**
 * A single unit of measurement (e.g. "meter", "celsius").
 *
 * A `Unit` is a passive handle: it knows its name, its home {@link Dimension},
 * and how to transform a value to and from that dimension's canonical base
 * unit. It does NOT know about other units or store pairwise conversions — all
 * conversion math lives in {@link Dimension}, derived from these two transforms.
 * Because the reverse direction (`fromBase`) is the mathematical inverse of the
 * forward direction (`toBase`), the two can never fall out of sync.
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
  public readonly toBase: (value: number) => number;
  public readonly fromBase: (value: number) => number;

  constructor({ name, dimension, toBase, fromBase }: UnitOptions) {
    this.name = name;
    this.dimension = dimension;
    this.toBase = toBase;
    this.fromBase = fromBase;
  }
}
