import type { Dimension } from "../lib/Dimension";

/** Thrown when defining a unit whose name already exists in its dimension. */
export class DuplicateUnitError extends Error {
  constructor(name: string, dimension: Dimension) {
    super(`Duplicate unit name "${name}" in dimension "${dimension.name}"`);
  }
}
