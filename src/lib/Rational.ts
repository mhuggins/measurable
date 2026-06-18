/**
 * An exact rational number (`n / d`) used to make conversions between linear
 * and affine units lossless. Such conversions are inherently rational — a foot
 * is exactly `3048/10000` m and an inch exactly `254/10000` m, so foot → inch is
 * exactly `12` — but baking those ratios into binary `number` scales rounds the
 * result (`12.000000000000002`). Doing the arithmetic over integer numerator /
 * denominator pairs and collapsing to a float only at the end avoids the drift.
 *
 * Instances are immutable and always stored in lowest terms with a positive
 * denominator. `bigint` is used so cross-multiplying large scales (e.g. a
 * mile's `1609344`) cannot overflow.
 */
export class Rational {
  readonly n: bigint;
  readonly d: bigint;

  /**
   * Build a rational from integer numerator and denominator. Pass exact ratios
   * the literal way — `new Rational(5, 9)` — using `bigint` or integer `number`.
   * For a decimal value, use {@link Rational.fromNumber} instead.
   */
  constructor(numerator: bigint | number, denominator: bigint | number = 1n) {
    let n = toBigInt(numerator);
    let d = toBigInt(denominator);
    if (d === 0n) {
      throw new Error("Rational denominator cannot be zero");
    }
    if (d < 0n) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d) || 1n;
    this.n = n / g;
    this.d = d / g;
  }

  /** Coerce a `number | Rational` to a `Rational`, parsing numbers as decimals. */
  static from(value: number | Rational): Rational {
    return value instanceof Rational ? new this(value.n, value.d) : Rational.fromNumber(value);
  }

  /**
   * Convert a `number` to the exact rational the author *wrote*, by reading its
   * shortest round-tripping decimal (`(0.0254).toString() === "0.0254"` →
   * `254/10000`). This recovers the intended terminating decimal. A value that
   * was never terminating in source (e.g. Fahrenheit's `5 / 9`) is captured as
   * the exact rational of its nearest double — no worse than a raw float, and
   * the conversion is still done in one rounding instead of several. To avoid
   * that, pass an exact {@link Rational} (e.g. `new Rational(5, 9)`) instead.
   */
  private static fromNumber(value: number): Rational {
    if (!Number.isFinite(value)) {
      throw new Error(`Cannot derive a rational from ${value}`);
    }
    const match = /^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(value.toString());
    if (!match) {
      throw new Error(`Cannot derive a rational from ${value}`);
    }
    const [, sign, intPart, fracPart = "", expPart] = match;
    let n = BigInt(intPart + fracPart);
    let d = 10n ** BigInt(fracPart.length);
    const exp = expPart ? Number(expPart) : 0;
    if (exp > 0) {
      n *= 10n ** BigInt(exp);
    } else if (exp < 0) {
      d *= 10n ** BigInt(-exp);
    }
    return new Rational(sign === "-" ? -n : n, d);
  }

  plus(other: Rational): Rational {
    return new Rational(this.n * other.d + other.n * this.d, this.d * other.d);
  }

  minus(other: Rational): Rational {
    return new Rational(this.n * other.d - other.n * this.d, this.d * other.d);
  }

  times(other: Rational): Rational {
    return new Rational(this.n * other.n, this.d * other.d);
  }

  dividedBy(other: Rational): Rational {
    return new Rational(this.n * other.d, this.d * other.n);
  }

  negate(): Rational {
    return new Rational(-this.n, this.d);
  }

  abs(): Rational {
    return new Rational(this.n < 0n ? -this.n : this.n, this.d);
  }

  /** Whether this equals `other` exactly (both are stored in canonical form). */
  equals(other: Rational): boolean {
    return this.n === other.n && this.d === other.d;
  }

  /** Alias for {@link plus}. */
  add(other: Rational): Rational {
    return this.plus(other);
  }

  /** Alias for {@link minus}. */
  sub(other: Rational): Rational {
    return this.minus(other);
  }

  /** Alias for {@link times}. */
  mul(other: Rational): Rational {
    return this.times(other);
  }

  /** Alias for {@link dividedBy}. */
  div(other: Rational): Rational {
    return this.dividedBy(other);
  }

  /** Alias for {@link equals}. */
  eq(other: Rational): boolean {
    return this.equals(other);
  }

  /** `-1` if this is smaller than `other`, `1` if larger, `0` if equal. */
  compare(other: Rational): number {
    // Denominators are always positive, so cross-multiplication preserves order.
    const lhs = this.n * other.d;
    const rhs = other.n * this.d;
    return lhs < rhs ? -1 : lhs > rhs ? 1 : 0;
  }

  /** Sign of the value: `-1`, `0`, or `1`. */
  sign(): number {
    return this.n < 0n ? -1 : this.n > 0n ? 1 : 0;
  }

  /** Collapse to the nearest `number`. */
  toNumber(): number {
    return Number(this.n) / Number(this.d);
  }
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}

function toBigInt(value: bigint | number): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  if (!Number.isInteger(value)) {
    throw new Error(`Rational numerator and denominator must be integers; got ${value}`);
  }
  return BigInt(value);
}
