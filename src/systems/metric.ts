import { centimeter, kilometer, meter, millimeter } from "../dimensions/length";
import { gram, kilogram, milligram, tonne } from "../dimensions/mass";
import { celsius, kelvin } from "../dimensions/temperature";
import { liter, milliliter } from "../dimensions/volume";
import { MeasurementSystem } from "../lib/MeasurementSystem";

/** The metric / SI standard. */
export const metric = new MeasurementSystem("metric").add(
  // length
  meter,
  kilometer,
  centimeter,
  millimeter,
  // mass
  kilogram,
  gram,
  milligram,
  tonne,
  // volume
  liter,
  milliliter,
  // temperature
  kelvin,
  celsius,
);
