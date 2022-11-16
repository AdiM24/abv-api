import { Model, ModelStatic } from "sequelize";
import { MakeNullishOptional } from "sequelize/types/utils";

export async function addOrUpdate<
  T extends MakeNullishOptional<E["_creationAttributes"]>,
  E extends Model
>(
  value: T,
  condition: {},
  entity: ModelStatic<E>,
  updateCallback: Function = () => {}
) {
  try {
    const existingEntity = await entity.findOne({ where: condition });

    if (existingEntity) {
      updateCallback();
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
