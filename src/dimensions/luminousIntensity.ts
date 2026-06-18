import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Luminous intensity. Base unit: candela. */
export const luminousIntensity = new Dimension("luminousIntensity");

export const candela = luminousIntensity.base("candela", { symbol: "cd", plural: "candelas" });
export const candlepower = luminousIntensity.unit("candlepower", 1, {
  symbol: "cp",
  aliases: ["CP"],
});
export const hefnerkerze = luminousIntensity.unit("hefnerkerze", 0.92, { symbol: "HK" });

/** Every SI-prefixed candela (kilocandela, millicandela, …), keyed by name. */
export const metricLuminousIntensity = definePrefixed(luminousIntensity, candela);
export const { kilocandela, millicandela, microcandela } = metricLuminousIntensity;
