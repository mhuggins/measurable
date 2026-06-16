import type { Dimension } from "../lib/Dimension";

export class UnknownUnitError extends Error {
  constructor(token: string, dimension: Dimension) {
    super(`Unknown unit "${token}" in dimension "${dimension.name}"`);
  }
}
