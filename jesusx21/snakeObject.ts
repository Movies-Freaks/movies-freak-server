import { get, isArray, isPlainObject, set, snakeCase } from 'lodash';

export type Json = {
  [key: string]: any
};

const formatToSnake = (value: string | Json | any[]): any => {
  if (isPlainObject(value)) {
    return Object.keys(value)
      .reduce((prev, key) => {
        const val = get(value, key);
        set(prev, `${snakeCase(key)}`, formatToSnake(val))

        return prev;
      }, {});
  }

  if (isArray(value)) return value.map(formatToSnake);

  return value;
};

export function snakeObject(value: Json | Json[]): Json | Json[]  {
  return formatToSnake(value);
}
