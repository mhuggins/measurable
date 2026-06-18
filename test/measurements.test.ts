import { describe, expect, it } from "vitest";

import {
  AmbiguousUnitError,
  Dimension,
  InvalidConversionError,
  Quantity,
  UnknownUnitError,
} from "../src";
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
import {
  decameter,
  decimeter,
  foot,
  hectometer,
  inch,
  kilometer,
  length,
  meter,
  micrometer,
  mile,
} from "../src/dimensions/length";
import { candelaPerSquareMeter, luminance, nit } from "../src/dimensions/luminance";
import { candela, kilocandela, luminousIntensity } from "../src/dimensions/luminousIntensity";
import {
  gram,
  kilogram,
  longTon,
  mass,
  megagram,
  milligram,
  shortTon,
  tonne,
} from "../src/dimensions/mass";
import { horsepower, kilowatt, power, watt } from "../src/dimensions/power";
import { atmosphere, bar, kilopascal, pascal, pressure, psi } from "../src/dimensions/pressure";
import { celsius, fahrenheit, kelvin, temperature } from "../src/dimensions/temperature";
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

  it("drifts when round-tripping through intermediate floats", () => {
    // Collapsing to a number between conversions reintroduces binary rounding.
    const there = liter.dimension.convert(7, liter, usGallon);
    const back = liter.dimension.convert(there, usGallon, liter);
    expect(back).toBeCloseTo(7, 10);
    expect(back).not.toBe(7);
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
    expect(metricBest.magnitude).toBe(5);
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
    const customData = new Dimension("customData");
    const byte = customData.base("byte", ["B", "bytes"]);
    const kilobyte = customData.unit("kilobyte", 1024, ["KB"]);
    expect(new Quantity(2, kilobyte).in(byte)).toBe(2048);
  });
});

describe("Quantity arithmetic", () => {
  it("adds quantities of different units, result in the receiver's unit", () => {
    const sum = new Quantity(1, mile).plus(new Quantity(1, kilometer));
    expect(sum.unit).toBe(mile);
    expect(sum.magnitude).toBeCloseTo(1 + 1 / 1.609344, 10); // ≈ 1.621371 mi
  });

  it("subtracts quantities of different units", () => {
    const diff = new Quantity(1, mile).minus(new Quantity(1, kilometer));
    expect(diff.unit).toBe(mile);
    expect(diff.magnitude).toBeCloseTo(1 - 1 / 1.609344, 10); // ≈ 0.378629 mi
  });

  it("scales by a dimensionless factor", () => {
    expect(new Quantity(2, meter).times(3).magnitude).toBe(6);
    expect(new Quantity(6, meter).dividedBy(3).magnitude).toBe(2);
    expect(new Quantity(5, meter).negate().magnitude).toBe(-5);
  });

  it("takes the absolute value", () => {
    expect(new Quantity(-5, meter).abs().magnitude).toBe(5);
    expect(new Quantity(5, meter).abs().magnitude).toBe(5);
  });

  it("ratioTo gives the dimensionless ratio between two quantities", () => {
    // How many 250 mL servings fit in a 2 L bottle?
    expect(new Quantity(2, liter).ratioTo(new Quantity(250, milliliter))).toBe(8);
    // Same dimension, different units (here the divisor's magnitude is 1).
    expect(new Quantity(1, mile).ratioTo(new Quantity(1, kilometer))).toBe(1.609344);
    // Same unit, divisor magnitude ≠ 1.
    expect(new Quantity(10, meter).ratioTo(new Quantity(2, meter))).toBe(5);
    expect(() => new Quantity(1, meter).ratioTo(new Quantity(1, liter))).toThrow(
      InvalidConversionError,
    );
  });

  it("clamps to a range, returned in this quantity's unit", () => {
    const lower = new Quantity(1, meter);
    const upper = new Quantity(1, kilometer);
    expect(new Quantity(500, meter).clamp(lower, upper).magnitude).toBe(500);
    const belowed = new Quantity(0, meter).clamp(lower, upper);
    expect(belowed.unit).toBe(meter);
    expect(belowed.magnitude).toBe(1);
    const aboved = new Quantity(5, kilometer).clamp(lower, upper);
    expect(aboved.unit).toBe(kilometer);
    expect(aboved.magnitude).toBe(1);
  });

  it("is immutable — operands are not modified", () => {
    const a = new Quantity(1, mile);
    const b = new Quantity(1, kilometer);
    a.plus(b);
    expect(a.magnitude).toBe(1);
    expect(b.magnitude).toBe(1);
  });

  it("throws when combining different dimensions", () => {
    expect(() => new Quantity(1, mile).plus(new Quantity(1, liter))).toThrow(
      InvalidConversionError,
    );
  });

  it("exposes short aliases add/sub/mul/div", () => {
    const a = new Quantity(10, meter);
    const b = new Quantity(5, meter);
    expect(a.add(b).magnitude).toBe(a.plus(b).magnitude);
    expect(a.sub(b).magnitude).toBe(a.minus(b).magnitude);
    expect(a.mul(3).magnitude).toBe(a.times(3).magnitude);
    expect(a.div(2).magnitude).toBe(a.dividedBy(2).magnitude);
  });
});

