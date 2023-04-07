import {Model, ModelStatic} from "sequelize";
import {MakeNullishOptional} from "sequelize/types/utils";

export async function addOrUpdate<T extends MakeNullishOptional<E["_creationAttributes"]>,
  E extends Model>(
  value: T,
  condition: any,
  entity: ModelStatic<E>,
  updateCallback?: () => void
) {
  try {
    let existingEntity: E;
    if (Object.values(condition).some((val) => val === undefined)) {
      existingEntity = undefined
    } else {
      existingEntity = await entity.findOne({where: condition});
    }

    if (existingEntity) {
      if (updateCallback) updateCallback();
      await existingEntity.update(value);
      return existingEntity;
    } else {
      const newEntity = await entity.create(value);
      return newEntity;
    }
  } catch (err) {
    console.error(`Error during execution: ${err}`);
  }
}

export function convertToUtc(date: Date) {
  return new Date(date.toISOString());
}

export function calculatePercentage(number: number, percentage: number) {
  return parseFloat((number + ((percentage / 100) * number)).toFixed(2));
}

export function reversePercentage(total: number, percentage: number) {
  return parseFloat(((total * 100) / (percentage + 100)).toFixed(2));
}
