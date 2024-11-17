import { isArray, isNil, isUndefined, mergeWith } from 'lodash';

import replaceFormats from './replaceFormats';
import validateFixture from './validateFixture';
import { FixtureGeneratorRecipe, SchemaFaker } from './types';
import { FixtureSchemaNotSet } from './errors';
import { Json } from '../../../types/common';

function getRecipes(params: FixtureGeneratorRecipe): Json[] {
  const {
    quantity = 0,
    recipe = []
  } = params;

  const initalLength = recipe.length;
  const actualLength = Math.max(quantity, initalLength);

  return [
    ...recipe,
    ...Array(actualLength)
  ]
    .slice(0, actualLength)
    .map((item) => isNil(item) ? {} : item);
}

async function generateSingleFixture<T>(schemaFaker: SchemaFaker, schema: Json, recipe: Json) {
  const fakeSchema = await schemaFaker.resolve(schema);
  const base = replaceFormats(fakeSchema);

  const fixture = mergeWith(
    {},
    base,
    recipe,
    (_baseValue: any, recipeValue: any, key: string, object: Json) => {
      if (isArray(recipeValue)) {
        return recipeValue;
      }

      if (isUndefined(recipeValue)) {
        object[key] = undefined;
      }
  });

  return validateFixture<T>(schema, fixture);
}

export default function generateFixtures<T>(
  schemaFaker: SchemaFaker,
  schemas: Json,
  params: FixtureGeneratorRecipe
) {
  const { type } = params;
  const schema = schemas[type];

  if (!schema) {
    throw new FixtureSchemaNotSet(type);
  }

  return Promise.all(
    getRecipes(params)
      .map((recipe) => generateSingleFixture<T>(schemaFaker, schema, recipe))
  );
}
