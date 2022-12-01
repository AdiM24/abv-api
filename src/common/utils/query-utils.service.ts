import { Op } from "sequelize";

export const getDateRangeQuery = (rangeValueFrom: any, rangeValueTo: any) => {
  const rangeFilter = {} as any;

  if (rangeValueFrom)
    rangeFilter[Op.gt] = new Date(rangeValueFrom).toUTCString();

  if (rangeValueTo) rangeFilter[Op.lt] = new Date(rangeValueTo).toUTCString();

  return rangeFilter;
};

export const getLikeQuery = (searchString: string) => {
  const iLikeQuery = {} as any;

  if (searchString) iLikeQuery[Op.iLike] = `%${searchString}%`;

  return iLikeQuery;
};
