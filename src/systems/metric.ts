import {
  are,
  hectare,
  squareCentimeter,
  squareKilometer,
  squareMeter,
  squareMillimeter,
} from "../dimensions/area";
import {
  calorie,
  joule,
  kilocalorie,
  metricEnergy,
  metricWattHour,
  wattHour,
} from "../dimensions/energy";
import { hertz, metricFrequency } from "../dimensions/frequency";
import { lux, metricIlluminance, phot } from "../dimensions/illuminance";
import { meter, metricLength } from "../dimensions/length";
import { candelaPerSquareMeter, stilb } from "../dimensions/luminance";
import { candela, metricLuminousIntensity } from "../dimensions/luminousIntensity";
import { gram, metricMass, tonne } from "../dimensions/mass";
import { metricHorsepower, metricPower, watt } from "../dimensions/power";
import { bar, metricPressure, millibar, pascal } from "../dimensions/pressure";
import { celsius, kelvin } from "../dimensions/temperature";
import { liter, metricVolume } from "../dimensions/volume";
import { MeasurementSystem } from "../lib/MeasurementSystem";

/** The metric / SI standard, including the full SI-prefixed unit ladders. */
export const metric = new MeasurementSystem("metric").add(
  // length
  meter,
  ...Object.values(metricLength),
  // area
  squareMeter,
  squareKilometer,
  hectare,
  are,
  squareCentimeter,
  squareMillimeter,
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
  // energy
  joule,
  ...Object.values(metricEnergy),
  wattHour,
  ...Object.values(metricWattHour),
  calorie,
  kilocalorie,
  // power
  watt,
  ...Object.values(metricPower),
  metricHorsepower,
  // pressure
  pascal,
  ...Object.values(metricPressure),
  bar,
  millibar,
  // frequency
  hertz,
  ...Object.values(metricFrequency),
  // illuminance
  lux,
  ...Object.values(metricIlluminance),
  phot,
  // luminance
  candelaPerSquareMeter,
  stilb,
  // luminous intensity
  candela,
  ...Object.values(metricLuminousIntensity),
);
