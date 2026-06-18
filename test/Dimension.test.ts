import { describe, expect, it } from "vitest";

import { Dimension, InvalidConversionError, Quantity } from "../src";
import { angle } from "../src/dimensions/angle";
import { acre, area, hectare, squareFoot, squareMeter } from "../src/dimensions/area";
import { bit, byte, data, kibibyte, kilobyte, megabyte } from "../src/dimensions/data";
import {
  calorie,
  energy,
  joule,
  kilojoule,
  kilowattHour,
  wattHour,
} from "../src/dimensions/energy";
import { force } from "../src/dimensions/force";
import { frequency, hertz, kilohertz } from "../src/dimensions/frequency";
import { footCandle, illuminance, lux } from "../src/dimensions/illuminance";
import { foot, inch, length, meter, mile } from "../src/dimensions/length";
import { candelaPerSquareMeter, luminance, nit } from "../src/dimensions/luminance";
import { candela, kilocandela, luminousIntensity } from "../src/dimensions/luminousIntensity";
import { longTon, mass, shortTon, tonne } from "../src/dimensions/mass";
import { horsepower, kilowatt, power, watt } from "../src/dimensions/power";
import { atmosphere, bar, kilopascal, pascal, pressure, psi } from "../src/dimensions/pressure";
import { celsius, fahrenheit, kelvin, temperature } from "../src/dimensions/temperature";
import { time } from "../src/dimensions/time";
import { liter, milliliter, usGallon, volume } from "../src/dimensions/volume";

describe("Dimension", () => {
  describe("conversion is dimension-only", () => {
    it("converts across measurement systems within a dimension (tons ↔ tonnes)", () => {
      // The headline guarantee: a measurement-system tag never gates conversion.
      expect(new Quantity(1, shortTon).in(tonne)).toBe(0.90718474);
      expect(new Quantity(1, tonne).in(shortTon)).toBeCloseTo(1.10231131, 6);
      expect(new Quantity(1, longTon).in(tonne)).toBe(1.0160469088);
    });

    it("converts using the base-routed model (no backwards-factor bug)", () => {
      expect(new Quantity(1, liter).in(milliliter)).toBe(1000);
      expect(new Quantity(1000, milliliter).in(liter)).toBe(1);
    });

    it("round-trips without drift", () => {
      for (const [a, b] of [
        [meter, foot],
        [meter, mile],
        [liter, usGallon],
      ] as const) {
        // Chaining through Quantity keeps the magnitude rational the whole way,
        // so the round trip is exact even for awkward ratios like liter/usGallon.
        expect(new Quantity(7, a).to(b).to(a).magnitude).toBe(7);
      }
    });

    it("round-trips through intermediate floats without drift", () => {
      const there = liter.dimension.convert(7, liter, usGallon);
      const back = liter.dimension.convert(there, usGallon, liter);
      expect(back).toBe(7);
    });

    it("chains through the base with no direct edge between units", () => {
      expect(new Quantity(1, foot).in(inch)).toBe(12);
      expect(new Quantity(1, mile).in(inch)).toBe(63360);
    });

    it("throws when units belong to different dimensions", () => {
      expect(() => length.convert(1, meter, liter)).toThrow(InvalidConversionError);
    });
  });

  describe("affine temperature", () => {
    it("converts across offset scales", () => {
      expect(new Quantity(100, celsius).in(fahrenheit)).toBe(212);
      expect(new Quantity(32, fahrenheit).in(celsius)).toBe(0);
      expect(new Quantity(0, celsius).in(kelvin)).toBe(273.15);
    });
  });

  describe("custom dimensions", () => {
    it("lets a user define their own dimension and units", () => {
      const customData = new Dimension("customData");
      const byte = customData.base("byte", { symbol: "B", plural: "bytes" });
      const kilobyte = customData.unit("kilobyte", 1024, { symbol: "KB", plural: "kilobytes" });
      expect(new Quantity(2, kilobyte).in(byte)).toBe(2048);
      // symbol and plural are registered for parsing, just like aliases.
      expect(Quantity.parse("2 KB", customData).unit).toBe(kilobyte);
      expect(Quantity.parse("3 bytes", customData).unit).toBe(byte);
    });
  });

  describe("dimension coverage (parity with `convert`)", () => {
    // Every measure exposed by jonahsnider/convert must have a counterpart here.
    // See https://github.com/jonahsnider/convert/tree/main/src/conversions/measures
    const provided = {
      angle,
      area,
      data,
      energy,
      force,
      frequency,
      illuminance,
      length,
      luminance,
      luminousIntensity,
      mass,
      power,
      pressure,
      temperature,
      time,
      volume,
    } satisfies Record<string, Dimension>;

    it("provides every dimension that `convert` exposes", () => {
      const convertMeasures = [
        "angle",
        "area",
        "data",
        "energy",
        "force",
        "frequency",
        "illuminance",
        "length",
        "luminance",
        "luminousIntensity",
        "mass",
        "power",
        "pressure",
        "temperature",
        "time",
        "volume",
      ];
      for (const measure of convertMeasures) {
        expect(provided).toHaveProperty(measure);
      }
    });

    it("converts area units", () => {
      expect(new Quantity(1, hectare).in(squareMeter)).toBe(10000);
      expect(new Quantity(1, acre).in(squareFoot)).toBe(43560);
    });

    it("converts data units across SI and IEC multiples", () => {
      expect(new Quantity(1, byte).in(bit)).toBe(8);
      expect(new Quantity(1, kilobyte).in(byte)).toBe(1000);
      expect(new Quantity(1, kibibyte).in(byte)).toBe(1024);
      expect(new Quantity(1, megabyte).in(kilobyte)).toBe(1000);
    });

    it("converts energy units", () => {
      expect(new Quantity(1, kilojoule).in(joule)).toBe(1000);
      expect(new Quantity(1, wattHour).in(joule)).toBe(3600);
      expect(new Quantity(1, kilowattHour).in(joule)).toBe(3.6e6);
      expect(new Quantity(1, calorie).in(joule)).toBe(4.184);
    });

    it("converts frequency units", () => {
      expect(new Quantity(1, kilohertz).in(hertz)).toBe(1000);
    });

    it("converts illuminance units", () => {
      expect(new Quantity(1, footCandle).in(lux)).toBe(10.764);
    });

    it("treats the nit as candela per square meter", () => {
      expect(nit).toBe(candelaPerSquareMeter);
    });

    it("converts luminous-intensity units", () => {
      expect(new Quantity(1, kilocandela).in(candela)).toBe(1000);
    });

    it("converts power units", () => {
      expect(new Quantity(1, kilowatt).in(watt)).toBe(1000);
      expect(new Quantity(1, horsepower).in(watt)).toBe(745.699872);
    });

    it("converts pressure units", () => {
      expect(new Quantity(1, kilopascal).in(pascal)).toBe(1000);
      expect(new Quantity(1, bar).in(pascal)).toBe(1e5);
      expect(new Quantity(1, atmosphere).in(pascal)).toBe(101325);
      expect(new Quantity(1, psi).in(pascal)).toBeCloseTo(6894.757, 3);
    });
  });
});
