import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Power. Base unit: watt. */
export const power = new Dimension("power");

export const watt = power.base("watt", { symbol: "W", plural: "watts" });
export const horsepower = power.unit("horsepower", 745.699872, { symbol: "hp" });
export const metricHorsepower = power.unit("metricHorsepower", 735.49875, { symbol: "PS" });

/** Every SI-prefixed watt (kilowatt, megawatt, gigawatt, milliwatt, …), keyed by name. */
export const metricPower = definePrefixed(power, watt);
export const { kilowatt, megawatt, gigawatt, terawatt, milliwatt } = metricPower;
