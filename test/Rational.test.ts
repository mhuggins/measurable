import { describe, expect, it } from "vitest";

import { Rational } from "../src";

describe("Rational", () => {
  describe("construction", () => {
    it("stores integers as a numerator over a denominator of 1", () => {
      const r = new Rational(5);
      expect([r.n, r.d]).toEqual([5n, 1n]);
    });

    it("accepts bigint and number arguments interchangeably", () => {
      expect(new Rational(3n, 4n).equals(new Rational(3, 4))).toBe(true);
    });

    it("reduces to lowest terms", () => {
      const r = new Rational(2, 4);
      expect([r.n, r.d]).toEqual([1n, 2n]);
    });

    it("normalizes a negative denominator onto the numerator", () => {
      const r = new Rational(1, -2);
      expect([r.n, r.d]).toEqual([-1n, 2n]);
    });

    it("throws on a zero denominator", () => {
      expect(() => new Rational(1, 0)).toThrow();
    });

    it("throws on a non-integer number argument", () => {
      expect(() => new Rational(0.5)).toThrow();
    });
  });

  describe("from", () => {
    it("returns a Rational argument's value unchanged", () => {
      const r = new Rational(5, 9);
      expect(Rational.from(r).equals(r)).toBe(true);
    });

    it("recovers the exact terminating decimal a number was written as", () => {
      const r = Rational.from(0.0254);
      expect([r.n, r.d]).toEqual([127n, 5000n]); // 254/10000 reduced
    });

    it("handles scientific notation exactly", () => {
      const r = Rational.from(1e-9);
      expect([r.n, r.d]).toEqual([1n, 1000000000n]);
    });

    it("throws on a non-finite number", () => {
      expect(() => Rational.from(Number.POSITIVE_INFINITY)).toThrow();
      expect(() => Rational.from(Number.NaN)).toThrow();
    });
  });

  describe("arithmetic", () => {
    it("adds", () => {
      expect(new Rational(1, 2).plus(new Rational(1, 3)).equals(new Rational(5, 6))).toBe(true);
    });

    it("subtracts", () => {
      expect(new Rational(1, 2).minus(new Rational(1, 3)).equals(new Rational(1, 6))).toBe(true);
    });

    it("multiplies", () => {
      expect(new Rational(2, 3).times(new Rational(3, 4)).equals(new Rational(1, 2))).toBe(true);
    });

    it("divides", () => {
      expect(new Rational(1, 2).dividedBy(new Rational(3, 4)).equals(new Rational(2, 3))).toBe(
        true,
      );
    });

    it("inverts exactly: (5/9) * (9/5) === 1", () => {
      expect(new Rational(5, 9).times(new Rational(9, 5)).equals(new Rational(1))).toBe(true);
    });

    it("negates and takes absolute value", () => {
      expect(new Rational(3, 4).negate().equals(new Rational(-3, 4))).toBe(true);
      expect(new Rational(-3, 4).abs().equals(new Rational(3, 4))).toBe(true);
    });

    it("exposes add/sub/mul/div aliases", () => {
      const a = new Rational(1, 2);
      const b = new Rational(1, 3);
      expect(a.add(b).equals(a.plus(b))).toBe(true);
      expect(a.sub(b).equals(a.minus(b))).toBe(true);
      expect(a.mul(b).equals(a.times(b))).toBe(true);
      expect(a.div(b).equals(a.dividedBy(b))).toBe(true);
    });
  });

  describe("comparison", () => {
    it("compares by value, not representation", () => {
      expect(new Rational(1, 2).equals(new Rational(2, 4))).toBe(true);
      expect(new Rational(1, 2).eq(new Rational(2, 4))).toBe(true);
    });

    it("orders with compare", () => {
      expect(new Rational(1, 3).compare(new Rational(1, 2))).toBe(-1);
      expect(new Rational(1, 2).compare(new Rational(1, 3))).toBe(1);
      expect(new Rational(1, 2).compare(new Rational(2, 4))).toBe(0);
    });

    it("orders negatives correctly", () => {
      expect(new Rational(-1, 2).compare(new Rational(1, 2))).toBe(-1);
    });

    it("reports sign", () => {
      expect(new Rational(-3, 4).sign()).toBe(-1);
      expect(new Rational(0).sign()).toBe(0);
      expect(new Rational(3, 4).sign()).toBe(1);
    });
  });

  describe("toNumber", () => {
    it("collapses ordinary values", () => {
      expect(new Rational(1, 4).toNumber()).toBe(0.25);
      expect(new Rational(3).toNumber()).toBe(3);
      expect(new Rational(-1, 2).toNumber()).toBe(-0.5);
    });

    it("stays precise at extreme magnitudes (operands beyond 2^53)", () => {
      // Denominator 10^24 far exceeds 2^53, so Number(n)/Number(d) would round
      // each operand first; the long-division path stays correctly rounded.
      expect(new Rational(1n, 10n ** 24n).toNumber()).toBe(1e-24);
      expect(new Rational(-1n, 10n ** 24n).toNumber()).toBe(-1e-24);
      expect(new Rational(10n ** 24n).toNumber()).toBe(1e24);
      expect(new Rational(3n, 10n ** 30n).toNumber()).toBe(3e-30);
    });

    it("rounds a value below the ULP back to the nearest double", () => {
      // 1 + 10^-25 is closer to 1 than to any other double.
      expect(new Rational(10n ** 25n + 1n, 10n ** 25n).toNumber()).toBe(1);
    });

    it("round-trips through from for terminating decimals", () => {
      for (const value of [0.1, 0.0254, 1.609344, 745.699872, 1e-6]) {
        expect(Rational.from(value).toNumber()).toBe(value);
      }
    });
  });
});
