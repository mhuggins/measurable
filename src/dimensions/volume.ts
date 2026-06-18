import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Volume / capacity. Base unit: liter. */
export const volume = new Dimension("volume");

export const liter = volume.base("liter", { symbol: "L", plural: "liters" });

// US and Imperial liquid measures share names ("gallon", "pint", …) but differ
// in size, so each is a distinct unit carrying the shared aliases; parsing
// disambiguates via a preferred measurement system. Imperial has 160 fluid
// ounces per gallon, US customary has 128.
export const usGallon = volume.unit("usGallon", 3.785411784, {
  symbol: "gal",
  plural: "gallons",
  aliases: ["gallon"],
});
export const usQuart = volume.unit("usQuart", 0.946352946, {
  symbol: "qt",
  plural: "quarts",
  aliases: ["quart"],
});
export const usPint = volume.unit("usPint", 0.473176473, {
  symbol: "pt",
  plural: "pints",
  aliases: ["pint"],
});
export const usGill = volume.unit("usGill", 0.11829411825, { plural: "gills", aliases: ["gill"] });
export const usFluidOunce = volume.unit("usFluidOunce", 0.0295735295625, {
  symbol: "floz",
  plural: "fluidOunces",
  aliases: ["fluidOunce"],
});

export const imperialGallon = volume.unit("imperialGallon", 4.54609, {
  symbol: "gal",
  plural: "gallons",
  aliases: ["gallon"],
});
export const imperialQuart = volume.unit("imperialQuart", 1.1365225, {
  symbol: "qt",
  plural: "quarts",
  aliases: ["quart"],
});
export const imperialPint = volume.unit("imperialPint", 0.56826125, {
  symbol: "pt",
  plural: "pints",
  aliases: ["pint"],
});
export const imperialGill = volume.unit("imperialGill", 0.1420653125, {
  plural: "gills",
  aliases: ["gill"],
});
export const imperialFluidOunce = volume.unit("imperialFluidOunce", 0.0284130625, {
  symbol: "floz",
  plural: "fluidOunces",
  aliases: ["fluidOunce"],
});

// US-only cooking measures (no competing imperial unit, so left unprefixed).
export const cup = volume.unit("cup", 0.2365882365, { plural: "cups" });
export const tablespoon = volume.unit("tablespoon", 0.01478676478125, {
  symbol: "tbsp",
  plural: "tablespoons",
});
export const teaspoon = volume.unit("teaspoon", 0.00492892159375, {
  symbol: "tsp",
  plural: "teaspoons",
});

/** Every SI-prefixed liter (milliliter, centiliter, kiloliter, …), keyed by name. */
export const metricVolume = definePrefixed(volume, liter);
export const { kiloliter, hectoliter, decaliter, deciliter, centiliter, milliliter } = metricVolume;
