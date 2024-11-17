import { get, set } from 'lodash';

import Field from './field';
import { EachFieldCallback } from './types';

export default class Schema {
  private fields: string[];

  constructor() {
    this.fields = [];
  }

  copyFromSchema(schema: Schema) {
    schema.getFields()
      .forEach((field: Field) => this.addField(field));
  }

  addField(field: Field) {
    set(this, field.name, field.options);

    this.fields.push(field.name);
  }

  getFields() {
    return this.fields.map((fieldName: string) => {
      return new Field(fieldName, get(this, fieldName));
    });
  }

  forEachField(fn: EachFieldCallback) {
    this.fields.forEach((field: string) => fn(field, get(this, field)));
  }
}
