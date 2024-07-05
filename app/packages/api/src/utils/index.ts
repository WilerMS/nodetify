export * from './withErrorHandling'
export * from './delay'
export * from './logger'

export function sql (strings: TemplateStringsArray, ...values: any[]): string {
  return strings
    .map((string, i) => string + (values[i] || ''))
    .join('')
}
