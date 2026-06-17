import { Dimension } from "../lib/Dimension";
import type { Unit } from "../lib/Unit";

/** Digital information. Base unit: bit. */
export const data = new Dimension("data");

export const bit = data.base("bit", ["b", "bits"]);
export const nibble = data.unit("nibble", 4, ["nibbles"]);
export const byte = data.unit("byte", 8, ["B", "bytes"]);

// SI (decimal, 1000-based) and IEC (binary, 1024-based) multiples of the bit
// and byte. SI uses the bare symbol (kb, kB); IEC uses the "i" infix (Kib, KiB).
const SI_MULTIPLES = [
  ["kilo", "k", 1e3],
  ["mega", "M", 1e6],
  ["giga", "G", 1e9],
  ["tera", "T", 1e12],
  ["peta", "P", 1e15],
] as const;

const IEC_MULTIPLES = [
  ["kibi", "Ki", 2 ** 10],
  ["mebi", "Mi", 2 ** 20],
  ["gibi", "Gi", 2 ** 30],
  ["tebi", "Ti", 2 ** 40],
  ["pebi", "Pi", 2 ** 50],
] as const;

const multiples: Record<string, Unit> = {};
for (const [prefix, symbol, factor] of [...SI_MULTIPLES, ...IEC_MULTIPLES]) {
  multiples[`${prefix}bit`] = data.unit(`${prefix}bit`, factor, [`${symbol}b`, `${prefix}bits`]);
  multiples[`${prefix}byte`] = data.unit(`${prefix}byte`, 8 * factor, [
    `${symbol}B`,
    `${prefix}bytes`,
  ]);
}

/** Every SI and IEC multiple of the bit and byte, keyed by name. */
export const dataMultiples = multiples;
export const {
  kilobit,
  kilobyte,
  megabit,
  megabyte,
  gigabit,
  gigabyte,
  terabit,
  terabyte,
  petabit,
  petabyte,
  kibibit,
  kibibyte,
  mebibit,
  mebibyte,
  gibibit,
  gibibyte,
  tebibit,
  tebibyte,
  pebibit,
  pebibyte,
} = multiples;
