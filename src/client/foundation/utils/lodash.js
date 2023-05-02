export function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

export function without(array, value) {
  return array.filter((item) => value !== item);
}

export function difference(arr, values) {
  const valuesSet = new Set(values);
  return arr.filter((value) => !valuesSet.has(value));
}
