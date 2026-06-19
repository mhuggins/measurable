/**
 * Thrown when a caller passes an invalid argument — an empty required list, a
 * value outside an allowed range, a wrong numeric type, and so on. Signals a
 * mistake in the calling code rather than a recoverable runtime condition.
 */
export class ArgumentError extends Error {}
