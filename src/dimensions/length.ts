import { Dimension } from "../lib/Dimension";
import { definePrefixed } from "../utils/definePrefixed";

/** Length / distance. Base unit: meter. */
export const length = new Dimension("length");

export const meter = length.base("meter", { symbol: "m", plural: "meters" });

// Imperial / US customary.
export const inch = length.unit("inch", 0.0254, { symbol: "in", plural: "inches" });
export const foot = length.unit("foot", 0.3048, { symbol: "ft", plural: "feet" });
export const yard = length.unit("yard", 0.9144, { symbol: "yd", plural: "yards" });
export const mile = length.unit("mile", 1609.344, { symbol: "mi", plural: "miles" });

/** Every SI-prefixed meter (kilometer, centimeter, micrometer, …), keyed by name. */
export const metricLength = definePrefixed(length, meter);
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
