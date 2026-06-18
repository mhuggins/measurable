import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Energy. Base unit: joule. */
export const energy = new Dimension("energy");

export const joule = energy.base("joule", ["J", "joules"]);

export const calorie = energy.unit("calorie", 4.184, ["cal", "calories"]);
export const kilocalorie = energy.unit("kilocalorie", 4184, ["kcal", "Cal", "kilocalories"]);
export const britishThermalUnit = energy.unit("britishThermalUnit", 1055.05585262, ["BTU", "Btu"]);

export const wattHour = energy.unit("wattHour", 3600, ["Wh", "watt-hour", "watt-hours"]);

/** Every SI-prefixed joule (kilojoule, megajoule, millijoule, …), keyed by name. */
export const metricEnergy = definePrefixed(energy, { name: "joule", symbol: "J" });
export const { kilojoule, megajoule, gigajoule, millijoule } = metricEnergy;

/** Every SI-prefixed watt-hour (kilowatt-hour, megawatt-hour, …), keyed by name. */
export const metricWattHour = definePrefixed(energy, {
  name: "wattHour",
  symbol: "Wh",
  scale: 3600,
});
export const { kilowattHour, megawattHour, gigawattHour } = metricWattHour;
