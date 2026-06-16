# measurable

Convert between units of measurement, with batteries-included common units and
first-class support for defining your own.

- **No drift** — each unit defines a single transform to its dimension's base
  unit; reverse conversions are derived, never stored, so they can't fall out of
  sync.
- **Free chaining** — any unit converts to any other in the same dimension
  (e.g. `mile → inch`) without you defining every pair.
- **Affine units** — temperature scales (°C/°F/K) and anything else needing an
  offset, not just a scale factor.
- **Two orthogonal ideas** — a **dimension** decides what _can_ convert; a
  **measurement system** (metric/imperial/US) is a tag that never gates
  conversion but powers filtering, formatting, and parse disambiguation.

## Installation

```sh
npm install measurable
```

## Entry points

The package is split into three import paths so the core stays lean:

| Import                     | What you get                                                              |
| -------------------------- | ------------------------------------------------------------------------- |
| `measurable`             | The building blocks: `Quantity`, `Dimension`, `MeasurementSystem`, `Unit`, errors |
| `measurable/dimensions`  | Predefined dimensions and their units (`length`, `meter`, `volume`, …)    |
| `measurable/systems`     | Predefined measurement systems (`metric`, `imperial`, `usCustomary`)      |

## Quick start

```ts
import { Quantity } from "measurable";
import { meter, mile, celsius, fahrenheit } from "measurable/dimensions";

// Convert: `.to()` returns a Quantity, `.in()` returns a raw number.
new Quantity(5, mile).to(meter).magnitude; // 8046.72
new Quantity(5, mile).in(meter);           // 8046.72

// Affine scales work the same way.
new Quantity(100, celsius).in(fahrenheit); // 212
```

## Concepts

- **`Dimension`** — a kind of measurable quantity (length, volume, mass, …). It
  owns a canonical **base unit** and is where all conversion happens. A unit
  belongs to exactly one dimension.
- **`Unit`** — a name plus a transform (`toBase` / `fromBase`) into its
  dimension's base unit. Created through a dimension's builder methods.
- **`Quantity`** — a magnitude paired with a unit (e.g. `5 kilometer`).
- **`MeasurementSystem`** — a cross-dimension tag (metric/imperial/…). A unit can
  belong to many; membership is optional and never affects whether a conversion
  is allowed.

## Built-in dimensions

Import any dimension or unit from `measurable/dimensions`:

| Dimension     | Base       | Units (a selection)                                                                 |
| ------------- | ---------- | ----------------------------------------------------------------------------------- |
| `length`      | `meter`    | `kilometer`, `centimeter`, `millimeter`, `inch`, `foot`, `yard`, `mile`             |
| `volume`      | `liter`    | `milliliter`, `us*`/`imperial*` `Gallon`/`Quart`/`Pint`/`Gill`/`FluidOunce`, `cup`, `tablespoon`, `teaspoon` |
| `mass`        | `kilogram` | `gram`, `milligram`, `tonne`, `pound`, `ounce`, `stone`, `shortTon`, `longTon`      |
| `time`        | `second`   | `millisecond`, `minute`, `hour`, `day`, `week`                                      |
| `temperature` | `kelvin`   | `celsius`, `fahrenheit`                                                              |
| `angle`       | `radian`   | `degree`, `gradian`, `turn`                                                          |
| `force`       | `newton`   | `kilonewton`, `dyne`, `poundForce`, `kilogramForce`                                  |

## Built-in measurement systems

Import `metric`, `imperial`, or `usCustomary` from `measurable/systems`.

```ts
import { foot } from "measurable/dimensions";
import { imperial, usCustomary, metric } from "measurable/systems";

imperial.has(foot);      // true  — a unit can belong to several systems
usCustomary.has(foot);   // true
metric.has(foot);        // false
```

### Listing units in a system

```ts
import { length } from "measurable/dimensions";
import { metric } from "measurable/systems";

metric.in(length).map((u) => u.name); // ["meter", "kilometer", "centimeter", "millimeter"]
```

### Best-fit formatting

`express` re-expresses a quantity in a system's most readable unit (the largest
unit whose magnitude is still ≥ 1):

```ts
import { Quantity } from "measurable";
import { meter } from "measurable/dimensions";
import { metric, imperial } from "measurable/systems";

metric.express(new Quantity(5000, meter));    // Quantity(5, kilometer)
imperial.express(new Quantity(5000, meter));  // Quantity(3.107…, mile)
```

