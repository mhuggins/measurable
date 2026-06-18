import { describe, expect, it } from "vitest";

import { Quantity } from "../src";
import { acre, area, squareFoot, squareMeter } from "../src/dimensions/area";
import { joule } from "../src/dimensions/energy";
import { hertz, kilohertz } from "../src/dimensions/frequency";
import { footCandle, lux } from "../src/dimensions/illuminance";
import { foot, length, meter, mile } from "../src/dimensions/length";
import { candela } from "../src/dimensions/luminousIntensity";
import { kilogram, tonne } from "../src/dimensions/mass";
import { horsepower, kilowatt, watt } from "../src/dimensions/power";
import { atmosphere, kilopascal, pascal, pressure, psi } from "../src/dimensions/pressure";
import { imperial, metric, usCustomary } from "../src/systems";

describe("MeasurementSystem", () => {
  describe("membership", () => {
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

  describe("membership for the added dimensions", () => {
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
});
