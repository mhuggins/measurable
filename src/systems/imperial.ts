import { foot, inch, mile, yard } from "../dimensions/length";
import { longTon, ounce, pound, stone } from "../dimensions/mass";
import { fahrenheit } from "../dimensions/temperature";
import {
  imperialFluidOunce,
  imperialGallon,
  imperialGill,
  imperialPint,
  imperialQuart,
} from "../dimensions/volume";
import { MeasurementSystem } from "../lib/MeasurementSystem";

/** The British imperial standard. */
export const imperial = new MeasurementSystem("imperial").add(
  // length
  inch,
  foot,
  yard,
  mile,
  // mass
  pound,
  ounce,
  stone,
  longTon,
  // volume
  imperialGallon,
  imperialQuart,
  imperialPint,
  imperialGill,
  imperialFluidOunce,
  // temperature
  fahrenheit,
);
