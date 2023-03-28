import bcrypt from "bcrypt";
import {createCipheriv} from "crypto";
import * as crypto from "crypto";

const algorithm = 'aes-256-cbc';
const key = crypto
  .createHash('sha512')
  .update(process.env["ENC_KEY"])
  .digest('hex')
  .substring(0, 32);
const iv = crypto
  .createHash('sha512')
  .update(process.env["ENC_IV"])
  .digest('hex')
  .substring(0, 16);

export const cryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (inputPassword: string, userPassword: string) => {
  return await bcrypt.compare(inputPassword, userPassword);
};

export const encryptPassword = async (password: string) => {
  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString('hex');
}

export const decryptPassword = async (password: any) => {
  const encryptedText = Buffer.from(password, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}