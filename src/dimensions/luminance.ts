import { Dimension } from "../lib/Dimension";

/** Luminance. Base unit: candela per square meter (the nit). */
export const luminance = new Dimension("luminance");

export const candelaPerSquareMeter = luminance.base("candelaPerSquareMeter", {
  symbol: "cd/m²",
  aliases: ["cd/m2", "nit", "nits", "nt"],
});
export const stilb = luminance.unit("stilb", 1e4, { symbol: "sb" });

/** Alias for {@link candelaPerSquareMeter}. */
export const nit = candelaPerSquareMeter;