describe("Quantity comparison", () => {
  it("compares across units of the same dimension", () => {
    expect(new Quantity(1, kilometer).equals(new Quantity(1000, meter))).toBe(true);
    expect(new Quantity(1, meter).notEquals(new Quantity(2, meter))).toBe(true);
    expect(new Quantity(1, meter).lessThan(new Quantity(1, kilometer))).toBe(true);
    expect(new Quantity(1, kilometer).greaterThan(new Quantity(1, meter))).toBe(true);
    expect(new Quantity(1, kilometer).lessThan(new Quantity(1, meter))).toBe(false);
  });

  it("exposes short aliases eq/ne/lt/gt", () => {
    const a = new Quantity(1, kilometer);
    const b = new Quantity(1000, meter);
    const c = new Quantity(1, meter);
    expect(a.eq(b)).toBe(a.equals(b));
    expect(a.ne(c)).toBe(a.notEquals(c));
    expect(c.lt(a)).toBe(c.lessThan(a));
    expect(a.gt(c)).toBe(a.greaterThan(c));
  });

  it("supports inclusive comparisons lte/gte", () => {
    const a = new Quantity(1, kilometer);
    const equal = new Quantity(1000, meter);
    const smaller = new Quantity(1, meter);
    expect(a.lessThanOrEqual(equal)).toBe(true);
    expect(a.greaterThanOrEqual(equal)).toBe(true);
    expect(smaller.lte(a)).toBe(true);
    expect(smaller.gte(a)).toBe(false);
  });

  it("compareTo returns -1/0/1 and works as a sort comparator", () => {
    const m1 = new Quantity(1, meter);
    const km1 = new Quantity(1, kilometer);
    expect(m1.compareTo(km1)).toBe(-1);
    expect(km1.compareTo(m1)).toBe(1);
    expect(km1.compareTo(new Quantity(1000, meter))).toBe(0);
    const sorted = [km1, m1, new Quantity(500, meter)].sort((a, b) => a.compareTo(b));
    expect(sorted.map((q) => q.in(meter))).toEqual([1, 500, 1000]);
  });

  it("throws when comparing different dimensions", () => {
    expect(() => new Quantity(1, meter).equals(new Quantity(1, liter))).toThrow(
      InvalidConversionError,
    );
  });
});

describe("Quantity statics", () => {
  it("min/max pick the extreme quantity", () => {
    const a = new Quantity(1, kilometer);
    const b = new Quantity(500, meter);
    const c = new Quantity(2, kilometer);
    expect(Quantity.min(a, b, c)).toBe(b);
    expect(Quantity.max(a, b, c)).toBe(c);
  });

  it("sum totals in the first quantity's unit", () => {
    const total = Quantity.sum(new Quantity(1, kilometer), new Quantity(500, meter));
    expect(total.unit).toBe(kilometer);
    expect(total.magnitude).toBe(1.5);
  });

  it("throws when mixing dimensions", () => {
    expect(() => Quantity.min(new Quantity(1, meter), new Quantity(1, liter))).toThrow(
      InvalidConversionError,
    );
  });
});

