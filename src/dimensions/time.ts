import { Dimension } from "../lib/Dimension";
import { definePrefixed, SI_SUBMULTIPLE_PREFIXES } from "../lib/prefixes";

/** Time / duration. Base unit: second. */
export const time = new Dimension("time");

export const second = time.base("second", ["s", "sec", "secs", "seconds"]);
export const minute = time.unit("minute", 60, ["min", "mins", "minutes"]);
export const hour = time.unit("hour", 3600, ["h", "hr", "hrs", "hours"]);
export const day = time.unit("day", 86400, ["d", "days"]);
export const week = time.unit("week", 604800, ["wk", "weeks"]);

/**
 * SI-submultiple seconds (millisecond, microsecond, nanosecond, …). Only
 * fractions are generated; larger spans use minute/hour/day/week above.
 */
export const metricTime = definePrefixed(
  time,
  { name: "second", symbol: "s", scale: 1 },
  SI_SUBMULTIPLE_PREFIXES,
);
export const { millisecond, microsecond, nanosecond, picosecond } = metricTime;
