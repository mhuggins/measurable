import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../lib/prefixes";

/** Volume / capacity. Base unit: liter. */
export const volume = new Dimension("volume");

export const liter = volume.base("liter", ["L", "liters"]);

// US and Imperial liquid measures share names ("gallon", "pint", …) but differ
// in size, so each is a distinct unit carrying the shared aliases; parsing
// disambiguates via a preferred measurement system. Imperial has 160 fluid
// ounces per gallon, US customary has 128.
export const usGallon = volume.unit("usGallon", 3.785411784, ["gal", "gallon", "gallons"]);
export const usQuart = volume.unit("usQuart", 0.946352946, ["qt", "quart", "quarts"]);
export const usPint = volume.unit("usPint", 0.473176473, ["pt", "pint", "pints"]);
export const usGill = volume.unit("usGill", 0.11829411825, ["gill", "gills"]);
export const usFluidOunce = volume.unit("usFluidOunce", 0.0295735295625, [
  "floz",
  "fluidOunce",
  "fluidOunces",
]);

export const imperialGallon = volume.unit("imperialGallon", 4.54609, ["gal", "gallon", "gallons"]);
export const imperialQuart = volume.unit("imperialQuart", 1.1365225, ["qt", "quart", "quarts"]);
export const imperialPint = volume.unit("imperialPint", 0.56826125, ["pt", "pint", "pints"]);
export const imperialGill = volume.unit("imperialGill", 0.1420653125, ["gill", "gills"]);
export const imperialFluidOunce = volume.unit("imperialFluidOunce", 0.0284130625, [
  "floz",
  "fluidOunce",
  "fluidOunces",
]);

// US-only cooking measures (no competing imperial unit, so left unprefixed).
export const cup = volume.unit("cup", 0.2365882365, ["cups"]);
export const tablespoon = volume.unit("tablespoon", 0.01478676478125, ["tbsp", "tablespoons"]);
export const teaspoon = volume.unit("teaspoon", 0.00492892159375, ["tsp", "teaspoons"]);

/** Every SI-prefixed liter (milliliter, centiliter, kiloliter, …), keyed by name. */
export const metricVolume = definePrefixed(volume, { name: "liter", symbol: "L", scale: 1 });
export const { kiloliter, hectoliter, decaliter, deciliter, centiliter, milliliter } = metricVolume;
