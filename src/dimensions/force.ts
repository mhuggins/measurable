import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Force. Base unit: newton. */
export const force = new Dimension("force");

export const newton = force.base("newton", ["N", "newtons"]);
export const dyne = force.unit("dyne", 0.00001, ["dyn", "dynes"]);
export const poundForce = force.unit("poundForce", 4.4482216152605, ["lbf"]);
export const kilogramForce = force.unit("kilogramForce", 9.80665, ["kgf"]);

/** Every SI-prefixed newton (kilonewton, meganewton, millinewton, …), keyed by name. */
export const metricForce = definePrefixed(force, { name: "newton", symbol: "N" });
export const { meganewton, kilonewton, millinewton, micronewton } = metricForce;
