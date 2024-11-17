import { SpecificJson } from 'types';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export type Sort = SpecificJson<SortOrder>;
