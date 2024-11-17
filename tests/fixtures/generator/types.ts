import { JSONSchemaFaker } from 'json-schema-faker';

import buildSchemaFaker from './buildSchemaFaker';
import { Json } from '../../../types/common';

export type schemaFakerParams = {
  optionalsProbability?: number,
  failOnInvalidTypes?: boolean
}

export type FixtureGeneratorRecipe = {
  type: string,
  recipe?: Json[],
  quantity?: number
}

export type SchemaFaker = typeof JSONSchemaFaker;
export type BuildFakeSchema = typeof buildSchemaFaker;
