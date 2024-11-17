import { FieldOptions } from './types';

export default class Field {
  readonly name: string;
  readonly options: FieldOptions

  constructor(name: string, options: FieldOptions = {}) {
    this.name = name;
    this.options = options;
  }
}
