import type { Unit } from "./Unit";

/** Pure linear scale of a unit relative to base, ignoring any affine offset. */
export const scaleOf = (unit: Unit): number => unit.toBase(1) - unit.toBase(0);
