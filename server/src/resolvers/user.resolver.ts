import { User } from '../entity/User';
import { hash, compare } from 'bcryptjs';
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MyContext } from '../declartion';
import { createAccessToken, createRefeshToken, isAuth, setTokenInCookie } from '../helpers/auth';
import { getConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';

@ObjectType()
class LoginResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {

  @Query(() => String)
  hello() {
    return 'hi'
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { paylod }: MyContext) {
    return `your user id is ${paylod?.userId}`
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return User.findOne(payload.userId);
    } catch (err) {
      console.log(err);
      return null;
    }
  }


  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Arg('userId', () => Int) userId: number
  ) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1)
    return true;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ) {
    const hashPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashPassword
      })
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    setTokenInCookie(res, "");

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ) : Promise<LoginResponse> {

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Counld not find user")
    }

    const isValid = compare(password, user.password);

    if (!isValid) {
      throw new Error("Bad password")
    }


    setTokenInCookie(res, createRefeshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    }
  }
} 