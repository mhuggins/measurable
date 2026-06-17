import { meter, metricLength } from "../dimensions/length";
import { gram, metricMass, tonne } from "../dimensions/mass";
import { celsius, kelvin } from "../dimensions/temperature";
import { liter, metricVolume } from "../dimensions/volume";
import { MeasurementSystem } from "../lib/MeasurementSystem";

/** The metric / SI standard, including the full SI-prefixed unit ladders. */
export const metric = new MeasurementSystem("metric").add(
  // length
  meter,
  ...Object.values(metricLength),
  // mass
  gram,
  tonne,
  ...Object.values(metricMass),
  // volume
  liter,
  ...Object.values(metricVolume),
  // temperature
  kelvin,
  celsius,
);
