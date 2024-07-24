export * from './withErrorHandling'
export * from './logger'
export * from './crypto'

/**
 * Delays the execution of the code for a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to delay execution.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 *
 * @example
 * // Delays execution for 2 seconds
 * delay(2000).then(() => {
 *   console.log('2 seconds have passed');
 * });
 */
export const delay = async (ms: number): Promise<void> => {
  return await new Promise(resolve => setTimeout(resolve, ms))
}

/**
  * Constructs a SQL query string from template strings and values.
 * This function is primarily used to enable SQL syntax highlighting
 * in editors that support tagged template literals, such as VSCode.
 *
 * @param {TemplateStringsArray} strings - The template strings array.
 * @param {...any} values - The values to be interpolated into the template strings.
 * @returns {string} The constructed SQL query string.
 *
 * @example
 * const query = sql`SELECT * FROM users WHERE name = John`;
 */
export function sql (strings: TemplateStringsArray, ...values: any[]): string {
  return strings
    .map((string, i) => string + (values[i] || ''))
    .join('')
}
