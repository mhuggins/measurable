import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../lib/prefixes";

/** Illuminance. Base unit: lux. */
export const illuminance = new Dimension("illuminance");

export const lux = illuminance.base("lux", ["lx"]);
export const footCandle = illuminance.unit("footCandle", 10.764, ["fc", "ft-c"]);
export const phot = illuminance.unit("phot", 10000, ["ph", "phots"]);

/** Every SI-prefixed lux (kilolux, millilux, microlux, …), keyed by name. */
export const metricIlluminance = definePrefixed(illuminance, { name: "lux", symbol: "lx" });
export const { kilolux, millilux, microlux } = metricIlluminance;