## Parsing strings

`Quantity.parse(input, dimension, options?)` reads a string into a `Quantity`.
Compound inputs are summed and returned in the finest unit present:

```ts
import { Quantity } from "measurable";
import { length, time } from "measurable/dimensions";

Quantity.parse("1km", length);         // Quantity(1, kilometer)
Quantity.parse("5 hr", time);          // Quantity(5, hour)
Quantity.parse("5hr 20min", time);     // Quantity(320, minute)
```

### Ambiguous aliases

Some names mean different things in different systems — a US gallon (3.785 L) is
not an imperial gallon (4.546 L), and `ton` could be short or long. These are
distinct units that share an alias, so an unqualified parse throws; pass a
`prefer`red system to disambiguate:

```ts
import { Quantity, AmbiguousUnitError } from "measurable";
import { volume, mass } from "measurable/dimensions";
import { usCustomary, imperial } from "measurable/systems";

Quantity.parse("1 gallon", volume);                                    // throws AmbiguousUnitError
Quantity.parse("1 gallon", volume, { prefer: usCustomary }).unit.name; // "usGallon"
Quantity.parse("1 ton", mass, { prefer: imperial }).unit.name;         // "longTon"
```

Conversion itself is governed only by the dimension, so cross-system conversions
always work regardless of tags:

```ts
import { shortTon, tonne } from "measurable/dimensions";

new Quantity(1, shortTon).in(tonne); // 0.90718474
```

## Defining your own units

Create a `Dimension` and add units through its builder methods. `scale` is how
many base units make up one of the unit being defined.

```ts
import { Dimension, Quantity } from "measurable";

const data = new Dimension("data");
const byte = data.base("byte", ["B", "bytes"]); // the base unit (identity)
const kilobyte = data.unit("kilobyte", 1024, ["KB"]);
const megabyte = data.unit("megabyte", 1024 ** 2, ["MB"]);

new Quantity(2, megabyte).in(kilobyte); // 2048
```

### Affine units (offset, not just scale)

```ts
const temperature = new Dimension("temperature");
const kelvin = temperature.base("kelvin", ["K"]);
// value_in_base = value * scale + offset
const celsius = temperature.affine("celsius", { scale: 1, offset: 273.15 }, ["C"]);
```

### Fully custom transforms

For anything non-linear, provide an explicit inverse pair:

```ts
const dim = new Dimension("custom");
dim.base("base");
dim.custom("squared", {
  toBase: (x) => x * x,
  fromBase: (x) => Math.sqrt(x),
});
```

### Tagging units into a measurement system

```ts
import { MeasurementSystem } from "measurable";

const si = new MeasurementSystem("si").add(byte, kilobyte, megabyte);
si.has(kilobyte); // true
```

## API reference

### `Dimension`

- `new Dimension(name)`
- `.base(name, aliases?)` — define the canonical base unit
- `.unit(name, scale, aliases?)` — linear unit (`scale` base units per unit)
- `.affine(name, { scale, offset }, aliases?)` — linear with additive offset
- `.custom(name, { toBase, fromBase }, aliases?)` — arbitrary inverse pair
- `.convert(value, from, to)` — convert a raw number between two of its units
- `.get(token)` — units matching a name/alias (`Unit[] | undefined`)
- `.has(unit)`, `.units`, `.baseUnit`

### `Unit`

A passive handle, normally created via a dimension's builder methods rather than
`new Unit` directly. Read-only properties:

- `.name` — the unit's canonical name
- `.dimension` — the `Dimension` it belongs to
- `.toBase(value)` → `number` — convert a value in this unit to base units
- `.fromBase(value)` → `number` — convert a value in base units to this unit

### `Quantity`

- `new Quantity(magnitude, unit)`
- `.to(target)` → `Quantity`
- `.in(target)` → `number`
- `Quantity.parse(input, dimension, { prefer? })` → `Quantity`

### `MeasurementSystem`

- `new MeasurementSystem(name)`
- `.add(...units)`, `.has(unit)`
- `.in(dimension)` → `Unit[]`
- `.express(quantity)` → `Quantity`

### Errors

- `InvalidConversionError` — units are from different dimensions
- `UnknownUnitError` — a parsed token matches no unit
- `AmbiguousUnitError` — a parsed token matches several units and no `prefer` was given

## License

ISC
