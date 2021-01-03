import { sign, verify } from 'jsonwebtoken';
import { Response } from 'express';
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../declartion";
import { User } from "../entity/User";

export const createAccessToken = (user: User) => {
  return sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' }
  )
}

export const createRefeshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' }
  )
}

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new Error("not authenticated");
  }


  try {
    const token = (authorization as string).split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!)
    context.paylod = payload as any;
  } catch (error) {
    console.log(error);
    throw new Error("not authenticated");
  }

  return next();
}

export const setTokenInCookie = (res: Response, token: string) => {
  res.cookie('jid', token, { httpOnly: true })
}