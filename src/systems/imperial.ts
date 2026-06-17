import { acre, squareFoot, squareInch, squareMile, squareYard } from "../dimensions/area";
import { britishThermalUnit } from "../dimensions/energy";
import { footCandle } from "../dimensions/illuminance";
import { foot, inch, mile, yard } from "../dimensions/length";
import { candlepower } from "../dimensions/luminousIntensity";
import { longTon, ounce, pound, stone } from "../dimensions/mass";
import { horsepower } from "../dimensions/power";
import { inchOfMercury, inchOfWater, psi } from "../dimensions/pressure";
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
  // area
  squareInch,
  squareFoot,
  squareYard,
  acre,
  squareMile,
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
  // energy
  britishThermalUnit,
  // power
  horsepower,
  // pressure
  psi,
  inchOfMercury,
  inchOfWater,
  // illuminance
  footCandle,
  // luminous intensity
  candlepower,
);
