import { Json, SpecificJson } from 'types';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export type Sort = SpecificJson<SortOrder>;

export type Query = {
  filter?: Json,
  sort?: Sort
};
