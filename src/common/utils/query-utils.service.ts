import {Op} from "sequelize";

export const getDateRangeQuery = (rangeValueFrom: any, rangeValueTo: any) => {
  const rangeFilter = {} as any;

  if (rangeValueFrom) rangeFilter[Op.gte] = new Date(rangeValueFrom).toUTCString();

  if (rangeValueTo) rangeFilter[Op.lte] = new Date(rangeValueTo).toUTCString();

  return rangeFilter;
};

export const getLikeQuery = (searchString: string) => {
  if (!searchString) return;

  const iLikeQuery = {} as any;

  iLikeQuery[Op.iLike] = `%${searchString}%`;

  return iLikeQuery;
};

export const getStrictQuery = (searchString: string | number) => {
  if (!searchString) return;

  const strictQuery = {} as any;

  strictQuery[Op.eq] = searchString;

  return strictQuery;
}

export const getInQuery = (searchArray: any[]) => {
  if (!searchArray?.length) return;

  const inQuery = {} as any;

  inQuery[Op.in] = searchArray;

  return inQuery;
}