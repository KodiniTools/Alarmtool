let counter = 0

/**
 * Returns a document-unique id for aria wiring.
 * (Vue's useId() would need Vue 3.5; the package allows 3.4.)
 * @param {string} prefix
 */
export function uniqueId(prefix) {
  counter += 1
  return `${prefix}-${counter}`
}
