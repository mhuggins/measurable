import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Force. Base unit: newton. */
export const force = new Dimension("force");

export const newton = force.base("newton", { symbol: "N", plural: "newtons" });
export const dyne = force.unit("dyne", 0.00001, { symbol: "dyn", plural: "dynes" });
export const poundForce = force.unit("poundForce", 4.4482216152605, { symbol: "lbf" });
export const kilogramForce = force.unit("kilogramForce", 9.80665, { symbol: "kgf" });

/** Every SI-prefixed newton (kilonewton, meganewton, millinewton, …), keyed by name. */
export const metricForce = definePrefixed(force, newton);
export const { meganewton, kilonewton, millinewton, micronewton } = metricForce;
