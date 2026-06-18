import { Dimension } from "../lib/Dimension";
import { definePrefixed, SI_SUBMULTIPLE_PREFIXES } from "../utils/definePrefixed";

/** Time / duration. Base unit: second. */
export const time = new Dimension("time");

export const second = time.base("second", {
  symbol: "s",
  plural: "seconds",
  aliases: ["sec", "secs"],
});
export const minute = time.unit("minute", 60, {
  symbol: "min",
  plural: "minutes",
  aliases: ["mins"],
});
export const hour = time.unit("hour", 3600, {
  symbol: "h",
  plural: "hours",
  aliases: ["hr", "hrs"],
});
export const day = time.unit("day", 86400, { symbol: "d", plural: "days" });
export const week = time.unit("week", 604800, { symbol: "wk", plural: "weeks" });

/**
 * SI-submultiple seconds (millisecond, microsecond, nanosecond, …). Only
 * fractions are generated; larger spans use minute/hour/day/week above.
 */
export const metricTime = definePrefixed(time, second, SI_SUBMULTIPLE_PREFIXES);
export const { millisecond, microsecond, nanosecond, picosecond } = metricTime;
