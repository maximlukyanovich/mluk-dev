/**
 * The structure of a JSON value with the leaves erased: objects keep their
 * keys, arrays their length, everything else becomes its type. Two locales
 * of the same content must have the same shape.
 */
export function jsonShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(jsonShape);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, jsonShape(item)]),
    );
  }
  return value === null ? "null" : typeof value;
}
