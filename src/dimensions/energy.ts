import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Energy. Base unit: joule. */
export const energy = new Dimension("energy");

export const joule = energy.base("joule", { symbol: "J", plural: "joules" });

export const calorie = energy.unit("calorie", 4.184, { symbol: "cal", plural: "calories" });
export const kilocalorie = energy.unit("kilocalorie", 4184, {
  symbol: "kcal",
  plural: "kilocalories",
  aliases: ["Cal"],
});
export const britishThermalUnit = energy.unit("britishThermalUnit", 1055.05585262, {
  symbol: "BTU",
  aliases: ["Btu"],
});

export const wattHour = energy.unit("wattHour", 3600, {
  symbol: "Wh",
  plural: "watt-hours",
  aliases: ["watt-hour"],
});

/** Every SI-prefixed joule (kilojoule, megajoule, millijoule, …), keyed by name. */
export const metricEnergy = definePrefixed(energy, joule);
export const { kilojoule, megajoule, gigajoule, millijoule } = metricEnergy;

/** Every SI-prefixed watt-hour (kilowatt-hour, megawatt-hour, …), keyed by name. */
export const metricWattHour = definePrefixed(energy, wattHour);
export const { kilowattHour, megawattHour, gigawattHour } = metricWattHour;