describe("Quantity predicates and rounding", () => {
  it("reports the magnitude sign", () => {
    expect(new Quantity(0, meter).isZero()).toBe(true);
    expect(new Quantity(5, meter).isPositive()).toBe(true);
    expect(new Quantity(-5, meter).isNegative()).toBe(true);
    expect(new Quantity(5, meter).isZero()).toBe(false);
    expect(new Quantity(0, meter).isPositive()).toBe(false);
  });

  it("rounds the magnitude to the given decimals, keeping the unit", () => {
    expect(new Quantity(1.6213, mile).round(2).magnitude).toBe(1.62);
    expect(new Quantity(1.6213, mile).round().magnitude).toBe(2);
    expect(new Quantity(2.5, meter).round().magnitude).toBe(3);
    expect(new Quantity(1.2345, meter).round(2).unit).toBe(meter);
  });
});

describe("metric prefixes", () => {
  it("fills in the SI ladder for length", () => {
    expect(new Quantity(1, kilometer).in(meter)).toBe(1000);
    expect(new Quantity(1, hectometer).in(meter)).toBe(100);
    expect(new Quantity(1, decameter).in(meter)).toBe(10);
    expect(new Quantity(1, decimeter).in(meter)).toBe(0.1);
    expect(new Quantity(1, micrometer).in(meter)).toBe(1e-6);
  });

  it("prefixes the gram (not the kilogram base) for mass", () => {
    expect(new Quantity(1, megagram).in(kilogram)).toBe(1000);
    expect(new Quantity(1000, milligram).in(gram)).toBe(1);
  });

  it("parses prefixed symbols, including the micro sign", () => {
    expect(Quantity.parse("3 km", length).unit.name).toBe("kilometer");
    expect(Quantity.parse("250 mL", volume).unit.name).toBe("milliliter");
    expect(Quantity.parse("5 µm", length).unit.name).toBe("micrometer");
  });

  it("tags the prefixed metric units into the metric system", () => {
    expect(metric.has(decameter)).toBe(true);
    expect(metric.has(megagram)).toBe(true);
  });
});

describe("Quantity formatting", () => {
  it("toString renders the magnitude and unit name", () => {
    expect(new Quantity(5, kilometer).toString()).toBe("5 kilometer");
    expect(String(new Quantity(2.5, meter))).toBe("2.5 meter");
    expect(`${new Quantity(3, meter)}`).toBe("3 meter");
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

describe("measurement-system membership for the added dimensions", () => {
  it("tags the SI units into metric", () => {
    for (const unit of [squareMeter, joule, watt, pascal, hertz, lux, candela]) {
      expect(metric.has(unit)).toBe(true);
    }
    // The full SI ladders are tagged, not just the base unit.
    expect(metric.has(kilopascal)).toBe(true);
    expect(metric.has(kilowatt)).toBe(true);
  });

  it("tags the customary units into imperial and US customary", () => {
    for (const unit of [squareFoot, acre, psi, horsepower, footCandle]) {
      expect(imperial.has(unit)).toBe(true);
      expect(usCustomary.has(unit)).toBe(true);
    }
    // …and keeps them out of metric.
    expect(metric.has(psi)).toBe(false);
    expect(metric.has(horsepower)).toBe(false);
  });

  it("leaves system-neutral units untagged", () => {
    // atmosphere belongs to no real-world standard, so no system claims it.
    expect(metric.has(atmosphere)).toBe(false);
    expect(imperial.has(atmosphere)).toBe(false);
    expect(usCustomary.has(atmosphere)).toBe(false);
  });

  it("lists and best-fit-expresses the new dimensions", () => {
    expect(metric.in(area)).toContain(squareMeter);
    expect(metric.in(pressure)).toContain(pascal);
    // express now works for a metric-only dimension.
    expect(metric.express(new Quantity(5000, hertz)).unit).toBe(kilohertz);
  });
});
