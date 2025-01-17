export function isObjectEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

export function isArrayEmpty(arr: []): boolean {
  return arr.length === 0;
}