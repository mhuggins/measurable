import { acre, squareFoot, squareInch, squareMile, squareYard } from "../dimensions/area";
import { britishThermalUnit } from "../dimensions/energy";
import { footCandle } from "../dimensions/illuminance";
import { foot, inch, mile, yard } from "../dimensions/length";
import { candlepower } from "../dimensions/luminousIntensity";
import { ounce, pound, shortTon } from "../dimensions/mass";
import { horsepower } from "../dimensions/power";
import { inchOfMercury, inchOfWater, psi } from "../dimensions/pressure";
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
  // area
  squareInch,
  squareFoot,
  squareYard,
  acre,
  squareMile,
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
