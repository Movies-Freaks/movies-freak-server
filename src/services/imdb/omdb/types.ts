import { IMDBType } from '../types';

export type IMDBQuery = {
  i: string;
  type: IMDBType;
  Season?: number;
};
