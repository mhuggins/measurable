import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../lib/prefixes";

/**
 * Mass / weight. Base unit: gram. (SI's official base is the kilogram, but
 * prefixes attach to the gram, so gram is the natural routing anchor — the
 * choice of base is internal and does not affect any conversion.)
 */
export const mass = new Dimension("mass");

export const gram = mass.base("gram", ["g", "grams"]);

// Customary units, expressed in grams.
export const pound = mass.unit("pound", 453.59237, ["lb", "lbs", "pounds"]);
export const ounce = mass.unit("ounce", 28.349523125, ["oz", "ounces"]);
export const stone = mass.unit("stone", 6350.29318, ["st", "stones"]);
export const tonne = mass.unit("tonne", 1_000_000, ["t", "tonnes"]);

// Short (US) and long (Imperial) tons share the "ton" alias but differ in size;
// the metric tonne above is a separate unit again. Parsing disambiguates these.
export const shortTon = mass.unit("shortTon", 907_184.74, ["ton", "tons"]);
export const longTon = mass.unit("longTon", 1_016_046.9088, ["ton", "tons"]);

/** Every SI-prefixed gram — including the kilogram — keyed by name. */
export const metricMass = definePrefixed(mass, { name: "gram", symbol: "g", scale: 1 });
export const {
  kilogram,
  megagram,
  hectogram,
  decagram,
  decigram,
  centigram,
  milligram,
  microgram,
  nanogram,
} = metricMass;
