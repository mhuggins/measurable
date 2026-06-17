import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../lib/prefixes";

/** Length / distance. Base unit: meter. */
export const length = new Dimension("length");

export const meter = length.base("meter", ["m", "meters"]);

// Imperial / US customary.
export const inch = length.unit("inch", 0.0254, ["in", "inches"]);
export const foot = length.unit("foot", 0.3048, ["ft", "feet"]);
export const yard = length.unit("yard", 0.9144, ["yd", "yards"]);
export const mile = length.unit("mile", 1609.344, ["mi", "miles"]);

/** Every SI-prefixed meter (kilometer, centimeter, micrometer, …), keyed by name. */
export const metricLength = definePrefixed(length, { name: "meter", symbol: "m" });
export const {
  kilometer,
  hectometer,
  decameter,
  decimeter,
  centimeter,
  millimeter,
  micrometer,
  nanometer,
} = metricLength;
