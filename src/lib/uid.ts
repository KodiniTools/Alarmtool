let counter = 0

/** Returns a document-unique id for aria wiring, e.g. "collapsible-3". */
export function uniqueId(prefix: string): string {
  counter += 1
  return `${prefix}-${counter}`
}
