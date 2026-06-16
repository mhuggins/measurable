import { Dimension } from "../lib/Dimension";

/** Time / duration. Base unit: second. */
export const time = new Dimension("time");

export const second = time.base("second", ["s", "sec", "secs", "seconds"]);
export const millisecond = time.unit("millisecond", 0.001, ["ms", "milliseconds"]);
export const minute = time.unit("minute", 60, ["min", "mins", "minutes"]);
export const hour = time.unit("hour", 3600, ["h", "hr", "hrs", "hours"]);
export const day = time.unit("day", 86400, ["d", "days"]);
export const week = time.unit("week", 604800, ["wk", "weeks"]);
