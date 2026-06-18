import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Pressure. Base unit: pascal. */
export const pressure = new Dimension("pressure");

export const pascal = pressure.base("pascal", { symbol: "Pa", plural: "pascals" });

export const bar = pressure.unit("bar", 1e5, { symbol: "bar", plural: "bars" });
export const millibar = pressure.unit("millibar", 1e2, { symbol: "mbar", plural: "millibars" });
export const atmosphere = pressure.unit("atmosphere", 101325, {
  symbol: "atm",
  plural: "atmospheres",
});
export const torr = pressure.unit("torr", 101325 / 760, { symbol: "Torr", plural: "torrs" });
export const psi = pressure.unit("psi", 6894.757293168, { aliases: ["lbf/in²", "lbf/in2"] });
export const inchOfMercury = pressure.unit("inchOfMercury", 3386.389, { symbol: "inHg" });
export const inchOfWater = pressure.unit("inchOfWater", 249.0889, { symbol: "inAq" });

/** Every SI-prefixed pascal (kilopascal, hectopascal, megapascal, …), keyed by name. */
export const metricPressure = definePrefixed(pressure, pascal);
export const { kilopascal, hectopascal, megapascal, gigapascal } = metricPressure;
