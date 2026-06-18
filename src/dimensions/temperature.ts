import { Dimension } from "../lib/Dimension";
import { Rational } from "../lib/Rational";

/**
 * Temperature. Base unit: kelvin. Uses affine units because Celsius and
 * Fahrenheit are offset from the base, not just scaled.
 */
export const temperature = new Dimension("temperature");

// Fahrenheit's 5/9 ratio is not a terminating decimal, so it is given as an
// exact Rational; the offset (273.15 − 32 × 5/9 K) is then derived in exact
// rational arithmetic so conversions round-trip without drift.
const fahrenheitScale = new Rational(5, 9);
const fahrenheitOffset = Rational.from(273.15).minus(new Rational(32).times(fahrenheitScale));

export const kelvin = temperature.base("kelvin", { symbol: "K" });
export const celsius = temperature.affine(
  "celsius",
  { scale: 1, offset: 273.15 },
  { symbol: "°C", aliases: ["C"] },
);
export const fahrenheit = temperature.affine(
  "fahrenheit",
  { scale: fahrenheitScale, offset: fahrenheitOffset },
  { symbol: "°F", aliases: ["F"] },
);
