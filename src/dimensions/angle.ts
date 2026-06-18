import { Dimension } from "../lib/Dimension";
import { definePrefixed, SI_SUBMULTIPLE_PREFIXES } from "../utils/definePrefixed";

/** Plane angle. Base unit: radian. */
export const angle = new Dimension("angle");

export const radian = angle.base("radian", { symbol: "rad", plural: "radians" });
export const degree = angle.unit("degree", Math.PI / 180, {
  symbol: "°",
  plural: "degrees",
  aliases: ["deg"],
});
export const gradian = angle.unit("gradian", Math.PI / 200, { symbol: "grad", plural: "gradians" });
export const turn = angle.unit("turn", 2 * Math.PI, {
  plural: "turns",
  aliases: ["revolution", "revolutions"],
});

/** SI-submultiple radians (milliradian, microradian, …); larger angles use degree/turn. */
export const metricAngle = definePrefixed(angle, radian, SI_SUBMULTIPLE_PREFIXES);
export const { milliradian, microradian } = metricAngle;
