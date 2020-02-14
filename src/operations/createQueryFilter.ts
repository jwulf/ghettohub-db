export function createQueryFilter<T>(
  query: Partial<T>
): (value: any) => boolean {
  return (value: T) => {
    return Object.keys(query)
      .map(key => (value as any)[key] === (query as any)[key])
      .reduce((prev, current) => prev && current, true)
  }
}
