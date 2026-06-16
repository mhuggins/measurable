import { Dimension } from "../lib/Dimension";

/** Length / distance. Base unit: meter. */
export const length = new Dimension("length");

export const meter = length.base("meter", ["m", "meters"]);
export const kilometer = length.unit("kilometer", 1000, ["km", "kilometers"]);
export const centimeter = length.unit("centimeter", 0.01, ["cm", "centimeters"]);
export const millimeter = length.unit("millimeter", 0.001, ["mm", "millimeters"]);
export const inch = length.unit("inch", 0.0254, ["in", "inches"]);
export const foot = length.unit("foot", 0.3048, ["ft", "feet"]);
export const yard = length.unit("yard", 0.9144, ["yd", "yards"]);
export const mile = length.unit("mile", 1609.344, ["mi", "miles"]);
