import { Dimension } from "../lib/Dimension";
import { definePrefixed, SI_SUBMULTIPLE_PREFIXES } from "../utils/definePrefixed";

/** Plane angle. Base unit: radian. */
export const angle = new Dimension("angle");

export const radian = angle.base("radian", ["rad", "radians"]);
export const degree = angle.unit("degree", Math.PI / 180, ["deg", "°", "degrees"]);
export const gradian = angle.unit("gradian", Math.PI / 200, ["grad", "gradians"]);
export const turn = angle.unit("turn", 2 * Math.PI, ["turns", "revolution", "revolutions"]);

/** SI-submultiple radians (milliradian, microradian, …); larger angles use degree/turn. */
export const metricAngle = definePrefixed(
  angle,
  { name: "radian", symbol: "rad" },
  SI_SUBMULTIPLE_PREFIXES,
);
export const { milliradian, microradian } = metricAngle;
