import Field from './field';
import Serializer from './serializer';
import { FieldOptions } from './types';

export * from './errors';
export { default as Schema } from './schema';
export default Serializer;

export {
  Field,
  FieldOptions,
  Serializer
};

export const field = (name: string, options: FieldOptions = {}) => {
  return new Field(name, options);
};
