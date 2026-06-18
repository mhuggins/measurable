import { describe, expect, it } from "vitest";

import { Quantity } from "../src";
import {
  decameter,
  decimeter,
  hectometer,
  kilometer,
  length,
  meter,
  micrometer,
} from "../src/dimensions/length";
import { gram, kilogram, megagram, milligram } from "../src/dimensions/mass";
import { volume } from "../src/dimensions/volume";
import { metric } from "../src/systems";

describe("definePrefixed", () => {
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
