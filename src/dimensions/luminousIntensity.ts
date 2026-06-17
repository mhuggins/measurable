import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../lib/prefixes";

/** Luminous intensity. Base unit: candela. */
export const luminousIntensity = new Dimension("luminousIntensity");

export const candela = luminousIntensity.base("candela", ["cd"]);
export const candlepower = luminousIntensity.unit("candlepower", 1, ["cp", "CP"]);
export const hefnerkerze = luminousIntensity.unit("hefnerkerze", 0.92, ["HK"]);

/** Every SI-prefixed candela (kilocandela, millicandela, …), keyed by name. */
export const metricLuminousIntensity = definePrefixed(luminousIntensity, {
  name: "candela",
  symbol: "cd",
});
export const { kilocandela, millicandela, microcandela } = metricLuminousIntensity;
