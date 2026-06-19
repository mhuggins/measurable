/** Thrown when a string can't be parsed into a quantity (no magnitude/unit found). */
export class ParseError extends Error {
  constructor(input: string) {
    super(`Could not parse a quantity from "${input}"`);
  }
}
