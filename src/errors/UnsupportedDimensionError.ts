import type { Dimension } from "../lib/Dimension";
import type { MeasurementSystem } from "../lib/MeasurementSystem";

/**
 * Thrown when a measurement system is asked to express a quantity in a dimension
 * for which it has no units (e.g. an imperial-only system and a metric-only
 * dimension).
 */
export class UnsupportedDimensionError extends Error {
  constructor(system: MeasurementSystem, dimension: Dimension) {
    super(`Measurement system "${system.name}" has no "${dimension.name}" units to express in`);
  }
}
