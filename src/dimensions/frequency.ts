import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Frequency. Base unit: hertz. */
export const frequency = new Dimension("frequency");

export const hertz = frequency.base("hertz", { symbol: "Hz" });

/** Every SI-prefixed hertz (kilohertz, megahertz, gigahertz, …), keyed by name. */
export const metricFrequency = definePrefixed(frequency, hertz);
export const { kilohertz, megahertz, gigahertz, terahertz, petahertz, millihertz } =
  metricFrequency;
