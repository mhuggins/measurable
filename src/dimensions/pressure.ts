import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Pressure. Base unit: pascal. */
export const pressure = new Dimension("pressure");

export const pascal = pressure.base("pascal", ["Pa", "pascals"]);

export const bar = pressure.unit("bar", 1e5, ["bars"]);
export const millibar = pressure.unit("millibar", 1e2, ["mbar", "millibars"]);
export const atmosphere = pressure.unit("atmosphere", 101325, ["atm", "atmospheres"]);
export const torr = pressure.unit("torr", 101325 / 760, ["Torr", "torrs"]);
export const psi = pressure.unit("psi", 6894.757293168, ["lbf/in²", "lbf/in2"]);
export const inchOfMercury = pressure.unit("inchOfMercury", 3386.389, ["inHg"]);
export const inchOfWater = pressure.unit("inchOfWater", 249.0889, ["inAq"]);

/** Every SI-prefixed pascal (kilopascal, hectopascal, megapascal, …), keyed by name. */
export const metricPressure = definePrefixed(pressure, { name: "pascal", symbol: "Pa" });
export const { kilopascal, hectopascal, megapascal, gigapascal } = metricPressure;
