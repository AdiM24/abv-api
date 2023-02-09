import {Op} from "sequelize";

export const getDateRangeQuery = (rangeValueFrom: any, rangeValueTo: any) => {
  const rangeFilter = {} as any;

  if (rangeValueFrom)
    rangeFilter[Op.gt] = new Date(rangeValueFrom).toUTCString();

  if (rangeValueTo) rangeFilter[Op.lt] = new Date(rangeValueTo).toUTCString();

  return rangeFilter;
};

export const getLikeQuery = (searchString: string) => {
  if (!searchString) return;

  const iLikeQuery = {} as any;

  iLikeQuery[Op.iLike] = `%${searchString}%`;

  return iLikeQuery;
};

export const getStrictQuery = (searchString: string) => {
  if (!searchString) return;

  const strictQuery = {} as any;

  strictQuery[Op.eq] = searchString;

  return strictQuery;
}
