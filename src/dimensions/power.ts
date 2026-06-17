import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../lib/prefixes";

/** Power. Base unit: watt. */
export const power = new Dimension("power");

export const watt = power.base("watt", ["W", "watts"]);
export const horsepower = power.unit("horsepower", 745.699872, ["hp"]);
export const metricHorsepower = power.unit("metricHorsepower", 735.49875, ["PS"]);

/** Every SI-prefixed watt (kilowatt, megawatt, gigawatt, milliwatt, …), keyed by name. */
export const metricPower = definePrefixed(power, { name: "watt", symbol: "W" });
export const { kilowatt, megawatt, gigawatt, terawatt, milliwatt } = metricPower;
