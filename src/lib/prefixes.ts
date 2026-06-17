import type { Dimension } from "./Dimension";
import type { Unit } from "./Unit";

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

/** The unit a set of metric prefixes is generated relative to. */
export interface PrefixReference {
  /** Singular unit name, e.g. "meter" → "kilometer", "millimeter", … */
  name: string;
  /** Primary symbol, e.g. "m" → "km", "mm", … */
  symbol: string;
  /** Scale of the reference relative to its dimension's base (meter → 1, gram → 0.001). */
  scale: number;
}

/**
 * Define metric-prefixed variants of a reference unit on a dimension. Each
 * variant is named `${prefix}${reference.name}` (e.g. "kilometer") with scale
 * `reference.scale * prefix.factor`, plus a `${prefix.symbol}${reference.symbol}`
 * alias and a plural (and an ASCII "u" form for micro).
 *
 * Prefixes whose generated name already exists on the dimension are skipped, so
 * a base like "kilogram" is left intact when prefixing "gram".
 *
 * Returns the created units keyed by name, for spreading into a
 * {@link MeasurementSystem} or destructuring into named exports.
 */
export function definePrefixed(
  dimension: Dimension,
  reference: PrefixReference,
  prefixes: readonly SiPrefix[] = SI_PREFIXES,
): Record<string, Unit> {
  const units: Record<string, Unit> = {};
  for (const prefix of prefixes) {
    const name = `${prefix.name}${reference.name}`;
    if (dimension.get(name)) {
      continue;
    }
    const aliases = [`${prefix.symbol}${reference.symbol}`, `${name}s`];
    if (prefix.name === "micro") {
      aliases.push(`u${reference.symbol}`);
    }
    units[name] = dimension.unit(name, reference.scale * prefix.factor, aliases);
  }
  return units;
}
