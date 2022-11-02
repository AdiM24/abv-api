import bcrypt from "bcrypt";

export const cryptPassword = async (password: string) => {
   const salt = await bcrypt.genSalt(10);

   return await bcrypt.hash(password, salt);
};

export const comparePassword = async(inputPassword: string, userPassword: string) => {
    return await bcrypt.compare(inputPassword, userPassword);
};