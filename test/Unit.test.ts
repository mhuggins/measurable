import { describe, expect, it } from "vitest";

import { Quantity } from "../src";
import { joule, kilowattHour } from "../src/dimensions/energy";
import { kilometer, length } from "../src/dimensions/length";
import { gram, mass } from "../src/dimensions/mass";
import { celsius } from "../src/dimensions/temperature";

describe("Unit symbol/plural", () => {
  it("stores symbol and plural as first-class data", () => {
    expect(gram.symbol).toBe("g");
    expect(gram.plural).toBe("grams");
    expect(celsius.symbol).toBe("°C");
  });

  it("derives symbol/plural/scale for definePrefixed units from the reference unit", () => {
    expect(kilometer.symbol).toBe("km");
    expect(kilometer.plural).toBe("kilometers");
    // metricWattHour derives scale from scaleOf(wattHour) — no explicit scale arg.
    expect(kilowattHour.symbol).toBe("kWh");
    expect(new Quantity(1, kilowattHour).in(joule)).toBeCloseTo(3.6e6, 1);
  });

  it("keeps symbol and plural parseable", () => {
    expect(Quantity.parse("5 g", mass).unit).toBe(gram);
    expect(Quantity.parse("5 grams", mass).unit).toBe(gram);
    expect(Quantity.parse("3 km", length).unit).toBe(kilometer);
    expect(Quantity.parse("3 kilometers", length).unit).toBe(kilometer);
  });

  it("does not double-list a unit among a token's candidates", () => {
    // gram registers name+symbol+plural; none collide, so "g" maps to exactly one.
    expect(mass.get("g")).toEqual([gram]);
    expect(mass.get("grams")).toEqual([gram]);
  });
});
