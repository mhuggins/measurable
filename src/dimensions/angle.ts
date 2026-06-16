import { Dimension } from "../lib/Dimension";

/** Plane angle. Base unit: radian. */
export const angle = new Dimension("angle");

export const radian = angle.base("radian", ["rad", "radians"]);
export const degree = angle.unit("degree", Math.PI / 180, ["deg", "°", "degrees"]);
export const gradian = angle.unit("gradian", Math.PI / 200, ["grad", "gradians"]);
export const turn = angle.unit("turn", 2 * Math.PI, ["turns", "revolution", "revolutions"]);
