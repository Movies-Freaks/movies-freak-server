import VError from 'verror';

class SerializerError extends VError {}

export class MissingSchema extends SerializerError {
  constructor() {
    super('Schema has not been provided');
  }
}

export class InvalidField extends SerializerError {
  constructor(field) {
    super(`Invalid field ${field}`);
    
    this.field = field;
  } 
}

class Serializer {
  constructor(target) {
    this._target = target
  }

  static init(target) {
    return new Serializer(target);
  }

  addSchema(...args) {
    this._schema = new Schema();

    args.forEach((field) => {
      if (!(field instanceof Field)) {
        throw new InvalidField(field);
      }

      this._schema.addField(field);
    });

    return this;
  }

  fromJSON(data) {
    if (!this._schema) {
      throw new MissingSchema();
    }

    const result = {};

    this._schema.forEachField((field, options) => {
      const key = options.from || field;

      result[key] = data[field];
    });

    return new this._target(result);
  }

  toJSON(entity) {
    if (!this._schema) {
      throw new MissingSchema();
    }

    const result = {};

    this._schema.forEachField((field, options) => {
      const key = options.from || field;

      result[field] = entity[key];
    });

    return result;
  }
}

class Schema {
  constructor() {
    this._fields = [];
  }

  addField(field) {
    this[field.name] = field.options;

    this._fields.push(field.name);
  }

  forEachField(callback) {
    this._fields.forEach((field) => callback(field, this[field]));
  }
}

class Field {
  constructor(name, options = {}) {
    this.name = name;
    this.options = options;
  }
}

export function field(name, options = {}) {
  return new Field(name, options)
};

export default Serializer;