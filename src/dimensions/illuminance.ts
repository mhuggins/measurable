import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Illuminance. Base unit: lux. */
export const illuminance = new Dimension("illuminance");

export const lux = illuminance.base("lux", { symbol: "lx" });
export const footCandle = illuminance.unit("footCandle", 10.764, {
  symbol: "fc",
  aliases: ["ft-c"],
});
export const phot = illuminance.unit("phot", 10000, { symbol: "ph", plural: "phots" });

/** Every SI-prefixed lux (kilolux, millilux, microlux, …), keyed by name. */
export const metricIlluminance = definePrefixed(illuminance, lux);
export const { kilolux, millilux, microlux } = metricIlluminance;
