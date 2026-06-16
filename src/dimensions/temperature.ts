import { Dimension } from "../lib/Dimension";

/**
 * Temperature. Base unit: kelvin. Uses affine units because Celsius and
 * Fahrenheit are offset from the base, not just scaled.
 */
export const temperature = new Dimension("temperature");

export const kelvin = temperature.base("kelvin", ["K"]);
export const celsius = temperature.affine("celsius", { scale: 1, offset: 273.15 }, ["C", "°C"]);
export const fahrenheit = temperature.affine(
  "fahrenheit",
  { scale: 5 / 9, offset: 273.15 - 32 * (5 / 9) },
  ["F", "°F"],
);
