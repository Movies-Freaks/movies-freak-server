import {
  get,
  isEmpty,
  isNil,
  set,
} from 'lodash';

import Field from './field';
import Schema from './schema';
import { Class, FieldOptions, Json, OptionAs } from './types';
import { MissingSchemaError } from './errors';

export default class Serializer<T> {
  private schema: Schema;
  private target: Class;

  constructor(target: Class) {
    this.target = target;
  }

  static init<S>(target: Class) {
    return new Serializer<S>(target);
  }

  addSchema(...args: Field[]) {
    if (!this.schema) this.schema = new Schema();

    args.forEach((field: Field) => this.schema.addField(field));

    return this;
  }

  extends<S>(parentSerializer: Serializer<S>) {
    const { schema: parentSchema } = parentSerializer;

    this.schema = new Schema();
    this.schema.copyFromSchema(parentSchema);

    return this;
  }

  fromJson(data: Json): T {
    if (!this.schema) throw new MissingSchemaError();

    const result: Json = {};

    this.schema.forEachField((field: string, options: FieldOptions) => {
      const key = options.from ?? field;
      let value = get(data, field);

      if (!this.doesWhenOptionMatch(options.when, data)) return;

      if (!!options.withFormatter) {
        value = options.withFormatter.deserialize(value);
      }

      if (isNil(value)) set(result, key, value);
      else if (!!options.using) set(result, key, options.using.fromJson(value));
      else if (options.as === OptionAs.ARRAY) set(result, key, value?.split(','));
      else if (options.as === OptionAs.JSON) set(result, key, JSON.parse(value));
      else if (options.as === OptionAs.NUMBER) set(result, key, Number(value));
      else set(result, key, value);
    });

    return new this.target(result);
  }

  toJson(entity: T) {
    if (!this.schema) throw new MissingSchemaError();

    const result: Json = {};

    this.schema.forEachField((field: string, options: FieldOptions) => {
      const key = options.from || field;
      let value = get(entity, key);

      if (!this.doesWhenOptionMatch(options.when, entity)) return;

      if (!!options.withFormatter) {
        value = options.withFormatter.serialize(value);
      }

      if (isNil(value)) set(result, field, value);
      else if (!!options.using) set(result, field, options.using.toJson(value));
      else if (options.as === OptionAs.ARRAY) set(result, field, value.join(','));
      else if (options.as === OptionAs.JSON) set(result, field, JSON.stringify(value));
      else if (options.as === OptionAs.NUMBER) set(result, field, JSON.stringify(value));
      else set(result, field, value);
    });

    return result;
  }

  private doesWhenOptionMatch(whenOption: Json, data: Json) {
    if (isEmpty(whenOption)) return true;

    return Object.keys(whenOption)
      .reduce((prev, conditionalKey) => {
        return prev && data[conditionalKey] === whenOption[conditionalKey];
      }, true);
  }
}
