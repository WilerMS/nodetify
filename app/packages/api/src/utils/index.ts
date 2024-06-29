export * from './withErrorHandling'
export * from './delay'

export function sql (strings: TemplateStringsArray, ...values: any[]): string {
  return strings
    .map((string, i) => string + (values[i] || ''))
    .join('')
}
