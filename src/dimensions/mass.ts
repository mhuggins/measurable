import { Dimension } from "../lib/Dimension";

/** Mass / weight. Base unit: kilogram. */
export const mass = new Dimension("mass");

export const kilogram = mass.base("kilogram", ["kg", "kilograms"]);
export const gram = mass.unit("gram", 0.001, ["g", "grams"]);
export const milligram = mass.unit("milligram", 0.000001, ["mg", "milligrams"]);
export const tonne = mass.unit("tonne", 1000, ["t", "tonnes"]);
export const pound = mass.unit("pound", 0.45359237, ["lb", "lbs", "pounds"]);
export const ounce = mass.unit("ounce", 0.028349523125, ["oz", "ounces"]);
export const stone = mass.unit("stone", 6.35029318, ["st", "stones"]);

// Short (US) and long (Imperial) tons share the "ton" alias but differ in size;
// the metric tonne above is a separate unit again. Parsing disambiguates these.
export const shortTon = mass.unit("shortTon", 907.18474, ["ton", "tons"]);
export const longTon = mass.unit("longTon", 1016.0469088, ["ton", "tons"]);
