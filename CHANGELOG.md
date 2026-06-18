# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-18

This release makes conversions and quantity arithmetic **exact**. Magnitudes and
unit transforms are represented as exact rationals internally and only collapse
to a `number` at the edge, so `foot → inch` is exactly `12` (not
`12.000000000000002`) and chains and round trips no longer accumulate drift.

### Breaking

- **`Quantity.magnitude` is now a read-only getter** derived from the new
  `Quantity.rational`, rather than a writable field. Assigning to
  `quantity.magnitude` no longer works.
- **`Quantity` construction rejects non-finite magnitudes.**
  `new Quantity(Infinity, unit)` (or `NaN`) now throws instead of being accepted.
- **`Unit.toBase` / `Unit.fromBase` are methods, not function-valued fields.**
  Calling `unit.toBase(x)` is unchanged; holding an unbound reference such as
  `const f = unit.toBase` no longer works.
- **`Unit`'s constructor options changed shape** to a discriminated union
  (`{ linear }` vs `{ toBase, fromBase }`). Only affects code that calls
  `new Unit(...)` directly; the `Dimension` builder methods are unaffected.
- **Conversion results changed value.** Outputs are now exact, so values that
  previously carried floating-point error differ (e.g. `12.000000000000002` is
  now `12`). `Quantity` equality and comparison are now exact rational
  comparisons rather than float `===`, so quantities that are mathematically
  equal compare equal even across a conversion that previously drifted.
- **Requires Node >= 14** (declared via `engines`); the library now uses `bigint`.

### Added

- **`Rational`** — an exact rational number (`bigint` numerator/denominator),
  exported from the package root. Supports `plus`/`minus`/`times`/`dividedBy`
  (with `add`/`sub`/`mul`/`div` aliases), `negate`/`abs`, `equals`/`eq`,
  `compare`, `sign`, `toNumber`, and the static `Rational.from`.
- **`Quantity.rational`** exposes the exact magnitude; the constructor and
  `times`/`dividedBy` now accept `number | Rational`.
- **`Dimension.convertRational(value, from, to)`** — exact, rational-in /
  rational-out conversion.
- **`Unit.linear`** — the exact `{ scale, offset }` transform for linear and
  affine units (`undefined` for `custom` ones).
- **`Dimension.unit` and `Dimension.affine` accept `number | Rational`**, so a
  ratio a decimal cannot represent exactly (e.g. Fahrenheit's `5/9`) can be
  given exactly.
- New built-in dimensions: `area`, `data`, `energy`, `frequency`,
  `illuminance`, `luminance`, `luminousIntensity`, `power`, and `pressure`
  (each with its SI prefix ladder where applicable).
- `definePrefixed`'s reference `scale` is now optional, defaulting to `1`.

### Fixed

- Linear and affine conversions are now exact (`foot → inch` is `12`, `1 L → mL`
  round trips cleanly, and so on).
- SI-prefixed scales are computed in rational arithmetic, fixing drifted scales
  such as `nanowattHour` (`3600 × 1e-9`).
- Built-in Fahrenheit is defined with exact rationals and round-trips without
  drift in both directions.
- `Rational.toNumber` stays correctly rounded at extreme magnitudes (operands
  beyond `2^53`), where converting each operand to a double before dividing
  would otherwise lose precision.

## [1.1.1] - 2026-06-17

### Fixed

- Enable `embed-readme` so the README renders on npmjs.com.

## [1.1.0] - 2026-06-17

### Added

- SI metric prefix ladders generated across the metric dimensions.
- `Quantity` arithmetic — `plus` / `minus` / `times` / `dividedBy` (with
  `add` / `sub` / `mul` / `div` aliases).
- `Quantity` comparison — `equals` / `notEquals` / `lessThan` / `greaterThan` /
  `lessThanOrEqual` / `greaterThanOrEqual` (with `eq` / `ne` / `lt` / `gt` /
  `lte` / `gte` aliases), plus `compareTo` as a sort comparator.
- `Quantity.ratioTo` for the dimensionless ratio between two quantities.
- `Quantity.abs` and the `Quantity.min` / `max` / `sum` statics.
- `clamp` as an instance method bounding a quantity to a range.
- `Quantity.toString`.
- `Quantity.isZero` / `isPositive` / `isNegative` predicates and `round`.

## [1.0.0] - 2026-06-16

### Added

- Initial release: the core conversion engine (`Dimension`, `Unit`, `Quantity`,
  `MeasurementSystem`), string parsing via `Quantity.parse`, and the first set
  of built-in dimensions and measurement systems.

[2.0.0]: https://github.com/mhuggins/measurable/compare/v1.1.1...v2.0.0
[1.1.1]: https://github.com/mhuggins/measurable/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/mhuggins/measurable/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/mhuggins/measurable/releases/tag/v1.0.0
