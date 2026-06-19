import type { Dimension } from "../lib/Dimension";
import { Rational } from "../lib/Rational";
import type { Unit } from "../lib/Unit";
import { scaleOf } from "./scaleOf";

/** A metric (SI) prefix: a name, symbol, and power-of-ten factor. */
export interface SiPrefix {
  name: string;
  symbol: string;
  factor: number;
}

/** The full set of SI prefixes, yotta (1e24) down to yocto (1e-24). */
export const SI_PREFIXES: readonly SiPrefix[] = [
  { name: "yotta", symbol: "Y", factor: 1e24 },
  { name: "zetta", symbol: "Z", factor: 1e21 },
  { name: "exa", symbol: "E", factor: 1e18 },
  { name: "peta", symbol: "P", factor: 1e15 },
  { name: "tera", symbol: "T", factor: 1e12 },
  { name: "giga", symbol: "G", factor: 1e9 },
  { name: "mega", symbol: "M", factor: 1e6 },
  { name: "kilo", symbol: "k", factor: 1e3 },
  { name: "hecto", symbol: "h", factor: 1e2 },
  { name: "deca", symbol: "da", factor: 1e1 },
  { name: "deci", symbol: "d", factor: 1e-1 },
  { name: "centi", symbol: "c", factor: 1e-2 },
  { name: "milli", symbol: "m", factor: 1e-3 },
  { name: "micro", symbol: "µ", factor: 1e-6 },
  { name: "nano", symbol: "n", factor: 1e-9 },
  { name: "pico", symbol: "p", factor: 1e-12 },
  { name: "femto", symbol: "f", factor: 1e-15 },
  { name: "atto", symbol: "a", factor: 1e-18 },
  { name: "zepto", symbol: "z", factor: 1e-21 },
  { name: "yocto", symbol: "y", factor: 1e-24 },
];

/** SI prefixes for fractions only (deci and smaller) — for units like seconds. */
export const SI_SUBMULTIPLE_PREFIXES: readonly SiPrefix[] = SI_PREFIXES.filter(
  (prefix) => prefix.factor < 1,
);

/**
 * Define metric-prefixed variants of a `reference` unit on its dimension. Each
 * variant is named `${prefix}${reference.name}` (e.g. "kilometer"), scaled by
 * `prefix.factor` relative to the reference (its own scale is read from the unit
 * via `scaleOf`, so prefixing a non-base unit like the watt-hour works
 * automatically). Each variant carries a generated `symbol`
 * (`${prefix.symbol}${reference.symbol}`, when the reference has a symbol) and a
 * `plural` (`${name}s`), plus an ASCII "u" alias for micro.
 *
 * Prefixes whose generated name already exists on the dimension are skipped, so
 * a base like "kilogram" is left intact when prefixing "gram".
 *
 * Returns the created units keyed by name, for spreading into a
 * {@link MeasurementSystem} or destructuring into named exports.
 */
export function definePrefixed(
  dimension: Dimension,
  reference: Unit,
  prefixes: readonly SiPrefix[] = SI_PREFIXES,
): Record<string, Unit> {
  // Prefer the reference's exact rational scale so the prefixed scale stays
  // exact; fall back to its float scale only for non-linear references.
  const referenceScale = reference.linear
    ? reference.linear.scale
    : Rational.from(scaleOf(reference));
  const units: Record<string, Unit> = {};
  for (const prefix of prefixes) {
    const name = `${prefix.name}${reference.name}`;
    if (dimension.get(name)) {
      continue;
    }
    const symbol = reference.symbol ? `${prefix.symbol}${reference.symbol}` : undefined;
    const aliases = prefix.name === "micro" && reference.symbol ? [`u${reference.symbol}`] : [];
    // Multiply as rationals: each factor (a power of ten, or an exact reference
    // scale) is lossless on its own, but multiplying them as floats can drift
    // (e.g. 3600 * 1e-9). Rational multiplication keeps the prefixed scale exact.
    const scale = referenceScale.times(Rational.from(prefix.factor));
    units[name] = dimension.unit(name, scale, {
      symbol,
      plural: `${name}s`,
      aliases,
    });
  }
  return units;
}
