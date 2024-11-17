export class SerializerError extends Error {}

export class MissingSchemaError extends SerializerError {
  constructor() {
    super('Schema has not been provided');
  }
}
