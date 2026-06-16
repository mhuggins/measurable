import { foot, inch, mile, yard } from "../dimensions/length";
import { ounce, pound, shortTon } from "../dimensions/mass";
import { fahrenheit } from "../dimensions/temperature";
import {
  cup,
  tablespoon,
  teaspoon,
  usFluidOunce,
  usGallon,
  usGill,
  usPint,
  usQuart,
} from "../dimensions/volume";
import { MeasurementSystem } from "../lib/MeasurementSystem";

/** The US customary standard. Shares foot/pound/ounce with imperial. */
export const usCustomary = new MeasurementSystem("usCustomary").add(
  // length
  inch,
  foot,
  yard,
  mile,
  // mass
  pound,
  ounce,
  shortTon,
  // volume
  usGallon,
  usQuart,
  usPint,
  usGill,
  usFluidOunce,
  cup,
  tablespoon,
  teaspoon,
  // temperature
  fahrenheit,
);
