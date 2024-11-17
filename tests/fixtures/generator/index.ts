import buildSchemaFaker from './buildSchemaFaker';
import { Json } from '../../../types/common';

import generateFixtures from './generate';
import { FixtureGeneratorRecipe, SchemaFaker, schemaFakerParams } from './types';

export default class FixturesGenerator {
  private schemas: Json;
  private schemaFaker: SchemaFaker

  constructor(schemas: Json, options: schemaFakerParams) {
    this.schemas = schemas;
    this.schemaFaker = buildSchemaFaker(options);
  }

  generate<T>(args: FixtureGeneratorRecipe) {
    return generateFixtures<T>(this.schemaFaker, this.schemas, args);
  }
}
