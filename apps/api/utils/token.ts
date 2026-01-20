import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const saltRounds = 14;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  const status: Boolean = await bcrypt.compare(password, hashedPassword);
  return status;
};

export const createToken = async (id: string) => {
  return JWT.sign(id, process.env.JWT_SECRET as string);
};

export const decodeToken = async (token: string) => {
  return JWT.verify(token, process.env.JWT_SECRET as string);
};

export const createOrgToken = async (orgId: string) => {
  return JWT.sign(orgId, process.env.JWT_ORG_SECRET as string);
};

export const decodeOrgToken = async (token: string) => {
  return JWT.verify(token, process.env.JWT_ORG_SECRET as string);
};

export const createEnggToken = async (enggId: string) => {
  return JWT.sign(enggId, process.env.JWT_ENGG_SECRET as string);
};

export const decodeEnggToken = async (token: string) => {
  return JWT.verify(token, process.env.JWT_ENGG_SECRET as string);
};
