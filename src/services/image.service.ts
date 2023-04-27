import {sequelize} from "../db/sequelize";
import {ImageFiles, initModels} from "../db/models/init-models";
import {Transaction} from "sequelize";
import * as path from "path";

class ImageService {
  async getImageDetails(partner_id: number) {
    const models = initModels(sequelize);

    const existingLogo = models.PartnerImage.findOne({
      where: {
        partner_id: partner_id,
        type: 'LOGO'
      }
    });

    return existingLogo;
  }

  async getImage(imageInfo: any) {
    const models = initModels(sequelize);

    const partnerImage = await models.PartnerImage.findOne({
      where: {
        partner_id: imageInfo.partner_id,
        type: 'LOGO'
      },
      include: [{model: ImageFiles, as: "image"}]
    });

    const dirName = path.resolve();
    const fullFilePath = path.join(
      dirName,
      partnerImage.image.filepath
    );

    return {type: partnerImage.image.mimetype, image: fullFilePath};
  }

  async uploadImage(partnerInfo: any, image: any) {
    const models = initModels(sequelize);

    try {
      await sequelize.transaction(async (transaction: Transaction) => {
        const imageToUpload = {
          filename: image.filename,
          mimetype: image.mimetype,
          size: image.size,
          filepath: image.path
        }
        const createdImage = await models.ImageFiles.create(imageToUpload, {transaction: transaction});

        const partnerImage: { partner_id: number, image_id: number, type: 'LOGO' } = {
          partner_id: partnerInfo.partner_id,
          image_id: createdImage.id,
          type: 'LOGO'
        }

        await models.PartnerImage.create(partnerImage, {transaction: transaction});
      });

      return {code: 200, message: 'Imaginea a fost adaugata.'};
    } catch (err) {
      return {code: 500, message: 'Operatiunea nu a putut s-a putut finaliza.'}
    }

  }
}

export default new ImageService();