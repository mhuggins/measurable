import { describe, expect, it } from "vitest";

import {
  AmbiguousUnitError,
  Dimension,
  InvalidConversionError,
  Quantity,
  UnknownUnitError,
} from "../src";
import { foot, inch, length, meter, mile } from "../src/dimensions/length";
import { kilogram, longTon, mass, shortTon, tonne } from "../src/dimensions/mass";
import { celsius, fahrenheit, kelvin } from "../src/dimensions/temperature";
import { hour, minute, second, time } from "../src/dimensions/time";
import {
  imperialFluidOunce,
  imperialGallon,
  imperialGill,
  imperialPint,
  imperialQuart,
  liter,
  milliliter,
  usFluidOunce,
  usGallon,
  usGill,
  usPint,
  usQuart,
  volume,
} from "../src/dimensions/volume";

/** Every volume token shared between US and Imperial: [token, us, imperial]. */
const SHARED_VOLUME_ALIASES = [
  ["gallon", usGallon, imperialGallon],
  ["quart", usQuart, imperialQuart],
  ["pint", usPint, imperialPint],
  ["gill", usGill, imperialGill],
  ["floz", usFluidOunce, imperialFluidOunce],
] as const;

import { imperial, metric, usCustomary } from "../src/systems";

describe("conversion is dimension-only", () => {
  it("converts across measurement systems within a dimension (tons ↔ tonnes)", () => {
    // The headline guarantee: a measurement-system tag never gates conversion.
    expect(new Quantity(1, shortTon).in(tonne)).toBeCloseTo(0.90718474, 8);
    expect(new Quantity(1, tonne).in(shortTon)).toBeCloseTo(1.10231131, 6);
    expect(new Quantity(1, longTon).in(tonne)).toBeCloseTo(1.0160469088, 8);
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
      const there = a.dimension.convert(7, a, b);
      const back = a.dimension.convert(there, b, a);
      expect(back).toBeCloseTo(7, 10);
    }
  });

  it("chains through the base with no direct edge between units", () => {
    expect(new Quantity(1, mile).in(inch)).toBeCloseTo(63360, 6);
  });

  it("throws when units belong to different dimensions", () => {
    expect(() => length.convert(1, meter, liter)).toThrow(InvalidConversionError);
  });
});

describe("affine temperature", () => {
  it("converts across offset scales", () => {
    expect(new Quantity(100, celsius).in(fahrenheit)).toBeCloseTo(212, 10);
    expect(new Quantity(32, fahrenheit).in(celsius)).toBeCloseTo(0, 10);
    expect(new Quantity(0, celsius).in(kelvin)).toBeCloseTo(273.15, 10);
  });
});

describe("MeasurementSystem", () => {
  it("lets a unit belong to several systems (foot is imperial AND US customary)", () => {
    expect(imperial.has(foot)).toBe(true);
    expect(usCustomary.has(foot)).toBe(true);
    expect(metric.has(foot)).toBe(false);
  });

  it("lists units of a given dimension within the system", () => {
    const metricLengths = metric.in(length);
    expect(metricLengths).toContain(meter);
    expect(metricLengths).not.toContain(foot);
    expect(metricLengths.every((u) => u.dimension === length)).toBe(true);
  });

  it("does not exist in conversion: membership is optional", () => {
    // kilogram has no system tag conflict; tonne (metric) ↔ kilogram still works.
    expect(new Quantity(2, tonne).in(kilogram)).toBe(2000);
  });
});

describe("express (best-fit formatting)", () => {
  it("picks the largest unit with magnitude >= 1 for the chosen system", () => {
    const distance = new Quantity(5000, meter);
    expect(imperial.express(distance).unit).toBe(mile);
    const metricBest = metric.express(distance);
    expect(metricBest.unit.name).toBe("kilometer");
    expect(metricBest.magnitude).toBeCloseTo(5, 10);
  });
});

describe("Quantity.parse", () => {
  it("parses unambiguous single and compound tokens", () => {
    expect(Quantity.parse("5 hr", time).unit).toBe(hour);
    const compound = Quantity.parse("5hr 20min", time);
    expect(compound.unit).toBe(minute);
    expect(compound.magnitude).toBe(320);
    expect(compound.in(second)).toBe(19200);
  });

  it("throws on an unknown unit token", () => {
    expect(() => Quantity.parse("5 furlongs", time)).toThrow(UnknownUnitError);
  });

  it("throws on a shared alias with no preferred system", () => {
    expect(() => Quantity.parse("1 ton", mass)).toThrow(AmbiguousUnitError);
    for (const [token] of SHARED_VOLUME_ALIASES) {
      expect(() => Quantity.parse(`1 ${token}`, volume)).toThrow(AmbiguousUnitError);
    }
  });

  it("resolves shared mass aliases via the preferred measurement system", () => {
    expect(Quantity.parse("1 ton", mass, { prefer: usCustomary }).unit).toBe(shortTon);
    expect(Quantity.parse("1 ton", mass, { prefer: imperial }).unit).toBe(longTon);
  });

  it.each(
    SHARED_VOLUME_ALIASES,
  )('resolves "%s" to the right unit per preferred system', (token, us, imp) => {
    expect(Quantity.parse(`1 ${token}`, volume, { prefer: usCustomary }).unit).toBe(us);
    expect(Quantity.parse(`1 ${token}`, volume, { prefer: imperial }).unit).toBe(imp);
    expect(new Quantity(1, imp).in(us)).not.toBeCloseTo(1, 3);
  });

  it("still resolves an alias unique to one system without a hint", () => {
    // "tbsp" exists only in US customary, so no preference is needed.
    expect(Quantity.parse("3 tbsp", volume).unit.name).toBe("tablespoon");
  });
});

describe("custom dimensions", () => {
  it("lets a user define their own dimension and units", () => {
    const data = new Dimension("data");
    const byte = data.base("byte", ["B", "bytes"]);
    const kilobyte = data.unit("kilobyte", 1024, ["KB"]);
    expect(new Quantity(2, kilobyte).in(byte)).toBe(2048);
  });
});
