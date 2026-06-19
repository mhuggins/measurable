import type { Unit } from "../lib/Unit";

/**
 * Thrown when an operation is attempted on two units from different dimensions —
 * converting, comparing, or combining them (e.g. `meter` and `liter`). Such
 * units are dimensionally incompatible, so the operation has no meaning.
 */
export class DimensionMismatchError extends Error {
  constructor(from: Unit, to: Unit) {
    super(`Invalid conversion: ${from.name} to ${to.name}`);
  }
}

/** @deprecated Renamed to {@link DimensionMismatchError}. */
export const InvalidConversionError = DimensionMismatchError;
/** @deprecated Renamed to {@link DimensionMismatchError}. */
export type InvalidConversionError = DimensionMismatchError;
