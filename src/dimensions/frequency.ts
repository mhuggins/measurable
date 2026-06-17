import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../lib/prefixes";

/** Frequency. Base unit: hertz. */
export const frequency = new Dimension("frequency");

export const hertz = frequency.base("hertz", ["Hz"]);

/** Every SI-prefixed hertz (kilohertz, megahertz, gigahertz, …), keyed by name. */
export const metricFrequency = definePrefixed(frequency, { name: "hertz", symbol: "Hz" });
export const { kilohertz, megahertz, gigahertz, terahertz, petahertz, millihertz } =
  metricFrequency;
