import { isPlainObject, isArray, isEmpty } from 'lodash';
import { validate } from 'jsonschema';

import { Json } from '../../../types/common';
import { SchemaValidationFails } from './errors';

const convertToString = (object: any) => JSON.parse(JSON.stringify(object));

function addOptions(schema: any, options: Json): Json {
  if (isArray(schema)) {
    return schema.map((item) => addOptions(item, options));
  }

  if (!isPlainObject(schema)) {
    return schema;
  }

  const parsedSchema: Json = Object.keys(schema)
    .reduce((response, key) => {
      return {
        ...response,
        [key]: addOptions(schema[key], options)
      };
    }, {});

  const newProperties: Json = options[schema.type] || {};

  return {
    ...newProperties,
    ...parsedSchema
  }
}

export default function validateFixture<T>(initialSchema: Json | Json[], fixture: T) {
  const options = {};
  const schemaOptionsByType = {
    object: { additionalProperties: false }
  };

  const instance = convertToString(fixture);
  const schema = addOptions(initialSchema, schemaOptionsByType);
  const validationResults = validate(instance, schema, options);

  if (!isEmpty(validationResults.errors)) {
    throw new SchemaValidationFails(validationResults);
  }

  return fixture;
}
