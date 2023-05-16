import * as nodemailer from "nodemailer";
import {initModels} from "../db/models/init-models";
import {sequelize} from "../db/sequelize";
import {decryptPassword} from "../common/encryption";
import SMTPTransport from "nodemailer/lib/smtp-transport";

class EmailService {

  async sendEmail({partner_id, receiverEmailAddress, attachments, attachmentName}: any, decodedToken: any) {
    const models = initModels(sequelize);

    const userId = decodedToken._id;

    const emailData = await models.UserPartnerEmail.findOne({
      where: {
        user_id: userId,
        partner_id: partner_id
      }
    });

    const auth = {
      user: emailData.partner_email,
      pass: await decryptPassword(emailData.password),
    }

    const transporter = nodemailer.createTransport({
      "host": emailData.smtp,
      port: 465,
      secure: true,
      auth
    } as SMTPTransport.Options);

    try {
      await transporter.sendMail({
        from: emailData.partner_email,
        to: receiverEmailAddress,
        subject: 'Documentul emis',
        html: `
        <p>Buna ziua,</p>
        <p>Atasat gasiti documentul emis.</p>
        <br/>
        <p>Toate cele bune,</p>
        <p>Echipa Abvsoft</p>
      `,
        attachments: [
          {
            path: attachments,
            filename: attachmentName
          }
        ]
      });

      return {code: 200, message: 'Mailul a fost trimis'}
    } catch (error) {
      console.error(error);
      return {code: 500, message: 'Ooops! Ceva nu a functionat!'}
    }
  }
}

export default new EmailService();